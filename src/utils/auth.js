// utils/auth.js - CÓDIGO CORREGIDO Y MEJORADO

// ✅ Guarda los datos del usuario en el localStorage (MEJORADO)
export const saveUser = (userData) => {
  try {
    if (!userData) throw new Error("Datos de usuario vacíos.");

    console.log("💾 Guardando usuario en localStorage:", userData);

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

    // Guarda también en sessionStorage como respaldo
    sessionStorage.setItem("userBackup", JSON.stringify(userData));
    
    console.log("✅ Usuario guardado correctamente en localStorage");
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
    
    // Limpiar también sessionStorage
    sessionStorage.removeItem("userBackup");
    
    console.log("✅ Sesión cerrada correctamente");
    return true;
  } catch (e) {
    console.error("❌ Error en clearUser:", e);
    return false;
  }
};

// ✅ Obtiene los datos del usuario actual (MEJORADO)
export const getUser = () => {
  try {
    // Intentar primero localStorage
    let raw = localStorage.getItem("user");
    
    // Si no hay en localStorage, intentar sessionStorage como respaldo
    if (!raw) {
      raw = sessionStorage.getItem("userBackup");
      if (raw) {
        console.log("🔄 Recuperando usuario desde sessionStorage (respaldo)");
      }
    }
    
    if (!raw) {
      console.log("⚠ No se encontró usuario en storage");
      return null;
    }
    
    const userData = JSON.parse(raw);
    console.log("📋 Usuario obtenido del storage:", userData);
    return userData;
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
    const result = authenticated === "true" && user !== null;
    
    console.log("🔐 Verificación de autenticación:", {
      authenticated,
      hasUser: !!user,
      result
    });
    
    return result;
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
    return userRole.toLowerCase() === role.toLowerCase();
  } catch (e) {
    console.error("❌ Error en hasRole:", e);
    return false;
  }
};

// ✅ Verifica si el usuario es administrador
export const isAdmin = () => {
  return hasRole("admin") || hasRole("administrador");
};

// ✅ Verifica si el usuario es cliente
export const isClient = () => {
  return hasRole("cliente") || hasRole("client");
};

// ✅ Obtiene información básica del usuario (MEJORADA Y CORREGIDA)
export const getUserInfo = () => {
  try {
    const user = getUser();
    if (!user) {
      console.log("⚠ getUserInfo: No hay usuario disponible");
      return null;
    }

    // BÚSQUEDA MEJORADA DEL ID - Busca en múltiples campos posibles
    const userId = 
      user.id || 
      user.usuarioId || 
      user.userId || 
      user.idUsuario || 
      user.ID ||
      user._id ||
      null;

    console.log("🔍 Búsqueda de ID del usuario:", {
      userData: user,
      foundUserId: userId,
      searchedFields: ['id', 'usuarioId', 'userId', 'idUsuario', 'ID', '_id']
    });

    if (!userId) {
      console.error("❌ No se pudo encontrar el ID del usuario en ningún campo conocido");
      // Intentar búsqueda de emergencia
      const emergencyId = findUserIdInAnyField(user);
      if (emergencyId) {
        console.log("🆘 ID encontrado mediante búsqueda de emergencia:", emergencyId);
      }
    }

    const userInfo = {
      id: userId,
      nombre: user.nombre || user.name || "",
      apellido: user.apellido || user.lastName || "",
      email: user.correo || user.email || "",
      rol: user.rol || user.role || "cliente",
      documento: user.numeroDocumento || user.documento || user.dni || "",
      tipoDocumento: user.tipoDocumento || "CC",
      celular: user.celular || user.telefono || user.phone || "",
      estaAutenticado: isAuthenticated()
    };

    console.log("📋 getUserInfo result:", userInfo);
    return userInfo;
  } catch (e) {
    console.error("❌ Error en getUserInfo:", e);
    return null;
  }
};

// ✅ Función específica para obtener datos del formulario de reserva (MEJORADA)
export const getUserForReservation = () => {
  try {
    const user = getUser();
    if (!user) {
      console.log("⚠ getUserForReservation: No hay usuario disponible");
      return null;
    }

    // Búsqueda robusta del ID igual que en getUserInfo
    const userId = 
      user.id || 
      user.usuarioId || 
      user.userId || 
      user.idUsuario || 
      user.ID ||
      user._id ||
      null;

    console.log("🔍 getUserForReservation - ID encontrado:", userId);

    const reservationData = {
      id: userId, // INCLUIMOS EL ID EXPLÍCITAMENTE
      nombre: user.nombre || user.name || "",
      apellido: user.apellido || user.lastName || "",
      tipoDocumento: user.tipoDocumento || "CC",
      numeroDocumento: user.numeroDocumento || user.documento || user.dni || "",
      email: user.correo || user.email || "",
      celular: user.celular || user.telefono || ""
    };

    console.log("📋 Datos para reserva:", reservationData);
    return reservationData;
  } catch (e) {
    console.error("❌ Error al obtener datos para reserva:", e);
    return null;
  }
};

