import { useCallback, useEffect, useState } from 'react';
import {
  obtenerTareas,
  crearTarea,
  actualizarTareaCompleta,
  cambiarEstadoTarea,
  eliminarTarea
} from '../services/taskService';

const ESTADISTICAS_INICIALES = {
  total: 0,
  done: 0,
  pending: 0
};

export function useTasks() {
  const [tareas, setTareas] = useState([]);
  const [estadisticas, setEstadisticas] = useState(ESTADISTICAS_INICIALES);
  const [filtroActual, setFiltroActual] = useState('all');
  const [cargando, setCargando] = useState(false);

  const cargarTareas = useCallback(async function () {
    setCargando(true);

    try {
      const respuesta = await obtenerTareas(filtroActual);

      setTareas(respuesta.data || []);
      setEstadisticas(respuesta.metadata?.stats || ESTADISTICAS_INICIALES);
    } finally {
      setCargando(false);
    }
  }, [filtroActual]);

  useEffect(function () {
    cargarTareas();
  }, [cargarTareas]);

  async function crearNuevaTarea(datosTarea) {
    await crearTarea(datosTarea);
    await cargarTareas();
  }

  async function actualizarTarea(id, datosTarea) {
    await actualizarTareaCompleta(id, datosTarea);
    await cargarTareas();
  }

  async function cambiarEstado(tarea) {
    await cambiarEstadoTarea(tarea.id, !tarea.done);
    await cargarTareas();
  }

  async function borrarTarea(id) {
    await eliminarTarea(id);
    await cargarTareas();
  }

  return {
    tareas,
    estadisticas,
    filtroActual,
    setFiltroActual,
    cargando,
    cargarTareas,
    crearNuevaTarea,
    actualizarTarea,
    cambiarEstado,
    borrarTarea
  };
}