export type InfoRow = { label: string; value: string; muted?: boolean };

/** Key/value list with hairline separators. `spaced` adds top padding when it follows a panel label. */
export function InfoRows({ rows, spaced = false }: { rows: InfoRow[]; spaced?: boolean }) {
  return (
    <dl className={spaced ? "pt-2.5" : ""}>
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-start justify-between gap-3 border-b border-line-soft py-2 text-sm leading-[21px] last:border-b-0"
        >
          <dt className="text-ink">{row.label}</dt>
          <dd className={`text-right font-bold ${row.muted ? "text-faint" : "text-ink"}`}>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
