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
            <p className="home-description">
              Bienvenido {usuario?.nombre}, selecciona un servicio:
            </p>
          </div>
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
          <button
            type="button"
            className="btn-add"
            onClick={onLogout}
          >
            <LogOut size={16} />
            Salir
          </button>
        </div>
      </div>
    </main>
  );
}