const jwt = require('jsonwebtoken');
const passport = require('../../../config/passport');
const asyncHandler = require('../../../utils/asyncHandler');
const { sendSuccess, sendError } = require('../../../utils/apiResponse');
const servicioAuth = require('../services/auth.service');
const servicio2FA = require('../services/twoFactor.service');

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

function incluirCodigoEnDesarrollo(codigo) {
  return process.env.MOSTRAR_CODIGO_2FA === 'true' ? codigo : undefined;
}

async function crearRespuestaSegundoPaso(req, res, usuario) {
  const desafio = await servicio2FA.crearDesafio2FA(usuario);

  console.log('Codigo 2FA:', desafio.codigo);

  return sendSuccess(req, res, {
    status: 200,
    data: {
      requiereSegundoPaso: true,
      loginId: desafio.loginId,
      expiraEn: desafio.expiraEn,
      codigoDesarrollo: incluirCodigoEnDesarrollo(desafio.codigo)
    },
    metadata: {
      autenticado: false,
      pasoActual: 'verificar_codigo',
      mensaje: 'Credenciales correctas. Ingresa el código de verificación.'
    },
    links: {
      verificarCodigo: {
        href: '/api/auth/verify-2fa',
        method: 'POST'
      },
      login: {
        href: '/api/auth/login',
        method: 'POST'
      }
    }
  });
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

  return sendSuccess(req, res, {
    status: 201,
    data: {
      usuario
    },
    metadata: {
      mensaje: 'Cuenta creada correctamente. Ahora puedes iniciar sesión.'
    },
    links: {
      login: {
        href: '/api/auth/login',
        method: 'POST'
      }
    }
  });
});

exports.iniciarSesion = function (req, res, next) {
  passport.authenticate('local', { session: false }, async function (error, usuario) {
    if (error) {
      return next(error);
    }

    if (!usuario) {
      return sendError(req, res, {
        status: 401,
        title: 'Credenciales incorrectas',
        detail: 'Correo o contraseña incorrectos',
        links: {
          login: {
            href: '/api/auth/login',
            method: 'POST'
          }
        }
      });
    }

    try {
      return await crearRespuestaSegundoPaso(req, res, usuario);
    } catch (error2FA) {
      return next(error2FA);
    }
  })(req, res, next);
};

exports.verificarSegundoPaso = asyncHandler(async function (req, res) {
  const { loginId, codigo } = req.body;

  if (!loginId || !codigo) {
    throw crearErrorSolicitud('loginId y codigo son obligatorios');
  }

  const resultado = await servicio2FA.verificarCodigo2FA(loginId, codigo);

  if (!resultado.valido) {
    return sendError(req, res, {
      status: 401,
      title: 'Codigo inválido',
      detail: resultado.mensaje,
      links: {
        login: {
          href: '/api/auth/login',
          method: 'POST'
        }
      }
    });
  }

  const usuario = await servicioAuth.buscarUsuarioPorId(resultado.usuarioId);

  if (!usuario) {
    return sendError(req, res, {
      status: 404,
      title: 'Usuario no encontrado',
      detail: 'No se encontró el usuario relacionado al código',
      links: {
        login: {
          href: '/api/auth/login',
          method: 'POST'
        }
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
      mensaje: 'Autenticación en 2 pasos completada'
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
});

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