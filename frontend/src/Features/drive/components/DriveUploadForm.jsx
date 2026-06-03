import {
  useRef,
  useState,
} from 'react';

import { UploadCloud } from 'lucide-react';

export function DriveUploadForm({ onSubirArchivo }) {
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [inputInvalido, setInputInvalido] = useState(false);
  const inputArchivoRef = useRef(null);

  function manejarSeleccionArchivo(evento) {
    const archivo = evento.target.files?.[0] || null;
    setArchivoSeleccionado(archivo);
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    if (!archivoSeleccionado) {
      setInputInvalido(true);
      inputArchivoRef.current?.focus();

      setTimeout(function () {
        setInputInvalido(false);
      }, 1200);

      return;
    }

    await onSubirArchivo(archivoSeleccionado);

    setArchivoSeleccionado(null);
    inputArchivoRef.current.value = '';
  }

  return (
    <form className="add-form" onSubmit={manejarEnvio}>
      <h2>DRIVE</h2>

      <div className="form-group">
        <label htmlFor="drive-file-input">Seleccionar archivo</label>
        <input
          ref={inputArchivoRef}
          type="file"
          id="drive-file-input"
          className={inputInvalido ? 'input-error' : ''}
          onChange={manejarSeleccionArchivo}
        />
      </div>

      {archivoSeleccionado && (
        <p className="drive-selected-file">
          Archivo seleccionado: {archivoSeleccionado.name}
        </p>
      )}

      <button className="btn-add" type="submit">
        <UploadCloud size={18} />
        SUBIR ARCHIVO
      </button>
    </form>
  );
}