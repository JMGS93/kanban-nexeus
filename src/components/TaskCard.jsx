import React from "react";
import { Draggable } from "react-beautiful-dnd";

export default function TaskCard({ task, index }) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-3 rounded shadow cursor-pointer"
        >
          {task.content}
        </div>
      )}
    </Draggable>
  );
}