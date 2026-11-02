import React from "react";
import { ArrowUp, MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/products";

const FOOTER_LINKS = [
  { label: "Produk", href: "#produk" },
  { label: "Tentang", href: "#tentang" },
  { label: "FAQ", href: "#faq" },
  { label: "Kontak", href: "#kontak" },
];

export default function Footer() {
  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const contactLink = buildWhatsAppLink(
    "Halo Fikri Store, saya ingin bertanya tentang produk elektronik yang tersedia."
  );

  return (
    <footer className="relative border-t border-border pt-14 pb-28 sm:pb-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-10">
          <div className="max-w-xs">
            <p className="font-heading text-xl font-extrabold tracking-tight">
              Fikri<span className="text-primary"> Store</span>
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              Good Finds. Better Choices.
            </p>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Temukan pilihan elektronik dengan informasi produk yang jelas dan konsultasi yang mudah.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Navigasi</p>
              <ul className="mt-4 space-y-2.5">
                {FOOTER_LINKS.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-foreground/80 hover:text-primary transition-colors">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Hubungi kami</p>
              <a href={contactLink} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-[42px] items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary">
                <MessageCircle className="h-4 w-4" />
                WhatsApp Fikri Store
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center sm:text-left">© {new Date().getFullYear()} Fikri Store. All rights reserved.</p>
          <button type="button" onClick={toTop} aria-label="Kembali ke atas" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
            Kembali ke atas
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
