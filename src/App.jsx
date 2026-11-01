import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import Home from "./pages/Home";
import Admin from "./pages/Admin";
import ResetPassword from "./pages/ResetPassword";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Fikri Store application error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          role="alert"
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            boxSizing: "border-box",
            padding: 24,
            background: "#f7f8fb",
            color: "#17234d",
            fontFamily: "Arial, sans-serif",
            textAlign: "center",
          }}
        >
          <section style={{ width: "100%", maxWidth: 440 }}>
            <p style={{ color: "#2452e7", fontWeight: 800, letterSpacing: 2, fontSize: 12 }}>
              FIKRI STORE
            </p>
            <h1 style={{ fontSize: 26, margin: "12px 0" }}>
              Terjadi kendala
            </h1>
            <p style={{ color: "#68738a", lineHeight: 1.7 }}>
              Halaman belum dapat ditampilkan dengan baik. Silakan muat ulang
              halaman. Jika kendala berlanjut, hubungi administrator.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                marginTop: 16,
                minHeight: 46,
                padding: "0 22px",
                border: 0,
                borderRadius: 999,
                background: "#2452e7",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Muat ulang halaman
            </button>
            <p style={{ marginTop: 18 }}>
              <a href="/" style={{ color: "#2452e7", fontWeight: 700 }}>
                Kembali ke halaman utama
              </a>
            </p>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const isPasswordRecovery =
    window.location.hash.includes("type=recovery");

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isPasswordRecovery ? <ResetPassword /> : <Home />
            }
          />
          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />
          <Route
            path="/admin"
            element={<Admin />}
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
