type Props = {
  /** Three stops, start → rail station → plant. */
  stops: readonly [string, string, string] | readonly string[];
  /** Label for the whole line (start → plant). */
  total: string;
  /** Label for the last leg (station → plant) — the fact this strip exists to stress. */
  lastLeg: string;
};

/**
 * Start ─ ─ ─ station ━━ plant. Not to scale: the short last leg is drawn bold in the brand gradient and labelled in
 * brand colour, the long first leg is a quiet dashed line (emphasis by colour, weight and contrast).
 * The last leg draws in when its FeatureCarousel slide becomes active (needs `group/slide` + `data-active`).
 */
export function RouteStrip({ stops, total, lastLeg }: Props) {
  const [start, station, end] = stops;
  return (
    <div className="mx-auto w-full max-w-[580px] px-1 pb-5">
      <p className="pb-2 text-center text-[11px] leading-4 font-semibold tracking-[0.06em] text-muted">{total}</p>

      <div className="flex items-center">
        <Dot />
        <span aria-hidden className="h-0 flex-[2.2] border-t-2 border-dashed border-lavender-muted" />
        <Dot />
        <span aria-hidden className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-lavender">
          <span className="absolute inset-y-0 left-0 w-0 rounded-full bg-gradient-to-r from-brand-blue to-brand-violet transition-[width] delay-200 duration-700 ease-out group-data-[active=true]/slide:w-full" />
        </span>
        <span aria-hidden className="size-4 shrink-0 rounded-full border-[3px] border-white bg-brand shadow-[0_0_0_4px_rgba(59,45,143,0.18)]" />
      </div>

      <div className="flex pt-2 text-xs leading-[18px]">
        <span className="flex-[2.2] font-medium text-muted">{start}</span>
        <span className="flex flex-1 flex-col items-start font-medium text-body">
          {station}
          <span className="font-display text-[15px] font-extrabold text-brand">{lastLeg}</span>
        </span>
        <span className="font-bold text-ink">{end}</span>
      </div>
    </div>
  );
}

function Dot() {
  return <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-lavender-muted" />;
}
