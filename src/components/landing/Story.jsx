import React from "react";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";

const STORY_IMG =
  "https://media.base44.com/images/public/6acf25a8d877b5aac6c96735/cafa7e93d_generated_image.png";

export default function Story() {
  return (
    <section id="tentang" className="relative scroll-mt-20">
      <div className="relative h-[420px] sm:h-[480px] overflow-hidden">
        <Image
          src={STORY_IMG}
          alt="Cerita dan nilai Fikri Store"
          className="w-full h-full"
          fittingType="fill"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />

        <div className="relative h-full max-w-6xl mx-auto px-4 sm:px-6 flex items-center">
          <div className="max-w-lg">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Story
            </span>
            <h2 className="mt-3 font-heading text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Mulai dari yang kamu cari.
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Fikri Store berawal dari satu hal sederhana: bikin orang lebih gampang menemukan barang yang memang mereka cari. Kami mulai dari laptop, lalu akan terus berkembang mengikuti kebutuhanmu.
            </p>
            <a
              href="#faq"
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-5 py-3 text-sm font-semibold transition-colors hover:border-primary/50 hover:bg-card min-h-[44px]"
            >
              Tentang Kami
              <ArrowRight className="h-4 w-4 text-primary" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}