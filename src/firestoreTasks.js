// =========================================================
// Módulo de operaciones con Firestore (multi-proyecto)
// ---------------------------------------------------------
// Este archivo centraliza las funciones CRUD (Crear, Leer,
// Actualizar, Borrar) para la colección "tasks" en Firestore.
// Ahora cada tarea pertenece a un proyecto (projectId).
// =========================================================

import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

// =========================================================
// Obtener todas las tareas de un proyecto
// ---------------------------------------------------------
// Devuelve un array con las tareas que pertenecen al
// 'projectId' indicado. Si no se pasa, retorna vacío.
// =========================================================
export async function getAllTasks(projectId) {
  if (!projectId) return [];

  const q = query(collection(db, "tasks"), where("projectId", "==", projectId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((docSnap) => ({
    id: docSnap.id, // ID del documento en Firestore
    ...docSnap.data(),
  }));
}

// =========================================================
// Guardar una nueva tarea (asociada al proyecto activo)
// ---------------------------------------------------------
// Recibe un objeto 'task' con todos los campos, incluyendo
// el 'projectId' que indica a qué proyecto pertenece.
// =========================================================
export async function saveTask(task) {
  if (!task.projectId) {
    throw new Error("No se puede guardar una tarea sin projectId.");
  }

  const docRef = await addDoc(collection(db, "tasks"), task);
  return { id: docRef.id, ...task };
}

// =========================================================
// Actualizar una tarea existente
// ---------------------------------------------------------
// Recibe el ID de la tarea y un objeto 'updates' con los
// campos que deben ser modificados.
// =========================================================
export async function updateTask(taskId, updates) {
  const docRef = doc(db, "tasks", taskId);
  await updateDoc(docRef, updates);
}

// =========================================================
// Eliminar una tarea
// ---------------------------------------------------------
// Recibe el ID de la tarea a eliminar y la borra de la
// colección "tasks".
// =========================================================
export async function removeTask(taskId) {
  const docRef = doc(db, "tasks", taskId);
  await deleteDoc(docRef);
}