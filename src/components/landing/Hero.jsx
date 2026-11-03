import React, { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, BadgeCheck, MessageCircle, ShieldCheck, Truck, Zap } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/products";
import { Image } from "@/components/ui/image";
import { supabase } from "@/lib/supabase";

const FALLBACK_IMAGE = "https://media.base44.com/images/public/6acf25a8d877b5aac6c96735/7b34e082f_generated_image.png";

export default function Hero() {
  const [heroImage, setHeroImage] = useState("");
  useEffect(() => {
    let active = true;
    async function loadImage() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase.from("site_images").select("image_url").eq("image_key", "hero").maybeSingle();
        if (error) throw error;
        if (active && data?.image_url) setHeroImage(data.image_url);
      } catch (error) {
        console.error("Gagal memuat gambar Hero:", error);
      }
    }
    loadImage();
    return () => { active = false; };
  }, []);

  const waLink = buildWhatsAppLink("Halo Fikri Store, saya ingin konsultasi produk yang tersedia dan rekomendasi sesuai kebutuhan serta budget saya.");

  return (
    <section id="hero" className="fs-hero fs-hero-v2 relative">
      <div className="fs-hero-noise" aria-hidden="true" />
      <div className="fs-hero-inner relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-32 sm:px-8 sm:pb-24 sm:pt-40 lg:grid-cols-[.9fr_1.1fr] lg:gap-14">
        <div className="fs-hero-copy relative z-10">
          <div className="fs-kicker"><span className="fs-kicker-dot" /> TECH THAT FITS YOUR LIFE <span className="fs-kicker-line" /></div>
          <h1 className="mt-7 max-w-[680px] text-[clamp(2.8rem,8vw,5.7rem)] font-bold leading-[.99] tracking-[-.075em]">
            Temukan teknologi yang <span>pas dengan caramu.</span>
          </h1>
          <p className="mt-7 max-w-[510px] text-base leading-8 text-muted-foreground sm:text-lg">
            Laptop dan elektronik pilihan untuk belajar, bekerja, dan berkarya. Temukan perangkat yang tepat tanpa harus bingung memilih.
          </p>
          <div className="mt-9 flex flex-col gap-3 min-[420px]:flex-row">
            <a href="#produk" className="fs-primary-button"><span>Jelajahi koleksi</span><ArrowRight className="h-4 w-4" /></a>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="fs-outline-button"><MessageCircle className="h-4 w-4" /> Konsultasi gratis</a>
          </div>
          <div className="fs-hero-proof mt-10">
            <div className="fs-proof-avatars" aria-hidden="true"><span>F</span><span>S</span><span>+</span></div>
            <div><strong>Pilihan lebih yakin.</strong><span>Dibantu langsung oleh tim Fikri Store</span></div>
          </div>
          <a href="#produk" className="fs-scroll-cue mt-12 hidden items-center gap-3 lg:inline-flex"><span className="fs-scroll-icon"><ArrowDown className="h-3.5 w-3.5" /></span> SCROLL TO EXPLORE</a>
        </div>

        <div className="fs-hero-art relative">
          <div className="fs-art-orbit fs-art-orbit-a" aria-hidden="true" />
          <div className="fs-art-orbit fs-art-orbit-b" aria-hidden="true" />
          <div className="fs-art-glow" aria-hidden="true" />
          <div className="fs-art-frame">
            <div className="fs-art-topline"><span>FIKRI STORE / CURATED TECH</span><span>01 — 04</span></div>
            <div className="fs-art-image">
              <Image src={heroImage || FALLBACK_IMAGE} alt="Pilihan laptop dan perangkat elektronik Fikri Store" className="h-full w-full" fittingType="fit" />
            </div>
            <div className="fs-art-caption"><span>THE RIGHT GEAR.</span><strong>Made for your next move.</strong></div>
          </div>
          <div className="fs-floating-note fs-floating-note-top"><span className="fs-note-icon"><BadgeCheck className="h-4 w-4" /></span><span><strong>Curated picks</strong><small>Dipilih dengan cermat</small></span></div>
          <div className="fs-floating-note fs-floating-note-bottom"><span className="fs-note-icon"><Zap className="h-4 w-4" /></span><span><strong>Better decisions</strong><small>Belanja lebih percaya diri</small></span></div>
          <div className="fs-art-index" aria-hidden="true"><span>01</span><i /></div>
        </div>
      </div>

      <div className="fs-benefit-band mx-auto grid max-w-7xl grid-cols-1 gap-0 px-5 sm:grid-cols-3 sm:px-8">
        <div><span className="fs-benefit-icon"><ShieldCheck className="h-[18px] w-[18px]" /></span><span><strong>Informasi transparan</strong><small>Detail produk mudah dipahami</small></span></div>
        <div><span className="fs-benefit-icon"><BadgeCheck className="h-[18px] w-[18px]" /></span><span><strong>Pilihan terkurasi</strong><small>Temukan yang sesuai kebutuhan</small></span></div>
        <div><span className="fs-benefit-icon"><Truck className="h-[18px] w-[18px]" /></span><span><strong>Siap bantu kamu</strong><small>Konsultasi sebelum memutuskan</small></span></div>
      </div>
    </section>
  );
}
