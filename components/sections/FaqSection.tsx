import { faq } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { SectionTag } from "@/components/ui/SectionTag";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { ChatPreview } from "@/components/cards/ChatPreview";

export function FaqSection() {
  return (
    <section id="suppliers" className="scroll-mt-6 border-t border-line py-16 sm:py-24">
      {/* Narrow text column beside the wider chat so the short copy sits next to what it introduces (proximity). */}
      <Container className="grid items-center gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <div data-reveal className="flex flex-col">
          <SectionTag>{faq.tag}</SectionTag>
          <Heading level="h2" className="pt-3.5">
            {faq.title}
          </Heading>
          <p className="max-w-[460px] pt-4 pb-[26px] text-[17px] leading-[25.5px] text-muted">{faq.description}</p>
          <div>
            <Button href="#request">{faq.cta}</Button>
          </div>
        </div>
        <ChatPreview />
      </Container>
    </section>
  );
}
