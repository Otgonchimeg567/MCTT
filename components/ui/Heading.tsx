import type { ReactNode } from "react";

type Level = "h1" | "h2" | "h3" | "h4";

/** Type scale from the Figma file — documented in /styleguide (section 04). */
const levels: Record<Level, string> = {
  h1: "text-[36px] leading-[1.3] tracking-[-0.02em] sm:text-[56px] sm:leading-[84px]",
  h2: "text-[32px] leading-[1.25] tracking-[-0.02em] sm:text-[48px] sm:leading-[72px]",
  h3: "text-[22px] leading-[33px]",
  h4: "text-[17px] leading-[25.5px]",
};

type Props = {
  level: Level;
  /** Render a different element with the same style (e.g. "p" in the styleguide). */
  as?: Level | "p" | "span";
  tone?: "light" | "dark";
  id?: string;
  className?: string;
  children: ReactNode;
};

export function Heading({ level, as, tone = "light", id, className = "", children }: Props) {
  const Tag = as ?? level;
  return (
    <Tag id={id} className={`font-display font-extrabold ${tone === "dark" ? "text-white" : "text-ink"} ${levels[level]} ${className}`}>
      {children}
    </Tag>
  );
}
