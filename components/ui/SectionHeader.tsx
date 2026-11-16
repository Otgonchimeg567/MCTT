import type { ReactNode } from "react";
import { SectionTag } from "./SectionTag";
import { Heading } from "./Heading";

type Props = {
  tag: string;
  tagTone?: "purple" | "green" | "glass";
  title: ReactNode;
  description?: ReactNode;
  tone?: "light" | "dark";
  /** Section number shown in neon before the tag ("01", "02", …). */
  index?: number;
};

/**
 * Tag → title → description, stacked and close together (Proximity): on wide pages a description
 * pushed to the far right drifts away from the title it explains.
 */
export function SectionHeader({ tag, tagTone = "purple", title, description, tone = "light", index }: Props) {
  const dark = tone === "dark";
  return (
    <div data-reveal className="flex flex-col">
      {index === undefined ? (
        <SectionTag tone={tagTone}>{tag}</SectionTag>
      ) : (
        <div className="flex items-center gap-3">
          <SectionIndex value={index} />
          <SectionTag tone={tagTone}>{tag}</SectionTag>
        </div>
      )}
      <Heading level="h2" tone={tone} className="pt-3.5 text-balance">
        {title}
      </Heading>
      {description && (
        // text-balance: lines of near-equal length, so no short stray last line ("…тайлагнадаг.") — Prägnanz.
        <p className={`max-w-[620px] pt-3 text-[17px] leading-[25.5px] text-balance ${dark ? "text-lavender" : "text-muted"}`}>
          {description}
        </p>
      )}
    </div>
  );
}

/** Neon section number with a short rule, e.g. "01 ——". */
export function SectionIndex({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-3 font-mono text-sm font-semibold tracking-[0.2em] text-[#2e9bd9] [text-shadow:0_0_12px_rgba(46,155,217,0.55)]">
      {String(value).padStart(2, "0")}
      <span aria-hidden className="h-px w-8 bg-[#2e9bd9]/60" />
    </span>
  );
}
