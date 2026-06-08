import {
  useEffect,
  useState,
} from 'react';

import {
  iniciarSesion,
  obtenerPerfil,
  registrarUsuario,
  verificarCodigo2FA,
} from '../services/authService';
import {
  eliminarToken,
  guardarToken,
  obtenerToken,
} from '../services/tokenService';

export function useAuth() {
  const [usuario, setUsuario] = useState(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);
  const [desafio2FA, setDesafio2FA] = useState(null);

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

  async function registrar(nombre, email, password) {
    await registrarUsuario({
      nombre,
      email,
      password
    });
  }

  async function login(email, password) {
    const respuesta = await iniciarSesion({
      email,
      password
    });

    setDesafio2FA(respuesta.data);

    return respuesta.data;
  }

  async function verificar2FA(codigo) {
    if (!desafio2FA?.loginId) {
      throw new Error('No existe un inicio de sesión pendiente');
    }

    const respuesta = await verificarCodigo2FA({
      loginId: desafio2FA.loginId,
      codigo
    });

    guardarToken(respuesta.data.token);
    setUsuario(respuesta.data.usuario);
    setDesafio2FA(null);
  }

  function cancelar2FA() {
    setDesafio2FA(null);
  }

  function logout() {
    eliminarToken();
    setUsuario(null);
    setDesafio2FA(null);
  }

  return {
    usuario,
    cargandoAuth,
    desafio2FA,
    registrar,
    login,
    verificar2FA,
    cancelar2FA,
    logout
  };
}