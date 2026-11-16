"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireMe } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { dbError, fail, field, ok, optional, type ActionState } from "@/lib/work/action";
import { isPriority, isTaskStatus } from "@/lib/work/labels";
import { isISODate } from "@/lib/work/format";

function read(fd: FormData): { error: string } | { values: Record<string, unknown> } {
  const title = field(fd, "title");
  const start = field(fd, "start_date");
  const due = field(fd, "due_date");
  const status = field(fd, "status");
  const priority = field(fd, "priority");
  if (!title) return { error: "Даалгаврын нэрийг оруулна уу." };
  if ((start && !isISODate(start)) || (due && !isISODate(due))) return { error: "Огноо буруу байна." };
  if (start && due && due < start) return { error: "Дуусах огноо эхлэх огнооноос өмнө байж болохгүй." };
  return {
    values: {
      title,
      description: optional(fd, "description"),
      assignee_id: optional(fd, "assignee_id"),
      start_date: start || null,
      due_date: due || null,
      status: isTaskStatus(status) ? status : "pending",
      priority: isPriority(priority) ? priority : "medium",
    },
  };
}

export async function createTask(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireMe(["admin", "manager"]);
  const r = read(fd);
  if ("error" in r) return fail(r.error);
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").insert(r.values);
  if (error) return fail(dbError(error));
  revalidatePath("/admin/tasks");
  return ok("Даалгавар үүслээ.");
}

export async function updateTask(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireMe(["admin", "manager"]);
  const r = read(fd);
  if ("error" in r) return fail(r.error);
  const id = field(fd, "id");
  const supabase = await createClient();
  const { data, error } = await supabase.from("tasks").update(r.values).eq("id", id).select("id");
  if (error) return fail(dbError(error));
  if (!data?.length) return fail("Танд энэ даалгаврыг засах эрх байхгүй.");
  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${id}`);
  return ok("Хадгаллаа.");
}

/** Status-only change: allowed for the assignee too (the DB trigger blocks anything else for them). */
export async function setTaskStatus(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireMe();
  const id = field(fd, "id");
  const status = field(fd, "status");
  if (!isTaskStatus(status)) return fail("Төлөв буруу байна.");
  const supabase = await createClient();
  const { data, error } = await supabase.from("tasks").update({ status }).eq("id", id).select("id");
  if (error) return fail(dbError(error));
  if (!data?.length) return fail("Танд энэ даалгаврыг шинэчлэх эрх байхгүй.");
  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${id}`);
  revalidatePath("/admin");
  return ok("Төлөв шинэчлэгдлээ.");
}

export async function deleteTask(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireMe(["admin", "manager"]);
  const supabase = await createClient();
  const { data, error } = await supabase.from("tasks").delete().eq("id", field(fd, "id")).select("id");
  if (error) return fail(dbError(error));
  if (!data?.length) return fail("Танд энэ даалгаврыг устгах эрх байхгүй.");
  revalidatePath("/admin/tasks");
  redirect("/admin/tasks");
}
