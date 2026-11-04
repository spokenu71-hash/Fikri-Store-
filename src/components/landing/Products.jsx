import React, { useEffect, useMemo, useRef, useState } from "react";
import { Cpu, MemoryStick, HardDrive, Monitor, Search } from "lucide-react";
import { CATEGORIES } from "@/lib/products";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/landing/ProductCard";
import ProductDetail from "@/components/landing/ProductDetail";
import { toProductCard, filterProducts } from "@/lib/catalog";

const SPEC_COMPONENTS = { cpu: Cpu, memory: MemoryStick, storage: HardDrive, monitor: Monitor };

function mapDatabaseProduct(row) {
  const product = toProductCard(row);
  return {
    ...product,
    specs: product.specs.map((spec) => ({ ...spec, icon: SPEC_COMPONENTS[spec.icon] || Monitor })),
  };
}

function ProductSkeleton() {
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-3xl border border-border bg-card">
      <div className="aspect-[4/3] skeleton-shimmer bg-secondary" />
      <div className="space-y-4 p-5">
        <div className="h-5 w-3/4 rounded skeleton-shimmer bg-secondary" />
        <div className="h-4 w-1/2 rounded skeleton-shimmer bg-secondary" />
        <div className="space-y-2 pt-2">
          <div className="h-3 w-full rounded skeleton-shimmer bg-secondary" />
          <div className="h-3 w-5/6 rounded skeleton-shimmer bg-secondary" />
          <div className="h-3 w-2/3 rounded skeleton-shimmer bg-secondary" />
        </div>
        <div className="h-10 w-full rounded-xl skeleton-shimmer bg-secondary" />
      </div>
    </div>
  );
}

