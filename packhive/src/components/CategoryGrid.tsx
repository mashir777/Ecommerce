"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { categories } from "@/lib/data";

export default function CategoryGrid() {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    scroller.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <section className="container-site py-10 md:py-14">
      <h2 className="section-title">Browse Our Collection</h2>
      <Image
        src="/heading-ornament.png"
        alt=""
        width={140}
        height={14}
        className="section-ornament"
      />

      <div className="relative mt-10">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => scrollBy(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/90 border border-[var(--line)] shadow-sm hidden sm:flex items-center justify-center text-[var(--ink)]"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => scrollBy(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/90 border border-[var(--line)] shadow-sm hidden sm:flex items-center justify-center text-[var(--ink)]"
        >
          ›
        </button>

        <div
          ref={scroller}
          className="flex gap-5 overflow-x-auto scrollbar-none px-1 py-2 scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?cat=${cat.slug}`}
              className="group shrink-0 w-[140px] sm:w-[150px] text-center"
            >
              <div className="relative mx-auto h-[140px] w-[140px] sm:h-[150px] sm:w-[150px] rounded-full overflow-hidden border border-[var(--line)] bg-[var(--cream)] shadow-sm">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-400 group-hover:scale-105"
                  sizes="150px"
                />
              </div>
              <h3 className="mt-3 text-[13px] sm:text-sm font-semibold text-[var(--ink)] leading-snug">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
