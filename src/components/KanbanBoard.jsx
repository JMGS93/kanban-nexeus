import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// Componente Message para confirmaciones y modales
function Message({ text, onClose, children }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md max-w-sm text-center">
        <p className="mb-4">{text}</p>
        {children}
        {!children && (
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

// Datos iniciales
const initialData = {
  todo: {
    name: "Por hacer",
    items: [
      { id: "1", content: "Diseñar pantalla de login", responsible: "Juan", creationDate: "2025-10-05", dueDate: "2025-10-10", timesheet: [] },
      { id: "2", content: "Configurar base de datos", responsible: "Ana", creationDate: "2025-10-06", dueDate: "2025-10-12", timesheet: [] },
    ],
  },
  inProgress: {
    name: "En progreso",
    items: [
      { id: "3", content: "Crear sistema de registro", responsible: "Pedro", creationDate: "2025-10-07", dueDate: "2025-10-11", timesheet: [] }
    ],
  },
  done: {
    name: "Completado",
    items: [
      { id: "4", content: "Instalar dependencias", responsible: "Laura", creationDate: "2025-10-04", dueDate: "2025-10-09", timesheet: [] }
    ],
  },
};

export default function KanbanBoard() {
  const [columns, setColumns] = useState(initialData);
  const [newTask, setNewTask] = useState("");
  const [newResponsible, setNewResponsible] = useState("");
  const [newCreationDate, setNewCreationDate] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [targetColumn, setTargetColumn] = useState("todo");

  const [confirmDeleteTask, setConfirmDeleteTask] = useState(null);
  const [hoursModal, setHoursModal] = useState(null);
  const [warningModal, setWarningModal] = useState(null);

  // Drag & Drop
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

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
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = Array.from(sourceColumn.items);
      const destItems = Array.from(destColumn.items);
      const [movedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, movedItem);

      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
        [destination.droppableId]: { ...destColumn, items: destItems },
      });
    }
  };

  const addTask = () => {
    if (!newTask.trim()) return;

    // Validar que la fecha de creación no sea futura
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const creationDateObj = new Date(newCreationDate);
    creationDateObj.setHours(0, 0, 0, 0);

    if (creationDateObj > today) {
      setWarningModal({
        text: "La fecha de creación no puede ser futura.",
        onClose: () => setWarningModal(null)
      });
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      content: newTask,
      responsible: newResponsible,
      creationDate: newCreationDate,
      dueDate: newDeadline,
      timesheet: [],
    };

    setColumns((prev) => ({
      ...prev,
      [targetColumn]: {
        ...prev[targetColumn],
        items: [...prev[targetColumn].items, newItem],
      },
    }));

    setNewTask("");
    setNewResponsible("");
    setNewCreationDate("");
    setNewDeadline("");
  };
  
  // Eliminar tarjeta
  const deleteTask = (colId, taskId) => {
    setColumns((prev) => ({
      ...prev,
      [colId]: {
        ...prev[colId],
        items: prev[colId].items.filter((item) => item.id !== taskId),
      },
    }));
  };

  // Guardar horas con validación de fecha y minutos
  const addHoursToTask = () => {
    const { columnId, taskId, date, hours, minutes, note } = hoursModal;
    if (!date || !hours) return;

    const task = columns[columnId].items.find(item => item.id === taskId);

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0); // <--- esto ignora horas, minutos y segundos

    const today = new Date();
    today.setHours(0, 0, 0, 0); // eliminamos la hora para comparar solo la fecha
    today.setHours(0,0,0,0); // eliminamos la hora para comparar solo la fecha

    // Validar que la fecha no sea anterior a la fecha de inicio
    if (selectedDate < new Date(task.creationDate)) {
      const previousHoursModal = { ...hoursModal };
      setHoursModal(null);
      setWarningModal({
        text: `No se puede añadir horas en una fecha anterior a la fecha de inicio de la tarea (${task.creationDate}).`,
        onClose: () => {
          setWarningModal(null);
          setHoursModal(previousHoursModal);
        }
      });
      return;
    }

    // Validar que la fecha no sea futura
    if (selectedDate > today) {
      const previousHoursModal = { ...hoursModal };
      setHoursModal(null);
      setWarningModal({
        text: `No se puede añadir horas en una fecha futura.`,
        onClose: () => {
          setWarningModal(null);
          setHoursModal(previousHoursModal);
        }
      });
      return;
    }

    // Guardar horas
    setColumns(prev => {
      const col = prev[columnId];
      const newItems = col.items.map(item => {
        if (item.id === taskId) {
          return {
            ...item,
            timesheet: [...item.timesheet, { date, hours: Number(hours), minutes: Number(minutes), note }],
          };
        }
        return item;
      });
      return { ...prev, [columnId]: { ...col, items: newItems } };
    });

    setHoursModal(null);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Encabezado */}
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-3xl font-bold mb-1 text-center">DataFlow Manager</h2>
        <p className="text-gray-500 text-sm text-center">Nexeus Project Dashboard</p>
      </div>

      {/* Crear nueva tarea */}
      <div className="flex flex-col sm:flex-row gap-2 mb-2 items-end">
        <input
          type="text"
          className="border p-2 rounded w-48"
          placeholder="Nueva tarea..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <input
          type="text"
          className="border p-2 rounded w-36"
          placeholder="Responsable..."
          value={newResponsible}
          onChange={(e) => setNewResponsible(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 rounded w-36"
          value={newCreationDate}
          onChange={(e) => setNewCreationDate(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 rounded w-36"
          value={newDeadline}
          onChange={(e) => setNewDeadline(e.target.value)}
        />
        <select
          className="border p-2 rounded w-36"
          value={targetColumn}
          onChange={(e) => setTargetColumn(e.target.value)}
        >
          {Object.entries(columns).map(([id, col]) => (
            <option key={id} value={id}>{col.name}</option>
          ))}
        </select>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={addTask}
        >
          Añadir
        </button>
      </div>

      {/* Textos de fecha debajo de los inputs */}
      <div className="flex flex-row gap-2 mb-10 items-center">
        <div className="w-48"></div>
        <div className="w-36"></div>
        <div className="w-36 flex justify-center">
          <span className="text-xs italic text-gray-500" style={{ transform: "translateX(-40px) translateY(-5px)" }}>
            Fecha inicio
          </span>
        </div>
        <div className="w-36 flex justify-center">
          <span className="text-xs italic text-gray-500" style={{ transform: "translateX(-40px) translateY(-5px)" }}>
            Fecha límite
          </span>
        </div>
        <div className="w-36"></div>
        <div className="w-auto"></div>
      </div>

      {/* Tablero Kanban */}
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
                    <Draggable key={item.id} draggableId={item.id} index={index}>
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
                            <span>{item.content}</span>
                            <button
                              className="text-red-500 hover:text-red-700 ml-2"
                              onClick={() =>
                                setConfirmDeleteTask({ columnId, taskId: item.id, content: item.content })
                              }
                            >
                              ✕
                            </button>
                          </div>
                          <div className="text-xs text-gray-700 mt-1">
                            Responsable: {item.responsible || "-"} <br/>
                            Creación: {item.creationDate || "-"} <br/>
                            Fecha límite: {item.dueDate || "-"}
                          </div>
                          <div className="flex flex-col mt-1">
                            <button
                              className="text-green-600 hover:text-green-800 text-xs mb-1 self-start"
                              onClick={() =>
                                setHoursModal({ columnId, taskId: item.id, date: "", hours: "", minutes: "", note: "" })
                              }
                            >
                              Añadir horas
                            </button>
                            {item.timesheet.length > 0 && (
                              <div className="text-xs text-gray-600">
                                {item.timesheet.map((entry, i) => (
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
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Confirmación eliminar tarjeta */}
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
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setConfirmDeleteTask(null)}
            >
              Cancelar
            </button>
          </div>
        </Message>
      )}

      {/* Modal añadir horas */}
      {hoursModal && (
        <Message text="" onClose={() => setHoursModal(null)}>
          <div className="relative p-4">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold text-lg bg-white rounded-full shadow z-10"
              onClick={() => setHoursModal(null)}
            >
              ✕
            </button>

            <p className="mb-2 font-semibold text-center mt-6">
              Registrar horas de la tarea
            </p>

            <input
              type="date"
              value={hoursModal.date}
              onChange={(e) => setHoursModal(prev => ({ ...prev, date: e.target.value }))}
              className="border p-2 rounded w-full mb-2"
            />

            <div className="flex gap-2 mb-2">
              <input
                type="number"
                min="0"
                value={hoursModal.hours}
                onChange={(e) => setHoursModal(prev => ({ ...prev, hours: e.target.value }))}
                placeholder="Horas"
                className="border p-2 rounded w-1/2"
              />
              <input
                type="number"
                min="0"
                max="59"
                value={hoursModal.minutes}
                onChange={(e) => setHoursModal(prev => ({ ...prev, minutes: e.target.value }))}
                placeholder="Minutos"
                className="border p-2 rounded w-1/2"
              />
            </div>

            <input
              type="text"
              value={hoursModal.note}
              onChange={(e) => setHoursModal(prev => ({ ...prev, note: e.target.value }))}
              placeholder="Nota (opcional)"
              className="border p-2 rounded w-full mb-2"
            />

            <button
              className="bg-green-500 text-white px-4 py-2 rounded w-full mt-2"
              onClick={addHoursToTask}
            >
              Guardar
            </button>
          </div>
        </Message>
      )}

      {warningModal && (
        <Message
          text={warningModal.text}
          onClose={warningModal.onClose || (() => setWarningModal(null))}
        />
      )}
    </div>
  );
}
