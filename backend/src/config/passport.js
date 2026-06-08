const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const servicioAuth = require('../features/auth/services/auth.service');

function obtenerJwtSecret() {
  const secreto = process.env.JWT_SECRET;

  if (!secreto) {
    throw new Error('JWT_SECRET no está configurado en el archivo .env');
  }

  return secreto;
}

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false
    },
    async function verificarUsuario(email, password, done) {
      try {
        const usuario = await servicioAuth.buscarUsuarioPorEmail(email);

        if (!usuario) {
          return done(null, false, {
            message: 'Correo o contraseña incorrectos'
          });
        }

        const passwordValido = await servicioAuth.passwordEsCorrecto(
          password,
          usuario.passwordHash
        );

        if (!passwordValido) {
          return done(null, false, {
            message: 'Correo o contraseña incorrectos'
          });
        }

        return done(null, usuario);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: obtenerJwtSecret()
    },
    async function verificarToken(payload, done) {
      try {
        const usuario = await servicioAuth.buscarUsuarioPorId(payload.sub);

        if (!usuario) {
          return done(null, false);
        }

        return done(null, usuario);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

module.exports = passport;