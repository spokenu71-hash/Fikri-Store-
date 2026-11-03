import React, { useEffect, useState } from "react";
import { ArrowUpRight, Menu, MessageCircle, X } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/products";

const LINKS = [
  { label: "Produk", href: "#produk" },
  { label: "Kebutuhan", href: "#use-cases" },
  { label: "Tentang", href: "#tentang" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const waLink = buildWhatsAppLink("Halo Fikri Store, saya ingin konsultasi produk yang tersedia. Bisa bantu rekomendasikan pilihan sesuai kebutuhan dan budget saya?");

  return (
    <header className={`fs-nav fixed inset-x-0 top-0 z-50 ${scrolled ? "is-scrolled" : ""}`}>
      <nav className="fs-nav-inner mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8" aria-label="Navigasi utama">
        <a href="#hero" className="fs-brand" onClick={() => setOpen(false)} aria-label="Fikri Store — beranda">
          <span className="fs-brand-mark">F</span>
          <span>fikri<span>store.</span></span>
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => <a key={link.href} href={link.href} className="fs-nav-link">{link.label}</a>)}
        </div>
        <div className="flex items-center gap-3">
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="fs-nav-contact hidden sm:inline-flex">
            <MessageCircle className="h-4 w-4" /> Konsultasi <ArrowUpRight className="h-4 w-4" />
          </a>
          <button type="button" className="fs-menu-toggle md:hidden" onClick={() => setOpen((value) => !value)} aria-label={open ? "Tutup menu" : "Buka menu"} aria-expanded={open} aria-controls="fs-mobile-menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <div id="fs-mobile-menu" className="fs-mobile-menu md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
            {LINKS.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}<ArrowUpRight className="h-4 w-4" /></a>)}
            <a href={waLink} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="fs-mobile-contact"><MessageCircle className="h-4 w-4" /> Chat WhatsApp</a>
          </div>
        </div>
      )}
    </header>
  );
}
