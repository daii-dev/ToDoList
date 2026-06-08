import { obtenerToken } from './tokenService';

const API_AUTH = '/api/auth';

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

export async function iniciarSesion(datosLogin) {
  return pedirJson(`${API_AUTH}/login`, {
    method: 'POST',
    body: JSON.stringify(datosLogin)
  });
}

export async function obtenerPerfil() {
  return pedirJson(`${API_AUTH}/me`);
}