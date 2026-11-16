import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/work/labels";

export type Me = {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  departmentId: string | null;
  departmentName: string | null;
  position: string | null;
};

/**
 * The signed-in, active user with their role from `profiles` (never from user metadata). Null when signed out
 * or deactivated — an inactive user's own row is hidden by RLS, so the lookup comes back empty.
 */
export const getMe = cache(async (): Promise<Me | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, department_id, position, is_active, departments(name)")
    .eq("id", user.id)
    .maybeSingle<{
      id: string;
      email: string;
      full_name: string;
      role: Role;
      department_id: string | null;
      position: string | null;
      is_active: boolean;
      departments: { name: string } | null;
    }>();
  if (!data || !data.is_active) return null;

  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name || data.email,
    role: data.role,
    departmentId: data.department_id,
    departmentName: data.departments?.name ?? null,
    position: data.position,
  };
});

/** Page/action guard: sends signed-out users to login and users without one of `roles` to the dashboard. */
export async function requireMe(roles?: Role[]): Promise<Me> {
  const me = await getMe();
  if (!me) redirect("/admin/login?error=session");
  if (roles && !roles.includes(me.role)) redirect("/admin?denied=1");
  return me;
}
