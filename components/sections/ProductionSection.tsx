import Image from "next/image";
import { production } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Chip } from "@/components/ui/Chip";
import { FeatureCarousel } from "@/components/cards/FeatureCarousel";
import { PreviewPanel } from "@/components/cards/preview/PreviewPanel";
import { StepList } from "@/components/cards/preview/StepList";
import { StatProgress } from "@/components/cards/preview/StatProgress";
import { InfoRows } from "@/components/cards/preview/InfoRows";
import { RouteStrip } from "@/components/cards/preview/RouteStrip";

/** Title with `titleAccent` drawn in the brand gradient. */
function AccentTitle() {
  const [before, after] = production.title.split(production.titleAccent);
  return (
    <>
      {before}
      <span className="text-brand-gradient">{production.titleAccent}</span>
      {after}
    </>
  );
}

/** Large visual on the left: plant photo (stock placeholder until the company's own photo is in). */
function ProductionVisual() {
  return (
    <div className="group/visual relative isolate h-full min-h-[440px] overflow-hidden rounded-[32px] bg-navy shadow-[0_32px_64px_-28px_rgba(22,22,58,0.55)] lg:min-h-[560px]">
      {/* Pexels (free licence), crushing plant with conveyors. Replace public/images/production-plant.jpg with an own photo. */}
      <Image
        src={production.visualImage}
        alt={production.visualImageAlt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="-z-20 object-cover object-[50%_60%] transition-transform duration-[1500ms] ease-out group-hover/visual:scale-105"
      />
      {/* Brand tint keeps the photo in the site's navy palette; darker at the bottom so the white stats stay readable. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/35 via-brand/20 to-navy/85" />

      <a
        href={production.mapHref}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 py-2 pr-4 pl-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <span aria-hidden className="flex size-7 items-center justify-center rounded-full bg-white text-brand">
          <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
            <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
          </svg>
        </span>
        {production.visualPin}
      </a>

      {/* Hierarchy: the product grade leads (first position, larger, full white); the two volume figures
          step back (smaller, 80% white) behind hairline dividers. */}
      <dl className="absolute inset-x-4 bottom-4 grid grid-cols-[1.25fr_1fr_1fr] items-end rounded-[20px] border border-white/15 bg-white/10 p-4 backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-5">
        {production.visualStats.map((s, i) => (
          <div
            key={s.label}
            className={`flex flex-col-reverse gap-0.5 ${i > 0 ? "border-l border-white/15 pl-3 sm:pl-5" : "pr-3"}`}
          >
            <dt className={`text-[12px] leading-[16px] sm:text-[13px] ${s.key ? "font-semibold text-white" : "text-lavender"}`}>
              {s.label}
            </dt>
            <dd
              className={`font-display leading-tight font-extrabold ${
                s.key ? "text-[30px] text-white sm:text-[40px]" : "text-[20px] text-white/80 sm:text-[26px]"
              }`}
            >
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function ProductionSection() {
  return (
    <section id="production" className="scroll-mt-6 py-16 sm:py-24">
      <Container>
        {/* Header spans both columns so it reads as the title of the visual and the carousel alike (proximity),
            and starts on the same left edge as every other section (similarity). */}
        <SectionHeader index={2} tag={production.tag} title={<AccentTitle />} description={production.description} />

        {/* Position: both columns stretch to one height, so the carousel no longer floats mid-way beside the visual. */}
        <div data-reveal-stagger className="grid items-stretch gap-10 pt-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <ProductionVisual />

          <div className="flex min-w-0 flex-col">
            <div className="flex flex-1 flex-col">
              <FeatureCarousel
                label="Үйлдвэрлэлийн онцлог"
                interval={1000}
                slides={[
                  {
                    title: "Флотацийн технологи",
                    description: "Хоёр шатны бутлалт, нунтаглалт, 6 шатны цэвэрлэгээний флотаци.",
                    action: { label: "Дэлгэрэнгүй", href: "#request" },
                    preview: (
                      <PreviewPanel label="ТЕХНОЛОГИЙН ДАМЖЛАГА" size="lg" bgTone="sand">
                        <StepList steps={production.steps} highlight={production.stepsHighlight} highlightLabel="ГОЛ ШАТ" size="lg" />
                      </PreviewPanel>
                    ),
                  },
                  {
                    title: "Хүчин чадал",
                    description: "Жилд 90,000 тн хүдэр боловсруулж, 2025 онд 15,452 тн баяжмал үйлдвэрлэсэн.",
                    action: { label: "Дэлгэрэнгүй", href: "#request" },
                    // One panel, like the other slides: figure and its conditions share a region (common region, prägnanz).
                    preview: (
                      <PreviewPanel label="ХОНОГИЙН ХҮЧИН ЧАДАЛ" size="lg" bgTone="lavender">
                        <StatProgress value="375" unit="тн хүдэр" percent={82} animateIn size="lg" />
                        <div className="pt-4">
                          <InfoRows rows={production.capacityRows} size="lg" />
                        </div>
                      </PreviewPanel>
                    ),
                  },
                  {
                    title: "Байршил ба тээвэр",
                    description: "Чойр өртөөнд ойр тул баяжмалыг төмөр замаар тээвэрлэхэд тохиромжтой.",
                    action: { label: "Газрын зураг", href: production.mapHref },
                    // Route strip carries the two distances (and stresses the 10 km rail leg); the panel keeps
                    // only the rows the strip doesn't show, so nothing is said twice.
                    preview: (
                      <>
                        <RouteStrip {...production.route} />
                        <PreviewPanel label="БАЙРШИЛ" size="lg" bgTone="lilac">
                          <InfoRows rows={production.locationRows.filter((r) => !("onRoute" in r))} size="lg" />
                          <div className="flex gap-2 pt-3">
                            {production.locationChips.map((chip) => (
                              <Chip key={chip}>{chip}</Chip>
                            ))}
                          </div>
                        </PreviewPanel>
                      </>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
