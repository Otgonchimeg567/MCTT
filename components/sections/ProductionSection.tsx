import { production } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Chip } from "@/components/ui/Chip";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { PreviewPanel } from "@/components/cards/preview/PreviewPanel";
import { StepList } from "@/components/cards/preview/StepList";
import { StatProgress } from "@/components/cards/preview/StatProgress";
import { InfoRows } from "@/components/cards/preview/InfoRows";

export function ProductionSection() {
  return (
    <section id="production" className="scroll-mt-6 py-16 sm:py-24">
      <Container>
        <SectionHeader tag={production.tag} title={production.title} description={production.description} />

        <div className="grid gap-6 pt-10 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Флотацийн технологи"
            description="Хоёр шатны бутлалт, нунтаглалт, үндсэн ба 6 шатны цэвэрлэгээний флотаци."
            action={{ label: "Дэлгэрэнгүй", href: "#contact" }}
            preview={
              <PreviewPanel label="ТЕХНОЛОГИЙН ДАМЖЛАГА">
                <StepList steps={production.steps} />
              </PreviewPanel>
            }
          />

          <FeatureCard
            title="Хүчин чадал"
            description="Жилд 90,000 тн хүдэр боловсруулж, 2025 онд 15,452 тн баяжмал үйлдвэрлэсэн."
            action={{ label: "Дэлгэрэнгүй", href: "#contact" }}
            preview={
              <>
                <PreviewPanel label="ХОНОГИЙН ХҮЧИН ЧАДАЛ">
                  <StatProgress value="375" unit="тн хүдэр" percent={82} />
                </PreviewPanel>
                <div className="pt-3">
                  <PreviewPanel>
                    <InfoRows rows={production.capacityRows} />
                  </PreviewPanel>
                </div>
              </>
            }
          />

          <FeatureCard
            title="Байршил ба тээвэр"
            description="Чойр өртөөнд ойр тул баяжмалыг төмөр замаар тээвэрлэхэд тохиромжтой."
            action={{ label: "Газрын зураг", href: "https://maps.google.com/?q=Сүмбэр+Говьсүмбэр" }}
            preview={
              <>
                <PreviewPanel label="БАЙРШИЛ">
                  <InfoRows rows={production.locationRows} spaced />
                </PreviewPanel>
                <div className="flex gap-2 pt-3.5">
                  {production.locationChips.map((chip) => (
                    <Chip key={chip}>{chip}</Chip>
                  ))}
                </div>
              </>
            }
          />
        </div>
      </Container>
    </section>
  );
}
