import React, { useState } from "react";
import { MessageCircle, ChevronLeft, ChevronRight, Monitor } from "lucide-react";
import { productWhatsAppLink } from "@/lib/products";
import { Image } from "@/components/ui/image";

export default function ProductCard({ product }) {
  const [imgIndex, setImgIndex] = useState(0);
  const hasImages = product.images.length > 0;

  const nextImg = (e) => {
    e.preventDefault();
    setImgIndex((i) => (i + 1) % product.images.length);
  };
  const prevImg = (e) => {
    e.preventDefault();
    setImgIndex((i) => (i - 1 + product.images.length) % product.images.length);
  };

  return (
    <article className="group flex flex-col rounded-3xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_40px_-12px_rgba(212,255,0,0.3)]">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-secondary overflow-hidden">
        {hasImages ? (
          <>
            <Image
              src={product.images[imgIndex]}
              alt={`${product.name} — foto unit asli`}
              className="w-full h-full"
              fittingType="fit"
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImg}
                  aria-label="Foto sebelumnya"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/70 backdrop-blur flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImg}
                  aria-label="Foto berikutnya"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/70 backdrop-blur flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {product.images.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${i === imgIndex ? "w-5 bg-primary" : "w-1.5 bg-foreground/40"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 gap-3">
            <div className="h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center">
              <Monitor className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground max-w-[16rem]">
              Foto unit asli belum diunggah. Chat WhatsApp buat minta foto
              terbaru &amp; cek kondisi unit.
            </p>
          </div>
        )}

        {product.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-lg">
            {product.badge}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-heading text-lg font-bold tracking-tight">{product.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{product.tagline}</p>

        <ul className="mt-4 space-y-2.5 flex-1">
          {product.specs.map((s, i) => (
            <li key={i} className="flex items-center gap-2.5 text-sm">
              <s.icon className="h-4 w-4 text-primary shrink-0" />
              <span className="text-muted-foreground">{s.label}:</span>
              <span className="text-foreground font-medium">{s.value}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 pt-4 border-t border-border">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-primary">{product.price}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{product.priceNote}</p>

          <a
            href={productWhatsAppLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95 min-h-[48px]"
          >
            <MessageCircle className="h-4 w-4" />
            Chat via WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}