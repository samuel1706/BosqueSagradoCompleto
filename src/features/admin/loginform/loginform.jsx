import React, { useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaIdCard, FaPhone, FaCalendarAlt, FaCheck, FaChevronLeft, FaChevronRight, FaFacebook, FaInstagram, FaWhatsapp, FaLightbulb, FaEye, FaCrown, FaMapMarkerAlt, FaStar, FaSearch, FaUsers, FaHome, FaBed } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// Datos de las cabañas actualizados - solo Copacabana y San Felix
const cabañas = [
  {
    id: 101,
    name: "Cabaña Ambar Room",
    description: "Amplia cabaña con jacuzzi privado. Ideal para parejas que buscan privacidad y lujo.",
    img: "images/C_Ambar_Room/img1.jpg",
    price: "$395.000 COP/noche",
    sede: "Copacabana",
    tipo: "Premium",
    capacidad: 2,
    habitaciones: 1,
    imagenes: [
      "images/C_Ambar_Room/img2.jpg",
      "images/C_Ambar_Room/img3.jpg",
      "images/C_Ambar_Room/img4.jpg"
    ],
    comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"]
  },
  {
    id: 102,
    name: "Cabaña Bali Suite",
    description: "Cabaña Premium. Perfecta para una escapada romántica con todas las comodidades.",
    img: "images/C_Bali_Suite/img1.jpg",
    price: "$520.000 COP/noche",
    sede: "Copacabana",
    tipo: "Premium",
    capacidad: 2,
    habitaciones: 1,
    imagenes: [
      "images/C_Bali_Suite/img2.jpg",
      "images/C_Bali_Suite/img3.jpg",
      "images/C_Bali_Suite/img4.jpg",
      "images/C_Bali_Suite/img5.jpg",
      "images/C_Bali_Suite/img6.jpg",
    ],
    comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"]
  },
  {
    id: 103,
    name: "Cabaña Habana Room",
    description: "Espaciosa cabaña ideal para familias, Perfecta para vacaciones familiares inolvidables.",
    img: "images/C_Habana_Room/img1.jpg",
    price: "$520.000 COP/noche",
    sede: "Copacabana",
    tipo: "Familiar",
    capacidad: 6,
    habitaciones: 1,
    imagenes: [
      "images/C_Habana_Room/img2.jpg",
      "images/C_Habana_Room/img3.jpg",
      "images/C_Habana_Room/img4.jpg",
      "images/C_Habana_Room/img5.jpg",
      "images/C_Habana_Room/img6.jpg",
      "images/C_Habana_Room/img7.jpg"
    ],
    comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Piscina Privada", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"]
  },
  {
    id: 104,
    name: "Cabaña Mikonos Suite",
    description: "Lujosa cabaña con diseño moderno y jacuzzi con vista a las montañas. Experiencia de lujo en un entorno natural privilegiado.",
    img: "images/C_Mikonos_Suite/img1.jpg",
    price: "$520.000 COP/noche",
    sede: "Copacabana",
    tipo: "Premium",
    capacidad: 2,
    habitaciones: 1,
    imagenes: [
      "images/C_Mikonos_Suite/img2.jpg",
      "images/C_Mikonos_Suite/img3.jpg",
      "images/C_Mikonos_Suite/img4.jpg",
      "images/C_Mikonos_Suite/img5.jpg",
    ],
    comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"]
  },
  {
    id: 201,
    name: "Chalets",
    description: "Ideal para parejas, con cama king. Un refugio íntimo para reconectar con tu pareja.",
    img: "images/S_Chalets/img1.jpg",
    price: "$380.000 COP/noche",
    sede: "San Felix",
    tipo: "Premium",
    capacidad: 2,
    habitaciones: 1,
    imagenes: [
      "images/S_Chalets/img2.jpg",
      "images/S_Chalets/img3.jpg"
    ],
    comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"]
  },
  {
    id: 202,
    name: "Cabaña Crystal Garden",
    description: "Perfecta para una escapada romántica con todas las comodidades.",
    img: "images/S_Crystal_Garden/img1.jpg",
    price: "$495.000 COP/noche",
    sede: "San Felix",
    tipo: "Premium",
    capacidad: 2,
    habitaciones: 1,
    imagenes: [
      "images/S_Crystal_Garden/img2.jpg",
      "images/S_Crystal_Garden/img3.jpg"
    ],
    comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"]
  },
  {
    id: 203,
    name: "Domo Alaska ",
    description: "rodeada de naturaleza, ideal para desconectarte del ruido y descansar.",
    img: "images/S_Domo_Alaska/img1.jpg",
    price: "$460.000 COP/noche",
    sede: "San Felix",
    tipo: "Premium",
    capacidad: 2,
    habitaciones: 1,
    imagenes: [
      "images/S_Domo_Alaska/img2.jpg",
      "images/S_Domo_Alaska/img3.jpg",
      "images/S_Domo_Alaska/img4.jpg",
    ],
    comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"]
  },
  {
    id: 204,
    name: "Domo Ataraxia",
    description: "Disfruta amaneceres entre la neblina y el sonido de los pájaros.",
    img: "images/S_Domo_Ataraxia/img1.jpg",
    price: "$460.000 COP/noche",
    sede: "San Felix",
    tipo: "Premium",
    capacidad: 2,
    habitaciones: 1,
    imagenes: [
      "images/S_Domo_Ataraxia/img2.jpg",
      "images/S_Domo_Ataraxia/img3.jpg",
      "images/S_Domo_Ataraxia/img4.jpg",
    ],
    comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"]
  },{
    id: 205,
    name: "Cabaña Golden Suite",
    description: "Espacio íntimo y moderno, diseñado para parejas que buscan tranquilidad.",
    img: "images/S_Golden_Suite/img1.jpg",
    price: "$499.000 COP/noche",
    sede: "San Felix",
    tipo: "Premium",
    capacidad: 2,
    habitaciones: 1,
    imagenes: [
      "images/S_Golden_Suite/img2.jpg",
      "images/S_Golden_Suite/img3.jpg",
      "images/S_Golden_Suite/img4.jpg",
      "images/S_Golden_Suite/img5.jpg",
    ],
    comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"]
  },
  {
    id: 206,
    name: "Cabaña Natural Suite",
    description: "Perfecta para quienes aman despertar con vistas a la montaña.",
    img: "images/S_Natural_Suite/img1.jpg",
    price: "$499.000 COP/noche",
    sede: "San Felix",
    tipo: "Premium",
    capacidad: 2,
    habitaciones: 1,
    imagenes: [
      "images/S_Natural_Suite/img2.jpg",
      "images/S_Natural_Suite/img3.jpg",
      "images/S_Natural_Suite/img4.jpg",
      "images/S_Natural_Suite/img5.jpg",
    ],
    comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"]
  },
  {
    id: 207,
    name: "Cabaña Villa Guadalupe",
    description: "Combina el encanto natural con toques artesanales y confort total.",
    img: "images/S_Villa_Guadalupe/img1.jpg",
    price: "$499.000 COP/noche",
    sede: "San Felix",
    tipo: "Premium",
    capacidad: 2,
    habitaciones: 1,
    imagenes: [
      "images/S_Villa_Guadalupe/img2.jpg",
      "images/S_Villa_Guadalupe/img3.jpg",
      "images/S_Villa_Guadalupe/img4.jpg",
      "images/S_Villa_Guadalupe/img5.jpg",
    ],
    comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"]
  }
];

