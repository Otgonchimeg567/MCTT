import type { Metadata } from "next";
import type { ReactNode } from "react";
import { requireMe } from "@/lib/auth";
import { Sidebar } from "@/components/admin/Sidebar";
import { signOut } from "@/app/admin/login/actions";

export const metadata: Metadata = { title: "Ажлын систем — MCTT", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const me = await requireMe();
  return (
    <div className="min-h-screen bg-cream lg:grid lg:grid-cols-[264px_1fr]">
      <Sidebar role={me.role} name={me.fullName} email={me.email} department={me.departmentName} signOut={signOut} />
      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">{children}</main>
    </div>
  );
}
