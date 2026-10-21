
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase, supabaseConfigured } from "../lib/supabase.js";

const RESET_URL = "https://fikri-store.pages.dev/reset-password";
const STORAGE_BUCKET = "product-images";

const emptyForm = {
  name: "",
  price: "",
  category: "kuliah-kerja",
  description: "",
  image_url: "",
  stock: "1",
};

const css = `
.admin-root {
  min-height: 100vh; background: #f4f6fb; color: #182238;
  font-family: Inter, system-ui, -apple-system, sans-serif;
}
.admin-top {
  background: #111d35; color: white; padding: 18px 5%;
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; flex-wrap: wrap;
}
.admin-brand { font-size: 20px; font-weight: 850; letter-spacing: -.5px; }
.admin-brand span { color: #70a5ff; }
.admin-sub { font-size: 12px; color: #aab9d3; margin-top: 4px; }
.admin-wrap { max-width: 1250px; margin: auto; padding: 30px 20px 55px; }
.admin-heading { display:flex; justify-content:space-between; gap:16px; align-items:center; flex-wrap:wrap; margin-bottom:24px; }
.admin-heading h1 { font-size: clamp(25px,4vw,34px); letter-spacing:-1px; margin:0 0 8px; }
.admin-muted { color:#71809a; font-size:14px; line-height:1.6; }
.admin-stats { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:16px; margin-bottom:24px; }
.admin-stat { background:white; border:1px solid #e5eaf3; border-radius:17px; padding:20px; box-shadow:0 5px 20px #172b4d08; }
.admin-stat-label { color:#75839b; font-size:13px; margin-bottom:12px; }
.admin-stat-value { font-size:28px; font-weight:850; letter-spacing:-1px; overflow-wrap:anywhere; }
.admin-layout { display:grid; grid-template-columns:minmax(0, .9fr) minmax(0, 1.1fr); gap:22px; align-items:start; }
.admin-panel { background:white; border:1px solid #e5eaf3; border-radius:19px; padding:24px; box-shadow:0 6px 24px #172b4d08; min-width:0; }
.admin-panel h2 { font-size:20px; margin:0 0 6px; letter-spacing:-.4px; }
.admin-label { display:block; font-size:13px; font-weight:750; margin:17px 0 7px; color:#34425a; }
.admin-input { box-sizing:border-box; display:block; width:100%; padding:12px 13px; border:1px solid #dce3ef; border-radius:10px; font:inherit; font-size:14px; color:#182238; background:#fbfcff; outline:none; }
.admin-input:focus { border-color:#477ff0; box-shadow:0 0 0 3px #477ff01a; }
.admin-textarea { min-height:115px; resize:vertical; }
.admin-btn { border:0; border-radius:10px; padding:11px 15px; font:inherit; font-size:13px; font-weight:750; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:7px; }
.admin-btn:disabled { opacity:.55; cursor:wait; }
.admin-primary { background:#316bea; color:white; }
.admin-primary:hover { background:#2157ce; }
.admin-light { background:#edf2fb; color:#34435e; }
.admin-danger { background:#fff0ef; color:#c03333; }
.admin-full { width:100%; margin-top:20px; }
.admin-message { border-radius:11px; padding:13px 15px; margin:18px 0; background:#edf4ff; color:#244c91; font-size:13px; line-height:1.55; overflow-wrap:anywhere; }
.admin-search { margin:18px 0; }
.admin-list { display:grid; gap:13px; }
.admin-product { border:1px solid #e6ebf3; border-radius:14px; padding:14px; display:flex; align-items:flex-start; gap:13px; min-width:0; }
.admin-thumb { width:76px; height:76px; flex:0 0 76px; object-fit:cover; border-radius:11px; background:#edf1f7; }
.admin-placeholder { display:flex; align-items:center; justify-content:center; font-size:25px; color:#8d9ab0; }
.admin-product-info { min-width:0; flex:1; }
.admin-product-name { font-size:14px; font-weight:800; overflow-wrap:anywhere; margin:2px 0 7px; }
.admin-product-price { color:#2462d5; font-weight:800; font-size:14px; overflow-wrap:anywhere; }
.admin-tag { display:inline-block; margin-top:8px; border-radius:7px; padding:5px 8px; background:#f0f4fb; color:#5c6a82; font-size:11px; }
.admin-actions { display:flex; gap:7px; flex-wrap:wrap; margin-top:12px; }
.admin-empty { text-align:center; padding:35px 12px; color:#7b879b; font-size:14px; line-height:1.7; }
.admin-login { max-width:460px; margin:8vh auto; }
.admin-login .admin-panel { padding:clamp(22px,5vw,34px); }
@media(max-width:850px) { .admin-layout { grid-template-columns:1fr; } }
@media(max-width:550px) {
  .admin-top { padding:16px 18px; }
  .admin-wrap { padding:22px 13px 40px; }
  .admin-stats { grid-template-columns:1fr 1fr; gap:10px; }
  .admin-stat { padding:15px; }
  .admin-stat-value { font-size:23px; }
  .admin-panel { padding:17px; border-radius:15px; }
  .admin-product { gap:10px; padding:11px; }
  .admin-thumb { width:60px; height:60px; flex-basis:60px; }
}
`;

