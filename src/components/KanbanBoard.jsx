// 📁 src/screens/KanbanBoard.jsx
/**
 * Componente principal del tablero Kanban (DataFlow Manager)
 * ------------------------------------------------------------
 * Este módulo maneja:
 *  - Carga y sincronización de tareas desde Firestore.
 *  - Gestión de columnas (Por hacer, En progreso, Completado).
 *  - Creación, eliminación y actualización de tareas.
 *  - Registro de horas trabajadas por fecha.
 *  - Validación de fechas y mensajes modales (advertencias, confirmaciones, formularios).
 *  - Soporte completo de drag & drop (reordenar tareas o mover entre columnas).
 *
 * 🔗 Dependencias principales:
 *  - React (useState, useEffect)
 *  - react-beautiful-dnd (@hello-pangea/dnd)
 *  - Firestore (funciones: getAllTasks, saveTask, updateTask, removeTask)
 *  - Componentes internos: TaskCard y modales dinámicos
 */

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { getAllTasks, saveTask, updateTask, removeTask } from "../firestoreTasks";
import TaskCard from "../components/TaskCard";

/**
 * parseDate()
 * Convierte una cadena "YYYY-MM-DD" en un objeto Date válido.
 * 🔹 Se usa para validar que las fechas de registro de horas
 *    no sean anteriores a la creación ni futuras.
 */
