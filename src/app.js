const express = require('express');
const morgan = require('morgan');
const taskRoutes = require('./routes/task.routes');
const { sendSuccess, sendError } = require('./utils/apiResponse');

const app = express();

app.disable('x-powered-by');

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.setHeader('X-App-Version', process.env.APP_VERSION || '1.0.0');

  if (req.path.startsWith('/api')) {
    res.setHeader('Cache-Control', 'no-store');
  }

  next();
});

app.get('/', function (req, res) {
  return sendSuccess(res, {
    data: {
      nombre: 'To Do List',
      descripcion: 'Backend express para gestionar tareas con postman',
      estado: 'Servidor funcionando'
    },
    links: {
      tareas: '/api/tasks'
    }
  });
});

app.use('/api', taskRoutes);

app.use(function (req, res) {
  return sendError(res, {
    status: 404,
    title: 'Ruta no encontrada',
    detail: `No existe la ruta ${req.originalUrl}`,
    links: {
      self: req.originalUrl
    }
  });
});

app.use(function (err, req, res, next) {
  console.error(err);

  if (err.name === 'ValidationError') {
    const mensajes = Object.values(err.errors).map(function (error) {
      return error.message;
    });

    return sendError(res, {
      status: 400,
      title: 'Error de validación',
      detail: mensajes.join('. '),
      links: {
        self: req.originalUrl
      }
    });
  }

  if (err.name === 'CastError') {
    return sendError(res, {
      status: 400,
      title: 'ID inválido',
      detail: 'El identificador enviado no tiene un formato válido',
      links: {
        self: req.originalUrl
      }
    });
  }

  return sendError(res, {
    status: err.status || 500,
    title: err.status === 404 ? 'No encontrado' : 'Error interno del servidor',
    detail: err.message || 'Ocurrió un error inesperado',
    links: {
      self: req.originalUrl
    }
  });
});

module.exports = app;