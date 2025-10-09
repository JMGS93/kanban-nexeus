import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import logo from "../assets/nexeus.png";

export default function Register({ onRegister = () => {} }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (!email || !password) {
        setError("Email y contraseña son obligatorios.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setMessage("¡Registro exitoso! Bienvenido a DataFlow Manager.");
      onRegister(userCredential.user);
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
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow flex flex-col items-center">
      <img src={logo} alt="Logo DataFlow Manager" className="w-50 h-50 mb-4" />
      <h2 className="text-2xl font-bold mb-4">Registrar usuario</h2>

      {message && <p className="text-green-500 mb-2">{message}</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <button
          type="submit"
          style={{ backgroundColor: "#ec729c" }}
          className="text-white p-2 rounded flex items-center justify-center"
          disabled={loading}
        >
          {loading && <span className="button-spinner" />}
          <span className="ml-2">{loading ? "Registrando..." : "Regístrate"}</span>
        </button>
      </form>
    </div>
  );
}