import { Suspense } from "react";
import ProductDetail from "./ProductDetail";

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="container-site py-20 text-center text-[var(--muted)]">
          Loading product...
        </div>
      }
    >
      <ProductDetail params={params} />
    </Suspense>
  );
}
