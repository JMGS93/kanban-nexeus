/**
 * Componente: FormWrapper
 * -----------------------
 * Este componente proporciona una plantilla estandarizada para formularios dentro de la aplicación.
 * Su objetivo es centralizar el diseño, manejo de errores, mensajes de éxito y estado de carga (loading),
 * de modo que todos los formularios de la app mantengan una apariencia y comportamiento coherentes.
 *
 * Props:
 *  - loading (boolean): Indica si el formulario está en proceso de envío.
 *                       Si es true, desactiva el botón y muestra un spinner de carga.
 *
 *  - error (string): Muestra un mensaje de error debajo del formulario.
 *
 *  - success (string): Muestra un mensaje de éxito debajo del formulario.
 *
 *  - onSubmit (function): Función que se ejecuta cuando el formulario es enviado.
 *                         Por defecto previene el comportamiento estándar (recarga de página).
 *
 *  - children (ReactNode): Contenido del formulario (inputs, selectores, etc.) que se pasa desde el componente padre.
 *
 *  - buttonText (string): Texto del botón de envío. Por defecto "Enviar".
 *
 * Ejemplo de uso:
 *  <FormWrapper
 *     loading={isSubmitting}
 *     error={errorMessage}
 *     success={successMessage}
 *     onSubmit={handleSubmit}
 *     buttonText="Guardar tarea"
 *  >
 *     <input type="text" placeholder="Título de la tarea" />
 *     <textarea placeholder="Descripción" />
 *  </FormWrapper>
 *
 * Dependencias:
 *  - React: para el componente funcional.
 */

import React from "react";

export default function FormWrapper({
  loading = false,  // Estado de carga (spinner activo y botón deshabilitado)
  error = "",        // Mensaje de error opcional
  success = "",      // Mensaje de éxito opcional
  onSubmit = (e) => e.preventDefault(),  // Previene envío por defecto si no se pasa función
  children,          // Elementos del formulario (inputs, selectores, etc.)
  buttonText = "Enviar", // Texto del botón
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      {/* Renderiza los hijos pasados desde el componente padre (inputs, selects, etc.) */}
      {children || null}

      {/* Mensajes de error o éxito */}
      {error ? <p className="text-red-500">{error}</p> : null}
      {success ? <p className="text-green-500">{success}</p> : null}

      {/* Botón principal del formulario */}
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded flex justify-center items-center gap-2 hover:bg-blue-600 transition-colors duration-200"
        disabled={loading} // Desactiva el botón mientras el formulario está cargando
      >
        {/* Indicador visual de carga */}
        {loading && <span className="button-spinner" />}

        {/* Texto dinámico del botón */}
        <span className="loader-text">
          {loading ? "Cargando..." : buttonText}
        </span>
      </button>
    </form>
  );
}