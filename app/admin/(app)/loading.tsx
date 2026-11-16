export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite" className="animate-pulse">
      <span className="sr-only">Ачаалж байна…</span>
      <div className="h-8 w-56 rounded-lg bg-line" />
      <div className="mt-2 h-4 w-80 rounded bg-line-soft" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-[20px] bg-white" />
        ))}
      </div>
      <div className="mt-6 h-72 rounded-[22px] bg-white" />
    </div>
  );
}
