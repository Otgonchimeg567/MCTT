import { Chip } from "@/components/ui/Chip";
import type { PreviewSize } from "./PreviewPanel";

type Props = {
  steps: string[];
  /** 0-based index of the key step. When set, only that step keeps the brand colour; the rest step back. */
  highlight?: number;
  /** Chip shown on the highlighted step. */
  highlightLabel?: string;
  size?: PreviewSize;
};

/**
 * Numbered process. A thin line runs between the number badges so the steps read as one
 * sequence (uniform connectedness) — it replaces the old row separators.
 */
export function StepList({ steps, highlight, highlightLabel, size = "md" }: Props) {
  const focused = highlight !== undefined;
  const lg = size === "lg";
  // Badge size drives where the connecting line sits: centre x = row padding (8px) + badge/2.
  const badge = lg ? "size-7 rounded-[14px] text-[13px]" : "size-6 rounded-xl text-xs";
  const line = lg
    ? "top-[calc(50%+14px)] left-[21.5px] h-[calc(100%-28px)]"
    : "top-[calc(50%+12px)] left-[19.5px] h-[calc(100%-24px)]";
  return (
    <ol className="pt-2.5">
      {steps.map((step, i) => {
        const isKey = i === highlight;
        const quiet = focused && !isKey;
        const last = i === steps.length - 1;
        return (
          <li
            key={step}
            className={`relative -mx-2 flex items-center rounded-[10px] px-2 ${lg ? "gap-3 py-2" : "gap-2.5 py-[7px]"} ${
              isKey ? "bg-lilac" : ""
            }`}
          >
            {!last && <span aria-hidden className={`absolute w-px bg-lavender ${line}`} />}
            <span
              className={`relative flex shrink-0 items-center justify-center leading-[18px] font-semibold ${badge} ${
                quiet ? "bg-track text-muted" : "bg-brand-gradient-diagonal text-white"
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`font-semibold ${lg ? "text-base leading-6" : "text-sm leading-[21px]"} ${
                quiet ? "text-body" : isKey ? "text-brand" : "text-ink"
              }`}
            >
              {step}
            </span>
            {isKey && highlightLabel && (
              <span className="ml-auto">
                <Chip tone="brand">{highlightLabel}</Chip>
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
