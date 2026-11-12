export function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="pt-2.5">
      {steps.map((step, i) => (
        <li key={step} className="flex items-center gap-2.5 border-b border-line-soft py-[7px] last:border-b-0">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-xl bg-brand-gradient-diagonal text-xs leading-[18px] font-semibold text-white">
            {i + 1}
          </span>
          <span className="text-sm leading-[21px] font-semibold text-ink">{step}</span>
        </li>
      ))}
    </ol>
  );
}
