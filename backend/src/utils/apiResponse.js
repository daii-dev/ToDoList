function crearMetadatos(req, status, metadataExtra = {}) {
  return {
    version: process.env.APP_VERSION || '1.0.0',
    status,
    method: req.method,
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
    ...metadataExtra
  };
}

function sendSuccess(req, res, options = {}) {
  const {
    status = 200,
    data = null,
    metadata = {},
    links = {},
    errors = null,
    headers = {}
  } = options;

  Object.entries(headers).forEach(function ([nombre, valor]) {
    res.setHeader(nombre, valor);
  });

  return res.status(status).json({
    metadata: crearMetadatos(req, status, metadata),
    data,
    links,
    errors
  });
}

function sendError(req, res, options = {}) {
  const {
    status = 500,
    title = 'Error interno del servidor',
    detail = 'Ocurrió un error inesperado',
    links = {}
  } = options;

  return res.status(status).json({
    metadata: crearMetadatos(req, status),
    data:[],
    links,
    errors: [
      {
        status,
        title,
        detail
      }
    ]
  });
}

module.exports = {
  sendSuccess,
  sendError
};