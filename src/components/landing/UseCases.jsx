import React, { useEffect, useState } from "react";
import { USE_CASES } from "@/lib/products";
import { Image } from "@/components/ui/image";
import { supabase } from "@/lib/supabase";

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
        const { data, error } = await supabase
          .from("site_images")
          .select("image_key,image_url");

        if (error) throw error;
        if (!active || !Array.isArray(data)) return;

        const result = {};
        data.forEach((item) => {
          if (item?.image_key && item?.image_url) {
            result[item.image_key] = item.image_url;
          }
        });
        setCustomImages(result);
      } catch (error) {
        console.error("Gagal memuat gambar use case:", error);
      }
    }

    loadImages();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="use-cases"
      className="relative pt-8 pb-8 sm:py-20 border-t border-border bg-light"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-800">
            Cocok Untuk
          </span>

          <h2 className="mt-2 font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-light-foreground">
            Laptop untuk aktivitas sehari-hari
          </h2>

          <p className="mt-3 text-sm sm:text-base text-light-muted">
            Pilih laptop sesuai aktivitas kuliah, kerja, desain, atau hiburan.
          </p>
        </div>

        <div className="mt-7 sm:mt-10 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {USE_CASES.map((useCase) => {
            const key = IMAGE_KEYS[useCase.title];
            const imageSrc = (key && customImages[key]) || useCase.image;

            return (
              <article
                key={useCase.index}
                className="group relative min-w-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-light-border bg-white aspect-[4/5] sm:aspect-[5/6]"
              >
                <Image
                  src={imageSrc}
                  alt={useCase.title}
                  className="w-full h-full transition-transform duration-500 group-hover:scale-[1.04]"
                  fittingType="fill"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 flex flex-col">
                  <span className="font-heading text-2xl sm:text-3xl font-extrabold text-primary text-glow-lime">
                    {useCase.index}
                  </span>
                  <h3 className="mt-1 font-heading text-base sm:text-xl font-bold leading-tight text-white">
                    {useCase.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm leading-snug text-white/80">
                    {useCase.desc}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
