import type { ComponentPropsWithoutRef } from "react";

const base =
  "w-full rounded-2xl border bg-white px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-faint focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20";

const cls = (invalid?: boolean, extra = "") => `${base} ${invalid ? "border-red-400" : "border-line"} ${extra}`;

type Invalid = { invalid?: boolean };

export function Input({ invalid, className, ...props }: ComponentPropsWithoutRef<"input"> & Invalid) {
  return <input aria-invalid={invalid || undefined} className={cls(invalid, className)} {...props} />;
}

export function Textarea({ invalid, className, ...props }: ComponentPropsWithoutRef<"textarea"> & Invalid) {
  return <textarea aria-invalid={invalid || undefined} className={cls(invalid, `resize-none ${className ?? ""}`)} {...props} />;
}

export function Select({ invalid, className, ...props }: ComponentPropsWithoutRef<"select"> & Invalid) {
  return <select aria-invalid={invalid || undefined} className={cls(invalid, className)} {...props} />;
}
