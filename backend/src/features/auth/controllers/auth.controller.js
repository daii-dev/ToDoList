const jwt = require('jsonwebtoken');
const passport = require('../../../config/passport');
const asyncHandler = require('../../../utils/asyncHandler');
const { sendSuccess } = require('../../../utils/apiResponse');
const servicioAuth = require('../services/auth.service');

function crearErrorSolicitud(mensaje) {
  const error = new Error(mensaje);
  error.status = 400;
  return error;
}

function crearToken(usuario) {
  return jwt.sign(
    {
      sub: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '2h'
    }
  );
}

exports.registrarUsuario = asyncHandler(async function (req, res) {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    throw crearErrorSolicitud('Nombre, email y password son obligatorios');
  }

  const existeCorreo = await servicioAuth.correoExiste(email);

  if (existeCorreo) {
    throw crearErrorSolicitud('Ya existe un usuario con ese correo');
  }

  const usuario = await servicioAuth.crearUsuario({
    nombre,
    email,
    password
  });

  const token = crearToken(usuario);

  return sendSuccess(req, res, {
    status: 201,
    data: {
      usuario,
      token
    },
    links: {
      perfil: {
        href: '/api/auth/me',
        method: 'GET'
      },
      login: {
        href: '/api/auth/login',
        method: 'POST'
      }
    }
  });
});

exports.iniciarSesion = function (req, res, next) {
  passport.authenticate('local', { session: false }, function (error, usuario, info) {
    if (error) {
      return next(error);
    }

    if (!usuario) {
      return sendSuccess(req, res, {
        status: 401,
        data: [],
        links: {
          login: {
            href: '/api/auth/login',
            method: 'POST'
          }
        },
        metadata: {
          autenticado: false
        }
      });
    }

    const token = crearToken(usuario);

    return sendSuccess(req, res, {
      data: {
        usuario,
        token
      },
      metadata: {
        autenticado: true,
        mensaje: info?.message || 'Inicio de sesión correcto'
      },
      links: {
        perfil: {
          href: '/api/auth/me',
          method: 'GET'
        },
        tareas: {
          href: '/api/tasks',
          method: 'GET'
        },
        archivos: {
          href: '/api/files',
          method: 'GET'
        }
      }
    });
  })(req, res, next);
};

exports.obtenerPerfil = asyncHandler(async function (req, res) {
  return sendSuccess(req, res, {
    data: {
      usuario: req.user
    },
    links: {
      tareas: {
        href: '/api/tasks',
        method: 'GET'
      },
      archivos: {
        href: '/api/files',
        method: 'GET'
      }
    }
  });
});