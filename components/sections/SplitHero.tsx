import Image from "next/image";
import { hero } from "@/lib/content";
import { Heading } from "@/components/ui/Heading";

const tones = {
  night: "bg-night-gradient",
  brand: "bg-brand-gradient",
} as const;

// Decorative crystal placement per door (left / right).
const crystalArt = [
  "-left-16 top-[14%] w-[340px] -rotate-12 sm:w-[420px]",
  "-right-20 top-[8%] w-[300px] rotate-[14deg] sm:w-[380px]",
];

/**
 * Full-screen split entry: one half per audience (buyers / ore suppliers),
 * brand mark centred on the seam. Hovering a half widens it and dims the other.
 */
export function SplitHero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="group/split relative flex min-h-[100svh] flex-col bg-navy md:h-[100svh] md:min-h-[620px] md:flex-row"
    >
      {/* Brand mark — its own block on mobile, centred over the seam on desktop */}
      <div className="relative z-10 flex flex-col items-center px-4 pt-[112px] pb-10 text-center text-white md:pointer-events-none md:absolute md:inset-0 md:justify-center md:p-0">
        <span className="text-xs font-semibold tracking-[0.24em] text-lavender">{hero.eyebrow}</span>
        <Heading level="h1" tone="dark" id="hero-title" className="pt-1">
          {hero.title}
        </Heading>
        <span className="text-xs font-semibold tracking-[0.32em] text-white/80 sm:text-sm">{hero.tagline}</span>
      </div>

      {hero.doors.map((door, i) => (
        <a
          key={door.href}
          href={door.href}
          className="group/door relative flex min-h-[38svh] flex-1 items-end justify-center overflow-hidden pb-12 text-center text-white transition-[flex-grow,filter] duration-700 ease-out focus-visible:outline-2 focus-visible:-outline-offset-8 focus-visible:outline-white md:pb-[16vh] md:hover:grow-[1.3] group-hover/split:not-hover:brightness-[0.6] md:[&+&]:border-l md:[&+&]:border-white/10"
        >
          <div
            aria-hidden
            className={`absolute inset-0 ${tones[door.tone]} transition-transform duration-[1200ms] ease-out group-hover/door:scale-105`}
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle,rgba(255,255,255,0.35)_1px,transparent_1.2px)] [background-size:24px_24px]"
          />
          <Image
            src="/images/crystal.svg"
            alt=""
            width={300}
            height={360}
            className={`absolute opacity-20 transition-transform duration-[1200ms] ease-out group-hover/door:scale-110 ${crystalArt[i]}`}
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/5 to-black/55" />

          <div className="relative flex flex-col items-center gap-2 px-6">
            <span className="text-xs font-semibold tracking-[0.2em] text-lavender">{door.tag}</span>
            <span className="font-display text-[30px] leading-tight font-extrabold sm:text-[40px]">{door.title}</span>
            <span className="pt-1 text-sm font-medium text-white/75 transition md:translate-y-2 md:opacity-0 md:group-hover/door:translate-y-0 md:group-hover/door:opacity-100 md:group-focus-visible/door:opacity-100">
              {door.cta} →
            </span>
          </div>
        </a>
      ))}
    </section>
  );
}
