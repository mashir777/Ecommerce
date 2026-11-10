import Link from "next/link";
import { site } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="mt-auto bg-[var(--ink)] text-white">
      <div className="container-site grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7">
                <path d="M3 8.5 12 4l9 4.5v9L12 22 3 17.5v-9Z" />
                <path d="M12 12v10M3 8.5l9 3.5 9-3.5" />
              </svg>
            </span>
            <span className="font-[family-name:var(--font-display)] text-xl font-bold">PackHive</span>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            Pakistan&apos;s trusted online packaging store — offering 500+ premium packaging
            solutions for restaurants, bakeries, startups & retail businesses. Fast shipping
            across major cities with bulk discounts.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4 tracking-wide">Useful Links</h3>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/quote" className="hover:text-white">Get Free Quote</Link></li>
            <li><Link href="/shop" className="hover:text-white">Shop All</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4 tracking-wide">Quick Links</h3>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li><Link href="/shop?cat=kraft-pouches" className="hover:text-white">Kraft Pouches</Link></li>
            <li><Link href="/shop?cat=bakery" className="hover:text-white">Bakery Boxes</Link></li>
            <li><Link href="/shop?cat=eco" className="hover:text-white">Eco Packaging</Link></li>
            <li><Link href="/shop?cat=cups" className="hover:text-white">Custom Cups</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4 tracking-wide">Contact</h3>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li><a href={site.phoneHref} className="hover:text-white">{site.phone}</a></li>
            {site.phoneAlt ? <li>{site.phoneAlt}</li> : null}
            <li><a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a></li>
            <li>{site.address}</li>
            <li>{site.hours}</li>
            <li>
              <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Chat on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site py-5 text-sm text-white/55 flex flex-wrap justify-between gap-2">
          <span>© 2026 PackHive. All rights reserved.</span>
          <span>Made for packaging businesses across Pakistan</span>
        </div>
      </div>
    </footer>
  );
}
