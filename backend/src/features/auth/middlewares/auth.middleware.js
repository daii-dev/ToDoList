const passport = require('../config/passport');
const { sendError } = require('../utils/apiResponse');

function protegerRuta(req, res, next) {
  passport.authenticate('jwt', { session: false }, function (error, usuario) {
    if (error) {
      return next(error);
    }

    if (!usuario) {
      return sendError(req, res, {
        status: 401,
        title: 'No autorizado',
        detail: 'Debes iniciar sesión para acceder a este recurso',
        links: {
          login: {
            href: '/api/auth/login',
            method: 'POST'
          }
        }
      });
    }

    req.user = usuario;
    return next();
  })(req, res, next);
}

module.exports = protegerRuta;