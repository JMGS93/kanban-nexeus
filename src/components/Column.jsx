/**
 * Componente: Column
 * ------------------
 * Este componente representa una columna del tablero Kanban.
 * Cada columna puede contener múltiples tareas (TaskCards) y permite arrastrar/soltar tareas entre columnas
 * gracias a la integración con la librería `react-beautiful-dnd`.
 *
 * Props:
 *  - title (string): Título visible de la columna (ej: "Por hacer", "En progreso", etc.).
 *  - droppableId (string): Identificador único requerido por `react-beautiful-dnd` para permitir el drag & drop.
 *  - tasks (array): Lista de tareas que se renderizarán dentro de esta columna.
 *  - columnId (string): ID interno de la columna, útil para manejar acciones (como eliminar una tarea).
 *  - deleteTask (function): Función callback que se ejecuta cuando se confirma la eliminación de una tarea.
 *
 * Dependencias:
 *  - React: Para la estructura del componente funcional.
 *  - Droppable: Componente de `react-beautiful-dnd` que define un área donde se pueden soltar elementos arrastrables.
 *  - TaskCard: Componente que representa visualmente cada tarea individual.
 */

import React from "react";
import { Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

export default function Column({
  title = "",
  droppableId = "",
  tasks = [],
  columnId = "",
  deleteTask,
}) {
  return (
    // Contenedor visual de la columna, con fondo, borde redondeado y padding.
    <div className="bg-gray-100 rounded p-4 flex-1 min-h-[300px]">
      {/* Encabezado de la columna (por ejemplo: "Por hacer") */}
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      {/*
        Componente `Droppable` define una zona donde se pueden soltar tareas.
        Recibe un `droppableId` único, necesario para distinguir las columnas.
        `provided` y `snapshot` son objetos que react-beautiful-dnd pasa automáticamente:
          - provided.innerRef → referencia DOM requerida por la librería.
          - provided.droppableProps → props necesarias para habilitar el droppable.
          - snapshot.isDraggingOver → indica visualmente si hay una tarea sobrevolando la zona.
      */}
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            // Vincula la referencia DOM necesaria para que el droppable funcione correctamente
            ref={provided.innerRef}
            // Añade las propiedades necesarias del droppable
            {...provided.droppableProps}
            // Cambia el fondo cuando una tarea se arrastra sobre esta columna
            className={`flex flex-col gap-2 transition-colors duration-200 ${
              snapshot.isDraggingOver ? "bg-blue-50" : "bg-gray-100"
            }`}
          >
            {/*
              Renderizado de las tareas dentro de la columna.
              - Si hay tareas en el array, se mapean a componentes <TaskCard />.
              - Si no hay tareas, se muestra un texto indicativo ("No hay tareas").
            */}
            {Array.isArray(tasks) && tasks.length > 0 ? (
              tasks.map((task, index) => (
                <TaskCard
                  key={task?.id ?? index} // Se usa el ID de la tarea, o el índice como fallback
                  task={task} // Datos de la tarea (título, descripción, etc.)
                  index={index} // Posición necesaria para el orden en react-beautiful-dnd
                  columnId={columnId} // ID de la columna donde está la tarea
                  // Callback que se llama cuando el usuario confirma eliminar una tarea
                  setConfirmDeleteTask={(t) =>
                    deleteTask ? deleteTask(columnId, t) : null
                  }
                />
              ))
            ) : (
              // Mensaje mostrado cuando la columna no tiene tareas
              <p className="text-gray-400 text-sm text-center py-4">
                No hay tareas
              </p>
            )}

            {/*
              Placeholder de react-beautiful-dnd:
              Mantiene el espacio ocupado cuando una tarea se está arrastrando.
            */}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
