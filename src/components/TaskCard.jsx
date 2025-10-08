// src/components/TaskCard.jsx
import React from "react";

export default function TaskCard({ task, index, provided, onDelete }) {
  // task: { id, content, ... }
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="p-3 mb-2 bg-white rounded shadow cursor-move flex justify-between items-center"
    >
      <div className="text-sm">{task.content}</div>
      <button
        onClick={() => onDelete(task.id)}
        className="ml-4 text-red-500 hover:text-red-700"
        title="Eliminar tarea"
      >
        ✕
      </button>
    </div>
  );
}