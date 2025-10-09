import React from "react";

export default function FormWrapper({
  loading = false,
  error = "",
  success = "",
  onSubmit = (e) => e.preventDefault(),
  children,
  buttonText = "Enviar",
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      {children || null}

      {error ? <p className="text-red-500">{error}</p> : null}
      {success ? <p className="text-green-500">{success}</p> : null}

      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded flex justify-center items-center gap-2"
        disabled={loading} // Desactiva el botón mientras carga
      >
        {loading && <span className="button-spinner" />}
        <span className="loader-text">{loading ? "Cargando..." : buttonText}</span>
      </button>
    </form>
  );
}