function moneyDisplay(value) {
  const text = String(value ?? "").trim();
  if (!text) return "Tanya harga";

  // Harga berupa teks tetap ditampilkan apa adanya.
  if (/[a-zA-Z]/.test(text) || /Rp/i.test(text)) return text;

  const digits = text.replace(/\D/g, "");
  return digits ? `Rp ${Number(digits).toLocaleString("id-ID")}` : text;
}

function categoryName(value) {
  const names = {
    "kuliah-kerja": "Kuliah & Kerja",
    performa: "Performa",
    "desain-kreatif": "Desain & Kreatif",
  };
  return names[value] || value || "Tanpa kategori";
}

export default function Admin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!supabaseConfigured || !supabase) return;

    let active = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) setMessage(error.message);
      setSession(data?.session || null);
    });

    const { data } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (active) setSession(nextSession);
      }
    );

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) loadProducts();
  }, [session]);

  async function loadProducts() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Gagal memuat produk: " + error.message);
    } else {
      setProducts(data || []);
    }
  }

  async function login(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
    } catch (error) {
      setMessage(error.message || "Login gagal.");
    } finally {
      setLoading(false);
    }
  }

  async function sendResetEmail(event) {
    event.preventDefault();

    if (!email.trim()) {
      setMessage("Masukkan email admin terlebih dahulu.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo: RESET_URL }
      );
      if (error) throw error;
      setMessage("Permintaan reset diproses. Periksa Inbox dan Spam.");
    } catch (error) {
      setMessage(error.message || "Gagal mengirim email reset.");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(product) {
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
    setMessage("Mode edit aktif. Ubah data lalu simpan.");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setImageFile(null);
    setForm({ ...emptyForm });
  }

  async function saveProduct(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setMessage("Nama produk wajib diisi.");
      return;
    }

    if (!form.price.trim()) {
      setMessage("Isi harga produk, atau tulis Hubungi kami / Gratis.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      let imageUrl = form.image_url.trim();

      if (imageFile) {
        const extension = (
          imageFile.name.split(".").pop() || "jpg"
        ).toLowerCase().replace(/[^a-z0-9]/g, "");

        const path =
          `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(path, imageFile, {
            upsert: false,
            contentType: imageFile.type || "image/jpeg",
          });

        if (uploadError) {
          throw new Error(
            "Upload gagal. Pastikan bucket product-images tersedia " +
            "dan izin upload sudah diatur. " + uploadError.message
          );
        }

        const { data } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(path);

        imageUrl = data.publicUrl;
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
        ? await supabase.from("products").update(payload).eq("id", editingId)
        : await supabase.from("products").insert(payload);

      if (result.error) throw result.error;

      setMessage(
        editingId ? "Produk berhasil diperbarui." : "Produk berhasil ditambahkan."
      );
      resetForm();
      await loadProducts();
    } catch (error) {
      setMessage(error.message || "Gagal menyimpan produk.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(product) {
    const confirmed = window.confirm(
      `Yakin ingin menghapus "${product.name}"? Tindakan ini tidak bisa dibatalkan.`
    );

    if (!confirmed) return;

    setLoading(true);
    setMessage("");

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
      setMessage(`Produk "${product.name}" berhasil dihapus.`);
      await loadProducts();
    } catch (error) {
      setMessage("Gagal menghapus produk: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase().trim();
    return (
      String(product.name || "").toLowerCase().includes(query) ||
      String(product.category || "").toLowerCase().includes(query) ||
      String(product.price || "").toLowerCase().includes(query)
    );
  });

  if (!supabaseConfigured || !supabase) {
    return (
      <main className="admin-root">
        <style>{css}</style>
        <div className="admin-wrap">
          <section className="admin-panel">
            <h1>Fikri Store Admin</h1>
            <p className="admin-muted">
              Konfigurasi Supabase belum benar. Periksa VITE_SUPABASE_URL
              dan VITE_SUPABASE_ANON_KEY pada environment variables hosting.
            </p>
          </section>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="admin-root">
        <style>{css}</style>
        <div className="admin-login admin-wrap">
          <section className="admin-panel">
            <div className="admin-brand" style={{ color: "#182238" }}>
              FIKRI <span>STORE.</span>
            </div>
            <p className="admin-muted">ADMINISTRATION PORTAL</p>
            <h1 style={{ fontSize: 29, margin: "28px 0 8px" }}>
              {forgotMode ? "Reset password" : "Selamat datang"}
            </h1>
            <p className="admin-muted">
              {forgotMode
                ? "Masukkan email admin untuk menerima tautan reset."
                : "Masuk untuk mengelola katalog produk Fikri Store."}
            </p>

            <form onSubmit={forgotMode ? sendResetEmail : login}>
              <label className="admin-label" htmlFor="admin-email">
                Email admin
              </label>
              <input
                id="admin-email"
                className="admin-input"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />

              {!forgotMode && (
                <>
                  <label className="admin-label" htmlFor="admin-password">
                    Password
                  </label>
                  <input
                    id="admin-password"
                    className="admin-input"
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </>
              )}

              <button
                className="admin-btn admin-primary admin-full"
                disabled={loading}
              >
                {loading
                  ? "Memproses..."
                  : forgotMode
                    ? "Kirim tautan reset"
                    : "Masuk ke dashboard →"}
              </button>
            </form>

            <button
              type="button"
              className="admin-btn admin-light admin-full"
              onClick={() => {
                setForgotMode(!forgotMode);
                setMessage("");
              }}
            >
              {forgotMode ? "← Kembali ke login" : "Lupa password?"}
            </button>

            {message && <div className="admin-message">{message}</div>}
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-root">
      <style>{css}</style>

      <header className="admin-top">
        <div>
          <div className="admin-brand">FIKRI <span>STORE.</span></div>
          <div className="admin-sub">PANEL MANAJEMEN TOKO</div>
        </div>
        <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
          <Link
            to="/"
            className="admin-btn admin-light"
            style={{ textDecoration: "none" }}
          >
            ← Lihat website
          </Link>
          <button
            className="admin-btn admin-light"
            onClick={() => supabase.auth.signOut()}
          >
            Keluar
          </button>
        </div>
      </header>

      <div className="admin-wrap">
        <div className="admin-heading">
          <div>
            <h1>Dashboard Produk</h1>
            <div className="admin-muted">
              Kelola katalog dan informasi produk dari satu tempat.
            </div>
          </div>
          <button
            className="admin-btn admin-primary"
            onClick={() => {
              resetForm();
              setMessage("");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            + Produk baru
          </button>
        </div>

        <div className="admin-muted" style={{ marginBottom: 18 }}>
          Login sebagai {session.user.email}
        </div>

        <div className="admin-stats">
          <div className="admin-stat">
            <div className="admin-stat-label">Total produk</div>
            <div className="admin-stat-value">{products.length}</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-label">Hasil pencarian</div>
            <div className="admin-stat-value">{filteredProducts.length}</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-label">Status sistem</div>
            <div className="admin-stat-value" style={{ fontSize: 20, color: "#16845b" }}>
              ● Terhubung
            </div>
          </div>
        </div>

        <div className="admin-layout">
          <section className="admin-panel">
            <h2>{editingId ? "Edit produk" : "Tambah produk"}</h2>
            <p className="admin-muted">
              {editingId
                ? "Perbarui informasi produk yang dipilih."
                : "Masukkan detail produk yang akan ditampilkan di toko."}
            </p>

            <form onSubmit={saveProduct}>
              <label className="admin-label" htmlFor="product-name">
                Nama produk *
              </label>
              <input
                id="product-name"
                className="admin-input"
                placeholder="Contoh: Laptop untuk kuliah"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <label className="admin-label" htmlFor="product-price">
                Harga *
              </label>
              <input
                id="product-price"
                className="admin-input"
                type="text"
                inputMode="text"
                placeholder="Rp 450.000 / Hubungi kami / Gratis"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
              <p className="admin-muted" style={{ fontSize: 12, margin: "6px 0 0" }}>
                Bisa angka atau teks bebas, misalnya “Mulai Rp 200 ribuan”.
              </p>

              <label className="admin-label" htmlFor="product-category">
                Kategori
              </label>
              <select
                id="product-category"
                className="admin-input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              >
                <option value="kuliah-kerja">Kuliah & Kerja</option>
                <option value="performa">Performa</option>
                <option value="desain-kreatif">Desain & Kreatif</option>
              </select>

              <label className="admin-label" htmlFor="product-image">
                Upload foto dari HP
              </label>
              <input
                id="product-image"
                className="admin-input"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              {imageFile && (
                <p className="admin-muted" style={{ fontSize: 12 }}>
                  File dipilih: {imageFile.name}
                </p>
              )}

              <label className="admin-label" htmlFor="product-image-url">
                Atau URL gambar
              </label>
              <input
                id="product-image-url"
                className="admin-input"
                type="url"
                placeholder="https://alamat-gambar.jpg"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              />

              <label className="admin-label" htmlFor="pr
