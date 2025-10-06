import React, { useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaIdCard, FaPhone, FaCalendarAlt, FaCheck, FaChevronLeft, FaChevronRight, FaFacebook, FaInstagram, FaWhatsapp, FaLightbulb, FaEye } from "react-icons/fa";
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
    const response = await fetch('http://localhost:5255/api/Usuarios/Login', {
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
        const errorData = await response.text();
        if (errorData) {
          errorMessage = errorData;
        }
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

// Función para registrar usuario usando la API
const registerWithAPI = async (userData) => {
  try {
    console.log('Enviando datos de registro:', userData);
    
    const response = await fetch('http://localhost:5255/api/Usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    console.log('Respuesta del servidor:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = 'Error en el registro';
      
      try {
        const errorText = await response.text();
        console.log('Error text:', errorText);
        
        if (errorText.includes('Microsoft')) {
          if (errorText.includes('correo')) {
            errorMessage = 'El correo electrónico ya está registrado';
          } else if (errorText.includes('contraseña') || errorText.includes('password')) {
            errorMessage = 'Error en la contraseña';
          } else {
            errorMessage = 'Error del servidor. Por favor, intenta más tarde.';
          }
        } else {
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.mensaje || errorData.message || errorText;
          } catch {
            errorMessage = errorText || 'Error desconocido';
          }
        }
      } catch (e) {
        console.error('Error procesando respuesta de error:', e);
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('Registro exitoso:', result);
    return result;
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};

// Función para obtener usuario por correo
const getUserByEmail = async (email) => {
  try {
    const response = await fetch(`http://localhost:5255/api/Usuarios/ObtenerPorCorreo?correo=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error obteniendo usuario');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados para login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const showAlert = (title, text, icon) => {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonColor: '#2E5939',
      background: '#fff',
      color: '#2E3A30'
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
    setFirstName("");
    setLastName("");
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
    setCarouselIndex((prev) => (prev + 1) % cabañas.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + cabañas.length) % cabañas.length);
  };

  const goToSlide = (index) => {
    setCarouselIndex(index);
  };

  const nextSedeSlide = () => {
    setSedeCarouselIndex((prev) => (prev + 1) % sedes.length);
  };

  const prevSedeSlide = () => {
    setSedeCarouselIndex((prev) => (prev - 1 + sedes.length) % sedes.length);
  };

  const goToSedeSlide = (index) => {
    setSedeCarouselIndex(index);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
  };

  const validateRegisterForm = () => {
    let newErrors = {};
    let isValid = true;

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
      showAlert('Error', 'Por favor corrige los errores en el formulario', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      const userData = {
        nombre: firstName.trim(),
        apellido: lastName.trim(),
        correo: registerEmail.trim(),
        contrasena: registerPassword,
        idRol: 1,
        estado: true // Cambiado a true para que el usuario pueda acceder directamente
      };

      console.log('Intentando registrar usuario:', userData);
      
      const result = await registerWithAPI(userData);
      
      if (result) {
        showAlert('Registro exitoso', 'Usuario registrado correctamente. Ahora puedes iniciar sesión.', 'success');
        
        // Obtener datos del usuario recién registrado
        try {
          const userData = await getUserByEmail(registerEmail);
          
          const user = {
            id: userData.id,
            firstName: userData.nombre || firstName,
            lastName: userData.apellido || lastName,
            email: userData.correo || registerEmail,
            isVerified: true
          };
          
          // Guardar en localStorage y redirigir directamente
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('isAuthenticated', 'true');
          
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
          
        } catch (userError) {
          console.error('Error obteniendo datos del usuario:', userError);
          // Si no podemos obtener los datos, usar los datos del formulario
          const user = {
            firstName: firstName,
            lastName: lastName,
            email: registerEmail,
            isVerified: true
          };
          
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('isAuthenticated', 'true');
          
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        }
      } else {
        showAlert('Error', 'Error en el registro', 'error');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      showAlert('Error', error.message || 'Error al registrar usuario. Verifica que el correo no esté ya registrado.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!loginEmail || !loginPassword) {
      showAlert('Error', 'Por favor ingresa correo y contraseña', 'error');
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(loginEmail)) {
      showAlert('Error', 'Formato de correo electrónico inválido', 'error');
      setIsLoading(false);
      return;
    }

    try {
      const result = await loginWithAPI(loginEmail, loginPassword);
      
      if (result) {
        // Obtener datos completos del usuario
        try {
          const userData = await getUserByEmail(loginEmail);
          
          const user = {
            id: userData.id,
            firstName: userData.nombre || loginEmail.split('@')[0],
            lastName: userData.apellido || '',
            email: userData.correo || loginEmail,
            isVerified: true
          };
          
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('isAuthenticated', 'true');
          
          showAlert(
            'Inicio de sesión exitoso',
            `Bienvenido de nuevo ${user.firstName} ${user.lastName}`,
            'success'
          );
          
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
          
        } catch (userError) {
          console.error('Error obteniendo datos del usuario:', userError);
          showAlert('Error', 'Error obteniendo información del usuario', 'error');
        }
      } else {
        showAlert('Error', 'Credenciales incorrectas', 'error');
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      showAlert('Error', error.message || 'Error del servidor. Intenta nuevamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextInputChange = (e, setter) => {
    const value = e.target.value;
    setter(value.replace(/[^a-zA-Z\s]/g, ''));
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