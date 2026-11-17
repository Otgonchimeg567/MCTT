"use server";

import { revalidatePath } from "next/cache";
import { requireMe } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getDb } from "@/lib/server/db";
import { dbError, fail, field, ok, optional, type ActionState } from "@/lib/work/action";
import { isRole } from "@/lib/work/labels";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readProfile(fd: FormData) {
  const role = field(fd, "role");
  return {
    full_name: field(fd, "full_name"),
    phone: optional(fd, "phone"),
    position: optional(fd, "position"),
    department_id: optional(fd, "department_id"),
    role: isRole(role) ? role : "employee",
  };
}

/** Creating a login needs the Auth admin API (secret key) — only after confirming the caller is an admin. */
export async function createEmployee(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireMe(["admin"]);
  const email = field(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");
  const profile = readProfile(fd);

  if (profile.full_name.length < 2) return fail("Ажилтны нэрийг оруулна уу.");
  if (!EMAIL.test(email)) return fail("Имэйл хаяг буруу байна.");
  if (password.length < 8) return fail("Түр нууц үг дор хаяж 8 тэмдэгт байна.");

  const admin = getDb();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: profile.full_name },
  });
  if (error || !data.user) {
    return fail(/already|registered|exists/i.test(error?.message ?? "") ? "Энэ имэйлтэй хэрэглэгч аль хэдийн бүртгэлтэй байна." : "Хэрэглэгч үүсгэж чадсангүй.");
  }

  const { error: upd } = await admin.from("profiles").update(profile).eq("id", data.user.id);
  if (upd) return fail(dbError(upd));
  // Every login also gets a personal file (HR records), linked to it.
  await admin.from("employees").insert({
    full_name: profile.full_name,
    phone: profile.phone,
    position: profile.position,
    department_id: profile.department_id,
    contact_email: email,
    profile_id: data.user.id,
  });

  revalidatePath("/admin/employees");
  return ok(`${profile.full_name} нэмэгдлээ. Түр нууц үгийг ажилтанд найдвартай замаар хүргээрэй.`);
}

export async function updateEmployee(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireMe(["admin"]);
  const id = field(fd, "id");
  const profile = readProfile(fd);
  if (profile.full_name.length < 2) return fail("Ажилтны нэрийг оруулна уу.");

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update(profile).eq("id", id);
  if (error) return fail(dbError(error));

  revalidatePath("/admin/employees");
  revalidatePath(`/admin/employees/${id}`);
  return ok("Хадгаллаа.");
}

/** Deactivating hides all data via RLS and also bans the login so existing sessions can't refresh. */
export async function setEmployeeActive(_: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireMe(["admin"]);
  const id = field(fd, "id");
  const active = field(fd, "active") === "true";
  if (id === me.id && !active) return fail("Өөрийгөө идэвхгүй болгох боломжгүй.");

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ is_active: active }).eq("id", id);
  if (error) return fail(dbError(error));

  const { error: banError } = await getDb().auth.admin.updateUserById(id, { ban_duration: active ? "none" : "876000h" });
  if (banError) return fail("Төлөв хадгалагдсан ч нэвтрэх эрхийг шинэчилж чадсангүй. Дахин оролдоно уу.");

  revalidatePath("/admin/employees");
  revalidatePath(`/admin/employees/${id}`);
  return ok(active ? "Идэвхжүүллээ." : "Идэвхгүй болголоо.");
}

export async function resetEmployeePassword(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireMe(["admin"]);
  const id = field(fd, "id");
  const password = String(fd.get("password") ?? "");
  if (password.length < 8) return fail("Нууц үг дор хаяж 8 тэмдэгт байна.");

  const { error } = await getDb().auth.admin.updateUserById(id, { password });
  if (error) return fail("Нууц үг солиход алдаа гарлаа.");
  return ok("Нууц үг солигдлоо.");
}
