import React, { useState, useEffect } from "react";
import { FaUser, FaLock, FaEnvelope, FaIdCard, FaPhone, FaCalendarAlt, FaCheck, FaChevronLeft, FaChevronRight, FaFacebook, FaInstagram, FaWhatsapp, FaLightbulb, FaEye, FaCrown, FaMapMarkerAlt, FaStar, FaSearch, FaUsers, FaHome, FaBed, FaArrowUp } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// Datos de las cabañas actualizados con URLs de Cloudinary
const cabañas = [
  {
    id: 101,
    name: "Cabaña Ambar Room",
    description: "Amplia cabaña con jacuzzi privado. Ideal para parejas que buscan privacidad y lujo.",
    img: "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575207/img1_gi8hgx.jpg",
    price: "$395.000 COP/noche",
    sede: "Copacabana",
    tipo: "Premium",
    capacidad: 2,
    habitaciones: 1,
    imagenes: [
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575207/img1_gi8hgx.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575208/img2_dfakst.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575208/img3_lnpt77.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575208/img4_snjxn5.jpg"
    ],
    comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"]
  },
  {
    id: 102,
    name: "Cabaña Bali Suite",
    description: "Cabaña Premium. Perfecta para una escapada romántica con todas las comodidades.",
    img: "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575223/img1_x2yzaj.jpg",
    price: "$520.000 COP/noche",
    sede: "Copacabana",
    tipo: "Premium",
    capacidad: 2,
    habitaciones: 1,
    imagenes: [
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575223/img1_x2yzaj.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575224/img2_rijsf4.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575225/img3_abpcjy.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575226/img4_gnsihe.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575227/img5_acuwuy.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575227/img6_viyrju.jpg"
    ],
    comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"]
  },
  {
    id: 103,
    name: "Cabaña Habana Room",
    description: "Espaciosa cabaña ideal para familias, Perfecta para vacaciones familiares inolvidables.",
    img: "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575241/img1_jtfyrl.jpg",
    price: "$520.000 COP/noche",
    sede: "Copacabana",
    tipo: "Familiar",
    capacidad: 6,
    habitaciones: 1,
    imagenes: [
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575241/img1_jtfyrl.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575242/img2_blpjkx.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575243/img3_rsxyfx.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575253/img4_vh4vxh.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575255/img5_bwnxab.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575256/img6_olv9ms.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575257/img7_mlyytq.jpg"
    ],
    comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Piscina Privada", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"]
  },
  {
    id: 104,
    name: "Cabaña Mikonos Suite",
    description: "Lujosa cabaña con diseño moderno y jacuzzi con vista a las montañas. Experiencia de lujo en un entorno natural privilegiado.",
    img: "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575259/img1_rxptsv.jpg",
    price: "$520.000 COP/noche",
    sede: "Copacabana",
    tipo: "Premium",
    capacidad: 2,
    habitaciones: 1,
    imagenes: [
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575259/img1_rxptsv.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575260/img2_s19ehf.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575269/img3_c1eewm.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575269/img4_usvqz1.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575270/img5_laoeun.jpg"
    ],
    comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"]
  },
  {
    id: 201,
    name: "Chalets",
    description: "Ideal para parejas, con cama king. Un refugio íntimo para reconectar con tu pareja.",
    img: "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575279/img1_nmydmr.jpg",
    price: "$380.000 COP/noche",
    sede: "San Felix",
    tipo: "Premium",
    capacidad: 2,
    habitaciones: 1,
    imagenes: [
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575279/img1_nmydmr.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575279/img2_rdjmca.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575288/img3_qrjwix.jpg"
    ],
    comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"]
  },
  {
    id: 202,
    name: "Cabaña Crystal Garden",
    description: "Perfecta para una escapada romántica con todas las comodidades.",
    img: "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575322/img1_r6txan.jpg",
    price: "$495.000 COP/noche",
    sede: "San Felix",
    tipo: "Premium",
    capacidad: 2,
    habitaciones: 1,
    imagenes: [
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575322/img1_r6txan.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575334/img2_frgxvx.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575335/img3_auf2yd.jpg"
    ],
    comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"]
  },
  {
    id: 203,
    name: "Domo Alaska",
    description: "rodeada de naturaleza, ideal para desconectarte del ruido y descansar.",
    img: "https://res.cloudinary.com/dou17w0m0/image/upload/v1763577957/img1_kkb5uo.jpg",
    price: "$460.000 COP/noche",
    sede: "San Felix",
    tipo: "Premium",
    capacidad: 2,
    habitaciones: 1,
    imagenes: [
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763577957/img1_kkb5uo.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763577958/img2_sf1zg9.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763577960/img3_luzyt3.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763577947/img4_xfsnty.jpg"
    ],
    comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"]
  },
  {
    id: 204,
    name: "Domo Ataraxia",
    description: "Disfruta amaneceres entre la neblina y el sonido de los pájaros.",
    img: "https://res.cloudinary.com/dou17w0m0/image/upload/v1763578023/img1_ikpkxp.jpg",
    price: "$460.000 COP/noche",
    sede: "San Felix",
    tipo: "Premium",
    capacidad: 2,
    habitaciones: 1,
    imagenes: [
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763578023/img1_ikpkxp.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763578024/img2_o8xmnf.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763578027/img3_uwcq9q.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763578029/img4_efrgao.jpg"
    ],
    comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"]
  },
  {
    id: 205,
    name: "Cabaña Golden Suite",
    description: "Espacio íntimo y moderno, diseñado para parejas que buscan tranquilidad.",
    img: "https://res.cloudinary.com/dou17w0m0/image/upload/v1763578092/img1_xkiuuv.jpg",
    price: "$499.000 COP/noche",
    sede: "San Felix",
    tipo: "Premium",
    capacidad: 2,
    habitaciones: 1,
    imagenes: [
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763578092/img1_xkiuuv.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763578094/img2_qvkbbj.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763578096/img3_dwghyq.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763578099/img4_oycu8p.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763578101/img5_izlubz.jpg"
    ],
    comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"]
  },
  {
    id: 206,
    name: "Cabaña Natural Suite",
    description: "Perfecta para quienes aman despertar con vistas a la montaña.",
    img: "https://res.cloudinary.com/dou17w0m0/image/upload/v1763578150/img1_lqpxhk.jpg",
    price: "$499.000 COP/noche",
    sede: "San Felix",
    tipo: "Premium",
    capacidad: 2,
    habitaciones: 1,
    imagenes: [
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763578150/img1_lqpxhk.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763578151/img2_boswye.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763578159/img3_sazoyx.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763578161/img4_xu59kj.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763578164/img5_f7dhip.jpg"
    ],
    comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"]
  },
  {
    id: 207,
    name: "Cabaña Villa Guadalupe",
    description: "Combina el encanto natural con toques artesanales y confort total.",
    img: "https://res.cloudinary.com/dou17w0m0/image/upload/v1763578189/img1_w9w5j7.jpg",
    price: "$499.000 COP/noche",
    sede: "San Felix",
    tipo: "Premium",
    capacidad: 2,
    habitaciones: 1,
    imagenes: [
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763578189/img1_w9w5j7.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763578191/img2_ul5lxz.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763578194/img3_wugnjz.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763578197/img4_g4hi50.jpg",
      "https://res.cloudinary.com/dou17w0m0/image/upload/v1763578199/img5_u3nl3w.jpg"
    ],
    comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"]
  }
];

const paquetes = [
  {
    name: "Kit de Asado",
    img: "https://res.cloudinary.com/dou17w0m0/image/upload/v1763576016/asados_nfmvlb.jpg",
    description: "Perfecto para una noche especial, este kit incluye un jugoso corte de carne acompañado de papas doradas y crujientes. Es la opción ideal para los amantes de un buen asado.",
    price: "$150.000 COP",
  },
  {
    name: "Decoración",
    img: "https://res.cloudinary.com/dou17w0m0/image/upload/v1763576017/decoracion_cpaldi.jpg",
    description: "Transforma tu cabaña en un espacio mágico con nuestro servicio de decoración. Creamos ambientes únicos y especiales para momentos inolvidables.",
    price: "$150.000 COP",
  },
  {
    name: "Masaje relajante",
    img: "https://res.cloudinary.com/dou17w0m0/image/upload/v1763576017/masajes_fp6ra1.jpg",
    description: "Escapa del estrés diario con un masaje profesional diseñado para liberar la tensión muscular. Una experiencia de bienestar que te dejará sintiéndote completamente renovado y en paz.",
    price: "$150.000 COP",
  },
];

// URL base de la API - actualizada a localhost:5272
const API_BASE_URL = 'http://localhost:5272/api';

// Funciones API actualizadas
const loginWithAPI = async (email, password) => {
  try {
    console.log('🔐 Intentando login con:', { email, password });
   
    const response = await fetch(`${API_BASE_URL}/Usuarios/Login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: email,
        contrasena: password
      })
    });

    console.log("📩 Respuesta del servidor:", response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = 'Error en el login';
      try {
        const errorData = await response.json();
        if (errorData && errorData.mensaje) {
          errorMessage = errorData.mensaje;
        }
      } catch (e) {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ Login exitoso:', result);
    return result;
  } catch (error) {
    console.error('❌ Error en login:', error);
   
    // Manejo específico de errores de conexión
    if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
      throw new Error('No se puede conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:5272');
    }
   
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Usuarios`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error obteniendo usuarios');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    throw error;
  }
};

const getAllRoles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Rol`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error obteniendo roles');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error obteniendo roles:', error);
    throw error;
  }
};

const findUserInList = async (email) => {
  try {
    const allUsers = await getAllUsers();
    const user = allUsers.find(u => u.correo && u.correo.toLowerCase() === email.toLowerCase());
    return user;
  } catch (error) {
    console.error('Error buscando usuario en lista:', error);
    return null;
  }
};

const getUserRoleInfo = async (idRol) => {
  try {
    const allRoles = await getAllRoles();
    const role = allRoles.find(r => r.idRol === idRol);
    return role;
  } catch (error) {
    console.error('Error obteniendo información del rol:', error);
    return null;
  }
};

const checkServerConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Usuarios`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.ok;
  } catch (error) {
    console.error('❌ Servidor no disponible:', error);
    return false;
  }
};

