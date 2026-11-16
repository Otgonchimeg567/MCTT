import type { ReactNode } from "react";
import { navLinks } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { Container, pageGutter } from "./Container";

/** `overlay` floats the bar transparently over a dark full-screen hero. */
export function Navbar({ overlay = false }: { overlay?: boolean }) {
  const link = overlay ? "text-white/80 hover:text-white" : "text-body hover:text-brand";
  // White ring over the dark hero, brand-blue on light pages.
  const focus = `rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 ${
    overlay ? "focus-visible:outline-white" : "focus-visible:outline-brand-blue"
  }`;
  const pill = overlay ? "border-white/20 bg-white/10 text-white backdrop-blur" : "border-line bg-white text-ink";

  // Over the full-bleed hero the bar spans the viewport edge to edge; elsewhere it sits on the container grid.
  const Wrap = overlay ? EdgeBar : Container;

  return (
    <header className={overlay ? "absolute inset-x-0 top-0 z-30" : undefined}>
      <Wrap className="relative flex h-[76px] items-center justify-between sm:h-[88px]">
        <a href="/" aria-label="Нүүр хуудас" className={focus}>
          <Logo tone={overlay ? "dark" : "light"} />
        </a>

        {/* Full menu only from xl: with the larger logo, 5 links + CTA don't fit on one line at 1024–1279px. */}
        <nav aria-label="Үндсэн цэс" className="hidden items-center gap-[30px] xl:flex">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className={`relative text-[15px] leading-[22.5px] font-medium transition after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 ${link} ${focus}`}>
              {l.label}
            </a>
          ))}
        </nav>

        {/* ml-auto keeps MN + CTA beside the menu button when the full nav is hidden */}
        <div className="ml-auto hidden items-center gap-2.5 sm:flex xl:ml-0">
          <span className={`rounded-full border px-3.5 py-2 text-[13px] leading-[19.5px] font-semibold ${pill}`}>🌐 MN</span>
          <Button href="/#request" variant={overlay ? "inverse" : "primary"}>
            Үнийн санал авах
          </Button>
        </div>

        {/* Mobile menu — native <details>, no client JS needed */}
        <details className="group xl:hidden sm:ml-3">
          <summary
            aria-label="Цэс нээх"
            className={`flex size-10 cursor-pointer list-none items-center justify-center rounded-full border [&::-webkit-details-marker]:hidden ${pill} ${focus}`}
          >
            <span className="text-lg leading-none group-open:hidden">☰</span>
            <span className="hidden text-lg leading-none group-open:inline">✕</span>
          </summary>
          <nav
            aria-label="Гар утасны цэс"
            className="absolute inset-x-4 top-[72px] z-20 sm:top-[84px] flex flex-col gap-1 rounded-[20px] border border-line bg-white p-3 shadow-[0_12px_30px_rgba(59,45,143,0.12)]"
          >
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="rounded-xl px-3 py-2.5 text-[15px] font-medium text-body hover:bg-cream focus-visible:outline-2 focus-visible:outline-brand-blue">
                {l.label}
              </a>
            ))}
            <Button href="/#request" className="mt-2 sm:hidden">
              Үнийн санал авах
            </Button>
          </nav>
        </details>
      </Wrap>
    </header>
  );
}

/** Full-width bar on the shared page gutter, so the logo lines up with every section below. */
function EdgeBar({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`${pageGutter} ${className}`}>{children}</div>;
}
