import { db } from "./firebase"; // usa la instancia ya inicializada
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

export async function getAllTasks() {
  const querySnapshot = await getDocs(collection(db, "tasks"));
  return querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
}

// 🔹 Guardar una tarea nueva
export async function saveTask(task) {
  const docRef = await addDoc(collection(db, "tasks"), task);
  return { id: docRef.id, ...task }; // 🔹 importante devolver id
}

// 🔹 Actualizar una tarea existente
export async function updateTask(taskId, updates) {
  const docRef = doc(db, "tasks", taskId);
  await updateDoc(docRef, updates);
}

// 🔹 Eliminar tarea
export async function removeTask(taskId) {
  const docRef = doc(db, "tasks", taskId);
  await deleteDoc(docRef);
}