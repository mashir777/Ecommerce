"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/lib/data";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Products" },
  { href: "/shop?cat=kraft-pouches", label: "Kraft Pouches" },
  { href: "/shop?cat=bakery", label: "Bakery" },
  { href: "/quote", label: "Get Quote" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Cream logo bar — matches original (logo first) */}
      <div className="bg-[var(--cream)] border-b border-[var(--line)]">
        <div className="container-site flex items-center justify-between py-3 gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="relative inline-flex h-11 w-11 items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-source.png"
                alt="PackHive"
                className="h-10 w-10 object-contain transition-transform group-hover:scale-105"
              />
            </span>
            <span className="hidden sm:block">
              <span className="block font-[family-name:var(--font-display)] text-xl font-bold text-[var(--ink)] leading-none">
                PackHive
              </span>
              <span className="block text-[10px] tracking-[0.16em] uppercase text-[var(--muted)] mt-1">
                Packaging Pakistan
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-[15px] font-medium text-[var(--ink)]">
            {navLinks.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="hover:text-[var(--terra)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href={site.phoneHref}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--terra)]"
              aria-label="Call us"
            >
              <PhoneIcon />
            </a>
            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--whatsapp)]"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon />
            </a>
            <button
              type="button"
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center"
              aria-label="Open menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="flex flex-col gap-1.5">
                <span className="block h-0.5 w-5 bg-[var(--ink)]" />
                <span className="block h-0.5 w-5 bg-[var(--ink)]" />
                <span className="block h-0.5 w-4 bg-[var(--ink)]" />
              </span>
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-[var(--line)] bg-white">
            <div className="container-site py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className="rounded-lg px-3 py-2.5 font-medium hover:bg-[var(--cream)]"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Terracotta contact strip — below logo bar like original */}
      <div className="hidden lg:block bg-[var(--terra)] text-white text-[13px]">
        <div className="container-site flex flex-wrap items-center justify-between gap-2 py-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <a href={site.phoneHref} className="hover:opacity-90">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="hover:opacity-90">
              {site.email}
            </a>
            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-90"
            >
              WhatsApp
            </a>
            <span className="opacity-95">★ {site.customers} Happy Customers Across Pakistan</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/shop" className="hover:opacity-90">
              Track Order
            </Link>
            <Link href="/contact" className="hover:opacity-90">
              Contact
            </Link>
            <a href={site.whatsappHref} className="hover:opacity-90">
              Live Chat
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.5 2 2 6.3 2 11.7c0 2 .6 3.9 1.6 5.5L2 22l5-1.3c1.5.8 3.2 1.3 5 1.3 5.5 0 10-4.3 10-9.7S17.5 2 12 2zm0 17.6c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3C4.2 14.7 3.8 13.2 3.8 11.7 3.8 7.4 7.5 4 12 4s8.2 3.4 8.2 7.7-3.7 7.9-8.2 7.9zm4.5-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.4c.1-.2.2-.3.2-.5 0-.2 0-.4-.1-.5-.1-.1-.5-1.2-.7-1.6-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.1.7 2.9.6.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.3-.2-.5-.3z" />
    </svg>
  );
}
