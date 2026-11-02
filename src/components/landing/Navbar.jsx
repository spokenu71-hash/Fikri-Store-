import React, { useState, useEffect } from "react";
import { MessageCircle, Menu, X } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/products";

const NAV_LINKS = [
  { label: "Produk", href: "#produk" },
  { label: "Tentang", href: "#tentang" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const waLink = buildWhatsAppLink(
    "Halo Fikri Store, saya ingin konsultasi produk yang tersedia. Bisa bantu rekomendasikan pilihan sesuai kebutuhan dan budget saya?"
  );

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-background/80 backdrop-blur-lg border-b border-border"
        : "bg-transparent border-b border-transparent"
    }`}>
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between" aria-label="Navigasi utama">
        <a href="#hero" className="font-heading text-lg font-extrabold tracking-tight" onClick={() => setOpen(false)}>
          Fikri<span className="text-primary"> Store</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{l.label}</a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90 transition-colors min-h-[40px]">
            <MessageCircle className="h-4 w-4" />
            Chat WhatsApp
          </a>
          <button type="button" onClick={() => setOpen((o) => !o)} aria-label={open ? "Tutup menu navigasi" : "Buka menu navigasi"} aria-expanded={open} aria-controls="mobile-navigation" className="md:hidden h-10 w-10 rounded-full border border-border flex items-center justify-center">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <div id="mobile-navigation" className="md:hidden border-t border-border bg-background/95 backdrop-blur-lg">
          <div className="px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">{l.label}</a>
            ))}
            <a href={waLink} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-black min-h-[44px]">
              <MessageCircle className="h-4 w-4" />
              Chat WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
