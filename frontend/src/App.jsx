import { useRef, useState } from 'react';
import { TaskForm } from './components/TaskForm';
import { TaskStats } from './components/TaskStats';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { EditTaskModal } from './components/EditTaskModal';
import { Toast } from './components/Toast';
import { useTasks } from './hooks/useTasks';

function App() {
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
  const [mensajeToast, setMensajeToast] = useState('');
  const timeoutToastRef = useRef(null);

  function mostrarMensaje(texto) {
    setMensajeToast(texto);

    if (timeoutToastRef.current) {
      clearTimeout(timeoutToastRef.current);
    }

    timeoutToastRef.current = setTimeout(function () {
      setMensajeToast('');
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

      <Toast mensaje={mensajeToast} />
    </>
  );
}

export default App;