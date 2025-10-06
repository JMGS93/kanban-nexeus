import React from "react";
import { Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

export default function Column({ title, droppableId, tasks }) {
  return (
    <div className="bg-gray-100 rounded p-4 flex-1 min-h-[300px]">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-2">
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
