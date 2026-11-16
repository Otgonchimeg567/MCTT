"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fail, field, type ActionState } from "@/lib/work/action";

/** Only same-site paths under /admin, so `next` can't become an open redirect. */
function safeNext(v: string) {
  return v.startsWith("/admin") && !v.startsWith("//") && !v.startsWith("/admin/login") ? v : "/admin";
}

export async function signIn(_: ActionState, fd: FormData): Promise<ActionState> {
  const email = field(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");
  if (!email || !password) return fail("Имэйл болон нууц үгээ оруулна уу.");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    if (error?.code === "user_banned") return fail("Таны эрх идэвхгүй байна. Админтай холбогдоно уу.");
    return fail("Имэйл эсвэл нууц үг буруу байна.");
  }

  const { data: profile } = await supabase.from("profiles").select("is_active").eq("id", data.user.id).maybeSingle();
  if (!profile?.is_active) {
    await supabase.auth.signOut();
    return fail("Таны эрх идэвхгүй байна. Админтай холбогдоно уу.");
  }

  redirect(safeNext(field(fd, "next")));
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
