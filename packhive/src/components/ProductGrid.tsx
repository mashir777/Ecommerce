"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatPrice, productTabs, products } from "@/lib/data";

export default function ProductGrid({
  title = "Explore Our Best Packaging Products",
  showTabs = true,
  limit,
  category,
}: {
  title?: string;
  showTabs?: boolean;
  limit?: number;
  category?: string;
}) {
  const [tab, setTab] = useState(category || "all");

  const list = useMemo(() => {
    let items =
      tab === "all"
        ? products
        : products.filter(
            (p) =>
              p.category === tab ||
              (tab === "cups" && ["cups", "containers", "plastic-cup", "icecream"].includes(p.category))
          );
    if (category && !showTabs) {
      items = products.filter((p) => p.category === category);
    }
    if (limit) items = items.slice(0, limit);
    return items;
  }, [tab, limit, category, showTabs]);

  return (
    <section className="container-site py-10 pb-16">
      <h2 className="section-title">{title}</h2>
      <Image
        src="/heading-ornament.png"
        alt=""
        width={140}
        height={14}
        className="section-ornament"
      />

      {showTabs && (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {productTabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "bg-[var(--terra)] text-white"
                  : "bg-white border border-[var(--line)] text-[var(--muted)] hover:border-[var(--terra)] hover:text-[var(--terra)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {list.map((product) => (
          <article key={product.slug} className="product-card group">
            <Link href={`/product/${product.slug}`} className="block">
              <div className="relative aspect-square bg-[var(--cream)] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 90vw, 280px"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[15px] leading-snug line-clamp-2 min-h-[2.6em]">
                  {product.name}
                </h3>
                <p className="mt-2 text-[var(--terra)] font-bold">
                  {product.priceTo
                    ? `${formatPrice(product.priceFrom)} – ${formatPrice(product.priceTo)}`
                    : formatPrice(product.priceFrom)}
                </p>
              </div>
            </Link>
            <div className="px-4 pb-4">
              <Link
                href={`/product/${product.slug}`}
                className="btn-outline w-full text-sm py-2.5"
              >
                Select options
              </Link>
            </div>
          </article>
        ))}
      </div>

      {list.length === 0 && (
        <p className="text-center text-[var(--muted)] mt-10">No products in this category yet.</p>
      )}
    </section>
  );
}
