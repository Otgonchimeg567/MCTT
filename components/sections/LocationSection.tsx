import { location } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

/**
 * Map of Govisümber aimag (OpenStreetMap embed, no API key). The light OSM tiles are inverted and tinted with a CSS
 * filter so the map sits in the dark theme; a radial vignette fades its edges into the page.
 */
export function LocationSection() {
  const [west, south, east, north] = location.map.bbox;
  const [lat, lon] = location.map.marker;
  const embed = `https://www.openstreetmap.org/export/embed.html?bbox=${west}%2C${south}%2C${east}%2C${north}&layer=mapnik&marker=${lat}%2C${lon}`;
  const full = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=10/${lat}/${lon}`;

  return (
    <section id="location" className="scroll-mt-6 border-t border-line py-16 sm:py-24">
      <Container>
        <SectionHeader index={5} tag={location.tag} title={location.title} description={location.description} />

        <div data-reveal className="grid gap-6 pt-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="relative overflow-hidden rounded-[28px] border border-line bg-surface">
            <iframe
              title="Говьсүмбэр аймгийн газрын зураг"
              src={embed}
              loading="lazy"
              className="block h-[380px] w-full border-0 [filter:invert(0.92)_hue-rotate(180deg)_saturate(0.7)_brightness(0.95)_contrast(0.9)] sm:h-[460px]"
            />
            {/* edge vignette + corner label; pointer-events-none so the map stays draggable */}
            <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_30px_rgba(10,10,10,0.85)]" />
            <div className="pointer-events-none absolute top-4 left-4 flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] text-white/80 backdrop-blur-md">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#2e9bd9] opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-[#2e9bd9]" />
              </span>
              ЧОЙР · ҮЙЛДВЭР ~10 КМ
            </div>
          </div>

          <div className="flex flex-col rounded-[28px] border border-line bg-surface p-6 sm:p-8">
            <dl className="flex flex-col divide-y divide-line">
              {location.facts.map((f) => (
                <div key={f.label} className="flex items-baseline justify-between gap-4 py-3.5 first:pt-0">
                  <dt className="text-sm text-muted">{f.label}</dt>
                  <dd className="text-right font-semibold text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
            <a
              href={full}
              target="_blank"
              rel="noopener"
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-[#2e9bd9]/60 lg:mt-auto"
            >
              Томоор үзэх <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
