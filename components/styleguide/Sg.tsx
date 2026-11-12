import type { ReactNode } from "react";

/** Numbered top-level section: "01  Зарчим" with a hairline under it. */
export function SgSection({ id, num, title, children }: { id: string; num: number; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 pt-20 first:pt-12">
      <div className="flex items-baseline gap-3 border-b border-line pb-4">
        <span className="text-xs text-muted tabular-nums">{String(num).padStart(2, "0")}</span>
        <h2 className="font-display text-[28px] leading-tight font-extrabold text-ink sm:text-[32px]">{title}</h2>
      </div>
      <div className="flex flex-col gap-12 pt-8">{children}</div>
    </section>
  );
}

export function SgSub({ title, code, description, children }: { title: string; code?: string; description?: ReactNode; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-ink">
        {title}
        {code && (
          <>
            {" · "}
            <Code>{code}</Code>
          </>
        )}
      </h3>
      {description && <p className="max-w-[640px] pt-2 text-[15px] leading-[1.6] text-muted">{description}</p>}
      <div className="pt-5">{children}</div>
    </div>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return <code className="rounded-md bg-sand px-1.5 py-0.5 font-mono text-[0.85em] text-brand">{children}</code>;
}

/** Caption under a live component demo. */
export function SgDemo({ name, file, children, note, dark = false }: { name: string; file: string; note?: ReactNode; dark?: boolean; children: ReactNode }) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-lg font-semibold text-ink">{name}</h3>
        <code className="font-mono text-xs text-muted">{file}</code>
      </div>
      {note && <p className="max-w-[680px] pt-2 text-[15px] leading-[1.6] text-muted">{note}</p>}
      <div className={`mt-5 rounded-[20px] border border-line p-6 sm:p-8 ${dark ? "bg-contact-gradient" : "bg-white"}`}>{children}</div>
    </div>
  );
}

export function PropRow({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-line-soft py-2.5 text-sm last:border-b-0 sm:flex-row sm:gap-4">
      <code className="w-48 shrink-0 font-mono text-[13px] text-brand">{name}</code>
      <span className="text-muted">{children}</span>
    </div>
  );
}
