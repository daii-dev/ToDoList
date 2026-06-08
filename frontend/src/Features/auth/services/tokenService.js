const TOKEN_KEY = 'auth_token';

export function guardarToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function obtenerToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function eliminarToken() {
  localStorage.removeItem(TOKEN_KEY);
}