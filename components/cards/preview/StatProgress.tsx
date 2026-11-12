type Props = {
  value: string;
  unit: string;
  /** Fill of the progress bar, 0–100. */
  percent: number;
};

export function StatProgress({ value, unit, percent }: Props) {
  return (
    <div>
      <p className="pt-2.5 font-display font-extrabold whitespace-nowrap text-brand">
        <span className="text-[34px] leading-[37.4px]">{value} </span>
        <span className="text-[15px] leading-[16.5px] text-muted">{unit}</span>
      </p>
      <div
        className="mt-2 h-2.5 w-full rounded-full bg-track"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${value} ${unit}`}
      >
        <div className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-violet" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
