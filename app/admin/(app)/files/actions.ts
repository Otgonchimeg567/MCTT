"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireMe } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { dbError, fail, field, ok, optional, type ActionState } from "@/lib/work/action";

const BUCKET = "work-files";
const MAX_BYTES = 50 * 1024 * 1024;

/** Storage keys must be ASCII; the original (e.g. Cyrillic) name is kept in files.name. */
function storageSafe(name: string) {
  const dot = name.lastIndexOf(".");
  const ext = dot > 0 ? name.slice(dot).replace(/[^A-Za-z0-9.]/g, "").slice(0, 12) : "";
  const base = (dot > 0 ? name.slice(0, dot) : name).replace(/[^A-Za-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 60);
  return `${base || "file"}${ext}`;
}

export type UploadMeta = {
  name: string;
  size: number;
  type: string;
  folderId: string | null;
  taskId: string | null;
  workLogId: string | null;
  project: string | null;
};

/**
 * Step 1 of an upload: create the metadata row (Storage read access goes through it) and a one-time signed
 * upload URL for "<my id>/<uuid>-<name>". Both run as the user, so RLS on files and storage.objects decides.
 * The browser then sends the bytes straight to Storage — they never pass through this server.
 */
export async function prepareUpload(meta: UploadMeta): Promise<{ ok: false; message: string } | { ok: true; id: string; signedUrl: string }> {
  const me = await requireMe();
  if (!meta.name || !(meta.size > 0)) return { ok: false, message: "Файлаа сонгоно уу." };
  if (meta.size > MAX_BYTES) return { ok: false, message: "Файлын хэмжээ 50 MB-аас ихгүй байна." };

  const path = `${me.id}/${randomUUID()}-${storageSafe(meta.name)}`;
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("files")
    .insert({
      name: meta.name.slice(0, 255),
      storage_path: path,
      mime_type: meta.type || null,
      size_bytes: Math.round(meta.size),
      folder_id: meta.folderId || null,
      task_id: meta.taskId || null,
      work_log_id: meta.workLogId || null,
      project: meta.project?.trim().slice(0, 120) || null,
    })
    .select("id")
    .single();
  if (error) return { ok: false, message: dbError(error) };

  const { data, error: signErr } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path);
  if (signErr || !data) {
    await supabase.from("files").delete().eq("id", row.id);
    return { ok: false, message: "Байршуулах эрх авахад алдаа гарлаа. Дахин оролдоно уу." };
  }
  return { ok: true, id: row.id, signedUrl: data.signedUrl };
}

/** Step 2: keep the row if the bytes arrived, otherwise remove it so no empty entry is left behind. */
export async function finishUpload(id: string, uploaded: boolean): Promise<void> {
  await requireMe();
  const supabase = await createClient();
  if (!uploaded) await supabase.from("files").delete().eq("id", id);
  revalidatePath("/admin/files");
}

export async function updateFile(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireMe();
  const name = field(fd, "name");
  if (!name) return fail("Файлын нэрийг оруулна уу.");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("files")
    .update({ name: name.slice(0, 255), folder_id: optional(fd, "folder_id"), project: optional(fd, "project") })
    .eq("id", field(fd, "id"))
    .select("id");
  if (error) return fail(dbError(error));
  if (!data?.length) return fail("Танд энэ файлыг засах эрх байхгүй.");
  revalidatePath("/admin/files");
  return ok("Хадгаллаа.");
}

/** Object first (its delete policy needs the files row to still exist), then the row. */
export async function deleteFile(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireMe();
  const id = field(fd, "id");
  const supabase = await createClient();
  const { data: file } = await supabase.from("files").select("storage_path").eq("id", id).maybeSingle();
  if (!file) return fail("Файл олдсонгүй.");

  const { data: removed, error: rmErr } = await supabase.storage.from(BUCKET).remove([file.storage_path]);
  if (rmErr || !removed?.length) return fail("Танд энэ файлыг устгах эрх байхгүй.");

  const { error } = await supabase.from("files").delete().eq("id", id);
  if (error) return fail(dbError(error));
  revalidatePath("/admin/files");
  return ok("Файл устгагдлаа.");
}

export async function createFolder(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireMe();
  const name = field(fd, "name");
  if (!name) return fail("Хавтасны нэрийг оруулна уу.");
  const supabase = await createClient();
  const { error } = await supabase.from("folders").insert({ name: name.slice(0, 120) });
  if (error) return fail(dbError(error));
  revalidatePath("/admin/files");
  return ok("Хавтас үүслээ.");
}

export async function renameFolder(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireMe();
  const name = field(fd, "name");
  if (!name) return fail("Хавтасны нэрийг оруулна уу.");
  const supabase = await createClient();
  const { data, error } = await supabase.from("folders").update({ name: name.slice(0, 120) }).eq("id", field(fd, "id")).select("id");
  if (error) return fail(dbError(error));
  if (!data?.length) return fail("Зөвхөн хавтас үүсгэгч эсвэл админ нэрийг солино.");
  revalidatePath("/admin/files");
  return ok("Хавтасны нэр солигдлоо.");
}

/** Files in the folder are kept and simply become unfiled (folder_id → null). */
export async function deleteFolder(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireMe();
  const supabase = await createClient();
  const { data, error } = await supabase.from("folders").delete().eq("id", field(fd, "id")).select("id");
  if (error) return fail(dbError(error));
  if (!data?.length) return fail("Зөвхөн хавтас үүсгэгч эсвэл админ устгана.");
  revalidatePath("/admin/files");
  redirect("/admin/files");
}
