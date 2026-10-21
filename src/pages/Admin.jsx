
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
    background: "#f3f6fb",
    padding: "24px 14px",
    fontFamily: "Arial, sans-serif",
    color: "#172033",
  },
  card: {
    maxWidth: "760px",
    margin: "0 auto 20px",
    padding: "22px",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 20px #10204010",
  },
  input: {
    display: "block",
    boxSizing: "border-box",
    width: "100%",
    padding: "13px",
    margin: "12px 0",
    border: "1px solid #d5dce8",
    borderRadius: "9px",
    fontSize: "15px",
    background: "#fff",
  },
  button: {
    padding: "13px 16px",
    background: "#155eef",
    color: "#fff",
    border: 0,
    borderRadius: "9px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  link: {
    display: "block",
    marginTop: "16px",
    textAlign: "center",
    color: "#155eef",
    background: "none",
    border: 0,
    width: "100%",
    cursor: "pointer",
    fontSize: "15px",
    textDecoration: "underline",
  },
  secondary: {
    padding: "10px 14px",
    border: "1px solid #d5dce8",
    borderRadius: "8px",
    background: "#fff",
    cursor: "pointer",
  },
  danger: {
    padding: "9px 12px",
    color: "#b42318",
    background: "#fff0ee",
    border: 0,
    borderRadius: "8px",
    cursor: "pointer",
  },
  product: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    borderTop: "1px solid #e5eaf2",
    padding: "12px 0",
  },
};

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

    if (error) setMessage(error.message);
    else setProducts(data || []);
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

      setMessage(
        "Permintaan reset diproses. Periksa Inbox dan Spam email."
      );
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
            "Unggah gambar gagal. Pastikan bucket Storage " +
            "'product-images' tersedia dan izin upload sudah diatur. " +
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
        price: Number(form.price),
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
        : await supabase
            .from("products")
            .insert(payload);

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

  async function deleteProduct(id) {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;

      if (editingId === id) resetForm();

      setMessage("Produk berhasil dihapus.");
      await loadProducts();
    } catch (error) {
      setMessage(error.message || "Gagal menghapus produk.");
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
            Konfigurasi Supabase belum benar. Periksa
            VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY
            di Environment Variables hosting.
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
          style={styles.card}
        >
          <h1>Fikri Store Admin</h1>
          <p>
            {forgotMode
              ? "Masukkan email untuk menerima tautan reset password."
              : "Masuk untuk mengelola produk toko."}
          </p>

          <input
            style={styles.input}
            type="email"
            placeholder="Email admin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          {!forgotMode && (
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          )}

          <button style={styles.button} disabled={loading}>
            {loading
              ? "Memproses..."
              : forgotMode
                ? "Kirim Tautan Reset"
                : "Masuk"}
          </button>

          <button
            type="button"
            style={styles.link}
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
      <section style={styles.card}>
        <h1>Kelola Produk Fikri Store</h1>
        <p>{session.user.email}</p>

        <button
          style={styles.secondary}
          onClick={() => supabase.auth.signOut()}
        >
          Keluar
        </button>

        <h2>{editingId ? "Edit Produk" : "Tambah Produk"}</h2>

        <form onSubmit={saveProduct}>
          <input
            style={styles.input}
            placeholder="Nama produk"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            required
          />

          <input
            style={styles.input}
            type="number"
            min="0"
            placeholder="Harga (angka saja)"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
            required
          />

          <select
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

          <label style={{ display: "block", marginTop: 12 }}>
            **Foto produk dari galeri HP**
          </label>

          <input
            style={styles.input}
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImageFile(e.target.files?.[0] || null)
            }
          />

          <p style={{ fontSize: 13, color: "#667085" }}>
            Atau tempel URL gambar di bawah. Jika memilih file,
            file tersebut yang akan digunakan.
          </p>

          <input
            style={styles.input}
            type="url"
            placeholder="https://alamat-gambar.jpg"
            value={form.image_url}
            onChange={(e) =>
              setForm({ ...form, image_url: e.target.value })
            }
          />

          {imageFile && (
            <p>File dipilih: {imageFile.name}</p>
          )}

          <input
            style={styles.input}
            type="number"
            min="0"
            placeholder="Stok"
            value={form.stock}
            onChange={(e) =>
              setForm({ ...form, stock: e.target.value })
            }
          />

          <textarea
            style={{ ...styles.input, minHeight: 120 }}
            placeholder={
              "Deskripsi, satu detail per baris:\n" +
              "Prosesor: Intel Core i5\nRAM: 8GB\nStorage: SSD 256GB"
            }
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <button style={styles.button} disabled={loading}>
            {loading
              ? "Menyimpan..."
              : editingId
                ? "Simpan Perubahan"
                : "Tambah Produk"}
          </button>

          {editingId && (
            <button
              type="button"
              style={{ ...styles.secondary, width: "100%", marginTop: 10 }}
              onClick={resetForm}
            >
              Batal Edit
            </button>
          )}
        </form>

        {message && (
          <p role="status" style={{ overflowWrap: "anywhere" }}>
            {message}
          </p>
        )}
      </section>

      <section style={styles.card}>
        <h2>Daftar Produk ({products.length})</h2>

        {products.length === 0 && (
          <p>Belum ada produk, atau produk belum dapat dibaca.</p>
        )}

        {products.map((product) => (
          <article key={product.id} style={styles.product}>
            <div style={{ minWidth: 0, overflowWrap: "anywhere" }}>
              <strong>{product.name}</strong>
              <p>
                Rp {Number(product.price || 0).toLocaleString("id-ID")}
              </p>
              <small>
                Kategori: {product.category} · Stok: {product.stock}
              </small>

              {product.image_url && (
                <div>
                  <a
                    href={product.image_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Lihat gambar
                  </a>
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                style={styles.secondary}
                onClick={() => startEdit(product)}
              >
                Edit
              </button>

              <button
                style={styles.danger}
                disabled={loading}
                onClick={() => deleteProduct(product.id)}
              >
                Hapus
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
