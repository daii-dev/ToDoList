import { Cloud } from 'lucide-react';
import { DriveFileCard } from './DriveFileCard';

export function DriveFileList({ archivos, cargando, onEditar, onEliminar }) {
  if (cargando) {
    return (
      <div className="empty-state">
        <Cloud size={42} />
        <p>Cargando archivos...</p>
      </div>
    );
  }

  if (archivos.length === 0) {
    return (
      <div className="empty-state">
        <Cloud size={42} />
        <p>No tienes archivos subidos</p>
      </div>
    );
  }

  return (
    <div className="drive-file-list">
      {archivos.map(function (archivo) {
        return (
          <DriveFileCard
            key={archivo.id}
            archivo={archivo}
            onEditar={onEditar}
            onEliminar={onEliminar}
          />
        );
      })}
    </div>
  );
}