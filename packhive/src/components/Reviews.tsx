import { reviews } from "@/lib/data";

export default function Reviews() {
  return (
    <section className="container-site py-10 md:py-14">
      <h2 className="section-title">What Our Customers Say</h2>
      <p className="mt-3 text-center text-[var(--muted)] max-w-xl mx-auto">
        Real feedback from restaurants, bakeries and brands across Pakistan.
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r) => (
          <article
            key={r.name}
            className="rounded-[1.35rem] bg-white border border-[var(--line)] p-6 shadow-[0_10px_30px_rgba(28,45,38,0.04)]"
          >
            <div className="flex gap-1 text-[var(--brand)] text-sm" aria-hidden>
              {"★★★★★".split("").map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>
            <p className="mt-4 text-[var(--ink)] leading-relaxed text-[15px]">“{r.text}”</p>
            <p className="mt-5 font-semibold text-[var(--brand-deep)]">{r.name}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
