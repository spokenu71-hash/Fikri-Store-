
import React, { useEffect, useMemo, useState } from "react";
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Monitor,
} from "lucide-react";
import { CATEGORIES, PRODUCTS } from "@/lib/products";
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

    return {
      icon: Monitor,
      label: "Info",
      value: line,
    };
  });

  const images = String(row.image_url || "")
    .split(/[\n,]/)
    .map((url) => url.trim())
    .filter((url) => /^https?:\/\//i.test(url));

  const category = row.category || "kuliah-kerja";
  const stock = Number(row.stock || 0);

  return {
    id: row.id,
    name: row.name || "Produk Fikri Store",
    tagline: lines[0] || "Laptop second pilihan",
    price: formatPrice(row.price),
    priceNote:
      stock > 0
        ? `Stok tersedia: ${stock} unit`
        : "Stok perlu dikonfirmasi",
    badge: stock > 0 ? "" : "Cek Stok",
    categories: [category],
    images,
    specs:
      specs.length > 0
        ? specs
        : [
            {
              icon: Monitor,
              label: "Kategori",
              value: category,
            },
          ],
  };
}

export default function Products() {
  const [active, setActive] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      if (!supabase) {
        if (mounted) {
          setProducts(PRODUCTS);
          setLoading(false);
          setLoadError(true);
        }
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!mounted) return;

      if (error) {
        console.error("Gagal memuat produk Supabase:", error);
        setProducts(PRODUCTS);
        setLoadError(true);
      } else {
        setProducts((data || []).map(toProductCard));
        setLoadError(false);
      }

      setLoading(false);
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (active === "all") return products;

    return products.filter((product) =>
      product.categories.includes(active)
    );
  }, [active, products]);

  return (
    <section
      id="produk"
      className="relative py-16 sm:py-24 scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Pilihan Laptop
          </span>

          <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
            Produk terbaik untuk kebutuhanmu
          </h2>

          <p className="mt-3 text-muted-foreground">
            Pilihan laptop second Fikri Store. Hubungi kami untuk
            memastikan kondisi dan ketersediaan unit.
          </p>
        </div>

        {loadError && (
          <p className="mt-4 text-sm text-amber-600">
            Katalog belum dapat terhubung ke Supabase. Produk
            cadangan sedang ditampilkan.
          </p>
        )}

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

        {loading ? (
          <p className="mt-10 text-center text-muted-foreground">
            Memuat produk...
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="mt-10 text-center text-muted-foreground">
            Belum ada unit di kategori ini. Coba kategori lain
            atau chat WhatsApp untuk menanyakan stok.
          </p>
        )}
      </div>
    </section>
  );
}
