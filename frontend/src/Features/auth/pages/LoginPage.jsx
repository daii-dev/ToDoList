import { useState } from 'react';

import { Lock } from 'lucide-react';

export function LoginPage({ onLogin, onMostrarRegistro }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function manejarLogin(evento) {
    evento.preventDefault();

    setMensajeError('');
    setCargando(true);

    try {
      await onLogin(email.trim(), password);
    } catch (error) {
      setMensajeError(error.message || 'No se pudo iniciar sesión');
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="home-main">
      <form className="add-form home-card" onSubmit={manejarLogin}>
        <h2>INICIAR SESION</h2>

        <p className="home-description">
          Ingresa con tu correo y contraseña
        </p>

        <div className="form-group">
          <label htmlFor="login-email">Correo</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Contraseña</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
          />
        </div>

        {mensajeError && (
          <p className="login-error">
            {mensajeError}
          </p>
        )}

        <button className="btn-add" type="submit" disabled={cargando}>
          <Lock size={18} />
          {cargando ? 'VALIDANDO...' : 'CONTINUAR'}
        </button>
        <button
          type="button"
          className="btn-add"
          onClick={onMostrarRegistro}
        >
          Crear una cuenta
        </button>
      </form>
    </main>
  );
}