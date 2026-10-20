
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error("Fikri Store error:", error);
  }

  render() {
    if (this.state.error) {
      return (
        <main style={{
          minHeight: "100vh",
          padding: 24,
          background: "#08090D",
          color: "white",
          fontFamily: "Arial, sans-serif",
          overflowWrap: "anywhere"
        }}>
          <h1 style={{ color: "#d4ff00" }}>
            Fikri Store Error
          </h1>
          <p>Penyebab error:</p>
          <pre style={{
            whiteSpace: "pre-wrap",
            background: "#202127",
            padding: 16,
            borderRadius: 8
          }}>
            {String(this.state.error?.message || this.state.error)}
          </pre>
        </main>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
