const express = require('express');
const passport = require('../../../config/passport');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/auth/register', authController.registrarUsuario);
router.post('/auth/login', authController.iniciarSesion);

router.get(
  '/auth/me',
  passport.authenticate('jwt', { session: false }),
  authController.obtenerPerfil
);

module.exports = router;