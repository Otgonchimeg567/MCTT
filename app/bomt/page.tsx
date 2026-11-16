import type { Metadata } from "next";
import { bomt } from "@/lib/content";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { SectionHeader, SectionIndex } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "БОМТ тайлан — Эм Си Ти Ти ХХК",
  description: bomt.description,
};

export default function BomtPage() {
  return (
    <div className="theme-dark flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12 sm:py-20">
        <Container>
          <a href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-ink">
            <span aria-hidden>←</span> Нүүр хуудас
          </a>
          <SectionHeader tag={bomt.tag} tagTone="green" title={bomt.title} description={bomt.description} />

          <ul className="grid gap-6 pt-10 md:grid-cols-2">
            {bomt.reports.map((r, i) => (
              <li key={r.year}>
                <a
                  href={`/bomt/${r.year}`}
                  className="group/report flex h-full flex-col rounded-[28px] border border-line bg-surface p-6 transition duration-300 hover:-translate-y-1 hover:border-[#2e9bd9]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2e9bd9] sm:p-8"
                >
                  <div className="flex items-start justify-between gap-4">
                    <SectionIndex value={i + 1} />
                    <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted">{r.kind}</span>
                  </div>
                  <p className="pt-10 font-display text-[56px] leading-none font-extrabold text-ink sm:text-[72px]">{r.year}</p>
                  <p className="pt-3 text-lg font-semibold text-body">{r.title}</p>
                  <p className="pt-2 text-[15px] leading-6 text-muted">{r.summary}</p>
                  <div className="mt-auto pt-8">
                    <span className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold transition group-hover/report:shadow-[0_0_28px_-4px_rgba(46,155,217,0.55)]">
                      Дэлгэрэнгүй <span aria-hidden className="transition group-hover/report:translate-x-1">→</span>
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
