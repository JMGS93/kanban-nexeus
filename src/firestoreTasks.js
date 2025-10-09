// =========================================================
// Módulo de operaciones con Firestore
// ---------------------------------------------------------
// Este archivo centraliza las funciones CRUD (Crear, Leer,
// Actualizar, Borrar) para la colección "tasks" en Firestore.
// =========================================================

import { db } from "./firebase"; 
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

// =========================================================
// Obtener todas las tareas
// ---------------------------------------------------------
// Devuelve un array de objetos con la información de cada
// tarea en la colección "tasks", incluyendo su ID.
// =========================================================
export async function getAllTasks() {
  const querySnapshot = await getDocs(collection(db, "tasks"));
  return querySnapshot.docs.map(docSnap => ({
    id: docSnap.id,    // ID del documento en Firestore
    ...docSnap.data()   // Resto de datos de la tarea
  }));
}

// =========================================================
// Guardar una nueva tarea
// ---------------------------------------------------------
// Recibe un objeto 'task' con los campos de la tarea y lo
// añade a la colección "tasks".
// Retorna el objeto guardado incluyendo el ID generado.
// =========================================================
export async function saveTask(task) {
  const docRef = await addDoc(collection(db, "tasks"), task);
  return { id: docRef.id, ...task }; // 🔹 importante devolver id
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