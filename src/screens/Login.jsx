import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Login({ onLogin = () => {}, onSwitch = () => {} }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

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

      await user.reload();

      if (!user.emailVerified) {
        setError("⚠️ Por favor, verifica tu correo electrónico antes de iniciar sesión.");
        await auth.signOut();
        setLoading(false);
        return;
      }

      const userDoc = await getDoc(doc(db, "sigma", user.uid));
      if (!userDoc.exists()) {
        setError("⚠️ Tu cuenta existe pero no está registrada en la base de datos del proyecto.");
        await auth.signOut();
        setLoading(false);
        return;
      }

      onLogin(user);
    } catch (err) {
      console.error("Login error:", err);
      switch (err.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
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

      // Cerrar modal automáticamente después de 5 segundos
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
          background: linear-gradient(135deg, #a8dadc, #457b9d);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 0;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .login-container {
          background-color: rgba(255, 255, 255, 0.9);
          width: 380px;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0px 8px 25px rgba(0, 0, 0, 0.2);
          text-align: center;
        }
        .login-box h1 {
          font-size: 2rem;
          color: #1d3557;
          margin-bottom: 1.5rem;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          text-align: left;
        }
        label {
          font-weight: 600;
          color: #1d3557;
        }
        input {
          padding: 0.6rem;
          border-radius: 8px;
          border: 1px solid #ccc;
          outline: none;
          font-size: 1rem;
        }
        input:focus {
          border-color: #457b9d;
        }
        button[type="submit"] {
          background-color: #1d3557;
          color: white;
          padding: 0.7rem;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        button[type="submit"]:hover:not(:disabled) {
          background-color: #457b9d;
        }
        button[type="submit"]:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        .error-message {
          color: #e63946;
          margin-bottom: 10px;
          font-weight: 600;
        }
        .login-link {
          margin-top: 1.2rem;
          font-size: 0.95rem;
        }
        .link-button {
          color: #1d3557;
          text-decoration: none;
          font-weight: bold;
          background: none !important;
          border: none;
          padding: 0 !important;
          cursor: pointer;
          display: inline !important;
          box-shadow: none !important;
          transition: none !important;
        }
        .link-button:hover {
          text-decoration: underline;
          background: none !important;
        }
        .button-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.5);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div className="login-container">
        <div className="login-box">
          <h1>Iniciar sesión</h1>
          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />

            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />

            <button type="submit" disabled={loading}>
              {loading && <span className="button-spinner" />}
              <span className="ml-2">{loading ? "Iniciando..." : "Iniciar Sesión"}</span>
            </button>
          </form>

          <p className="login-link">
            ¿Olvidaste tu contraseña?{" "}
            <button type="button" className="link-button" onClick={() => setShowReset(true)}>
              Recuperar
            </button>
          </p>

          <p className="login-link">
            ¿No tienes cuenta?{" "}
            <button type="button" onClick={onSwitch} className="link-button">
              Regístrate
            </button>
          </p>
        </div>
      </div>

      {showReset && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "#fff",
            padding: "2rem",
            borderRadius: "12px",
            width: "350px",
            textAlign: "center",
            position: "relative"
          }}>
            <h2>Recuperar contraseña</h2>

            <input
              type="email"
              placeholder="Ingresa tu correo"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              disabled={resetLoading}
              style={{
                width: "100%",
                padding: "0.6rem",
                margin: "1rem 0",
                borderRadius: "8px",
                border: "1px solid #ccc"
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
                backgroundColor: "#1d3557",
                color: "#fff",
                padding: "0.7rem",
                borderRadius: "8px",
                width: "100%",
                fontWeight: "bold",
                cursor: "pointer",
                marginBottom: "0.5rem"
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
