import React from "react";
import { VALUE_PROPS } from "@/lib/products";
import Reveal from "@/components/ui/reveal";

export default function ValueProps() {
  return (
    <section className="relative border-t border-border py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Pengalaman Fikri Store</span>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Belanja teknologi, lebih tenang.</h2>
          <p className="mt-3 text-muted-foreground">Bukan sekadar menemukan produk. Kami ingin setiap pilihan terasa lebih jelas dan sesuai kebutuhan.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map((item, index) => (
            <Reveal as="div" key={item.title} delay={index * 80} className="fs-value-card rounded-3xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-base font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              <span className="mt-6 block h-px w-10 bg-primary/40" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
