import type { ReactNode } from "react";

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full bg-lilac px-2.5 py-1 text-xs leading-[18px] font-bold text-brand">
      {children}
    </span>
  );
}
