// hooks/useUsuario.js
import { useState, useEffect } from 'react';
import { saveUser, clearUser, getUser } from '../utils/auth';

export const useUsuario = () => {
  const [usuario, setUsuario] = useState(null);

  // Al iniciar sesión, guardar usando la función de auth.js que usa la clave 'user'
  const login = (userData) => {
    setUsuario(userData);
    // Usar saveUser de auth.js que guarda en la clave 'user' y con la estructura correcta
    saveUser(userData);
  };

  // Al cerrar sesión, limpiar usando la función de auth.js
  const logout = () => {
    setUsuario(null);
    clearUser();
  };

  // Cargar usuario al inicializar usando la función de auth.js
  useEffect(() => {
    const storedUser = getUser(); // Esta función busca en la clave 'user'
    if (storedUser) setUsuario(storedUser);
  }, []);

  return { usuario, login, logout };
};