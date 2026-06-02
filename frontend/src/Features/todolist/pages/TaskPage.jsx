import {
  useRef,
  useState,
} from 'react';

import { ArrowLeft } from 'lucide-react';

import { EditTaskModal } from '../components/EditTaskModal';
import { MensajeAviso } from '../../../components/MensajeAviso';
import { TaskFilters } from '../components/TaskFilters';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { TaskStats } from '../components/TaskStats';
import { useTasks } from '../hooks/useTasks';

export function TaskPage({ onVolver }) {
  const {
    tareas,
    estadisticas,
    filtroActual,
    setFiltroActual,
    cargando,
    crearNuevaTarea,
    actualizarTarea,
    cambiarEstado,
    borrarTarea
  } = useTasks();

  const [tareaEditando, setTareaEditando] = useState(null);
  const [mensajeAviso, setMensajeAviso] = useState('');
  const temporizadorAvisoRef = useRef(null);

  function mostrarMensaje(texto) {
    setMensajeAviso(texto);

    if (temporizadorAvisoRef.current) {
      clearTimeout(temporizadorAvisoRef.current);
    }

    temporizadorAvisoRef.current = setTimeout(function () {
      setMensajeAviso('');
    }, 2200);
  }

  function mostrarError(error) {
    console.error(error);
    mostrarMensaje(error.message || 'Error inesperado');
  }

  async function manejarCrearTarea(datosTarea) {
    try {
      await crearNuevaTarea(datosTarea);
      mostrarMensaje('Tarea añadida');
    } catch (error) {
      mostrarError(error);
    }
  }

  async function manejarCambiarEstado(tarea) {
    try {
      await cambiarEstado(tarea);
      mostrarMensaje(tarea.done ? 'Marcada como pendiente' : 'Tarea completada');
    } catch (error) {
      mostrarError(error);
    }
  }

  async function manejarEliminarTarea(id) {
    try {
      await borrarTarea(id);
      mostrarMensaje('Tarea eliminada');
    } catch (error) {
      mostrarError(error);
    }
  }

  async function manejarGuardarEdicion(id, datosTarea) {
    try {
      await actualizarTarea(id, datosTarea);
      setTareaEditando(null);
      mostrarMensaje('Tarea actualizada');
    } catch (error) {
      mostrarError(error);
    }
  }

  return (
    <>
      <main>
        <button className="btn-back" type="button" onClick={onVolver}>
          <ArrowLeft size={16} />
          Volver
        </button>

        <TaskForm onCrearTarea={manejarCrearTarea} />

        <TaskStats estadisticas={estadisticas} />

        <TaskFilters
          filtroActual={filtroActual}
          onCambiarFiltro={setFiltroActual}
        />

        <TaskList
          tareas={tareas}
          cargando={cargando}
          onCambiarEstado={manejarCambiarEstado}
          onEditar={setTareaEditando}
          onEliminar={manejarEliminarTarea}
        />
      </main>

      <EditTaskModal
        abierto={Boolean(tareaEditando)}
        tarea={tareaEditando}
        onCerrar={() => setTareaEditando(null)}
        onGuardar={manejarGuardarEdicion}
      />

      <MensajeAviso mensaje={mensajeAviso} />
    </>
  );
}