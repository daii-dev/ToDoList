export function formatearFecha(fecha) {
  if (!fecha) return "Sin fecha";

  const fechaObj = new Date(fecha);

  if (isNaN(fechaObj.getTime())) {
    return "Fecha inválida";
  }

  return fechaObj.toLocaleDateString("es-BO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function tareaEstaVencida(fecha, completada = false) {
  if (!fecha || completada) return false;

  const hoy = new Date();
  const fechaTarea = new Date(fecha);

  hoy.setHours(0, 0, 0, 0);
  fechaTarea.setHours(0, 0, 0, 0);

  return fechaTarea < hoy;
}