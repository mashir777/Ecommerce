import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="container-site pb-16">
      <div className="rounded-[1.75rem] hero-gradient px-8 py-12 sm:px-12 text-center text-white relative overflow-hidden">
        <div className="relative z-10 animate-fade-up">
          <p className="text-white/80 text-xs font-semibold tracking-[0.18em] uppercase mb-3">
            Need custom packaging?
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold max-w-xl mx-auto">
            Get a free quote for boxes, pouches & branded packaging
          </h2>
          <p className="mt-3 text-white/85 max-w-lg mx-auto">
            Share your product type, quantity and artwork — our team replies within business hours.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/quote" className="btn-primary bg-white text-[var(--terra)] hover:bg-[var(--cream)]">
              Get Free Quote
            </Link>
            <Link href="/shop" className="btn-ghost">
              Browse Products ›
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
