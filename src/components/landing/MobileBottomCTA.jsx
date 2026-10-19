import React from "react";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/products";

export default function MobileBottomCTA() {
  const waLink = buildWhatsAppLink("Halo Fikri Store, saya mau tanya-tanya soal laptop second yang available.");

  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 z-30 border-t border-border bg-background/90 backdrop-blur-lg px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground glow-lime transition-transform active:scale-95 min-h-[48px]"
      >
        <MessageCircle className="h-5 w-5" />
        Chat via WhatsApp
      </a>
    </div>
  );
}