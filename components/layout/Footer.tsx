import { company, hero, navLinks } from "@/lib/content";
import { Logo } from "@/components/ui/Logo";
import { Container } from "./Container";

const focus = "rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/**
 * Two tiers: brand + navigation + phone on top, legal line underneath in the smallest, quietest type.
 * Navy like the header over the hero, so the page opens and closes on the same surface; text uses the
 * dark-surface roles from the styleguide (white / lavender / lavender-muted, lines white/12).
 */
export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <Container className="flex flex-col gap-8 pt-12 pb-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-3">
          <Logo size="md" tone="dark" />
          <p className="text-xs font-semibold tracking-[0.24em] text-lavender-muted">{hero.tagline}</p>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-12">
          <nav aria-label="Доод цэс" className="grid grid-cols-2 gap-x-8 gap-y-2 sm:flex sm:flex-col">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className={`text-[15px] leading-[22.5px] text-white/80 transition hover:text-white ${focus}`}>
                {l.label}
              </a>
            ))}
          </nav>
          <div>
            <p className="pb-1 text-xs leading-[18px] font-semibold tracking-[0.96px] text-lavender-muted">УТАС</p>
            <a href={company.phoneHref} className={`font-display text-[20px] leading-[28px] font-extrabold text-white hover:text-lavender ${focus}`}>
              {company.phoneDisplay}
            </a>
          </div>
        </div>
      </Container>

      <Container>
        <p className="border-t border-white/12 pt-5 pb-8 text-[13px] leading-[19.5px] text-lavender-muted">
          © 2026 {company.name} {company.suffix}. Бүх эрх хуулиар хамгаалагдсан.
        </p>
      </Container>
    </footer>
  );
}
