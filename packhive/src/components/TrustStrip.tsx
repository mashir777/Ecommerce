import { site } from "@/lib/data";

const items = [
  { title: "Low MOQ", text: "Order small batches & scale anytime" },
  { title: "Fast Delivery", text: "Shipping across Pakistan" },
  { title: "Custom Print", text: "Logo & brand-matching designs" },
  { title: `${site.customers} Clients`, text: "Trusted by growing brands" },
];

export default function TrustStrip() {
  return (
    <section className="container-site py-6">
      <div className="rounded-[1.5rem] bg-white border border-[var(--line)] grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--line)] overflow-hidden">
        {items.map((item) => (
          <div key={item.title} className="px-5 py-6 text-center">
            <p className="font-[family-name:var(--font-display)] font-bold text-lg text-[var(--terra)]">
              {item.title}
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
