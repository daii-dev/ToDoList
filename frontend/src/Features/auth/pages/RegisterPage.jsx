import { useState } from 'react';

import { UserPlus } from 'lucide-react';

export function RegisterPage({ onRegistrar, onMostrarLogin }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function manejarRegistro(evento) {
    evento.preventDefault();

    setMensaje('');
    setMensajeError('');
    setCargando(true);

    try {
      await onRegistrar(nombre.trim(), email.trim(), password);
      setMensaje('Cuenta creada correctamente. Ahora inicia sesión.');
      setNombre('');
      setEmail('');
      setPassword('');
    } catch (error) {
      setMensajeError(error.message || 'No se pudo crear la cuenta');
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="home-main">
      <form className="add-form home-card" onSubmit={manejarRegistro}>
        <h2>CREAR CUENTA</h2>

        <p className="home-description">
          Registra un usuario para ingresar al sistema
        </p>

        <div className="form-group">
          <label htmlFor="register-name">Nombre</label>
          <input
            id="register-name"
            type="text"
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-email">Correo</label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-password">Contraseña</label>
          <input
            id="register-password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
          />
        </div>

        {mensaje && (
          <p className="login-success">
            {mensaje}
          </p>
        )}

        {mensajeError && (
          <p className="login-error">
            {mensajeError}
          </p>
        )}

        <button className="btn-add" type="submit" disabled={cargando}>
          <UserPlus size={18} />
          {cargando ? 'CREANDO...' : 'CREAR CUENTA'}
        </button>

        <button
          type="button"
          className="btn-add"
          onClick={onMostrarLogin}
        >
          Ya tengo cuenta
        </button>
      </form>
    </main>
  );
}