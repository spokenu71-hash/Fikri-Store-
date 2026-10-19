import React, { useState, useMemo } from "react";
import { CATEGORIES, PRODUCTS } from "@/lib/products";
import ProductCard from "@/components/landing/ProductCard";

export default function Products() {
  const [active, setActive] = useState("all");

  const filtered = useMemo(() => {
    if (active === "all") return PRODUCTS;
    return PRODUCTS.filter((p) => p.categories.includes(active));
  }, [active]);

  return (
    <section id="produk" className="relative py-16 sm:py-24 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Pilihan Laptop
          </span>
          <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
            Produk terbaik untuk kebutuhanmu
          </h2>
          <p className="mt-3 text-muted-foreground">
            Tiga pilihan laptop second pilihan. Semua unit pakai foto asli,
            stok dikonfirmasi langsung.
          </p>
        </div>

        {/* Filter */}
        <div
          role="tablist"
          aria-label="Filter kategori kebutuhan"
          className="mt-8 flex flex-wrap gap-2"
        >
          {CATEGORIES.map((cat) => {
            const isActive = active === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(cat.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all min-h-[40px] ${
                  isActive
                    ? "bg-primary text-primary-foreground glow-lime"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-10 text-center text-muted-foreground">
            Belum ada unit di kategori ini. Coba kategori lain atau chat
            WhatsApp buat nanya stok.
          </p>
        )}
      </div>
    </section>
  );
}