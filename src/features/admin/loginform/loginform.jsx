import React, { useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaIdCard, FaPhone, FaCalendarAlt, FaCheck, FaChevronLeft, FaChevronRight, FaFacebook, FaInstagram, FaWhatsapp, FaLightbulb, FaEye, FaCrown } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// Datos de las sedes
const sedes = [
  {
    id: 1,
    name: "Sede San Felix",
    description: "Contamos Con 3 Cabañas Super Elegantes",
    img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/20/39/3b/ed/bubblesky-glamping.jpg?w=900&h=500&s=1",
  },
  {
    id: 2,
    name: "Sede Copacabana",
    description: "Contamos Con 2 Cabañas Lujosas",
    img: "https://allnaturalcolombia.com/wp-content/uploads/2023/07/IMG_5446-780x516.jpg",
  },
  {
    id: 3,
    name: "Sede Cerro de las Tres Cruces",
    description: "Contamos Con 1 Cabaña Acogedora",
    img: "https://dev.levitglamping.com/wp-content/uploads/2023/04/Glamping-guatape-Super-Luna.jpg",
  },
];

// Datos de las cabañas por sede
const cabañasPorSede = {
  1: [
    {
      id: 101,
      name: "Cabaña Premium San Felix",
      description: "Amplia cabaña con jacuzzi privado y vista panorámica al bosque.",
      img: "https://cincohorizontes.com/wp-content/uploads/2021/10/267154039.jpg.jpg",
      price: "$350.000 COP/noche"
    },
    {
      id: 102,
      name: "Cabaña Deluxe San Felix",
      description: "Cabaña romántica con terraza privada y chimenea.",
      img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/472647461.jpg?k=5201d575026ba2317bcc458ae690ba095bf32c1e103a346c35fe090a89d5d4cf&o=&hp=1",
      price: "$480.000 COP/noche"
    },
    {
      id: 103,
      name: "Cabaña Familiar San Felix",
      description: "Espaciosa cabaña ideal para familias, con dos habitaciones y área de juegos.",
      img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/622764182.jpg?k=f6e684052528eed8cfa20a7a5ded7b4bb77693fe7a39d9a42e2276d4b67f3277&o=&hp=1",
      price: "$620.000 COP/noche"
    }
  ],
  2: [
    {
      id: 201,
      name: "Cabaña VIP Copacabana",
      description: "Lujosa cabaña con diseño moderno y jacuzzi con vista a las montañas.",
      img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/514150337.jpg?k=ade23dfb4719a8a75701fba28a3c99d58c3cb21a2d072e1af0a149a37c5a812a&o=&hp=1",
      price: "$450.000 COP/noche"
    },
    {
      id: 202,
      name: "Cabaña Romántica Copacabana",
      description: "Ideal para parejas, con cama king size y baño de lujo.",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS_7uJqLS9tJzFS3RbuZoHY6Dq3Xc8PWI3DQ&s",
      price: "$320.000 COP/noche"
    }
  ],
  3: [
    {
      id: 301,
      name: "Cabaña Tres Cruces",
      description: "Acogedora cabaña con la mejor vista al valle, perfecta para desconectar.",
      img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/410469926.jpg?k=b21f3d75541d614a70a7508fc42c604f1e9e48e4bb866399d12c7988b2eb5c70&o=&hp=1",
      price: "$300.000 COP/noche"
    }
  ]
};

// Combinar todas las cabañas para mostrar en el home
const todasLasCabañas = Object.values(cabañasPorSede).flat();

const paquetes = [
  {
    name: "Kit de Asado",
    img: "/images/comida.png",
    description: "Perfecto para una noche especial, este kit incluye un jugoso corte de carne acompañado de papas doradas y crujientes. Es la opción ideal para los amantes de un buen asado.",
    price: "$150.000 COP",
  },
  {
    name: "Paquete de Alcohol",
    img: "/images/licores.png",
    description: "Una selección de cócteles vibrantes y coloridos, preparados por expertos para refrescar y animar cualquier ocasión. Este paquete es la elección perfecta para quienes buscan variedad y sabor en sus bebidas.",
    price: "$150.000 COP",
  },
  {
    name: "Masaje relajante",
    img: "/images/masaje.png",
    description: "Escapa del estrés diario con un masaje profesional diseñado para liberar la tensión muscular. Una experiencia de bienestar que te dejará sintiéndote completamente renovado y en paz.",
    price: "$150.000 COP",
  },
];

// Función para hacer login usando el endpoint de la API
const loginWithAPI = async (email, password) => {
  try {
    console.log('🔐 Intentando login con:', { email, password });
    
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

    console.log('📡 Respuesta del servidor:', response.status);

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
    throw error;
  }
};

