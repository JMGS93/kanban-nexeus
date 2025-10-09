// src/components/TaskCard.jsx
import React from "react";
import { Draggable } from "@hello-pangea/dnd";

export default function TaskCard({ task, index, columnId, setConfirmDeleteTask, setHoursModal }) {
  return (
    <Draggable key={task.id} draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-2 mb-2 rounded shadow-sm flex flex-col justify-between transition-all ${
            snapshot.isDragging ? "bg-blue-200 scale-105" : "bg-blue-50"
          }`}
        >
          <div className="flex justify-between items-center">
            <span>{task.content}</span>
            {setConfirmDeleteTask && (
              <button
                className="text-red-500 hover:text-red-700 ml-2"
                onClick={() =>
                  setConfirmDeleteTask({ columnId, taskId: task.id, content: task.content })
                }
              >
                ✕
              </button>
            )}
          </div>

          <div className="text-xs text-gray-700 mt-1">
            Responsable: {task.responsible || "-"} <br />
            Creación: {task.creationDate || "-"} <br />
            Fecha límite: {task.dueDate || "-"}
          </div>

          <div className="flex flex-col mt-1">
            {setHoursModal && (
              <button
                className="text-green-600 hover:text-green-800 text-xs mb-1 self-start"
                onClick={() =>
                  setHoursModal({ columnId, taskId: task.id, date: "", hours: "", minutes: "", note: "" })
                }
              >
                Añadir horas
              </button>
            )}

            {task.timesheet?.length > 0 && (
              <div className="text-xs text-gray-600">
                {task.timesheet.map((entry, i) => (
                  <div key={i}>
                    {entry.date}: {entry.hours}h {entry.minutes}m {entry.note && `- ${entry.note}`}
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