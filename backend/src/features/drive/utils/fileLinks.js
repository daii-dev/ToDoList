function crearLinksArchivo(archivo) {
  const id = archivo.id;

  return {
    self: {
      href: `/api/files/${id}`,
      method: 'GET'
    },
    download: {
      href: `/api/files/${id}/download`,
      method: 'GET'
    },
    update: {
      href: `/api/files/${id}`,
      method: 'PUT'
    },
    delete: {
      href: `/api/files/${id}`,
      method: 'DELETE'
    },
    collection: {
      href: '/api/files',
      method: 'GET'
    }
  };
}

function agregarLinksAArchivo(archivo) {
  const archivoJson = archivo.toJSON ? archivo.toJSON() : archivo;

  return {
    ...archivoJson,
    links: crearLinksArchivo(archivoJson)
  };
}

function crearLinksListadoArchivos() {
  return {
    self: {
      href: '/api/files',
      method: 'GET'
    },
    init: {
      href: '/api/files/init',
      method: 'GET'
    },
    upload: {
      href: '/api/files',
      method: 'POST'
    },
    tasks: {
      href: '/api/tasks',
      method: 'GET'
    }
  };
}

module.exports = {
  crearLinksArchivo,
  agregarLinksAArchivo,
  crearLinksListadoArchivos
};