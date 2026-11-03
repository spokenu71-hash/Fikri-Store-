const SPEC_ICONS = {
  prosesor: "cpu",
  cpu: "cpu",
  ram: "memory",
  memory: "memory",
  storage: "storage",
  ssd: "storage",
  hdd: "storage",
  layar: "monitor",
  monitor: "monitor",
};

export function formatProductPrice(price) {
  if (price === null || price === undefined || price === "") return "Tanya harga";
  const number = Number(price);
  if (!Number.isFinite(number)) return String(price);
  return "Rp " + number.toLocaleString("id-ID");
}

export function parseProductImages(value) {
  return String(value || "")
    .split(/[,\r\n]+/)
    .map((url) => url.trim())
    .filter((url) => /^https?:\/\//i.test(url));
}

export function parseProductSpecs(description) {
  const lines = String(description || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return [{ icon: "monitor", label: "Info", value: "Detail produk belum tersedia" }];
  }

  return lines.map((line) => {
    const separator = line.indexOf(":");
    if (separator > 0) {
      const label = line.slice(0, separator).trim();
      const key = label.toLowerCase();
      return {
        icon: SPEC_ICONS[key] || "monitor",
        label,
        value: line.slice(separator + 1).trim(),
      };
    }
    return { icon: "monitor", label: "Info", value: line };
  });
}

export function toProductCard(row) {
  const specs = parseProductSpecs(row.description);
  const category = row.category || "elektronik-lainnya";
  const stock = Number(row.stock || 0);

  return {
    id: row.id,
    name: row.name || "Produk Fikri Store",
    tagline: specs[0]?.value || specs[0]?.label || "Pilihan produk Fikri Store",
    price: formatProductPrice(row.price),
    priceNote: stock > 0 ? stock + " unit tersedia" : "Tanya ketersediaan",
    badge: stock > 0 ? "Ready" : "Cek stok",
    stock,
    categories: [category],
    images: parseProductImages(row.image_url),
    specs,
  };
}

export function filterProducts(
  products,
  { category = "all", availableOnly = false, search = "" } = {},
) {
  const query = String(search).trim().toLocaleLowerCase("id-ID");

  return products.filter((product) => {
    const matchesCategory =
      category === "all" || product.categories.includes(category);
    const matchesAvailability = !availableOnly || Number(product.stock) > 0;
    const searchable = [
      product.name,
      product.tagline,
      ...(product.specs || []).map((spec) => spec.label + " " + spec.value),
    ]
      .join(" ")
      .toLocaleLowerCase("id-ID");

    return (
      matchesCategory &&
      matchesAvailability &&
      (!query || searchable.includes(query))
    );
  });
}
