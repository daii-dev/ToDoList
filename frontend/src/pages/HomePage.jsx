import {
  CheckSquare,
  Cloud,
} from 'lucide-react';

export function HomePage({ onSeleccionarServicio }) {
  return (
    <main className="home-main">
      <div className="add-form home-card">
        <div className="service-grid">
          <button
            type="button"
            className="service-card"
            onClick={() => onSeleccionarServicio('tasks')}
          >
            <CheckSquare size={32} />
            <span>To Do List</span>
          </button>

          <button
            type="button"
            className="service-card"
            onClick={() => onSeleccionarServicio('drive')}
          >
            <Cloud size={32} />
            <span>Drive</span>
          </button>
        </div>
      </div>
    </main>
  );
}