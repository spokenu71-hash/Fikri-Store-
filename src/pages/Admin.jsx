import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Admin() {
const [session, setSession] = useState(null);
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [products, setProducts] = useState([]);
const [message, setMessage] = useState("");
const [loading, setLoading] = useState(false);
const [form, setForm] = useState({
name: "",
price: "",
category: "",
description: "",
image_url: "",
stock: "1",
});

useEffect(() => {
supabase.auth.getSession().then(({ data }) => setSession(data.session));
const { data } = supabase.auth.onAuthStateChange((_event, session) => {
setSession(session);
});
return () => data.subscription.unsubscribe();
}, []);

useEffect(() => {
if (session) loadProducts();
}, [session]);

async function loadProducts() {
const { data, error } = await supabase
.from("products")
.select("*")
.order("created_at", { ascending: false });
if (error) setMessage(error.message);
else setProducts(data || []);
}

async function login(e) {
e.preventDefault();
setLoading(true);
setMessage("");
const { error } = await supabase.auth.signInWithPassword({
email,
password,
});
setLoading(false);
if (error) setMessage(error.message);
}

async function saveProduct(e) {
e.preventDefault();
setLoading(true);
setMessage("");

const payload = {
  ...form,
  price: Number(form.price),
  stock: Number(form.stock),
};

const { error } = await supabase.from("products").insert(payload);
setLoading(false);

if (error) setMessage(error.message);
else {
  setMessage("Produk berhasil ditambahkan.");
  setForm({
    name: "",
    price: "",
    category: "",
    description: "",
    image_url: "",
    stock: "1",
  });
  loadProducts();
}

}

async function deleteProduct(id) {
if (!confirm("Yakin ingin menghapus produk ini?")) return;
const { error } = await supabase.from("products").delete().eq("id", id);
setMessage(error ? error.message : "Produk berhasil dihapus.");
if (!error) loadProducts();
}

if (!session) {
return (
<main style={styles.page}>
<form onSubmit={login} style={styles.card}>
<h1>Fikri Store Admin</h1>
<p>Masuk untuk mengelola produk toko.</p>
<input style={styles.input} type="email" placeholder="Email admin"
value={email} onChange={e => setEmail(e.target.value)} required />
<input style={styles.input} type="password" placeholder="Password"
value={password} onChange={e => setPassword(e.target.value)} required />
<button style={styles.button} disabled={loading}>
{loading ? "Memproses..." : "Masuk"}
</button>
{message && <p>{message}</p>}
</form>
</main>
);
}

return (
<main style={styles.page}>
<section style={styles.card}>
<h1>Kelola Produk</h1>
<p>{session.user.email}</p>
<button style={styles.secondary} onClick={() => supabase.auth.signOut()}>
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
<input key={key} style={styles.input}
placeholder={placeholder}
type={key === "price" || key === "stock" ? "number" : "text"}
value={form[key]}
onChange={e => setForm({ ...form, [key]: e.target.value })}
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
    {products.map(product => (
      <article key={product.id} style={styles.product}>
        <div>
          <strong>{product.name}</strong>
          <p>Rp {Number(product.price).toLocaleString("id-ID")}</p>
          <small>Stok: {product.stock}</small>
        </div>
        <button style={styles.danger} onClick={() => deleteProduct(product.id)}>
          Hapus
        </button>
      </article>
    ))}
  </section>
</main>

);
}

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
