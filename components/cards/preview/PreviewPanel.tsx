import type { ReactNode } from "react";

/** White floating panel used inside FeatureCard previews. */
export function PreviewPanel({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="w-full rounded-[14px] bg-white px-4 py-3.5 drop-shadow-[0px_8px_10px_rgba(20,20,43,0.06)]">
      {label && (
        <p className="text-[11px] leading-[16.5px] font-bold tracking-[0.88px] whitespace-nowrap text-muted">{label}</p>
      )}
      {children}
    </div>
  );
}
