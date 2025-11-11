// Importaciones principales de React y Firebase
import React, { useState, useEffect } from "react";
import KanbanBoard from "./components/KanbanBoard";
import Login from "./screens/Login";
import Register from "./components/Register";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut, deleteUser } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { LogOut, Trash2, Plus, RefreshCcw } from "lucide-react";

// =========================================================
// COMPONENTE: Message (modal reutilizable)
// =========================================================
function Message({ text, onClose, children }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 shadow-md max-w-sm text-center rounded"
        onClick={(e) => e.stopPropagation()}
      >
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

// =========================================================
// COMPONENTE PRINCIPAL: App
// =========================================================
function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  // Estados para proyectos
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);

  // Estados para modales de proyecto
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  // =========================================================
  // Cargar usuario y proyectos
  // =========================================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await loadProjects(currentUser.uid);
      } else {
        setUser(null);
        setProjects([]);
        setActiveProject(null);
      }
    });
    return () => unsubscribe();
  }, []);
  // ---------------------------------------------------------
  // Firestore: cargar proyectos del usuario
  // ---------------------------------------------------------
  const loadProjects = async (uid) => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "users", uid, "projects")
      );
      const loadedProjects = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      setProjects(loadedProjects);

      // 🔹 Intentar recuperar el proyecto activo guardado
      const savedProjectId = localStorage.getItem("activeProjectId");
      const active = loadedProjects.find(p => p.id === savedProjectId) || loadedProjects[0];

      if (active) setActiveProject(active);

    } catch (err) {
      console.error("Error al cargar proyectos:", err);
    }
  };

  // ---------------------------------------------------------
  // Crear un nuevo proyecto
  // ---------------------------------------------------------
  const createProject = async () => {
    if (!newProjectName || !user) return;
    try {
      const docRef = await addDoc(collection(db, "users", user.uid, "projects"), {
        name: newProjectName,
        tasks: [],
      });
      const newProj = { id: docRef.id, name: newProjectName, tasks: [] };
      setProjects((prev) => [...prev, newProj]);
      setActiveProject(newProj);
      setNewProjectName("");
      setShowCreateModal(false);
    } catch (err) {
      console.error("Error al crear proyecto:", err);
      setMessage("Error al crear el proyecto: " + err.message);
    }
  };

  // ---------------------------------------------------------
  // Cambiar proyecto activo
  // ---------------------------------------------------------
  const changeProject = (proj) => {
    setActiveProject(proj);
    localStorage.setItem("activeProjectId", proj.id); // Guardar en localStorage
    setShowChangeModal(false);
  };

  // ---------------------------------------------------------
  // Actualizar tareas en Firestore
  // ---------------------------------------------------------
  const updateProjectTasks = async (projectId, newTasks) => {
    if (!user || !projectId) return;
    const projectRef = doc(db, "users", user.uid, "projects", projectId);
    await updateDoc(projectRef, { tasks: newTasks });
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, tasks: newTasks } : p))
    );
    setActiveProject((prev) => ({ ...prev, tasks: newTasks }));
  };

  // ---------------------------------------------------------
  // Funciones de sesión
  // ---------------------------------------------------------
  const handleLogout = () => setConfirmLogout(true);
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

  const handleDeleteAccount = () => setConfirmDelete(true);
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

  const handleRegisterSuccess = (user) => {
    // Cierra el registro
    setShowRegister(false);

    // Inicia sesión directamente con el usuario recién creado
    setUser(user);

    // Opcional: mostrar un mensaje de bienvenida
    setMessage("✅ Registro completado correctamente. ¡Bienvenido!\n\nPara empezar, crea un proyecto nuevo.");
  };

  const handleLoginSuccess = (u) => {
    setUser(u);
  };

  // =========================================================
  // Renderizado principal
  // =========================================================
  return (
    <div className="min-h-screen bg-gray-200 p-6 relative">
      {/* 🔹 Modales y mensajes */}
      {message && <Message text={message} onClose={() => setMessage("")} />}

      {/* 🔹 Confirmaciones */}
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

      {/* 🔹 Modales de proyectos */}
      {showCreateModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-md w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4 text-center">
              Crear Proyecto
            </h2>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Nombre del proyecto"
              className="border p-2 rounded w-full mb-4"
            />
            <div className="flex justify-center gap-4">
              <button
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded"
                onClick={() => setShowCreateModal(false)}
              >
                Cancelar
              </button>
              <button
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={createProject}
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {showChangeModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={() => setShowChangeModal(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-md w-80 max-h-64 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4 text-center">
              Cambiar Proyecto
            </h2>
            {projects.length === 0 && <p>No hay proyectos disponibles</p>}
            {projects.map((proj) => (
              <button
                key={proj.id}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded w-full mb-2 text-left"
                onClick={() => changeProject(proj)}
              >
                {proj.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 🔹 Pantallas autenticadas / no autenticadas */}
      {!user ? (
        showRegister ? (
          <Register
            onRegisterSuccess={handleRegisterSuccess}
            onSwitch={() => setShowRegister(false)}
          />
        ) : (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onSwitch={() => setShowRegister(true)}
          />
        )
      ) : (
        <>
          {/* Menú lateral con proyecto activo */}
          <div className="absolute bottom-4 left-4 z-50 w-60">
            <div className="mb-2 p-2 bg-white border border-gray-300 shadow-md text-center">
              <h3 className="text-sm text-gray-500">Proyecto activo:</h3>
              <h2 className="text-lg font-semibold text-gray-900">
                {activeProject ? activeProject.name : "Ninguno"}
              </h2>
            </div>

            <div className="bg-white border border-gray-300 shadow-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 text-center border-b border-gray-300 pb-2">
                Acciones
              </h2>
              <div className="flex flex-col gap-3">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-md flex items-center justify-center gap-2"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus size={18} /> Crear proyecto
                </button>

                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow-md flex items-center justify-center gap-2"
                  onClick={() => setShowChangeModal(true)}
                  disabled={projects.length === 0}
                >
                  <RefreshCcw size={18} /> Cambiar proyecto
                </button>

                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow-md flex items-center justify-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut size={18} /> Cerrar sesión
                </button>

                <button
                  className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded shadow-md flex items-center justify-center gap-2"
                  onClick={handleDeleteAccount}
                >
                  <Trash2 size={18} /> Eliminar cuenta
                </button>
              </div>
            </div>
          </div>

          {/* 🔹 Tablero Kanban vinculado al proyecto activo */}
          <KanbanBoard
            uid={user.uid}
            activeProject={activeProject}  
            updateTasks={updateProjectTasks}
          />
        </>
      )}
    </div>
  );
}

export default App;