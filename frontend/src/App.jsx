import { useState } from 'react';

import { useAuth } from './features/auth/hooks/useAuth';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { TwoFactorPage } from './features/auth/pages/TwoFactorPage';
import { DrivePage } from './features/drive/pages/DrivePage';
import { TaskPage } from './features/todolist/pages/TaskPage';
import { HomePage } from './pages/HomePage';

function App() {
  const [servicioActual, setServicioActual] = useState('home');
  const [pantallaAuth, setPantallaAuth] = useState('login');

  const {
    usuario,
    cargandoAuth,
    desafio2FA,
    registrar,
    login,
    verificar2FA,
    cancelar2FA,
    logout
  } = useAuth();

  function cerrarSesion() {
    logout();
    setServicioActual('home');
    setPantallaAuth('login');
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

  if (!usuario && desafio2FA) {
    return (
      <TwoFactorPage
        desafio2FA={desafio2FA}
        onVerificar={verificar2FA}
        onCancelar={cancelar2FA}
      />
    );
  }

  if (!usuario && pantallaAuth === 'register') {
    return (
      <RegisterPage
        onRegistrar={registrar}
        onMostrarLogin={() => setPantallaAuth('login')}
      />
    );
  }

  if (!usuario) {
    return (
      <LoginPage
        onLogin={login}
        onMostrarRegistro={() => setPantallaAuth('register')}
      />
    );
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