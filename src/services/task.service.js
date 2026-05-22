const Task = require('../models/task.model');

async function contarTareas() {
  const [total, hechas, pendientes] = await Promise.all([
    Task.countDocuments(),
    Task.countDocuments({ done: true }),
    Task.countDocuments({ done: false })
  ]);

  return {
    total,
    done: hechas,
    pending: pendientes
  };
}

async function listarTareas() {
  const [tareas, estadisticas] = await Promise.all([
    Task.find().sort({ createdAt: -1 }),
    contarTareas()
  ]);

  return {
    tareas,
    estadisticas
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

function obtenerDatosPermitidos(cuerpo) {
  const datos = {};

  if (cuerpo.title !== undefined) {
    datos.title = cuerpo.title;
  }

  if (cuerpo.date !== undefined) {
    datos.date = cuerpo.date;
  }

  if (cuerpo.done !== undefined) {
    datos.done = cuerpo.done;
  }

  return datos;
}

async function actualizarTarea(id, cuerpo) {
  const datosPermitidos = obtenerDatosPermitidos(cuerpo);

  return Task.findByIdAndUpdate(id, datosPermitidos, {
    returnDocument: 'after',
    runValidators: true
  });
}

async function eliminarTarea(id) {
  return Task.findByIdAndDelete(id);
}

module.exports = {
  listarTareas,
  buscarTareaPorId,
  crearTarea,
  actualizarTarea,
  eliminarTarea
};