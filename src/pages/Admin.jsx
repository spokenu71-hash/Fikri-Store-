
import "./AdminPremium.css";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase, supabaseConfigured } from "../lib/supabase.js";

const RESET_URL = "https://fikri-store.pages.dev/reset-password";
const BUCKET = "product-images";

const EMPTY_FORM = {
  name: "",
  price: "",
  category: "kuliah-kerja",
  description: "",
  image_url: "",
  stock: "1",
};

const CATEGORIES = [
  { value: "kuliah-kerja", label: "Kuliah & Kerja" },
  { value: "performa", label: "Performa" },
  { value: "desain-kreatif", label: "Desain & Kreatif" },
];

function formatPrice(value) {
  const text = String(value ?? "").trim();
  if (!text) return "Tanya harga";

  if (/[a-zA-Z]/.test(text) || /Rp/i.test(text)) {
    return text;
  }

  const digits = text.replace(/\D/g, "");
  return digits
    ? `Rp ${Number(digits).toLocaleString("id-ID")}`
    : text;
}

function categoryLabel(value) {
  return (
    CATEGORIES.find((item) => item.value === value)?.label ||
    value ||
    "Tanpa kategori"
  );
}

function Notice({ notice, onClose }) {
  if (!notice.message) return null;

  return (
    <div
      className={`ap-notice ${notice.type || "info"}`}
      role="status"
    >
      <span>{notice.message}</span>
      <button
        type="button"
        className="ap-notice-close"
        aria-label="Tutup pemberitahuan"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}

export default function Admin() {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgot, setForgot] = useState(false);

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [search, setSearch] = useState("");
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [notice, setNotice] = useState({
    message: "",
    type: "info",
  });
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function showNotice(message, type = "info") {
    setNotice({ message, type });
  }

  useEffect(() => {
    if (!supabaseConfigured || !supabase) {
      setAuthReady(true);
      return undefined;
    }

    let mounted = true;

    async function checkSession() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error) {
          showNotice(error.message, "error");
        }

        setSession(data?.session || null);
      } catch (error) {
        if (mounted) {
          showNotice(
            error.message || "Gagal memeriksa sesi admin.",
            "error"
          );
        }
      } finally {
        if (mounted) setAuthReady(true);
      }
    }

    checkSession();

    const { data } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (mounted) setSession(nextSession);
      }
    );

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) {
      setProducts([]);
      return;
    }

    loadProducts();
  }, [session]);

  async function loadProducts() {
    if (!supabase) return;

    setProductsLoading(true);

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      showNotice(
        `Gagal memuat produk: ${error.message}`,
        "error"
      );
    } finally {
      setProductsLoading(false);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setNotice({ message: "", type: "info" });

    try {
      if (forgot) {
        if (!email.trim()) {
          throw new Error("Masukkan email admin.");
        }

        const { error } =
          await supabase.auth.resetPasswordForEmail(
            email.trim(),
            { redirectTo: RESET_URL }
          );

        if (error) throw error;

        showNotice(
          "Tautan reset dikirim. Periksa Inbox dan Spam.",
          "success"
        );
      } else {
        const { error } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (error) throw error;
      }
    } catch (error) {
      showNotice(
        error.message || "Permintaan gagal.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setImageFile(null);

    const fileInput = document.getElementById("ap-image-file");
    if (fileInput) fileInput.value = "";
  }

  function editProduct(product) {
    setEditingId(product.id);
    setImageFile(null);

    setForm({
      name: product.name || "",
      price: String(product.price ?? ""),
      category: product.category || "kuliah-kerja",
      description: product.description || "",
      image_url: product.image_url || "",
      stock: String(product.stock ?? 1),
    });

    setActiveNav("Produk");
    showNotice(
      "Mode edit aktif. Perbarui data lalu simpan.",
      "info"
    );

    document
      .getElementById("ap-product-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function saveProduct(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      showNotice("Nama produk wajib diisi.", "error");
      return;
    }

    if (!form.price.trim()) {
      showNotice(
        "Isi harga, atau tulis Hubungi kami / Gratis.",
        "error"
      );
      return;
    }

    if (!supabase) {
      showNotice("Supabase belum dikonfigurasi.", "error");
      return;
    }

    setLoading(true);
    setNotice({ message: "", type: "info" });

    try {
      let imageUrl = form.image_url.trim();

      if (imageFile) {
        const extension = (
          imageFile.name.split(".").pop() || "jpg"
        )
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");

        const path =
          `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, imageFile, {
            upsert: false,
            contentType: imageFile.type || "image/jpeg",
          });

        if (uploadError) throw uploadError;

        imageUrl = supabase.storage
          .from(BUCKET)
          .getPublicUrl(path).data.publicUrl;
      }

      const payload = {
        name: form.name.trim(),
        price: form.price.trim(),
        category: form.category,
        description: form.description.trim(),
        image_url: imageUrl,
        stock: Math.max(0, Number(form.stock || 0)),
      };

      const result = editingId
        ? await supabase
            .from("products")
            .update(payload)
            .eq("id", editingId)
        : await supabase.from("products").insert(payload);

      if (result.error) throw result.error;

      showNotice(
        editingId
          ? "Produk berhasil diperbarui."
          : "Produk berhasil ditambahkan.",
        "success"
      );

      resetForm();
      await loadProducts();
    } catch (error) {
      showNotice(
        `Gagal menyimpan produk: ${
          error.message || "Kesalahan tidak diketahui."
        }`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  async function removeProduct(product) {
    const confirmed = window.confirm(
      `Hapus produk "${product.name}"? Tindakan ini tidak bisa dibatalkan.`
    );

    if (!confirmed) return;

    setLoading(true);
    setNotice({ message: "", type: "info" });

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id);

      if (error) throw error;

      if (editingId === product.id) resetForm();

      setProducts((current) =>
        current.filter((item) => item.id !== product.id)
      );

      showNotice(
        `Produk "${product.name}" berhasil dihapus.`,
        "success"
      );

      await loadProducts();
    } catch (error) {
      showNotice(
        `Gagal menghapus produk: ${error.message}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return products;

    return products.filter((product) =>
      [
        product.name,
        product.price,
        product.category,
        product.description,
      ].some((value) =>
        String(value || "").toLowerCase().includes(query)
      )
    );
  }, [products, search]);

  const categoryCount = new Set(
    products.map((product) => product.category).filter(Boolean)
  ).size;

  const totalStock = products.reduce(
    (sum, product) => sum + (Number(product.stock) || 0),
    0
  );

  function navigateTo(name) {
    setActiveNav(name);
    setSidebarOpen(false);

    if (name === "Dashboard") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (name === "Produk") {
      document
        .getElementById("ap-product-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (name === "Pesanan" || name === "Pengaturan") {
      showNotice(
        `Bagian ${name} belum tersedia pada versi ini.`,
        "info"
      );
    }
  }

  if (!supabaseConfigured || !supabase) {
    return (
      <main className="ap-app ap-auth-page">
        <section className="ap-auth-card">
          <div className="ap-brand">
            FIKRI <span>STORE.</span>
          </div>
          <div className="ap-eyebrow">ADMINISTRATION PORTAL</div>
          <h1>Konfigurasi Supabase</h1>
          <p className="ap-subtitle">
            Periksa VITE_SUPABASE_URL dan
            VITE_SUPABASE_ANON_KEY pada environment
            variables hosting.
          </p>
        </section>
      </main>
    );
  }

  if (!authReady) {
    return (
      <main className="ap-app ap-auth-page">
        <div className="ap-loading">
          <span className="ap-spinner" />
          Memeriksa sesi admin...
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="ap-app ap-auth-page">
        <section className="ap-auth-card">
          <div className="ap-brand">
            FIKRI <span>STORE.</span>
          </div>

          <div className="ap-eyebrow">
            ADMINISTRATION PORTAL
          </div>

          <h1>
            {forgot ? "Reset password" : "Selamat datang!"}
          </h1>

          <p className="ap-subtitle">
            {forgot
              ? "Masukkan email admin untuk menerima tautan reset."
              : "Masuk untuk mengelola katalog Fikri Store."}
          </p>

          <form onSubmit={handleLogin}>
            <label className="ap-label" htmlFor="ap-email">
              Email admin
            </label>

            <input
              id="ap-email"
              className="ap-input"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nama@email.com"
            />

            {!forgot && (
              <>
                <label
                  className="ap-label"
                  htmlFor="ap-password"
                >
                  Password
                </label>

                <input
                  id="ap-password"
                  className="ap-input"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Masukkan password"
                />
              </>
            )}

            <button
              className="ap-button ap-button-primary ap-full"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Memproses..."
                : forgot
                  ? "Kirim tautan reset"
                  : "Masuk ke dashboard →"}
            </button>
          </form>

          <button
            type="button"
            className="ap-button ap-button-secondary ap-full ap-forgot"
            onClick={() => {
              setForgot(!forgot);
              setNotice({ message: "", type: "info" });
            }}
          >
            {forgot ? "← Kembali ke login" : "Lupa password?"}
          </button>

          <Notice
            notice={notice}
            onClose={() => setNotice({ message: "", type: "info" })}
          />
        </section>
      </main>
    );
  }

  const navItems = [
    { name: "Dashboard", icon: "▦" },
    { name: "Produk", icon: "◇" },
    { name: "Pesanan", icon: "▤" },
    { name: "Pengaturan", icon: "⚙" },
  ];

  return (
    <main className="ap-app">
      <aside
        className={`ap-sidebar ${sidebarOpen ? "ap-sidebar-open" : ""}`}
      >
        <Link to="/" className="ap-brand ap-brand-sidebar">
          FIKRI <span>STORE.</span>
        </Link>

        <div className="ap-sidebar-caption">
          WORKSPACE
        </div>

        <nav className="ap-nav" aria-label="Navigasi admin">
          {navItems.map((item) => (
            <button
              key={item.name}
              type="button"
              className={
                activeNav === item.name
                  ? "ap-nav-item active"
                  : "ap-nav-item"
              }
              onClick={() => navigateTo(item.name)}
            >
              <span className="ap-nav-icon">{item.icon}</span>
              <span>{item.name}</span>
              {item.name === "Produk" && (
                <span className="ap-nav-count">
                  {products.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="ap-sidebar-bottom">
          <div className="ap-account">
            <div className="ap-avatar">F</div>
            <div className="ap-account-info">
              <strong>Fikri Store</strong>
              <span>{session.user.email}</span>
            </div>
          </div>

          <button
            type="button"
            className="ap-logout"
            onClick={() => supabase.auth.signOut()}
          >
            <span>↪</span> Keluar dari akun
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="ap-overlay"
          aria-label="Tutup menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <section className="ap-main">
        <header className="ap-topbar">
          <button
            type="button"
            className="ap-menu-toggle"
            aria-label="Buka menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <div className="ap-search">
            <span>⌕</span>
            <input
              aria-label="Cari produk"
              placeholder="Cari produk, kategori, atau harga..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button
                type="button"
                aria-label="Hapus pencarian"
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}
          </div>

          <div className="ap-topbar-right">
            <span className="ap-status">
              <i /> Sistem aktif
            </span>
            <Link to="/" className="ap-website-link">
              Lihat website <span>↗</span>
            </Link>
          </div>
        </header>

        <div className="ap-content">
          <Notice
            notice={notice}
            onClose={() =>
              setNotice({ message: "", type: "info" })
            }
          />

          <section className="ap-welcome">
            <div>
              <div className="ap-eyebrow">
                OVERVIEW / FIKRI STORE
              </div>
              <h1>Selamat datang, Fikri</h1>
              <p>
                Kelola toko Anda dengan mudah dan pantau
                perkembangan katalog dalam satu tempat.
              </p>
            </div>

            <div className="ap-welcome-mark" aria-hidden="true">
              <div className="ap-mark-inner">F.</div>
            </div>
          </section>

          <section className="ap-stats" aria-label="Statistik produk">
            <article className="ap-stat-card">
              <div className="ap-stat-top">
                <span>Total Produk</span>
                <span className="ap-stat-icon blue">◇</span>
              </div>
              <div className="ap-stat-value">
                {productsLoading ? "—" : products.length}
              </div>
              <div className="ap-stat-foot">
                Produk dalam katalog
              </div>
            </article>

            <article className="ap-stat-card">
              <div className="ap-stat-top">
                <span>Kategori</span>
                <span className="ap-stat-icon violet">▦</span>
              </div>
              <div className="ap-stat-value">
                {productsLoading ? "—" : categoryCount}
              </div>
              <div className="ap-stat-foot">
                Kategori yang digunakan
              </div>
            </article>

            <article className="ap-stat-card">
              <div className="ap-stat-top">
                <span>Total Stok</span>
                <span className="ap-stat-icon green">↗</span>
              </div>
              <div className="ap-stat-value">
                {productsLoading
                  ? "—"
                  : totalStock.toLocaleString("id-ID")}
              </div>
              <div className="ap-stat-foot">
                Jumlah stok seluruh produk
              </div>
            </article>

            <article className="ap-stat-card">
              <div className="ap-stat-top">
                <span>Status Sistem</span>
                <span className="ap-stat-icon mint">✓</span>
              </div>
              <div className="ap-stat-value ap-online">
                Online
              </div>
              <div className="ap-stat-foot">
                Panel administrasi aktif
              </div>
            </article>
          </section>

          <section className="ap-workspace">
            <article
              className="ap-panel ap-form-panel"
              id="ap-product-form"
            >
              <div className="ap-panel-heading">
                <div>
                  <div className="ap-eyebrow">
                    PRODUCT MANAGEMENT
                  </div>
                  <h2>
                    {editingId ? "Edit produk" : "Tambah produk"}
                  </h2>
                </div>
                <span className="ap-heading-icon">＋</span>
              </div>

              <p className="ap-panel-description">
                Lengkapi informasi produk untuk katalog toko Anda.
              </p>

              <form onSubmit={saveProduct}>
                <label className="ap-label" htmlFor="ap-name">
                  Nama produk <span>*</span>
                </label>
                <input
                  id="ap-name"
     
