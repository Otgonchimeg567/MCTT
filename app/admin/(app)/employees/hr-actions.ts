"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireMe } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getDb } from "@/lib/server/db";
import { dbError, fail, field, ok, optional, type ActionState } from "@/lib/work/action";
import { isISODate } from "@/lib/work/format";
import { isRole } from "@/lib/work/labels";
import { isDocCategory, isEmployeeStatus, isEmploymentType } from "@/lib/hr/labels";

/**
 * Personal files (employees) and their documents. Every write runs as the signed-in admin, so RLS also enforces
 * "admin only"; the Auth admin API (secret key) is used only to create a login, after the admin check.
 */

const BUCKET = "hr-files";
const MAX_BYTES = 50 * 1024 * 1024;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const date = (fd: FormData, name: string) => {
  const v = field(fd, name);
  return isISODate(v) ? v : null;
};

function readEmployee(fd: FormData) {
  const type = field(fd, "employment_type");
  const status = field(fd, "status");
  return {
    full_name: field(fd, "full_name"),
    register_no: optional(fd, "register_no")?.toUpperCase() ?? null,
    birth_date: date(fd, "birth_date"),
    phone: optional(fd, "phone"),
    contact_email: optional(fd, "contact_email"),
    address: optional(fd, "address"),
    department_id: optional(fd, "department_id"),
    position: optional(fd, "position"),
    hire_date: date(fd, "hire_date"),
    employment_type: isEmploymentType(type) ? type : "permanent",
    status: isEmployeeStatus(status) ? status : "active",
    left_on: date(fd, "left_on"),
    emergency_contact: optional(fd, "emergency_contact"),
    note: optional(fd, "note"),
  };
}

function revalidateEmployee(id?: string) {
  revalidatePath("/admin/employees");
  if (id) revalidatePath(`/admin/employees/${id}`);
  revalidatePath("/admin/my-file");
  revalidatePath("/admin");
}

export async function createHrEmployee(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireMe(["admin"]);
  const row = readEmployee(fd);
  if (row.full_name.length < 2) return fail("Ажилтны нэрийг оруулна уу.");

  const supabase = await createClient();
  const { data, error } = await supabase.from("employees").insert(row).select("id").single();
  if (error) return fail(dbError(error));
  revalidateEmployee();
  redirect(`/admin/employees/${data.id}?tab=docs`);
}

export async function updateHrEmployee(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireMe(["admin"]);
  const id = field(fd, "id");
  const row = readEmployee(fd);
  if (row.full_name.length < 2) return fail("Ажилтны нэрийг оруулна уу.");

  const supabase = await createClient();
  const { data: emp, error } = await supabase.from("employees").update(row).eq("id", id).select("profile_id").single();
  if (error) return fail(dbError(error));

  // Keep the linked login's display fields in step with the personal file.
  if (emp.profile_id) {
    await supabase
      .from("profiles")
      .update({ full_name: row.full_name, phone: row.phone, position: row.position, department_id: row.department_id })
      .eq("id", emp.profile_id);
  }
  revalidateEmployee(id);
  return ok("Хадгаллаа.");
}

/** Deletes the personal file and all its documents (rows + stored files). The login, if any, is kept. */
export async function deleteHrEmployee(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireMe(["admin"]);
  const id = field(fd, "id");
  const supabase = await createClient();
  const { data: docs } = await supabase.from("employee_documents").select("storage_path").eq("employee_id", id);
  if (docs?.length) {
    const { error: rmErr } = await supabase.storage.from(BUCKET).remove(docs.map((d) => d.storage_path));
    if (rmErr) return fail("Хавсралт файлуудыг устгаж чадсангүй. Дахин оролдоно уу.");
  }
  const { error } = await supabase.from("employees").delete().eq("id", id);
  if (error) return fail(dbError(error));
  revalidateEmployee();
  redirect("/admin/employees");
}

// ---------------------------------------------------------------- documents

function storageSafe(name: string) {
  const dot = name.lastIndexOf(".");
  const ext = dot > 0 ? name.slice(dot).replace(/[^A-Za-z0-9.]/g, "").slice(0, 12) : "";
  const base = (dot > 0 ? name.slice(0, dot) : name).replace(/[^A-Za-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 60);
  return `${base || "file"}${ext}`;
}

export type DocUploadMeta = {
  employeeId: string;
  name: string;
  size: number;
  type: string;
  category: string;
  title: string;
  docNumber: string | null;
  issuedOn: string | null;
  validUntil: string | null;
  note: string | null;
};

/** Step 1: create the document row and a one-time signed upload URL for "<employee id>/<uuid>-<name>". */
export async function prepareDocUpload(
  meta: DocUploadMeta,
): Promise<{ ok: false; message: string } | { ok: true; id: string; signedUrl: string }> {
  await requireMe(["admin"]);
  if (!meta.name || !(meta.size > 0)) return { ok: false, message: "Файлаа сонгоно уу." };
  if (meta.size > MAX_BYTES) return { ok: false, message: "Файлын хэмжээ 50 MB-аас ихгүй байна." };
  const title = meta.title.trim() || meta.name.replace(/\.[^.]+$/, "");
  const issued = meta.issuedOn && isISODate(meta.issuedOn) ? meta.issuedOn : null;
  const until = meta.validUntil && isISODate(meta.validUntil) ? meta.validUntil : null;
  if (issued && until && until < issued) return { ok: false, message: "Хүчинтэй хугацаа олгосон огнооноос өмнө байна." };

  const path = `${meta.employeeId}/${randomUUID()}-${storageSafe(meta.name)}`;
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("employee_documents")
    .insert({
      employee_id: meta.employeeId,
      category: isDocCategory(meta.category) ? meta.category : "other",
      title: title.slice(0, 200),
      doc_number: meta.docNumber?.trim().slice(0, 60) || null,
      issued_on: issued,
      valid_until: until,
      note: meta.note?.trim().slice(0, 1000) || null,
      name: meta.name.slice(0, 255),
      storage_path: path,
      mime_type: meta.type || null,
      size_bytes: Math.round(meta.size),
    })
    .select("id")
    .single();
  if (error) return { ok: false, message: dbError(error) };

  const { data, error: signErr } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path);
  if (signErr || !data) {
    await supabase.from("employee_documents").delete().eq("id", row.id);
    return { ok: false, message: "Байршуулах эрх авахад алдаа гарлаа. Дахин оролдоно уу." };
  }
  return { ok: true, id: row.id, signedUrl: data.signedUrl };
}

