const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const servicioTareas = require('../services/task.service');

function crearErrorNoEncontrada() {
  const error = new Error('La tarea no existe');
  error.status = 404;
  return error;
}

exports.listarTareas = asyncHandler(async function (req, res) {
  const resultado = await servicioTareas.listarTareas();

  return sendSuccess(res, {
    data: resultado.tareas,
    metadata: {
      count: resultado.tareas.length,
      stats: resultado.estadisticas
    },
    links: {
      self: req.originalUrl
    }
  });
});

exports.obtenerTarea = asyncHandler(async function (req, res) {
  const tarea = await servicioTareas.buscarTareaPorId(req.params.id);

  if (!tarea) {
    throw crearErrorNoEncontrada();
  }

  return sendSuccess(res, {
    data: tarea,
    links: {
      self: req.originalUrl
    }
  });
});

exports.crearTarea = asyncHandler(async function (req, res) {
  const tarea = await servicioTareas.crearTarea(req.body);

  res.setHeader('Location', `/api/tasks/${tarea.id}`);

  return sendSuccess(res, {
    status: 201,
    data: tarea,
    links: {
      self: `/api/tasks/${tarea.id}`,
      collection: '/api/tasks'
    }
  });
});

exports.actualizarTarea = asyncHandler(async function (req, res) {
  const tarea = await servicioTareas.actualizarTarea(req.params.id, req.body);

  if (!tarea) {
    throw crearErrorNoEncontrada();
  }

  return sendSuccess(res, {
    data: tarea,
    links: {
      self: `/api/tasks/${tarea.id}`,
      collection: '/api/tasks'
    }
  });
});

exports.eliminarTarea = asyncHandler(async function (req, res) {
  const tarea = await servicioTareas.eliminarTarea(req.params.id);

  if (!tarea) {
    throw crearErrorNoEncontrada();
  }

  return sendSuccess(res, {
    data: {
      id: tarea.id,
      deleted: true
    },
    links: {
      collection: '/api/tasks'
    }
  });
});