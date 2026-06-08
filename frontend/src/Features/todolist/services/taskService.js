import { obtenerToken } from '../../auth/services/tokenService';

const API_TAREAS = '/api/tasks';

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

export async function obtenerTareas(filtro = 'all') {
  return pedirJson(`${API_TAREAS}?filter=${filtro}`);
}

export async function crearTarea(datosTarea) {
  return pedirJson(API_TAREAS, {
    method: 'POST',
    body: JSON.stringify({
      title: datosTarea.titulo,
      date: datosTarea.fecha
    })
  });
}

export async function actualizarTareaCompleta(id, datosTarea) {
  return pedirJson(`${API_TAREAS}/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      title: datosTarea.titulo,
      date: datosTarea.fecha
    })
  });
}

export async function cambiarEstadoTarea(id, nuevoEstado) {
  return pedirJson(`${API_TAREAS}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      done: nuevoEstado
    })
  });
}

export async function eliminarTarea(id) {
  return pedirJson(`${API_TAREAS}/${id}`, {
    method: 'DELETE'
  });
}