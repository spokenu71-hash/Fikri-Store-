import React, { useRef, useState } from "react";
import { MessageCircle, ChevronLeft, ChevronRight, Monitor } from "lucide-react";
import { productWhatsAppLink } from "@/lib/products";
import { Image } from "@/components/ui/image";

export default function ProductCard({ product, onViewDetails }) {
  const [imgIndex, setImgIndex] = useState(0);
  const touchStart = useRef(null);
  const hasImages = Array.isArray(product.images) && product.images.length > 0;
  const imageCount = hasImages ? product.images.length : 0;
  // Keep the selected image valid when refreshed product data changes the gallery length.
  const currentImageIndex = imageCount > 0 ? imgIndex % imageCount : 0;

  const nextImg = () => {
    if (imageCount > 1) setImgIndex((index) => (index + 1) % imageCount);
  };

  const prevImg = () => {
    if (imageCount > 1) setImgIndex((index) => (index - 1 + imageCount) % imageCount);
  };

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event) => {
    if (!touchStart.current) return;

    const start = touchStart.current;
    touchStart.current = null;
    if (imageCount < 2 || !event.changedTouches[0]) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    // Hanya tangani swipe horizontal; scroll vertikal tetap milik browser.
    if (Math.abs(deltaX) < 40 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.2) return;
    if (deltaX < 0) nextImg();
    else prevImg();
  };

  const handleCarouselKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      nextImg();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      prevImg();
    }
  };

  return (
    <article className="fs-product-card group flex flex-col rounded-3xl border border-border bg-card overflow-hidden transition-all duration-300">
      <div
        className="fs-product-media relative aspect-[4/3] bg-secondary overflow-hidden"
        style={{ touchAction: "pan-y" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => {
          touchStart.current = null;
        }}
        onKeyDown={imageCount > 1 ? handleCarouselKeyDown : undefined}
        role={imageCount > 1 ? "group" : undefined}
        aria-roledescription={imageCount > 1 ? "carousel" : undefined}
        aria-label={imageCount > 1 ? `Galeri foto ${product.name}` : undefined}
        tabIndex={imageCount > 1 ? 0 : undefined}
      >
        {hasImages ? (
          <>
            <Image
              src={product.images[currentImageIndex]}
              alt={`${product.name} — foto ${currentImageIndex + 1} dari ${imageCount}`}
              className="w-full h-full"
              fittingType="fit"
            />
            {imageCount > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImg}
                  aria-label="Foto sebelumnya"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/70 backdrop-blur flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <ChevronLeft aria-hidden="true" className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={nextImg}
                  aria-label="Foto berikutnya"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/70 backdrop-blur flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <ChevronRight aria-hidden="true" className="h-5 w-5" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setImgIndex(index)}
                      aria-label={`Tampilkan foto ${index + 1}`}
                      aria-pressed={index === currentImageIndex}
                      className={`h-2.5 rounded-full transition-all ${index === currentImageIndex ? "w-5 bg-primary" : "w-2.5 bg-foreground/50"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 gap-3">
            <div className="h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center">
              <Monitor aria-hidden="true" className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground max-w-[16rem]">
              Foto produk belum tersedia. Hubungi kami untuk melihat foto dan detail terbarunya.
            </p>
          </div>
        )}

        {product.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-lg">
            {product.badge}
          </span>
        )}
      </div>

      <div className="fs-product-content flex flex-col flex-1 p-5">
        <h3 className="font-heading text-lg font-bold tracking-tight">{product.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{product.tagline}</p>

        <ul className="mt-4 space-y-2.5 flex-1">
          {product.specs.map((spec, index) => (
            <li key={index} className="flex items-center gap-2.5 text-sm">
              <spec.icon aria-hidden="true" className="h-4 w-4 text-primary shrink-0" />
              <span className="text-muted-foreground">{spec.label}:</span>
              <span className="text-foreground font-medium">{spec.value}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 pt-4 border-t border-border">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-primary">{product.price}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{product.priceNote}</p>

          {onViewDetails && (
            <button
              type="button"
              onClick={onViewDetails}
              className="fs-product-details mb-2 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors"
            >
              Lihat detail
            </button>
          )}
          <a
            href={productWhatsAppLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="fs-product-ask mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-transform min-h-[48px]"
          >
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
            Tanya produk ini
          </a>
        </div>
      </div>
    </article>
  );
}
