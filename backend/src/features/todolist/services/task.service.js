const Task = require('../models/task.model');

function crearFiltroTareas(filtro) {
  if (filtro === 'done') {
    return { done: true };
  }

  if (filtro === 'pending') {
    return { done: false };
  }

  return {};
}

async function contarTareas() {
  const [total, hechas, pendientes] = await Promise.all([
    Task.countDocuments(),
    Task.countDocuments({ done: true }),
    Task.countDocuments({ done: false })
  ]);

  return {total, done: hechas, pending: pendientes};
}

async function listarTareas(filtro = 'all') {
  const filtroTareas = crearFiltroTareas(filtro);
  const [tareas, estadisticas] = await Promise.all([
    Task.find(filtroTareas).sort({ createdAt: -1 }),
    contarTareas(),
  ]);

  return {
    tareas,
    estadisticas,
  };
}

async function buscarTareaPorId(id) {
  return Task.findById(id);
}

async function crearTarea(datos) {
  return Task.create({
    title: datos.title,
    date: datos.date,
    done: false
  });
}

async function actualizarTareaCompleta(id, datos) {
  return Task.findByIdAndUpdate(
    id,
    {title: datos.title, 
      date: datos.date || ''},
    {returnDocument: 'after', 
      runValidators: true}
  );
}

async function cambiarEstadoTarea(id, cuerpo) {
  return Task.findByIdAndUpdate(
    id,
    {done: cuerpo.done},
    {returnDocument: 'after', 
      runValidators: true}
  );
}

async function eliminarTarea(id) {
  return Task.findByIdAndDelete(id);
}

module.exports = {
  listarTareas,
  buscarTareaPorId,
  crearTarea,
  actualizarTareaCompleta,
  cambiarEstadoTarea,
  eliminarTarea
};