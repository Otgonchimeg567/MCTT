"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireMe } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { dbError, fail, field, ok, optional, type ActionState } from "@/lib/work/action";
import { isLogStatus } from "@/lib/work/labels";
import { isISODate, todayISO } from "@/lib/work/format";

function read(fd: FormData): { error: string } | { values: Record<string, unknown> } {
  const title = field(fd, "title");
  const date = field(fd, "log_date") || todayISO();
  const hours = Number(field(fd, "hours") || 0);
  const status = field(fd, "status");
  if (title.length < 1) return { error: "Ажлын нэрийг оруулна уу." };
  if (!isISODate(date)) return { error: "Огноо буруу байна." };
  if (!Number.isFinite(hours) || hours < 0 || hours > 24) return { error: "Цаг 0–24 хооронд байна." };
  return {
    values: {
      title,
      log_date: date,
      hours,
      status: isLogStatus(status) ? status : "done",
      description: optional(fd, "description"),
      note: optional(fd, "note"),
    },
  };
}

export async function createWorkLog(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireMe();
  const r = read(fd);
  if ("error" in r) return fail(r.error);
  const supabase = await createClient();
  const { error } = await supabase.from("work_logs").insert(r.values);
  if (error) return fail(dbError(error));
  revalidatePath("/admin/work-logs");
  return ok("Бүртгэл нэмэгдлээ.");
}

export async function updateWorkLog(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireMe();
  const r = read(fd);
  if ("error" in r) return fail(r.error);
  const supabase = await createClient();
  const { data, error } = await supabase.from("work_logs").update(r.values).eq("id", field(fd, "id")).select("id");
  if (error) return fail(dbError(error));
  if (!data?.length) return fail("Танд энэ бүртгэлийг засах эрх байхгүй.");
  revalidatePath("/admin/work-logs");
  return ok("Хадгаллаа.");
}

export async function deleteWorkLog(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireMe();
  const supabase = await createClient();
  const { data, error } = await supabase.from("work_logs").delete().eq("id", field(fd, "id")).select("id");
  if (error) return fail(dbError(error));
  if (!data?.length) return fail("Танд энэ бүртгэлийг устгах эрх байхгүй.");
  revalidatePath("/admin/work-logs");
  if (field(fd, "back")) redirect("/admin/work-logs");
  return ok("Устгалаа.");
}
