// Importaciones principales de React y Firebase
import React, { useState, useEffect } from "react";
// Se importa el componente del tablero principal de tareas (Kanban).
import KanbanBoard from "./components/KanbanBoard";
// Se importa el componente de inicio de sesión desde la ruta CORRECTA.
import Login from "./screens/Login";
// Se importa el componente de registro desde la ruta CORRECTA.
import Register from "./components/Register";
// Se importa la instancia del sistema de autenticación de Firebase.
import { auth } from "./firebase";
// Se importan las funciones de autenticación de Firebase necesarias.
import { onAuthStateChanged, signOut, deleteUser } from "firebase/auth";

// =========================================================
// COMPONENTE: Message
// Este componente reutilizable muestra mensajes modales centrados.
// =========================================================
function Message({ text, onClose, children }) {
  // Se define el estilo del overlay fijo con fondo semitransparente.
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      {/* Se define el estilo del cuadro del mensaje (fondo blanco, sombra). */}
      <div className="bg-white p-6 rounded shadow-md max-w-sm text-center">
        {/* Se muestra el texto principal del mensaje, permitiendo saltos de línea. */}
        {text && <p className="mb-4 whitespace-pre-line">{text}</p>}

        {/* Si se pasan elementos hijos, se renderizan aquí. */}
        {children}

        {/* Si no hay hijos, se muestra un botón "Aceptar" por defecto. */}
        {!children && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={onClose} // La función de cierre se llama al hacer clic.
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
// Controla el flujo de autenticación, renderizado y manejo de sesión.
// =========================================================
function App() {
  // Se almacena el estado global del usuario autenticado (null si no hay sesión activa).
  const [user, setUser] = useState(null);

  // Se usa un estado booleano para alternar entre la pantalla de login (false) y registro (true).
  const [showRegister, setShowRegister] = useState(false);

  // Se almacena el mensaje informativo o de error que se mostrará en el modal.
  const [message, setMessage] = useState("");

  // Se controla la visibilidad del modal de confirmación para eliminar cuenta.
  const [confirmDelete, setConfirmDelete] = useState(false);
  // Se controla la visibilidad del modal de confirmación para cerrar sesión.
  const [confirmLogout, setConfirmLogout] = useState(false);

  // ---------------------------------------------------------
  // Efecto para escuchar cambios en el estado de autenticación de Firebase (al inicio).
  // ---------------------------------------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        if (currentUser.emailVerified) {
          setUser(currentUser); // Usuario verificado
        } else {
          setUser(null); // Usuario no verificado -> bloqueado
        }
      } else {
        setUser(null); // No hay usuario
      }
    });
    return () => unsubscribe();
  }, []);

  // =========================================================
  // MANEJADORES DE SESIÓN (Logout y eliminación de cuenta)
  // =========================================================

  // Inicia el flujo de cierre de sesión al mostrar el modal de confirmación.
  const handleLogout = () => setConfirmLogout(true);

  // Ejecuta el cierre de sesión en Firebase después de la confirmación.
  const confirmLogoutUser = async () => {
    try {
      // Llama a la función signOut de Firebase Auth.
      await signOut(auth);
      setUser(null);
      setConfirmLogout(false);
      setMessage("Has cerrado sesión correctamente.");
    } catch (err) {
      // Muestra un mensaje de error si el cierre de sesión falla.
      setMessage("Error al cerrar sesión: " + err.message);
    }
  };

  // Inicia el flujo de eliminación de cuenta al mostrar el modal.
  const handleDeleteAccount = () => setConfirmDelete(true);

  // Ejecuta la eliminación de la cuenta en Firebase.
  const confirmDeleteAccount = async () => {
    // Solo procede si hay un usuario logueado.
    if (!auth.currentUser) return;
    try {
      // Llama a la función deleteUser de Firebase Auth.
      await deleteUser(auth.currentUser);
      setUser(null);
      setConfirmDelete(false);
      setMessage("Tu cuenta ha sido eliminada correctamente.");
    } catch (err) {
      setConfirmDelete(false);
      setMessage("Error al eliminar la cuenta: " + err.message);
    }
  };

  const handleRegisterSuccess = () => {
    // Muestra mensaje de éxito
    setMessage("✅ Se ha enviado un enlace de verificación a tu correo. Por favor, revisa tu bandeja de entrada antes de iniciar sesión.");
    // Cambia a la vista de Login
    setShowRegister(false);
  };

  // Manejador de éxito de login, llamado desde Login.jsx.
  const handleLoginSuccess = (u) => {
      // Establece el usuario en sesión.
      setUser(u);
  };

  // =========================================================
  // RENDERIZADO PRINCIPAL (Control de flujo de vistas)
  // =========================================================
  return (
    // Contenedor principal de la aplicación.
    <div className="min-h-screen bg-gray-200 p-6 relative">

      {/* Se renderizan los modales de mensaje y confirmación si las banderas están activas. */}
      {message && <Message text={message} onClose={() => setMessage("")} />}
      {confirmDelete && (
        <Message
          text="¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer."
          onClose={() => setConfirmDelete(false)}
        >
          <div className="mt-4 flex justify-center gap-4">
            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={confirmDeleteAccount}>
              Sí, eliminar
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setConfirmDelete(false)}>
              Cancelar
            </button>
          </div>
        </Message>
      )}
      {confirmLogout && (
        <Message
          text="¿Seguro que quieres cerrar sesión?"
          onClose={() => setConfirmLogout(false)}
        >
          <div className="mt-4 flex justify-center gap-4">
            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={confirmLogoutUser}>
              Sí, cerrar sesión
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setConfirmLogout(false)}>
              Cancelar
            </button>
          </div>
        </Message>
      )}

      {/* -----------------------------------------------------
          BLOQUE 1: Usuario NO autenticado (Login/Register)
          ----------------------------------------------------- */}
      {!user ? (
        showRegister ? (
          // Pantalla de registro
          // Se pasa onSwitch para que el componente Register cambie a Login.
          <div className="min-h-screen flex flex-col justify-center items-center p-4">
            <Register
                onRegisterSuccess={handleRegisterSuccess}
                onSwitch={() => setShowRegister(false)} // Función para cambiar a Login.
            />
          </div>
        ) : (
          // Pantalla de inicio de sesión
          // Se pasa onSwitch para que el componente Login cambie a Register.
          <div className="min-h-screen flex flex-col justify-center items-center p-4">
            <Login
                onLoginSuccess={handleLoginSuccess}
                onSwitch={() => setShowRegister(true)} // Función para cambiar a Register.
            />
          </div>
        )
      ) : (
        /* -----------------------------------------------------
           BLOQUE 2: Usuario SÍ autenticado (Tablero)
           ----------------------------------------------------- */
        <>
          {/* Muestra el tablero Kanban principal */}
          <KanbanBoard uid={user.uid} />

          {/* Barra inferior fija con botones de acciones de sesión */}
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleLogout}>
              Cerrar sesión
            </button>
            <button className="bg-gray-700 text-white px-4 py-2 rounded" onClick={handleDeleteAccount}>
              Eliminar cuenta
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Se exporta el componente App para que pueda ser usado en main.jsx.
export default App;