
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
  if (/[a-zA-Z]/.test(text) || /Rp/i.test(text)) return text;

  const digits = text.replace(/\D/g, "");
  return digits ? `Rp ${Number(digits).toLocaleString("id-ID")}` : text;
}

function categoryLabel(value) {
  return (
    CATEGORIES.find((category) => category.value === value)?.label ||
    value ||
    "Tanpa kategori"
  );
}

function StatCard({ icon, label, value, description, tone = "blue" }) {
  return (
    <article className="ap-stat-card">
      <div className={`ap-stat-icon ${tone}`}>{icon}</div>
      <div className="ap-stat-content">
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{description}</span>
      </div>
    </article>
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

  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("info");
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    if (!supabaseConfigured || !supabase) {
      setAuthReady(true);
      return undefined;
    }

    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!mounted) return;

        if (error) {
          setNotice(error.message);
          setNoticeType("error");
        }

        setSession(data?.session || null);
        setAuthReady(true);
      })
      .catch((error) => {
        if (!mounted) return;
        setNotice(error.message || "Gagal memeriksa sesi login.");
        setNoticeType("error");
        setAuthReady(true);
      });

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
    if (session) {
      loadProducts();
    } else {
      setProducts([]);
    }
  }, [session]);

  function showNotice(message, type = "info") {
    setNotice(message);
    setNoticeType(type);
  }

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
        "Gagal memuat produk: " +
          (error.message || "Kesalahan tidak diketahui."),
        "error"
      );
    } finally {
      setProductsLoading(false);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    showNotice("");

    try {
      if (!supabase) throw new Error("Supabase belum dikonfigurasi.");

      if (forgot) {
        if (!email.trim()) {
          throw new Error("Masukkan email admin terlebih dahulu.");
        }

        const { error } = await supabase.auth.resetPasswordForEmail(
          email.trim(),
          { redirectTo: RESET_URL }
        );

        if (error) throw error;

        showNotice(
          "Tautan reset password telah dikirim. Periksa Inbox dan Spam.",
          "success"
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;
      }
    } catch (error) {
      showNotice(error.message || "Permintaan gagal.", "error");
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
    showNotice("Mode edit aktif. Perbarui informasi produk lalu simpan.");

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
      showNotice("Isi harga, atau tulis Hubungi kami / Gratis.", "error");
      return;
    }

    if (!supabase) {
      showNotice("Supabase belum dikonfigurasi.", "error");
      return;
    }

    setLoading(true);
    showNotice("");

    try {
      let imageUrl = form.image_url.trim();

      if (imageFile) {
        const extension = (imageFile.name.split(".").pop() || "jpg")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");

        const path = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, imageFile, {
            upsert: false,
            contentType: imageFile.type || "image/jpeg",
          });

        if (uploadError) throw uploadError;

        imageUrl = supabase.storage.from(BUCKET).getPublicUrl(path)
          .data.publicUrl;
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
        "Gagal menyimpan produk: " +
          (error.message || "Kesalahan tidak diketahui."),
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

    if (!confirmed || !supabase) return;

    setLoading(true);
    showNotice("");

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

      showNotice(`Produk "${product.name}" berhasil dihapus.`, "success");

      await loadProducts();
    } catch (error) {
      showNotice(
        "Gagal menghapus produk: " + (error.message || "Terjadi kesalahan."),
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return products;

    return products.filter((product) =>
      [
        product.name,
        product.price,
        product.category,
        product.description,
        product.stock,
      ].some((value) => String(value ?? "").toLowerCase().includes(query))
    );
  }, [products, search]);

  const categoryCount = new Set(
    products.map((product) => product.category).filter(Boolean)
  ).size;

  const totalStock = products.reduce(
    (sum, product) => sum + (Number(product.stock) || 0),
    0
  );

  const lowStockCount = products.filter(
    (product) => Number(product.stock) <= 5
  ).length;

  const navItems = [
    { name: "Dashboard", icon: "▦" },
    { name: "Produk", icon: "◇" },
  ];

  if (!supabaseConfigured || !supabase) {
    return (
      <main className="ap-auth-page">
        <section className="ap-auth-card">
          <div className="ap-brand">
            FIKRI <span>STORE.</span>
          </div>
          <span className="ap-eyebrow">SYSTEM CONFIGURATION</span>
          <h1>Konfigurasi Supabase</h1>
          <p>
            Periksa VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY pada
            environment variables hosting.
          </p>
        </section>
      </main>
    );
  }

  if (!authReady) {
    return (
      <main className="ap-loading-page">
        <div className="ap-loader" />
        <p>Menyiapkan dashboard Fikri Store...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="ap-auth-page">
        <section className="ap-auth-card">
          <div className="ap-brand">
            FIKRI <span>STORE.</span>
          </div>

          <span className="ap-eyebrow">ADMINISTRATION PORTAL</span>

          <h1>{forgot ? "Reset password" : "Selamat datang!"}</h1>

          <p>
            {forgot
              ? "Masukkan email admin untuk menerima tautan reset password."
              : "Masuk untuk mengelola katalog produk Fikri Store."}
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
                <label className="ap-label" htmlFor="ap-password">
                  Password
                </label>
                <input
                  id="ap-password"
                  className="ap-input"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Masukkan password"
                />
              </>
            )}

            <button
              className="ap-button ap-button-primary ap-full-button"
              disabled={loading}
            >
              {loading
                ? "Memproses..."
                : forgot
                  ? "Kirim tautan reset →"
                  : "Masuk ke dashboard →"}
            </button>
          </form>

          <button
            type="button"
            className="ap-button ap-button-secondary ap-full-button"
            onClick={() => {
              setForgot(!forgot);
              showNotice("");
            }}
          >
            {forgot ? "← Kembali ke login" : "Lupa password?"}
          </button>

          {notice && (
            <div
              className={`ap-notice ${noticeType}`}
              role="status"
              aria-live="polite"
            >
              {notice}
            </div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="ap-app">
      <aside className="ap-sidebar">
        <Link to="/" className="ap-brand ap-sidebar-brand">
          FIKRI <span>STORE.</span>
        </Link>

        <div className="ap-sidebar-caption">WORKSPACE</div>

        <nav className="ap-nav" aria-label="Navigasi admin">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.name}
              className={`ap-nav-item ${
                activeNav === item.name ? "active" : ""
              }`}
              onClick={() => {
                setActiveNav(item.name);

                if (item.name === "Dashboard") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  document
                    .getElementById("ap-product-form")
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                }
              }}
            >
              <span className="ap-nav-icon">{item.icon}</span>
              {item.name}
              {item.name === "Produk" && (
                <span className="ap-nav-count">{products.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="ap-sidebar-bottom">
          <div className="ap-sidebar-note">
            <span className="ap-status-dot" />
            <div>
              <strong>Sistem terhubung</strong>
              <small>Database produk aktif</small>
            </div>
          </div>

          <div className="ap-profile">
            <div className="ap-avatar">F</div>
            <div className="ap-profile-info">
              <strong>Fikri Store</strong>
              <span>{session.user.email}</span>
            </div>
          </div>

          <button
            type="button"
            className="ap-logout"
            onClick={() => supabase.auth.signOut()}
          >
            <span>↗</span> Keluar dari akun
          </button>
        </div>
      </aside>

      <section className="ap-main">
        <header className="ap-topbar">
          <div className="ap-breadcrumb">
            <span>Workspace</span>
            <span className="ap-breadcrumb-separator">/</span>
            <strong>{activeNav}</strong>
          </div>

          <div className="ap-topbar-actions">
            <span className="ap-live-indicator">
              <span className="ap-status-dot" />
              Live workspace
            </span>
            <Link to="/" className="ap-website-link">
              Lihat website <span>↗</span>
            </Link>
          </div>
        </header>

        <div className="ap-content">
          <section className="ap-welcome">
            <div className="ap-welcome-copy">
              <span className="ap-eyebrow">YOUR STORE OVERVIEW</span>
              <h1>Selamat datang, Fikri</h1>
              <p>
                Kelola katalog produk dan pantau inventaris Fikri Store
                dalam satu tempat.
              </p>
            </div>

            <div className="ap-welcome-mark" aria-hidden="true">
              <div className="ap-mark-orbit" />
              <div className="ap-mark-core">F.</div>
              <span className="ap-mark-spark">✦</span>
            </div>
          </section>

          {notice && (
            <div
              className={`ap-notice ${noticeType}`}
              role="status"
              aria-live="polite"
            >
              <span>{noticeType === "error" ? "!" : "✓"}</span>
              <p>{notice}</p>
              <button
                type="button"
                aria-label="Tutup pemberitahuan"
                onClick={() => setNotice("")}
              >
                ×
              </button>
            </div>
          )}

          <section className="ap-section-heading">
            <div>
              <span className="ap-eyebrow">AT A GLANCE</span>
              <h2>Ringkasan toko</h2>
            </div>
            <span className="ap-data-label">
              <span className="ap-status-dot" />
              Data produk aktual
            </span>
          </section>

          <section className="ap-stats-grid">
            <StatCard
              icon="◇"
              label="Total produk"
              value={products.length}
              description="Produk dalam katalog"
              tone="blue"
            />
            <StatCard
              icon="▤"
              label="Kategori"
              value={categoryCount}
              description="Kategori yang digunakan"
              tone="purple"
            />
            <StatCard
              icon="▥"
              label="Total stok"
              value={totalStock.toLocaleString("id-ID")}
              description="Unit seluruh produk"
              tone="mint"
            />
            <StatCard
              icon="!"
              label="Stok menipis"
              value={lowStockCount}
              description="Produk dengan stok ≤ 5"
              tone="amber"
            />
          </section>

          <section className="ap-management-heading" id="ap-products">
            <div>
              <span className="ap-eyebrow">CATALOG MANAGEMENT</span>
              <h2>Manajemen produk</h2>
              <p>
                Tambahkan produk baru atau perbarui katalog yang sudah ada.
              </p>
            </div>
            <button
              type="button"
              className="ap-button ap-button-primary"
              onClick={() => {
                resetForm();
                setActiveNav("Produk");
                document
                  .getElementById("ap-product-form")
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
              }}
            >
              <span>＋</span> Tambah produk
            </button>
          </section>

          <section className="ap-workspace">
            <article className="ap-panel ap-form-panel" id="ap-product-form">
              <div className="ap-panel-heading">
                <div className="ap-panel-icon">✳</div>
                <div>
                  <h3>{editingId ? "Edit produk" : "Tambah produk baru"}</h3>
                  <p>
                    {editingId
                      ? "Perbarui informasi produk pilihanmu."
                      : "Lengkapi informasi produk di bawah ini."}
                  </p>
                </div>
              </div>

              <form onSubmit={saveProduct}>
                <label className="ap-label" htmlFor="ap-product-name">
                  Nama produk <span>*</span>
                </label>
                <input
                  id="ap-product-name"
                  className="ap-input"
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="Contoh: Laptop Pro 14"
                  required
                />

                <div className="ap-form-row">
                  <div>
                    <label className="ap-label" htmlFor="ap-product-price">
                      Harga <span>*</span>
                    </label>
                    
id="ap-product-price"
                      className="ap-input"
                      type="text"
                      inputMode="text"
                      value={form.price}
                      onChange={(event) =>
                        setForm({ ...form, price: event.target.value })
                      }
                      placeholder="Contoh: 3 jutaan atau 3500000"
                      required
                    />
                  </div>

                  <div>
                    <label className="ap-label" htmlFor="ap-product-stock">
                      Jumlah stok
                    </label>
                    <input
                      id="ap-product-stock"
                      className="ap-input"
                      type="number"
                      min="0"
                      step="1"
                      value={form.stock}
                      onChange={(event) =>
                        setForm({ ...form, stock: event.target.value })
                      }
                      placeholder="1"
                    />
                  </div>
                </div>

                <label className="ap-label" htmlFor="ap-product-category">
                  Kategori
                </label>
                <select
                  id="ap-product-category"
                  className="ap-input ap-select"
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                >
                  {CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>

                <label className="ap-label" htmlFor="ap-product-description">
                  Deskripsi produk
                </label>
                <textarea
                  id="ap-product-description"
                  className="ap-input ap-textarea"
                  rows="4"
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="Spesifikasi, kondisi, kelengkapan, dan informasi lainnya..."
                />

                <label className="ap-label" htmlFor="ap-product-image-url">
                  URL gambar produk
                </label>
                <input
                  id="ap-product-image-url"
                  className="ap-input"
                  type="url"
                  value={form.image_url}
                  onChange={(event) =>
                    setForm({ ...form, image_url: event.target.value })
                  }
                  placeholder="https://contoh.com/gambar-laptop.jpg"
                />

                <label className="ap-label" htmlFor="ap-image-file">
                  Atau unggah gambar dari galeri
                </label>
                <input
                  id="ap-image-file"
                  className="ap-input ap-file-input"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setImageFile(event.target.files?.[0] || null)
                  }
                />

                {imageFile && (
                  <div className="ap-file-selected">
                    <span>✓</span>
                    <span>{imageFile.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        const input = document.getElementById("ap-image-file");
                        if (input) input.value = "";
                      }}
                    >
                      Hapus pilihan
                    </button>
                  </div>
                )}

                {form.image_url && !imageFile && (
                  <div className="ap-image-preview">
                    <img
                      src={form.image_url}
                      alt="Pratinjau produk"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                    <span>Pratinjau gambar produk</span>
                  </div>
                )}

                <div className="ap-form-actions">
                  <button
                    type="submit"
                    className="ap-button ap-button-primary ap-full-button"
                    disabled={loading}
                  >
                    {loading
                      ? "Menyimpan..."
                      : editingId
                        ? "Simpan perubahan"
                        : "Simpan produk"}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      className="ap-button ap-button-secondary ap-full-button"
                      onClick={resetForm}
<label className="ap-label" htmlFor="ap-product-price">
  Harga <span>*</span>
</label>
<input
  id="ap-product-price"
  className="ap-input"
  type="text"
  inputMode="text"
  value={form.price}
  onChange={(event) =>
    setForm({ ...form, price: event.target.value })
  }
  placeholder="Contoh: 3 jutaan atau 3500000"
  required
/>
                  
