import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Me } from "@/lib/auth";
import type { Role } from "./labels";

export type Person = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  position: string | null;
  role: Role;
  isActive: boolean;
  departmentId: string | null;
  departmentName: string | null;
};

type PersonRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  position: string | null;
  role: Role;
  is_active: boolean;
  department_id: string | null;
  departments: { name: string } | null;
};

const personCols = "id, full_name, email, phone, position, role, is_active, department_id, departments(name)";

const toPerson = (r: PersonRow): Person => ({
  id: r.id,
  fullName: r.full_name || r.email,
  email: r.email,
  phone: r.phone,
  position: r.position,
  role: r.role,
  isActive: r.is_active,
  departmentId: r.department_id,
  departmentName: r.departments?.name ?? null,
});

/**
 * People whose work I oversee: admin → everyone, manager → own department, employee → only me.
 * (RLS would also let employees read colleagues' names; that's for display, not oversight.)
 */
export async function getTeam(me: Me): Promise<Person[]> {
  const supabase = await createClient();
  let q = supabase.from("profiles").select(personCols).order("full_name");
  if (me.role === "manager") q = me.departmentId ? q.eq("department_id", me.departmentId) : q.eq("id", me.id);
  if (me.role === "employee") q = q.eq("id", me.id);
  const { data, error } = await q.returns<PersonRow[]>();
  if (error) throw error;
  return data.map(toPerson);
}

export async function getPerson(id: string): Promise<Person | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select(personCols).eq("id", id).maybeSingle<PersonRow>();
  return data ? toPerson(data) : null;
}

export type Department = { id: string; name: string };

export async function getDepartments(): Promise<Department[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("departments").select("id, name").order("name");
  if (error) throw error;
  return data;
}

/** Display names for any profile ids I can read (falls back to "—" for ones RLS hides). */
export async function getNames(ids: (string | null | undefined)[]): Promise<Map<string, string>> {
  const unique = [...new Set(ids.filter((x): x is string => !!x))];
  if (unique.length === 0) return new Map();
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("id, full_name, email").in("id", unique);
  return new Map((data ?? []).map((p) => [p.id as string, (p.full_name as string) || (p.email as string)]));
}

export const canManageTeam = (role: Role) => role === "admin" || role === "manager";
