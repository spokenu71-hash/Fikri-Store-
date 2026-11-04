import React from "react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { buildWhatsAppLink } from "@/lib/products";

export default function ClosingCTA() {
  const waLink = buildWhatsAppLink(
    "Halo Fikri Store, saya ingin konsultasi produk yang tersedia. Bisa bantu rekomendasikan pilihan sesuai kebutuhan dan budget saya?"
  );

  return (
    <section id="kontak" className="relative pt-10 pb-12 sm:py-24 border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[1.35rem] sm:rounded-3xl border border-primary/30 bg-card px-5 py-8 sm:p-14 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,255,0,0.16),transparent_60%)]" />
          <div className="relative">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Hubungi Kami
            </span>
            <h2 className="mt-3 mx-auto max-w-[19ch] font-heading text-[1.75rem] leading-[1.16] sm:text-4xl font-extrabold tracking-tight">
              Lagi cari produk yang tepat?
            </h2>
            <p className="mt-4 max-w-[34rem] mx-auto text-base leading-relaxed text-muted-foreground sm:text-lg">
              Ceritakan kebutuhan dan budget yang kamu siapkan. Kami bantu cek pilihan produk yang paling sesuai.
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground glow-lime transition-transform hover:scale-[1.03] active:scale-95 sm:mt-8 sm:min-h-[48px] sm:px-7 sm:py-3.5"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Chat via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
