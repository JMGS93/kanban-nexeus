// =========================================================
// Punto de entrada de la aplicación React
// =========================================================

// Importaciones principales
import React from "react";
import ReactDOM from "react-dom/client"; // React 18: creación de raíz
import { BrowserRouter } from "react-router-dom"; // Router para navegación SPA
import App from "./App"; // Componente principal de la app
import "./index.css"; // Estilos globales (Tailwind y personalizados)

// =========================================================
// Creación de la raíz de React y renderizado de la app
// =========================================================
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode> {/* Activar chequeos de desarrollo (warnings, mejores prácticas) */}
    <BrowserRouter>   {/* Permite usar rutas y navegación SPA */}
      <App />          {/* Componente principal de la aplicación */}
    </BrowserRouter>
  </React.StrictMode>
);