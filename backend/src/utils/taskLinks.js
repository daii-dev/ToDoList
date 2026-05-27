function crearLinksTarea(tarea) {
  const id = tarea.id;

  return {
    self: {
      href: `/api/tasks/${id}`,
      method: 'GET'
    },
    update: {
      href: `/api/tasks/${id}`,
      method: 'PUT'
    },
    toggle: {
      href: `/api/tasks/${id}`,
      method: 'PATCH'
    },
    delete: {
      href: `/api/tasks/${id}`,
      method: 'DELETE'
    },
    collection: {
      href: '/api/tasks',
      method: 'GET'
    }
  };
}

function agregarLinksATarea(tarea) {
  const tareaJson = tarea.toJSON ? tarea.toJSON() : tarea;

  return {
    ...tareaJson,
    links: crearLinksTarea(tareaJson)
  };
}

function crearLinksListado(filtroActual = 'all') {
  return {
    self: {
      href: `/api/tasks?filter=${filtroActual}`,
      method: 'GET'
    },
    all: {
      href: '/api/tasks?filter=all',
      method: 'GET'
    },
    pending: {
      href: '/api/tasks?filter=pending',
      method: 'GET'
    },
    done: {
      href: '/api/tasks?filter=done',
      method: 'GET'
    },
    create: {
      href: '/api/tasks',
      method: 'POST'
    }
  };
}

module.exports = {
  agregarLinksATarea,
  crearLinksTarea,
  crearLinksListado
};