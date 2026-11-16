import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SplitHero } from "@/components/sections/SplitHero";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProductionSection } from "@/components/sections/ProductionSection";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { EnvironmentSection } from "@/components/sections/EnvironmentSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { QuoteRequestDialog } from "@/components/request/QuoteRequestDialog";
import { getProducts } from "@/lib/server/products";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

// Read products from the database on every request so edits show immediately.
export const dynamic = "force-dynamic";

export default async function Home() {
  // A database outage (or missing Supabase env vars) shouldn't take the whole landing page down:
  // render without the product list and log the cause.
  const products = await getProducts().catch((err) => {
    console.error("getProducts failed:", err);
    return [];
  });

  return (
    <div className="theme-dark min-h-screen">
      <ScrollReveal />
      <div aria-hidden className="scroll-progress fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-brand-gradient-diagonal" />
      <Navbar overlay />
      <main>
        <SplitHero />
        <AboutSection />
        <ProductionSection />
        <ProductsSection products={products} />
        <EnvironmentSection />
        <LocationSection />
      </main>
      <Footer />
      <QuoteRequestDialog products={products} />
    </div>
  );
}
