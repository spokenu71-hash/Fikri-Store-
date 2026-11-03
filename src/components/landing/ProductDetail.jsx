import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Monitor } from "lucide-react";
import { productWhatsAppLink } from "@/lib/products";
import { Image } from "@/components/ui/image";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function ProductDetail({ product, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const [index, setIndex] = useState(0);
  const images = Array.isArray(product.images) ? product.images : [];
  const specs = Array.isArray(product.specs) ? product.specs : [];
  const titleId = `detail-title-${product.id}`;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previous = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const items = Array.from(dialogRef.current.querySelectorAll(FOCUSABLE))
        .filter((item) => item.getClientRects().length > 0);
      if (!items.length) {
        event.preventDefault();
        closeRef.current?.focus();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialogRef.current.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialogRef.current.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previous && typeof previous.focus === "function") previous.focus();
    };
  }, []);

  useEffect(() => {
    setIndex(0);
  }, [product.id]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="fs-modal-in fs-modal-surface relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-y-auto rounded-t-3xl border border-border sm:rounded-3xl"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Tutup detail produk"
          className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="grid sm:grid-cols-2">
          <div className="bg-secondary">
            <div className="relative aspect-[4/3]">
              {images.length > 0 ? (
                <Image
                  src={images[index % images.length]}
                  alt={`${product.name} — foto ${index + 1} dari ${images.length}`}
                  className="h-full w-full object-cover"
                  fittingType="fill"
                  decoding="async"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
                  <Monitor className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                  <p className="text-sm text-muted-foreground">
                    Foto belum tersedia. Minta foto terbaru lewat WhatsApp.
                  </p>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-3" role="group" aria-label="Pilih foto produk">
                {images.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Lihat foto ${i + 1}`}
                    aria-pressed={i === index}
                    className={`h-14 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${i === index ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}
                  >
                    <Image src={src} alt="" className="h-full w-full object-cover" fittingType="fill" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col p-6 sm:p-7">
            {product.badge && (
              <span className="mb-3 w-fit rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                {product.badge}
              </span>
            )}
            <h2 id={titleId} className="pr-10 font-heading text-2xl font-extrabold tracking-tight">
              {product.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{product.tagline}</p>

            {specs.length > 0 && (
              <ul className="mt-5 space-y-2.5">
                {specs.map((spec, i) => {
                  const SpecIcon = spec.icon || Monitor;
                  return (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <SpecIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <span className="text-muted-foreground">{spec.label}:</span>
                      <span className="font-medium text-foreground">{spec.value}</span>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="mt-6 border-t border-border pt-5">
              <p className="text-3xl font-extrabold text-primary">{product.price}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{product.priceNote}</p>
              <a
                href={productWhatsAppLink(product)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Tanya produk ini
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
