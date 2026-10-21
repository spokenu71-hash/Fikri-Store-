
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(
    "Memeriksa tautan reset password..."
  );
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      if (!supabase) {
        if (active) {
          setMessage("Konfigurasi Supabase belum tersedia.");
        }
        return;
      }

      try {
        // Tunggu inisialisasi Supabase dan pemrosesan URL.
        let { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        // Jika belum ada sesi, coba proses callback PKCE.
        if (!data.session) {
          const url = new URL(window.location.href);
          const code = url.searchParams.get("code");

          if (code) {
            const result =
              await supabase.auth.exchangeCodeForSession(code);

            if (result.error) throw result.error;
            data = result.data;
          }
        }

        // Mendukung tautan yang membawa access dan refresh token.
        if (!data.session) {
          const hash = new URLSearchParams(
            window.location.hash.replace(/^#/, "")
          );

          const accessToken = hash.get("access_token");
          const refreshToken = hash.get("refresh_token");
          const recoveryType = hash.get("type") === "recovery";

          if (accessToken && refreshToken) {
            const result = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (result.error) throw result.error;
            data = result.data;
          } else if (recoveryType) {
            throw new Error(
              "Token pemulihan tidak lengkap. Minta tautan reset baru."
            );
          }
        }

        if (!active) return;

        if (data.session) {
          setReady(true);
          setMessage("");
        } else {
          setMessage(
            "Sesi reset tidak ditemukan. Buka tautan reset terbaru dari email. Jika tautan sudah pernah digunakan atau kedaluwarsa, minta tautan baru."
          );
        }
      } catch (error) {
        if (active) {
          setMessage(
            "Tautan reset gagal diproses: " +
              (error.message || "Terjadi kesalahan.")
          );
        }
      }
    }

    checkSession();

    const { data: listener } = supabase
      ? supabase.auth.onAuthStateChange((event, session) => {
          if (!active) return;

          if (
            session &&
            (event === "PASSWORD_RECOVERY" ||
              event === "SIGNED_IN" ||
              event === "TOKEN_REFRESHED")
          ) {
            setReady(true);
            setMessage("");
          }
        })
      : { data: { subscription: { unsubscribe() {} } } };

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
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      setPassword("");
      setReady(false);
      setMessage(
        "Password berhasil diubah. Silakan kembali ke halaman admin dan login menggunakan password baru."
      );
    } catch (error) {
      setMessage(
        "Gagal mengubah password: " +
          (error.message || "Terjadi kesalahan.")
      );
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
            <label htmlFor="new-password">
              Password baru
            </label>

            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
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
                cursor: loading ? "wait" : "pointer",
              }}
            >
              {loading
                ? "Menyimpan..."
                : "Simpan Password Baru"}
            </button>
          </form>
        )}

        {message && (
          <p
            role="status"
            style={{ overflowWrap: "anywhere" }}
          >
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
