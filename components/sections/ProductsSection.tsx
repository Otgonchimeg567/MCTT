import { products as copy } from "@/lib/content";
import type { Product } from "@/lib/types";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { PreviewPanel } from "@/components/cards/preview/PreviewPanel";
import { StatProgress } from "@/components/cards/preview/StatProgress";
import { InfoRows } from "@/components/cards/preview/InfoRows";

function GradePreview({ product }: { product: Product }) {
  return (
    <PreviewPanel label={product.grade}>
      <StatProgress value={product.purityLabel} unit="CaF₂" percent={product.purityPercent} />
      <div className="pt-4">
        <InfoRows rows={[{ label: "Хэрэглээ", value: product.usage }]} />
      </div>
    </PreviewPanel>
  );
}

/** Product cards come from the database (see lib/server/products.ts). */
export function ProductsSection({ products }: { products: Product[] }) {
  return (
    <section id="products" className="scroll-mt-6 pb-16 sm:pb-24">
      <Container>
        <SectionHeader tag={copy.tag} title={copy.title} description={copy.description} />

        <div className="grid gap-6 pt-10 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <FeatureCard
              key={product.id}
              title={product.name}
              description={product.description}
              action={{ label: "Үнийн санал", href: "#request" }}
              previewTone={product.highlighted ? "dark" : "light"}
              preview={<GradePreview product={product} />}
            />
          ))}

          <FeatureCard
            title="Худалдан авах хүсэлт"
            description="Монгол, англи, хятад хэлээр хүсэлтээ илгээх боломжтой."
            action={{ label: "Хүсэлт илгээх", href: "#request" }}
            preview={
              <PreviewPanel label="ХҮСЭЛТ">
                <InfoRows rows={copy.requestRows} spaced />
                <div className="pt-3.5">
                  <Button href="#request" tabIndex={-1} aria-hidden>
                    Илгээх
                  </Button>
                </div>
              </PreviewPanel>
            }
          />
        </div>
      </Container>
    </section>
  );
}
