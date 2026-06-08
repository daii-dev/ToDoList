const express = require('express');
const morgan = require('morgan');
const taskRoutes = require('./features/todolist/routes/task.routes');
const fileRoutes = require('./features/drive/routes/file.routes');
const { sendSuccess, sendError } = require('./utils/apiResponse');
const passport = require('./config/passport');
const authRoutes = require('./features/auth/routes/auth.routes');
const protegerRuta = require('./middlewares/auth.middleware');
const app = express();

app.disable('x-powered-by');
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use(function (req, res, next) {
  res.setHeader('Version-App', process.env.APP_VERSION || '1.0.0');
  next();
});

app.get('/', function (req, res) {
  return sendSuccess(req, res, {
    data: {
      nombre: 'To Do List',
      descripcion: 'Backend express para gestionar tareas con postman',
      estado: 'Servidor funcionando'
    },
    links: {
      tareas: {
        href: '/api/tasks',
        method: 'GET'
      },
      crearTarea: {
        href: '/api/tasks',
        method: 'POST'
      }
    }
  });
});

app.use('/api', authRoutes);
app.use('/api', protegerRuta,taskRoutes);
app.use('/api', protegerRuta,fileRoutes);

app.use(function (req, res) {
  return sendError(req, res, {
    status: 404,
    title: 'Ruta no encontrada',
    detail: `No existe la ruta ${req.originalUrl}`,
    links: {
      home: {href: '/', method: 'GET'}
    }
  });
});

app.use(function (err, req, res, next) {
  console.error(err);

  if (err.name === 'MulterError') {
    return sendError(req, res, {
      status: 400,
      title: 'Error al subir archivo',
      detail: err.message,
      links: {
        collection: {href: '/api/files', method: 'GET'},
        init: {href: '/api/files/init', method: 'GET'}
      }
    });
  }

  if (err.name === 'ValidationError') {
    const mensajes = Object.values(err.errors).map(function (error) {
      return error.message;
    });

    return sendError(req, res, {
      status: 400,
      title: 'Error de validación',
      detail: mensajes.join('. '),
      links: {
        collection: {href: '/api/tasks', method: 'GET'}
      }
    });
  }

  if (err.name === 'CastError') {
    return sendError(req, res, {
      status: 400,
      title: 'ID inválido',
      detail: 'El identificador enviado no tiene un formato valido',
      links: {
        collection: {href: '/api/tasks', method: 'GET'}
      }
    });
  }

  return sendError(req, res, {
    status: err.status || 500,
    title: err.status === 404 ? 'No encontrado' : 'Error interno del servidor',
    detail: err.message || 'Ocurrió un error inesperado',
    links: {
      collection: {href: '/api/tasks', method: 'GET'}
    }
  });
});

module.exports = app;