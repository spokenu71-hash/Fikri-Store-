
import "./AdminPremium.css";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid, Package, Images, Layers, Pencil, Trash2, MoreVertical, Search } from "lucide-react";
import { supabase, supabaseConfigured } from "../lib/supabase.js";
import SiteImagesManager from "./SiteImagesManager.jsx";

const RESET_URL = "https://fikri-store.pages.dev/reset-password";
const BUCKET = "product-images";
const MOBILE_LOGO_SRC = "data:image/jpeg;base64,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";

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
  return digits
    ? `Rp ${Number(digits).toLocaleString("id-ID")}`
    : text;
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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openProductMenu, setOpenProductMenu] = useState(null);
  const [activeNav, setActiveNav] = useState("Dashboard");

  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("info");
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productError, setProductError] = useState("");

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
    setProductError("");

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      const message = error.message || "Kesalahan tidak diketahui.";
      setProductError(message);
      showNotice("Gagal memuat produk: " + message, "error");
    } finally {
      setProductsLoading(false);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    showNotice("");

    try {
      if (!supabase) {
        throw new Error("Supabase belum dikonfigurasi.");
      }

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

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      showNotice(error.message, "error");
      return;
    }

    resetForm();
    setNotice("");
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
      showNotice("Isi harga produk terlebih dahulu.", "error");
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
        if (!imageFile.type.startsWith("image/")) {
          throw new Error("File yang dipilih harus berupa gambar.");
        }
        if (imageFile.size > 8 * 1024 * 1024) {
          throw new Error("Ukuran foto produk maksimal 8 MB.");
        }

        const extension = (
          imageFile.name.split(".").pop() || "jpg"
        )
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

      showNotice(
        `Produk "${product.name}" berhasil dihapus.`,
        "success"
      );

      await loadProducts();
    } catch (error) {
      showNotice(
        "Gagal menghapus produk: " +
          (error.message || "Terjadi kesalahan."),
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const matchesSearch = !query || [
        product.name, product.price, product.category, product.description, product.stock,
      ].some((value) => String(value ?? "").toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [products, search, selectedCategory]);

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
    { name: "Dashboard", shortName: "Home", icon: LayoutGrid },
    { name: "Produk", shortName: "Produk", icon: Package },
    { name: "Foto Homepage", shortName: "Foto", icon: Images },
  ];

  function navigateTo(name) {
    setActiveNav(name);

    const targets = {
      Dashboard: "ap-dashboard",
      Produk: "ap-products",
      "Foto Homepage": "ap-site-images",
    };

    document
      .getElementById(targets[name])
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

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
            Periksa VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY
            pada environment variables hosting.
          </p>
          <Link to="/">Kembali ke toko</Link>
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
          <Link to="/" className="ap-brand">
            FIKRI <span>STORE.</span>
          </Link>

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
            <div className={`ap-notice ${noticeType}`} role="status">
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
              onClick={() => navigateTo(item.name)}
            >
              <span className="ap-nav-icon"><item.icon size={18} strokeWidth={2} /></span>
              <span>{item.name}</span>
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
            onClick={handleSignOut}
          >
            <span>↗</span> Keluar dari akun
          </button>
        </div>
      </aside>

      <nav className="ap-mobile-bottom-nav" aria-label="Navigasi admin mobile">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              type="button"
              key={item.name}
              className={`ap-mobile-nav-item ${activeNav === item.name ? "active" : ""}`}
              onClick={() => navigateTo(item.name)}
              aria-label={item.name}
              aria-current={activeNav === item.name ? "page" : undefined}
            >
              <span className="ap-mobile-nav-icon"><Icon size={20} strokeWidth={2.1} /></span>
              <span className="ap-mobile-nav-label">{item.shortName}</span>
              {item.name === "Produk" && products.length > 0 && (
                <span className="ap-mobile-nav-count">{products.length}</span>
              )}
            </button>
          );
        })}
      </nav>

      <section className="ap-main">
        <div className="ap-mobile-brandbar">
          <Link to="/" className="ap-mobile-brand">
            <span className="ap-mobile-brand-mark"><i /><i /><i /></span>
            <strong>Fikri Store</strong>
          </Link>
          <div className="ap-mobile-user" aria-label="Administrator Fikri"><img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCABwAHADASIAAhEBAxEB/8QAHQAAAQQDAQEAAAAAAAAAAAAABQQGBwgBAgMACf/EADYQAAEDAwIFAgQDCAMBAAAAAAECAwQABREGIQcSEzFBIlEUMmFxQlJiCBUWI0OBocGRseHx/8QAGgEAAgMBAQAAAAAAAAAAAAAAAQIAAwQFBv/EACERAAIDAAEFAQEBAAAAAAAAAAABAgMRIQQFEhMxYUEU/9oADAMBAAIRAxEAPwCz9er1eFOAzk1pIeQy2VOrCQPekdzuKIaeVPqdPYe1NiZIdkkrdUT7J8CikK5YGZF/TzFMdPNjye1JHbnLdz6yn6CgEiU1FaW9IcCG0DJJ7CmRfOLlihxXBCKpMkbBONgabEhPJkjvzHid3Vf81o1LfSrZ1WfvVdpvG25JUsCOyEntg9qWaX43Fy4NMXdhKWVqx1E+KmomssYxdZbf4yoexonFvrasJkp5f1A004V2gSmGnWZTSkOJyn1b13ccSpI5FBX2oYmHWh9tuodRztqCk+4rbO1MWHNeiLCmVbD8Pg06rXcGpqdtnPxJoZgyloQzXs17sK8aAxrSG6ThEZPLu4rbHtSxxYbQVK7Ab01JzypElThz7CmFk8OK1KcWVLJKj5NJrhJZhQnpMpwNstJK1LPgUoAqMv2hbt8BoVUdIPPJUEgij+CLnki7iHxJcvr7seK50rclRwAd1/WowddlzllMVtXTz3ApVpmzrussAglAxmpqsWm4saGAlpHy4O1Zbb1Hg1VdK5rSA24hS/h8KJ8ilXRQciO0SU7k1KWq7FHt0N6WGRzK2Bx2qNXJDbZUGhgnuasrsU1ol1TreCiHMuLZb6LzoxtjnqXuDuuj8WbRd3Vc7isNLUfPtUJu3FQ5fcea0t91dauTb6DhaFhYI+hqzcKM0u+NxmusdxbDqVtkgjfbzQnS8xVw09Alq3U62CaKjerBR5W2YmZHChssbKFLDTMtcsw5aFH5DsoU8gQQCNwd81W0Wp6DL29yR0tg7rP+KBL3ohfF804J8JTQ+mQjMY3pl8VNJHV1iREQsIWhWQae2N6wRuajAVk0raxYVyIMiI4HmXCAs9nMGirV/usid8OhMWKjPpDisE1Jtx0ky9rEzluEx+nktZ2Bpu3XR8Z7ULE5KEqQ2dkmuZZnm9OxSnKtYLG7YL5aFR7i22R+g5zUF6/0f/D92CWyTHcOU58VaS0WmHBilaTgqGce1M7Xem2dRFhvGOVYyoe1LXPwl+Eur9kePpWldoflBQisreUBvyig8GK4bkmMUKDhWE8pG/erQOWaFapzMNiMekW9lJH4h70zdGaXavfGOc+W0qhwClxYxsVY2H/Va6rvOXiZb+m9UFPScdMQhb9N26KARyMjIPvRTGK6rAOwGB2H0rRQrWYTkvcEe9OrT0n4iAkKOVtnlP2pqr7UY0qvlkvN+FDNBhX0zdTm4O58HFJAKWXUET3frvSQVCM28VhIyoZ8b1nxWATnb71F8I3gwdbzLlb7un92qbJdwVdQ4GK6wOooFx1xJUobhJyBSTi3a/iWIsxCXVKbVykNnGaD6XgOxkCTzPIHltw5rl9Qslp2+madfA8CtWOUE4rR0hDCyDvihsy6tNNkqWAaDNXlU9/oR8kZ3VWZy5LV+CLWur/3DpVyQxFccmOKLSSoeT2o5wU06/aNNKn3AZuFzV13Se4Hgf4rF104zfHrfHfAU206HFAjvjepDZbS2hCGwAhICQAPbxXS6RLHL+nL62T8lH+HTG1c1iupFcl1sMRyUKJWD03JGPIOaQeaJ2BHNcE/QHNRhQqvTeHkOeFJxQ8Dej9xa60VQxuncUAA7/fFAJ41r9e1eX82KTzLhCt7CnZ8pqO2kZJWoCpuA/BHfoBuVudjoUA4d0k9gaizU8a/aZtzbsuTGPVPI2nO6jRDV/GqxWkFu2c06QdgU/KDUHaz4g3PU14hypyghmOvLbSTsBVVtUZrWXU3Sg8Q6reblfJRQ+4RvgoFSLZLeqAG0KSBTEszxQpufDWFIcAJxT+t08SI4ecUMD38VyZLHh14PjQld35LcB5yC505KEEtqI7EClvCzVLmqrCpyZy/vCMstPAfTzURa/4hIZadgWtXM+oFKnBvy0wtKaquemJiplueKVL3cSTsv710OkhJR2RzetnFyyJc/FcFb1FWj+NdquTbbN7QYcjtzp3SalSCldxYRIhoLjKxlKsdxWwx/TPKaNabbyt10jYJxSFcKQ2j+Y0R9acNvjiNEQj8XdVBjJHVW4NALmyY7yldkK3z4FOCkd3gi4WyVFK+mXG1ICx3ST5qDNFZuK3GCSxcH7TphaUBolDsruSryAKhKdeJ90dU7PmPSFknKlqzRHiJpK7aK1E9AvDa1JWorakD5XUnsc+9Nxk8wUe+/egJhqQVqKiTgVydOe5xilOPTSdxAVjO9AiC2ndSy7SrpNK6jJ7oVRS/a6nuxPg46vho6t1FPzH6U2UNpA2G2fFYktIcd2BA9qrdUW9LldNLNMMqC/XzZzv33/vSsJW4N9k+1cI7SUKGBRO3pS5OjtL+VbiUH7E4q1fMKX90nvgfw3tsCyfxhq5KVND1Ro6xkD9RHmnVd+J9yW/07Oy1Eio9KAU5JH28UT4or+A0xZLbFHJHDKdhsDsKi1tHqJ96x3WtPEea7v3CyFnpreJEpae4oym3UovjSHGid3W9in+1SrHlNTI7ciOsOMrTzJUDsRVXHjyoqX+CM116xTIziipEd7+Xk9gfFGixt4x+zdysts9Nj0kivZxjGdqxXjW09KN7WGlbVq60PW29RUPsK3SrHqbV+ZJ8Gqp8QOCd+0e47It6F3O1ZJS6getI/UKuaBuK2OMEEJOdiCNiKVkzT5uvAoWULSUKHcKGK5IGVVebWfCvSupytcm3oYkK/rMDlJPvUR3v9myQlS12O7oUM5DcgY/zUExle221LcS2j5jKFlu2j2rj4w7n/2Q==" alt="" /><span /></div>
        </div>
        <header className="ap-topbar">
          <div className="ap-breadcrumb">
            <span>Workspace</span>
            <span className="ap-breadcrumb-separator">/</span>
            <strong>{activeNav}</strong>
          </div>

          <div className="ap-topbar-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari produk..."
              aria-label="Cari produk dari header"
            />
          </div>

          <div className="ap-topbar-actions">
            <div className="ap-topbar-profile">
              <div className="ap-topbar-avatar">F</div>
              <div><strong>Fikri Store</strong><small>Administrator</small></div>
            </div>
            <span className="ap-live-indicator">
              <span className="ap-status-dot" />
              Live workspace
            </span>
            <Link to="/" className="ap-website-link">
              Lihat website <span>↗</span>
            </Link>
          </div>
        </header>

        <div className="ap-content" id="ap-dashboard">
          <section className="ap-welcome">
            <div className="ap-welcome-copy">
              <span className="ap-eyebrow">RINGKASAN TOKO</span>
              <h1>Selamat datang, Fikri <span className="ap-welcome-wave">👋</span></h1>
              <p>
                Kelola inventaris tokomu
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

          <section className="ap-section-heading ap-desktop-summary-heading">
            <div>
              <span className="ap-eyebrow">RINGKASAN</span>
              <h2>Ringkasan toko</h2>
            </div>
            <span className="ap-data-label">
              <span className="ap-status-dot" />
              Data produk aktual
            </span>
          </section>

          <section className="ap-stats-grid">
            <StatCard
              icon={<Package size={29} strokeWidth={2.2} />}
              label="Total Produk"
              value={products.length}
              description="Produk dalam katalog"
              tone="blue"
            />
            <StatCard
              icon={<Layers size={29} strokeWidth={2.2} />}
              label="Stok Tersedia"
              value={totalStock.toLocaleString("id-ID")}
              description="Unit seluruh produk"
              tone="mint"
            />
            <StatCard
              icon={<Layers size={29} strokeWidth={2.2} />}
              label="Kategori"
              value={categoryCount}
              description="Kategori yang digunakan"
              tone="purple"
            />
            <StatCard
              icon={<Package size={29} strokeWidth={2.2} />}
              label="Stok menipis"
              value={lowStockCount}
              description="Produk dengan stok ≤ 5"
              tone="amber"
            />
          </section>

          <section className="ap-management-heading" id="ap-products">
            <div>
              <span className="ap-eyebrow ap-desktop-only">CATALOG MANAGEMENT</span>
              <h2>Produk</h2>
              <p>Atur dan kelola produk toko kamu</p>
            </div>

            <button
              type="button"
              className="ap-button ap-button-primary"
              onClick={() => {
                resetForm();
                navigateTo("Produk");
              }}
            >
              <span>＋</span> Tambah Produk
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
                    />
                  </div>
                </div>

                <label className="ap-label" htmlFor="ap-product-category">
                  Kategori
                </label>
                <select
                  id="ap-product-category"
                  className="ap-input"
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
                  URL foto produk (opsional)
                </label>
                <input
                  id="ap-product-image-url"
                  className="ap-input"
                  type="url"
                  value={form.image_url}
                  onChange={(event) =>
                    setForm({ ...form, image_url: event.target.value })
                  }
                  placeholder="https://..."
                />

                <label className="ap-label" htmlFor="ap-image-file">
                  Upload foto dari HP
                </label>
                <input
                  id="ap-image-file"
                  className="ap-input"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setImageFile(event.target.files?.[0] || null)
                  }
                />

                <p className="ap-help-text">
                  Jika memilih foto baru, foto tersebut akan menggantikan
                  URL foto yang digunakan.
                </p>

                <div className="ap-form-buttons">
                  <button
                    type="submit"
                    className="ap-button ap-button-primary"
                    disabled={loading}
                  >
                    {loading
                      ? "Menyimpan..."
                      : editingId
                        ? "Simpan perubahan"
                        : "＋ Tambah produk"}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      className="ap-button ap-button-secondary"
                      onClick={resetForm}
                      disabled={loading}
                    >
                      Batal edit
                    </button>
                  )}
                </div>
              </form>
            </article>

            <article className="ap-panel ap-list-panel">
              <div className="ap-panel-heading ap-list-panel-heading">
                <div>
                  <span className="ap-eyebrow">INVENTARIS PRODUK</span>
                  <h3>Daftar produk</h3>
                  <p>
                    {filteredProducts.length} dari {products.length} produk
                  </p>
                </div>

                <button
                  type="button"
                  className="ap-button ap-button-secondary"
                  onClick={loadProducts}
                  disabled={productsLoading}
                >
                  {productsLoading ? "Memuat..." : "↻ Segarkan katalog"}
                </button>
              </div>

              <div className="ap-reference-search-wrap">
                <Search className="ap-reference-search-icon" size={22} strokeWidth={2} />
                <input
                  className="ap-input ap-search ap-reference-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari nama produk..."
                  aria-label="Cari produk"
                />
              </div>

              <div className="ap-category-filters" aria-label="Filter kategori produk">
                <button type="button" className={selectedCategory === "all" ? "active" : ""} onClick={() => setSelectedCategory("all")}>Semua</button>
                {CATEGORIES.map((category) => (
                  <button type="button" key={category.value} className={selectedCategory === category.value ? "active" : ""} onClick={() => setSelectedCategory(category.value)}>{category.label}</button>
                ))}
              </div>

              {productsLoading ? (
                <p className="ap-empty-state">Memuat katalog produk...</p>
              ) : productError ? (
                <div className="ap-empty-state ap-load-error" role="alert">
                  <strong>Katalog belum bisa dimuat</strong>
                  <p>{productError}</p>
                  <button
                    type="button"
                    className="ap-button ap-button-secondary"
                    onClick={loadProducts}
                  >
                    Coba muat ulang
                  </button>
                </div>
              ) : filteredProducts.length === 0 ? (
                <p className="ap-empty-state">
                  {products.length === 0
                    ? "Belum ada produk di database."
                    : "Produk yang kamu cari tidak ditemukan."}
                </p>
              ) : (
                <div className="ap-product-list">
                  {filteredProducts.map((product) => (
                    <article className="ap-product-item" key={product.id}>
                      <button
                        type="button"
                        className="ap-product-kebab"
                        aria-label={"Menu " + product.name}
                        aria-expanded={openProductMenu === product.id}
                        onClick={() => setOpenProductMenu((current) => current === product.id ? null : product.id)}
                      >
                        <MoreVertical size={22} strokeWidth={2.2} />
                      </button>
                      {openProductMenu === product.id && (
                        <div className="ap-product-menu">
                          <button type="button" onClick={() => { setOpenProductMenu(null); editProduct(product); }}>
                            <Pencil size={15} /> Edit produk
                          </button>
                          <button type="button" onClick={() => { setOpenProductMenu(null); removeProduct(product); }}>
                            <Trash2 size={15} /> Hapus produk
                          </button>
                        </div>
                      )}
                      {product.image_url ? (
                        <img
                          className="ap-product-image"
                          src={product.image_url}
                          alt={product.name}
                        />
                      ) : (
                        <div className="ap-product-image ap-no-image">
                          FOTO
                        </div>
                      )}

                      <div className="ap-product-details">
                        <strong>{product.name}</strong>
                        {product.description && (
                          <p className="ap-product-specs">{product.description}</p>
                        )}
                        <span className="ap-product-price">
                          {formatPrice(product.price)}
                        </span>
                        <small className="ap-stock-badge">●&nbsp; Stok: {product.stock ?? 0}</small>
                      </div>

                      <div className="ap-product-actions">
                        <button
                          type="button"
                          className="ap-icon-button"
                          aria-label={`Edit ${product.name}`}
                          onClick={() => editProduct(product)}
                        >
                          <Pencil size={22} strokeWidth={2.1} />
                        </button>
                        <button
                          type="button"
                          className="ap-icon-button ap-delete-button"
                          aria-label={`Hapus ${product.name}`}
                          onClick={() => removeProduct(product)}
                          disabled={loading}
                        >
                          <Trash2 size={22} strokeWidth={2.1} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </article>
          </section>

          <SiteImagesManager />

          <footer className="ap-footer">
            <span>FIKRI STORE.</span>
            <span>Admin workspace · {new Date().getFullYear()}</span>
          </footer>
        </div>
      </section>
    </main>
  );
                }
                      
