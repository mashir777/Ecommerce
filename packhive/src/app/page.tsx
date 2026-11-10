import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import CategoryGrid from "@/components/CategoryGrid";
import ProductGrid from "@/components/ProductGrid";
import Reviews from "@/components/Reviews";
import CtaBanner from "@/components/CtaBanner";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoryGrid />
      <ProductGrid limit={16} />
      <Reviews />
      <CtaBanner />
    </>
  );
}
