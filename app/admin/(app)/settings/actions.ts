"use server";

import { revalidatePath } from "next/cache";
import { requireMe } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { dbError, fail, field, ok, optional, type ActionState } from "@/lib/work/action";

export async function updateMyProfile(_: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireMe();
  const full_name = field(fd, "full_name");
  if (full_name.length < 2) return fail("Нэрээ оруулна уу.");
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ full_name, phone: optional(fd, "phone") }).eq("id", me.id);
  if (error) return fail(dbError(error));
  revalidatePath("/admin", "layout");
  return ok("Хадгаллаа.");
}

export async function changeMyPassword(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireMe();
  const password = String(fd.get("password") ?? "");
  const confirm = String(fd.get("confirm") ?? "");
  if (password.length < 8) return fail("Нууц үг дор хаяж 8 тэмдэгт байна.");
  if (password !== confirm) return fail("Нууц үг таарахгүй байна.");
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return fail(error.code === "same_password" ? "Шинэ нууц үг хуучнаасаа өөр байх ёстой." : "Нууц үг солиход алдаа гарлаа.");
  return ok("Нууц үг солигдлоо.");
}

export async function createDepartment(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireMe(["admin"]);
  const name = field(fd, "name");
  if (!name) return fail("Хэлтсийн нэрийг оруулна уу.");
  const supabase = await createClient();
  const { error } = await supabase.from("departments").insert({ name });
  if (error) return fail(dbError(error));
  revalidatePath("/admin/settings");
  return ok("Хэлтэс нэмэгдлээ.");
}

export async function renameDepartment(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireMe(["admin"]);
  const name = field(fd, "name");
  if (!name) return fail("Хэлтсийн нэрийг оруулна уу.");
  const supabase = await createClient();
  const { error } = await supabase.from("departments").update({ name }).eq("id", field(fd, "id"));
  if (error) return fail(dbError(error));
  revalidatePath("/admin/settings");
  return ok("Хадгаллаа.");
}

export async function deleteDepartment(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireMe(["admin"]);
  const supabase = await createClient();
  const { error } = await supabase.from("departments").delete().eq("id", field(fd, "id"));
  if (error) return fail(dbError(error));
  revalidatePath("/admin/settings");
  return ok("Хэлтэс устгагдлаа.");
}
