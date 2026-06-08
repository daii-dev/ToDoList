import { useState } from 'react';

import { ShieldCheck } from 'lucide-react';

export function TwoFactorPage({ desafio2FA, onVerificar, onCancelar }) {
  const [codigo, setCodigo] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function manejarVerificacion(evento) {
    evento.preventDefault();

    setMensajeError('');
    setCargando(true);

    try {
      await onVerificar(codigo.trim());
    } catch (error) {
      setMensajeError(error.message || 'Código incorrecto');
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="home-main">
      <form className="add-form home-card" onSubmit={manejarVerificacion}>
        <h2>VERIFICACION</h2>

        <p className="home-description">
          Ingresa el codigo de 6 digitos para completar el inicio de sesión
        </p>

        {desafio2FA?.codigoDesarrollo && (
          <p className="dev-code">
            Codigo 2FA: {desafio2FA.codigoDesarrollo}
          </p>
        )}

        <div className="form-group">
          <label htmlFor="two-factor-code"> </label>
          <input
            id="two-factor-code"
            type="text"
            inputMode="numeric"
            maxLength="6"
            value={codigo}
            onChange={(evento) => setCodigo(evento.target.value)}
          />
        </div>

        {mensajeError && (
          <p className="login-error">
            {mensajeError}
          </p>
        )}

        <button className="btn-add" type="submit" disabled={cargando}>
          <ShieldCheck size={18} />
          {cargando ? 'VERIFICANDO...' : 'VERIFICAR CODIGO'}
        </button>

        <button
          type="button"
          className="btn-add"
          onClick={onCancelar}
        >
          Volver al login
        </button>
      </form>
    </main>
  );
}