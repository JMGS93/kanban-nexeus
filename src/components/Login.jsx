import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import logo from "../assets/nexeus.png"; // importamos el logo

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLogin(userCredential.user);
    } catch (err) {
      switch (err.code) {
        case "auth/user-not-found":
          setError("No existe una cuenta con este correo.");
          break;
        case "auth/wrong-password":
          setError("Contraseña incorrecta. Intenta de nuevo.");
          break;
        case "auth/invalid-email":
          setError("Correo electrónico inválido.");
          break;
        case "auth/invalid-credential":
          setError("Las credenciales ingresadas no son válidas. Verifica tu correo y contraseña.");
          break;
        default:
          setError("Error al iniciar sesión: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow flex flex-col items-center">
      {/* Logo arriba */}
      <img src={logo} alt="Logo DataFlow Manager" className="w-50 h-50 mb-4" />

      <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>

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
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          style={{ backgroundColor: "#ec729c" }}
          className="text-white p-2 rounded flex items-center justify-center"
          disabled={loading}
        >
          {loading && <span className="button-spinner"></span>}
          <span className="ml-2">{loading ? "Registrando..." : "Iniciar Sesión"}</span>
        </button>
      </form>
    </div>
  );
}