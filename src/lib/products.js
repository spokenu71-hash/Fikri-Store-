// Data produk Fikri Store. Harga gampang diedit di sini.
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Monitor,
  Battery,
  ShieldCheck,
  Gift,
} from "lucide-react";

export const WHATSAPP_NUMBER = "6289528541574";

export const CATEGORIES = [
  { id: "all", label: "Semua" },
  { id: "kuliah-kerja", label: "Kuliah & Kerja" },
  { id: "performa", label: "Performa" },
  { id: "desain-kreatif", label: "Desain & Kreatif" },
];

export const PRODUCTS = [
  {
    id: "dell-latitude-7470",
    name: "Dell Latitude 7470",
    tagline: "Workhorse andalan, tahan banting",
    price: "3 jutaan",
    priceNote: "Kisaran harga · budget friendly",
    badge: "Budget Friendly",
    categories: ["kuliah-kerja"],
    images: [
      "https://media.base44.com/images/public/user_6acdfc80dee82a656c1a68b1/355037872_IMG-20261013-WA0043.jpg",
      "https://media.base44.com/images/public/user_6acdfc80dee82a656c1a68b1/f50bd97ee_IMG_20261014_133524.jpg",
      "https://media.base44.com/images/public/user_6acdfc80dee82a656c1a68b1/8c2dd52a8_IMG_20261014_134517.jpg",
    ],
    specs: [
      { icon: Cpu, label: "Prosesor", value: "Intel Core i5 Gen 6" },
      { icon: MemoryStick, label: "RAM", value: "8GB" },
      { icon: HardDrive, label: "Storage", value: "SSD 256GB" },
      { icon: Monitor, label: "Layar", value: "FHD 1920×1080" },
    ],
  },
  {
    id: "lenovo-thinkpad-l13",
    name: "Lenovo ThinkPad L13",
    tagline: "Gen 11, ngebut buat multitasking",
    price: "5 jutaan",
    priceNote: "Kisaran harga · stok perlu dikonfirmasi",
    badge: "Garansi 1 Bulan",
    categories: ["kuliah-kerja", "performa"],
    images: [],
    specs: [
      { icon: Cpu, label: "Prosesor", value: "Intel i5-1135G7 Gen 11" },
      { icon: MemoryStick, label: "RAM", value: "8GB" },
      { icon: HardDrive, label: "Storage", value: "SSD 256GB" },
      { icon: Monitor, label: "Layar", value: "13,3 inci" },
    ],
  },
  {
    id: "asus-vivobook-x411unv",
    name: "ASUS Vivobook X411UNV",
    tagline: "Ada GPU dedicated, gas buat desain",
    price: "Tanya harga",
    priceNote: "Harga on request · bonus mouse wireless",
    badge: "MX150 4GB",
    categories: ["performa", "desain-kreatif"],
    images: [
      "https://media.base44.com/images/public/user_6acdfc80dee82a656c1a68b1/05e2a3bda_IMG-20261013-WA0055.jpg",
      "https://media.base44.com/images/public/user_6acdfc80dee82a656c1a68b1/86037c22f_IMG_20261014_134500.jpg",
    ],
    specs: [
      { icon: Cpu, label: "Prosesor", value: "Intel i5-8250U Gen 8" },
      { icon: Cpu, label: "GPU", value: "NVIDIA MX150 4GB" },
      { icon: MemoryStick, label: "RAM", value: "8GB" },
      { icon: HardDrive, label: "Storage", value: "SSD 512GB" },
      { icon: Monitor, label: "Layar", value: "FHD 14 inci" },
      { icon: Battery, label: "Baterai", value: "Health 86,6%" },
    ],
  },
];

export const USE_CASES = [
{
  index: "01",
  title: "Kuliah",
  desc: "Tugas, presentasi, multitasking.",
  image: "/images/kuliah-niqab-belakang.jpg",
},
  {
    index: "02",
    title: "Kerja",
    desc: "Office, meeting, produktivitas.",
    image:
      "https://media.base44.com/images/public/6acf25a8d877b5aac6c96735/b870123eb_generated_image.png",
  },
  {
    index: "03",
    title: "Desain & Kreatif",
    desc: "Aplikasi berat, editing, multimedia.",
    image:
      "https://media.base44.com/images/public/6acf25a8d877b5aac6c96735/3399fede3_generated_image.png",
  },
  {
  index: "04",
  title: "Gaming Ringan",
  desc: "Go, Valorant, Minecraft, dan lainnya.",
  image: "/images/gaming-pria.jpg",
},
];

export const VALUE_PROPS = [
  {
    icon: ShieldCheck,
    title: "Unit pilihan",
    desc: "Tiap unit dicek dan difoto pakai kondisi aslinya sebelum ditawarkan.",
  },
  {
    icon: Gift,
    title: "Harga masuk akal",
    desc: "Kisaran harga transparan, sesuai kondisi. Nggak ada biaya tersembunyi.",
  },
  {
    icon: ShieldCheck,
    title: "CS responsif",
    desc: "Chat langsung dijawab cepat. Konsultasi budget & kebutuhan gratis.",
  },
];

export const FAQS = [
  {
    q: "Apakah semua laptop benar-benar second?",
    a: "Iya, semua unit yang kami jual adalah laptop second. Tapi kondisinya kami pilih dan cek dulu — detail kondisi fisik dan battery health ditulis jelas di tiap produk.",
  },
  {
    q: "Kenapa harganya ditulis 'jutaan'?",
    a: "Kami pakai kisaran harga supaya fleksibel mengikuti kondisi tiap unit. Harga pasti dan kemungkinan nego bisa langsung ditanya via WhatsApp, kami kasih info real-time.",
  },
  {
    q: "Apakah ada garansi?",
    a: "Sebagian unit ada garansi (misal ThinkPad L13 garansi 1 bulan). Detail garansi tiap unit beda-beda dan ditulis di deskripsi produk. Konfirmasi via WhatsApp ya.",
  },
  {
    q: "Bisa minta foto atau video laptop?",
    a: "Bisa banget. Sebagian unit sudah ada foto asli di katalog. Untuk unit yang belum ada foto atau mau minta video kondisi, tinggal chat WhatsApp, kami kirimkan.",
  },
  {
    q: "Bagaimana cara order?",
    a: "Gampang. Pilih laptop yang kamu suka, klik tombol WhatsApp di kartu produk, nanti pesan otomatis sudah terisi. Tinggal kirim, kami bantu proses sampai deal.",
  },
];

export function buildWhatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function productWhatsAppLink(product) {
  const msg = `Halo Fikri Store, saya tertarik sama ${product.name} (${product.price}). Bisa info detail & ketersediaan stoknya?`;
  return buildWhatsAppLink(msg);
}
