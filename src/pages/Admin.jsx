
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

const CSS = `
*{box-sizing:border-box}
.admin-app{--navy:#14243e;--blue:#3478f6;--muted:#7c8ba2;min-height:100vh;background:#f4f7fc;color:#182944;font-family:Inter,system-ui,-apple-system,sans-serif}
.admin-sidebar{position:fixed;inset:0 auto 0 0;width:234px;background:linear-gradient(165deg,#172944,#101c32);color:#d6e0f1;padding:27px 17px;display:flex;flex-direction:column;z-index:20}
.admin-logo{font-size:21px;font-weight:900;letter-spacing:-.8px;padding:0 12px;color:white;white-space:nowrap}.admin-logo span{color:#4c91ff}
.admin-nav{display:grid;gap:8px;margin-top:39px}.admin-nav button{width:100%;display:flex;align-items:center;gap:13px;text-align:left;border:0;border-radius:11px;padding:13px 14px;color:#c5d1e4;background:transparent;font:inherit;font-size:13px;cursor:pointer}.admin-nav button.active{background:linear-gradient(100deg,#2b579a,#234477);color:white}.admin-nav .nav-icon{width:21px;text-align:center;font-size:18px}
.admin-sidebar-bottom{margin-top:auto;padding:15px 8px 0}.admin-profile{display:flex;align-items:center;gap:11px;padding:13px 4px 22px;min-width:0}.admin-avatar{width:39px;height:39px;flex-shrink:0;border-radius:50%;background:#f2f6ff;color:#243b60;display:grid;place-items:center;font-size:19px}.admin-profile strong{display:block;font-size:12px;color:white}.admin-profile small{display:block;font-size:10px;color:#aab9d0;margin-top:5px;overflow-wrap:anywhere}.admin-logout{border:0;background:transparent;color:#d4deed;padding:12px 5px;font:inherit;cursor:pointer;font-size:13px}
.admin-main{margin-left:234px;min-width:0}.admin-topbar{min-height:72px;padding:12px 27px;background:white;border-bottom:1px solid #e8edf5;display:flex;align-items:center;justify-content:space-between;gap:18px;position:sticky;top:0;z-index:10}.admin-global-search{width:min(460px,60%);position:relative}.admin-global-search span{position:absolute;left:13px;top:9px;color:#8290a6}.admin-global-search input{width:100%;height:38px;padding:0 13px 0 36px;border:1px solid #e3e9f2;border-radius:9px;background:#f5f7fb;font:inherit;font-size:12px;outline:none}.admin-top-actions{display:flex;align-items:center;gap:13px}.admin-content{max-width:1800px;margin:0 auto;padding:27px}.admin-welcome{display:flex;justify-content:space-between;align-items:center;gap:18px;margin-bottom:25px}.admin-welcome h1{font-size:clamp(23px,2.5vw,30px);letter-spacing:-.9px;margin:0 0 7px}.admin-muted{color:var(--muted);font-size:13px;line-height:1.65}.admin-date{color:#71829c;font-size:11px;text-align:right;line-height:1.8}
.admin-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:15px;margin-bottom:20px}.admin-stat{min-width:0;background:white;border:1px solid #e8edf5;border-radius:12px;padding:19px 17px;box-shadow:0 3px 12px #1a31500a}.admin-stat-head{display:flex;align-items:center;gap:12px}.admin-stat-icon{width:41px;height:41px;flex-shrink:0;border-radius:10px;display:grid;place-items:center;font-size:21px;background:#edf3ff;color:#3478f6}.admin-stat-icon.purple{background:#f1edff;color:#8260e8}.admin-stat-icon.green{background:#e8f8f3;color:#159c80}.admin-stat-icon.mint{background:#e8f8ef;color:#1aa36d}.admin-stat-label{color:#64738b;font-size:11px}.admin-stat-value{font-size:25px;font-weight:850;letter-spacing:-.8px;margin-top:6px;overflow-wrap:anywhere}.admin-stat-foot{color:#6e9b94;font-size:10px;margin-top:12px}
.admin-workspace{display:grid;grid-template-columns:minmax(290px,.88fr) minmax(0,1.22fr);gap:19px;align-items:start}.admin-panel{background:white;border:1px solid #e6ecf5;border-radius:12px;padding:20px;min-width:0;box-shadow:0 3px 13px #18315308}.admin-panel-title{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:6px}.admin-panel-title h2{font-size:16px;letter-spacing:-.35px;margin:0}.admin-panel-desc{font-size:11px;color:#8290a5;line-height:1.6;margin-bottom:18px}.admin-label{display:block;font-size:11px;font-weight:750;color:#34445d;margin:15px 0 7px}.admin-input{width:100%;min-width:0;border:1px solid #dfe6f0;border-radius:8px;padding:11px 12px;color:#243650;background:white;font:inherit;font-size:12px;outline:none}.admin-input:focus{border-color:#6094fa;box-shadow:0 0 0 3px #3478f614}.admin-input::placeholder{color:#a1adbf}.admin-textarea{resize:vertical;min-height:95px;line-height:1.6}
.admin-btn{border:1px solid transparent;border-radius:8px;padding:10px 12px;display:inline-flex;align-items:center;justify-content:center;gap:7px;cursor:pointer;font:inherit;font-size:11px;font-weight:750;text-decoration:none;white-space:nowrap}.admin-btn:disabled{opacity:.55;cursor:wait}.admin-btn-primary{background:#3478f6;color:white;box-shadow:0 3px 8px #3478f628}.admin-btn-light{background:white;color:#4e607a;border-color:#dfe6f0}.admin-btn-edit{background:white;color:#3478f6;border-color:#d8e5ff}.admin-btn-delete{background:white;color:#e05c69;border-color:#ffdade}.admin-save{width:100%;margin-top:20px;padding:12px}.admin-notice{border-radius:8px;background:#edf4ff;color:#2859a2;padding:11px 12px;font-size:12px;line-height:1.6;margin-top:15px;overflow-wrap:anywhere}.admin-notice.error{background:#fff0f0;color:#ae3030}
.admin-list-toolbar{display:flex;gap:8px;align-items:center;margin:16px 0 12px}.admin-list-toolbar .admin-input{flex:1;min-width:0}.admin-count{font-size:11px;color:#8592a6;margin:13px 0}.admin-product-list{border:1px solid #e7ecf3;border-radius:10px;overflow:hidden}.admin-product{padding:12px 10px;display:grid;grid-template-columns:60px minmax(0,1fr) auto;gap:12px;align-items:center;border-bottom:1px solid #edf0f5}.admin-product:last-child{border-bottom:0}.admin-thumb{width:60px;height:60px;border-radius:8px;object-fit:cover;background:#f0f3f8}.admin-thumb-empty{display:grid;place-items:center;color:#91a0b4;font-size:23px}.admin-product-info{min-width:0}.admin-product-name{font-size:11px;font-weight:800;line-height:1.5;overflow-wrap:anywhere}.admin-category{display:inline-block;font-size:9px;padding:4px 7px;border-radius:20px;background:#edf2ff;color:#5269a5;margin-top:5px}.admin-product-price{font-size:12px;font-weight:850;color:#3478e8;margin-top:4px;overflow-wrap:anywhere}.admin-stock{font-size:10px;color:#8996a9;margin-top:4px}.admin-product-actions{display:flex;gap:5px;align-items:center}.admin-product-actions .admin-btn{padding:7px 8px;font-size:10px}.admin-empty{text-align:center;padding:35px 15px;color:#8a97aa;font-size:12px;line-height:1.7}.admin-tip{margin-top:17px;padding:13px 16px;border:1px solid #dfeaff;background:#edf5ff;border-radius:9px;color:#4e76b5;font-size:11px;line-height:1.6}
.admin-login-wrap{min-height:100vh;display:grid;place-items:center;padding:20px;background:#f4f7fc}.admin-login-card{width:100%;max-width:430px;background:white;border:1px solid #e6ecf5;border-radius:17px;padding:30px;box-shadow:0 12px 45px #1a315015}.admin-login-card h1{font-size:26px;margin:28px 0 7px}
@media(max-width:1150px){.admin-sidebar{width:205px}.admin-main{margin-left:205px}.admin-content{padding:22px 18px}.admin-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.admin-workspace{grid-template-columns:minmax(0,1fr)}}
@media(max-width:700px){.admin-sidebar{position:relative;width:100%;height:auto;padding:15px 14px 10px}.admin-logo{font-size:19px;padding:0 4px}.admin-nav{display:flex;overflow-x:auto;margin-top:14px;gap:7px}.admin-nav button{width:auto;flex-shrink:0;padding:10px 12px;gap:7px}.admin-sidebar-bottom{display:none}.admin-main{margin-left:0}.admin-topbar{min-height:61px;padding:11px 14px;gap:9px}.admin-global-search{width:100%}.admin-content{padding:20px 13px 28px}.admin-welcome{align-items:flex-start;margin-bottom:19px}.admin-date{display:none}.admin-welcome h1{font-size:24px}.admin-stats{gap:9px;margin-bottom:14px}.admin-stat{padding:13px 11px}.admin-stat-icon{width:34px;height:34px;font-size:17px}.admin-stat-head{gap:8px}.admin-stat-value{font-size:22px}.admin-stat-foot{font-size:9px;margin-top:8px}.admin-panel{padding:15px 12px}.admin-product{grid-template-columns:48px minmax(0,1fr);gap:10px;padding:12px 9px}.admin-thumb{width:48px;height:48px}.admin-product-actions{grid-column:2}.admin-product-actions .admin-btn{padding:7px 10px}.admin-tip{margin-top:13px}}
@media(max-width:360px){.admin-stat-head{align-items:flex-start;flex-direction:column}.admin-stat-value{font-size:21px}.admin-topbar{flex-wrap:wrap}.admin-global-search{width:100%}}
`;

