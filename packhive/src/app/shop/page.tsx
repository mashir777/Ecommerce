import { Suspense } from "react";
import ShopClient from "./ShopClient";

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="container-site py-20 text-center text-[var(--muted)]">
          Loading products...
        </div>
      }
    >
      <ShopClient />
    </Suspense>
  );
}
