import React from "react";
import { ArrowUp, Instagram, Youtube, Music2 } from "lucide-react";

const FOOTER_LINKS = [
  { label: "Produk", href: "#produk" },
  { label: "Tentang", href: "#tentang" },
  { label: "FAQ", href: "#faq" },
  { label: "Kontak", href: "#hero" },
];

const SOCIALS = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Music2, href: "#", label: "TikTok" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative border-t border-border pt-14 pb-28 sm:pb-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-10">
          {/* Left */}
          <div className="max-w-xs">
            <p className="font-heading text-xl font-extrabold tracking-tight">
              Fikri<span className="text-primary"> Store</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Laptop Second, Smart Choice.
            </p>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Laptop second kece buat kuliah, kerja, sampai desain. Budget
              tetap aman.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Navigasi
              </p>
              <ul className="mt-4 space-y-2.5">
                {FOOTER_LINKS.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-foreground/80 hover:text-primary transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Sosial
              </p>
              <div className="mt-4 flex gap-3">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="h-10 w-10 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                  >
                    <s.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} Fikri Store. All rights reserved.
          </p>
          <button
            onClick={toTop}
            aria-label="Kembali ke atas"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
          >
            Kembali ke atas
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}