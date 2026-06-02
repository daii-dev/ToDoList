import { ClipboardList } from 'lucide-react';
import { TaskCard } from './TaskCard';

export function TaskList({ tareas, cargando, onCambiarEstado, onEditar, onEliminar }) {
  if (cargando) {
    return (
      <div className="empty-state">
        <ClipboardList size={42} />
        <p>Cargando tareas...</p>
      </div>
    );
  }

  if (tareas.length === 0) {
    return (
      <div className="empty-state">
        <ClipboardList size={42} />
        <p>No tienes tareas</p>
      </div>
    );
  }

  return (
    <div id="task-list">
      {tareas.map(function (tarea) {
        return (
          <TaskCard
            key={tarea.id}
            tarea={tarea}
            onCambiarEstado={onCambiarEstado}
            onEditar={onEditar}
            onEliminar={onEliminar}
          />
        );
      })}
    </div>
  );
}