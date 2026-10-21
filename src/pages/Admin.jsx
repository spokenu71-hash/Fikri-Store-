
import { useEffect, useState } from "react";
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

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(145deg, #0b1530 0%, #17366b 230px, #f3f6fc 230px, #f3f6fc 100%)",
    padding: "22px 14px 40px",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    color: "#172033",
  },
  card: {
    boxSizing: "border-box",
    maxWidth: "900px",
    width: "100%",
    margin: "0 auto 18px",
    padding: "clamp(16px, 4vw, 26px)",
    background: "#fff",
    border: "1px solid #e5eaf3",
    borderRadius: "20px",
    boxShadow: "0 12px 34px rgba(15, 35, 75, .08)",
  },
  input: {
    display: "block",
    boxSizing: "border-box",
    width: "100%",
    padding: "14px",
    margin: "9px 0 15px",
    border: "1px solid #d7dfec",
    borderRadius: "12px",
    fontSize: "15px",
    background: "#fbfcff",
    color: "#172033",
  },
  button: {
    boxSizing: "border-box",
    padding: "13px 17px",
    background: "linear-gradient(135deg, #2868ee, #1747c8)",
    color: "#fff",
    border: 0,
    borderRadius: "12px",
    fontWeight: 750,
    cursor: "pointer",
  },
  secondary: {
    padding: "10px 14px",
    border: "1px solid #d7dfec",
    borderRadius: "11px",
    background: "#f7f9fd",
    color: "#24334e",
    fontWeight: 700,
    cursor: "pointer",
  },
  danger: {
    padding: "10px 14px",
    color: "#b42318",
    background: "#fff0ee",
    border: "1px solid #ffd4ce",
    borderRadius: "11px",
    fontWeight: 750,
    cursor: "pointer",
  },
  product: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "14px",
    border: "1px solid #e4eaf4",
    borderRadius: "15px",
    padding: "15px",
    marginTop: "11px",
    background: "linear-gradient(135deg, #fff, #fbfcff)",
  },
};

