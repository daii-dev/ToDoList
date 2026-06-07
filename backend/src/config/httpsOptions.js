const fs = require('fs');
const path = require('path');

function resolverRutaDesdeBackend(rutaRelativa) {
  if (path.isAbsolute(rutaRelativa)) {
    return rutaRelativa;
  }

  return path.join(__dirname, '..', '..', rutaRelativa);
}

function leerArchivoPem(rutaArchivo, nombreArchivo) {
  if (!fs.existsSync(rutaArchivo)) {
    throw new Error(
      `No se encontró ${nombreArchivo}. Revisa que exista el archivo en: ${rutaArchivo}`
    );
  }

  return fs.readFileSync(rutaArchivo);
}

function obtenerOpcionesHttps() {
  const rutaKey = resolverRutaDesdeBackend(
    process.env.SSL_KEY_PATH || 'certs/key.pem'
  );

  const rutaCert = resolverRutaDesdeBackend(
    process.env.SSL_CERT_PATH || 'certs/cert.pem'
  );

  return {
    key: leerArchivoPem(rutaKey, 'key.pem'),
    cert: leerArchivoPem(rutaCert, 'cert.pem')
  };
}

module.exports = obtenerOpcionesHttps;