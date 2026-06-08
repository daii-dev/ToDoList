const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

async function buscarUsuarioPorEmail(email) {
  return User.findOne({ email }).select('+passwordHash');
}

async function buscarUsuarioPorId(id) {
  return User.findById(id);
}

async function correoExiste(email) {
  const usuario = await User.findOne({ email });
  return Boolean(usuario);
}

async function crearUsuario(datosUsuario) {
  const passwordHash = await bcrypt.hash(datosUsuario.password, 10);

  return User.create({
    nombre: datosUsuario.nombre,
    email: datosUsuario.email,
    passwordHash
  });
}

async function passwordEsCorrecto(passwordPlano, passwordHash) {
  return bcrypt.compare(passwordPlano, passwordHash);
}

module.exports = {
  buscarUsuarioPorEmail,
  buscarUsuarioPorId,
  correoExiste,
  crearUsuario,
  passwordEsCorrecto
};