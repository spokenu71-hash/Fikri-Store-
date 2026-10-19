import React from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, Truck, MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/products";
import { Image } from "@/components/ui/image";

const HERO_IMG =
  "https://media.base44.com/images/public/6acf25a8d877b5aac6c96735/7b34e082f_generated_image.png";

const FEATURES = [
  { icon: CheckCircle2, label: "Unit Dicek Sebelum Kirim" },
  { icon: ShieldCheck, label: "Garansi Opsional" },
  { icon: Truck, label: "Pengiriman Seluruh Indonesia" },
  { icon: MessageCircle, label: "Konsultasi Via WhatsApp" },
];

export default function Hero() {
  const waLink = buildWhatsAppLink(
    "Halo Fikri Store, saya mau tanya-tanya soal laptop second yang available. Ada rekomendasi buat budget saya?"
  );

  return (
    <section id="hero" className="relative pt-24 sm:pt-28 pb-12 sm:pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(212,255,0,0.08),transparent_55%)]" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
              Laptop Second Berkualitas
            </span>
            <h1 className="mt-5 font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]">
              Laptop kece,
              <br />
              <span className="text-primary text-glow-lime">budget tetap aman.</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
              Buat kuliah, kerja, sampai desain. Nggak harus keluar budget gede
              buat dapetin laptop yang cocok.
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground glow-lime transition-transform hover:scale-[1.03] active:scale-95 min-h-[48px]"
            >
              Chat Sekarang
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Right visual */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-border bg-card">
              <Image
                src={HERO_IMG}
                alt="Laptop second berkualitas dari Fikri Store"
                className="w-full h-full"
                fittingType="fill"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <p className="font-heading text-xl sm:text-2xl font-extrabold tracking-tight text-white drop-shadow-lg leading-tight">
                  Good Laptop,
                  <br />
                  Better Days.
                </p>
                <span className="h-2.5 w-2.5 rounded-full bg-primary glow-lime shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Features row */}
        <div className="mt-10 sm:mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5"
            >
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs sm:text-sm font-medium leading-tight">
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}