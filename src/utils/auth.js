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
  } catch (e) {
    console.error("❌ Error en saveUser:", e);
  }
};

// ✅ Limpia toda la información del usuario (logout)
export const clearUser = () => {
  try {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userToken");
  } catch (e) {
    console.error("clearUser error:", e);
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

// ✅ Alias para usar como logout
export const logout = clearUser;