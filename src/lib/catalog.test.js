import test from "node:test";
import assert from "node:assert/strict";
import { filterProducts, formatProductPrice, parseProductImages, parseProductSpecs, toProductCard } from "./catalog.js";

test("formats prices without corrupting descriptive prices", () => {
  assert.equal(formatProductPrice(1500000), "Rp 1.500.000");
  assert.equal(formatProductPrice("Tanya harga"), "Tanya harga");
  assert.equal(formatProductPrice(null), "Tanya harga");
});

test("accepts only HTTP(S) product image URLs", () => {
  assert.deepEqual(parseProductImages("https://a.test/1.jpg, javascript:alert(1)\nhttp://b.test/2.jpg"), [
    "https://a.test/1.jpg", "http://b.test/2.jpg"
  ]);
});

test("parses specification lines and preserves plain descriptions", () => {
  assert.deepEqual(parseProductSpecs("Prosesor: Intel i5\nRAM: 8GB\nKondisi bagus"), [
    { icon: "cpu", label: "Prosesor", value: "Intel i5" },
    { icon: "memory", label: "RAM", value: "8GB" },
    { icon: "monitor", label: "Info", value: "Kondisi bagus" }
  ]);
});

test("maps database products using existing products table fields", () => {
  const product = toProductCard({ id: 7, name: "Laptop", price: 2500000, stock: 2, category: "laptop", image_url: "https://a.test/x.jpg", description: "RAM: 8GB" });
  assert.equal(product.id, 7);
  assert.equal(product.stock, 2);
  assert.equal(product.badge, "Ready");
  assert.deepEqual(product.categories, ["laptop"]);
});

test("filters by category, availability, and case-insensitive search", () => {
  const products = [
    { name: "ThinkPad", tagline: "Office", stock: 2, categories: ["laptop"], specs: [{ label: "RAM", value: "16GB" }] },
    { name: "Tablet", tagline: "Media", stock: 0, categories: ["tablet"], specs: [] }
  ];
  assert.deepEqual(filterProducts(products, { category: "laptop", availableOnly: true, search: "16gb" }), [products[0]]);
  assert.deepEqual(filterProducts(products, { availableOnly: true }), [products[0]]);
  assert.deepEqual(filterProducts(products, { search: "tidak ada" }), []);
});
