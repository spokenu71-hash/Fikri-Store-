import React from "react";
import { USE_CASES } from "@/lib/products";
import { Image } from "@/components/ui/image";

export default function UseCases() {
  return (
    <section id="use-cases" className="relative py-16 sm:py-24 border-t border-border bg-light">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Cocok Untuk
          </span>
          <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-light-foreground">
            Laptop buat segala aktivitasmu
          </h2>
          <p className="mt-3 text-light-muted">
            Mau kuliah, kerja, desain, atau gaming ringan — ada unit yang pas
            buat kamu.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {USE_CASES.map((uc) => (
            <div
              key={uc.index}
              className="group relative overflow-hidden rounded-3xl border border-light-border bg-white aspect-[3/4]"
            >
              <Image
                src={uc.image}
                alt={uc.title}
                className="w-full h-full"
                fittingType="fill"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <span className="font-heading text-3xl font-extrabold text-primary text-glow-lime">
                  {uc.index}
                </span>
                <h3 className="mt-1 font-heading text-xl font-bold text-white">
                  {uc.title}
                </h3>
                <p className="mt-1 text-sm text-white/80">{uc.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}