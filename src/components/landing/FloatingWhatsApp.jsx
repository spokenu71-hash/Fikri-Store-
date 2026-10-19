import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/products";

export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const waLink = buildWhatsAppLink("Halo Fikri Store, saya mau tanya-tanya soal laptop second yang available.");

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
      className={`fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-lg glow-lime transition-all duration-300 min-h-[48px] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-4"
      }`}
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">Chat WhatsApp</span>
    </a>
  );
}