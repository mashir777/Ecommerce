"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { categories, formatPrice, getProductsByCategory } from "@/lib/data";

export default function ShopClient() {
  const searchParams = useSearchParams();
  const cat = searchParams.get("cat") || undefined;
  const list = getProductsByCategory(cat);
  const active = categories.find((c) => c.slug === cat);

  return (
    <div className="container-site py-10">
      <div className="mb-8">
        <p className="text-sm text-[var(--muted)] mb-2">
          <Link href="/" className="hover:text-[var(--terra)]">
            Home
          </Link>{" "}
          / Shop
          {active ? ` / ${active.name}` : ""}
        </p>
        <h1 className="text-3xl font-bold">
          {active ? active.name : "All Packaging Products"}
        </h1>
        <p className="mt-2 text-[var(--muted)] max-w-2xl">
          Browse PackHive packaging for restaurants, bakeries, cafes and retail brands across Pakistan.
          Showing {list.length} product{list.length === 1 ? "" : "s"}.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/shop"
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            !cat
              ? "bg-[var(--terra)] text-white"
              : "bg-white border border-[var(--line)] text-[var(--muted)]"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/shop?cat=${c.slug}`}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              cat === c.slug
                ? "bg-[var(--terra)] text-white"
                : "bg-white border border-[var(--line)] text-[var(--muted)] hover:border-[var(--terra)]"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {list.map((product) => (
          <article key={product.slug} className="product-card group">
            <Link href={`/product/${product.slug}`}>
              <div className="relative aspect-square bg-[var(--cream)] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="280px"
                />
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-[15px] line-clamp-2 min-h-[2.6em]">
                  {product.name}
                </h2>
                <p className="mt-2 text-[var(--terra)] font-bold">
                  {product.priceTo
                    ? `${formatPrice(product.priceFrom)} – ${formatPrice(product.priceTo)}`
                    : formatPrice(product.priceFrom)}
                </p>
              </div>
            </Link>
            <div className="px-4 pb-4">
              <Link href={`/product/${product.slug}`} className="btn-outline w-full text-sm py-2.5">
                Select options
              </Link>
            </div>
          </article>
        ))}
      </div>

      {list.length === 0 && (
        <div className="text-center py-20 text-[var(--muted)]">
          <p>No products found in this category.</p>
          <Link href="/shop" className="btn-primary mt-5 inline-flex">
            View all products
          </Link>
        </div>
      )}
    </div>
  );
}
