import React from "react";
import { Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

export default function Column({ title = "", droppableId = "", tasks = [], columnId = "", deleteTask }) {
  return (
    <div className="bg-gray-100 rounded p-4 flex-1 min-h-[300px]">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-2 transition-colors duration-200 ${
              snapshot.isDraggingOver ? "bg-blue-50" : "bg-gray-100"
            }`}
          >
            {Array.isArray(tasks) && tasks.length > 0
              ? tasks.map((task, index) => (
                  <TaskCard
                    key={task?.id ?? index}
                    task={task}
                    index={index}
                    columnId={columnId}
                    setConfirmDeleteTask={(t) =>
                      deleteTask ? deleteTask(columnId, t) : null
                    }
                  />
                ))
              : <p className="text-gray-400 text-sm text-center py-4">No hay tareas</p>}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}