/** Step 2: keep the row if the bytes arrived, otherwise remove it. */
export async function finishDocUpload(id: string, employeeId: string, uploaded: boolean): Promise<void> {
  await requireMe(["admin"]);
  const supabase = await createClient();
  if (!uploaded) await supabase.from("employee_documents").delete().eq("id", id);
  revalidateEmployee(employeeId);
}

export async function updateDocument(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireMe(["admin"]);
  const id = field(fd, "id");
  const employeeId = field(fd, "employee_id");
  const title = field(fd, "title");
  if (!title) return fail("Гарчгийг оруулна уу.");
  const category = field(fd, "category");
  const supabase = await createClient();
  const { error } = await supabase
    .from("employee_documents")
    .update({
      title: title.slice(0, 200),
      category: isDocCategory(category) ? category : "other",
      doc_number: optional(fd, "doc_number"),
      issued_on: date(fd, "issued_on"),
      valid_until: date(fd, "valid_until"),
      note: optional(fd, "note"),
    })
    .eq("id", id);
  if (error) return fail(dbError(error));
  revalidateEmployee(employeeId);
  redirect(`/admin/employees/${employeeId}?tab=docs`);
}

/** Stored object first (its delete needs the row's rights), then the row. */
export async function deleteDocument(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireMe(["admin"]);
  const id = field(fd, "id");
  const employeeId = field(fd, "employee_id");
  const supabase = await createClient();
  const { data: doc } = await supabase.from("employee_documents").select("storage_path").eq("id", id).maybeSingle();
  if (!doc) return fail("Бичиг баримт олдсонгүй.");
  const { error: rmErr } = await supabase.storage.from(BUCKET).remove([doc.storage_path]);
  if (rmErr) return fail("Файлыг устгаж чадсангүй.");
  const { error } = await supabase.from("employee_documents").delete().eq("id", id);
  if (error) return fail(dbError(error));
  revalidateEmployee(employeeId);
  return ok("Устгагдлаа.");
}

// ---------------------------------------------------------------- login

/** Role of the login linked to a personal file. */
export async function setLoginRole(_: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireMe(["admin"]);
  const profileId = field(fd, "profile_id");
  const role = field(fd, "role");
  if (!isRole(role)) return fail("Эрх буруу байна.");
  if (profileId === me.id && role !== "admin") return fail("Өөрийн админ эрхийг хасах боломжгүй.");
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ role }).eq("id", profileId);
  if (error) return fail(dbError(error));
  revalidateEmployee(field(fd, "employee_id"));
  return ok("Эрх шинэчлэгдлээ.");
}

/** Creates a login for a personal file that has none and links it (profile gets the file's name/department/position). */
export async function createLoginForEmployee(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireMe(["admin"]);
  const id = field(fd, "id");
  const email = field(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");
  const role = field(fd, "role");
  if (!EMAIL.test(email)) return fail("Имэйл хаяг буруу байна.");
  if (password.length < 8) return fail("Түр нууц үг дор хаяж 8 тэмдэгт байна.");

  const supabase = await createClient();
  const { data: emp } = await supabase.from("employees").select("full_name, phone, position, department_id, profile_id").eq("id", id).maybeSingle();
  if (!emp) return fail("Ажилтан олдсонгүй.");
  if (emp.profile_id) return fail("Энэ ажилтан аль хэдийн нэвтрэх эрхтэй.");

  const admin = getDb();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: emp.full_name },
  });
  if (error || !data.user) {
    return fail(/already|registered|exists/i.test(error?.message ?? "") ? "Энэ имэйлтэй хэрэглэгч аль хэдийн бүртгэлтэй байна." : "Хэрэглэгч үүсгэж чадсангүй.");
  }
  const userId = data.user.id;

  const { error: profErr } = await admin
    .from("profiles")
    .update({
      full_name: emp.full_name,
      phone: emp.phone,
      position: emp.position,
      department_id: emp.department_id,
      role: isRole(role) ? role : "employee",
    })
    .eq("id", userId);
  const { error: linkErr } = await supabase.from("employees").update({ profile_id: userId, contact_email: email }).eq("id", id);
  if (profErr || linkErr) {
    await admin.auth.admin.deleteUser(userId); // don't leave an orphan login behind
    return fail(dbError(profErr ?? linkErr));
  }
  revalidateEmployee(id);
  return ok("Нэвтрэх эрх үүслээ. Түр нууц үгийг ажилтанд найдвартай замаар хүргээрэй.");
}
