import type { CSSProperties, ReactNode } from "react";
import { CrystalTilt } from "@/components/motion/CrystalTilt";
import { contact } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { ContactInfoCard } from "@/components/cards/ContactInfoCard";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

type ServiceIcon =(typeof contact.services)[number]["icon"];

// Lucide shapes (ISC licence), stroked.
const serviceIcons: Record<ServiceIcon, ReactNode> = {
  gem: (
    <>
      <path d="M6 3h12l4 6-10 13L2 9Z" />
      <path d="M11 3 8 9l4 13 4-13-3-6" />
      <path d="M2 9h20" />
    </>
  ),
  ore: <path d="m8 3 4 8 5-5 5 15H2L8 3z" />,
  train: (
    <>
      <rect x="4" y="3" width="16" height="16" rx="2" />
      <path d="M4 11h16M12 3v8M8 15h.01M16 15h.01m-8 4-2 3m12 0-2-3" />
    </>
  ),
  contract: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M8 13h8M8 17h5" />
    </>
  ),
};

/** Dark rounded panel with a title row; every group on the right sits in one of these (common region). */
function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 sm:p-6">
      <div className="flex items-center justify-between px-1 pb-4">
        <h3 className="text-[17px] leading-6 font-bold text-white">{title}</h3>
        <span aria-hidden className="text-lavender">
          {icon}
        </span>
      </div>
      {children}
    </div>
  );
}

/** Whole tile is a link to the request form: lifts, lights its icon and shows an arrow on hover/focus. */
function ServiceTile({ icon, title, text }: { icon: ServiceIcon; title: string; text: string }) {
  return (
    <li>
      <a
        href="#request"
        className="group/tile flex h-full items-start gap-3 rounded-[16px] border border-transparent bg-white/[0.06] p-4 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-0 active:scale-[0.98]"
      >
        <span
          aria-hidden
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition duration-300 group-hover/tile:scale-110 group-hover/tile:bg-brand group-hover/tile:text-on-brand group-focus-visible/tile:bg-brand group-focus-visible/tile:text-on-brand"
        >
          <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            {serviceIcons[icon]}
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] leading-[22px] font-semibold text-white">{title}</span>
          <span className="block pt-0.5 text-[13px] leading-[19px] text-lavender/80">{text}</span>
        </span>
        <span
          aria-hidden
          className="-translate-x-1 self-center text-white opacity-0 transition duration-300 group-hover/tile:translate-x-0 group-hover/tile:opacity-100 group-focus-visible/tile:translate-x-0 group-focus-visible/tile:opacity-100"
        >
          →
        </span>
      </a>
    </li>
  );
}

/**
 * Left: the product (fluorite crystal) floating at an angle on a blue glow. Right: header + CTA, then two panels —
 * what we cooperate on, and how to reach us.
 */
export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-6 pb-16 sm:pb-24">
      <Container>
        <div className="relative isolate grid items-center gap-10 overflow-hidden rounded-[36px] border border-line bg-surface p-6 sm:p-10 lg:grid-cols-[5fr_7fr] lg:gap-14 lg:p-14">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_at_25%_50%,black_0%,transparent_60%)]"
          />

          {/* Entrance order: crystal, then the text, then each panel (tiles stagger inside). */}
          <div data-reveal className="relative min-h-[300px] sm:min-h-[380px] lg:min-h-[560px]">
            <CrystalTilt alt={contact.visualAlt} />
          </div>

          <div className="flex min-w-0 flex-col gap-5">
            <div data-reveal style={delay(120)} className="pb-2">
              <SectionHeader tag={contact.tag} tagTone="glass" title={contact.title} tone="dark" />
              <p className="max-w-[480px] pt-4 pb-6 text-[17px] leading-[25.5px] text-lavender">{contact.description}</p>
              <Button href="#request" className="group/cta gap-2">
                {contact.cta}
                <span aria-hidden className="transition-transform duration-300 group-hover/cta:translate-x-1">
                  →
                </span>
              </Button>
            </div>

            <div data-reveal style={delay(240)}>
            <Panel
              title={contact.servicesTitle}
              icon={
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  <rect x="2" y="6" width="20" height="14" rx="2" />
                </svg>
              }
            >
              <ul data-reveal-stagger className="grid gap-3 sm:grid-cols-2">
                {contact.services.map((s) => (
                  <ServiceTile key={s.title} {...s} />
                ))}
              </ul>
            </Panel>
            </div>

            <div data-reveal style={delay(360)}>
            <Panel
              title={contact.contactTitle}
              icon={
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
                </svg>
              }
            >
              <div className="flex flex-col gap-3">
                {contact.items.map((item) => (
                  <ContactInfoCard key={item.label} {...item} />
                ))}
              </div>
            </Panel>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
