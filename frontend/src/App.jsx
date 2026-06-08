import { useState } from 'react';

import { useAuth } from './features/auth/hooks/useAuth';
import { LoginPage } from './features/auth/pages/LoginPage';
import { DrivePage } from './features/drive/pages/DrivePage';
import { TaskPage } from './features/todolist/pages/TaskPage';
import { HomePage } from './pages/HomePage';

function App() {
  const [servicioActual, setServicioActual] = useState('home');
  const { usuario, cargandoAuth, login, logout } = useAuth();

  function cerrarSesion() {
    logout();
    setServicioActual('home');
  }

  if (cargandoAuth) {
    return (
      <main className="home-main">
        <div className="add-form home-card">
          <h2>Cargando...</h2>
        </div>
      </main>
    );
  }

  if (!usuario) {
    return <LoginPage onLogin={login} />;
  }

  if (servicioActual === 'tasks') {
    return <TaskPage onVolver={() => setServicioActual('home')} />;
  }
  if (servicioActual === 'drive') {
    return <DrivePage onVolver={() => setServicioActual('home')} />;
  }

  return (
    <HomePage
      usuario={usuario}
      onLogout={cerrarSesion}
      onSeleccionarServicio={setServicioActual}
    />
  );
}
export default App;