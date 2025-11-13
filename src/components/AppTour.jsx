import React, { useState, useEffect } from "react";
import Joyride from "react-joyride";

// Componente de tooltip personalizado
const CustomTooltip = ({ step, index, isLastStep, backProps, closeProps, primaryProps }) => {
  return (
    <div style={{
      padding: "16px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      maxWidth: "300px",
    }}>
      <div style={{ marginBottom: "12px" }}>{step.content}</div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {index > 0 && <button {...backProps} style={buttonStyle}>Atrás</button>}
        <div style={{ display: "flex", gap: "8px" }}>
          <button {...closeProps} style={buttonStyleSecondary}>Cerrar</button>
          <button {...primaryProps} style={buttonStylePrimary}>
            {isLastStep ? "Finalizar" : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Estilos de los botones
const buttonStylePrimary = {
  backgroundColor: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  padding: "6px 12px",
  cursor: "pointer",
};

const buttonStyleSecondary = {
  backgroundColor: "#0f0f0fff",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  padding: "6px 12px",
  cursor: "pointer",
};

const buttonStyle = {
  backgroundColor: "#10b981",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  padding: "6px 12px",
  cursor: "pointer",
};

export default function AppTour({ run, setRun }) {
  const [steps] = useState([
    { target: ".input-proyecto", content: "Aquí puedes escribir el nombre de la tarea en la que vas a trabajar." },
    { target: ".input-responsable", content: "Asigna un responsable a la tarea para que quede registrada." },
    { target: ".input-fecha", content: "Selecciona la fecha de inicio o planificación de tu tarea." },
    { target: ".input-fecha-limite", content: "Selecciona la fecha límite para completar la tarea." },
    { target: ".select-columna", content: "Selecciona en qué columna quieres que aparezca la tarea." },
    { target: ".kanban-board", content: "Este es el tablero Kanban. Aquí puedes arrastrar y soltar tareas entre columnas." },
    { target: ".columna-todo", content: "La columna 'Por hacer' contiene las tareas pendientes." },
    { target: ".columna-inprogress", content: "La columna 'En progreso' muestra las tareas que están siendo trabajadas actualmente." },
    { target: ".columna-done", content: "La columna 'Hecho' muestra las tareas completadas, junto con la fecha de finalización." },
    { target: ".btn-export", content: "Este botón exporta todas las tareas COMPLETADAS a un archivo CSV." },
    { target: ".metricas-panel", content: "Aquí verás las métricas del proyecto: total de horas, responsables y tiempos acumulados." },
    { target: ".menu-acciones", content: "En este menú puedes crear o cambiar de proyecto, y acceder a otras funciones clave." },
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
      tooltipComponent={CustomTooltip}
      callback={handleJoyrideCallback}
    />
  );
}
