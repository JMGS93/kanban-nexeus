import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";

const initialData = {
  "todo": [{ id: "1", content: "Tarea 1" }, { id: "2", content: "Tarea 2" }],
  "inProgress": [],
  "done": []
};

export default function KanbanBoard() {
  const [columns, setColumns] = useState(initialData);

  // Función para manejar drag & drop
  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const [movedItem] = sourceCol.splice(source.index, 1);

    destCol.splice(destination.index, 0, movedItem);

    setColumns({ ...columns });
  };

  return (
    <div className="p-6">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4">
          <Column title="Por hacer" droppableId="todo" tasks={columns.todo} />
          <Column title="En progreso" droppableId="inProgress" tasks={columns.inProgress} />
          <Column title="Hecho" droppableId="done" tasks={columns.done} />
        </div>
      </DragDropContext>
    </div>
  );
}