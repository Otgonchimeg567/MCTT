import { about, hero } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { SectionTag } from "@/components/ui/SectionTag";
import { Heading } from "@/components/ui/Heading";

/** Not in the Figma frame — added for the "Бидний тухай" nav anchor, styled with the design's section tokens. */
export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-6 pt-16 sm:pt-24">
      <Container>
        <div className="rounded-[28px] border border-line bg-white p-7 sm:p-10">
          <SectionTag>{about.tag}</SectionTag>
          <Heading level="h2" className="pt-3.5">
            {about.title}
          </Heading>
          <p className="max-w-[860px] pt-4 text-[17px] leading-[1.6] text-muted sm:text-[19px]">{about.description}</p>
          <dl className="grid grid-cols-2 gap-3 pt-8 sm:grid-cols-4">
            {hero.stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse rounded-[20px] bg-sand px-5 py-4">
                <dt className="text-sm text-muted">{s.label}</dt>
                <dd className="font-display text-[28px] leading-tight font-extrabold text-brand">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