export default function Products() {
  const [active, setActive] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [search, setSearch] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const tabRefs = useRef({});

  useEffect(() => {
    let mounted = true;
    async function loadProducts() {
      setLoading(true);
      setLoadError(false);
      if (!supabase) {
        if (mounted) { setProducts([]); setLoadError(true); setLoading(false); }
        return;
      }
      try {
        const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        if (mounted) setProducts(Array.isArray(data) ? data.map(mapDatabaseProduct) : []);
      } catch (error) {
        console.error("Gagal memuat produk Supabase:", error);
        if (mounted) { setProducts([]); setLoadError(true); }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadProducts();
    return () => { mounted = false; };
  }, [retryCount]);

  const storefrontProducts = useMemo(() => products.filter((product) => product.categories.some((category) => ["laptop", "smartphone"].includes(category))), [products]);
  const laptopProducts = useMemo(() => storefrontProducts.filter((product) => product.categories.includes("laptop")), [storefrontProducts]);
  const phoneProducts = useMemo(() => storefrontProducts.filter((product) => product.categories.includes("smartphone")), [storefrontProducts]);
  const categoryProducts = active === "laptop" ? laptopProducts : active === "smartphone" ? phoneProducts : storefrontProducts;
  const visibleCategories = useMemo(() => CATEGORIES.filter((category) => ["all", "laptop", "smartphone"].includes(category.id)).map((category) => category.id === "smartphone" ? { ...category, label: "HP" } : category), []);
  const filtered = useMemo(() => filterProducts(categoryProducts, { category: "all", availableOnly, search }), [active, categoryProducts, search, availableOnly]);

  function handleTabKeyDown(event, currentIndex) {
    let nextIndex = currentIndex;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % visibleCategories.length;
    else if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + visibleCategories.length) % visibleCategories.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = visibleCategories.length - 1;
    else return;
    event.preventDefault();
    const nextCategory = visibleCategories[nextIndex];
    setActive(nextCategory.id);
    tabRefs.current[nextCategory.id]?.focus();
  }

  return (
    <section id="produk" className="relative border-t border-border pt-7 pb-8 sm:border-t-0 sm:py-24 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Produk Pilihan</span>
          <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">Lagi cari apa?</h2>
          <p className="mt-3 text-muted-foreground">Temukan laptop dan HP untuk kuliah, kerja, maupun kebutuhan harian. Cek detail unit dan ketersediaan langsung kepada kami.</p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block flex-1">
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <span className="sr-only">Cari produk</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder="Cari nama atau spesifikasi produk..." className="min-h-12 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary" />
          </label>
          <label className="inline-flex min-h-12 items-center gap-3 rounded-xl border border-border bg-card px-4 text-sm font-medium">
            <input type="checkbox" checked={availableOnly} onChange={(event) => setAvailableOnly(event.target.checked)} className="h-4 w-4 accent-current" />
            Stok tersedia saja
          </label>
        </div>

        {loadError && (
          <div className="mt-4 flex flex-col items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4" role="alert">
            <p className="text-sm text-amber-600">Katalog sedang tidak dapat dimuat. Informasi stok dan harga belum tersedia. Silakan coba lagi atau hubungi kami melalui WhatsApp.</p>
            <button type="button" onClick={() => setRetryCount((count) => count + 1)} className="min-h-[40px] rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/40">Coba muat ulang</button>
          </div>
        )}

        <div role="tablist" aria-label="Filter kategori kebutuhan" aria-orientation="horizontal" className="mt-8 flex flex-wrap gap-2">
          {visibleCategories.map((category, index) => {
            const isActive = active === category.id;
            return (
              <button key={category.id} ref={(node) => { tabRefs.current[category.id] = node; }} id={`category-tab-${category.id}`} type="button" role="tab" aria-selected={isActive} aria-controls="product-category-panel" tabIndex={isActive ? 0 : -1} onClick={() => setActive(category.id)} onKeyDown={(event) => handleTabKeyDown(event, index)} className={`rounded-full px-4 py-2 text-sm font-medium transition-all min-h-[42px] ${isActive ? "bg-primary text-primary-foreground glow-lime" : "border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40"}`}>
                {category.label}
              </button>
            );
          })}
        </div>

        {!loading && !loadError && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3" aria-live="polite">
            <p className="text-sm text-muted-foreground">
              Menampilkan <span className="font-semibold text-foreground">{filtered.length}</span> dari <span className="font-semibold text-foreground">{categoryProducts.length}</span> {active === "smartphone" ? "HP" : active === "laptop" ? "laptop" : "produk"}
            </p>
            {(search || availableOnly || active !== "all") && (
              <button
                type="button"
                onClick={() => { setSearch(""); setAvailableOnly(false); setActive("all"); }}
                className="min-h-10 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                Reset pencarian & filter
              </button>
            )}
          </div>
        )}

        <div id="product-category-panel" role="tabpanel" aria-labelledby={`category-tab-${active}`} aria-busy={loading} tabIndex={0} className="mt-4 outline-offset-4">
          {loading ? (
            <div role="status" aria-live="polite">
              <span className="sr-only">Memuat katalog produk...</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{[0, 1, 2].map((item) => <ProductSkeleton key={item} />)}</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((product) => <ProductCard key={product.id} product={product} onViewDetails={() => setSelectedProduct(product)} />)}
            </div>
          )}
          {!loading && !loadError && filtered.length === 0 && (
            <div className="rounded-3xl border border-border bg-card px-6 py-10 text-center">
              <p className="font-heading text-lg font-bold">{categoryProducts.length ? "Belum ada produk yang cocok." : loadError ? "Katalog belum dapat dimuat." : active === "smartphone" ? "Pilihan HP sedang disiapkan." : active === "laptop" ? "Pilihan laptop sedang disiapkan." : "Pilihan produk sedang disiapkan."}</p>
              <p className="mt-2 text-sm text-muted-foreground">Coba ubah kata kunci atau filter stok tersedia.</p>
              {(search || availableOnly || active !== "all") && <button type="button" onClick={() => { setSearch(""); setAvailableOnly(false); setActive("all"); }} className="mt-4 min-h-10 rounded-full border border-border px-4 text-sm font-semibold hover:border-primary/50">Hapus filter</button>}
            </div>
          )}
        </div>
      </div>
      {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </section>
  );
}
