import Image from "next/image";
import { bomt, hero } from "@/lib/content";
import { HeroFx } from "@/components/motion/HeroFx";

/**
 * Interactive hero. Layers, back to front:
 * 1. lattice canvas (HeroFx) — points bend away from the pointer, clicks send a ripple;
 * 2. giant "CaF₂" watermark — outline only, filled lime inside a spotlight that follows the pointer;
 * 3. the fluorite crystal — tilts toward the pointer, floats, spins when clicked; chips orbit around it;
 * 4. БОМТ card, then a scrolling ticker of key figures along the bottom edge.
 */
export function SplitHero() {
  const [radius, angleStep] = ["var(--orbit-r)", 360 / hero.orbit.length];
  const ticker = [...hero.ticker, ...hero.ticker]; // doubled so the -50% marquee loops seamlessly

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate min-h-[100svh] cursor-crosshair overflow-hidden bg-navy md:h-[100svh] md:min-h-[680px]"
    >
      <h1 id="hero-title" className="sr-only">
        {hero.title} — {hero.tagline}
      </h1>

      {/* 1. Lattice */}
      <HeroFx />

      {/* Ambient glow, drifting against the pointer */}
      <div
        aria-hidden
        className="hero-parallax pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_35%_45%_at_42%_42%,rgba(46,155,217,0.09),transparent_70%),radial-gradient(ellipse_35%_45%_at_58%_44%,rgba(167,139,250,0.16),transparent_70%)]"
      />

      {/* 2. CaF₂ watermark: outline + pointer spotlight fill */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center pb-[18svh] select-none md:pb-[14svh]">
        <span className="font-display text-[34vw] leading-none font-extrabold tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.07)] md:text-[24vw]">
          CaF₂
        </span>
      </div>
      <div aria-hidden className="hero-spotlight pointer-events-none absolute inset-0 flex items-center justify-center pb-[18svh] select-none md:pb-[14svh]">
        <span className="bg-gradient-to-br from-[#2e9bd9] via-[#b9a8f5] to-[#2e9bd9] bg-clip-text font-display text-[34vw] leading-none font-extrabold tracking-tighter text-transparent opacity-60 md:text-[24vw]">
          CaF₂
        </span>
      </div>

      {/* 3. Crystal + orbit */}
      <div className="pointer-events-none absolute inset-x-0 top-[12svh] bottom-[26svh] flex items-center justify-center [--orbit-r:150px] sm:[--orbit-r:190px] md:top-[11svh] md:bottom-[16svh] md:[--orbit-r:200px] lg:[--orbit-r:215px]">
        {/* dashed orbit path */}
        <div aria-hidden className="absolute size-[calc(var(--orbit-r)*2)] rounded-full border border-dashed border-white/10" />
        <div aria-hidden className="absolute size-[calc(var(--orbit-r)*2-60px)] rounded-full border border-white/[0.04]" />

        {/* orbiting chips */}
        <div aria-hidden className="absolute size-0 animate-[orbit_48s_linear_infinite] motion-reduce:animate-none">
          {hero.orbit.map((label, i) => (
            <div
              key={label}
              className="absolute top-0 left-0"
              style={{ transform: `rotate(${i * angleStep}deg) translateX(${radius}) rotate(${-i * angleStep}deg)` }}
            >
              <span className="block -translate-x-1/2 -translate-y-1/2">
                <span className="block animate-[orbit-rev_48s_linear_infinite] motion-reduce:animate-none">
                  <span className="block rounded-full border border-white/15 bg-black/50 px-3 py-1 font-mono text-[11px] font-semibold whitespace-nowrap text-white/80 backdrop-blur-md sm:text-xs">
                    <span className="mr-1.5 inline-block size-1.5 rounded-full bg-[#2e9bd9] align-middle shadow-[0_0_8px_#2e9bd9]" />
                    {label}
                  </span>
                </span>
              </span>
            </div>
          ))}
        </div>

        {/* crystal: click to spin (HeroFx), tilt from --tx/--ty, gentle float */}
        <div className="[perspective:1000px]">
          <div className="hero-tilt [transform-style:preserve-3d]">
            <div className="animate-[contact-float_6s_ease-in-out_infinite] motion-reduce:animate-none">
              <div data-crystal className="pointer-events-auto cursor-pointer [transform-style:preserve-3d]" title="Дарж эргүүлээрэй">
                <Image
                  src="/images/crystal.svg"
                  alt="Жоншны талст"
                  width={300}
                  height={360}
                  priority
                  className="h-auto w-[150px] drop-shadow-[0_30px_60px_rgba(106,79,209,0.55)] select-none sm:w-[190px] md:w-[230px] lg:w-[260px]"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4b. Ticker */}
      <div className="absolute inset-x-0 bottom-0 z-20 overflow-hidden border-t border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex w-max animate-[marquee_40s_linear_infinite] py-3 hover:[animation-play-state:paused] motion-reduce:animate-none">
          {ticker.map((item, i) => (
            <span key={i} aria-hidden={i >= hero.ticker.length} className="flex items-center gap-6 pr-6 font-mono text-xs tracking-[0.12em] whitespace-nowrap text-white/60 uppercase sm:text-[13px]">
              {item}
              <span className="text-[#2e9bd9]">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* БОМТ: no box — a neon arrow + two short words in the bottom-left corner, older years as a quiet text link. */}
      {(() => {
        const [latest, ...older] = bomt.reports.slice().sort((a, b) => b.year - a.year);
        return (
          <div className="absolute bottom-[64px] left-5 z-20 flex flex-col gap-2 sm:left-10 md:bottom-[72px]">
            <a
              href={`/bomt/${latest.year}`}
              className="group/bomt flex items-center gap-3 text-white focus-visible:outline-none"
            >
              <span
                aria-hidden
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#2e9bd9] text-lg text-[#0a0a0a] shadow-[0_0_24px_-4px_rgba(46,155,217,0.7)] transition duration-500 ease-out group-hover/bomt:-rotate-45 group-hover/bomt:shadow-[0_0_32px_-2px_rgba(46,155,217,0.85)] group-focus-visible/bomt:-rotate-45 group-focus-visible/bomt:outline-2 group-focus-visible/bomt:outline-offset-4 group-focus-visible/bomt:outline-[#2e9bd9]"
              >
                →
              </span>
              <span className="flex flex-col">
                <span className="font-display text-[17px] leading-tight font-extrabold sm:text-[19px]">
                  БОМТ {latest.year}{" "}
                  <span className="font-sans text-[14px] font-medium text-white/55 transition group-hover/bomt:text-white">
                    {latest.kind.toLowerCase()}
                  </span>
                </span>
              </span>
            </a>
            {older.map((r) => (
              <a
                key={r.year}
                href={`/bomt/${r.year}`}
                className="ml-14 w-fit font-mono text-[11px] tracking-[0.08em] text-white/40 underline-offset-4 transition hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2e9bd9]"
              >
                {r.year} {r.kind.toLowerCase()} →
              </a>
            ))}
          </div>
        );
      })()}
    </section>
  );
}
