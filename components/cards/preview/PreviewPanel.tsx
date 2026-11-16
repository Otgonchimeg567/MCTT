import type { ReactNode } from "react";

export type PreviewSize = "md" | "lg";
export type BgTone = "white" | "sand" | "lavender" | "lilac";

/**
 * White floating panel used inside FeatureCard previews. Capped and centred so on wide cards a
 * row's label and value stay close enough to read as a pair (proximity).
 * `lg` is for the wide FeatureCarousel panel: larger cap, padding and label.
 * `bgTone` cycles background colors across carousel slides.
 */
export function PreviewPanel({ label, size = "md", bgTone = "white", children }: { label?: string; size?: PreviewSize; bgTone?: BgTone; children: ReactNode }) {
  const lg = size === "lg";
  const bgClass = {
    white: "[background-color:var(--color-white,white)]",
    sand: "[background-color:var(--color-sand)]",
    lavender: "[background-color:var(--color-lavender)]",
    lilac: "[background-color:var(--color-lilac)]",
  }[bgTone];

  return (
    <div
      className={`mx-auto w-full rounded-[14px] drop-shadow-[0px_8px_10px_rgba(20,20,43,0.06)] ${bgClass} ${
        lg ? "max-w-[580px] rounded-[18px] px-6 py-5" : "max-w-[460px] px-4 py-3.5"
      }`}
    >
      {label && (
        <p
          className={`font-bold whitespace-nowrap text-muted ${
            lg ? "text-sm leading-[20px] tracking-[1.04px]" : "text-[11px] leading-[16.5px] tracking-[0.88px]"
          }`}
        >
          {label}
        </p>
      )}
      {children}
    </div>
  );
}
