import React, { useState, useEffect } from "react";
import KanbanBoard from "./components/KanbanBoard";
import Login from "./components/Login";
import Register from "./components/Register";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut, deleteUser } from "firebase/auth";

// Componente para mostrar mensajes centrados
function Message({ text, onClose, children }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md max-w-sm text-center">
        {text && <p className="mb-4 whitespace-pre-line">{text}</p>} 
        {children}
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

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [message, setMessage] = useState(""); // Mensaje central
  const [confirmDelete, setConfirmDelete] = useState(false); // Confirmación eliminar cuenta
  const [confirmLogout, setConfirmLogout] = useState(false); // Confirmación cerrar sesión

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    setConfirmLogout(true); // mostramos confirmación
  };

  const confirmLogoutUser = async () => {
    await signOut(auth);
    setUser(null);
    setConfirmLogout(false);
    setMessage("Has cerrado sesión correctamente.");
  };

  const handleDeleteAccount = () => {
    setConfirmDelete(true); // mostramos confirmación
  };

  const confirmDeleteAccount = async () => {
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

  const handleRegister = (u) => {
    setMessage("¡Registro exitoso!\nBienvenido a DataFlow Manager");
    setUser(u);
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6 relative">
      {message && <Message text={message} onClose={() => setMessage("")} />}
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

      {!user ? (
        showRegister ? (
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
        <>
          <KanbanBoard />

          {/* Botones fijos abajo y centrados */}
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