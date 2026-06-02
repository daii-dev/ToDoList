import {
  useRef,
  useState,
} from 'react';

import { CirclePlus } from 'lucide-react';

export function TaskForm({ onCrearTarea }) {
  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState('');
  const [tituloInvalido, setTituloInvalido] = useState(false);
  const inputTituloRef = useRef(null);

  async function manejarEnvio(evento) {
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

    await onCrearTarea({
      titulo: tituloLimpio,
      fecha
    });

    setTitulo('');
    setFecha('');
    inputTituloRef.current?.focus();
  }

  return (
    <form className="add-form" onSubmit={manejarEnvio}>
      <h2>TO DO LIST</h2>

      <div className="form-group">
        <label htmlFor="task-title-input">Nombre tarea</label>
        <input
          ref={inputTituloRef}
          type="text"
          id="task-title-input"
          placeholder="Añade la tarea..."
          maxLength="50"
          value={titulo}
          className={tituloInvalido ? 'input-error' : ''}
          onChange={(evento) => setTitulo(evento.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-date-input">Fecha límite</label>
        <input
          type="date"
          id="task-date-input"
          value={fecha}
          onChange={(evento) => setFecha(evento.target.value)}
        />
      </div>

      <button className="btn-add" type="submit">
        <CirclePlus size={18} />
        AÑADIR TAREA A LA LISTA
      </button>
    </form>
  );
}