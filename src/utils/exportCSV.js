export function exportCompletedTasksToCSV(columns) {
  const completedTasks = columns.done.items;

  if (!completedTasks || completedTasks.length === 0) {
    alert("No hay tareas completadas para exportar esta semana.");
    return;
  }

  // Encabezados CSV
  const headers = ["Tarea", "Responsable", "Fecha Creación", "Fecha Cierre", "Horas Registradas"];

  let grandTotalHours = 0;
  let grandTotalMinutes = 0;

  // Filtrar solo tareas completadas y sumar horas/minutos
  const rows = completedTasks.map(task => {
    let totalHours = 0;
    let totalMinutes = 0;

    task.timesheet?.forEach(entry => {
      totalHours += Number(entry.hours || 0);
      totalMinutes += Number(entry.minutes || 0);
    });

    // Convertir minutos a horas
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    // Sumar al gran total
    grandTotalHours += totalHours;
    grandTotalMinutes += totalMinutes;

    const totalStr = `${totalHours}h ${totalMinutes}m`;

    return [
      task.content,
      task.responsible || "",
      task.creationDate || "",
      task.completedDate || "",
      totalStr
    ];
  });

  // Ajustar gran total por minutos sobrantes
  grandTotalHours += Math.floor(grandTotalMinutes / 60);
  grandTotalMinutes = grandTotalMinutes % 60;

  // Añadir fila final de totales
  rows.push([
    `Horas totales: ${grandTotalHours}h ${grandTotalMinutes}m`,
  ]);

  // Construir CSV
  const csvContent = [
    headers.join(","),
    ...rows.map(r => r.map(field => `"${field}"`).join(","))
  ].join("\n");

  // Descargar CSV
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  // Nombre con fecha actual
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  link.setAttribute("download", `tareas_completadas_${yyyy}-${mm}-${dd}.csv`);
  link.click();
}