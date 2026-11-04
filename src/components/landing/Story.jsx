import React from "react";
import { ArrowRight } from "lucide-react";

export default function Story() {
  return (
    <section id="tentang" className="relative scroll-mt-20 border-y border-border bg-card/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Tentang Fikri Store
          </span>
          <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            Mulai dari laptop yang tepat untuk kebutuhanmu.
          </h2>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Fikri Store membantu kamu menemukan laptop untuk kuliah, kerja, dan berkarya.
            Lihat unit yang tersedia atau konsultasikan kebutuhan dan budget sebelum memilih.
          </p>
          <a
            href="#produk"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold transition-colors hover:border-primary/50 hover:bg-card min-h-[44px]"
          >
            Jelajahi Laptop
            <ArrowRight className="h-4 w-4 text-primary" />
          </a>
        </div>
      </div>
    </section>
  );
}
