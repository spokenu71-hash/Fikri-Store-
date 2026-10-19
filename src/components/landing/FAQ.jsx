import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "@/lib/products";

function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left min-h-[56px]"
      >
        <span className="font-semibold text-sm sm:text-base">{item.q}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-primary transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="relative py-16 sm:py-24 border-t border-border scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            FAQ
          </span>
          <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
            Masih ragu? Cek ini dulu
          </h2>
          <p className="mt-3 text-muted-foreground">
            Pertanyaan yang sering muncul soal laptop second kami.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {FAQS.map((item) => (
            <FaqItem key={item.q} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}