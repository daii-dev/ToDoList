import {
  useEffect,
  useState,
} from 'react';

import {
  iniciarSesion,
  obtenerPerfil,
} from '../services/authService';
import {
  eliminarToken,
  guardarToken,
  obtenerToken,
} from '../services/tokenService';

export function useAuth() {
  const [usuario, setUsuario] = useState(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);

  useEffect(function () {
    async function verificarSesionGuardada() {
      const token = obtenerToken();

      if (!token) {
        setCargandoAuth(false);
        return;
      }

      try {
        const respuesta = await obtenerPerfil();
        setUsuario(respuesta.data.usuario);
      } catch (error) {
        eliminarToken();
        setUsuario(null);
      } finally {
        setCargandoAuth(false);
      }
    }

    verificarSesionGuardada();
  }, []);

  async function login(email, password) {
    const respuesta = await iniciarSesion({
      email,
      password
    });

    guardarToken(respuesta.data.token);
    setUsuario(respuesta.data.usuario);
  }

  function logout() {
    eliminarToken();
    setUsuario(null);
  }

  return {
    usuario,
    cargandoAuth,
    login,
    logout
  };
}