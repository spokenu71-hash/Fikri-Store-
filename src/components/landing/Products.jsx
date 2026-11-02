import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Monitor,
} from "lucide-react";
import { CATEGORIES } from "@/lib/products";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/landing/ProductCard";

function formatPrice(price) {
  if (price === null || price === undefined || price === "") {
    return "Tanya harga";
  }

  const number = Number(price);
  if (!Number.isFinite(number)) return String(price);
  return "Rp " + number.toLocaleString("id-ID");
}

function toProductCard(row) {
  const description = String(row.description || "");
  const lines = description
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const icons = {
    prosesor: Cpu,
    cpu: Cpu,
    ram: MemoryStick,
    memory: MemoryStick,
    storage: HardDrive,
    ssd: HardDrive,
    hdd: HardDrive,
    layar: Monitor,
    monitor: Monitor,
  };

  const specs = lines.map((line) => {
    const separator = line.indexOf(":");
    if (separator > 0) {
      const label = line.slice(0, separator).trim();
      const value = line.slice(separator + 1).trim();
      const Icon = icons[label.toLowerCase()] || Monitor;
      return { icon: Icon, label, value };
    }
    return { icon: Monitor, label: "Info", value: line };
  });

  const images = String(row.image_url || "")
    .split(/[\n,]/)
    .map((url) => url.trim())
    .filter((url) => /^https?:\/\//i.test(url));

  const category = row.category || "elektronik-lainnya";
  const stock = Number(row.stock || 0);

  return {
    id: row.id,
    name: row.name || "Produk Fikri Store",
    tagline: lines[0] || "Pilihan produk Fikri Store",
    price: formatPrice(row.price),
    priceNote: stock > 0 ? `${stock} unit tersedia` : "Tanya ketersediaan",
    badge: stock > 0 ? "Ready" : "Cek stok",
    categories: [category],
    images,
    specs: specs.length > 0
      ? specs
      : [{ icon: Monitor, label: "Kategori", value: category }],
  };
}

function ProductSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-3xl border border-border bg-card"
    >
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
  const tabRefs = useRef({});

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      setLoading(true);
      setLoadError(false);

      if (!supabase) {
        if (mounted) {
          setProducts([]);
          setLoadError(true);
          setLoading(false);
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (!mounted) return;

        setProducts(Array.isArray(data) ? data.map(toProductCard) : []);
        setLoadError(false);
      } catch (error) {
        console.error("Gagal memuat produk Supabase:", error);
        if (mounted) {
          setProducts([]);
          setLoadError(true);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      mounted = false;
    };
  }, [retryCount]);

  const visibleCategories = useMemo(
    () => CATEGORIES.filter((category) =>
      category.id === "all" ||
      ["laptop", "smartphone", "tablet", "aksesori", "elektronik-lainnya"].includes(category.id) ||
      products.some((product) => product.categories.includes(category.id))
    ),
    [products]
  );

  const filtered = useMemo(() => {
    if (active === "all") return products;
    return products.filter((product) => product.categories.includes(active));
  }, [active, products]);

  function handleTabKeyDown(event, currentIndex) {
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % visibleCategories.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + visibleCategories.length) % visibleCategories.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = visibleCategories.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextCategory = visibleCategories[nextIndex];
    setActive(nextCategory.id);
    tabRefs.current[nextCategory.id]?.focus();
  }

  return (
    <section id="produk" className="relative py-16 sm:py-24 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Produk Pilihan
          </span>
          <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
            Lagi cari apa?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Lihat yang tersedia sekarang. Kalau ada yang menarik, tinggal tanya detailnya lewat WhatsApp.
          </p>
        </div>

        {loadError && (
          <div className="mt-4 flex flex-col items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4" role="alert">
            <p className="text-sm text-amber-600">
              Katalog sedang tidak dapat dimuat. Informasi stok dan harga
              belum tersedia. Silakan coba lagi atau hubungi kami melalui WhatsApp.
            </p>
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="min-h-[40px] rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
            >
              Coba muat ulang
            </button>
          </div>
        )}

        <div
          role="tablist"
          aria-label="Filter kategori kebutuhan"
          aria-orientation="horizontal"
          className="mt-8 flex flex-wrap gap-2"
        >
          {visibleCategories.map((category, index) => {
            const isActive = active === category.id;
            return (
              <button
                key={category.id}
                ref={(node) => {
                  tabRefs.current[category.id] = node;
                }}
                id={`category-tab-${category.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="product-category-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(category.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all min-h-[42px] ${
                  isActive
                    ? "bg-primary text-primary-foreground glow-lime"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        <div
          id="product-category-panel"
          role="tabpanel"
          aria-labelledby={`category-tab-${active}`}
          aria-busy={loading}
          tabIndex={0}
          className="mt-8 outline-offset-4"
        >
          {loading ? (
            <div role="status" aria-live="polite">
              <span className="sr-only">Memuat katalog produk...</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[0, 1, 2].map((item) => <ProductSkeleton key={item} />)}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && !loadError && filtered.length === 0 && (
            <div className="rounded-3xl border border-border bg-card px-6 py-10 text-center">
              <p className="font-heading text-lg font-bold">Lagi menyiapkan pilihan buat kamu.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Belum ada produk yang ditampilkan di kategori ini. Coba mampir lagi sebentar lagi.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