// Función para obtener todos los usuarios
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

// Función para buscar usuario en la lista completa
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

// Función para registrar usuario
const registerWithAPI = async (userData) => {
  try {
    console.log('📝 Intentando registrar usuario:', userData);
    
    const response = await fetch('http://localhost:5272/api/Usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

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
  const [sedeCarouselIndex, setSedeCarouselIndex] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [showCabins, setShowCabins] = useState(false);
  const [selectedSede, setSelectedSede] = useState(null);

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
      customClass: {
        popup: 'custom-swal-popup'
      }
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
      customClass: {
        popup: 'custom-swal-popup'
      }
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
      customClass: {
        popup: 'custom-swal-popup'
      }
    });
  };

  const handleShowLogin = () => {
    setShowForgotPassword(false);
    setIsRegisterActive(false);
    setShowForm(true);
    setShowAboutUs(false);
    setShowCabins(false);
    setErrors({});
    setLoginEmail("");
    setLoginPassword("");
  };

  const handleShowRegister = () => {
    setShowForgotPassword(false);
    setIsRegisterActive(true);
    setShowForm(true);
    setShowAboutUs(false);
    setShowCabins(false);
    setErrors({});
    // Resetear todos los campos del formulario
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
    setShowForgotPassword(false);
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

  const handleShowCabinDetails = (cabin) => {
    setSelectedCabin(cabin);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedPackage(null);
    setSelectedCabin(null);
  };

  const handleReserveCabin = () => {
    setShowPopup(false);
    handleShowLogin();
  };

  const handleShowCabins = (sede) => {
    setSelectedSede(sede);
    setShowCabins(true);
    setShowForm(false);
    setShowAboutUs(false);
  };

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % todasLasCabañas.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + todasLasCabañas.length) % todasLasCabañas.length);
  };

  const nextSedeSlide = () => {
    setSedeCarouselIndex((prev) => (prev + 1) % sedes.length);
  };

  const prevSedeSlide = () => {
    setSedeCarouselIndex((prev) => (prev - 1 + sedes.length) % sedes.length);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidName = (name) => {
    const nameRegex = /^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/;
    return nameRegex.test(name);
  };

  const isValidDocumentNumber = (numero) => {
    const docRegex = /^[a-zA-Z0-9]+$/;
    return docRegex.test(numero);
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

  // FUNCIÓN DE LOGIN CORREGIDA Y SIMPLIFICADA
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validaciones básicas
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
      console.log('🚀 Iniciando proceso de login...');
      
      // 1. Primero intentamos hacer login con la API
      const loginResult = await loginWithAPI(loginEmail, loginPassword);
      
      if (loginResult && loginResult.exito) {
        console.log('✅ Login API exitoso, buscando datos del usuario...');
        
        // 2. Buscar el usuario en la lista completa para obtener todos los datos
        const userFromList = await findUserInList(loginEmail);
        
        if (userFromList) {
          console.log('👤 Usuario encontrado en lista:', userFromList);
          
          // Verificar si la cuenta está activa
          if (!userFromList.estado) {
            showErrorAlert('Cuenta inactiva', 'Tu cuenta está desactivada. Contacta al administrador.');
            setIsLoading(false);
            return;
          }

          // Crear objeto de usuario con todos los datos necesarios
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
          
          // Guardar en localStorage
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userRole', user.role.toString());
          localStorage.setItem('userEmail', user.email);
          
          // Mensaje de bienvenida personalizado
          const welcomeMessage = user.role === 2 
            ? `¡Bienvenido Administrador ${user.firstName}!` 
            : `¡Bienvenido de nuevo ${user.firstName} ${user.lastName}!`;
          
          showSuccessAlert('Inicio de sesión exitoso', welcomeMessage);
          
          // Redirigir según el rol
          setTimeout(() => {
            if (user.role === 2) {
              navigate("/admin-dashboard");
            } else {
              navigate("/dashboard");
            }
          }, 1500);
          
        } else {
          // Si no encontramos el usuario en la lista, crear un objeto básico
          console.log('⚠️ Usuario no encontrado en lista, creando objeto básico');
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
        // Si el login falla
        showErrorAlert('Error en el login', loginResult?.mensaje || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('❌ Error durante el login:', error);
      
      // Manejo específico de errores
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
      } else if (error.message.includes('Código enviado')) {
        showSuccessAlert('Código enviado', 'Se ha enviado un código de verificación a tu correo. Por favor verifica tu email.');
      } else {
        showErrorAlert('Error de conexión', error.message || 'No se pudo conectar con el servidor. Intenta más tarde.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Función de registro
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
        
        // Cambiar al formulario de login
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

  return (
    <>
      {/* NAV */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#2E5939",
          paddingTop: "10px",
          paddingBottom: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 1000,
          boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            fontSize: "1.8rem",
            color: "#E8F5E9",
            userSelect: "none",
            marginLeft: "20px",
          }}
        >
          <img src="/images/Logo.png" alt="" width="35px" /> Bosque Sagrado
        </div>
        <ul
          style={{
            display: "flex",
            gap: "1.5rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
            flexWrap: "wrap",
            justifyContent: "center",
            marginRight: "20px",
          }}
        >
          <li>
            <a
              onClick={handleShowLanding}
              style={{
                cursor: "pointer",
                color: "#E8F5E9",
                textDecoration: "none",
                fontWeight: "600",
                userSelect: "none",
                margin: "0 10px",
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
                fontWeight: "600",
                userSelect: "none",
                margin: "0 10px",
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
                fontWeight: "600",
                userSelect: "none",
                margin: "0 10px",
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
                color: "#E8F5E9",
                textDecoration: "none",
                fontWeight: "600",
                userSelect: "none",
                margin: "0 10px",
              }}
            >
              Registrarse
            </a>
          </li>
        </ul>
      </nav>

      {/* MAIN CONTENEDOR PRINCIPAL */}
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#f8faf8",
        paddingTop: "70px",
        display: "flex",
        flexDirection: "column",
      }}>
        <main
          style={{
            flex: 1,
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "1rem",
            width: "100%",
            color: "#2E3A30",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* POPUP PARA PAQUETES */}
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
                  position: "relative",
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
                    display: "block",
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

          {/* POPUP PARA CABINAS */}
          {showPopup && selectedCabin && (
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
                  position: "relative",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 style={{ color: "#2E5939", textAlign: "center", marginBottom: "1rem" }}>{selectedCabin.name}</h2>
                <img
                  src={selectedCabin.img}
                  alt={selectedCabin.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "1rem",
                  }}
                />
                <p style={{ lineHeight: "1.6", color: "#2E3A30", marginBottom: "1rem" }}>{selectedCabin.description}</p>
                <h4 style={{ color: "#3E7E5C", textAlign: "center", fontSize: "1.5rem", marginBottom: "1.5rem" }}>
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
                    }}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* QUIENES SOMOS VIEW */}
          {showAboutUs && (
            <section
              style={{
                width: "100%",
                marginTop: "0",
                marginBottom: "3rem",
                backgroundColor: "#f8faf8",
                color: "#2E3A30",
              }}
            >
              <div
                style={{
                  maxWidth: "900px",
                  margin: "0 auto 3rem",
                  padding: "2rem",
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                }}
              >
                <h2 style={{ fontSize: "2rem", color: "#2E5939", marginBottom: "1.5rem", textAlign: "center" }}>
                  Nuestra Historia
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
                  <div style={{ flex: 1, minWidth: "300px", textAlign: "left" }}>
                    <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#2E3A30", marginBottom: "1rem" }}>
                      En Bosque Sagrado, creemos que la conexión con la naturaleza no debe estar reñida con el lujo y la comodidad. Somos un santuario de glamping ubicado en Antioquia, Colombia, dedicados a ofrecerte una escapada mágica, donde el susurro del bosque y el confort de una cabaña lujosa se entrelazan para crear una experiencia inolvidable.
                    </p>
                    <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#2E3A30" }}>
                      Nuestro objetivo es brindarte un refugio lejos del bullicio de la ciudad, un lugar para reconectar contigo mismo, con tu pareja o con tus seres queridos, rodeado de la belleza y la tranquilidad del entorno natural. Cada una de nuestras sedes ha sido cuidadosamente diseñada para ofrecerte privacidad y una experiencia única, con jacuzzis privados y vistas que te quitarán el aliento.
                    </p>
                  </div>
                  <div style={{ flex: 1, minWidth: "300px" }}>
                    <img
                      src="/images/cabana.jpg"
                      alt="Interior de una cabaña de glamping"
                      style={{ width: "100%", height: "auto", borderRadius: "8px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "2rem",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  maxWidth: "900px",
                  margin: "0 auto",
                  padding: "2rem",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    minWidth: "280px",
                    backgroundColor: "#fff",
                    padding: "2rem",
                    borderRadius: "10px",
                    textAlign: "center",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  }}
                >
                  <FaLightbulb size={50} color="#3E7E5C" style={{ marginBottom: "1rem" }} />
                  <h3 style={{ fontSize: "1.8rem", color: "#2E5939", marginBottom: "1rem" }}>
                    Nuestra Misión
                  </h3>
                  <p style={{ fontSize: "1rem", lineHeight: "1.6", color: "#2E3A30" }}>
                    Nuestra misión es ofrecer una experiencia de glamping inolvidable, combinando el lujo y la comodidad con la serenidad de la naturaleza. Buscamos ser un refugio donde nuestros huéspedes puedan desconectar de la rutina y reconectar con el entorno natural.
                  </p>
                </div>
                <div
                  style={{
                    flex: 1,
                    minWidth: "280px",
                    backgroundColor: "#fff",
                    padding: "2rem",
                    borderRadius: "10px",
                    textAlign: "center",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  }}
                >
                  <FaEye size={50} color="#3E7E5C" style={{ marginBottom: "1rem" }} />
                  <h3 style={{ fontSize: "1.8rem", color: "#2E5939", marginBottom: "1rem" }}>
                    Nuestra Visión
                  </h3>
                  <p style={{ fontSize: "1rem", lineHeight: "1.6", color: "#2E3A30" }}>
                    Nuestra visión es convertirnos en el destino de glamping líder en Colombia, reconocidos por nuestra excelencia en el servicio, la sostenibilidad y la creación de experiencias únicas que promuevan el bienestar y el respeto por el medio ambiente.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* VISTA DE CABINAS POR SEDE */}
          {showCabins && selectedSede && (
            <section
              style={{
                width: "100%",
                maxWidth: "900px",
                marginBottom: "3rem",
                backgroundColor: "#fff",
                padding: "2rem",
                borderRadius: "15px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
                <button
                  onClick={() => setShowCabins(false)}
                  style={{
                    backgroundColor: "#2E5939",
                    color: "#fff",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginRight: "1rem",
                  }}
                >
                  ← Volver
                </button>
                <h2 style={{ fontSize: "2rem", color: "#2E5939", margin: 0 }}>
                  Cabañas en {selectedSede.name}
                </h2>
              </div>
              
              <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "1.5rem" }}>
                {cabañasPorSede[selectedSede.id]?.map((cabin, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#3E7E5C",
                      color: "#fff",
                      borderRadius: "10px",
                      overflow: "hidden",
                      width: "calc(33.33% - 1rem)",
                      minWidth: "250px",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                      textAlign: "center",
                    }}
                  >
                    <img src={cabin.img} alt={cabin.name} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                    <div style={{ padding: "1.5rem" }}>
                      <h3 style={{ margin: "0 0 0.5rem" }}>{cabin.name}</h3>
                      <p style={{ fontSize: "0.9rem", lineHeight: "1.4", marginBottom: "1rem" }}>
                        {cabin.description}
                      </p>
                      <p style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "1rem" }}>
                        {cabin.price}
                      </p>
                      <button
                        onClick={() => handleShowCabinDetails(cabin)}
                        style={{
                          backgroundColor: "#E8F5E9",
                          color: "#2E5939",
                          border: "none",
                          padding: "0.8rem 1.5rem",
                          borderRadius: "20px",
                          fontWeight: "bold",
                          cursor: "pointer",
                          transition: "background-color 0.3s, transform 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      >
                        Ver más
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* LANDING PAGE CONTENT */}
          {!showForm && !showAboutUs && !showCabins && (
            <>
              {/* HERO */}
              <section
                style={{
                  textAlign: "center",
                  marginTop: "2rem",
                  marginBottom: "3rem",
                  maxWidth: "700px",
                  padding: "0 1rem",
                }}
              >
                <h1 style={{ fontSize: "3rem", marginBottom: "0.5rem", color: "#2E5939" }}>
                  Vive la naturaleza con lujo
                </h1>
                <p style={{ fontSize: "1.3rem", color: "#3E7E5C" }}>
                  Descubre una experiencia única en nuestro glamping ecológico.
                </p>
              </section>

              {/* SECCIÓN NUESTRAS SEDES (CARRUSEL) */}
              <section
                style={{
                  width: "100%",
                  maxWidth: "900px",
                  marginBottom: "3rem",
                  backgroundColor: "#fff",
                  padding: "2rem",
                  borderRadius: "15px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                }}
              >
                <h2 style={{ fontSize: "2rem", color: "#2E5939", textAlign: "center", marginBottom: "2rem" }}>
                  Nuestras Sedes
                </h2>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "450px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  }}
                >
                  {sedes.map((sede, index) => (
                    <div
                      key={index}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: `${(index - sedeCarouselIndex) * 100}%`,
                        width: "100%",
                        height: "100%",
                        transition: "left 0.5s ease-in-out",
                      }}
                    >
                      <img
                        src={sede.img}
                        alt={sede.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: "0",
                          left: "0",
                          width: "100%",
                          backgroundColor: "rgba(46, 89, 57, 0.7)",
                          color: "#fff",
                          padding: "1.5rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ paddingRight: "1rem" }}>
                          <h3 style={{ fontSize: "1.5rem", margin: "0" }}>{sede.name}</h3>
                          <p style={{ margin: "0.5rem 0 0" }}>{sede.description}</p>
                        </div>
                        <button
                          onClick={() => handleShowCabins(sede)}
                          style={{
                            backgroundColor: "#fff",
                            color: "#2E5939",
                            border: "none",
                            padding: "0.8rem 1.5rem",
                            borderRadius: "20px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            transition: "background-color 0.3s, transform 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        >
                          Ver Cabañas
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={prevSedeSlide}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "15px",
                      transform: "translateY(-50%)",
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      border: "none",
                      color: "#2E5939",
                      fontSize: "1.2rem",
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                    }}
                    aria-label="Sede anterior"
                  >
                    <FaChevronLeft />
                  </button>

                  <button
                    onClick={nextSedeSlide}
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "15px",
                      transform: "translateY(-50%)",
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      border: "none",
                      color: "#2E5939",
                      fontSize: "1.2rem",
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                    }}
                    aria-label="Sede siguiente"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </section>

              {/* SECCIÓN TODAS LAS CABINAS EN EL HOME */}
              <section
                style={{
                  width: "100%",
                  maxWidth: "900px",
                  marginBottom: "3rem",
                }}
              >
                <h2 style={{ fontSize: "2rem", color: "#2E5939", textAlign: "center", marginBottom: "2rem" }}>
                  Nuestras Cabañas
                </h2>
                <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "1.5rem" }}>
                  {todasLasCabañas.map((cabin, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "#3E7E5C",
                        color: "#fff",
                        borderRadius: "10px",
                        overflow: "hidden",
                        width: "calc(33.33% - 1rem)",
                        minWidth: "250px",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                        textAlign: "center",
                      }}
                    >
                      <img src={cabin.img} alt={cabin.name} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                      <div style={{ padding: "1.5rem" }}>
                        <h3 style={{ margin: "0 0 0.5rem" }}>{cabin.name}</h3>
                        <p style={{ fontSize: "0.9rem", lineHeight: "1.4", marginBottom: "1rem" }}>
                          {cabin.description}
                        </p>
                        <p style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "1rem" }}>
                          {cabin.price}
                        </p>
                        <button
                          onClick={() => handleShowCabinDetails(cabin)}
                          style={{
                            backgroundColor: "#E8F5E9",
                            color: "#2E5939",
                            border: "none",
                            padding: "0.8rem 1.5rem",
                            borderRadius: "20px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            transition: "background-color 0.3s, transform 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        >
                          Ver más
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* INFORMACIÓN SOBRE EL GLAMPING */}
              <section
                style={{
                  width: "100%",
                  maxWidth: "900px",
                  backgroundColor: "rgba(232, 245, 233, 0.4)",
                  padding: "2rem",
                  borderRadius: "15px",
                  marginBottom: "3rem",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                }}
              >
                <h2 style={{ fontSize: "2rem", color: "#2E5939", textAlign: "center", marginBottom: "1rem" }}>
                  ¡Conecta con la naturaleza sin perder el lujo!
                </h2>
                <p style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "#2E3A30" }}>
                  "Bienvenido a Bosque Sagrado, estamos ubicados en Antioquia, con tres sedes estratégicas: una en Copacabana, otra en San Félix and la última en el Cerro de las Tres Cruces, a tan solo dos horas de Medellín.
                </p>
                <p style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "#2E3A30" }}>
                  En medio de paisajes naturales únicos, Bosque Sagrado es un lugar mágico ideal para vivir experiencias inolvidables con tu pareja, familia o amigos. Disfruta de un entorno natural y relajante, rodeado de belleza, en nuestras exclusivas instalaciones diseñadas especialmente para ti. Contamos con espacios modernos y confortables que incluyen actividades diversas para hacer tu estancia aún más especial. Cada una de nuestras sedes ofrece habitaciones equipadas con jacuzzi privado, para que disfrutes al máximo de tu experiencia en el corazón de la naturaleza."
                </p>
              </section>

              {/* SECCIÓN PAQUETES */}
              <section
                style={{
                  width: "100%",
                  maxWidth: "900px",
                  marginBottom: "3rem",
                }}
              >
                <h2 style={{ fontSize: "2rem", color: "#2E5939", textAlign: "center", marginBottom: "2rem" }}>
                  Complementa tu plan ideal con nuestros paquetes
                </h2>
                <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "1.5rem" }}>
                  {paquetes.map((paquete, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "#3E7E5C",
                        color: "#fff",
                        borderRadius: "10px",
                        overflow: "hidden",
                        width: "calc(33.33% - 1rem)",
                        minWidth: "250px",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                        textAlign: "center",
                      }}
                    >
                      <img src={paquete.img} alt={paquete.name} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                      <div style={{ padding: "1.5rem" }}>
                        <h3 style={{ margin: "0 0 0.5rem" }}>{paquete.name}</h3>
                        <p style={{ fontSize: "0.9rem", lineHeight: "1.4", marginBottom: "1rem" }}>
                          {paquete.description}
                        </p>
                        <button
                          onClick={() => handleShowDetails(paquete)}
                          style={{
                            backgroundColor: "#E8F5E9",
                            color: "#2E5939",
                            border: "none",
                            padding: "0.8rem 1.5rem",
                            borderRadius: "20px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            transition: "background-color 0.3s, transform 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        >
                          Ver más
                        </button>
                    </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* FORMULARIOS DE LOGIN Y REGISTRO */}
          {showForm && (
            <div
              style={{
                width: "100%",
                maxWidth: isRegisterActive ? "500px" : "400px",
                backgroundColor: "#fff",
                padding: "2rem",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                margin: "2rem 0",
              }}
            >
              {/* Formulario Login */}
              {!showForgotPassword && !isRegisterActive && (
                <form
                  style={{
                    width: "100%",
                  }}
                  onSubmit={handleLoginSubmit}
                >
                  <h3
                    style={{
                      marginBottom: "1.5rem",
                      textAlign: "center",
                      color: "#2E5939",
                    }}
                  >
                    Iniciar sesión
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "1rem",
                      border: "1px solid #ddd",
                      padding: "0.8rem",
                      borderRadius: "8px",
                      transition: "border-color 0.3s",
                    }}
                  >
                    <FaEnvelope style={{ marginRight: "10px", color: "#3E7E5C" }} />
                    <input
                      type="email"
                      placeholder="Correo electrónico"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      style={{
                        flex: 1,
                        border: "none",
                        outline: "none",
                        fontSize: "1rem",
                        backgroundColor: "transparent",
                        color: "#2E3A30",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "1.5rem",
                      border: "1px solid #ddd",
                      padding: "0.8rem",
                      borderRadius: "8px",
                      transition: "border-color 0.3s",
                    }}
                  >
                    <FaLock style={{ marginRight: "10px", color: "#3E7E5C" }} />
                    <input
                      type="password"
                      placeholder="Contraseña"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      style={{
                        flex: 1,
                        border: "none",
                        outline: "none",
                        fontSize: "1rem",
                        backgroundColor: "transparent",
                        color: "#2E3A30",
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: "0.9rem",
                      backgroundColor: isLoading ? "#7a9c87" : "#2E5939",
                      color: "#fff",
                      fontWeight: "600",
                      border: "none",
                      borderRadius: "8px",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      fontSize: "1rem",
                      marginBottom: "1rem",
                      transition: "background-color 0.3s",
                    }}
                    onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = "#244A30")}
                    onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = "#2E5939")}
                  >
                    {isLoading ? "Verificando..." : "Iniciar sesión"}
                  </button>
                  
                  <p
                    style={{
                      color: "#3E7E5C",
                      fontWeight: "500",
                      cursor: "pointer",
                      textAlign: "center",
                      userSelect: "none",
                    }}
                    onClick={handleShowRegister}
                  >
                    ¿No tienes cuenta? <span style={{textDecoration: "underline"}}>Regístrate aquí</span>
                  </p>
                </form>
              )}

              {/* Formulario Registro */}
              {!showForgotPassword && isRegisterActive && (
                <form
                  style={{
                    width: "100%",
                  }}
                  onSubmit={handleRegisterSubmit}
                >
                  <h3
                    style={{
                      marginBottom: "1.5rem",
                      textAlign: "center",
                      color: "#2E5939",
                    }}
                  >
                    Registrarse
                  </h3>

                  <div style={{ marginBottom: "1.5rem" }}>
                    {/* Tipo de Documento */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: errors.tipoDocumento ? "0.5rem" : "1rem",
                        border: errors.tipoDocumento ? "1px solid #e74c3c" : "1px solid #ddd",
                        padding: "0.8rem",
                        borderRadius: "8px",
                      }}
                    >
                      <FaIdCard style={{ marginRight: "10px", color: "#3E7E5C" }} />
                      <select
                        value={tipoDocumento}
                        onChange={(e) => setTipoDocumento(e.target.value)}
                        style={{
                          flex: 1,
                          border: "none",
                          outline: "none",
                          fontSize: "1rem",
                          backgroundColor: "transparent",
                          color: "#2E3A30",
                          cursor: "pointer",
                        }}
                      >
                        {tiposDocumento.map((tipo) => (
                          <option key={tipo} value={tipo}>
                            {tipo}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.tipoDocumento && (
                      <p style={{ color: "#e74c3c", fontSize: "0.8rem", marginBottom: "1rem" }}>
                        {errors.tipoDocumento}
                      </p>
                    )}

                    {/* Número de Documento */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: errors.numeroDocumento ? "0.5rem" : "1rem",
                        border: errors.numeroDocumento ? "1px solid #e74c3c" : "1px solid #ddd",
                        padding: "0.8rem",
                        borderRadius: "8px",
                      }}
                    >
                      <FaIdCard style={{ marginRight: "10px", color: "#3E7E5C" }} />
                      <input
                        type="text"
                        placeholder="Número de Documento"
                        required
                        value={numeroDocumento}
                        onChange={handleDocumentNumberChange}
                        style={{
                          flex: 1,
                          border: "none",
                          outline: "none",
                          fontSize: "1rem",
                          backgroundColor: "transparent",
                          color: "#2E3A30",
                        }}
                      />
                    </div>
                    {errors.numeroDocumento && (
                      <p style={{ color: "#e74c3c", fontSize: "0.8rem", marginBottom: "1rem" }}>
                        {errors.numeroDocumento}
                      </p>
                    )}

                    {/* Nombre */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: errors.firstName ? "0.5rem" : "1rem",
                        border: errors.firstName ? "1px solid #e74c3c" : "1px solid #ddd",
                        padding: "0.8rem",
                        borderRadius: "8px",
                      }}
                    >
                      <FaUser style={{ marginRight: "10px", color: "#3E7E5C" }} />
                      <input
                        type="text"
                        placeholder="Nombre"
                        required
                        value={firstName}
                        onChange={(e) => handleTextInputChange(e, setFirstName)}
                        style={{
                          flex: 1,
                          border: "none",
                          outline: "none",
                          fontSize: "1rem",
                          backgroundColor: "transparent",
                          color: "#2E3A30",
                        }}
                      />
                    </div>
                    {errors.firstName && (
                      <p style={{ color: "#e74c3c", fontSize: "0.8rem", marginBottom: "1rem" }}>
                        {errors.firstName}
                      </p>
                    )}

                    {/* Apellido */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: errors.lastName ? "0.5rem" : "1rem",
                        border: errors.lastName ? "1px solid #e74c3c" : "1px solid #ddd",
                        padding: "0.8rem",
                        borderRadius: "8px",
                      }}
                    >
                      <FaUser style={{ marginRight: "10px", color: "#3E7E5C" }} />
                      <input
                        type="text"
                        placeholder="Apellido"
                        required
                        value={lastName}
                        onChange={(e) => handleTextInputChange(e, setLastName)}
                        style={{
                          flex: 1,
                          border: "none",
                          outline: "none",
                          fontSize: "1rem",
                          backgroundColor: "transparent",
                          color: "#2E3A30",
                        }}
                      />
                    </div>
                    {errors.lastName && (
                      <p style={{ color: "#e74c3c", fontSize: "0.8rem", marginBottom: "1rem" }}>
                        {errors.lastName}
                      </p>
                    )}

                    {/* Celular */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: errors.celular ? "0.5rem" : "1rem",
                        border: errors.celular ? "1px solid #e74c3c" : "1px solid #ddd",
                        padding: "0.8rem",
                        borderRadius: "8px",
                      }}
                    >
                      <FaPhone style={{ marginRight: "10px", color: "#3E7E5C" }} />
                      <input
                        type="text"
                        placeholder="Número de Celular"
                        required
                        value={celular}
                        onChange={handlePhoneChange}
                        style={{
                          flex: 1,
                          border: "none",
                          outline: "none",
                          fontSize: "1rem",
                          backgroundColor: "transparent",
                          color: "#2E3A30",
                        }}
                      />
                    </div>
                    {errors.celular && (
                      <p style={{ color: "#e74c3c", fontSize: "0.8rem", marginBottom: "1rem" }}>
                        {errors.celular}
                      </p>
                    )}

                    {/* Fecha de Nacimiento */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: errors.fechaNacimiento ? "0.5rem" : "1rem",
                        border: errors.fechaNacimiento ? "1px solid #e74c3c" : "1px solid #ddd",
                        padding: "0.8rem",
                        borderRadius: "8px",
                      }}
                    >
                      <FaCalendarAlt style={{ marginRight: "10px", color: "#3E7E5C" }} />
                      <input
                        type="date"
                        required
                        value={fechaNacimiento}
                        onChange={(e) => setFechaNacimiento(e.target.value)}
                        style={{
                          flex: 1,
                          border: "none",
                          outline: "none",
                          fontSize: "1rem",
                          backgroundColor: "transparent",
                          color: "#2E3A30",
                        }}
                      />
                    </div>
                    {errors.fechaNacimiento && (
                      <p style={{ color: "#e74c3c", fontSize: "0.8rem", marginBottom: "1rem" }}>
                        {errors.fechaNacimiento}
                      </p>
                    )}

                    {/* Email */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: errors.registerEmail ? "0.5rem" : "1rem",
                        border: errors.registerEmail ? "1px solid #e74c3c" : "1px solid #ddd",
                        padding: "0.8rem",
                        borderRadius: "8px",
                      }}
                    >
                      <FaEnvelope style={{ marginRight: "10px", color: "#3E7E5C" }} />
                      <input
                        type="email"
                        placeholder="Correo Electrónico"
                        required
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        style={{
                          flex: 1,
                          border: "none",
                          outline: "none",
                          fontSize: "1rem",
                          backgroundColor: "transparent",
                          color: "#2E3A30",
                        }}
                      />
                    </div>
                    {errors.registerEmail && (
                      <p style={{ color: "#e74c3c", fontSize: "0.8rem", marginBottom: "1rem" }}>
                        {errors.registerEmail}
                      </p>
                    )}

                    {/* Contraseña */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: errors.registerPassword ? "0.5rem" : "1rem",
                        border: errors.registerPassword ? "1px solid #e74c3c" : "1px solid #ddd",
                        padding: "0.8rem",
                        borderRadius: "8px",
                      }}
                    >
                      <FaLock style={{ marginRight: "10px", color: "#3E7E5C" }} />
                      <input
                        type="password"
                        placeholder="Contraseña"
                        required
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        style={{
                          flex: 1,
                          border: "none",
                          outline: "none",
                          fontSize: "1rem",
                          backgroundColor: "transparent",
                          color: "#2E3A30",
                        }}
                      />
                    </div>
                    {errors.registerPassword && (
                      <p style={{ color: "#e74c3c", fontSize: "0.8rem", marginBottom: "1rem" }}>
                        {errors.registerPassword}
                      </p>
                    )}

                    {/* Confirmar Contraseña */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: errors.confirmPassword ? "0.5rem" : "1rem",
                        border: errors.confirmPassword ? "1px solid #e74c3c" : "1px solid #ddd",
                        padding: "0.8rem",
                        borderRadius: "8px",
                      }}
                    >
                      <FaLock style={{ marginRight: "10px", color: "#3E7E5C" }} />
                      <input
                        type="password"
                        placeholder="Confirmar Contraseña"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{
                          flex: 1,
                          border: "none",
                          outline: "none",
                          fontSize: "1rem",
                          backgroundColor: "transparent",
                          color: "#2E3A30",
                        }}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p style={{ color: "#e74c3c", fontSize: "0.8rem", marginBottom: "1rem" }}>
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: "0.9rem",
                      backgroundColor: isLoading ? "#7a9c87" : "#2E5939",
                      color: "#fff",
                      fontWeight: "600",
                      border: "none",
                      borderRadius: "8px",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      fontSize: "1rem",
                      marginBottom: "0.5rem",
                      transition: "background-color 0.3s",
                    }}
                    onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = "#244A30")}
                    onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = "#2E5939")}
                  >
                    {isLoading ? "Registrando..." : "Registrarse"}
                  </button>

                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#3E7E5C",
                      textAlign: "center",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={handleShowLogin}
                  >
                    ¿Ya tienes cuenta? Inicia sesión aquí
                  </p>
                </form>
              )}
            </div>
          )}
        </main>

        {/* FOOTER */}
        <footer
          style={{
            backgroundColor: "#2E5939",
            color: "#fff",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <div style={{ marginBottom: "1rem" }}>
            <img src="/images/Logo.png" alt="Bosque Sagrado" style={{ width: "100px", filter: "invert(1) grayscale(1) brightness(2)" }} />
          </div>
          <p style={{ margin: "0.5rem 0", fontSize: "1.2rem" }}>Bosque Sagrado</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "1rem" }}>
            <a href="#" style={{ color: "#fff", fontSize: "1.5rem" }}>
              <FaFacebook />
            </a>
            <a href="#" style={{ color: "#fff", fontSize: "1.5rem" }}>
              <FaInstagram />
            </a>
            <a href="#" style={{ color: "#fff", fontSize: "1.5rem" }}>
              <FaWhatsapp />
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}

export default LoginRegister;