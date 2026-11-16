import { environment } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BigStatCard } from "@/components/cards/BigStatCard";
import { EnvTile } from "@/components/cards/EnvTile";

export function EnvironmentSection() {
  return (
    <section id="environment" className="scroll-mt-6 border-t border-line py-16 sm:py-24">
      <Container>
        <SectionHeader
          index={4}
          tag={environment.tag}
          tagTone="green"
          title={environment.title}
          description={environment.description}
        />

        <div className="grid gap-6 pt-10 lg:grid-cols-[616fr_560fr]">
          <div data-reveal>
            <BigStatCard {...environment.highlight} />
          </div>
          <div data-reveal-stagger className="grid gap-4 sm:grid-cols-2">
            {environment.tiles.map((tile) => (
              <EnvTile key={tile.title} {...tile} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
