import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SplitHero } from "@/components/sections/SplitHero";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProductionSection } from "@/components/sections/ProductionSection";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { EnvironmentSection } from "@/components/sections/EnvironmentSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { QuoteRequestDialog } from "@/components/request/QuoteRequestDialog";
import { getProducts } from "@/lib/server/products";

// Read products from the database on every request so edits show immediately.
export const dynamic = "force-dynamic";

export default function Home() {
  const products = getProducts();

  return (
    <>
      <Navbar overlay />
      <main>
        <SplitHero />
        <AboutSection />
        <ProductionSection />
        <ProductsSection products={products} />
        <EnvironmentSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
      <QuoteRequestDialog products={products} />
    </>
  );
}
