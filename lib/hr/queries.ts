import "server-only";
import { createClient } from "@/lib/supabase/server";
import { addDays, todayISO } from "@/lib/work/format";
import { EXPIRY_WARN_DAYS, type DocCategory, type EmployeeStatus, type EmploymentType } from "./labels";

/** All reads run as the signed-in user, so RLS decides: admins see everything, an employee only their own file. */

export type Employee = {
  id: string;
  fullName: string;
  registerNo: string | null;
  birthDate: string | null;
  phone: string | null;
  contactEmail: string | null;
  address: string | null;
  departmentId: string | null;
  departmentName: string | null;
  position: string | null;
  hireDate: string | null;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  leftOn: string | null;
  emergencyContact: string | null;
  note: string | null;
  profileId: string | null;
};

type EmployeeRow = {
  id: string;
  full_name: string;
  register_no: string | null;
  birth_date: string | null;
  phone: string | null;
  contact_email: string | null;
  address: string | null;
  department_id: string | null;
  departments: { name: string } | null;
  position: string | null;
  hire_date: string | null;
  employment_type: EmploymentType;
  status: EmployeeStatus;
  left_on: string | null;
  emergency_contact: string | null;
  note: string | null;
  profile_id: string | null;
};

const employeeCols =
  "id, full_name, register_no, birth_date, phone, contact_email, address, department_id, departments(name), position, hire_date, employment_type, status, left_on, emergency_contact, note, profile_id";

const toEmployee = (r: EmployeeRow): Employee => ({
  id: r.id,
  fullName: r.full_name,
  registerNo: r.register_no,
  birthDate: r.birth_date,
  phone: r.phone,
  contactEmail: r.contact_email,
  address: r.address,
  departmentId: r.department_id,
  departmentName: r.departments?.name ?? null,
  position: r.position,
  hireDate: r.hire_date,
  employmentType: r.employment_type,
  status: r.status,
  leftOn: r.left_on,
  emergencyContact: r.emergency_contact,
  note: r.note,
  profileId: r.profile_id,
});

export type EmployeeDoc = {
  id: string;
  employeeId: string;
  category: DocCategory;
  title: string;
  docNumber: string | null;
  issuedOn: string | null;
  validUntil: string | null;
  note: string | null;
  name: string;
  mimeType: string | null;
  sizeBytes: number;
  createdAt: string;
};

type DocRow = {
  id: string;
  employee_id: string;
  category: DocCategory;
  title: string;
  doc_number: string | null;
  issued_on: string | null;
  valid_until: string | null;
  note: string | null;
  name: string;
  mime_type: string | null;
  size_bytes: number;
  created_at: string;
};

const docCols = "id, employee_id, category, title, doc_number, issued_on, valid_until, note, name, mime_type, size_bytes, created_at";

const toDoc = (r: DocRow): EmployeeDoc => ({
  id: r.id,
  employeeId: r.employee_id,
  category: r.category,
  title: r.title,
  docNumber: r.doc_number,
  issuedOn: r.issued_on,
  validUntil: r.valid_until,
  note: r.note,
  name: r.name,
  mimeType: r.mime_type,
  sizeBytes: Number(r.size_bytes),
  createdAt: r.created_at,
});

/** "expired" | "soon" (within EXPIRY_WARN_DAYS) | null */
export function expiryState(validUntil: string | null, today = todayISO()): "expired" | "soon" | null {
  if (!validUntil) return null;
  if (validUntil < today) return "expired";
  if (validUntil <= addDays(today, EXPIRY_WARN_DAYS)) return "soon";
  return null;
}

export function daysUntil(iso: string, today = todayISO()): number {
  return Math.round((Date.parse(`${iso}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000);
}

export type EmployeeListItem = Employee & { docCount: number; nextExpiry: string | null };

/** Personal files with document counts and the nearest upcoming/overdue expiry (for the list page). */
export async function getEmployees(): Promise<EmployeeListItem[]> {
  const supabase = await createClient();
  const [empRes, docRes] = await Promise.all([
    supabase.from("employees").select(employeeCols).order("full_name").returns<EmployeeRow[]>(),
    supabase.from("employee_documents").select("employee_id, valid_until").returns<{ employee_id: string; valid_until: string | null }[]>(),
  ]);
  if (empRes.error) throw empRes.error;
  if (docRes.error) throw docRes.error;

  const counts = new Map<string, number>();
  const expiry = new Map<string, string>();
  const horizon = addDays(todayISO(), EXPIRY_WARN_DAYS);
  for (const d of docRes.data) {
    counts.set(d.employee_id, (counts.get(d.employee_id) ?? 0) + 1);
    if (d.valid_until && d.valid_until <= horizon) {
      const cur = expiry.get(d.employee_id);
      if (!cur || d.valid_until < cur) expiry.set(d.employee_id, d.valid_until);
    }
  }
  return empRes.data.map((r) => ({ ...toEmployee(r), docCount: counts.get(r.id) ?? 0, nextExpiry: expiry.get(r.id) ?? null }));
}

export async function getEmployee(id: string): Promise<Employee | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("employees").select(employeeCols).eq("id", id).maybeSingle<EmployeeRow>();
  return data ? toEmployee(data) : null;
}

/** The signed-in user's own personal file, if one is linked to their login. */
export async function getMyEmployee(profileId: string): Promise<Employee | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("employees").select(employeeCols).eq("profile_id", profileId).maybeSingle<EmployeeRow>();
  return data ? toEmployee(data) : null;
}

export async function getDocuments(employeeId: string): Promise<EmployeeDoc[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("employee_documents")
    .select(docCols)
    .eq("employee_id", employeeId)
    .order("issued_on", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .returns<DocRow[]>();
  if (error) throw error;
  return data.map(toDoc);
}

export type ExpiringDoc = EmployeeDoc & { employeeName: string };

/** Documents that expire within EXPIRY_WARN_DAYS or already expired (dashboard). */
export async function getExpiringDocuments(limit = 10): Promise<ExpiringDoc[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("employee_documents")
    .select(`${docCols}, employees(full_name, status)`)
    .not("valid_until", "is", null)
    .lte("valid_until", addDays(todayISO(), EXPIRY_WARN_DAYS))
    .order("valid_until")
    .limit(limit * 3)
    .returns<(DocRow & { employees: { full_name: string; status: EmployeeStatus } | null })[]>();
  if (error) throw error;
  return data
    .filter((r) => r.employees?.status !== "left")
    .slice(0, limit)
    .map((r) => ({ ...toDoc(r), employeeName: r.employees?.full_name ?? "—" }));
}
