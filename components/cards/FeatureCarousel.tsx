"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";

export type CarouselSlide = {
  title: string;
  description: string;
  action: { label: string; href: string };
  /** Illustrative preview rendered in the 300px panel at the top of the card. */
  preview: ReactNode;
  previewTone?: "light" | "dark";
};

type Props = {
  slides: CarouselSlide[];
  /** Accessible name for the carousel region. */
  label: string;
  /** Auto-advance delay in ms. Pauses on hover/focus and when reduced motion is requested. */
  interval?: number;
};

/**
 * One card that cycles through several feature previews; counter and pill dots sit in
 * the card's top row. All slides stay mounted so the card keeps the height
 * of the tallest one and the text remains in the HTML.
 */
export function FeatureCarousel({ slides, label, interval = 6000 }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // Unique per instance so two carousels on one page (e.g. /styleguide) don't share ids.
  const uid = useId();
  const slideId = (i: number) => `${uid}-slide-${i}`;

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setActive((i) => (i + 1) % slides.length), interval);
    return () => window.clearTimeout(id);
  }, [active, paused, interval, slides.length]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className="flex min-w-0 flex-1 flex-col rounded-[28px] border border-line bg-white px-4 pt-3 pb-[22px] shadow-[0_24px_48px_-28px_rgba(20,20,43,0.25)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Controls live inside the card so they read as part of what they control (common region). */}
      <div className="flex items-center justify-between px-2.5 pb-3">
        {/* Current slide number leads (ink, larger); the total steps back (faint). */}
        <p aria-hidden className="font-bold tracking-[0.88px] tabular-nums">
          <span className="text-[15px] leading-[22px] text-ink">{pad(active + 1)}</span>
          <span className="text-[11px] leading-[16.5px] text-faint"> / {pad(slides.length)}</span>
        </p>
        <div role="tablist" aria-label={`${label} — хэсэг сонгох`} className="-mr-1.5 flex">
          {slides.map((slide, i) => {
            const isActive = i === active;
            return (
              <button
                key={slide.title}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={slideId(i)}
                aria-label={slide.title}
                onClick={() => setActive(i)}
                className="group flex items-center justify-center rounded-full p-1.5 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-brand-blue"
              >
                <span
                  className={`block h-2 overflow-hidden rounded-full transition-all duration-300 ${
                    isActive ? "w-6 bg-lavender" : "w-2 bg-lavender group-hover:bg-lavender-muted"
                  }`}
                >
                  {/* Active dot fills like a timer until the next auto-advance; restarts per slide, holds while paused. */}
                  {isActive && (
                    <span
                      key={active}
                      className="block h-full origin-left bg-brand-gradient"
                      style={{
                        animation: `carousel-progress ${interval}ms linear forwards`,
                        animationPlayState: paused ? "paused" : "running",
                      }}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid flex-1">
        {slides.map((slide, i) => {
          const isActive = i === active;
          const external = slide.action.href.startsWith("http");
          return (
            <div
              key={slide.title}
              id={slideId(i)}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${slides.length}: ${slide.title}`}
              aria-hidden={!isActive}
              inert={!isActive}
              data-active={isActive}
              className={`group/slide flex flex-col transition duration-500 ease-out [grid-area:1/1] ${
                isActive ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
              }`}
            >
              <div
                className={`relative flex min-h-[300px] flex-1 flex-col justify-center overflow-clip rounded-[20px] p-[22px] ${
                  slide.previewTone === "dark" ? "bg-night-gradient" : "bg-sand"
                }`}
              >
                {/* Brand dot pattern, kept faint so it textures the panel without competing with the content */}
                <span
                  aria-hidden
                  className={`absolute inset-0 [background-size:16px_16px] ${
                    slide.previewTone === "dark"
                      ? "[background-image:radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)]"
                      : "[background-image:radial-gradient(rgba(59,45,143,0.10)_1px,transparent_1px)]"
                  }`}
                />
                <div className="relative">{slide.preview}</div>
              </div>
              <div className="flex flex-col gap-4 px-2.5 pt-[22px] sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <Heading level="h3">{slide.title}</Heading>
                  <p className="pt-1.5 text-[15px] leading-[22.5px] text-muted">{slide.description}</p>
                </div>
                <Button
                  href={slide.action.href}
                  size="sm"
                  className="shrink-0 self-start gap-1.5 sm:self-end"
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {slide.action.label}
                  <span aria-hidden>→</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
