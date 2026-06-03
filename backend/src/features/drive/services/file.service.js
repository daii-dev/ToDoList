const fs = require('fs/promises');
const File = require('../models/file.model');

async function listarArchivos() {
  return File.find().sort({ createdAt: -1 });
}

async function buscarArchivoPorId(id) {
  return File.findById(id);
}

async function crearArchivo(datosArchivo) {
  return File.create({
    nombreOriginal: datosArchivo.originalname,
    nombreVisible: datosArchivo.originalname,
    nombreGuardado: datosArchivo.filename,
    rutaArchivo: datosArchivo.path,
    tipoMime: datosArchivo.mimetype,
    tamanioBytes: datosArchivo.size
  });
}

async function actualizarNombreArchivo(id, datos) {
  return File.findByIdAndUpdate(
    id,
    {
      nombreVisible: datos.nombreVisible
    },
    {
      returnDocument: 'after',
      runValidators: true
    }
  );
}

async function eliminarArchivo(id) {
  const archivo = await File.findById(id);

  if (!archivo) {
    return null;
  }

  await fs.unlink(archivo.rutaArchivo).catch(function () {
    return null;
  });

  await File.findByIdAndDelete(id);

  return archivo;
}

module.exports = {
  listarArchivos,
  buscarArchivoPorId,
  crearArchivo,
  actualizarNombreArchivo,
  eliminarArchivo
};