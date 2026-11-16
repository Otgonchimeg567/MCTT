import type { ReactNode } from "react";

/**
 * Content runs to the same side gutters as the header (24px, 40px from lg) so every section lines up
 * with the logo and CTA. Capped at 2200px so ultra-wide screens don't stretch it indefinitely.
 */
export const pageGutter = "mx-auto w-full max-w-[2200px] px-6 lg:px-10";

export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`${pageGutter} ${className}`}>{children}</div>;
}
