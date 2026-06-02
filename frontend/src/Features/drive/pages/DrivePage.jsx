import { useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { MensajeAviso } from '../../../components/MensajeAviso';
import { useDriveFiles } from '../hooks/useDriveFiles';
import { DriveUploadForm } from '../components/DriveUploadForm';
import { DriveFileList } from '../components/DriveFileList';
import { EditFileModal } from '../components/EditFileModal';

export function DrivePage({ onVolver }) {
  const {
    archivos,
    cargando,
    subirNuevoArchivo,
    actualizarNombreArchivo,
    borrarArchivo
  } = useDriveFiles();

  const [archivoEditando, setArchivoEditando] = useState(null);
  const [mensajeAviso, setMensajeAviso] = useState('');
  const temporizadorAvisoRef = useRef(null);

  function mostrarMensaje(texto) {
    setMensajeAviso(texto);

    if (temporizadorAvisoRef.current) {
      clearTimeout(temporizadorAvisoRef.current);
    }

    temporizadorAvisoRef.current = setTimeout(function () {
      setMensajeAviso('');
    }, 2200);
  }

  function mostrarError(error) {
    console.error(error);
    mostrarMensaje(error.message || 'Error inesperado');
  }

  async function manejarSubirArchivo(archivo) {
    try {
      await subirNuevoArchivo(archivo);
      mostrarMensaje('Archivo subido');
    } catch (error) {
      mostrarError(error);
    }
  }

  async function manejarGuardarNombre(id, nombreVisible) {
    try {
      await actualizarNombreArchivo(id, nombreVisible);
      setArchivoEditando(null);
      mostrarMensaje('Archivo actualizado');
    } catch (error) {
      mostrarError(error);
    }
  }

  async function manejarEliminarArchivo(id) {
    try {
      await borrarArchivo(id);
      mostrarMensaje('Archivo eliminado');
    } catch (error) {
      mostrarError(error);
    }
  }

  return (
    <>
      <main>
        <button className="btn-back" type="button" onClick={onVolver}>
          <ArrowLeft size={16} />
          Volver
        </button>

        <DriveUploadForm onSubirArchivo={manejarSubirArchivo} />

        <DriveFileList
          archivos={archivos}
          cargando={cargando}
          onEditar={setArchivoEditando}
          onEliminar={manejarEliminarArchivo}
        />
      </main>

      <EditFileModal
        abierto={Boolean(archivoEditando)}
        archivo={archivoEditando}
        onCerrar={() => setArchivoEditando(null)}
        onGuardar={manejarGuardarNombre}
      />

      <MensajeAviso mensaje={mensajeAviso} />
    </>
  );
}