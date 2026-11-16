import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { Tone } from "@/lib/work/labels";

/** Shared building blocks for /admin pages, in the site's palette (cream ground, white cards, brand accents). */

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-[26px] leading-tight font-extrabold text-ink sm:text-[30px]">{title}</h1>
        {description && <p className="pt-1.5 text-[15px] text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ title, actions, className = "", children }: { title?: string; actions?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <section className={`rounded-[22px] border border-line bg-white ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-3 border-b border-line-soft px-5 py-4">
          {title && <h2 className="text-[16px] font-bold text-ink">{title}</h2>}
          {actions}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

const tones: Record<Tone, string> = {
  neutral: "bg-track text-body",
  brand: "bg-lilac text-brand",
  green: "bg-mint text-leaf",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap ${tones[tone]}`}>{children}</span>;
}

export function StatCard({ label, value, hint, tone = "brand" }: { label: string; value: ReactNode; hint?: string; tone?: Tone }) {
  const bar: Record<Tone, string> = {
    neutral: "bg-faint",
    brand: "bg-brand-gradient",
    green: "bg-leaf",
    amber: "bg-amber-500",
    red: "bg-red-500",
  };
  return (
    <div className="relative overflow-hidden rounded-[20px] border border-line bg-white p-5">
      <span aria-hidden className={`absolute inset-y-0 left-0 w-1 ${bar[tone]}`} />
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="pt-1 font-display text-[32px] leading-tight font-extrabold text-ink">{value}</p>
      {hint && <p className="pt-0.5 text-xs text-faint">{hint}</p>}
    </div>
  );
}

export function EmptyState({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-[18px] border border-dashed border-lavender-muted bg-cream/60 px-6 py-10 text-center">
      <p className="font-semibold text-ink">{title}</p>
      {description && <p className="max-w-[420px] text-sm text-muted">{description}</p>}
      {children}
    </div>
  );
}

export function Notice({ tone = "red", children }: { tone?: "red" | "green" | "amber"; children: ReactNode }) {
  const t = { red: "bg-red-50 text-red-700", green: "bg-mint text-leaf", amber: "bg-amber-50 text-amber-800" }[tone];
  return (
    <p role={tone === "red" ? "alert" : "status"} className={`rounded-xl px-4 py-3 text-sm font-medium ${t}`}>
      {children}
    </p>
  );
}

/** Horizontally scrollable table shell; pass <thead>/<tbody>. */
export function Table({ children, minWidth = 760 }: { children: ReactNode; minWidth?: number }) {
  return (
    <div className="-mx-5 overflow-x-auto">
      <table className="w-full text-left text-sm" style={{ minWidth }}>
        {children}
      </table>
    </div>
  );
}

export function Th({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return <th className={`border-b border-line bg-sand px-5 py-2.5 text-xs font-semibold tracking-wide whitespace-nowrap text-muted uppercase first:rounded-tl-none ${className}`}>{children}</th>;
}

export function Td({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return <td className={`border-b border-line-soft px-5 py-3 align-top ${className}`}>{children}</td>;
}

const fieldCls =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none transition placeholder:text-faint focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 disabled:bg-sand disabled:text-muted";

export function AInput(props: ComponentPropsWithoutRef<"input">) {
  return <input {...props} className={`${fieldCls} ${props.className ?? ""}`} />;
}
export function ASelect(props: ComponentPropsWithoutRef<"select">) {
  return <select {...props} className={`${fieldCls} ${props.className ?? ""}`} />;
}
export function ATextarea(props: ComponentPropsWithoutRef<"textarea">) {
  return <textarea rows={3} {...props} className={`${fieldCls} resize-y ${props.className ?? ""}`} />;
}

export function AField({ label, hint, className = "", children }: { label: string; hint?: string; className?: string; children: ReactNode }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[13px] font-semibold text-body">{label}</span>
      {children}
      {hint && <span className="text-xs text-faint">{hint}</span>}
    </label>
  );
}

export const btn = {
  primary:
    "inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-gradient px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 active:scale-[0.97] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue",
  outline:
    "inline-flex items-center justify-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-body transition hover:border-brand/30 hover:text-brand active:scale-[0.97] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue",
  danger:
    "inline-flex items-center justify-center gap-1.5 rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 active:scale-[0.97] disabled:opacity-60",
  link: "text-sm font-semibold text-brand hover:underline",
};

/** GET filter form: submitting reloads the page with the values as search params. */
export function FilterBar({ children, resetHref }: { children: ReactNode; resetHref: string }) {
  return (
    <form method="get" className="mb-5 grid gap-3 rounded-[20px] border border-line bg-white p-4 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(160px,1fr))] lg:items-end">
      {children}
      <div className="flex gap-2">
        <button type="submit" className={btn.primary}>
          Шүүх
        </button>
        <a href={resetHref} className={btn.outline}>
          Цэвэрлэх
        </a>
      </div>
    </form>
  );
}

export function Progress({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-full min-w-[80px] overflow-hidden rounded-full bg-track" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-violet" style={{ width: `${v}%` }} />
      </div>
      <span className="w-10 text-right text-xs font-semibold text-body tabular-nums">{v}%</span>
    </div>
  );
}
