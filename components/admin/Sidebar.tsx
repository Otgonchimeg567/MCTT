"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import type { Role } from "@/lib/work/labels";
import { roleLabels } from "@/lib/work/labels";

// Lucide shapes (ISC licence).
const icons: Record<string, ReactNode> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  log: (
    <>
      <path d="M8 2v4M16 2v4" />
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </>
  ),
  tasks: (
    <>
      <path d="m3 17 2 2 4-4M3 7l2 2 4-4" />
      <path d="M13 6h8M13 12h8M13 18h8" />
    </>
  ),
  files: <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />,
  reports: (
    <>
      <path d="M3 3v18h18" />
      <path d="M18 17V9M13 17V5M8 17v-3" />
    </>
  ),
  settings: (
    <>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  idcard: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="M15 8h2M15 12h2M7 16h10" />
    </>
  ),
  inbox: (
    <>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </>
  ),
};

type Item = { href: string; label: string; icon: keyof typeof icons; roles?: Role[] };

const items: Item[] = [
  { href: "/admin", label: "Хяналтын самбар", icon: "dashboard" },
  { href: "/admin/employees", label: "Ажилтнууд", icon: "users", roles: ["admin", "manager"] },
  { href: "/admin/work-logs", label: "Ажлын бүртгэл", icon: "log" },
  { href: "/admin/tasks", label: "Даалгавар", icon: "tasks" },
  { href: "/admin/files", label: "Файл / хавтас", icon: "files" },
  { href: "/admin/my-file", label: "Миний хувийн хэрэг", icon: "idcard", roles: ["manager", "employee"] },
  { href: "/admin/reports", label: "Тайлан", icon: "reports" },
  { href: "/admin/requests", label: "Үнийн хүсэлт", icon: "inbox", roles: ["admin"] },
  { href: "/admin/settings", label: "Тохиргоо", icon: "settings" },
];

function Icon({ name }: { name: keyof typeof icons }) {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {icons[name]}
    </svg>
  );
}

type Props = { role: Role; name: string; email: string; department: string | null; signOut: () => Promise<void> };

export function Sidebar({ role, name, email, department, signOut }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const visible = items.filter((i) => !i.roles || i.roles.includes(role));
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const nav = (
    <nav aria-label="Админ цэс" className="flex flex-col gap-1">
      {visible.map((i) => {
        const active = isActive(i.href);
        return (
          <Link
            key={i.href}
            href={i.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold transition ${
              active ? "bg-brand-gradient text-white shadow-[0_8px_20px_-10px_rgba(59,45,143,0.6)]" : "text-body hover:bg-lilac hover:text-brand"
            }`}
          >
            <Icon name={i.icon} />
            {i.label}
          </Link>
        );
      })}
    </nav>
  );

  const user = (
    <div className="rounded-2xl border border-line bg-cream/60 p-3">
      <p className="truncate text-sm font-bold text-ink">{name}</p>
      <p className="truncate text-xs text-muted">{email}</p>
      <p className="pt-1 text-xs font-semibold text-brand">
        {roleLabels[role]}
        {department ? ` · ${department}` : ""}
      </p>
      <form action={signOut} className="pt-2.5">
        <button type="submit" className="w-full rounded-full border border-line bg-white py-1.5 text-xs font-semibold text-body transition hover:border-red-200 hover:text-red-600">
          Гарах
        </button>
      </form>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="" width={40} height={30} className="h-8 w-auto" />
          <span className="font-display text-sm font-extrabold text-ink">Ажлын систем</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="admin-mobile-nav"
          className="flex size-10 items-center justify-center rounded-full border border-line text-ink"
        >
          <span className="sr-only">Цэс</span>
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
            {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </header>
      {open && (
        <div id="admin-mobile-nav" className="fixed inset-x-0 top-[65px] bottom-0 z-20 flex flex-col gap-4 overflow-y-auto bg-white p-4 lg:hidden">
          {nav}
          {user}
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col gap-6 border-r border-line bg-white p-5 lg:flex">
        <Link href="/admin" className="flex items-center gap-3 px-1">
          <Image src="/images/logo.png" alt="" width={48} height={36} className="h-9 w-auto" />
          <span className="leading-tight">
            <span className="block font-display text-[15px] font-extrabold text-ink">Эм Си Ти Ти</span>
            <span className="block text-xs text-muted">Ажлын систем</span>
          </span>
        </Link>
        <div className="flex-1 overflow-y-auto">{nav}</div>
        {user}
      </aside>
    </>
  );
}
