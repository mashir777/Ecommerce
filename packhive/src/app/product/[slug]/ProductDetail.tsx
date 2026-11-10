import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice, getProduct, products, site } from "@/lib/data";

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="container-site py-10">
      <p className="text-sm text-[var(--muted)] mb-6">
        <Link href="/" className="hover:text-[var(--terra)]">
          Home
        </Link>
        {" / "}
        <Link href="/shop" className="hover:text-[var(--terra)]">
          Shop
        </Link>
        {" / "}
        {product.name}
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-white border border-[var(--line)]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 560px"
          />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{product.name}</h1>
          <p className="mt-4 text-2xl font-bold text-[var(--terra)]">
            {product.priceTo
              ? `${formatPrice(product.priceFrom)} – ${formatPrice(product.priceTo)}`
              : formatPrice(product.priceFrom)}
          </p>
          <p className="mt-5 text-[var(--muted)] leading-relaxed">{product.description}</p>

          <ul className="mt-6 space-y-2 text-sm">
            <li>✓ Food-grade quality materials</li>
            <li>✓ Bulk discounts available</li>
            <li>✓ Custom printing on request</li>
            <li>✓ Delivery across Pakistan</li>
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`${site.whatsappHref}?text=${encodeURIComponent(`Hi PackHive, I want to order: ${product.name}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Order on WhatsApp
            </a>
            <Link href="/quote" className="btn-outline">
              Request Quote
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related products</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((item) => (
              <Link key={item.slug} href={`/product/${item.slug}`} className="product-card">
                <div className="relative aspect-square bg-[var(--cream)]">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="220px" />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold line-clamp-2">{item.name}</h3>
                  <p className="mt-1 text-[var(--terra)] font-bold text-sm">
                    {formatPrice(item.priceFrom)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
