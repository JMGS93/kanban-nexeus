// =========================================================
// Eliminar proyecto + tareas asociadas
// ---------------------------------------------------------
import { db } from "./firebase";
import { deleteDoc, doc, collection, query, where, getDocs } from "firebase/firestore";

/**
 * deleteProject
 * @param {string} uid - ID del usuario
 * @param {string} projectId - ID del proyecto a eliminar
 */
export async function deleteProject(uid, projectId) {
  if (!uid || !projectId) return;

  try {
    // 1️⃣ Borrar todas las tareas asociadas
    const tasksQuery = query(collection(db, "tasks"), where("projectId", "==", projectId));
    const tasksSnapshot = await getDocs(tasksQuery);

    const deletePromises = tasksSnapshot.docs.map((docSnap) => deleteDoc(doc(db, "tasks", docSnap.id)));
    await Promise.all(deletePromises);

    // 2️⃣ Borrar el proyecto
    const projectRef = doc(db, "users", uid, "projects", projectId);
    await deleteDoc(projectRef);

    console.log("Proyecto y tareas eliminadas correctamente");
  } catch (err) {
    console.error("Error al eliminar proyecto:", err);
    throw err;
  }
}
