"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { heroSlides } from "@/lib/data";

const cards = heroSlides.map((slide, i) => ({
  ...slide,
  shortLabel: ["Kraft Pouches", "Eco Packaging", "Custom Cups", "Bakery Boxes"][i],
}));

export default function Hero() {
  const [active, setActive] = useState(0);

  return (
    <section className="container-site py-8 md:py-9">
      <div className="flex flex-col md:flex-row items-stretch gap-2.5 md:h-[520px]">
        {cards.map((card, i) => {
          const isActive = i === active;
          return (
            <div
              key={card.title}
              role="button"
              tabIndex={0}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActive(i);
                }
              }}
              className={`group relative overflow-hidden rounded-[18px] text-left transition-[width] duration-550 ease-[cubic-bezier(0.4,0,0.2,1)]
                ${
                  isActive
                    ? "min-h-[420px] md:min-h-0 md:flex-1 cursor-default"
                    : "min-h-[120px] md:min-h-0 md:w-[115px] md:flex-none cursor-pointer"
                }`}
              aria-expanded={isActive}
            >
              <Image
                src={card.image}
                alt={card.title}
                fill
                priority={i === 0}
                className={`object-cover transition-transform duration-500 ${
                  isActive ? "scale-100" : "group-hover:scale-105"
                }`}
                sizes={isActive ? "(max-width:768px) 100vw, 70vw" : "115px"}
              />

              <div
                className={`absolute inset-0 transition-colors duration-400 ${
                  isActive
                    ? "bg-gradient-to-r from-[rgba(28,63,52,0.92)] via-[rgba(47,107,87,0.7)] to-[rgba(196,179,150,0.18)]"
                    : "bg-[rgba(18,40,32,0.62)]"
                }`}
              />

              {!isActive && (
                <span className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                  <span className="text-white font-semibold tracking-wide text-sm md:text-[15px] md:[writing-mode:vertical-rl] md:rotate-180 drop-shadow">
                    {card.shortLabel}
                  </span>
                </span>
              )}

              {isActive && (
                <div className="relative z-10 h-full flex flex-col justify-center px-7 sm:px-10 lg:px-12 py-10 max-w-xl animate-fade-up">
                  <p className="text-white/85 text-[12px] sm:text-[13px] font-semibold tracking-[0.16em] mb-3 uppercase">
                    {card.eyebrow}
                  </p>
                  <h1 className="text-white text-[1.85rem] sm:text-[2.4rem] lg:text-[2.65rem] font-bold leading-[1.12]">
                    {card.title}
                  </h1>
                  <p className="mt-4 text-white/90 text-[15px] leading-relaxed max-w-md">
                    {card.text}
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link href={card.primary.href} className="btn-primary">
                      {card.primary.label}
                    </Link>
                    <Link href={card.secondary.href} className="btn-ghost">
                      {card.secondary.label}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
