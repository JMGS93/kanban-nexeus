// =========================================================
// Módulo de operaciones con Firestore para proyectos
// =========================================================

import { db } from "./firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

// =========================================================
// Obtener todos los proyectos de un usuario
// ---------------------------------------------------------
export async function getUserProjects(uid) {
  const q = query(collection(db, "projects"), where("owner", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  }));
}

// =========================================================
// Crear un nuevo proyecto
// ---------------------------------------------------------
export async function createProject(uid, name) {
  const project = {
    owner: uid,
    name,
    tasks: [],
    createdAt: new Date()
  };
  const docRef = await addDoc(collection(db, "projects"), project);
  return { id: docRef.id, ...project };
}

// =========================================================
// Actualizar un proyecto existente
// ---------------------------------------------------------
export async function updateProject(projectId, updates) {
  const docRef = doc(db, "projects", projectId);
  await updateDoc(docRef, updates);
}

// =========================================================
// Eliminar un proyecto
// ---------------------------------------------------------
export async function deleteProject(projectId) {
  const docRef = doc(db, "projects", projectId);
  await deleteDoc(docRef);
}