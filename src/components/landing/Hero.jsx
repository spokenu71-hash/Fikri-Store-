
import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Truck,
  MessageCircle,
} from "lucide-react";
import { buildWhatsAppLink } from "@/lib/products";
import { Image } from "@/components/ui/image";
import { supabase } from "@/lib/supabase";

const HERO_IMG =
  "https://media.base44.com/images/public/6acf25a8d877b5aac6c96735/7b34e082f_generated_image.png";

const FEATURES = [
  { icon: CheckCircle2, label: "Unit Dicek Sebelum Kirim" },
  { icon: Truck, label: "Pengiriman Seluruh Indonesia" },
  { icon: MessageCircle, label: "Konsultasi Via WhatsApp" },
];

export default function Hero() {
  const [customHeroImage, setCustomHeroImage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadHeroImage() {
      const { data } = await supabase
        .from("site_images")
        .select("image_url")
        .eq("image_key", "hero")
        .maybeSingle();

      if (active && data?.image_url) {
        setCustomHeroImage(data.image_url);
      }
    }

    loadHeroImage();

    return () => {
      active = false;
    };
  }, []);

  const waLink = buildWhatsAppLink(
    "Halo Fikri Store, saya mau tanya-tanya soal laptop second yang available. Ada rekomendasi buat budget saya?"
  );

  return (
    <section
      id="hero"
      className="fs-hero relative pt-24 sm:pt-28 pb-12 sm:pb-20 overflow-hidden"
    >
      <div className="fs-hero-grid" aria-hidden="true" />
      <div className="fs-aura fs-aura-blue" aria-hidden="true" />
      <div className="fs-aura fs-aura-purple" aria-hidden="true" />
      <div className="fs-light-streak" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div className="fs-hero-copy">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
              <span className="fs-live-dot" />
              Laptop Second Berkualitas
            </span>

            <h1 className="mt-5 font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]">
              Laptop kece,
              <br />
              <span className="fs-neon-text text-primary text-glow-lime">
                budget tetap aman.
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
              Buat kuliah, kerja, sampai desain. Nggak harus keluar
              budget gede buat dapetin laptop yang cocok.
            </p>

            <div className="fs-hero-actions">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="fs-hero-button mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground min-h-[48px]"
              >
                Chat Sekarang
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="#produk"
                className="fs-secondary-button mt-8 inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold min-h-[48px]"
              >
                Lihat Produk ↘
              </a>
            </div>

            <div className="fs-trust-row">
              <span>✦ Unit dicek</span>
              <span>✦ Harga bersahabat</span>
              <span>✦ Konsultasi langsung</span>
            </div>
          </div>

          <div className="fs-hero-visual-wrap">
            <div className="fs-orbit fs-orbit-one" />
            <div className="fs-orbit fs-orbit-two" />

            <div className="fs-hero-visual relative aspect-[4/3] rounded-3xl overflow-hidden border border-border bg-card">
              <Image
                src={customHeroImage || HERO_IMG}
                alt="Laptop second berkualitas dari Fikri Store"
                className="fs-hero-image w-full h-full"
                fittingType="fill"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/10" />
              <div className="fs-scanline" />
              <div className="fs-corner fs-corner-top" />
              <div className="fs-corner fs-corner-bottom" />

              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div>
                  <span className="block mb-2 text-[8px] font-bold tracking-[.2em] text-white/60">
                    FIKRI STORE / SELECTED UNIT
                  </span>
                  <p className="font-heading text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight">
                    Good Laptop,
                    <br />
                    Better Days.
                  </p>
                </div>

                <span className="fs-live-badge">
                  <i /> LIVE CATALOG
                </span>
              </div>
            </div>

            <div className="fs-floating-chip fs-chip-top">
              <span>✦</span> Selected for you
            </div>
            <div className="fs-floating-chip fs-chip-bottom">
              <span className="fs-live-dot" /> Ready to explore
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.label}
              style={{ "--delay": `${index * 120}ms` }}
              className="fs-feature-card flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5"
            >
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs sm:text-sm font-medium">
                {feature.label}
              </span>
              <span className="fs-feature-arrow">↗</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
