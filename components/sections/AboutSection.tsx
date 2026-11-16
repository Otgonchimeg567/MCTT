import { about } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { VideoFrame } from "@/components/ui/VideoFrame";

/** Renders **bold** spans inside a content string. */
function RichText({ text }: { text: string }) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-ink">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

/**
 * Plant footage (or photo) under the paragraphs, same 40px step as header → paragraphs.
 * Until files are set in content.ts the live site shows nothing; dev shows a dashed slot saying where they go.
 */
function AboutMedia() {
  const { video, poster, label } = about.media;
  if (video || poster) {
    return (
      <div data-reveal className="pt-10">
        <VideoFrame src={video || undefined} poster={poster || undefined} label={label} />
      </div>
    );
  }
  if (process.env.NODE_ENV !== "development") return null;
  return (
    <div className="pt-10">
      <div className="flex aspect-video w-full flex-col lg:aspect-[21/9] items-center justify-center gap-2 rounded-[28px] border border-dashed border-lavender-muted bg-cream p-6 text-center">
        <p className="font-display text-[17px] font-extrabold text-ink">Үйлдвэрийн видео / зураг</p>
        <p className="max-w-[460px] text-sm leading-[21px] text-muted">
          public/video/plant.mp4 болон public/images/plant-poster.jpg нэмээд lib/content.ts-ийн about.media-д замыг
          бичнэ. Энэ хүрээ зөвхөн dev горимд харагдана.
        </p>
      </div>
    </div>
  );
}

/**
 * Full-bleed white band, the only text-only section, so it is the one band that sits on white.
 *
 * Gestalt: same SectionHeader as every other section (similarity); header → paragraphs at the
 * standard 40px step (proximity). The paragraphs are not a sequence, so no connecting line; the
 * company figures live once, on the Production visual (prägnanz).
 */
export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-6 border-b border-line bg-white py-16 sm:py-24">
      <Container>
        <SectionHeader index={1} tag={about.tag} title={about.title} />

        <div data-reveal-stagger className="grid gap-6 pt-10 md:grid-cols-3 lg:gap-10">
          {about.paragraphs.map((p, i) => (
            <p key={i} className="max-w-[520px] text-[17px] leading-[1.6] text-muted">
              <RichText text={p} />
            </p>
          ))}
        </div>

        <AboutMedia />
      </Container>
    </section>
  );
}
