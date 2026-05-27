const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const servicioTareas = require('../services/task.service');
const {agregarLinksATarea, crearLinksTarea, crearLinksListado} = require('../utils/taskLinks');
const {crearETag, clienteTieneLaMismaVersion} = require('../utils/cache');

function crearErrorNoEncontrada() {
  const error = new Error('La tarea no existe');
  error.status = 404;
  return error;
}

function crearErrorSolicitudInvalida(mensaje) {
  const error = new Error(mensaje);
  error.status = 400;
  return error;
}

function normalizarFiltro(filtro) {
  const filtrosPermitidos = ['all', 'pending', 'done'];

  if (filtrosPermitidos.includes(filtro)) {
    return filtro;
  }

  return 'all';
}

exports.listarTareas = asyncHandler(async function (req, res) {
  const filtro = normalizarFiltro(req.query.filter || 'all');
  const resultado = await servicioTareas.listarTareas(filtro);

  const tareasConLinks = resultado.tareas.map(agregarLinksATarea);

  const metadata = {
    count: tareasConLinks.length,
    filter: filtro,
    stats: resultado.estadisticas
  };

  const links = crearLinksListado(filtro);

  const contenidoCacheable = {
    metadata,
    data: tareasConLinks,
    links
  };

  const etagActual = crearETag(contenidoCacheable);
  res.setHeader('ETag', etagActual);
  res.setHeader('Cache-Control', 'private, no-cache');

  if (clienteTieneLaMismaVersion(req, etagActual)) {
    return res.status(304).end();
  }

  return sendSuccess(req, res, {
    data: tareasConLinks,
    metadata,
    links
  });
});

exports.obtenerTarea = asyncHandler(async function (req, res) {
  const tarea = await servicioTareas.buscarTareaPorId(req.params.id);

  if (!tarea) {
    throw crearErrorNoEncontrada();
  }

  const tareaConLinks = agregarLinksATarea(tarea);

  return sendSuccess(req, res, {
    data: tareaConLinks,
    links: crearLinksTarea(tareaConLinks)
  });
});

exports.crearTarea = asyncHandler(async function (req, res) {
  const tarea = await servicioTareas.crearTarea(req.body);
  const tareaConLinks = agregarLinksATarea(tarea);

  res.setHeader('Location', `/api/tasks/${tarea.id}`);

  return sendSuccess(req, res, {
    status: 201,
    data: tareaConLinks,
    links: {
      self: {
        href: `/api/tasks/${tarea.id}`,
        method: 'GET'
      },
      collection: {
        href: '/api/tasks',
        method: 'GET'
      }
    }
  });
});

exports.actualizarTareaCompleta = asyncHandler(async function (req, res) {
  if (!req.body.title) {
    throw crearErrorSolicitudInvalida('El titulo es obligatorio para actualizar toda la tarea');
  }

  const tarea = await servicioTareas.actualizarTareaCompleta(req.params.id, req.body);

  if (!tarea) {
    throw crearErrorNoEncontrada();
  }

  const tareaConLinks = agregarLinksATarea(tarea);

  return sendSuccess(req, res, {
    data: tareaConLinks,
    links: crearLinksTarea(tareaConLinks)
  });
});

exports.cambiarEstadoTarea = asyncHandler(async function (req, res) {
  if (typeof req.body.done !== 'boolean') {
    throw crearErrorSolicitudInvalida('El campo done debe ser true o false');
  }

  const tarea = await servicioTareas.cambiarEstadoTarea(req.params.id, req.body);

  if (!tarea) {
    throw crearErrorNoEncontrada();
  }

  const tareaConLinks = agregarLinksATarea(tarea);

  return sendSuccess(req, res, {
    data: tareaConLinks,
    links: crearLinksTarea(tareaConLinks)
  });
});

exports.eliminarTarea = asyncHandler(async function (req, res) {
  const tarea = await servicioTareas.eliminarTarea(req.params.id);

  if (!tarea) {
    throw crearErrorNoEncontrada();
  }

  return sendSuccess(req, res, {
    data: {id: tarea.id, deleted: true},
    links: {
      collection: {
        href: '/api/tasks',
        method: 'GET'
      }
    }
  });
});