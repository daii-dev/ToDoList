import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Save,
  X,
} from 'lucide-react';

export function EditTaskModal({ tarea, abierto, onCerrar, onGuardar }) {
  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState('');
  const [tituloInvalido, setTituloInvalido] = useState(false);
  const inputTituloRef = useRef(null);

  useEffect(function () {
    if (tarea) {
      setTitulo(tarea.title || '');
      setFecha(tarea.date || '');
    }
  }, [tarea]);

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

  if (!abierto || !tarea) {
    return null;
  }

  async function manejarGuardar(evento) {
    evento.preventDefault();

    const tituloLimpio = titulo.trim();

    if (!tituloLimpio) {
      setTituloInvalido(true);
      inputTituloRef.current?.focus();

      setTimeout(function () {
        setTituloInvalido(false);
      }, 1200);

      return;
    }

    await onGuardar(tarea.id, {
      titulo: tituloLimpio,
      fecha
    });
  }

  function cerrarDesdeFondo(evento) {
    if (evento.target === evento.currentTarget) {
      onCerrar();
    }
  }

  return (
    <div className="modal-overlay open" onClick={cerrarDesdeFondo}>
      <form className="modal" onSubmit={manejarGuardar}>
        <h2>Editar tarea</h2>

        <div className="form-group">
          <label htmlFor="edit-title">Título</label>
          <input
            ref={inputTituloRef}
            type="text"
            id="edit-title"
            maxLength="50"
            value={titulo}
            className={tituloInvalido ? 'input-error' : ''}
            onChange={(evento) => setTitulo(evento.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="edit-date">Fecha</label>
          <input
            type="date"
            id="edit-date"
            value={fecha}
            onChange={(evento) => setFecha(evento.target.value)}
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