// Creates (or resets) the first admin account from ADMIN_USER / ADMIN_PASSWORD in .env.local.
// Run: npm run bootstrap-admin
import { createClient } from "@supabase/supabase-js";

const { SUPABASE_URL, SUPABASE_SECRET_KEY, ADMIN_USER, ADMIN_PASSWORD } = process.env;
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY || !ADMIN_USER || !ADMIN_PASSWORD) {
  console.error("Set SUPABASE_URL, SUPABASE_SECRET_KEY, ADMIN_USER and ADMIN_PASSWORD in .env.local first.");
  process.exit(1);
}
if (ADMIN_PASSWORD.length < 8) {
  console.error("ADMIN_PASSWORD must be at least 8 characters.");
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const email = ADMIN_USER.trim().toLowerCase();

let userId;
const created = await admin.auth.admin.createUser({
  email,
  password: ADMIN_PASSWORD,
  email_confirm: true,
  user_metadata: { full_name: "Админ" },
});
if (created.error) {
  const { data: list, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (error) throw error;
  const existing = list.users.find((u) => u.email?.toLowerCase() === email);
  if (!existing) throw created.error;
  userId = existing.id;
  const { error: upd } = await admin.auth.admin.updateUserById(userId, { password: ADMIN_PASSWORD, ban_duration: "none" });
  if (upd) throw upd;
} else {
  userId = created.data.user.id;
}

const { error: roleError } = await admin.from("profiles").update({ role: "admin", is_active: true }).eq("id", userId);
if (roleError) throw roleError;

console.log(`Admin ready: ${email}`);
