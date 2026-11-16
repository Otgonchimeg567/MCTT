import type { CSSProperties } from "react";
import type { PreviewSize } from "./PreviewPanel";

type Props = {
  value: string;
  unit: string;
  /** Fill of the progress bar, 0–100. */
  percent: number;
  /**
   * Grow the bar from 0 when its FeatureCarousel slide becomes active
   * (needs an ancestor with `group/slide` + `data-active`).
   */
  animateIn?: boolean;
  size?: PreviewSize;
};

export function StatProgress({ value, unit, percent, animateIn = false, size = "md" }: Props) {
  const lg = size === "lg";
  return (
    <div>
      <p className="pt-2.5 font-display font-extrabold whitespace-nowrap text-brand">
        <span className={lg ? "text-[48px] leading-[52px]" : "text-[34px] leading-[37.4px]"}>{value} </span>
        <span className={`text-muted ${lg ? "text-lg leading-6" : "text-[15px] leading-[16.5px]"}`}>{unit}</span>
      </p>
      <div
        className={`w-full rounded-full bg-track ${lg ? "mt-3 h-3" : "mt-2 h-2.5"}`}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${value} ${unit}`}
      >
        <div
          className={`h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-violet ${
            animateIn
              ? "w-0 transition-[width] delay-150 duration-700 ease-out group-data-[active=true]/slide:w-(--p)"
              : "w-(--p)"
          }`}
          style={{ "--p": `${percent}%` } as CSSProperties}
        />
      </div>
    </div>
  );
}
