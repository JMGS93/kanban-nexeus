import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { ChevronDown } from "lucide-react";

export default function TaskCard({
  task,
  index,
  columnId,
  setConfirmDeleteTask,
  setHoursModal,
}) {
  const [isMinimized, setIsMinimized] = useState(true);

  return (
    <Draggable key={task.id} draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-2 mb-2 rounded shadow-sm transition-all ${
            snapshot.isDragging ? "bg-blue-200 scale-105" : "bg-blue-50"
          }`}
        >
          {/* Encabezado siempre visible */}
          <div className="flex justify-between items-center">
            <span className="font-semibold">{task.content}</span>
            <div className="flex gap-1 items-center">
              {/* Chevron desplegable */}
              <button
                className="text-black"
                onClick={() => setIsMinimized((prev) => !prev)}
              >
                <ChevronDown
                  size={18}
                  className={`inline-block transform transition-transform duration-200 ${
                    isMinimized ? "" : "rotate-180"
                  }`}
                />
              </button>

              {/* Botón de eliminar */}
              {setConfirmDeleteTask && (
                <button
                  className="text-red-500 hover:text-red-700 ml-1"
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
          </div>

          {/* Contenido completo solo si no está minimizado */}
          {!isMinimized && (
            <div className="text-xs text-gray-700 mt-1">
              <p>Responsable: {task.responsible || "-"}</p>
              <p className="text-gray-500">Creación: {task.creationDate || "-"}</p>
              <p className="text-gray-500">Fecha límite: {task.dueDate || "-"}</p>

              {/* 🔹 Nueva línea: mostrar fecha de cierre si la tarea está completada */}
              {columnId === "done" && (
                <p className="text-gray-500">
                  Fecha de cierre: {task.completedDate || "-"}
                </p>
              )}

              {setHoursModal && (
                <button
                  className="text-green-600 hover:text-green-800 text-xs mb-1 mt-1"
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

              {task.timesheet?.length > 0 && (
                <div className="text-xs text-gray-600 mt-1">
                  {task.timesheet.map((entry, i) => (
                    <div key={i}>
                      {entry.date}: {entry.hours}h {entry.minutes}m{" "}
                      {entry.note && `- ${entry.note}`}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}