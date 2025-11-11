import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import logo from "../assets/nexeus1.png";

export default function Register({ onRegisterSuccess = () => {}, onSwitch = () => {} }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    if (!email || !password) {
      setError("Email y contraseña son obligatorios.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
      });

      onRegisterSuccess(user);
    } catch (err) {
      console.error("Error en registro:", err);
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("El correo ya está registrado.");
          break;
        case "auth/invalid-email":
          setError("Correo electrónico inválido.");
          break;
        case "auth/weak-password":
          setError("La contraseña debe tener al menos 6 caracteres.");
          break;
        default:
          setError(err.message || "Error al registrar usuario.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          overflow-x: hidden;
        }
      `}</style>

      <div style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0"
      }}>
        <div style={{
          width: "380px",
          padding: "2rem",
          borderRadius: "12px",
          backgroundColor: "#fff",
          textAlign: "center",
        }}>
          {/* Logo */}
          <img
            src={logo}
            alt="Nexeus Logo"
            style={{
              width: "400px",
              margin: "0 auto",
              display: "block",
            }}
          />

          <h1 style={{ marginBottom: "1.5rem", fontSize: "1.8rem" }}>Registrar usuario</h1>
          {error && <p style={{ color: "#e63946", fontWeight: 600 }}>{error}</p>}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{ padding: "0.6rem", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{ padding: "0.6rem", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            <input
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              style={{ padding: "0.6rem", borderRadius: "6px", border: "1px solid #ccc" }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.7rem",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#1d3557",
                color: "#fff",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Registrando..." : "Regístrate"}
            </button>
          </form>

          <p style={{ marginTop: "1rem" }}>
            ¿Ya tienes cuenta?{" "}
            <button
              type="button"
              style={{ background: "none", border: "none", color: "#1d3557", fontWeight: "bold", cursor: "pointer" }}
              onClick={onSwitch}
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </>
  );
}