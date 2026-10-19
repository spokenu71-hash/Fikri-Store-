import React from "react";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/products";

export default function ClosingCTA() {
  const waLink = buildWhatsAppLink(
    "Halo Fikri Store, saya masih bingung milih laptop. Bisa bantu rekomendasi yang cocok buat budget & kebutuhan saya?"
  );

  return (
    <section className="relative py-16 sm:py-24 border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card p-8 sm:p-14 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,255,0,0.16),transparent_60%)]" />
          <div className="relative">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Hubungi Kami
            </span>
            <h2 className="mt-3 font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
              Masih bingung pilih yang mana?
            </h2>
            <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
              Langsung ke WhatsApp aja. Konsultasi gratis, kita bantu cari unit
              yang paling pas sama budget &amp; kebutuhan kamu.
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground glow-lime transition-transform hover:scale-[1.03] active:scale-95 min-h-[48px]"
            >
              <MessageCircle className="h-4 w-4" />
              Chat via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}