const paquetes = [
  {
    name: "Kit de Asado",
    img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "Perfecto para una noche especial, este kit incluye un jugoso corte de carne acompañado de papas doradas y crujientes.",
    price: "$150.000 COP",
  },
  {
    name: "Paquete de Bebidas",
    img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "Una selección de cócteles vibrantes y coloridos, preparados por expertos para refrescar y animar cualquier ocasión.",
    price: "$150.000 COP",
  },
  {
    name: "Masaje relajante",
    img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "Escapa del estrés diario con un masaje profesional diseñado para liberar la tensión muscular.",
    price: "$150.000 COP",
  },
];

// Funciones API
const loginWithAPI = async (email, password) => {
  try {
    const response = await fetch('http://localhost:5272/api/Usuarios/Login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: email,
        contrasena: password
      })
    });

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
    return result;
  } catch (error) {
    console.error('❌ Error en login:', error);
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    const response = await fetch('http://localhost:5272/api/Usuarios', {
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

const registerWithAPI = async (userData) => {
  try {
    const response = await fetch('http://localhost:5272/api/Usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

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
    return result;
  } catch (error) {
    console.error('❌ Error en registro:', error);
    throw error;
  }
};

function LoginRegister() {
  const navigate = useNavigate();
  const [isRegisterActive, setIsRegisterActive] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedCabin, setSelectedCabin] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showCabins, setShowCabins] = useState(false);

  // Nuevos estados para filtros - SOLO sede, tipo y capacidad
  const [filtroSede, setFiltroSede] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroCapacidad, setFiltroCapacidad] = useState("");
  const [cabinImageIndex, setCabinImageIndex] = useState(0);

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
  };

  const prevImage = () => {
    if (selectedCabin) {
      setCabinImageIndex((prev) =>
        prev === 0 ? selectedCabin.imagenes.length - 1 : prev - 1
      );
    }
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
    setErrors({});
    setLoginEmail("");
    setLoginPassword("");
  };

  const handleShowRegister = () => {
    setIsRegisterActive(true);
    setShowForm(true);
    setShowAboutUs(false);
    setShowCabins(false);
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
  };

  const handleShowAboutUs = () => {
    setShowAboutUs(true);
    setShowForm(false);
    setShowCabins(false);
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

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedPackage(null);
    setSelectedCabin(null);
    setCabinImageIndex(0);
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

  // Función de Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
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
      const loginResult = await loginWithAPI(loginEmail, loginPassword);
     
      if (loginResult && loginResult.exito) {
        const userFromList = await findUserInList(loginEmail);
       
        if (userFromList) {
          if (!userFromList.estado) {
            showErrorAlert('Cuenta inactiva', 'Tu cuenta está desactivada. Contacta al administrador.');
            setIsLoading(false);
            return;
          }

          const user = {
            id: userFromList.idUsuario,
            firstName: userFromList.nombre || '',
            lastName: userFromList.apellido || '',
            email: userFromList.correo || loginEmail,
            role: userFromList.idRol || 1,
            isVerified: true,
            tipoDocumento: userFromList.tipoDocumento,
            numeroDocumento: userFromList.numeroDocumento,
            celular: userFromList.celular,
            fechaNacimiento: userFromList.fechaNacimiento
          };
         
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userRole', user.role.toString());
          localStorage.setItem('userEmail', user.email);
         
          const welcomeMessage = user.role === 2
            ? `¡Bienvenido Administrador ${user.firstName}!`
            : `¡Bienvenido de nuevo ${user.firstName} ${user.lastName}!`;
         
          showSuccessAlert('Inicio de sesión exitoso', welcomeMessage);
         
          setTimeout(() => {
            if (user.role === 2) {
              navigate("/admin-dashboard");
            } else {
              navigate("/dashboard");
            }
          }, 1500);
         
        } else {
          const user = {
            firstName: loginEmail.split('@')[0],
            email: loginEmail,
            role: 1,
            isVerified: true
          };
         
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userRole', '1');
          localStorage.setItem('userEmail', loginEmail);
         
          showSuccessAlert('Inicio de sesión exitoso', `¡Bienvenido de nuevo!`);
         
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
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
        idRol: 1,
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
          justifyContent: "flex-end",
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
            marginRight: "40px",
            alignItems: "center",
          }}
        >
          <li>
            <a
              onClick={handleShowLanding}
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
              onClick={handleShowAboutUs}
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
              onClick={handleShowLogin}
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
              onClick={handleShowRegister}
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

      {/* MAIN CONTENT */}
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#f8faf8",
        paddingTop: "70px", // Para compensar el navbar fijo
      }}>
        <main style={{ width: "100%" }}>
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

          {/* QUIENES SOMOS */}
          {showAboutUs && (
            <section style={{ padding: "4rem 2rem", backgroundColor: "#f8faf8" }}>
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
                        src="images/cabana.jpg"
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

          {/* LANDING PAGE ACTUALIZADA CON CARRUSEL INTEGRADO Y FILTROS SIMPLIFICADOS */}
          {!showForm && !showAboutUs && !showCabins && (
            <>
              {/* CARRUSEL INTEGRADO CON NAVBAR */}
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
                  padding: "0 2rem",
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

              {/* CARRUSEL DE SEDES - SOLO COPACABANA Y SAN FELIX */}
              <section style={{ padding: "5rem 0", backgroundColor: "#fff" }}>
                <div style={{ width: "100%" }}>
                  <h2 style={{
                    fontSize: "3rem",
                    color: "#2E5939",
                    textAlign: "center",
                    marginBottom: "3rem",
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    Nuestras Sedes
                  </h2>
                  <div style={{ position: "relative", width: "100%", height: "600px", overflow: "hidden" }}>
                    {/* Solo mostrar Copacabana y San Felix */}
                    {cabañas.filter(cabin => cabin.sede === "Copacabana" || cabin.sede === "San Felix").map((cabin, index) => (
                      <div
                        key={index}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: `${(index - carouselIndex) * 100}%`,
                          width: "100%",
                          height: "100%",
                          transition: "left 0.5s ease-in-out",
                        }}
                      >
                        <img
                          src={cabin.img}
                          alt={cabin.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            background: "linear-gradient(transparent 0%, rgba(0,0,0,0.7) 100%)",
                            color: "#fff",
                            padding: "3rem",
                          }}
                        >
                          <h3 style={{ fontSize: "2.5rem", margin: "0 0 1rem" }}>{cabin.name}</h3>
                          <p style={{ margin: "0 0 0.5rem", fontSize: "1.2rem" }}>
                            <FaMapMarkerAlt style={{ marginRight: "0.5rem" }} /> {cabin.sede}
                          </p>
                          <p style={{ margin: "0.5rem 0 0", fontSize: "1.1rem" }}>{cabin.description}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
                            <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{cabin.price}</span>
                            <button
                              onClick={() => handleShowCabinDetails(cabin)}
                              style={{
                                backgroundColor: "#E8F5E9",
                                color: "#2E5939",
                                border: "none",
                                padding: "12px 25px",
                                borderRadius: "25px",
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

                    <button
                      onClick={prevSlide}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "30px",
                        transform: "translateY(-50%)",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        border: "none",
                        color: "#2E5939",
                        fontSize: "1.5rem",
                        width: "60px",
                        height: "60px",
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
                      onClick={nextSlide}
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "30px",
                        transform: "translateY(-50%)",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        border: "none",
                        color: "#2E5939",
                        fontSize: "1.5rem",
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              </section>

              {/* FILTROS SIMPLIFICADOS - SOLO SEDE, TIPO Y CAPACIDAD */}
              <section style={{ padding: "3rem 2rem", backgroundColor: "#f8faf8" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
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
              <section style={{ padding: "2rem 2rem 5rem", backgroundColor: "#f8faf8" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                  <h2 style={{
                    fontSize: "3rem",
                    color: "#2E5939",
                    textAlign: "center",
                    marginBottom: "3rem",
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    Todas Nuestras Cabañas
                  </h2>
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
              <section style={{ padding: "5rem 2rem", backgroundColor: "#fff" }}>
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
              <section style={{ padding: "5rem 2rem", background: "linear-gradient(135deg, #2E5939 0%, #3E7E5C 100%)", color: "#fff", textAlign: "center" }}>
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
          {showForm && (
            <div style={{
              padding: "4rem 2rem",
              background: `linear-gradient(135deg, rgba(46, 89, 57, 0.9) 0%, rgba(62, 126, 92, 0.8) 100%), url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
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
                        marginBottom: "1.5rem",
                      }}
                    >
                      {isLoading ? "Iniciando Sesión..." : "Iniciar Sesión"}
                    </button>

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
                    width: "50px",
                    height: "50px",
                    marginRight: "1rem",
                    filter: "brightness(0) invert(1)"
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
                <a href="#" style={{
                  color: "#fff",
                  fontSize: "1.5rem",
                  padding: "0.5rem",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
                >
                  <FaFacebook />
                </a>
                <a href="#" style={{
                  color: "#fff",
                  fontSize: "1.5rem",
                  padding: "0.5rem",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
                >
                  <FaInstagram />
                </a>
                <a href="#" style={{
                  color: "#fff",
                  fontSize: "1.5rem",
                  padding: "0.5rem",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  transition: "all 0.3s ease"
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
                    onClick={handleShowLanding}
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
                    onClick={handleShowAboutUs}
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
                    onClick={handleShowLogin}
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
                    onClick={handleShowRegister}
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
                <p style={{ margin: "0 0 1rem" }}>📞 +57 300 123 4567</p>
                <p style={{ margin: "0 0 1rem" }}>✉️ info@bosquesagrado.com</p>
                <p style={{ margin: "0" }}>📍 Antioquia, Colombia</p>
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

export default LoginRegister