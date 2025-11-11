import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

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
      // 🔹 Crear el usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔹 Guardar en Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
      });

      // 🔹 Iniciar sesión automáticamente
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-xl font-bold mb-4 text-center">Registrar usuario</h1>
        {error && <p className="text-red-600 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
            className="border p-2 rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700 transition"
          >
            {loading ? "Registrando..." : "Regístrate"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          ¿Ya tienes cuenta?{" "}
          <button
            type="button"
            className="text-blue-600 font-bold hover:underline"
            onClick={onSwitch}
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
}