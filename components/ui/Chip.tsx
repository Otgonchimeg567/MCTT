import type { ReactNode } from "react";

const tones = {
  lilac: "bg-lilac text-brand",
  /** Solid brand fill — for a chip that sits on a lilac (highlighted) surface. */
  brand: "bg-brand text-white",
};

export function Chip({ tone = "lilac", children }: { tone?: keyof typeof tones; children: ReactNode }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs leading-[18px] font-bold ${tones[tone]}`}>{children}</span>
  );
}
