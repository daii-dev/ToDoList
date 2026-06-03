const asyncHandler = require('../../../utils/asyncHandler');
const { sendSuccess } = require('../../../utils/apiResponse');
const servicioArchivos = require('../services/file.service');
const {
  crearLinksArchivo,
  agregarLinksAArchivo,
  crearLinksListadoArchivos
} = require('../utils/fileLinks');
const {
  crearETag,
  clienteTieneLaMismaVersion
} = require('../../../utils/cache');

function crearErrorArchivoNoEncontrado() {
  const error = new Error('El archivo no existe');
  error.status = 404;
  return error;
}

function crearErrorSolicitudInvalida(mensaje) {
  const error = new Error(mensaje);
  error.status = 400;
  return error;
}

exports.iniciarDrive = asyncHandler(async function (req, res) {
  return sendSuccess(req, res, {
    data: {
      servicio: 'Drive',
      descripcion: 'Servicio para subir, listar, descargar, editar y eliminar archivos',
      campoUpload: 'archivo',
      tamanioMaximoMb: 25
    },
    links: crearLinksListadoArchivos()
  });
});

exports.listarArchivos = asyncHandler(async function (req, res) {
  const archivos = await servicioArchivos.listarArchivos();
  const archivosConLinks = archivos.map(agregarLinksAArchivo);

  const metadata = {
    count: archivosConLinks.length
  };

  const links = crearLinksListadoArchivos();

  const contenidoCacheable = {
    metadata,
    data: archivosConLinks,
    links
  };

  const etagActual = crearETag(contenidoCacheable);

  res.setHeader('ETag', etagActual);
  res.setHeader('Cache-Control', 'private, no-cache');

  if (clienteTieneLaMismaVersion(req, etagActual)) {
    return res.status(304).end();
  }

  return sendSuccess(req, res, {
    data: archivosConLinks,
    metadata,
    links
  });
});

exports.obtenerArchivo = asyncHandler(async function (req, res) {
  const archivo = await servicioArchivos.buscarArchivoPorId(req.params.id);

  if (!archivo) {
    throw crearErrorArchivoNoEncontrado();
  }

  const archivoConLinks = agregarLinksAArchivo(archivo);

  return sendSuccess(req, res, {
    data: archivoConLinks,
    links: crearLinksArchivo(archivoConLinks)
  });
});

exports.subirArchivo = asyncHandler(async function (req, res) {
  if (!req.file) {
    throw crearErrorSolicitudInvalida('Debes enviar un archivo en el campo archivo');
  }

  const archivo = await servicioArchivos.crearArchivo(req.file);
  const archivoConLinks = agregarLinksAArchivo(archivo);

  res.setHeader('Location', `/api/files/${archivo.id}`);

  return sendSuccess(req, res, {
    status: 201,
    data: archivoConLinks,
    links: crearLinksArchivo(archivoConLinks)
  });
});

exports.actualizarNombreArchivo = asyncHandler(async function (req, res) {
  if (!req.body.nombreVisible) {
    throw crearErrorSolicitudInvalida('El nombreVisible es obligatorio');
  }

  const archivo = await servicioArchivos.actualizarNombreArchivo(req.params.id, req.body);

  if (!archivo) {
    throw crearErrorArchivoNoEncontrado();
  }

  const archivoConLinks = agregarLinksAArchivo(archivo);

  return sendSuccess(req, res, {
    data: archivoConLinks,
    links: crearLinksArchivo(archivoConLinks)
  });
});

exports.descargarArchivo = asyncHandler(async function (req, res) {
  const archivo = await servicioArchivos.buscarArchivoPorId(req.params.id);

  if (!archivo) {
    throw crearErrorArchivoNoEncontrado();
  }

  res.setHeader('X-File-Id', archivo.id);
  res.setHeader('X-File-Name', archivo.nombreVisible);
  res.setHeader('Content-Type', archivo.tipoMime);
  res.setHeader('Cache-Control', 'private, max-age=0, must-revalidate');

  return res.download(archivo.rutaArchivo, archivo.nombreVisible);
});

exports.eliminarArchivo = asyncHandler(async function (req, res) {
  const archivo = await servicioArchivos.eliminarArchivo(req.params.id);

  if (!archivo) {
    throw crearErrorArchivoNoEncontrado();
  }

  return sendSuccess(req, res, {
    data: {
      id: archivo.id,
      deleted: true
    },
    links: {
      collection: {
        href: '/api/files',
        method: 'GET'
      }
    }
  });
});