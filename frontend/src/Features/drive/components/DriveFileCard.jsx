import {
  Download,
  File,
  Image,
  Pencil,
  Trash2,
  Video,
  FileText
} from 'lucide-react';
import { obtenerUrlDescarga } from '../services/fileService';

function formatearTamanio(bytes) {
  if (!bytes) return '0 B';

  const kb = bytes / 1024;
  const mb = kb / 1024;

  if (mb >= 1) {
    return `${mb.toFixed(2)} MB`;
  }

  return `${kb.toFixed(2)} KB`;
}

function obtenerIconoArchivo(tipoMime) {
  if (tipoMime?.startsWith('image/')) {
    return <Image size={24} />;
  }

  if (tipoMime?.startsWith('video/')) {
    return <Video size={24} />;
  }

  if (tipoMime === 'application/pdf' || tipoMime?.startsWith('text/')) {
    return <FileText size={24} />;
  }

  return <File size={24} />;
}

export function DriveFileCard({ archivo, onEditar, onEliminar }) {
  return (
    <div className="drive-file-card">
      <div className="drive-file-icon">
        {obtenerIconoArchivo(archivo.tipoMime)}
      </div>

      <div className="drive-file-content">
        <div className="drive-file-name">{archivo.nombreVisible}</div>

        <div className="drive-file-meta">
          {archivo.tipoMime} · {formatearTamanio(archivo.tamanioBytes)}
        </div>
      </div>

      <div className="drive-file-actions">
        <a
          className="btn-edit"
          href={obtenerUrlDescarga(archivo.id)}
          target="_blank"
          rel="noreferrer"
          title="Descargar"
        >
          <Download size={14} />
          Descargar
        </a>

        <button
          type="button"
          className="btn-edit"
          onClick={() => onEditar(archivo)}
        >
          <Pencil size={14} />
          Editar
        </button>

        <button
          type="button"
          className="btn-delete"
          onClick={() => onEliminar(archivo.id)}
        >
          <Trash2 size={14} />
          Eliminar
        </button>
      </div>
    </div>
  );
}