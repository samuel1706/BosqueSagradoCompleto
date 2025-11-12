// utils/auth.js

// ✅ Guarda los datos del usuario en el localStorage
export const saveUser = (userData) => {
  try {
    if (!userData) throw new Error("Datos de usuario vacíos.");

    // Guarda la información básica
    localStorage.setItem("user", JSON.stringify(userData));

    // Marca como autenticado
    localStorage.setItem("isAuthenticated", "true");

    // Guarda el rol (soporta tanto 'rol' como 'role')
    const role = userData.rol || userData.role || "cliente";
    localStorage.setItem("userRole", role.toString());

    // Guarda el token si existe
    if (userData.token) {
      localStorage.setItem("userToken", userData.token);
    }

    console.log("✅ Usuario guardado en localStorage:", userData);
    return true;
  } catch (e) {
    console.error("❌ Error en saveUser:", e);
    return false;
  }
};

// ✅ Limpia toda la información del usuario (logout)
export const clearUser = () => {
  try {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userToken");
    console.log("✅ Sesión cerrada correctamente");
    return true;
  } catch (e) {
    console.error("❌ Error en clearUser:", e);
    return false;
  }
};

// ✅ Obtiene los datos del usuario actual
export const getUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("❌ Error al obtener usuario:", e);
    return null;
  }
};

// ✅ Verifica si el usuario está autenticado
export const isAuthenticated = () => {
  try {
    const authenticated = localStorage.getItem("isAuthenticated");
    const user = getUser();
    return authenticated === "true" && user !== null;
  } catch (e) {
    console.error("❌ Error en isAuthenticated:", e);
    return false;
  }
};

// ✅ Obtiene el rol del usuario actual
export const getUserRole = () => {
  try {
    return localStorage.getItem("userRole") || "cliente";
  } catch (e) {
    console.error("❌ Error al obtener rol:", e);
    return "cliente";
  }
};

// ✅ Obtiene el token del usuario
export const getToken = () => {
  try {
    return localStorage.getItem("userToken");
  } catch (e) {
    console.error("❌ Error al obtener token:", e);
    return null;
  }
};

// ✅ Alias para usar como logout
export const logout = clearUser;

// ✅ Verifica si el usuario tiene un rol específico
export const hasRole = (role) => {
  try {
    const userRole = getUserRole();
    return userRole === role;
  } catch (e) {
    console.error("❌ Error en hasRole:", e);
    return false;
  }
};

// ✅ Verifica si el usuario es administrador
export const isAdmin = () => {
  return hasRole("admin") || hasRole("Admin") || hasRole("administrador");
};

// ✅ Verifica si el usuario es cliente
export const isClient = () => {
  return hasRole("cliente") || hasRole("Cliente") || hasRole("client");
};

// ✅ Obtiene información básica del usuario
export const getUserInfo = () => {
  try {
    const user = getUser();
    if (!user) return null;

    return {
      id: user.id || user.usuarioId,
      nombre: user.nombre,
      email: user.correo || user.email,
      rol: user.rol || user.role,
      documento: user.numeroDocumento || user.documento,
      celular: user.celular,
      estaAutenticado: isAuthenticated()
    };
  } catch (e) {
    console.error("❌ Error en getUserInfo:", e);
    return null;
  }
};