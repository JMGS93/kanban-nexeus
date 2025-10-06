import React, { useState, useEffect } from "react";
import KanbanBoard from "./components/KanbanBoard";
import Login from "./components/Login";
import Register from "./components/Register";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return showRegister ? (
      <div>
        <Register onRegister={setUser} />
        <p className="text-center mt-2">
          ¿Ya tienes cuenta?{" "}
          <button className="text-blue-500" onClick={() => setShowRegister(false)}>
            Iniciar sesión
          </button>
        </p>
      </div>
    ) : (
      <div>
        <Login onLogin={setUser} />
        <p className="text-center mt-2">
          ¿No tienes cuenta?{" "}
          <button className="text-blue-500" onClick={() => setShowRegister(true)}>
            Registrarse
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Kanban Nexeus</h1>
      <KanbanBoard />
    </div>
  );
}

export default App;