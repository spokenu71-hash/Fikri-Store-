import React from "react";
import { VALUE_PROPS } from "@/lib/products";

export default function ValueProps() {
  return (
    <section className="relative py-16 sm:py-24 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Kenapa Kami
          </span>
          <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
            Kenapa pilih Fikri Store?
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VALUE_PROPS.map((v) => (
            <div
              key={v.title}
              className="rounded-3xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <v.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-base">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}