const registerWithAPI = async (userData) => {
  try {
    console.log('📝 Intentando registrar usuario:', userData);
   
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

    const response = await fetch(`${API_BASE_URL}/Usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log('📡 Respuesta del registro:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = 'Error en el registro';
      try {
        const errorText = await response.text();
        if (errorText.includes('correo') || errorText.includes('duplicado')) {
          errorMessage = 'El correo electrónico ya está registrado';
        } else if (errorText.includes('18 años')) {
          errorMessage = 'Debes ser mayor de 18 años para registrarte';
        } else {
          errorMessage = errorText || 'Error desconocido';
        }
      } catch (e) {
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ Registro exitoso:', result);
    return result;
  } catch (error) {
    console.error('❌ Error en registro:', error);
   
    if (error.name === 'AbortError') {
      throw new Error('La conexión con el servidor tardó demasiado tiempo. Verifica que el backend esté funcionando correctamente.');
    }
   
    if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
      throw new Error('No se puede conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:5272');
    }
   
    throw error;
  }
};

// MODIFICADA: Función para enviar código de verificación (más tolerante a errores)
const sendVerificationCode = async (email) => {
  try {
    console.log('📤 Enviando código de verificación a:', email);
    const response = await fetch(`${API_BASE_URL}/Usuarios/SendVerificationCode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo: email })
    });

    console.log('📨 Respuesta del servidor:', response.status, response.statusText);

    if (!response.ok) {
      console.warn('⚠️ Respuesta no OK al enviar código:', response.status, response.statusText);
      // En lugar de lanzar error, retornamos un objeto con exito: false
      return { exito: false, mensaje: `Error ${response.status}: ${response.statusText}` };
    }

    const result = await response.json();
    console.log('✅ Resultado del envío de código:', result);
    return result;
  } catch (error) {
    console.error('❌ Error enviando código:', error);
    // No lanzamos el error, retornamos un objeto con el error
    return { exito: false, mensaje: error.message };
  }
};

// MODIFICADA: Función para verificar código (más tolerante a errores)
const verifyCode = async (email, code) => {
  try {
    console.log('🔐 Verificando código para:', email);
    console.log('📝 Código ingresado:', code);
   
    const response = await fetch(`${API_BASE_URL}/Usuarios/VerificarCodigo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: email,
        codigo: code
      })
    });

    console.log('📨 Respuesta del servidor (verify):', response.status, response.statusText);

    if (!response.ok) {
      console.warn('⚠️ Respuesta no OK al verificar código:', response.status, response.statusText);
     
      let errorMessage = 'Error verificando código';
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      } catch (e) {
        // Si no podemos leer el texto de error, usar el status
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
     
      return { exito: false, mensaje: errorMessage };
    }

    const result = await response.json();
    console.log('✅ Resultado de la verificación:', result);
    return result;
  } catch (error) {
    console.error('❌ Error verificando código:', error);
    return { exito: false, mensaje: error.message };
  }
};

// NUEVA FUNCIÓN: Olvidó contraseña - enviar código
const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Usuarios/OlvidoContrasena`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: email
      })
    });

    if (!response.ok) {
      let errorMessage = 'Error enviando código de recuperación';
      try {
        const errorData = await response.json();
        if (errorData && errorData.mensaje) {
          errorMessage = errorData.mensaje;
        }
      } catch (e) {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('❌ Error en olvidó contraseña:', error);
    throw error;
  }
};

// NUEVA FUNCIÓN: Restablecer contraseña
const resetPassword = async (email, code, newPassword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Usuarios/RestablecerClave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: email,
        codigo: code,
        nuevaContrasena: newPassword
      })
    });

    if (!response.ok) {
      let errorMessage = 'Error restableciendo contraseña';
      try {
        const errorData = await response.json();
        if (errorData && errorData.mensaje) {
          errorMessage = errorData.mensaje;
        }
      } catch (e) {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('❌ Error restableciendo contraseña:', error);
    throw error;
  }
};

// Funciones de autenticación
const saveUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('userRole', user.rol);
  localStorage.setItem('userEmail', user.email);
};

const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
};

