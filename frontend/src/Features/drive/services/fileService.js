import { obtenerToken } from '../../auth/services/tokenService';

const API_ARCHIVOS = '/api/files';

async function pedirJson(url, opciones = {}) {
  const token = obtenerToken();
  const respuesta = await fetch(url, {
    ...opciones,
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opciones.headers || {})
    }
  });

  const contenido = await respuesta.json().catch(function () {
    return null;
  });

  if (!respuesta.ok) {
    const mensaje = contenido?.errors?.[0]?.detail || 'Ocurrió un error';
    throw new Error(mensaje);
  }

  return contenido;
}

async function enviarArchivo(url, formData) {
  const token = obtenerToken();

  const respuesta = await fetch(url, {
    method: 'POST',
    body: formData,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  const contenido = await respuesta.json().catch(function () {
    return null;
  });

  if (!respuesta.ok) {
    const mensaje = contenido?.errors?.[0]?.detail || 'Ocurrió un error al subir el archivo';
    throw new Error(mensaje);
  }

  return contenido;
}

export async function iniciarDrive() {
  return pedirJson(`${API_ARCHIVOS}/init`);
}

export async function obtenerArchivos() {
  return pedirJson(API_ARCHIVOS);
}

export async function subirArchivo(archivo) {
  const formData = new FormData();

  formData.append('archivo', archivo);

  return enviarArchivo(API_ARCHIVOS, formData);
}

export async function editarNombreArchivo(id, nombreVisible) {
  return pedirJson(`${API_ARCHIVOS}/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      nombreVisible
    })
  });
}

export async function eliminarArchivo(id) {
  return pedirJson(`${API_ARCHIVOS}/${id}`, {
    method: 'DELETE'
  });
}

export function obtenerUrlDescarga(id) {
  return `${API_ARCHIVOS}/${id}/download`;
}

export async function descargarArchivo(archivo) {
  const token = obtenerToken();

  const respuesta = await fetch(`${API_ARCHIVOS}/${archivo.id}/download`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  if (!respuesta.ok) {
    throw new Error('No se pudo descargar el archivo');
  }

  const blob = await respuesta.blob();
  const urlDescarga = window.URL.createObjectURL(blob);
  const enlace = document.createElement('a');

  enlace.href = urlDescarga;
  enlace.download = archivo.nombreVisible;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();

  window.URL.revokeObjectURL(urlDescarga);
}