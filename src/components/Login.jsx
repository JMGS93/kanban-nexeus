import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

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
      // Mapeamos los errores de Firebase a mensajes amigables
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
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
          className="bg-blue-500 text-white p-2 rounded flex justify-center items-center gap-2"
          disabled={loading}
        >
          {loading && <span className="loader"></span>}
          <span>{loading ? "Cargando..." : "Entrar"}</span>
        </button>
      </form>
    </div>
  );
}