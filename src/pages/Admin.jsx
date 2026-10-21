
import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase.js";

const RESET_URL = "https://fikri-store.pages.dev/reset-password";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f6fb",
    padding: "24px 14px",
    fontFamily: "Arial, sans-serif",
    color: "#172033",
  },
  card: {
    maxWidth: "650px",
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
  },
  button: {
    width: "100%",
    padding: "13px",
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
  },
  danger: {
    padding: "9px 12px",
    color: "#b42318",
    background: "#fff0ee",
    border: 0,
    borderRadius: "8px",
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

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image_url: "",
    stock: "1",
  });

  useEffect(() => {
    if (!supabaseConfigured || !supabase) return;

    let active = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) setMessage(error.message);
      else setSession(data.session);
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
    if (session && supabase) loadProducts();
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
    if (!supabase) return;

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

    if (!supabase) {
      setMessage("Konfigurasi Supabase belum tersedia.");
      return;
    }

    if (!email.trim()) {
      setMessage("Masukkan email akun admin terlebih dahulu.");
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

      setMessage(
        "Permintaan reset diproses. Periksa Inbox, Spam, dan folder Promosi email kamu."
      );
    } catch (error) {
      setMessage(
        error.message || "Gagal mengirim email reset password."
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveProduct(event) {
    event.preventDefault();
    if (!supabase) return;

    setLoading(true);
    setMessage("");

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      const { error } = await supabase
        .from("products")
        .insert(payload);

      if (error) throw error;

      setMessage("Produk berhasil ditambahkan.");
      setForm({
        name: "",
        price: "",
        category: "",
        description: "",
        image_url: "",
        stock: "1",
      });

      await loadProducts();
    } catch (error) {
      setMessage(error.message || "Gagal menyimpan produk.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id) {
    if (!supabase) return;
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    setMessage(
      error ? error.message : "Produk berhasil dihapus."
    );

    if (!error) loadProducts();
  }

  if (!supabaseConfigured || !supabase) {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <h1>Fikri Store Admin</h1>
          <p>
            Konfigurasi Supabase belum benar. Periksa
            VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY
            di Environment Variables hosting, lalu deploy ulang.
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
              ? "Masukkan email admin untuk menerima tautan reset password."
              : "Masuk untuk mengelola produk toko."}
          </p>

          <input
            style={styles.input}
            type="email"
            placeholder="Email admin"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          {!forgotMode && (
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
            {forgotMode
              ? "Kembali ke Login"
              : "Lupa Password?"}
          </button>

          {message && (
            <p style={{ overflowWrap: "anywhere" }} role="status">
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
        <h1>Kelola Produk</h1>
        <p>{session.user.email}</p>

        <button
          style={styles.secondary}
          onClick={() => supabase.auth.signOut()}
        >
          Keluar
        </button>

        <h2>Tambah Produk</h2>

        <form onSubmit={saveProduct}>
          {[
            ["name", "Nama produk"],
            ["price", "Harga (angka saja)"],
            ["category", "Kategori"],
            ["image_url", "URL gambar produk"],
            ["stock", "Stok"],
            ["description", "Deskripsi"],
          ].map(([key, placeholder]) => (
            <input
              key={key}
              style={styles.input}
              placeholder={placeholder}
              type={
                key === "price" || key === "stock"
                  ? "number"
                  : "text"
              }
              value={form[key]}
              onChange={(event) =>
                setForm({
                  ...form,
                  [key]: event.target.value,
                })
              }
              required={["name", "price", "category"].includes(key)}
            />
          ))}

          <button style={styles.button} disabled={loading}>
            Simpan Produk
          </button>
        </form>

        {message && <p>{message}</p>}
      </section>

      <section style={styles.card}>
        <h2>Daftar Produk ({products.length})</h2>

        {products.map((product) => (
          <article key={product.id} style={styles.product}>
            <div>
              <strong>{product.name}</strong>
              <p>
                Rp {Number(product.price).toLocaleString("id-ID")}
              </p>
              <small>Stok: {product.stock}</small>
            </div>

            <button
              style={styles.danger}
              onClick={() => deleteProduct(product.id)}
            >
              Hapus
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}
