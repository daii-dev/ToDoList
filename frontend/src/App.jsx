import { useState } from 'react';

import { HomePage } from './pages/HomePage';
import { TaskPage } from './pages/TaskPage';

function App() {
  const [servicioActual, setServicioActual] = useState('home');

  if (servicioActual === 'tasks') {
    return <TaskPage onVolver={() => setServicioActual('home')} />;
  }
  if (servicioActual === 'drive') {
    return (
      <main>
        <button className="btn-back" type="button" onClick={() => setServicioActual('home')}>
          Volver
        </button>

        <div className="add-form">
          <h2>DRIVE</h2>
        </div>
      </main>
    );
  }

  return <HomePage onSeleccionarServicio={setServicioActual} />;
}
export default App;