import type { ReactNode } from "react";

type Tone = "purple" | "green" | "glass";

const tones: Record<Tone, string> = {
  purple: "bg-lilac text-brand",
  green: "bg-mint text-leaf",
  glass: "bg-white/12 text-white",
};

export function SectionTag({ tone = "purple", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-3.5 py-1.5 text-[13px] leading-[19.5px] font-semibold tracking-[0.52px] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
