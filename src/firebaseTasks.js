// src/firebaseTasks.js
import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy,
  doc,
  writeBatch,
  deleteDoc,
} from "firebase/firestore";

/**
 * Añadir tarea al final de la columna (order se calcula como max+1)
 */
export async function addTask(userId, content, status = "todo") {
  const colRef = collection(db, "tasks");
  // obtener el orden máximo actual en esa columna
  const q = query(
    colRef,
    where("userId", "==", userId),
    where("status", "==", status),
    orderBy("order", "desc")
  );
  const snapshot = await getDocs(q);
  let order = 0;
  if (!snapshot.empty) {
    const maxOrder = snapshot.docs[0].data().order;
    order = (typeof maxOrder === "number" ? maxOrder : 0) + 1;
  }
  const docRef = await addDoc(colRef, {
    userId,
    content,
    status,
    createdAt: new Date(),
    order,
  });
  return docRef;
}

/**
 * Eliminar tarea por id
 */
export async function deleteTask(taskId) {
  await deleteDoc(doc(db, "tasks", taskId));
}

/**
 * Suscribirse a las tareas de un usuario (ordenadas por order)
 * callback recibe array de { id, ...data }
 */
export function subscribeTasks(userId, callback) {
  const colRef = collection(db, "tasks");
  const q = query(colRef, where("userId", "==", userId), orderBy("order"));
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(tasks);
  });
}

/**
 * Actualiza en batch el status y order de las tareas según newColumns.
 * newColumns: { todo: [taskObj,...], inprogress: [...], done: [...] }
 * Cada taskObj debe tener id, content, etc — la función actualiza 'status' y 'order'.
 */
export async function batchUpdateTasksOrders(newColumns) {
  const batch = writeBatch(db);
  Object.entries(newColumns).forEach(([status, tasks]) => {
    tasks.forEach((task, index) => {
      const ref = doc(db, "tasks", task.id);
      batch.update(ref, { status, order: index });
    });
  });
  await batch.commit();
}