const parseDate = (d) => {
  const [year, month, day] = d.split("-").map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Componente modal reutilizable
 * ------------------------------------
 * Se utiliza para mostrar advertencias, confirmaciones o formularios.
 */
function Message({ text, onClose, children }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md max-w-sm text-center">
        <p className="mb-4">{text}</p>
        {children
          ? children
          : (
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

/**
 * Componente principal del tablero Kanban
 * =======================================
 */
export default function KanbanBoard() {
  /**
   * Estado general del tablero:
   * Cada columna contiene un array de tareas.
   */
  const [columns, setColumns] = useState({
    todo: { name: "Por hacer", items: [] },
    inProgress: { name: "En progreso", items: [] },
    done: { name: "Completado", items: [] },
  });

  // Campos controlados para crear nueva tarea
  const [newTask, setNewTask] = useState("");
  const [newResponsible, setNewResponsible] = useState("");
  const [newCreationDate, setNewCreationDate] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [targetColumn, setTargetColumn] = useState("todo");

  // Estado de modales (confirmaciones, advertencias, registro de horas)
  const [confirmDeleteTask, setConfirmDeleteTask] = useState(null);
  const [hoursModal, setHoursModal] = useState(null);
  const [warningModal, setWarningModal] = useState(null);

  /**
   * useEffect: carga inicial de tareas desde Firestore.
   * --------------------------------------------------
   * - Se ejecuta al montar el componente.
   * - Llama a getAllTasks() para traer todas las tareas guardadas.
   * - Clasifica las tareas según su estado (status) y las inserta en las columnas correspondientes.
   */
  useEffect(() => {
    async function fetchData() {
      try {
        const tasks = await getAllTasks();
        console.log("Tasks from Firestore:", tasks);

        // Reorganizar tareas según columna (estado)
        const newCols = {
          todo: { name: "Por hacer", items: [] },
          inProgress: { name: "En progreso", items: [] },
          done: { name: "Completado", items: [] },
        };

        tasks?.forEach((t) => {
          const colKey = t.status || "todo";
          if (newCols[colKey]) {
            newCols[colKey].items.push({
              ...t,
              timesheet: t.timesheet || [], // Garantizar array de horas
              id: String(t.id),
            });
          }
        });

        setColumns(newCols);
      } catch (err) {
        console.error("Error cargando tareas:", err);
        setWarningModal({
          text: "No se pudieron cargar las tareas. Comprueba tu conexión o permisos.",
          onClose: () => setWarningModal(null),
        });
      }
    }
    fetchData();
  }, []);

  /**
   * onDragEnd()
   * ---------------------------------------------------
   * Maneja el movimiento de tarjetas entre columnas o dentro de la misma.
   * Actualiza el estado local y sincroniza con Firestore si cambia la columna (status).
   */
  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    // Si la tarea se mueve dentro de la misma columna
    if (source.droppableId === destination.droppableId) {
      const column = columns[source.droppableId];
      const newItems = Array.from(column.items);
      const [movedItem] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, movedItem);

      setColumns({
        ...columns,
        [source.droppableId]: { ...column, items: newItems },
      });
    } else {
      // Si la tarea se mueve entre columnas diferentes
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = Array.from(sourceColumn.items);
      const destItems = Array.from(destColumn.items);
      const [movedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, movedItem);

      // Actualizar estado en Firestore
      movedItem.status = destination.droppableId;
      await updateTask(movedItem.id, { status: movedItem.status });

      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
        [destination.droppableId]: { ...destColumn, items: destItems },
      });
    }
  };

  /**
   * addTask()
   * ---------------------------------------------------
   * Crea una nueva tarea, valida fechas y la guarda en Firestore.
   */
  const addTask = async () => {
    if (!newTask.trim()) return;

    // Validación de fecha de creación
    if (!newCreationDate || isNaN(new Date(newCreationDate).getTime())) {
      setWarningModal({ text: "Fecha de creación inválida.", onClose: () => setWarningModal(null) });
      return;
    }

    const creationDateObj = new Date(newCreationDate);
    creationDateObj.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // No permitir fechas futuras
    if (creationDateObj > today) {
      setWarningModal({
        text: "La fecha de creación no puede ser futura.",
        onClose: () => setWarningModal(null),
      });
      return;
    }

    const newItem = {
      content: newTask,
      responsible: newResponsible,
      creationDate: newCreationDate,
      dueDate: newDeadline,
      timesheet: [],
      status: targetColumn,
    };

    try {
      const saved = await saveTask(newItem);
      setColumns((prev) => ({
        ...prev,
        [targetColumn]: {
          ...prev[targetColumn],
          items: [...prev[targetColumn].items, { ...saved, timesheet: saved.timesheet || [], id: String(saved.id) }],
        },
      }));

      // Limpiar campos
      setNewTask("");
      setNewResponsible("");
      setNewCreationDate("");
      setNewDeadline("");
    } catch (error) {
      console.error("Error añadiendo tarea:", error);
      setWarningModal({
        text: `Error añadiendo tarea: ${error.message || error}`,
        onClose: () => setWarningModal(null),
      });
    }
  };

  /**
   * addHoursToTask()
   * ---------------------------------------------------
   * Añade un registro de horas a una tarea específica.
   * Valida que la fecha no sea anterior a la creación ni futura.
   * Actualiza tanto el estado local como Firestore.
   */
  const addHoursToTask = async () => {
    const { columnId, taskId, date, hours, minutes, note } = hoursModal;
    if (!date || !hours) return;

    const task = columns[columnId].items.find((item) => item.id === taskId);
    if (!task) return;

    const creation = parseDate(task.creationDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = parseDate(date);

    // Validaciones de fecha
    if (selected < creation) {
      const previousHoursModal = { ...hoursModal };
      setHoursModal(null);
      setWarningModal({
        text: `No se puede añadir horas en una fecha anterior a la fecha de inicio de la tarea (${task.creationDate}).`,
        onClose: () => {
          setWarningModal(null);
          setHoursModal(previousHoursModal);
        },
      });
      return;
    }

    if (selected > today) {
      const previousHoursModal = { ...hoursModal };
      setHoursModal(null);
      setWarningModal({
        text: `No se puede añadir horas en una fecha futura.`,
        onClose: () => {
          setWarningModal(null);
          setHoursModal(previousHoursModal);
        },
      });
      return;
    }

    // Actualizar estado local
    const updatedTask = {
      ...task,
      timesheet: [
        ...task.timesheet,
        { date, hours: Number(hours), minutes: Number(minutes), note },
      ],
    };

    setColumns((prev) => {
      const col = prev[columnId];
      const newItems = col.items.map((item) =>
        item.id === taskId ? updatedTask : item
      );
      return { ...prev, [columnId]: { ...col, items: newItems } };
    });

    // Guardar en Firestore
    try {
      await updateTask(taskId, { timesheet: updatedTask.timesheet });
    } catch (err) {
      console.error("Error guardando horas en Firestore:", err);
      setWarningModal({
        text: `Error guardando horas: ${err.message || err}`,
        onClose: () => setWarningModal(null),
      });
    }

    setHoursModal(null);
  };

  /**
   * deleteTask()
   * ---------------------------------------------------
   * Elimina una tarea tanto en Firestore como en el estado local.
   */
  const deleteTask = async (columnId, taskId) => {
    try {
      await removeTask(taskId);
      setColumns((prev) => {
        const col = prev[columnId];
        const newItems = col.items.filter((item) => item.id !== taskId);
        return { ...prev, [columnId]: { ...col, items: newItems } };
      });
    } catch (error) {
      console.error("Error eliminando tarea:", error);
      setWarningModal({
        text: `Error eliminando tarea: ${error.message || error}`,
        onClose: () => setWarningModal(null),
      });
    }
  };

  /**
   * Render principal del tablero Kanban
   * ---------------------------------------------------
   */
  return (
    <div className="flex flex-col items-center">
      {/* Título del tablero */}
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-3xl font-bold mb-1 text-center">DataFlow Manager</h2>
        <p className="text-gray-500 text-sm text-center">Nexeus Project Dashboard</p>
      </div>

      {/* Formulario de nueva tarea */}
      <div className="flex flex-col sm:flex-row gap-2 mb-2 items-end">
        <input type="text" className="border p-2 rounded w-48" placeholder="Nueva tarea..." value={newTask} onChange={(e) => setNewTask(e.target.value)} />
        <input type="text" className="border p-2 rounded w-36" placeholder="Responsable..." value={newResponsible} onChange={(e) => setNewResponsible(e.target.value)} />
        <input type="date" className="border p-2 rounded w-36" value={newCreationDate} onChange={(e) => setNewCreationDate(e.target.value)} />
        <input type="date" className="border p-2 rounded w-36" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} />
        <select className="border p-2 rounded w-36" value={targetColumn} onChange={(e) => setTargetColumn(e.target.value)}>
          {Object.entries(columns).map(([id, col]) => (
            <option key={id} value={id}>{col.name}</option>
          ))}
        </select>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addTask}>
          Añadir
        </button>
      </div>

      {/* Cuerpo del tablero Kanban */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 justify-center w-full flex-wrap">
          {Object.entries(columns).map(([columnId, column]) => (
            <Droppable key={columnId} droppableId={columnId}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`bg-white rounded p-4 shadow w-64 transition-colors duration-200 ${
                    snapshot.isDraggingOver ? "bg-blue-100" : "bg-gray-50"
                  }`}
                >
                  <h3 className="text-lg font-semibold text-center mb-3">{column.name}</h3>
                  {column.items.map((item, index) => (
                    <TaskCard
                      key={item.id}
                      task={item}
                      index={index}
                      columnId={columnId}
                      setConfirmDeleteTask={setConfirmDeleteTask}
                      setHoursModal={setHoursModal}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Modales de confirmación y advertencias */}
      {confirmDeleteTask && (
        <Message
          text={`¿Seguro que quieres eliminar la tarea "${confirmDeleteTask.content}"?`}
          onClose={() => setConfirmDeleteTask(null)}
        >
          <div className="mt-4 flex justify-center gap-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => {
                deleteTask(confirmDeleteTask.columnId, confirmDeleteTask.taskId);
                setConfirmDeleteTask(null);
              }}
            >
              Sí, eliminar
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setConfirmDeleteTask(null)}>
              Cancelar
            </button>
          </div>
        </Message>
      )}

      {/* Modal de registro de horas */}
      {hoursModal && (
        <Message text="" onClose={() => setHoursModal(null)}>
          <div className="relative p-4">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold text-lg bg-white rounded-full shadow z-10" onClick={() => setHoursModal(null)}>
              ✕
            </button>
            <p className="mb-2 font-semibold text-center mt-6">Registrar horas de la tarea</p>

            <input type="date" value={hoursModal.date} onChange={(e) => setHoursModal((prev) => ({ ...prev, date: e.target.value }))} className="border p-2 rounded w-full mb-2" />

            <div className="flex gap-2 mb-2">
              <input type="number" min="0" value={hoursModal.hours} onChange={(e) => setHoursModal((prev) => ({ ...prev, hours: e.target.value }))} placeholder="Horas" className="border p-2 rounded w-1/2" />
              <input type="number" min="0" max="59" value={hoursModal.minutes} onChange={(e) => setHoursModal((prev) => ({ ...prev, minutes: e.target.value }))} placeholder="Minutos" className="border p-2 rounded w-1/2" />
            </div>

            <input type="text" value={hoursModal.note} onChange={(e) => setHoursModal((prev) => ({ ...prev, note: e.target.value }))} placeholder="Nota (opcional)" className="border p-2 rounded w-full mb-2" />

            <button className="bg-green-500 text-white px-4 py-2 rounded w-full mt-2" onClick={addHoursToTask}>
              Guardar
            </button>
          </div>
        </Message>
      )}

      {/* Modal de advertencias generales */}
      {warningModal && (
        <Message text={warningModal.text} onClose={warningModal.onClose || (() => setWarningModal(null))} />
      )}
    </div>
  );
}