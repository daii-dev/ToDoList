import { useCallback, useEffect, useState } from 'react';
import {
  obtenerArchivos,
  subirArchivo,
  editarNombreArchivo,
  eliminarArchivo
} from '../services/fileService';

export function useDriveFiles() {
  const [archivos, setArchivos] = useState([]);
  const [cargando, setCargando] = useState(false);

  const cargarArchivos = useCallback(async function () {
    setCargando(true);

    try {
      const respuesta = await obtenerArchivos();
      setArchivos(respuesta.data || []);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(function () {
    cargarArchivos();
  }, [cargarArchivos]);

  async function subirNuevoArchivo(archivo) {
    await subirArchivo(archivo);
    await cargarArchivos();
  }

  async function actualizarNombreArchivo(id, nombreVisible) {
    await editarNombreArchivo(id, nombreVisible);
    await cargarArchivos();
  }

  async function borrarArchivo(id) {
    await eliminarArchivo(id);
    await cargarArchivos();
  }

  return {
    archivos,
    cargando,
    cargarArchivos,
    subirNuevoArchivo,
    actualizarNombreArchivo,
    borrarArchivo
  };
}