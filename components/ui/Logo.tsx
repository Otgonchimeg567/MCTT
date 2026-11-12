import Image from "next/image";
import { company } from "@/lib/content";

type Size = "lg" | "md";

const sizes: Record<Size, { w: number; h: number; text: string }> = {
  lg: { w: 46, h: 34, text: "text-xl leading-[30px]" },
  md: { w: 36, h: 27, text: "text-base leading-6" },
};

/**
 * MCTT logo mark + wordmark. `muted` renders the company name in grey (footer);
 * `tone="dark"` is for dark backgrounds (white mark plate, white/lavender text).
 */
export function Logo({ size = "lg", muted = false, tone = "light" }: { size?: Size; muted?: boolean; tone?: "light" | "dark" }) {
  const s = sizes[size];
  const dark = tone === "dark";
  return (
    <span className="flex items-center gap-2.5">
      <Image
        src="/images/logo.png"
        alt=""
        width={s.w}
        height={s.h}
        className={`object-cover ${dark ? "rounded-md bg-white p-0.5" : ""}`}
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
