import React from "react";
import { VALUE_PROPS } from "@/lib/products";

export default function ValueProps() {
  return (
    <section className="relative py-14 sm:py-24 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Kenapa Kami
          </span>
          <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
            Kenapa pilih Fikri Store?
          </h2>
        </div>

        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {VALUE_PROPS.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-6 transition-colors hover:border-primary/40"
            >
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                <v.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-base">{v.title}</h3>
              <p className="mt-1.5 sm:mt-2 text-sm text-muted-foreground leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
