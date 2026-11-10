import Link from "next/link";
import { site } from "@/lib/data";

export default function AboutPage() {
  return (
    <div className="container-site py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold">About PackHive</h1>
        <p className="mt-4 text-[var(--muted)] leading-relaxed text-lg">
          PackHive is a Pakistan-focused packaging partner for restaurants, bakeries, cafes,
          startups and retail brands. We help you look premium on the shelf and stay practical
          in the kitchen — with kraft pouches, bakery boxes, eco containers, cups and more.
        </p>
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white border border-[var(--line)] p-6">
            <h2 className="font-bold text-lg text-[var(--terra)]">What we offer</h2>
            <ul className="mt-3 space-y-2 text-[var(--muted)] text-sm">
              <li>• Custom & plain packaging</li>
              <li>• Low MOQ for growing brands</li>
              <li>• Bulk pricing for restaurants</li>
              <li>• Delivery to major cities</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white border border-[var(--line)] p-6">
            <h2 className="font-bold text-lg text-[var(--terra)]">Why PackHive</h2>
            <ul className="mt-3 space-y-2 text-[var(--muted)] text-sm">
              <li>• {site.customers} happy customers</li>
              <li>• Brand-matching design support</li>
              <li>• Fast WhatsApp ordering</li>
              <li>• Food-grade quality focus</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/shop" className="btn-primary">
            Browse products
          </Link>
          <Link href="/quote" className="btn-outline">
            Get a quote
          </Link>
        </div>
      </div>
    </div>
  );
}
