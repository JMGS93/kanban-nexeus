// src/screens/Login.jsx
// -------------------------------------------------------------
// ✅ Este componente maneja el inicio de sesión de los usuarios 
// en el sistema DataFlow Manager utilizando Firebase Authentication.
// Permite ingresar email y contraseña, muestra errores específicos
// y notifica al componente padre cuando el login es exitoso.
// -------------------------------------------------------------

import React, { useState } from "react";
import { auth } from "../firebase"; // configuración Firebase (instancia de autenticación)
import { signInWithEmailAndPassword } from "firebase/auth"; // método de login por email/contraseña
import logo from "../assets/nexeus.png"; // logo de la app

export default function Login({ onLogin = () => {} }) {
  // -----------------------------
  // 🔹 Estados locales
  // -----------------------------
  const [email, setEmail] = useState("");        // almacena el correo ingresado
  const [password, setPassword] = useState("");  // almacena la contraseña ingresada
  const [error, setError] = useState("");        // mensajes de error para el usuario
  const [loading, setLoading] = useState(false); // muestra spinner o desactiva botón mientras procesa

  // --------------------------------------------------
  // 🔹 handleSubmit()
  // Manejador del envío del formulario de login.
  // Realiza la validación, intenta iniciar sesión y 
  // maneja los errores más comunes de Firebase.
  // --------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 🔸 Validación básica antes de intentar login
      if (!email || !password) {
        setError("Email y contraseña son obligatorios.");
        return;
      }

      // 🔹 Autenticación con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // 🔹 Si todo sale bien, se notifica al componente padre
      // (por ejemplo, App.jsx) que el usuario ha iniciado sesión.
      onLogin(userCredential.user);

    } catch (err) {
      console.error("Login error:", err);

      // 🔸 Manejo de errores más comunes devueltos por Firebase
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
          setError("Error al iniciar sesión: " + (err.message || err));
      }
    } finally {
      // 🔸 Restablece el estado de carga independientemente del resultado
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // 🔹 Renderizado del formulario de inicio de sesión
  // --------------------------------------------------
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow flex flex-col items-center">
      {/* Logo del sistema */}
      <img src={logo} alt="Logo DataFlow Manager" className="w-50 h-50 mb-4" />

      <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>

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

        {/* Mensaje de error (si existe) */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Botón de envío */}
        <button
          type="submit"
          style={{ backgroundColor: "#ec729c" }}
          className="text-white p-2 rounded flex items-center justify-center"
          disabled={loading} // evita múltiples envíos
        >
          {/* Spinner de carga (solo visible cuando loading=true) */}
          {loading && <span className="button-spinner" />}

          <span className="ml-2">
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </span>
        </button>
      </form>
    </div>
  );
}
