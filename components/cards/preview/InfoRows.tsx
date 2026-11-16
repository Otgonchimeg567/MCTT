import type { PreviewSize } from "./PreviewPanel";

export type InfoRow = {
  label: string;
  value: string;
  muted?: boolean;
  /** Marks the one row that matters most: lilac background, brand-coloured value. */
  highlight?: boolean;
};

/**
 * Key/value list with hairline separators. Labels are muted and values bold so the eye lands on the values.
 * `spaced` adds top padding when it follows a panel label. `size="lg"` matches PreviewPanel lg.
 */
export function InfoRows({ rows, spaced = false, size = "md" }: { rows: InfoRow[]; spaced?: boolean; size?: PreviewSize }) {
  const lg = size === "lg";
  return (
    <dl className={spaced ? "pt-2.5" : ""}>
      {rows.map((row) => (
        <div
          key={row.label}
          className={`flex items-start justify-between gap-3 border-b last:border-b-0 ${
            lg ? "py-3 text-lg leading-7" : "py-2 text-sm leading-[21px]"
          } ${row.highlight ? "-mx-2 rounded-[10px] border-transparent bg-lilac px-2" : "border-line-soft"}`}
        >
          <dt className={row.highlight ? "font-semibold text-brand" : "text-muted"}>{row.label}</dt>
          <dd className={`text-right font-bold ${row.muted ? "text-faint" : row.highlight ? "text-brand" : "text-ink"}`}>
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
