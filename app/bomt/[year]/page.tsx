import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { bomt } from "@/lib/content";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { SectionIndex } from "@/components/ui/SectionHeader";

type Params = Promise<{ year: string }>;

function findReport(year: string) {
  return bomt.reports.find((r) => String(r.year) === year);
}

export function generateStaticParams() {
  return bomt.reports.map((r) => ({ year: String(r.year) }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const report = findReport((await params).year);
  return report ? { title: `БОМТ ${report.year} — Эм Си Ти Ти ХХК`, description: report.summary } : {};
}

const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2 });

export default async function BomtYearPage({ params }: { params: Params }) {
  const report = findReport((await params).year);
  if (!report) notFound();

  const others = bomt.reports.filter((r) => r.year !== report.year);
  const hasSpent = report.budget.some((b) => b.spent !== undefined);
  const totalPlanned = report.budget.reduce((s, b) => s + b.planned, 0);
  const totalSpent = report.budget.reduce((s, b) => s + (b.spent ?? 0), 0);
  const maxValue = Math.max(...report.budget.map((b) => Math.max(b.planned, b.spent ?? 0)));

  return (
    <div className="theme-dark flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12 sm:py-20">
        <Container>
          <a href="/bomt" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-ink">
            <span aria-hidden>←</span> Бүх тайлан
          </a>

          {/* Header */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[760px]">
              <div className="flex items-center gap-3">
                <SectionIndex value={1} />
                <span className="rounded-full border border-[#2e9bd9]/40 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-[#2e9bd9]">
                  БОМТ · {report.kind.toUpperCase()}
                </span>
              </div>
              <h1 className="pt-4 font-display text-[64px] leading-none font-extrabold text-ink sm:text-[96px]">{report.year}</h1>
              <p className="pt-4 text-xl font-semibold text-body sm:text-2xl">{report.title}</p>
              <p className="pt-3 text-[17px] leading-[26px] text-muted">{report.summary}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={report.file}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-[15px] font-semibold transition hover:shadow-[0_0_28px_-4px_rgba(46,155,217,0.55)]"
              >
                PDF нээх <span aria-hidden>↗</span>
              </a>
              <a
                href={report.file}
                download={`MCTT-BOMT-${report.year}.pdf`}
                className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-[15px] font-semibold text-ink transition hover:border-[#2e9bd9]/60"
              >
                Татах <span aria-hidden>↓</span>
              </a>
            </div>
          </div>

          {/* Key figures */}
          <dl className="grid grid-cols-2 gap-4 pt-12 lg:grid-cols-4">
            {report.stats.map((s) => (
              <div key={s.label} className="rounded-[22px] border border-line bg-surface p-5 sm:p-6">
                <dd className="font-display text-[26px] leading-tight font-extrabold text-[#2e9bd9] sm:text-[32px]">{s.value}</dd>
                <dt className="pt-1 text-sm text-muted">{s.label}</dt>
              </div>
            ))}
          </dl>

          {/* Budget + highlights */}
          <div className="grid gap-6 pt-6 lg:grid-cols-[1.4fr_1fr]">
            <section className="rounded-[28px] border border-line bg-surface p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <SectionIndex value={2} />
                <h2 className="text-lg font-bold text-ink">{hasSpent ? "Төсөв ба зарцуулалт" : "Төсөв"}</h2>
              </div>
              <p className="pt-1 text-sm text-muted">мянган төгрөгөөр</p>
              {hasSpent && (
                <div className="flex gap-4 pt-4 text-xs text-muted">
                  <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#5c5c58]" />Төсөв</span>
                  <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#2e9bd9]" />Зарцуулсан</span>
                </div>
              )}
              <ul className="flex flex-col gap-5 pt-6">
                {report.budget.map((b) => (
                  <li key={b.item}>
                    <div className="flex items-baseline justify-between gap-4 text-sm">
                      <span className="text-body">{b.item}</span>
                      <span className="shrink-0 font-mono text-ink tabular-nums">
                        {hasSpent ? `${fmt(b.spent ?? 0)} / ${fmt(b.planned)}` : fmt(b.planned)}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-col gap-1">
                      <span
                        className={`block h-1.5 rounded-full ${hasSpent ? "bg-[#5c5c58]" : "bg-[#2e9bd9]"}`}
                        style={{ width: `${Math.max((b.planned / maxValue) * 100, 1)}%` }}
                      />
                      {hasSpent && (
                        <span className="block h-1.5 rounded-full bg-[#2e9bd9]" style={{ width: `${Math.max(((b.spent ?? 0) / maxValue) * 100, 1)}%` }} />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-baseline justify-between border-t border-line pt-4">
                <span className="font-semibold text-ink">Нийт</span>
                <span className="font-mono font-semibold text-[#2e9bd9] tabular-nums">
                  {hasSpent ? `${fmt(totalSpent)} / ${fmt(totalPlanned)}` : fmt(totalPlanned)}
                </span>
              </div>
            </section>

            <section className="rounded-[28px] border border-line bg-surface p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <SectionIndex value={3} />
                <h2 className="text-lg font-bold text-ink">{hasSpent ? "Гүйцэтгэсэн ажил" : "Гол зорилтууд"}</h2>
              </div>
              <ul className="flex flex-col gap-4 pt-6">
                {report.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-[15px] leading-6 text-body">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-[#2e9bd9]" />
                    {h}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Document */}
          <section className="pt-6">
            <div className="rounded-[28px] border border-line bg-surface p-3 sm:p-4">
              <div className="flex items-center justify-between gap-3 px-2 pt-1 pb-3 sm:px-3">
                <div className="flex items-center gap-3">
                  <SectionIndex value={4} />
                  <h2 className="text-lg font-bold text-ink">Баримт бичиг</h2>
                </div>
                <span className="text-sm text-muted">{report.pages} хуудас</span>
              </div>
              <iframe
                src={`${report.file}#view=FitH`}
                title={`БОМТ ${report.year} — ${report.title}`}
                className="h-[70vh] min-h-[480px] w-full rounded-[20px] border-0 bg-[#181818]"
              />
              <p className="px-2 pt-3 text-sm text-muted sm:px-3">
                Харагдахгүй бол{" "}
                <a href={report.file} target="_blank" rel="noopener" className="text-[#2e9bd9] underline-offset-4 hover:underline">
                  PDF-ийг шинэ цонхонд нээнэ үү
                </a>
                .
              </p>
            </div>
          </section>

          {others.length > 0 && (
            <nav aria-label="Бусад тайлан" className="flex flex-wrap gap-3 pt-10">
              {others.map((o) => (
                <a
                  key={o.year}
                  href={`/bomt/${o.year}`}
                  className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-[#2e9bd9]/60"
                >
                  БОМТ {o.year} · {o.kind} <span aria-hidden>→</span>
                </a>
              ))}
            </nav>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
