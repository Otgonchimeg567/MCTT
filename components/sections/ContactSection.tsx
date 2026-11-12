import { contact } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { ContactInfoCard } from "@/components/cards/ContactInfoCard";

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-6 pb-16 sm:pb-24">
      <Container>
        <div className="grid gap-10 rounded-[36px] bg-contact-gradient p-7 sm:p-12 lg:grid-cols-[563fr_469fr] lg:p-16">
          <div className="flex flex-col">
            <SectionHeader tag={contact.tag} tagTone="glass" title={contact.title} tone="dark" />
            <p className="pt-4 pb-7 text-[17px] leading-[25.5px] text-lavender">{contact.description}</p>
            <div>
              <Button href="#request" variant="inverse">
                {contact.cta}
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {contact.items.map((item) => (
              <ContactInfoCard key={item.label} {...item} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
