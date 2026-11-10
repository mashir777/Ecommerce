import { site } from "@/lib/data";

export default function QuotePage() {
  return (
    <div className="container-site py-12">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[var(--terra)] mb-3">
          Free quote
        </p>
        <h1 className="text-3xl font-bold">Request a packaging quote</h1>
        <p className="mt-3 text-[var(--muted)]">
          Share product type, quantity and any artwork — PackHive will send pricing and lead time.
          Prefer WhatsApp?{" "}
          <a href={site.whatsappHref} className="text-[var(--terra)] font-semibold underline">
            Message us instantly
          </a>
          .
        </p>

        <form className="mt-10 rounded-[1.5rem] bg-white border border-[var(--line)] p-6 sm:p-8 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium">Business / Name</span>
              <input required name="name" className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--cream-soft)] px-4 py-3 outline-none focus:border-[var(--terra)]" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Phone / WhatsApp</span>
              <input required name="phone" className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--cream-soft)] px-4 py-3 outline-none focus:border-[var(--terra)]" />
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input type="email" name="email" className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--cream-soft)] px-4 py-3 outline-none focus:border-[var(--terra)]" />
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium">Product type</span>
              <select name="product" className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--cream-soft)] px-4 py-3 outline-none focus:border-[var(--terra)]">
                <option>Kraft Standup Pouches</option>
                <option>Bakery Boxes</option>
                <option>Coffee Cups</option>
                <option>Eco Packaging</option>
                <option>Food Containers</option>
                <option>Custom / Other</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium">Quantity (approx)</span>
              <input name="qty" placeholder="e.g. 1000" className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--cream-soft)] px-4 py-3 outline-none focus:border-[var(--terra)]" />
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-medium">Details</span>
            <textarea
              name="details"
              rows={5}
              className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--cream-soft)] px-4 py-3 outline-none focus:border-[var(--terra)]"
              placeholder="Size, printing, city, deadline..."
            />
          </label>
          <button type="submit" className="btn-primary">
            Submit Quote Request
          </button>
        </form>
      </div>
    </div>
  );
}
