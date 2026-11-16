import Image from "next/image";
import { company } from "@/lib/content";

type Size = "lg" | "md";

// Mark is the vector triangle (public/images/logo-mark.svg, 120×104); wordmark scales with it.
const sizes: Record<Size, { w: number; h: number; img: string; text: string; gap: string }> = {
  lg: { w: 74, h: 64, img: "h-12 w-auto sm:h-16", text: "text-lg leading-[27px] sm:text-[22px] sm:leading-[30px]", gap: "gap-3" },
  md: { w: 51, h: 44, img: "h-10 w-auto", text: "text-[15px] leading-[22px]", gap: "gap-2.5" },
};

/**
 * MCTT logo mark + wordmark. `muted` renders the company name in grey (footer);
 * `tone="dark"` is for dark backgrounds (white mark plate, white/lavender text).
 */
export function Logo({ size = "lg", muted = false, tone = "light" }: { size?: Size; muted?: boolean; tone?: "light" | "dark" }) {
  const s = sizes[size];
  const dark = tone === "dark";
  return (
    <span className={`flex items-center ${s.gap}`}>
      <Image
        src="/images/logo-mark.svg"
        alt=""
        width={s.w}
        height={s.h}
        className={`${s.img} drop-shadow-[0_4px_14px_rgba(106,79,209,0.35)]`}
        priority={size === "lg"}
      />
      <span className={dark ? "text-white" : muted ? "text-muted" : "text-ink"}>
        <span className={`font-display font-extrabold whitespace-nowrap ${s.text}`}>{company.name}</span>
      </span>
      <span className={`font-display font-extrabold whitespace-nowrap ${dark ? "text-lavender" : "text-brand"} ${s.text}`}>
        {company.suffix}
      </span>
    </span>
  );
}
