require('dotenv').config();

const fs = require('fs/promises');
const path = require('path');
const mongoose = require('mongoose');

const connectDB = require('../src/config/db');
const Task = require('../src/features/todolist/models/task.model');
const File = require('../src/features/drive/models/file.model');

const tareasIniciales = require('../seed/datosPruebaTodolist.json');
const archivosIniciales = require('../seed/datosPruebaDrive.json');

const carpetaUploads = path.join(__dirname, '..', 'uploads');

async function crearCarpetaUploads() {
  await fs.mkdir(carpetaUploads, { recursive: true });
}

async function limpiarBaseDeDatos() {
  await Promise.all([
    Task.deleteMany(),
    File.deleteMany()
  ]);
}

async function cargarTareas() {
  await Task.insertMany(tareasIniciales);
}

async function cargarArchivosDemo() {
  await crearCarpetaUploads();

  for (const archivo of archivosIniciales) {
    const nombreGuardado = `seed-${Date.now()}-${archivo.nombreOriginal}`;
    const rutaArchivoDestino = path.join(carpetaUploads, nombreGuardado);

    if (archivo.rutaOrigen) {
      const rutaArchivoOrigen = path.join(__dirname, '..', archivo.rutaOrigen);
      await fs.copyFile(rutaArchivoOrigen, rutaArchivoDestino);
    } else {
      await fs.writeFile(rutaArchivoDestino, archivo.contenido || '', 'utf8');
    }

    const estadisticasArchivo = await fs.stat(rutaArchivoDestino);

    await File.create({
      nombreOriginal: archivo.nombreOriginal,
      nombreVisible: archivo.nombreVisible,
      nombreGuardado,
      rutaArchivo: rutaArchivoDestino,
      tipoMime: archivo.tipoMime,
      tamanioBytes: estadisticasArchivo.size
    });
  }
}

async function ejecutarSeed() {
  try {
    await connectDB();

    await limpiarBaseDeDatos();
    await cargarTareas();
    await cargarArchivosDemo();

    console.log('Base de datos cargada correctamente con datos de prueba');
  } catch (error) {
    console.error('Error al cargar datos iniciales');
    console.error(error);
  } finally {
    await mongoose.connection.close();
  }
}

ejecutarSeed();