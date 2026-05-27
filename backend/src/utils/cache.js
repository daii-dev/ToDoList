const crypto = require('crypto');

function crearETag(contenido) {
  const texto = JSON.stringify(contenido);

  const hash = crypto
    .createHash('sha1')
    .update(texto)
    .digest('hex');

  return `"${hash}"`;
}

function clienteTieneLaMismaVersion(req, etagActual) {
  const etagCliente = req.headers['if-none-match'];

  return etagCliente === etagActual;
}

module.exports = {
  crearETag,
  clienteTieneLaMismaVersion
};