const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const TwoFactorCode = require('../models/twoFactorCode.model');

const MINUTOS_EXPIRACION_2FA = 5;

function generarCodigoTemporal() {
  return crypto.randomInt(100000, 1000000).toString();
}

async function crearDesafio2FA(usuario) {
  await TwoFactorCode.deleteMany({
    usuario: usuario.id,
    usado: false
  });

  const codigo = generarCodigoTemporal();
  const codigoHash = await bcrypt.hash(codigo, 10);

  const expiraEn = new Date(
    Date.now() + MINUTOS_EXPIRACION_2FA * 60 * 1000
  );

  const desafio = await TwoFactorCode.create({
    usuario: usuario.id,
    codigoHash,
    expiraEn
  });

  return {
    loginId: desafio.id,
    codigo,
    expiraEn
  };
}

async function verificarCodigo2FA(loginId, codigo) {
  const desafio = await TwoFactorCode.findById(loginId).select('+codigoHash');

  if (!desafio) {
    return {
      valido: false,
      mensaje: 'El codigo no existe o ya expiró'
    };
  }

  if (desafio.usado) {
    return {
      valido: false,
      mensaje: 'El codigo ya fue usado'
    };
  }

  if (desafio.expiraEn < new Date()) {
    return {
      valido: false,
      mensaje: 'El codigo ya expiró'
    };
  }

  const codigoCorrecto = await bcrypt.compare(codigo, desafio.codigoHash);

  if (!codigoCorrecto) {
    return {
      valido: false,
      mensaje: 'El codigo ingresado no es correcto'
    };
  }

  desafio.usado = true;
  await desafio.save();

  return {
    valido: true,
    usuarioId: desafio.usuario
  };
}

module.exports = {
  crearDesafio2FA,
  verificarCodigo2FA
};