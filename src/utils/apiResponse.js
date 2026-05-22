function sendSuccess(res, options = {}) {
  const {
    status = 200,
    data = null,
    metadata = {},
    links = {},
    errors = null
  } = options;

  return res.status(status).json({
    metadata: {
      version: process.env.APP_VERSION || '1.0.0',
      ...metadata
    },
    data,
    links,
    errors
  });
}

function sendError(res, options = {}) {
  const {
    status = 500,
    title = 'Error interno del servidor',
    detail = 'Ocurrió un error inesperado',
    links = {}
  } = options;

  return res.status(status).json({
    metadata: {
      version: process.env.APP_VERSION || '1.0.0'
    },
    data: null,
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