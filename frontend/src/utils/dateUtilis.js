export function formatearFecha(fecha) {
  if (!fecha) return '';

  const [anio, mes, dia] = fecha.split('-');

  return `${dia}/${mes}/${anio}`;
}

export function tareaEstaVencida(fecha) {
  if (!fecha) return false;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const fechaLimite = new Date(`${fecha}T00:00:00`);

  return fechaLimite < hoy;
}