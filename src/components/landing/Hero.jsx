import React, { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Truck, MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/products";
import { Image } from "@/components/ui/image";
import { supabase } from "@/lib/supabase";

const HERO_IMG = "https://media.base44.com/images/public/6acf25a8d877b5aac6c96735/7b34e082f_generated_image.png";

const FEATURES = [
  { icon: CheckCircle2, label: "Produk dicek sebelum dikirim" },
  { icon: Truck, label: "Pengiriman ke seluruh Indonesia" },
  { icon: MessageCircle, label: "Konsultasi langsung via WhatsApp" },
];

export default function Hero() {
  const [customHeroImage, setCustomHeroImage] = useState("");

  useEffect(() => {
    let active = true;
    async function loadHeroImage() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from("site_images")
          .select("image_url")
          .eq("image_key", "hero")
          .maybeSingle();
        if (error) throw error;
        if (active && data?.image_url) setCustomHeroImage(data.image_url);
      } catch (error) {
        console.error("Gagal memuat gambar Hero:", error);
      }
    }
    loadHeroImage();
    return () => { active = false; };
  }, []);

  const waLink = buildWhatsAppLink(
    "Halo Fikri Store, saya ingin konsultasi produk yang tersedia dan rekomendasi sesuai kebutuhan serta budget saya."
  );

  return (
    <section
      id="hero"
      className="fs-hero relative pt-28 sm:pt-36 pb-16 sm:pb-24"
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width) * 100;
        const y = ((event.clientY - bounds.top) / bounds.height) * 100;
        event.currentTarget.style.setProperty("--fs-pointer-x", `${x}%`);
        event.currentTarget.style.setProperty("--fs-pointer-y", `${y}%`);
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty("--fs-pointer-x", "72%");
        event.currentTarget.style.setProperty("--fs-pointer-y", "28%");
      }}
    >
      <div className="fs-hero-atmosphere" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div className="fs-hero-copy max-w-2xl">
            <span className="fs-eyebrow">
              <span className="fs-eyebrow-dot" />
              FIKRI STORE <span className="fs-eyebrow-divider">/</span> GOOD FINDS, BETTER CHOICES
            </span>
            <h1 className="mt-7 font-heading text-[2.75rem] font-semibold leading-[1.04] tracking-[-0.055em] sm:text-6xl lg:text-[4.6rem]">
              Temukan perangkat yang <span className="fs-neon-text">tepat untukmu.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
              Pilihan laptop dan elektronik untuk belajar, bekerja, dan berkarya. Lihat detailnya dengan jelas, bandingkan kebutuhanmu, lalu pilih dengan lebih yakin.
            </p>
            <div className="fs-hero-actions mt-9 flex flex-wrap items-center gap-3">
              <a href="#produk" className="fs-hero-button inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground">
                Jelajahi produk <ArrowRight className="h-4 w-4" />
              </a>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="fs-secondary-button inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-border bg-white/70 px-6 text-sm font-semibold text-foreground">
                <MessageCircle className="h-4 w-4" /> Konsultasi
              </a>
            </div>
            <div className="fs-trust-row mt-10">
              <span>Kurasi produk</span><span>Informasi transparan</span><span>Bantuan personal</span>
            </div>
          </div>

          <div className="fs-hero-visual-wrap">
            <div className="fs-hero-visual relative aspect-[5/4] overflow-hidden rounded-[2rem] bg-[#e9edf3]">
              <Image
                src={customHeroImage || HERO_IMG}
                alt="Pilihan produk elektronik Fikri Store"
                className="fs-hero-image h-full w-full"
                fittingType="fill"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent p-6 sm:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">Discover your next essential</p>
                <p className="mt-2 max-w-sm text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">Teknologi yang mengikuti caramu berkarya.</p>
              </div>
            </div>
            <div className="fs-image-caption">
              <span>01</span><span>Dipilih untuk kebutuhan sehari-hari</span><span className="fs-caption-line" />
            </div>
          </div>
        </div>

        <div className="fs-feature-strip mt-16 grid grid-cols-1 divide-y divide-border border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {FEATURES.map((feature, index) => (
            <div key={feature.label} className="flex items-center gap-3 py-5 sm:px-6 sm:first:pl-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                <feature.icon className="h-[18px] w-[18px]" />
              </span>
              <span className="text-sm font-medium text-foreground">{feature.label}</span>
              <span className="ml-auto text-xs text-muted-foreground">0{index + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
