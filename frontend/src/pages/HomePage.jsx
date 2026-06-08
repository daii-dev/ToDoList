import {
  CheckSquare,
  Cloud,
  LogOut,
} from 'lucide-react';

export function HomePage({ usuario, onLogout, onSeleccionarServicio }) {
  return (
    <main className="home-main">
      <div className="add-form home-card">
        <div className="home-header">
          <div>
            <h2>MI SISTEMA</h2>
            <p className="home-description">
              Bienvenido, {usuario?.nombre}. Selecciona un servicio.
            </p>
          </div>

          <button
            type="button"
            className="btn-logout"
            onClick={onLogout}
          >
            <LogOut size={16} />
            Salir
          </button>
        </div>
        
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