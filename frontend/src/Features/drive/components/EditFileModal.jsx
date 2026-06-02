import { useEffect, useRef, useState } from 'react';
import { Save, X } from 'lucide-react';

export function EditFileModal({ archivo, abierto, onCerrar, onGuardar }) {
  const [nombreVisible, setNombreVisible] = useState('');
  const [nombreInvalido, setNombreInvalido] = useState(false);
  const inputNombreRef = useRef(null);

  useEffect(function () {
    if (archivo) {
      setNombreVisible(archivo.nombreVisible || '');
    }
  }, [archivo]);

  useEffect(function () {
    if (!abierto) return;

    function manejarTecla(evento) {
      if (evento.key === 'Escape') {
        onCerrar();
      }
    }

    document.addEventListener('keydown', manejarTecla);

    return function () {
      document.removeEventListener('keydown', manejarTecla);
    };
  }, [abierto, onCerrar]);

  if (!abierto || !archivo) {
    return null;
  }

  async function manejarGuardar(evento) {
    evento.preventDefault();

    const nombreLimpio = nombreVisible.trim();

    if (!nombreLimpio) {
      setNombreInvalido(true);
      inputNombreRef.current?.focus();

      setTimeout(function () {
        setNombreInvalido(false);
      }, 1200);

      return;
    }

    await onGuardar(archivo.id, nombreLimpio);
  }

  function cerrarDesdeFondo(evento) {
    if (evento.target === evento.currentTarget) {
      onCerrar();
    }
  }

  return (
    <div className="modal-overlay open" onClick={cerrarDesdeFondo}>
      <form className="modal" onSubmit={manejarGuardar}>
        <h2>Editar archivo</h2>

        <div className="form-group">
          <label htmlFor="edit-file-name">Nombre del archivo</label>
          <input
            ref={inputNombreRef}
            type="text"
            id="edit-file-name"
            maxLength="100"
            value={nombreVisible}
            className={nombreInvalido ? 'input-error' : ''}
            onChange={(evento) => setNombreVisible(evento.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" type="button" onClick={onCerrar}>
            <X size={16} />
            Cancelar
          </button>

          <button className="btn-save" type="submit">
            <Save size={16} />
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}