// ✅ Verifica si el usuario puede hacer reservas (está autenticado y es cliente)
export const canMakeReservation = () => {
  const canMake = isAuthenticated() && isClient();
  console.log("✅ Verificación canMakeReservation:", {
    isAuthenticated: isAuthenticated(),
    isClient: isClient(),
    result: canMake
  });
  return canMake;
};

// ✅ Actualiza solo campos específicos del usuario
export const updateUserField = (field, value) => {
  try {
    const user = getUser();
    if (!user) throw new Error("No hay usuario logueado");

    const updatedUser = {
      ...user,
      [field]: value
    };

    return saveUser(updatedUser);
  } catch (e) {
    console.error("❌ Error al actualizar campo del usuario:", e);
    return false;
  }
};

// ✅ FUNCIÓN DE EMERGENCIA: Busca el ID del usuario en cualquier campo posible
const findUserIdInAnyField = (user) => {
  if (!user || typeof user !== 'object') return null;
  
  // Lista de campos que podrían contener el ID
  const possibleIdFields = [
    'id', 'usuarioId', 'userId', 'idUsuario', 'ID', '_id',
    'user_id', 'usuario_id', 'iduser', 'idusuario'
  ];
  
  // Buscar en campos directos
  for (const field of possibleIdFields) {
    if (user[field] !== undefined && user[field] !== null) {
      console.log("🎯 ID encontrado en campo '${field}':, user[field]");
      return user[field];
    }
  }
  
  // Buscar recursivamente en objetos anidados
  for (const key in user) {
    if (user[key] && typeof user[key] === 'object') {
      const nestedId = findUserIdInAnyField(user[key]);
      if (nestedId) return nestedId;
    }
  }
  
  return null;
};

// ✅ FUNCIÓN NUEVA: Obtiene explícitamente el ID del usuario para reservas
export const getUserIdForReservation = () => {
  try {
    const userInfo = getUserInfo();
    if (!userInfo || !userInfo.id) {
      console.error("❌ No se pudo obtener el ID del usuario para la reserva");
      
      // Último intento: buscar directamente en localStorage
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        try {
          const userData = JSON.parse(rawUser);
          const emergencyId = findUserIdInAnyField(userData);
          if (emergencyId) {
            console.log("🆘 ID recuperado mediante búsqueda de emergencia:", emergencyId);
            return emergencyId;
          }
        } catch (e) {
          console.error("❌ Error en búsqueda de emergencia:", e);
        }
      }
      
      return null;
    }
    
    console.log("✅ ID obtenido para reserva:", userInfo.id);
    return userInfo.id;
  } catch (e) {
    console.error("❌ Error en getUserIdForReservation:", e);
    return null;
  }
};

// ✅ FUNCIÓN NUEVA: Debug completo del estado de autenticación
export const debugAuth = () => {
  console.group("🔍 DEBUG AUTH - Estado completo de autenticación");
  
  console.log("📍 localStorage contents:");
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    console.log(`  ${key}:`, localStorage.getItem(key));
  }
  
  console.log("📍 sessionStorage contents:");
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    console.log(`  ${key}:`, sessionStorage.getItem(key));
  }
  
  console.log("📍 Function results:");
  console.log("  isAuthenticated():", isAuthenticated());
  console.log("  getUser():", getUser());
  console.log("  getUserInfo():", getUserInfo());
  console.log("  getUserForReservation():", getUserForReservation());
  console.log("  getUserIdForReservation():", getUserIdForReservation());
  
  console.groupEnd();
};

// ✅ FUNCIÓN NUEVA: Verifica y repara el estado de autenticación
export const verifyAndRepairAuth = () => {
  console.log("🛠 Verificando y reparando estado de autenticación...");
  
  const user = getUser();
  const isAuth = isAuthenticated();
  
  if (user && !isAuth) {
    console.log("⚠ Estado inconsistente: hay usuario pero no está marcado como autenticado");
    localStorage.setItem("isAuthenticated", "true");
    console.log("✅ Reparado: marcado como autenticado");
    return true;
  }
  
  if (!user && isAuth) {
    console.log("⚠ Estado inconsistente: marcado como autenticado pero no hay usuario");
    localStorage.removeItem("isAuthenticated");
    console.log("✅ Reparado: removido marcador de autenticación");
    return true;
  }
  
  console.log("✅ Estado de autenticación consistente");
  return true;
};