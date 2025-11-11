import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Register({ onRegister = () => {}, onSwitch = () => {} }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

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

      await setDoc(doc(db, "sigma", user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
      });

      await sendEmailVerification(user, {
        url: "https://kanban-nexeus.web.app/login",
        handleCodeInApp: true,
      });

      await auth.signOut();

      setMessage("✅ Se ha enviado un enlace de verificación a tu correo. Por favor, revisa tu bandeja de entrada antes de iniciar sesión.");
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
    <div style={{
      width: "100%",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: 0,
      padding: 0,
      overflowX: "hidden",
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div style={{
        width: "380px",
        padding: "2rem",
        borderRadius: "12px",
        backgroundColor: "#fff",
        textAlign: "center"
      }}>
        <h1 style={{ marginBottom: "1.5rem", fontSize: "1.8rem" }}>Registrar usuario</h1>

        {message && <p style={{ color: "#2a9d8f", fontWeight: "600" }}>{message}</p>}
        {error && <p style={{ color: "#e63946", fontWeight: "600" }}>{error}</p>}

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
          <button type="submit" disabled={loading} style={{
            padding: "0.7rem",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#1d3557",
            color: "#fff",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer"
          }}>
            {loading ? "Registrando..." : "Regístrate"}
          </button>
        </form>

        <p style={{ marginTop: "1rem" }}>
          ¿Ya tienes cuenta?{" "}
          <button type="button" style={{ background: "none", border: "none", color: "#1d3557", fontWeight: "bold", cursor: "pointer" }} onClick={onSwitch}>
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
}