function formatPrice(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits ? Number(digits).toLocaleString("id-ID") : "";
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
  const [form, setForm] = useState(emptyForm);

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
      const { error } =
        await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: RESET_URL,
        });

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

    const numericPrice = Number(form.price);
    if (!form.price || !Number.isFinite(numericPrice) || numericPrice < 0) {
      setMessage("Masukkan harga yang valid.");
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
            "Upload gagal. Pastikan bucket 'product-images' tersedia " +
              "dan izin upload sudah diatur. " +
              uploadError.message
          );
        }

        const { data } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(path);

        imageUrl = data.publicUrl;
      }

      const payload = {
        name: form.name.trim(),
        price: numericPrice,
        category: form.category,
        description: form.description.trim(),
        image_url: imageUrl,
        stock: Number(form.stock || 0),
      };

      const result = editingId
        ? await supabase
            .from("products")
            .update(payload)
            .eq("id", editingId)
        : await supabase.from("products").insert(payload);

      if (result.error) throw result.error;

      setMessage(
        editingId
          ? "Produk berhasil diperbarui."
          : "Produk berhasil ditambahkan."
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

  if (!supabaseConfigured || !supabase) {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <h1>Fikri Store Admin</h1>
          <p>
            Konfigurasi Supabase belum benar. Periksa VITE_SUPABASE_URL
            dan VITE_SUPABASE_ANON_KEY di Environment Variables hosting.
          </p>
        </section>
      </main>
    );
  }

  if (!session) {
    return (
      <main style={styles.page}>
        <form
          onSubmit={forgotMode ? sendResetEmail : login}
          style={{ ...styles.card, maxWidth: "480px", marginTop: "8vh" }}
        >
          <p style={{ color: "#2868ee", fontWeight: 800, letterSpacing: 2 }}>
            FIKRI STORE
          </p>
          <h1 style={{ fontSize: "30px", marginBottom: 8 }}>
            {forgotMode ? "Reset Password" : "Admin Dashboard"}
          </h1>
          <p style={{ color: "#68758d", lineHeight: 1.6 }}>
            {forgotMode
              ? "Masukkan email admin untuk menerima tautan reset password."
              : "Login untuk mengelola produk toko kamu."}
          </p>

          <label htmlFor="admin-email">Email admin</label>
          <input
            id="admin-email"
            style={styles.input}
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          {!forgotMode && (
            <>
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                style={styles.input}
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
            style={{ ...styles.button, width: "100%" }}
            disabled={loading}
          >
            {loading
              ? "Memproses..."
              : forgotMode
                ? "Kirim Tautan Reset"
                : "Masuk ke Admin"}
          </button>

          <button
            type="button"
            style={{
              display: "block",
              width: "100%",
              marginTop: 16,
              border: 0,
              background: "transparent",
              color: "#245fe5",
              cursor: "pointer",
            }}
            onClick={() => {
              setForgotMode(!forgotMode);
              setMessage("");
            }}
          >
            {forgotMode ? "Kembali ke Login" : "Lupa Password?"}
          </button>

          {message && (
            <p role="status" style={{ overflowWrap: "anywhere" }}>
              {message}
            </p>
          )}
        </form>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <section style={{ ...styles.card, marginTop: 6 }}>
        <p
          style={{
            margin: "0 0 8px",
            color: "#3973ef",
            fontWeight: 800,
            letterSpacing: "1.5px",
            fontSize: 12,
          }}
        >
          FIKRI STORE / ADMIN
        </p>

        <h1
          style={{
            margin: "0 0 8px",
            fontSize: "clamp(25px, 5vw, 35px)",
            letterSpacing: "-1px",
          }}
        >
          Dashboard Produk
        </h1>

        <p
          style={{
            marginTop: 0,
            color: "#68758d",
            overflowWrap: "anywhere",
          }}
        >
          Login sebagai {session.user.email}
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            alignItems: "center",
            margin: "20px 0",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 130,
              background: "#edf3ff",
              padding: 15,
              borderRadius: 14,
            }}
          >
            <div style={{ fontSize: 13, color: "#536783" }}>
              Total produk
            </div>
            <strong style={{ fontSize: 26 }}>{products.length}</strong>
          </div>

          <button
            style={styles.secondary}
            onClick={loadProducts}
            disabled={loading}
          >
            ↻ Muat ulang
          </button>

          <button
            style={styles.secondary}
            onClick={() => supabase.auth.signOut()}
          >
            Keluar
          </button>
        </div>

        <h2 style={{ marginBottom: 6 }}>
          {editingId ? "Edit Produk" : "Tambah Produk"}
        </h2>
        <p style={{ marginTop: 0, color: "#68758d", fontSize: 14 }}>
          Lengkapi informasi produk di bawah ini.
        </p>

        <form onSubmit={saveProduct}>
          <label htmlFor="product-name">Nama produk</label>
          <input
            id="product-name"
            style={styles.input}
            placeholder="Contoh: Laptop untuk kuliah"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            required
          />

          <label htmlFor="product-price">Harga (Rupiah)</label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #d7dfec",
              borderRadius: 12,
              margin: "9px 0 15px",
              background: "#fbfcff",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                padding: "0 14px",
                fontWeight: 800,
                color: "#536783",
                borderRight: "1px solid #d7dfec",
              }}
            >
              Rp
            </span>
            <input
              id="product-price"
              type="text"
              inputMode="numeric"
              style={{
                ...styles.input,
                border: 0,
                margin: 0,
                background: "transparent",
              }}
              placeholder="450.000"
              value={formatPrice(form.price)}
              onChange={(e) =>
                setForm({
                  ...form,
                  price: e.target.value.replace(/\D/g, ""),
                })
              }
              required
            />
          </div>

          <label htmlFor="product-category">Kategori</label>
          <select
            id="product-category"
            style={styles.input}
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
            required
          >
            <option value="kuliah-kerja">Kuliah & Kerja</option>
            <option value="performa">Performa</option>
            <option value="desain-kreatif">Desain & Kreatif</option>
          </select>

          <label htmlFor="product-image">Foto produk dari galeri HP</label>
          <input
            id="product-image"
            style={styles.input}
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImageFile(e.target.files?.[0] || null)
            }
          />

          {imageFile && (
            <p style={{ fontSize: 13, color: "#536783" }}>
              File dipilih: {imageFile.name}
            </p>
          )}

          <label htmlFor="product-image-url">Atau URL gambar</label>
          <input
            id="product-image-url"
            style={styles.input}
            type="url"
            placeholder="https://alamat-gambar.jpg"
            value={form.image_url}
            onChange={(e) =>
              setForm({ ...form, image_url: e.target.value })
            }
          />

          <label htmlFor="product-stock">Stok</label>
          <input
            id="product-stock"
            style={styles.input}
            type="number"
            min="0"
            placeholder="Jumlah stok"
            value={form.stock}
            onChange={(e) =>
              setForm({ ...form, stock: e.target.value })
            }
          />

          <label htmlFor="product-description">Deskripsi produk</label>
          <textarea
            id="product-description"
            style={{ ...styles.input, minHeight: 120, resize: "vertical" }}
            placeholder={
              "Tulis deskripsi dan spesifikasi produk.\n" +
              "Prosesor: Intel Core i5\nRAM: 8GB\nStorage: SSD 256GB"
            }
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <button
            style={{ ...styles.button, width: "100%" }}
            disabled={loading}
          >
            {loading
              ? "Menyimpan..."
              : editingId
                ? "Simpan Perubahan"
                : "+ Tambah Produk"}
          </button>

          {editingId && (
            <button
              type="button"
              style={{
                ...styles.secondary,
                width: "100%",
                marginTop: 10,
              }}
              onClick={resetForm}
            >
              Batal Edit
            </button>
          )}
        </form>

        {message && (
          <p
            role="status"
            style={{
              marginTop: 18,
              padding: 12,
              borderRadius: 10,
              background: "#edf3ff",
              color: "#24477e",
              overflowWrap: "anywhere",
            }}
          >
            {message}
          </p>
        )}
      </section>

      <section style={styles.card}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 5px",
                color: "#3973ef",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 1,
              }}
            >
              INVENTARIS
            </p>
            <h2 style={{ margin: 0 }}>Daftar Produk</h2>
          </div>

          <span
            style={{
              background: "#eaf1ff",
              color: "#245fe5",
              borderRadius: 999,
              padding: "8px 13px",
              fontWeight: 800,
            }}
          >
            {products.length} produk
          </span>
        </div>

        {products.length === 0 && (
          <p style={{ color: "#68758d", marginTop: 18 }}>
            Belum ada produk yang dapat ditampilkan. Tekan Muat ulang
            atau periksa pesan error di atas.
          </p>
        )}

        {products.map((product) => (
          <article key={product.id} style={styles.product}>
            <div
              style={{
                display: "flex",
                gap: 12,
                flex: 1,
                minWidth: 180,
                alignItems: "flex-start",
              }}
            >
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{
                    width: 76,
                    height: 76,
                    objectFit: "cover",
                    borderRadius: 12,
                    background: "#edf1f7",
                  }}
                />
              ) : (
                <div
                  
