
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("Memeriksa sesi reset...");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      if (!supabase) {
        setMessage("Konfigurasi Supabase belum tersedia.");
        return;
      }

      try {
        const { data, error } = await supabase.auth.getSession();

        if (!active) return;

        if (error) {
          setMessage("Sesi reset tidak valid. Minta tautan reset baru.");
        } else if (data.session) {
          setReady(true);
          setMessage("");
        } else {
          setMessage(
            "Sesi reset tidak ditemukan. Buka halaman melalui tautan reset terbaru dari email."
          );
        }
      } catch (error) {
        if (active) {
          setMessage("Gagal memeriksa sesi: " + error.message);
        }
      }
    }

    checkSession();

    if (!supabase) {
      return () => {
        active = false;
      };
    }

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (active && session) {
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

    if (!supabase) {
      setMessage("Konfigurasi Supabase belum tersedia.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password minimal 8 karakter.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setMessage("Gagal mengubah password: " + error.message);
      } else {
        setPassword("");
        setReady(false);
        setMessage(
          "Password berhasil diubah. Silakan login kembali melalui halaman admin."
        );
      }
    } catch (error) {
      setMessage("Terjadi kesalahan: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        display: "grid",
        placeItems: "center",
        background: "#08090D",
        color: "white",
        padding: 24,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 420,
          padding: 24,
          boxSizing: "border-box",
          background: "#17181f",
          border: "1px solid #343640",
          borderRadius: 12,
        }}
      >
        <h1 style={{ color: "#d4ff00", marginTop: 0 }}>
          Reset Password
        </h1>

        <p>Masukkan password baru untuk akun admin.</p>

        {ready && (
          <form
            onSubmit={handleSubmit}
            style={{ display: "grid", gap: 14 }}
          >
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
              style={{
                boxSizing: "border-box",
                width: "100%",
                padding: 12,
                borderRadius: 6,
              }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: 12,
                border: 0,
                borderRadius: 6,
                background: "#d4ff00",
                color: "#111",
                fontWeight: "bold",
              }}
            >
              {loading ? "Menyimpan..." : "Simpan Password Baru"}
            </button>
          </form>
        )}

        {message && (
          <p role="status" style={{ overflowWrap: "anywhere" }}>
            {message}
          </p>
        )}

        <a href="/admin" style={{ color: "#d4ff00" }}>
          Kembali ke login admin
        </a>
      </section>
    </main>
  );
}
