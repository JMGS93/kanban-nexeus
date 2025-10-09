// src/screens/Register.jsx
// -------------------------------------------------------------
// ✅ Este componente gestiona el registro de nuevos usuarios
// en el sistema DataFlow Manager utilizando Firebase Authentication.
// Permite crear una cuenta con email y contraseña, muestra mensajes
// de error o éxito, y notifica al componente padre cuando el registro
// se completa correctamente.
// -------------------------------------------------------------

import React, { useState } from "react";
import { auth } from "../firebase"; // instancia de autenticación configurada
import { createUserWithEmailAndPassword } from "firebase/auth"; // método de Firebase para registrar usuarios
import logo from "../assets/nexeus.png"; // logo de la app

export default function Register({ onRegister = () => {} }) {
  // -----------------------------
  // 🔹 Estados locales
  // -----------------------------
  const [email, setEmail] = useState("");        // almacena el correo ingresado
  const [password, setPassword] = useState("");  // almacena la contraseña ingresada
  const [error, setError] = useState("");        // guarda mensajes de error
  const [loading, setLoading] = useState(false); // controla el estado de carga
  const [message, setMessage] = useState("");    // mensaje de éxito tras registro

  // --------------------------------------------------
  // 🔹 handleSubmit()
  // Manejador del envío del formulario de registro.
  // Realiza validaciones, intenta registrar el usuario
  // y maneja los errores más comunes devueltos por Firebase.
  // --------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      // 🔸 Validación simple
      if (!email || !password) {
        setError("Email y contraseña son obligatorios.");
        return;
      }

      // 🔹 Llamada a Firebase para crear usuario
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // 🔹 Si el registro fue exitoso
      setMessage("¡Registro exitoso! Bienvenido a DataFlow Manager.");
      onRegister(userCredential.user);

    } catch (err) {
      console.error("Error en registro:", err);

      // 🔸 Manejo de errores más frecuentes
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
      // 🔹 Restablece estado de carga
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // 🔹 Renderizado del formulario de registro
  // --------------------------------------------------
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow flex flex-col items-center">
      {/* Logo de la app */}
      <img src={logo} alt="Logo DataFlow Manager" className="w-50 h-50 mb-4" />

      <h2 className="text-2xl font-bold mb-4">Registrar usuario</h2>

      {/* Mensajes de éxito o error */}
      {message && <p className="text-green-500 mb-2">{message}</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      {/* Formulario controlado */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">

        {/* Campo de correo */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded"
          required
        />

        {/* Campo de contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
          required
        />

        {/* Botón de registro */}
        <button
          type="submit"
          style={{ backgroundColor: "#ec729c" }}
          className="text-white p-2 rounded flex items-center justify-center"
          disabled={loading}
        >
          {/* Spinner cuando loading = true */}
          {loading && <span className="button-spinner" />}
          <span className="ml-2">
            {loading ? "Registrando..." : "Regístrate"}
          </span>
        </button>
      </form>
    </div>
  );
}