import { useState } from 'react';

import { HomePage } from './pages/HomePage';
import { TaskPage } from './pages/TaskPage';
import { DrivePage } from './features/drive/pages/DrivePage';

function App() {
  const [servicioActual, setServicioActual] = useState('home');

  if (servicioActual === 'tasks') {
    return <TaskPage onVolver={() => setServicioActual('home')} />;
  }
  if (servicioActual === 'drive') {
    return <DrivePage onVolver={() => setServicioActual('home')} />;
  }

  return <HomePage onSeleccionarServicio={setServicioActual} />;
}
export default App;