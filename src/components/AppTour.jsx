// src/components/AppTour.jsx
import React, { useState, useEffect } from "react";
import Joyride from "react-joyride";

export default function AppTour({ run, setRun }) {
  const [steps] = useState([
    {
      target: ".input-proyecto",
      content: "Aquí puedes escribir el nombre de la tarea en la que vas a trabajar.",
    },
    {
      target: ".input-responsable",
      content: "Asigna un responsable a la tarea para que quede registrada.",
    },
    {
      target: ".input-fecha",
      content: "Selecciona la fecha de inicio o planificación de tu tarea.",
      
    },
    {
      target: ".input-fecha-limite",
      content: "Selecciona la fecha límite para completar la tarea.",
    },
    {
      target: ".select-columna",
      content: "Selecciona en qué columna quieres que aparezca la tarea.",
    },
    {
      target: ".kanban-board",
      content: "Este es el tablero Kanban. Aquí puedes arrastrar y soltar tareas entre columnas.",
    },
    {
      target: ".columna-todo",
      content: "La columna 'Por hacer' contiene las tareas pendientes.",
    },
    {
      target: ".columna-inprogress",
      content: "La columna 'En progreso' muestra las tareas que están siendo trabajadas actualmente.",
    },
    {
      target: ".columna-done",
      content: "La columna 'Hecho' muestra las tareas completadas, junto con la fecha de finalización.",
    },
    {
      target: ".btn-export",
      content: "Este botón exporta todas las tareas COMPLETADAS a un archivo CSV.",
    },
    {
      target: ".metricas-panel",
      content: "Aquí verás las métricas del proyecto: total de horas, responsables y tiempos acumulados.",
    },
    {
      target: ".menu-acciones",
      content: "En este menú puedes crear o cambiar de proyecto, y acceder a otras funciones clave.",
    },
  ]);

  useEffect(() => {
    const seen = localStorage.getItem("tutorialCompleted");
    if (seen) setRun(false);
  }, [setRun]);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if (status === "finished" || status === "skipped") {
      localStorage.setItem("tutorialCompleted", "true");
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      showSkipButton
      showProgress
      styles={{
        options: {
          primaryColor: "#4f46e5",
          zIndex: 10000,
        },
      }}
      callback={handleJoyrideCallback}
    />
  );
}