
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("Memeriksa tautan reset...");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setMessage("Konfigurasi Supabase belum tersedia.");
      return;
    }

    let active = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;

      if (error) {
        setMessage("Tautan reset tidak valid atau sudah kedaluwarsa.");
      } else if (data.session) {
        setReady(true);
        setMessage("");
      } else {
        setMessage(
          "Sesi reset tidak ditemukan. Minta email reset password baru."
        );
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!active) return;

        if (session) {
          setReady(true);
          setMessage("");
        }
      }
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    if (password.length < 8) {
      setMessage("Password minimal 8 karakter.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setMessage("Gagal mengubah password: " + error.message);
      return;
    }

    setPassword("");
    setMessage("Password berhasil diubah. Silakan login ke halaman admin.");
  }

  return (
    <main style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background: "#08090D",
      color: "white",
      padding: 24,
      fontFamily: "Arial, sans-serif"
    }}>
      <form onSubmit={handleSubmit} style={{
        width: "100%",
        maxWidth: 380,
        display: "grid",
        gap: 16
      }}>
        <h1>Reset Password</h1>

        {ready && (
          <>
            <label htmlFor="new-password">Password baru</label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimal 8 karakter"
              style={{ padding: 12, borderRadius: 6 }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{ padding: 12, cursor: "pointer" }}
            >
              {loading ? "Menyimpan..." : "Simpan Password Baru"}
            </button>
          </>
        )}

        {message && <p>{message}</p>}

        <a href="/admin" style={{ color: "#d4ff00" }}>
          Kembali ke login admin
        </a>
      </form>
    </main>
  );
}
