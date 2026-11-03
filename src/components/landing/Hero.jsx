import React, { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Truck, MessageCircle, Sparkles } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/products";
import { Image } from "@/components/ui/image";
import { supabase } from "@/lib/supabase";

const HERO_IMG = "https://media.base44.com/images/public/6acf25a8d877b5aac6c96735/7b34e082f_generated_image.png";

const FEATURES = [
  { icon: CheckCircle2, label: "Produk dicek sebelum dikirim" },
  { icon: Truck, label: "Pengiriman ke seluruh Indonesia" },
  { icon: MessageCircle, label: "Konsultasi langsung via WhatsApp" },
];

const MOODS = [
  { id: "blue", label: "Ocean", color: "#3977ed", glow: "rgba(57,119,237,.20)" },
  { id: "violet", label: "Violet", color: "#8065df", glow: "rgba(128,101,223,.20)" },
  { id: "mint", label: "Mint", color: "#269d83", glow: "rgba(38,157,131,.18)" },
];

export default function Hero() {
  const [customHeroImage, setCustomHeroImage] = useState("");
  const [mood, setMood] = useState(MOODS[0]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [bursts, setBursts] = useState([]);
  const [isTouching, setIsTouching] = useState(false);

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

  const handlePointerMove = (event) => {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    setTilt({ x: (0.5 - y) * 11, y: (x - 0.5) * 13 });
    event.currentTarget.style.setProperty("--fs-pointer-x", `${x * 100}%`);
    event.currentTarget.style.setProperty("--fs-pointer-y", `${y * 100}%`);
  };

  const handlePointerLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsTouching(false);
  };

  const scatterParticles = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const id = Date.now() + Math.random();
    setBursts((current) => [...current.slice(-2), { id, x, y }]);
    window.setTimeout(() => {
      setBursts((current) => current.filter((item) => item.id !== id));
    }, 900);
  };

  return (
    <section
      id="hero"
      className={`fs-hero fs-soda-hero relative pt-28 sm:pt-36 pb-16 sm:pb-24 fs-mood-${mood.id}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
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

          <div className="fs-hero-visual-wrap fs-soda-stage-wrap">
            <div
              className={`fs-hero-visual fs-soda-stage relative aspect-[5/4] overflow-hidden rounded-[2rem]${isTouching ? " is-touching" : ""}`}
              style={{
                "--fs-tilt-x": `${tilt.x}deg`,
                "--fs-tilt-y": `${tilt.y}deg`,
                "--fs-mood-color": mood.color,
                "--fs-mood-glow": mood.glow,
              }}
              onPointerDown={(event) => {
                setIsTouching(true);
                scatterParticles(event);
              }}
              onPointerUp={() => setIsTouching(false)}
            >
              <div className="fs-soda-halo" aria-hidden="true" />
              <div className="fs-soda-orbit fs-soda-orbit-one" aria-hidden="true" />
              <div className="fs-soda-orbit fs-soda-orbit-two" aria-hidden="true" />
              <div className="fs-soda-product">
                <Image
                  src={customHeroImage || HERO_IMG}
                  alt="Pilihan produk elektronik Fikri Store"
                  className="fs-hero-image h-full w-full"
                  fittingType="fill"
                />
              </div>
              <div className="fs-soda-spec fs-soda-spec-top" aria-hidden="true">
                <Sparkles className="h-3.5 w-3.5" />
                <span>CURATED TECH</span>
              </div>
              <div className="fs-soda-spec fs-soda-spec-bottom" aria-hidden="true">
                <span className="fs-soda-spec-dot" />
                <span>Made for your everyday</span>
              </div>
              {bursts.map((burst) => (
                <span
                  key={burst.id}
                  className="fs-soda-particle-burst"
                  style={{ left: burst.x, top: burst.y }}
                  aria-hidden="true"
                >
                  {Array.from({ length: 7 }).map((_, index) => (
                    <i key={index} style={{ "--particle-index": index }} />
                  ))}
                </span>
              ))}
              <div className="fs-soda-overlay">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">Discover your next essential</p>
                <p className="mt-2 max-w-sm text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">Teknologi yang mengikuti caramu berkarya.</p>
              </div>
            </div>
            <div className="fs-soda-controls" aria-label="Pilih warna suasana animasi">
              <span className="fs-soda-controls-label">Pilih mood</span>
              <div className="fs-soda-moods">
                {MOODS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`fs-soda-mood-button${mood.id === option.id ? " is-active" : ""}`}
                    onClick={() => setMood(option)}
                    aria-label={`Gunakan warna ${option.label}`}
                    aria-pressed={mood.id === option.id}
                    style={{ "--swatch": option.color }}
                  >
                    <span />
                    {option.label}
                  </button>
                ))}
              </div>
              <span className="fs-soda-hint">Gerakkan kursor atau sentuh visualnya</span>
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