function LoginRegister() {
  const navigate = useNavigate();
  const [isRegisterActive, setIsRegisterActive] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedCabin, setSelectedCabin] = useState(null);
  const [selectedSede, setSelectedSede] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showCabins, setShowCabins] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isServerOnline, setIsServerOnline] = useState(true);

  // NUEVOS ESTADOS PARA OLVIDÓ CONTRASEÑA
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetPasswordCode, setResetPasswordCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Nuevos estados para filtros - SOLO sede, tipo y capacidad
  const [filtroSede, setFiltroSede] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroCapacidad, setFiltroCapacidad] = useState("");
  const [cabinImageIndex, setCabinImageIndex] = useState(0);
  const [sedeImageIndex, setSedeImageIndex] = useState(0);

  // Estados para registro
  const [tipoDocumento, setTipoDocumento] = useState("Cédula de Ciudadanía");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [celular, setCelular] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados para login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Opciones para tipo de documento
  const tiposDocumento = [
    "Cédula de Ciudadanía",
    "Cédula de Extranjería",
    "Pasaporte",
    "Tarjeta de Identidad"
  ];

  // Datos de las sedes para la galería
  const sedes = [
    {
      name: "Copacabana",
      description: "Disfruta de una experiencia única en nuestras cabañas premium ubicadas en Copacabana, rodeadas de naturaleza y comodidades exclusivas.",
      images: [
        "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575207/img1_gi8hgx.jpg",
        "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575223/img1_x2yzaj.jpg",
        "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575241/img1_jtfyrl.jpg",
        "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575259/img1_rxptsv.jpg"
      ],
      cabañasCount: cabañas.filter(c => c.sede === "Copacabana").length
    },
    {
      name: "San Felix",
      description: "Vive momentos inolvidables en San Felix, donde la tranquilidad y el confort se fusionan para crear la escapada perfecta.",
      images: [
        "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575279/img1_nmydmr.jpg",
        "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575322/img1_r6txan.jpg",
        "https://res.cloudinary.com/dou17w0m0/image/upload/v1763577957/img1_kkb5uo.jpg",
        "https://res.cloudinary.com/dou17w0m0/image/upload/v1763578023/img1_ikpkxp.jpg",
        "https://res.cloudinary.com/dou17w0m0/image/upload/v1763578092/img1_xkiuuv.jpg"
      ],
      cabañasCount: cabañas.filter(c => c.sede === "San Felix").length
    }
  ];

  // Obtener opciones únicas para filtros
  const sedesUnicas = [...new Set(cabañas.map(cabin => cabin.sede))];
  const tiposUnicos = [...new Set(cabañas.map(cabin => cabin.tipo))];
  const capacidadesUnicas = [...new Set(cabañas.map(cabin => cabin.capacidad))].sort((a, b) => a - b);

  // Función para filtrar cabañas - SOLO por sede, tipo y capacidad
  const cabañasFiltradas = cabañas.filter(cabin => {
    const coincideSede = !filtroSede || cabin.sede === filtroSede;
    const coincideTipo = !filtroTipo || cabin.tipo === filtroTipo;
    const coincideCapacidad = !filtroCapacidad || cabin.capacidad >= parseInt(filtroCapacidad);
   
    return coincideSede && coincideTipo && coincideCapacidad;
  });

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setFiltroSede("");
    setFiltroTipo("");
    setFiltroCapacidad("");
  };

  // Función para manejar cambio de imagen en el popup
  const nextImage = () => {
    if (selectedCabin) {
      setCabinImageIndex((prev) =>
        prev === selectedCabin.imagenes.length - 1 ? 0 : prev + 1
      );
    }
    if (selectedSede) {
      setSedeImageIndex((prev) =>
        prev === selectedSede.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedCabin) {
      setCabinImageIndex((prev) =>
        prev === 0 ? selectedCabin.imagenes.length - 1 : prev - 1
      );
    }
    if (selectedSede) {
      setSedeImageIndex((prev) =>
        prev === 0 ? selectedSede.images.length - 1 : prev - 1
      );
    }
  };

  // Efecto para mostrar el botón de scroll to top
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efecto para verificar autenticación al cargar
  useEffect(() => {
    const user = getUser();

    if (!user) return; // si no hay usuario, no hace nada

    // 🔒 Evita bucles de redirección
    if (window.location.pathname === "/home" && user.rol === "Cliente") return;
    if (window.location.pathname === "/dashboard" && user.rol === "Admin") return;

    // 🔁 Redirige según el rol
    if (user.rol === "Cliente") {
      navigate("/home", { replace: true });
    } else if (user.rol === "Admin") {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  // Verificar estado del servidor al cargar el componente
  useEffect(() => {
    const checkServerStatus = async () => {
      const online = await checkServerConnection();
      setIsServerOnline(online);
    };
   
    checkServerStatus();
  }, []);

  // Función para scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Función para manejar clics en enlaces del footer
  const handleFooterLinkClick = (action) => {
    action();
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  // MODIFICADA: Función para abrir enlaces de redes sociales en nueva ventana
  const handleSocialMediaClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const showAlert = (title, text, icon, timer = 3000) => {
    Swal.fire({
      title,
      text,
      icon,
      timer,
      timerProgressBar: true,
      showConfirmButton: icon === 'error',
      confirmButtonColor: '#2E5939',
      background: '#fff',
      color: '#2E3A30',
    });
  };

  const showSuccessAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      background: '#fff',
      color: '#2E3A30',
    });
  };

  const showErrorAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonColor: '#2E5939',
      background: '#fff',
      color: '#2E3A30',
    });
  };

  const handleShowLogin = () => {
    setIsRegisterActive(false);
    setShowForm(true);
    setShowAboutUs(false);
    setShowCabins(false);
    setShowVerification(false);
    setShowForgotPassword(false);
    setShowResetPassword(false);
    setErrors({});
    setLoginEmail("");
    setLoginPassword("");
  };

  const handleShowRegister = () => {
    setIsRegisterActive(true);
    setShowForm(true);
    setShowAboutUs(false);
    setShowCabins(false);
    setShowVerification(false);
    setShowForgotPassword(false);
    setShowResetPassword(false);
    setErrors({});
    setTipoDocumento("Cédula de Ciudadanía");
    setNumeroDocumento("");
    setFirstName("");
    setLastName("");
    setCelular("");
    setFechaNacimiento("");
    setRegisterEmail("");
    setRegisterPassword("");
    setConfirmPassword("");
  };

  const handleShowLanding = () => {
    setShowForm(false);
    setShowAboutUs(false);
    setShowCabins(false);
    setShowVerification(false);
    setShowForgotPassword(false);
    setShowResetPassword(false);
  };

  const handleShowAboutUs = () => {
    setShowAboutUs(true);
    setShowForm(false);
    setShowCabins(false);
    setShowVerification(false);
    setShowForgotPassword(false);
    setShowResetPassword(false);
  };

  const handleShowDetails = (paquete) => {
    setSelectedPackage(paquete);
    setShowPopup(true);
  };

  // Modificar la función handleShowCabinDetails para resetear el índice de imágenes
  const handleShowCabinDetails = (cabin) => {
    setSelectedCabin(cabin);
    setCabinImageIndex(0);
    setShowPopup(true);
  };

  // Nueva función para mostrar galería de sede
  const handleShowSedeGallery = (sede) => {
    setSelectedSede(sede);
    setSedeImageIndex(0);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedPackage(null);
    setSelectedCabin(null);
    setSelectedSede(null);
    setCabinImageIndex(0);
    setSedeImageIndex(0);
  };

  const handleReserveCabin = () => {
    setShowPopup(false);
    handleShowLogin();
  };

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % cabañas.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + cabañas.length) % cabañas.length);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidName = (name) => {
    const nameRegex = /^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/;
    return nameRegex.test(name);
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9+]{10,15}$/;
    return phoneRegex.test(phone);
  };

  const isValidDate = (date) => {
    if (!date) return false;
    const selectedDate = new Date(date);
    const today = new Date();
    return selectedDate < today;
  };

  // NUEVA FUNCIÓN: Manejar olvidé contraseña
  const handleForgotPassword = () => {
    if (!loginEmail) {
      showErrorAlert('Correo requerido', 'Por favor ingresa tu correo electrónico para recuperar tu contraseña');
      return;
    }

    if (!isValidEmail(loginEmail)) {
      showErrorAlert('Correo inválido', 'Por favor ingresa un correo electrónico válido');
      return;
    }

    setIsLoading(true);

    // Primero mostrar el formulario para ingresar el código
    setForgotPasswordEmail(loginEmail);
    setShowForgotPassword(true);
    setShowForm(false);

    // Luego enviar el código
    forgotPassword(loginEmail)
      .then(result => {
        if (result && result.exito) {
          showSuccessAlert('Código enviado', result.mensaje || 'Se ha enviado un código de verificación a tu correo electrónico');
        } else {
          showErrorAlert('Error', result?.mensaje || 'No se pudo enviar el código de recuperación');
        }
      })
      .catch(error => {
        console.error('❌ Error en olvidó contraseña:', error);
        showErrorAlert('Error', error.message || 'No se pudo enviar el código de recuperación. Intenta más tarde.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // NUEVA FUNCIÓN: Verificar código de recuperación
  const handleVerifyResetCode = async (e) => {
    e.preventDefault();
   
    if (!resetPasswordCode) {
      showErrorAlert('Código requerido', 'Por favor ingresa el código de verificación');
      return;
    }

    setIsLoading(true);

    try {
      // Si el código no está vacío, pasamos al siguiente paso
      setShowResetPassword(true);
      setShowForgotPassword(false);
      showSuccessAlert('Código aceptado', 'Ahora puedes establecer tu nueva contraseña');
    } catch (error) {
      console.error('Error verificando código:', error);
      showErrorAlert('Error', 'El código de verificación es incorrecto o ha expirado');
    } finally {
      setIsLoading(false);
    }
  };

  // NUEVA FUNCIÓN: Restablecer contraseña
  const handleResetPassword = async (e) => {
    e.preventDefault();
   
    if (!newPassword || !confirmNewPassword) {
      showErrorAlert('Campos requeridos', 'Por favor completa todos los campos');
      return;
    }

    if (newPassword.length < 6) {
      showErrorAlert('Contraseña muy corta', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      showErrorAlert('Contraseñas no coinciden', 'Las contraseñas ingresadas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(forgotPasswordEmail, resetPasswordCode, newPassword);
     
      if (result) {
        showSuccessAlert('Contraseña restablecida', 'Tu contraseña ha sido actualizada correctamente. Ahora puedes iniciar sesión.');
       
        // Regresar al login
        setTimeout(() => {
          setShowResetPassword(false);
          setShowForm(true);
          setIsRegisterActive(false);
          setResetPasswordCode("");
          setNewPassword("");
          setConfirmNewPassword("");
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Error restableciendo contraseña:', error);
      showErrorAlert('Error', error.message || 'No se pudo restablecer la contraseña. Verifica el código e intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // MODIFICADA: Función de Login - MEJORADA con manejo de roles
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
   
    if (!isServerOnline) {
      showErrorAlert(
        'Servidor no disponible',
        'El servidor no está disponible. Verifica que el backend esté corriendo en http://localhost:5272'
      );
      return;
    }

    setIsLoading(true);

    if (!loginEmail || !loginPassword) {
      showErrorAlert('Campos requeridos', 'Por favor ingresa tu correo electrónico y contraseña');
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(loginEmail)) {
      showErrorAlert('Correo inválido', 'Por favor ingresa un correo electrónico válido');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔐 Iniciando proceso de login para:', loginEmail);
      const loginResult = await loginWithAPI(loginEmail, loginPassword);
     
      if (loginResult && loginResult.exito && loginResult.usuario) {
        const user = loginResult.usuario;
        console.log("👤 Usuario logueado:", user);

        // Consultar el usuario completo desde la BD para obtener el rol
        const userFromDB = await findUserInList(user.correo);

        if (!userFromDB) {
          throw new Error('Usuario no encontrado en la base de datos');
        }

        // Obtener información del rol
        const roleInfo = await getUserRoleInfo(userFromDB.idRol);
       
        // Determinar el rol basado en idRol
        let rol = "Cliente"; // Por defecto
        let nombreRol = "Cliente";
       
        if (userFromDB.idRol === 1) {
          rol = "Admin";
          nombreRol = roleInfo?.nombreRol || "Administrador";
        } else if (userFromDB.idRol === 2) {
          rol = "Cliente";
          nombreRol = roleInfo?.nombreRol || "Cliente";
        }

        console.log("🎯 Rol del usuario:", { idRol: userFromDB.idRol, rol, nombreRol });

        // Guardar usuario en localStorage usando util
        saveUser({
          ...user,
          rol,
          nombreRol,
          idRol: userFromDB.idRol
        });

        // Enviar código de verificación
        const verificationResult = await sendVerificationCode(loginEmail);
       
        // MOSTRAR PANTALLA DE VERIFICACIÓN INMEDIATAMENTE
        console.log('🔄 Activando pantalla de verificación...');
        setUserEmail(loginEmail);
        setShowVerification(true);
        setShowForm(false);
        setShowAboutUs(false);
        setShowCabins(false);
        setShowForgotPassword(false);
        setShowResetPassword(false);
       
        console.log('📱 Estado actual - showVerification:', true);
        console.log('📧 Email guardado para verificación:', loginEmail);
       
        if (verificationResult && verificationResult.exito) {
          showSuccessAlert('Código enviado', 'Se ha enviado un código de verificación a tu correo electrónico');
        } else {
          showAlert(
            'Revisa tu correo',
            'El código podría haberse enviado. Por favor revisa tu bandeja de entrada y spam.',
            'info',
            5000
          );
        }
       
      } else {
        showErrorAlert('Error en el login', loginResult?.mensaje || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('❌ Error durante el login:', error);
     
      if (error.message.includes('No se pudo encontrar') ||
          error.message.includes('no existe') ||
          error.message.includes('no registrado')) {
        showErrorAlert('Usuario no encontrado', 'No existe una cuenta con este correo electrónico.');
      } else if (error.message.includes('contraseña') ||
                 error.message.includes('credenciales') ||
                 error.message.includes('clave') ||
                 error.message.includes('Password')) {
        showErrorAlert('Contraseña incorrecta', 'La contraseña ingresada es incorrecta.');
      } else if (error.message.includes('inactivo') ||
                 error.message.includes('desactivada')) {
        showErrorAlert('Cuenta inactiva', 'Tu cuenta está desactivada. Contacta al administrador.');
      } else {
        showErrorAlert('Error de conexión', error.message || 'No se pudo conectar con el servidor. Intenta más tarde.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // FUNCIÓN CORREGIDA: Manejar verificación de código
  const handleVerifyCode = async (e) => {
    e.preventDefault();
   
    if (!verificationCode) {
      showErrorAlert('Código requerido', 'Por favor ingresa el código de verificación');
      return;
    }

    if (verificationCode.length !== 6) {
      showErrorAlert('Código inválido', 'El código debe tener 6 dígitos');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔐 Verificando código:', verificationCode, 'para:', userEmail);
     
      const verificationResult = await verifyCode(userEmail, verificationCode);
     
      console.log('📊 Resultado completo de verificación:', verificationResult);
     
      // MODIFICACIÓN CLAVE: Verificar si la verificación fue exitosa
      const isSuccess = verificationResult && verificationResult.exito;
     
      if (isSuccess) {
        console.log('✅ Verificación exitosa');
       
        // Obtener el usuario actual
        const currentUser = getUser();
       
        if (currentUser) {
          // Mensaje y redirección según rol
          if (currentUser.rol === "Admin") {
            showSuccessAlert('Inicio de sesión', `¡Bienvenido Administrador ${currentUser.nombre || ''}!`);
            navigate("/dashboard");
          } else {
            showSuccessAlert('Inicio de sesión', `¡Bienvenido ${currentUser.nombre || ''}!`);
            navigate("/home");
          }
        } else {
          showErrorAlert('Error', 'No se pudo obtener la información del usuario');
        }
      } else {
        // Si la verificación falla
        console.error('❌ Verificación fallida:', verificationResult);
        const errorMessage = verificationResult?.mensaje || 'El código de verificación es incorrecto o ha expirado.';
        showErrorAlert('Código incorrecto', errorMessage);
      }
    } catch (error) {
      console.error('❌ Error en verificación:', error);
      showErrorAlert('Error de verificación', error.message || 'No se pudo verificar el código. Intenta más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  // Función de Registro
  const validateRegisterForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!numeroDocumento) {
      newErrors.numeroDocumento = "El número de documento es obligatorio.";
      isValid = false;
    }

    if (!firstName) {
      newErrors.firstName = "El nombre es obligatorio.";
      isValid = false;
    } else if (!isValidName(firstName)) {
      newErrors.firstName = "El nombre solo debe contener letras y espacios.";
      isValid = false;
    }

    if (!lastName) {
      newErrors.lastName = "El apellido es obligatorio.";
      isValid = false;
    } else if (!isValidName(lastName)) {
      newErrors.lastName = "El apellido solo debe contener letras y espacios.";
      isValid = false;
    }

    if (!celular) {
      newErrors.celular = "El número de celular es obligatorio.";
      isValid = false;
    } else if (!isValidPhone(celular)) {
      newErrors.celular = "Formato de celular inválido. Debe contener 10-15 dígitos.";
      isValid = false;
    }

    if (!fechaNacimiento) {
      newErrors.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
      isValid = false;
    } else if (!isValidDate(fechaNacimiento)) {
      newErrors.fechaNacimiento = "La fecha de nacimiento debe ser una fecha válida en el pasado.";
      isValid = false;
    }

    if (!registerEmail) {
      newErrors.registerEmail = "El correo electrónico es obligatorio.";
      isValid = false;
    } else if (!isValidEmail(registerEmail)) {
      newErrors.registerEmail = "Formato de correo electrónico inválido.";
      isValid = false;
    }

    if (!registerPassword) {
      newErrors.registerPassword = "La contraseña es obligatoria.";
      isValid = false;
    } else if (registerPassword.length < 6) {
      newErrors.registerPassword = "La contraseña debe tener al menos 6 caracteres.";
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirmar contraseña es obligatorio.";
      isValid = false;
    } else if (registerPassword !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
 
    if (!validateRegisterForm()) {
      showErrorAlert('Error en el formulario', 'Por favor corrige los errores marcados en el formulario');
      return;
    }

    // Verificar conexión con el servidor antes de intentar registrar
    if (!isServerOnline) {
      showErrorAlert(
        'Servidor no disponible',
        'El servidor de registro no está disponible. Por favor:\n\n' +
        '1. Verifica que el backend .NET esté corriendo\n' +
        '2. Asegúrate de que esté en el puerto 5272\n' +
        '3. Intenta nuevamente en unos momentos'
      );
      return;
    }

    setIsLoading(true);
 
    try {
      const userData = {
        tipoDocumento: tipoDocumento,
        numeroDocumento: numeroDocumento.trim(),
        nombre: firstName.trim(),
        apellido: lastName.trim(),
        celular: celular.trim(),
        fechaNacimiento: fechaNacimiento,
        correo: registerEmail.trim(),
        contrasena: registerPassword,
        idRol: 2, // Cliente por defecto
        estado: true
      };

      const result = await registerWithAPI(userData);
   
      if (result) {
        showSuccessAlert('¡Registro exitoso!', 'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.');
     
        setTimeout(() => {
          handleShowLogin();
        }, 2000);
      }
    } catch (error) {
      console.error('Error en registro:', error);
      showErrorAlert('Error en el registro', error.message || 'No se pudo completar el registro. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextInputChange = (e, setter) => {
    const value = e.target.value;
    setter(value.replace(/[^a-zA-Z\sáéíóúÁÉÍÓÚñÑ]/g, ''));
  };

  const handleDocumentNumberChange = (e) => {
    const value = e.target.value;
    setNumeroDocumento(value.replace(/[^a-zA-Z0-9]/g, ''));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setCelular(value.replace(/[^0-9+]/g, ''));
  };

  // Imagen de fondo para formularios (misma que el inicio)
  const backgroundImage = "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";

  return (
    <>
      {/* NAV */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "rgba(46, 89, 57, 0.95)",
          backdropFilter: "blur(10px)",
          padding: "15px 0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <ul
          style={{
            display: "flex",
            gap: "2rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
            alignItems: "center",
          }}
        >
          <li>
            <a
              onClick={() => handleFooterLinkClick(handleShowLanding)}
              style={{
                cursor: "pointer",
                color: "#E8F5E9",
                textDecoration: "none",
                fontWeight: "500",
                fontSize: "1.1rem",
                padding: "10px 15px",
                borderRadius: "25px",
                transition: "all 0.3s ease",
                border: "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              Inicio
            </a>
          </li>
          <li>
            <a
              onClick={() => handleFooterLinkClick(handleShowAboutUs)}
              style={{
                cursor: "pointer",
                color: "#E8F5E9",
                textDecoration: "none",
                fontWeight: "500",
                fontSize: "1.1rem",
                padding: "10px 15px",
                borderRadius: "25px",
                transition: "all 0.3s ease",
                border: "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              Quienes Somos
            </a>
          </li>
          <li>
            <a
              onClick={() => handleFooterLinkClick(handleShowLogin)}
              style={{
                cursor: "pointer",
                color: "#E8F5E9",
                textDecoration: "none",
                fontWeight: "500",
                fontSize: "1.1rem",
                padding: "10px 15px",
                borderRadius: "25px",
                transition: "all 0.3s ease",
                border: "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              Iniciar Sesión
            </a>
          </li>
          <li>
            <a
              onClick={() => handleFooterLinkClick(handleShowRegister)}
              style={{
                cursor: "pointer",
                backgroundColor: "#E8F5E9",
                color: "#2E5939",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "1.1rem",
                padding: "12px 25px",
                borderRadius: "25px",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(232, 245, 233, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(232, 245, 233, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(232, 245, 233, 0.3)";
              }}
            >
              Registrarse
            </a>
          </li>
        </ul>
      </nav>

      {/* Indicador de estado del servidor */}
      {!isServerOnline && (
        <div style={{
          position: "fixed",
          top: "70px",
          left: 0,
          width: "100%",
          backgroundColor: "#ff6b6b",
          color: "white",
          padding: "10px",
          textAlign: "center",
          zIndex: 999,
          fontSize: "14px",
          fontWeight: "bold"
        }}>
          ⚠️ El servidor no está disponible. Verifica que el backend esté corriendo en http://localhost:5272
        </div>
      )}

      {/* MAIN CONTENT */}
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#f8faf8",
        paddingTop: isServerOnline ? "70px" : "90px", // Ajustar según el estado del servidor
        margin: 0,
        padding: 0,
        overflowX: "hidden",
      }}>
        <main style={{ width: "100%", margin: 0, padding: 0, overflowX: "hidden" }}>
         
          {/* POPUPS ACTUALIZADOS */}
          {showPopup && selectedPackage && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 2000,
              }}
              onClick={handleClosePopup}
            >
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "2rem",
                  borderRadius: "15px",
                  maxWidth: "500px",
                  width: "90%",
                  boxShadow: "0 5px 25px rgba(0,0,0,0.2)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 style={{ color: "#2E5939", textAlign: "center", marginBottom: "1rem" }}>{selectedPackage.name}</h2>
                <img
                  src={selectedPackage.img}
                  alt={selectedPackage.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "1rem",
                  }}
                />
                <p style={{ lineHeight: "1.6", color: "#2E3A30", marginBottom: "1rem" }}>{selectedPackage.description}</p>
                <h4 style={{ color: "#3E7E5C", textAlign: "center", fontSize: "1.5rem", marginBottom: "1rem" }}>
                  Precio: {selectedPackage.price}
                </h4>
                <button
                  onClick={handleClosePopup}
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    backgroundColor: "#2E5939",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          {showPopup && selectedCabin && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 2000,
              }}
              onClick={handleClosePopup}
            >
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "2rem",
                  borderRadius: "15px",
                  maxWidth: "800px",
                  width: "90%",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  boxShadow: "0 5px 25px rgba(0,0,0,0.2)",
                  position: "relative",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 style={{ color: "#2E5939", textAlign: "center", marginBottom: "1.5rem" }}>{selectedCabin.name}</h2>
               
                {/* Carrusel de imágenes */}
                <div style={{ position: "relative", marginBottom: "1.5rem" }}>
                  <img
                    src={selectedCabin.imagenes[cabinImageIndex]}
                    alt={selectedCabin.name}
                    style={{
                      width: "100%",
                      height: "400px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                  {selectedCabin.imagenes.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "15px",
                          transform: "translateY(-50%)",
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          border: "none",
                          color: "#2E5939",
                          fontSize: "1.5rem",
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        onClick={nextImage}
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "15px",
                          transform: "translateY(-50%)",
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          border: "none",
                          color: "#2E5939",
                          fontSize: "1.5rem",
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FaChevronRight />
                      </button>
                      <div style={{
                        position: "absolute",
                        bottom: "15px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        gap: "0.5rem",
                      }}>
                        {selectedCabin.imagenes.map((_, index) => (
                          <div
                            key={index}
                            style={{
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              backgroundColor: index === cabinImageIndex ? "#2E5939" : "rgba(255,255,255,0.5)",
                              cursor: "pointer",
                            }}
                            onClick={() => setCabinImageIndex(index)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Información detallada */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#5D6D63" }}>
                        <FaMapMarkerAlt /> {selectedCabin.sede}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#5D6D63" }}>
                        <FaHome /> {selectedCabin.tipo}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#5D6D63" }}>
                        <FaUsers /> {selectedCabin.capacidad} personas
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#5D6D63" }}>
                        <FaBed /> {selectedCabin.habitaciones} habitación{selectedCabin.habitaciones > 1 ? 'es' : ''}
                      </span>
                    </div>
                  </div>
                 
                  <p style={{ lineHeight: "1.6", color: "#2E3A30", marginBottom: "1rem" }}>
                    {selectedCabin.description}
                  </p>

                  {/* Comodidades */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <h4 style={{ color: "#2E5939", marginBottom: "0.5rem" }}>Comodidades:</h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {selectedCabin.comodidades.map((comodidad, index) => (
                        <span
                          key={index}
                          style={{
                            backgroundColor: "#E8F5E9",
                            color: "#2E5939",
                            padding: "0.3rem 0.8rem",
                            borderRadius: "15px",
                            fontSize: "0.9rem",
                            fontWeight: "500",
                          }}
                        >
                          {comodidad}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <h4 style={{ color: "#3E7E5C", textAlign: "center", fontSize: "1.8rem", marginBottom: "1.5rem" }}>
                  Precio: {selectedCabin.price}
                </h4>
               
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    onClick={handleReserveCabin}
                    style={{
                      flex: 1,
                      padding: "0.8rem",
                      backgroundColor: "#2E5939",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    Reservar
                  </button>
                  <button
                    onClick={handleClosePopup}
                    style={{
                      flex: 1,
                      padding: "0.8rem",
                      backgroundColor: "#e0e0e0",
                      color: "#333",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* POPUP PARA GALERÍA DE SEDES */}
          {showPopup && selectedSede && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 2000,
              }}
              onClick={handleClosePopup}
            >
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "2rem",
                  borderRadius: "15px",
                  maxWidth: "800px",
                  width: "90%",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  boxShadow: "0 5px 25px rgba(0,0,0,0.2)",
                  position: "relative",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 style={{ color: "#2E5939", textAlign: "center", marginBottom: "1.5rem" }}>Galería - {selectedSede.name}</h2>
               
                {/* Carrusel de imágenes */}
                <div style={{ position: "relative", marginBottom: "1.5rem" }}>
                  <img
                    src={selectedSede.images[sedeImageIndex]}
                    alt={selectedSede.name}
                    style={{
                      width: "100%",
                      height: "400px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                  {selectedSede.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "15px",
                          transform: "translateY(-50%)",
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          border: "none",
                          color: "#2E5939",
                          fontSize: "1.5rem",
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        onClick={nextImage}
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "15px",
                          transform: "translateY(-50%)",
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          border: "none",
                          color: "#2E5939",
                          fontSize: "1.5rem",
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FaChevronRight />
                      </button>
                      <div style={{
                        position: "absolute",
                        bottom: "15px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        gap: "0.5rem",
                      }}>
                        {selectedSede.images.map((_, index) => (
                          <div
                            key={index}
                            style={{
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              backgroundColor: index === sedeImageIndex ? "#2E5939" : "rgba(255,255,255,0.5)",
                              cursor: "pointer",
                            }}
                            onClick={() => setSedeImageIndex(index)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <p style={{ lineHeight: "1.6", color: "#2E3A30", marginBottom: "1.5rem", textAlign: "center" }}>
                  {selectedSede.cabañasCount} cabaña{selectedSede.cabañasCount !== 1 ? 's' : ''} disponible{selectedSede.cabañasCount !== 1 ? 's' : ''}
                </p>

                <button
                  onClick={handleClosePopup}
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    backgroundColor: "#2E5939",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                  }}
                >
                  Cerrar Galería
                </button>
              </div>
            </div>
          )}

          {/* QUIENES SOMOS */}
          {showAboutUs && (
            <section style={{ padding: "4rem 2rem", backgroundColor: "#f8faf8", margin: 0 }}>
              <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{
                  backgroundColor: "#fff",
                  padding: "3rem",
                  borderRadius: "20px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  marginBottom: "3rem"
                }}>
                  <h2 style={{
                    fontSize: "3rem",
                    color: "#2E5939",
                    marginBottom: "2rem",
                    textAlign: "center",
                    fontFamily: "Georgia, serif"
                  }}>
                    Nuestra Historia
                  </h2>
                  <div style={{ display: "flex", gap: "3rem", alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "300px" }}>
                      <p style={{ fontSize: "1.2rem", lineHeight: "1.8", marginBottom: "1.5rem",color: "black" }}>
                        En <strong>Bosque Sagrado</strong>, creemos que la conexión con la naturaleza no debe estar reñida con el lujo y la comodidad. Somos un santuario de glamping ubicado en Antioquia, Colombia, dedicados a ofrecerte una escapada mágica.
                      </p>
                      <p style={{ fontSize: "1.2rem", lineHeight: "1.8", color:"black" }}>
                        Nuestro objetivo es brindarte un refugio lejos del bullicio de la ciudad, un lugar para reconectar contigo mismo, con tu pareja o con tus seres queridos, rodeado de la belleza y la tranquilidad del entorno natural.
                      </p>
                    </div>
                    <div style={{ flex: 1, minWidth: "300px" }}>
                      <img
                        src="https://res.cloudinary.com/dou17w0m0/image/upload/v1763575207/img1_gi8hgx.jpg"
                        alt="Glamping"
                        style={{
                          width: "80%",
                          borderRadius: "15px",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
                  <div style={{
                    flex: 1,
                    minWidth: "280px",
                    backgroundColor: "#fff",
                    padding: "2.5rem",
                    borderRadius: "15px",
                    textAlign: "center",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
                  }}>
                    <FaLightbulb size={60} color="#3E7E5C" style={{ marginBottom: "1.5rem" }} />
                    <h3 style={{ fontSize: "1.8rem", color: "#2E5939", marginBottom: "1rem" }}>Nuestra Misión</h3>
                    <p style={{ color: "#000000ff", fontSize: "1.2rem" }}>Ofrecer una experiencia de glamping inolvidable, combinando el lujo y la comodidad con la serenidad de la naturaleza.</p>
                  </div>
                  <div style={{
                    flex: 1,
                    minWidth: "280px",
                    backgroundColor: "#fff",
                    padding: "2.5rem",
                    borderRadius: "15px",
                    textAlign: "center",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
                  }}>
                    <FaEye size={60} color="#3E7E5C" style={{ marginBottom: "1.5rem" }} />
                    <h3 style={{ fontSize: "1.8rem", color: "#2E5939", marginBottom: "1rem" }}>Nuestra Visión</h3>
                    <p style={{ color: "#000000ff", fontSize: "1.2rem" }}>Convertirnos en el destino de glamping líder en Colombia, reconocidos por nuestra excelencia en el servicio y la sostenibilidad.</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* VERIFICACIÓN DE CÓDIGO PARA LOGIN - SIEMPRE DESPUÉS DEL LOGIN */}
          {showVerification && (
            <div style={{
              padding: "4rem 2rem",
              background: `linear-gradient(135deg, rgba(46, 89, 57, 0.9) 0%, rgba(62, 126, 92, 0.8) 100%), url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: 0,
            }}>
              <div style={{
                backgroundColor: "#fff",
                padding: "3rem",
                borderRadius: "20px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                width: "100%",
                maxWidth: "450px"
              }}>
                <form onSubmit={handleVerifyCode}>
                  <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                      <img
                        src="/images/Logo.png"
                        alt="Bosque Sagrado"
                        style={{ width: "80px", height: "80px" }}
                      />
                    </div>
                    <h3 style={{ marginBottom: "0.5rem", color: "#2E5939", fontSize: "2rem", fontFamily: "'Playfair Display', serif" }}>Verifica tu identidad</h3>
                    <p style={{ color: "#5D6D63", margin: 0 }}>Por seguridad, hemos enviado un código a:</p>
                    <p style={{ color: "#3E7E5C", margin: "0.5rem 0 0", fontWeight: "500", fontSize: "1.1rem" }}>{userEmail}</p>
                  </div>
                 
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", color: "#2E5939", fontWeight: "500" }}>
                      Código de verificación
                    </label>
                    <div style={{ display: "flex", alignItems: "center", border: "2px solid #e0e0e0", padding: "1rem", borderRadius: "12px", marginBottom: "1rem", transition: "border-color 0.3s ease" }}>
                      <FaCheck style={{ marginRight: "12px", color: "#3E7E5C" }} />
                      <input
                        type="text"
                        placeholder="Ingresa el código de 6 dígitos"
                        required
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                        style={{ flex: 1, border: "none", outline: "none", fontSize: "1.1rem", letterSpacing: "2px" }}
                        maxLength={6}
                      />
                    </div>
                    <p style={{ fontSize: "0.9rem", color: "#5D6D63", textAlign: "center" }}>
                      Revisa tu bandeja de entrada y spam
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: "1.2rem",
                      backgroundColor: isLoading ? "#7a9c87" : "#2E5939",
                      color: "#fff",
                      fontWeight: "600",
                      border: "none",
                      borderRadius: "12px",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      fontSize: "1.1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {isLoading ? "Verificando..." : "Verificar Código"}
                  </button>

                  <div style={{ textAlign: "center" }}>
                    <p style={{ color: "#5D6D63", fontSize: "0.9rem" }}>
                      ¿No recibiste el código?{" "}
                      <span
                        style={{
                          color: "#2E5939",
                          cursor: "pointer",
                          fontWeight: "500"
                        }}
                        onClick={async () => {
                          try {
                            await sendVerificationCode(userEmail);
                            showSuccessAlert('Código reenviado', 'Se ha enviado un nuevo código a tu correo electrónico');
                          } catch (error) {
                            showErrorAlert('Error', 'No se pudo reenviar el código. Intenta más tarde.');
                          }
                        }}
                      >
                        Reenviar código
                      </span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowVerification(false);
                      setShowForm(true);
                    }}
                    style={{
                      width: "100%",
                      padding: "1rem",
                      backgroundColor: "transparent",
                      color: "#2E5939",
                      fontWeight: "600",
                      border: "2px solid #2E5939",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      marginTop: "1rem",
                    }}
                  >
                    Volver al Login
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* NUEVO: FORMULARIO OLVIDÓ CONTRASEÑA - INGRESAR CÓDIGO */}
          {showForgotPassword && (
            <div style={{
              padding: "4rem 2rem",
              background: `linear-gradient(135deg, rgba(46, 89, 57, 0.9) 0%, rgba(62, 126, 92, 0.8) 100%), url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: 0,
            }}>
              <div style={{
                backgroundColor: "#fff",
                padding: "3rem",
                borderRadius: "20px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                width: "100%",
                maxWidth: "450px"
              }}>
                <form onSubmit={handleVerifyResetCode}>
                  <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                      <img
                        src="/images/Logo.png"
                        alt="Bosque Sagrado"
                        style={{ width: "80px", height: "80px" }}
                      />
                    </div>
                    <h3 style={{ marginBottom: "0.5rem", color: "#2E5939", fontSize: "2rem", fontFamily: "'Playfair Display', serif" }}>Verificar Código</h3>
                    <p style={{ color: "#5D6D63", margin: 0 }}>Ingresa el código enviado a tu correo</p>
                    <p style={{ color: "#3E7E5C", margin: "0.5rem 0 0", fontWeight: "500" }}>{forgotPasswordEmail}</p>
                  </div>
                 
                  <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px", marginBottom: "1rem" }}>
                      <FaCheck style={{ marginRight: "12px", color: "#3E7E5C" }} />
                      <input
                        type="text"
                        placeholder="Código de verificación"
                        required
                        value={resetPasswordCode}
                        onChange={(e) => setResetPasswordCode(e.target.value.replace(/[^0-9]/g, ''))}
                        style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem" }}
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: "1.2rem",
                      backgroundColor: isLoading ? "#7a9c87" : "#2E5939",
                      color: "#fff",
                      fontWeight: "600",
                      border: "none",
                      borderRadius: "12px",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      fontSize: "1.1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {isLoading ? "Verificando..." : "Verificar Código"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setShowForm(true);
                    }}
                    style={{
                      width: "100%",
                      padding: "1rem",
                      backgroundColor: "transparent",
                      color: "#2E5939",
                      fontWeight: "600",
                      border: "2px solid #2E5939",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontSize: "1rem",
                    }}
                  >
                    Volver al Login
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* NUEVO: FORMULARIO RESTABLECER CONTRASEÑA */}
          {showResetPassword && (
            <div style={{
              padding: "4rem 2rem",
              background: `linear-gradient(135deg, rgba(46, 89, 57, 0.9) 0%, rgba(62, 126, 92, 0.8) 100%), url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: 0,
            }}>
              <div style={{
                backgroundColor: "#fff",
                padding: "3rem",
                borderRadius: "20px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                width: "100%",
                maxWidth: "450px"
              }}>
                <form onSubmit={handleResetPassword}>
                  <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                      <img
                        src="/images/Logo.png"
                        alt="Bosque Sagrado"
                        style={{ width: "80px", height: "80px" }}
                      />
                    </div>
                    <h3 style={{ marginBottom: "0.5rem", color: "#2E5939", fontSize: "2rem", fontFamily: "'Playfair Display', serif" }}>Nueva Contraseña</h3>
                    <p style={{ color: "#5D6D63", margin: 0 }}>Ingresa tu nueva contraseña</p>
                  </div>
                 
                  <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px", marginBottom: "1rem" }}>
                      <FaLock style={{ marginRight: "12px", color: "#3E7E5C" }} />
                      <input
                        type="password"
                        placeholder="Nueva contraseña"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem" }}
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px" }}>
                      <FaLock style={{ marginRight: "12px", color: "#3E7E5C" }} />
                      <input
                        type="password"
                        placeholder="Confirmar nueva contraseña"
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem" }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: "1.2rem",
                      backgroundColor: isLoading ? "#7a9c87" : "#2E5939",
                      color: "#fff",
                      fontWeight: "600",
                      border: "none",
                      borderRadius: "12px",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      fontSize: "1.1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {isLoading ? "Restableciendo..." : "Restablecer Contraseña"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowResetPassword(false);
                      setShowForgotPassword(true);
                    }}
                    style={{
                      width: "100%",
                      padding: "1rem",
                      backgroundColor: "transparent",
                      color: "#2E5939",
                      fontWeight: "600",
                      border: "2px solid #2E5939",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontSize: "1rem",
                    }}
                  >
                    Volver Atrás
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* LANDING PAGE ACTUALIZADA */}
          {!showForm && !showAboutUs && !showCabins && !showVerification && !showForgotPassword && !showResetPassword && (
            <>
              {/* HERO SECTION - SIN ESPACIOS A LOS LADOS */}
              <section
                style={{
                  width: "100%",
                  height: "90vh",
                  background: "linear-gradient(135deg, rgba(46, 89, 57, 0.9) 0%, rgba(62, 126, 92, 0.8) 100%), url('https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  color: "#fff",
                  padding: "0",
                  margin: "0",
                  marginTop:"-70px",
                  position: "relative",
                  left: "0",
                  right: "0",
                }}
              >
                <div style={{ marginBottom: "2rem" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "2rem"
                  }}>
                    <img
                      src="/images/Logo.png"
                      alt="Bosque Sagrado"
                      style={{
                        width: "120px",
                        height: "120px",
                        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
                      }}
                    />
                  </div>
                  <h1 style={{
                    fontSize: "4.5rem",
                    marginBottom: "1rem",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: "700",
                    textShadow: "2px 2px 8px rgba(0,0,0,0.5)"
                  }}>
                    Bosque Sagrado
                  </h1>
                  <p style={{ fontSize: "1.8rem", marginBottom: "2rem", textShadow: "1px 1px 4px rgba(0,0,0,0.5)" }}>
                    Donde el lujo se encuentra con la naturaleza
                  </p>
                </div>

                <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
                  <button
                    onClick={handleShowRegister}
                    style={{
                      backgroundColor: "#E8F5E9",
                      color: "#2E5939",
                      border: "none",
                      padding: "18px 35px",
                      borderRadius: "30px",
                      fontWeight: "600",
                      fontSize: "1.2rem",
                      cursor: "pointer",
                    }}
                  >
                    Descubre la Magia
                  </button>
                  <button
                    onClick={handleShowAboutUs}
                    style={{
                      backgroundColor: "transparent",
                      color: "#E8F5E9",
                      border: "2px solid #E8F5E9",
                      padding: "18px 35px",
                      borderRadius: "30px",
                      fontWeight: "600",
                      fontSize: "1.2rem",
                      cursor: "pointer",
                    }}
                  >
                    Nuestra Historia
                  </button>
                </div>
              </section>

              {/* SEDES - 2 CARTAS CENTRADAS */}
              <section style={{ padding: "5rem 2rem", backgroundColor: "#fff", margin: 0 }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                  <h2 style={{
                    fontSize: "3rem",
                    color: "#2E5939",
                    textAlign: "center",
                    marginBottom: "3rem",
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    Nuestras Sedes
                  </h2>
                  <div style={{
                    display: "flex",
                    gap: "3rem",
                    justifyContent: "center",
                    flexWrap: "wrap"
                  }}>
                    {sedes.map((sede, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor: "#fff",
                          borderRadius: "20px",
                          overflow: "hidden",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                          width: "100%",
                          maxWidth: "500px",
                          transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-5px)";
                          e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
                        }}
                      >
                        <img
                          src={sede.images[0]}
                          alt={sede.name}
                          style={{
                            width: "100%",
                            height: "300px",
                            objectFit: "cover"
                          }}
                        />
                        <div style={{ padding: "2.5rem" }}>
                          <h3 style={{
                            margin: "0 0 1rem",
                            color: "#2E5939",
                            fontSize: "2rem",
                            textAlign: "center"
                          }}>
                            {sede.name}
                          </h3>
                          <p style={{
                            color: "#5D6D63",
                            marginBottom: "2rem",
                            lineHeight: "1.6",
                            textAlign: "center"
                          }}>
                            {sede.description}
                          </p>
                          <div style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "1rem"
                          }}>
                            <button
                              onClick={() => handleShowSedeGallery(sede)}
                              style={{
                                backgroundColor: "#2E5939",
                                color: "#fff",
                                border: "none",
                                padding: "12px 25px",
                                borderRadius: "25px",
                                fontWeight: "600",
                                cursor: "pointer",
                                fontSize: "1rem",
                              }}
                            >
                              Ver Galería
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* TODAS NUESTRAS CABAÑAS CON FILTROS */}
              <section style={{ padding: "3rem 2rem", backgroundColor: "#f8faf8", margin: 0 }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                  <h2 style={{
                    fontSize: "3rem",
                    color: "#2E5939",
                    textAlign: "center",
                    marginBottom: "2rem",
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    Todas Nuestras Cabañas
                  </h2>
                 
                  <div style={{
                    backgroundColor: "#fff",
                    padding: "2rem",
                    borderRadius: "15px",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
                    marginBottom: "2rem"
                  }}>
                    <h3 style={{ color: "#2E5939", marginBottom: "1.5rem", textAlign: "center" }}>
                      Encuentra tu Cabaña Ideal
                    </h3>
                   
                    {/* Filtros SOLO sede, tipo y capacidad */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "1rem" }}>
                      {/* Filtro por sede */}
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", color: "#2E5939", fontWeight: "500" }}>
                          <FaMapMarkerAlt style={{ marginRight: "0.5rem" }} /> Sede
                        </label>
                        <select
                          value={filtroSede}
                          onChange={(e) => setFiltroSede(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "0.8rem",
                            border: "1px solid #e0e0e0",
                            borderRadius: "8px",
                            fontSize: "1rem",
                            outline: "none",
                          }}
                        >
                          <option value="">Todas las sedes</option>
                          {sedesUnicas.map((sede, index) => (
                            <option key={index} value={sede}>{sede}</option>
                          ))}
                        </select>
                      </div>

                      {/* Filtro por tipo */}
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", color: "#2E5939", fontWeight: "500" }}>
                          <FaHome style={{ marginRight: "0.5rem" }} /> Tipo
                        </label>
                        <select
                          value={filtroTipo}
                          onChange={(e) => setFiltroTipo(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "0.8rem",
                            border: "1px solid #e0e0e0",
                            borderRadius: "8px",
                            fontSize: "1rem",
                            outline: "none",
                          }}
                        >
                          <option value="">Todos los tipos</option>
                          {tiposUnicos.map((tipo, index) => (
                            <option key={index} value={tipo}>{tipo}</option>
                          ))}
                        </select>
                      </div>

                      {/* Filtro por capacidad */}
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", color: "#2E5939", fontWeight: "500" }}>
                          <FaUsers style={{ marginRight: "0.5rem" }} /> Capacidad mínima
                        </label>
                        <select
                          value={filtroCapacidad}
                          onChange={(e) => setFiltroCapacidad(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "0.8rem",
                            border: "1px solid #e0e0e0",
                            borderRadius: "8px",
                            fontSize: "1rem",
                            outline: "none",
                          }}
                        >
                          <option value="">Cualquier capacidad</option>
                          {capacidadesUnicas.map((capacidad, index) => (
                            <option key={index} value={capacidad}>{capacidad} personas</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Botón limpiar */}
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <button
                        onClick={limpiarFiltros}
                        style={{
                          padding: "0.8rem 1.5rem",
                          backgroundColor: "#e0e0e0",
                          color: "#333",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Limpiar Filtros
                      </button>
                    </div>
                  </div>

                  {/* Resultados de búsqueda */}
                  <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <p style={{ color: "#5D6D63", fontSize: "1.1rem" }}>
                      {cabañasFiltradas.length} cabaña{cabañasFiltradas.length !== 1 ? 's' : ''} encontrada{cabañasFiltradas.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </section>

              {/* CABINAS DESTACADAS CON FILTROS APLICADOS */}
              <section style={{ padding: "0 2rem 5rem", backgroundColor: "#f8faf8", margin: 0 }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
                    {cabañasFiltradas.map((cabin, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor: "#fff",
                          borderRadius: "20px",
                          overflow: "hidden",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                          cursor: "pointer",
                          transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        }}
                        onClick={() => handleShowCabinDetails(cabin)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-5px)";
                          e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
                        }}
                      >
                        <img
                          src={cabin.img}
                          alt={cabin.name}
                          style={{
                            width: "100%",
                            height: "250px",
                            objectFit: "cover"
                          }}
                        />
                        <div style={{ padding: "2rem" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                            <h3 style={{ margin: "0", color: "#2E5939" }}>{cabin.name}</h3>
                            <div style={{ display: "flex", alignItems: "center", color: "#FFD700" }}>
                              <FaStar />
                              <FaStar />
                              <FaStar />
                              <FaStar />
                              <FaStar />
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#5D6D63", fontSize: "0.9rem" }}>
                              <FaMapMarkerAlt /> {cabin.sede}
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#5D6D63", fontSize: "0.9rem" }}>
                              <FaHome /> {cabin.tipo}
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#5D6D63", fontSize: "0.9rem" }}>
                              <FaUsers /> {cabin.capacidad} personas
                            </span>
                          </div>
                          <p style={{ color: "#5D6D63", marginBottom: "1.5rem" }}>{cabin.description}</p>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#3E7E5C" }}>{cabin.price}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShowCabinDetails(cabin);
                              }}
                              style={{
                                backgroundColor: "#2E5939",
                                color: "#fff",
                                border: "none",
                                padding: "10px 20px",
                                borderRadius: "20px",
                                fontWeight: "600",
                                cursor: "pointer",
                              }}
                            >
                              Ver Detalles
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {cabañasFiltradas.length === 0 && (
                    <div style={{ textAlign: "center", padding: "3rem", color: "#5D6D63" }}>
                      <h3 style={{ marginBottom: "1rem" }}>No se encontraron cabañas</h3>
                      <p>Intenta ajustar los filtros de búsqueda</p>
                    </div>
                  )}
                </div>
              </section>

              {/* SERVICIOS CON IMAGEN INMEDIATA */}
              <section style={{ padding: "5rem 2rem", backgroundColor: "#fff", margin: 0 }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                  <h2 style={{
                    fontSize: "3rem",
                    color: "#2E5939",
                    textAlign: "center",
                    marginBottom: "3rem",
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    Servicios Exclusivos
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
                    {paquetes.map((paquete, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor: "#f8faf8",
                          borderRadius: "20px",
                          overflow: "hidden",
                          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                        }}
                      >
                        <img
                          src={paquete.img}
                          alt={paquete.name}
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                          }}
                        />
                        <div style={{ padding: "2rem", textAlign: "center" }}>
                          <h3 style={{ color: "#2E5939", marginBottom: "1rem", fontSize: "1.5rem" }}>{paquete.name}</h3>
                          <p style={{ color: "#5D6D63", marginBottom: "1.5rem" }}>{paquete.description}</p>
                          <div style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#3E7E5C", marginBottom: "1.5rem" }}>
                            {paquete.price}
                          </div>
                          <button
                            onClick={() => handleShowDetails(paquete)}
                            style={{
                              backgroundColor: "#2E5939",
                              color: "#fff",
                              border: "none",
                              padding: "12px 25px",
                              borderRadius: "25px",
                              fontWeight: "600",
                              cursor: "pointer",
                              width: "100%",
                            }}
                          >
                            Más Información
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* CALL TO ACTION */}
              <section style={{ padding: "5rem 2rem", background: "linear-gradient(135deg, #2E5939 0%, #3E7E5C 100%)", color: "#fff", textAlign: "center", margin: 0 }}>
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                  <h2 style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>¿Listo para tu Aventura?</h2>
                  <p style={{ fontSize: "1.3rem", marginBottom: "2.5rem" }}>
                    Únete a la familia Bosque Sagrado y descubre la magia de conectar con la naturaleza sin sacrificar el confort.
                  </p>
                  <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <button
                      onClick={handleShowRegister}
                      style={{
                        backgroundColor: "#E8F5E9",
                        color: "#2E5939",
                        border: "none",
                        padding: "18px 35px",
                        borderRadius: "30px",
                        fontWeight: "600",
                        fontSize: "1.2rem",
                        cursor: "pointer",
                      }}
                    >
                      Crear Cuenta
                    </button>
                    <button
                      onClick={handleShowLogin}
                      style={{
                        backgroundColor: "transparent",
                        color: "#E8F5E9",
                        border: "2px solid #E8F5E9",
                        padding: "18px 35px",
                        borderRadius: "30px",
                        fontWeight: "600",
                        fontSize: "1.2rem",
                        cursor: "pointer",
                      }}
                    >
                      Iniciar Sesión
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* FORMULARIOS CON MISMA IMAGEN DE FONDO */}
          {showForm && !showVerification && !showForgotPassword && !showResetPassword && (
            <div style={{
              padding: "4rem 2rem",
              background: `linear-gradient(135deg, rgba(46, 89, 57, 0.9) 0%, rgba(62, 126, 92, 0.8) 100%), url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: 0,
            }}>
              <div style={{
                backgroundColor: "#fff",
                padding: "3rem",
                borderRadius: "20px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                width: "100%",
                maxWidth: isRegisterActive ? "500px" : "450px"
              }}>
               
                {!isRegisterActive ? (
                  // LOGIN FORM
                  <form onSubmit={handleLoginSubmit}>
                    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                        <img
                          src="/images/Logo.png"
                          alt="Bosque Sagrado"
                          style={{ width: "80px", height: "80px" }}
                        />
                      </div>
                      <h3 style={{ marginBottom: "0.5rem", color: "#2E5939", fontSize: "2rem", fontFamily: "'Playfair Display', serif" }}>Bienvenido de Nuevo</h3>
                      <p style={{ color: "#5D6D63", margin: 0 }}>Ingresa a tu cuenta para continuar</p>
                    </div>
                   
                    <div style={{ marginBottom: "1.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px", marginBottom: "1rem" }}>
                        <FaEnvelope style={{ marginRight: "12px", color: "#3E7E5C" }} />
                        <input
                          type="email"
                          placeholder="Correo electrónico"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem" }}
                        />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px" }}>
                        <FaLock style={{ marginRight: "12px", color: "#3E7E5C" }} />
                        <input
                          type="password"
                          placeholder="Contraseña"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem" }}
                        />
                      </div>
                    </div>

                    {/* Olvidé contraseña */}
                    <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          color: "#2E5939",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          fontWeight: "500"
                        }}
                        onClick={handleForgotPassword}
                      >
                        ¿Olvidaste tu contraseña?
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || !isServerOnline}
                      style={{
                        width: "100%",
                        padding: "1.2rem",
                        backgroundColor: isLoading || !isServerOnline ? "#7a9c87" : "#2E5939",
                        color: "#fff",
                        fontWeight: "600",
                        border: "none",
                        borderRadius: "12px",
                        cursor: isLoading || !isServerOnline ? "not-allowed" : "pointer",
                        fontSize: "1.1rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      {isLoading ? "Iniciando Sesión..." : "Iniciar Sesión"}
                    </button>

                    {!isServerOnline && (
                      <div style={{
                        backgroundColor: "#fff3cd",
                        border: "1px solid #ffeaa7",
                        borderRadius: "8px",
                        padding: "1rem",
                        marginBottom: "1rem",
                        textAlign: "center"
                      }}>
                        <p style={{ color: "#856404", margin: 0, fontSize: "0.9rem" }}>
                          ⚠️ El servidor no está disponible. Verifica que el backend esté corriendo.
                        </p>
                      </div>
                    )}

                    <p style={{ textAlign: "center", color: "#5D6D63" }}>
                      ¿No tienes cuenta?{" "}
                      <span style={{ color: "#2E5939", fontWeight: "600", cursor: "pointer" }} onClick={handleShowRegister}>
                        Regístrate aquí
                      </span>
                    </p>
                  </form>
                ) : (
                  // REGISTER FORM - 2 COLUMNAS
                  <form onSubmit={handleRegisterSubmit}>
                    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                        <img
                          src="/images/Logo.png"
                          alt="Bosque Sagrado"
                          style={{ width: "80px", height: "80px" }}
                        />
                      </div>
                      <h3 style={{ marginBottom: "0.5rem", color: "#2E5939", fontSize: "2rem", fontFamily: "'Playfair Display', serif" }}>Únete a Nosotros</h3>
                      <p style={{ color: "#5D6D63", margin: 0 }}>Crea tu cuenta y comienza tu aventura</p>
                    </div>

                    <div style={{ marginBottom: "2rem" }}>
                      {/* Fila 1: Tipo Documento y Número Documento */}
                      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px" }}>
                            <FaIdCard style={{ marginRight: "12px", color: "#3E7E5C" }} />
                            <select
                              value={tipoDocumento}
                              onChange={(e) => setTipoDocumento(e.target.value)}
                              style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem", background: "transparent" }}
                            >
                              {tiposDocumento.map((tipo) => (
                                <option key={tipo} value={tipo}>{tipo}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px" }}>
                            <FaIdCard style={{ marginRight: "12px", color: "#3E7E5C" }} />
                            <input
                              type="text"
                              placeholder="Número Documento"
                              required
                              value={numeroDocumento}
                              onChange={handleDocumentNumberChange}
                              style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem" }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Fila 2: Nombre y Apellido */}
                      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px" }}>
                            <FaUser style={{ marginRight: "12px", color: "#3E7E5C" }} />
                            <input
                              type="text"
                              placeholder="Nombre"
                              required
                              value={firstName}
                              onChange={(e) => handleTextInputChange(e, setFirstName)}
                              style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem" }}
                            />
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px" }}>
                            <FaUser style={{ marginRight: "12px", color: "#3E7E5C" }} />
                            <input
                              type="text"
                              placeholder="Apellido"
                              required
                              value={lastName}
                              onChange={(e) => handleTextInputChange(e, setLastName)}
                              style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem" }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Fila 3: Celular y Fecha Nacimiento */}
                      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px" }}>
                            <FaPhone style={{ marginRight: "12px", color: "#3E7E5C" }} />
                            <input
                              type="text"
                              placeholder="Celular"
                              required
                              value={celular}
                              onChange={handlePhoneChange}
                              style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem" }}
                            />
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px" }}>
                            <FaCalendarAlt style={{ marginRight: "12px", color: "#3E7E5C" }} />
                            <input
                              type="date"
                              required
                              value={fechaNacimiento}
                              onChange={(e) => setFechaNacimiento(e.target.value)}
                              style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem" }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Email */}
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px", marginBottom: "1rem" }}>
                        <FaEnvelope style={{ marginRight: "12px", color: "#3E7E5C" }} />
                        <input
                          type="email"
                          placeholder="Correo electrónico"
                          required
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem" }}
                        />
                      </div>

                      {/* Fila 4: Contraseña y Confirmar Contraseña */}
                      <div style={{ display: "flex", gap: "1rem" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px" }}>
                            <FaLock style={{ marginRight: "12px", color: "#3E7E5C" }} />
                            <input
                              type="password"
                              placeholder="Contraseña"
                              required
                              value={registerPassword}
                              onChange={(e) => setRegisterPassword(e.target.value)}
                              style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem" }}
                            />
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px" }}>
                            <FaLock style={{ marginRight: "12px", color: "#3E7E5C" }} />
                            <input
                              type="password"
                              placeholder="Confirmar Contraseña"
                              required
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {!isServerOnline && (
                      <div style={{
                        backgroundColor: "#fff3cd",
                        border: "1px solid #ffeaa7",
                        borderRadius: "8px",
                        padding: "1rem",
                        marginBottom: "1rem",
                        textAlign: "center"
                      }}>
                        <p style={{ color: "#856404", margin: 0, fontSize: "0.9rem" }}>
                          ⚠️ El servidor no está disponible. No podrás registrarte hasta que el backend esté corriendo.
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading || !isServerOnline}
                      style={{
                        width: "100%",
                        padding: "1.2rem",
                        backgroundColor: isLoading || !isServerOnline ? "#7a9c87" : "#2E5939",
                        color: "#fff",
                        fontWeight: "600",
                        border: "none",
                        borderRadius: "12px",
                        cursor: isLoading || !isServerOnline ? "not-allowed" : "pointer",
                        fontSize: "1.1rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      {isLoading ? "Creando Cuenta..." : "Crear Cuenta"}
                    </button>

                    <p style={{ textAlign: "center", color: "#5D6D63" }}>
                      ¿Ya tienes cuenta?{" "}
                      <span style={{ color: "#2E5939", fontWeight: "600", cursor: "pointer" }} onClick={handleShowLogin}>
                        Inicia sesión aquí
                      </span>
                    </p>
                  </form>
                )}
              </div>
            </div>
          )}
        </main>

        {/* BOTÓN SCROLL TO TOP */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            style={{
              position: "fixed",
              bottom: "30px",
              right: "30px",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: "#2E5939",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              boxShadow: "0 4px 15px rgba(46, 89, 57, 0.3)",
              zIndex: 1000,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(46, 89, 57, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(46, 89, 57, 0.3)";
            }}
          >
            <FaArrowUp />
          </button>
        )}

        {/* FOOTER COMPLETO */}
        <footer
          style={{
            backgroundColor: "#2E5939",
            color: "#fff",
            padding: "4rem 2rem 2rem",
            marginTop: "auto",
          }}
        >
          <div style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "3rem",
            marginBottom: "3rem"
          }}>
            {/* Logo y descripción */}
            <div>
              <div style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1.5rem"
              }}>
                <img
                  src="/images/Logo.png"
                  alt="Bosque Sagrado"
                  style={{
                    width: "80px",
                    height: "80px",
                    marginRight: "1rem",
                  }}
                />
                <span style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: "bold",
                  fontSize: "2rem"
                }}>
                  Bosque Sagrado
                </span>
              </div>
              <p style={{
                lineHeight: "1.6",
                color: "rgba(255,255,255,0.8)",
                marginBottom: "1.5rem"
              }}>
                Donde el lujo se encuentra con la naturaleza. Experimenta la magia del glamping en los paisajes más espectaculares de Antioquia.
              </p>
              <div style={{ display: "flex", gap: "1rem" }}>
                <a
                  onClick={() => handleSocialMediaClick("https://www.facebook.com/glampingbosquesagrado/?ref=_xav_ig_profile_page_web#")}
                  style={{
                    color: "#fff",
                    fontSize: "1.5rem",
                    padding: "0.5rem",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
                >
                  <FaFacebook />
                </a>
                <a
                  onClick={() => handleSocialMediaClick("https://www.instagram.com/bosquesagradoglamping/")}
                  style={{
                    color: "#fff",
                    fontSize: "1.5rem",
                    padding: "0.5rem",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
                >
                  <FaInstagram />
                </a>
                <a
                  onClick={() => handleSocialMediaClick("https://api.whatsapp.com/send?phone=573145894884&text=Bienvenid%40%20a%20Bosque%20Sagrado%20Glamping.%20%0AMi%20nombre%20es%20Olga%20P%C3%A9rez%2C%20asesora%20autorizada.%20Ser%C3%A1%20un%20gusto%20asesorarte%20para%20que%20vivas%20una%20experiencia%20%C3%BAnica%20y%20hagas%20una%20excelente%20elecci%C3%B3n%20%F0%9F%8C%B3%F0%9F%8C%99%E2%98%80%EF%B8%8F")}
                  style={{
                    color: "#fff",
                    fontSize: "1.5rem",
                    padding: "0.5rem",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
                >
                  <FaWhatsapp />
                </a>
              </div>
            </div>

            {/* Enlaces rápidos */}
            <div>
              <h4 style={{
                marginBottom: "1.5rem",
                fontSize: "1.3rem",
                fontFamily: "'Playfair Display', serif"
              }}>
                Enlaces Rápidos
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ marginBottom: "0.8rem" }}>
                  <a
                    onClick={() => handleFooterLinkClick(handleShowLanding)}
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      textDecoration: "none",
                      cursor: "pointer",
                      transition: "color 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
                  >
                    Inicio
                  </a>
                </li>
                <li style={{ marginBottom: "0.8rem" }}>
                  <a
                    onClick={() => handleFooterLinkClick(handleShowAboutUs)}
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      textDecoration: "none",
                      cursor: "pointer",
                      transition: "color 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
                  >
                    Quiénes Somos
                  </a>
                </li>
                <li style={{ marginBottom: "0.8rem" }}>
                  <a
                    onClick={() => handleFooterLinkClick(handleShowLogin)}
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      textDecoration: "none",
                      cursor: "pointer",
                      transition: "color 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
                  >
                    Iniciar Sesión
                  </a>
                </li>
                <li style={{ marginBottom: "0.8rem" }}>
                  <a
                    onClick={() => handleFooterLinkClick(handleShowRegister)}
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      textDecoration: "none",
                      cursor: "pointer",
                      transition: "color 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
                  >
                    Registrarse
                  </a>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 style={{
                marginBottom: "1.5rem",
                fontSize: "1.3rem",
                fontFamily: "'Playfair Display', serif"
              }}>
                Contacto
              </h4>
              <div style={{ color: "rgba(255,255,255,0.8)", lineHeight: "1.6" }}>
                <p style={{ margin: "0 0 1rem" }}>📞 +57 314 589 4884</p>
                <p style={{ margin: "0 0 1rem" }}>✉️ info@bosquesagrado.com</p>
                <p style={{ margin: "0" }}>📍 Copacabana, Antioquia</p>
              </div>
            </div>
          </div>

          {/* Línea divisoria */}
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.2)",
            paddingTop: "2rem",
            textAlign: "center",
            color: "rgba(255,255,255,0.6)"
          }}>
            <p style={{ margin: 0 }}>
              © 2024 Bosque Sagrado. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </div>

      {/* Estilos CSS para fuentes */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');
        `}
      </style>
    </>
  );
}

export default LoginRegister;