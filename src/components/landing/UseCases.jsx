import React, { useEffect, useState } from "react";
import { USE_CASES } from "@/lib/products";
import { Image } from "@/components/ui/image";
import { supabase } from "@/lib/supabase";
import Reveal from "@/components/ui/reveal";

const IMAGE_KEYS = {
  Kuliah: "kuliah",
  Kerja: "kerja",
  "Desain & Kreatif": "desain",
  "Gaming Ringan": "gaming",
};

export default function UseCases() {
  const [customImages, setCustomImages] = useState({});
  useEffect(() => {
    let active = true;
    async function loadImages() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase.from("site_images").select("image_key,image_url");
        if (error) throw error;
        if (!active || !Array.isArray(data)) return;
        const result = {};
        data.forEach((item) => {
          if (item?.image_key && item?.image_url) result[item.image_key] = item.image_url;
        });
        setCustomImages(result);
      } catch (error) {
        console.error("Gagal memuat gambar use case:", error);
      }
    }
    loadImages();
    return () => { active = false; };
  }, []);

  return (
    <section id="use-cases" className="relative border-t border-border bg-light py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-800">Dibuat untuk keseharian</span>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Satu kebutuhan, banyak kemungkinan.</h2>
          <p className="mt-3 text-light-muted">Temukan perangkat yang mendukung aktivitasmu, dari ruang kuliah sampai ruang kreatif.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {USE_CASES.map((useCase, index) => {
            const key = IMAGE_KEYS[useCase.title];
            const imageSrc = (key && customImages[key]) || useCase.image;
            return (
              <Reveal as="div" key={useCase.index} delay={index * 90} className="group relative aspect-[3/4] overflow-hidden rounded-3xl border border-light-border bg-white">
                <Image src={imageSrc} alt={useCase.title} className="h-full w-full" fittingType="fill" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101b30]/90 via-[#101b30]/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <span className="font-heading text-3xl font-extrabold text-white/65">{String(useCase.index).padStart(2,"0")}</span>
                  <h3 className="mt-1 font-heading text-xl font-bold text-white">{useCase.title}</h3>
                  <p className="mt-1 text-sm text-white/75">{useCase.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
