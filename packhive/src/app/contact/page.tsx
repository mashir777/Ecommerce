import { site } from "@/lib/data";

export default function ContactPage() {
  return (
    <div className="container-site py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold">Contact PackHive</h1>
        <p className="mt-3 text-[var(--muted)]">
          Questions about packaging, bulk pricing or custom print? Reach out — we usually reply within business hours.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a href={site.phoneHref} className="rounded-2xl bg-white border border-[var(--line)] p-5 hover:border-[var(--terra)]">
            <p className="text-sm text-[var(--muted)]">Phone</p>
            <p className="mt-1 font-semibold">{site.phone}</p>
            {site.phoneAlt ? <p className="mt-1 text-sm text-[var(--muted)]">{site.phoneAlt}</p> : null}
          </a>
          <a href={`mailto:${site.email}`} className="rounded-2xl bg-white border border-[var(--line)] p-5 hover:border-[var(--terra)]">
            <p className="text-sm text-[var(--muted)]">Email</p>
            <p className="mt-1 font-semibold break-all">{site.email}</p>
          </a>
          <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-white border border-[var(--line)] p-5 hover:border-[var(--terra)]">
            <p className="text-sm text-[var(--muted)]">WhatsApp</p>
            <p className="mt-1 font-semibold">Chat now</p>
          </a>
          <div className="rounded-2xl bg-white border border-[var(--line)] p-5">
            <p className="text-sm text-[var(--muted)]">Visit / Hours</p>
            <p className="mt-1 font-semibold text-sm leading-snug">{site.address}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">{site.hours}</p>
          </div>
        </div>

        <form className="mt-10 rounded-[1.5rem] bg-white border border-[var(--line)] p-6 sm:p-8 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium">Name</span>
              <input
                required
                name="name"
                className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--cream-soft)] px-4 py-3 outline-none focus:border-[var(--terra)]"
                placeholder="Your name"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Phone</span>
              <input
                required
                name="phone"
                className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--cream-soft)] px-4 py-3 outline-none focus:border-[var(--terra)]"
                placeholder="03xx-xxxxxxx"
              />
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              name="email"
              className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--cream-soft)] px-4 py-3 outline-none focus:border-[var(--terra)]"
              placeholder="you@business.com"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Message</span>
            <textarea
              required
              name="message"
              rows={5}
              className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--cream-soft)] px-4 py-3 outline-none focus:border-[var(--terra)]"
              placeholder="Tell us what packaging you need..."
            />
          </label>
          <button type="submit" className="btn-primary">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
