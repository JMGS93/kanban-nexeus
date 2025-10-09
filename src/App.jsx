// Importaciones principales de React y Firebase
import React, { useState, useEffect } from "react";
import KanbanBoard from "./components/KanbanBoard"; // Tablero principal de tareas (Kanban)
import Login from "./components/Login"; // Componente de inicio de sesión
import Register from "./components/Register"; // Componente de registro
import { auth } from "./firebase"; // Instancia del sistema de autenticación de Firebase
import { onAuthStateChanged, signOut, deleteUser } from "firebase/auth"; // Funciones de autenticación

// =========================================================
// COMPONENTE: Message
// ---------------------------------------------------------
// Este componente reutilizable muestra mensajes modales centrados
// en pantalla, como confirmaciones, errores o notificaciones.
// Acepta texto, función de cierre y elementos hijos opcionales.
// Si se pasan "children", estos reemplazan el botón estándar.
// =========================================================
function Message({ text, onClose, children }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md max-w-sm text-center">
        {/* Texto principal del mensaje */}
        {text && <p className="mb-4 whitespace-pre-line">{text}</p>}

        {/* Si se pasan elementos hijos (botones personalizados, etc.) */}
        {children}

        {/* Si no hay hijos, se muestra un botón "Aceptar" por defecto */}
        {!children && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Aceptar
          </button>
        )}
      </div>
    </div>
  );
}

// =========================================================
// COMPONENTE PRINCIPAL: App
// ---------------------------------------------------------
// Controla todo el flujo de autenticación, renderizado condicional
// de pantallas (Login, Register, Kanban) y manejo de sesión con Firebase.
// =========================================================
function App() {
  // Estado global del usuario autenticado (null si no hay sesión activa)
  const [user, setUser] = useState(null);

  // Estado para alternar entre pantalla de login y registro
  const [showRegister, setShowRegister] = useState(false);

  // Mensaje informativo o de error mostrado en modal
  const [message, setMessage] = useState("");

  // Estados booleanos para mostrar los modales de confirmación
  const [confirmDelete, setConfirmDelete] = useState(false); // Para eliminar cuenta
  const [confirmLogout, setConfirmLogout] = useState(false); // Para cerrar sesión

  // ---------------------------------------------------------
  // Efecto para mantener la sesión del usuario al recargar la página.
  // onAuthStateChanged se ejecuta automáticamente cada vez que cambia
  // el estado de autenticación (login, logout, eliminación de cuenta, etc.)
  // ---------------------------------------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null); // Si hay usuario, lo guarda; si no, lo limpia
    });
    // Se devuelve la función para cancelar la suscripción al desmontar
    return () => unsubscribe();
  }, []);

  // =========================================================
  // MANEJADORES DE SESIÓN
  // =========================================================

  // Solicita confirmación antes de cerrar sesión
  const handleLogout = () => setConfirmLogout(true);

  // Confirma y ejecuta el cierre de sesión
  const confirmLogoutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setConfirmLogout(false);
      setMessage("Has cerrado sesión correctamente.");
    } catch (err) {
      setMessage("Error al cerrar sesión: " + err.message);
    }
  };

  // Solicita confirmación antes de eliminar cuenta
  const handleDeleteAccount = () => setConfirmDelete(true);

  // Confirma y ejecuta la eliminación de cuenta
  const confirmDeleteAccount = async () => {
    if (!auth.currentUser) return;
    try {
      await deleteUser(auth.currentUser);
      setUser(null);
      setConfirmDelete(false);
      setMessage("Tu cuenta ha sido eliminada correctamente.");
    } catch (err) {
      setConfirmDelete(false);
      setMessage("Error al eliminar la cuenta: " + err.message);
    }
  };

  // Al registrar un usuario con éxito, lo establece en sesión
  const handleRegister = (u) => {
    setMessage("¡Registro exitoso!\nBienvenido a DataFlow Manager");
    setUser(u);
  };

  // =========================================================
  // RENDERIZADO PRINCIPAL
  // ---------------------------------------------------------
  // Muestra una pantalla u otra según el estado del usuario y las banderas.
  // =========================================================
  return (
    <div className="min-h-screen bg-gray-200 p-6 relative">

      {/* Modal para mostrar mensajes (éxito, error, información, etc.) */}
      {message && <Message text={message} onClose={() => setMessage("")} />}

      {/* Modal de confirmación para eliminar cuenta */}
      {confirmDelete && (
        <Message
          text="¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer."
          onClose={() => setConfirmDelete(false)}
        >
          <div className="mt-4 flex justify-center gap-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={confirmDeleteAccount}
            >
              Sí, eliminar
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setConfirmDelete(false)}
            >
              Cancelar
            </button>
          </div>
        </Message>
      )}

      {/* Modal de confirmación para cerrar sesión */}
      {confirmLogout && (
        <Message
          text="¿Seguro que quieres cerrar sesión?"
          onClose={() => setConfirmLogout(false)}
        >
          <div className="mt-4 flex justify-center gap-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={confirmLogoutUser}
            >
              Sí, cerrar sesión
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setConfirmLogout(false)}
            >
              Cancelar
            </button>
          </div>
        </Message>
      )}

      {/* -----------------------------------------------------
         BLOQUE 1: Usuario no autenticado
         ----------------------------------------------------- */}
      {!user ? (
        showRegister ? (
          // Pantalla de registro
          <div className="min-h-screen flex flex-col justify-center items-center bg-gray-200 p-4">
            <Register onRegister={handleRegister} />
            <p className="text-center mt-2">
              ¿Ya tienes cuenta?{" "}
              <button
                className="text-blue-500"
                onClick={() => setShowRegister(false)}
              >
                Iniciar sesión
              </button>
            </p>
          </div>
        ) : (
          // Pantalla de inicio de sesión
          <div className="min-h-screen flex flex-col justify-center items-center bg-gray-200 p-4">
            <Login onLogin={setUser} />
            <p className="text-center mt-2">
              ¿No tienes cuenta?{" "}
              <button
                className="text-blue-500"
                onClick={() => setShowRegister(true)}
              >
                Registrarse
              </button>
            </p>
          </div>
        )
      ) : (
        /* -----------------------------------------------------
           BLOQUE 2: Usuario autenticado
           ----------------------------------------------------- */
        <>
          {/* Muestra el tablero Kanban principal */}
          <KanbanBoard />

          {/* Barra inferior con botones de acciones de sesión */}
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
            <button
              className="bg-gray-700 text-white px-4 py-2 rounded"
              onClick={handleDeleteAccount}
            >
              Eliminar cuenta
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;