import { CalendarDays, Check, Pencil, Trash2 } from 'lucide-react';
import { formatearFecha, tareaEstaVencida } from '../utils/dateUtils';

export function TaskCard({ tarea, onCambiarEstado, onEditar, onEliminar }) {
  const estaVencida = !tarea.done && tareaEstaVencida(tarea.date);

  return (
    <div className={`task-card ${tarea.done ? 'done' : ''}`}>
      <button
        type="button"
        className={`task-check ${tarea.done ? 'checked' : ''}`}
        aria-label={tarea.done ? 'Marcar como pendiente' : 'Marcar como completada'}
        aria-checked={tarea.done}
        onClick={() => onCambiarEstado(tarea)}
      >
        <Check size={14} />
      </button>

      <div className="task-content">
        <div className="task-title">{tarea.title}</div>

        {tarea.date && (
          <span className={`task-date ${estaVencida ? 'overdue' : ''}`}>
            <CalendarDays size={13} />
            {formatearFecha(tarea.date)}
            {estaVencida ? ' · Vencida' : ''}
          </span>
        )}
      </div>

      <div className="task-actions">
        <button
          type="button"
          className="btn-edit"
          title="Editar"
          onClick={() => onEditar(tarea)}
        >
          <Pencil size={14} />
          Editar
        </button>

        <button
          type="button"
          className="btn-delete"
          title="Eliminar"
          onClick={() => onEliminar(tarea.id)}
        >
          <Trash2 size={14} />
          Eliminar
        </button>
      </div>
    </div>
  );
}