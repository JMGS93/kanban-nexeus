import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

export default function Login({ onLogin = () => {}, onSwitch = () => {} }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // Iniciar sesión
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Email y contraseña son obligatorios.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔹 Login automático sin verificar correo
      onLogin(user);

    } catch (err) {
      console.error("Login error:", err);
      switch (err.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
          setError("Correo electrónico o contraseña incorrectos.");
          break;
        case "auth/invalid-email":
          setError("Correo electrónico inválido.");
          break;
        default:
          setError(err.message || "Error al iniciar sesión.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Recuperar contraseña
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetMessage("");

    try {
      if (!resetEmail) {
        setResetMessage("Por favor ingresa tu correo.");
        setResetLoading(false);
        return;
      }

      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage("✅ Se ha enviado un correo para restablecer tu contraseña.");

      setTimeout(() => {
        setShowReset(false);
        setResetEmail("");
        setResetMessage("");
      }, 3000);

    } catch (err) {
      console.error("Reset error:", err);
      switch (err.code) {
        case "auth/user-not-found":
          setResetMessage("⚠️ No existe un usuario con ese correo.");
          break;
        case "auth/invalid-email":
          setResetMessage("Correo inválido.");
          break;
        default:
          setResetMessage(err.message || "Error al enviar correo de recuperación.");
      }
    } finally {
      setResetLoading(false);
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
      }}>
        <div style={{
          width: "380px",
          padding: "2rem",
          borderRadius: "12px",
          backgroundColor: "#fff",
          textAlign: "center",
        }}>
          <h1 style={{ marginBottom: "1.5rem", fontSize: "1.8rem" }}>Iniciar sesión</h1>
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
            <button type="submit" disabled={loading} style={{
              padding: "0.7rem",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#1d3557",
              color: "#fff",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer"
            }}>
              {loading ? "Iniciando..." : "Iniciar Sesión"}
            </button>
          </form>

          <p style={{ marginTop: "1rem" }}>
            ¿Olvidaste tu contraseña?{" "}
            <button type="button" style={{ background: "none", border: "none", color: "#1d3557", fontWeight: "bold", cursor: "pointer" }} onClick={() => setShowReset(true)}>
              Recuperar
            </button>
          </p>

          <p style={{ marginTop: "0.5rem" }}>
            ¿No tienes cuenta?{" "}
            <button type="button" style={{ background: "none", border: "none", color: "#1d3557", fontWeight: "bold", cursor: "pointer" }} onClick={onSwitch}>
              Regístrate
            </button>
          </p>
        </div>
      </div>

      {showReset && (
        <div
          onClick={() => setShowReset(false)} // clic en el fondo cierra el modal
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()} // evita que el clic dentro del modal lo cierre
            style={{
              width: "350px",
              backgroundColor: "#fff",
              padding: "2rem",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h2 style={{ marginBottom: "1rem" }}>Recuperar contraseña</h2>
            <input
              type="email"
              placeholder="Ingresa tu correo"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              disabled={resetLoading}
              style={{
                width: "100%",
                padding: "0.6rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
                marginBottom: "1rem",
              }}
            />
            {resetMessage && (
              <p style={{ color: resetMessage.includes("✅") ? "green" : "red", marginBottom: "1rem" }}>
                {resetMessage}
              </p>
            )}
            <button
              onClick={handlePasswordReset}
              disabled={resetLoading}
              style={{
                width: "100%",
                padding: "0.7rem",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#1d3557",
                color: "#fff",
                fontWeight: "bold",
                cursor: resetLoading ? "not-allowed" : "pointer",
              }}
            >
              {resetLoading ? "Enviando..." : "Enviar correo"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}