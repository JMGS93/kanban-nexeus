// src/components/TaskCard.jsx
// -------------------------------------------------------------
// ✅ Componente: TaskCard
// Representa una tarjeta individual dentro de una columna del tablero Kanban.
// Cada tarjeta contiene información sobre una tarea (nombre, responsable,
// fechas, y horas trabajadas) y soporta arrastrar y soltar mediante
// la librería @hello-pangea/dnd (fork optimizado de react-beautiful-dnd).
// -------------------------------------------------------------

import React from "react";
import { Draggable } from "@hello-pangea/dnd"; // Componente para permitir arrastrar la tarea

/**
 * 🔹 Props esperadas:
 * @param {object} task - Objeto con la información de la tarea (id, content, responsible, etc.)
 * @param {number} index - Posición de la tarea dentro de la columna (necesaria para DnD)
 * @param {string} columnId - ID de la columna donde se encuentra la tarea
 * @param {function} setConfirmDeleteTask - Función para abrir modal de confirmación de borrado
 * @param {function} setHoursModal - Función para abrir modal de registro de horas
 */

export default function TaskCard({
  task,
  index,
  columnId,
  setConfirmDeleteTask,
  setHoursModal,
}) {
  return (
    <Draggable key={task.id} draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}      // permite arrastrar el elemento
          {...provided.dragHandleProps}    // define el área desde la que se puede "agarrar"
          className={`p-2 mb-2 rounded shadow-sm flex flex-col justify-between transition-all ${
            snapshot.isDragging
              ? "bg-blue-200 scale-105"  // efecto visual mientras se arrastra
              : "bg-blue-50"              // color normal
          }`}
        >
          {/* 🔹 Encabezado de la tarjeta: nombre de la tarea y botón de eliminar */}
          <div className="flex justify-between items-center">
            <span>{task.content}</span>

            {setConfirmDeleteTask && (
              <button
                className="text-red-500 hover:text-red-700 ml-2"
                onClick={() =>
                  setConfirmDeleteTask({
                    columnId,
                    taskId: task.id,
                    content: task.content,
                  })
                }
              >
                ✕
              </button>
            )}
          </div>

          {/* 🔹 Información descriptiva de la tarea */}
          <div className="text-xs text-gray-700 mt-1">
            Responsable: {task.responsible || "-"} <br />
            Creación: {task.creationDate || "-"} <br />
            Fecha límite: {task.dueDate || "-"}
          </div>

          {/* 🔹 Zona para gestión de horas y visualización del timesheet */}
          <div className="flex flex-col mt-1">
            {/* Botón que abre el modal para añadir horas trabajadas */}
            {setHoursModal && (
              <button
                className="text-green-600 hover:text-green-800 text-xs mb-1 self-start"
                onClick={() =>
                  setHoursModal({
                    columnId,
                    taskId: task.id,
                    date: "",
                    hours: "",
                    minutes: "",
                    note: "",
                  })
                }
              >
                Añadir horas
              </button>
            )}

            {/* 🔸 Listado de horas ya registradas (timesheet) */}
            {task.timesheet?.length > 0 && (
              <div className="text-xs text-gray-600">
                {task.timesheet.map((entry, i) => (
                  <div key={i}>
                    {entry.date}: {entry.hours}h {entry.minutes}m{" "}
                    {entry.note && `- ${entry.note}`}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}