function formatPrice(value) {
  const text = String(value ?? "").trim();
  if (!text) return "Tanya harga";
  if (/[a-zA-Z]/.test(text) || /Rp/i.test(text)) return text;
  const digits = text.replace(/\D/g, "");
  return digits ? `Rp ${Number(digits).toLocaleString("id-ID")}` : text;
}

function categoryLabel(value) {
  const labels = {
    "kuliah-kerja": "Kuliah & Kerja",
    performa: "Performa",
    "desain-kreatif": "Desain & Kreatif",
  };
  return labels[value] || value || "Tanpa kategori";
}

export default function Admin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgot, setForgot] = useState(false);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard");

  useEffect(() => {
    if (!supabaseConfigured || !supabase) return undefined;
    let mounted = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (error) setNotice(error.message);
      setSession(data?.session || null);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) setSession(nextSession);
    });
    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) loadProducts();
  }, [session]);

  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setNotice("Gagal memuat produk: " + error.message);
    else setProducts(data || []);
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setNotice("");
    try {
      if (forgot) {
        if (!email.trim()) throw new Error("Masukkan email admin.");
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: RESET_URL,
        });
        if (error) throw error;
        setNotice("Tautan reset dikirim. Periksa Inbox dan Spam.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
      }
    } catch (error) {
      setNotice(error.message || "Permintaan gagal.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setImageFile(null);
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
    setNotice("Mode edit aktif. Perbarui data lalu simpan.");
    setActiveNav("Produk");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveProduct(event) {
    event.preventDefault();
    if (!form.name.trim()) {
      setNotice("Nama produk wajib diisi.");
      return;
    }
    if (!form.price.trim()) {
      setNotice("Isi harga, atau tulis Hubungi kami / Gratis.");
      return;
    }
    setLoading(true);
    setNotice("");
    try {
      let imageUrl = form.image_url.trim();
      if (imageFile) {
        const extension = (imageFile.name.split(".").pop() || "jpg")
          .toLowerCase().replace(/[^a-z0-9]/g, "");
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
        const { error: uploadError } = await supabase.storage.from(BUCKET).upload(
          path,
          imageFile,
          { upsert: false, contentType: imageFile.type || "image/jpeg" }
        );
        if (uploadError) throw uploadError;
        imageUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
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
      setNotice(editingId ? "Produk berhasil diperbarui." : "Produk berhasil ditambahkan.");
      resetForm();
      await loadProducts();
    } catch (error) {
      setNotice("Gagal menyimpan produk: " + (error.message || "Kesalahan tidak diketahui."));
    } finally {
      setLoading(false);
    }
  }

  async function removeProduct(product) {
    if (!window.confirm(`Hapus produk "${product.name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setLoading(true);
    setNotice("");
    try {
      const { error } = await supabase.from("products").delete().eq("id", product.id);
      if (error) throw error;
      if (editingId === product.id) resetForm();
      setProducts((current) => current.filter((item) => item.id !== product.id));
      setNotice(`Produk "${product.name}" berhasil dihapus.`);
      await loadProducts();
    } catch (error) {
      setNotice("Gagal menghapus produk: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) =>
      [product.name, product.price, product.category, product.description]
        .some((value) => String(value || "").toLowerCase().includes(query))
    );
  }, [products, search]);

  const categoryCount = new Set(products.map((product) => product.category).filter(Boolean)).size;
  const totalStock = products.reduce((sum, product) => sum + (Number(product.stock) || 0), 0);

  if (!supabaseConfigured || !supabase) {
    return (
      <main className="admin-app">
        <style>{CSS}</style>
        <div className="admin-login-wrap">
          <section className="admin-login-card">
            <div className="admin-logo" style={{ color: "#14243e" }}>FIKRI <span>STORE.</span></div>
            <h1>Konfigurasi Supabase</h1>
            <p className="admin-muted">Periksa VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY pada environment variables hosting.</p>
          </section>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="admin-app">
        <style>{CSS}</style>
        <div className="admin-login-wrap">
          <section className="admin-login-card">
            <div className="admin-logo" style={{ color: "#14243e", padding: 0 }}>FIKRI <span>STORE.</span></div>
            <div className="admin-muted">ADMINISTRATION PORTAL</div>
            <h1>{forgot ? "Reset password" : "Selamat datang!"}</h1>
            <p className="admin-muted">{forgot ? "Masukkan email admin untuk menerima tautan reset." : "Masuk untuk mengelola katalog Fikri Store."}</p>
            <form onSubmit={handleLogin}>
              <label className="admin-label" htmlFor="login-email">Email admin</label>
              <input id="login-email" className="admin-input" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@email.com" />
              {!forgot && <>
                <label className="admin-label" htmlFor="login-password">Password</label>
                <input id="login-password" className="admin-input" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Masukkan password" />
              </>}
              <button className="admin-btn admin-btn-primary admin-save" disabled={loading}>{loading ? "Memproses..." : forgot ? "Kirim tautan reset" : "Masuk ke dashboard →"}</button>
            </form>
            <button type="button" className="admin-btn admin-btn-light admin-save" style={{ width: "100%" }} onClick={() => { setForgot(!forgot); setNotice(""); }}>{forgot ? "← Kembali ke login" : "Lupa password?"}</button>
            {notice && <div className="admin-notice" role="status">{notice}</div>}
          </section>
        </div>
      </main>
    );
  }

  const navItems = [
    { name: "Dashboard", icon: "▦" },
    { name: "Produk", icon: "♧" },
    { name: "Pesanan", icon: "▤" },
    { name: "Pengaturan", icon: "⚙" },
  ];

  return (
    <main className="admin-app">
      <style>{CSS}</style>
      <aside className="admin-sidebar">
        <div className="admin-logo">FIKRI <span>STORE.</span></div>
        <nav className="admin-nav" aria-label="Navigasi admin">
          {navItems.map((item) => (
            <button key={item.name} className={activeNav === item.name ? "active" : ""} onClick={() => {
              setActiveNav(item.name);
              if (item.name === "Produk") document.getElementById("product-form")?.scrollIntoView({ behavior: "smooth" });
              if (item.name === "Dashboard") window.scrollTo({ top: 0, behavior: "smooth" });
              if (item.name === "Pesanan" || item.name === "Pengaturan") setNotice(`Bagian ${item.name} belum tersedia pada versi ini.`);
            }}>
              <span className="nav-icon">{item.icon}</span>{item.name}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <div className="admin-profile">
            <div className="admin-avatar">♟</div>
            <div style={{ minWidth: 0 }}><strong>Admin Fikri Store</strong><small>{session.user.email}</small></div>
          </div>
          <button className="admin-logout" onClick={() => supabase.auth.signOut()}>⇥ &nbsp; Keluar</button>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div className="admin-global-search"><span>⌕</span><input aria-label="Cari produk" placeholder="Cari produk, kategori, atau harga..." value={search} onChange={(event) => setSearch(event.target.value)} /></div>
          <div className="admin-top-actions"><span title="Notifikasi">♧</span><Link to="/" className="admin-btn admin-btn-light">Lihat Website ↗</Link></div>
        </header>

        <div className="admin-content">
          <div className="admin-welcome">
            <div><h1>Selamat datang, Admin! 👋</h1><div className="admin-muted">Kelola produk Fikri Store dengan mudah dan cepat.</div></div>
            <div className="admin-date">▦ &nbsp; Dashboard admin<br />Fikri Store</div>
          </div>

          <div className="admin-stats">
            <div className="admin-stat"><div className="admin-stat-head"><div className="admin-stat-icon">◇</div><div><div className="admin-stat-label">Total Produk</div><div className="admin-stat
