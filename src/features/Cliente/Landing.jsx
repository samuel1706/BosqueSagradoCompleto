import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { clearUser, isAuthenticated, getUserForReservation } from "../../utils/auth";
import { FaChevronLeft, FaChevronRight, FaFacebook, FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaHome, FaUsers, FaBed, FaStar } from "react-icons/fa";

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

// Obtener opciones únicas para filtros
const sedesUnicas = [...new Set(cabañas.map(cabin => cabin.sede))];
const tiposUnicos = [...new Set(cabañas.map(cabin => cabin.tipo))];
const capacidadesUnicas = [...new Set(cabañas.map(cabin => cabin.capacidad))].sort((a, b) => a - b);

export default function Landing() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedCabin, setSelectedCabin] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [cabinImageIndex, setCabinImageIndex] = useState(0);

  // Estados para filtros
  const [filtroSede, setFiltroSede] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroCapacidad, setFiltroCapacidad] = useState("");

  // Función para filtrar cabañas
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

  const handleLogout = () => {
    console.log("▶ logout botón pulsado");
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión actual se cerrará.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          clearUser();
          console.log("✅ localStorage limpiado");
          window.location.replace("/");
        } catch (e) {
          console.error("Error en logout:", e);
        }
      } else {
        console.log("Logout cancelado");
      }
    });
  };

  // Función para manejar reserva de cabaña
  const handleReservarCabin = (cabin) => {
    if (!isAuthenticated()) {
      Swal.fire({
        title: "Iniciar sesión requerido",
        text: "Debes iniciar sesión para realizar una reserva",
        icon: "warning",
        confirmButtonText: "Entendido"
      });
      return;
    }

    const userData = getUserForReservation();
    if (!userData) {
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar tus datos. Por favor, inicia sesión nuevamente.",
        icon: "error",
        confirmButtonText: "Entendido"
      });
      return;
    }

    // Navegar al formulario de reserva con los datos de la cabaña y usuario
    navigate("/cliente/reserva-form", { 
      state: { 
        cabana: cabin,
        usuario: userData
      }
    });
  };

  const handleShowDetails = (paquete) => {
    setSelectedPackage(paquete);
    setShowPopup(true);
  };

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

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % cabañas.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + cabañas.length) % cabañas.length);
  };

  return (
    <>
      {/* NAV MODERNO */}
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
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 1000,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "40px",
          }}
        >
          <img src="/images/Logo.png" alt="" width="35px" style={{ marginRight: "10px" }} />
          <span style={{
            fontWeight: "bold",
            fontSize: "1.8rem",
            color: "#E8F5E9",
            userSelect: "none",
            fontFamily: "'Playfair Display', serif"
          }}>
            Bosque Sagrado
          </span>
        </div>
        
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "2rem",
          marginRight: "40px"
        }}>
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
                onClick={() => navigate("/cliente/mis-reservas")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = "transparent";
                }}
              >
                Reservas
              </a>
            </li>
          </ul>
          
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "rgba(232, 245, 233, 0.1)",
              color: "#E8F5E9",
              border: "1px solid rgba(232, 245, 233, 0.3)",
              padding: "10px 20px",
              borderRadius: "25px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "1rem",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(232, 245, 233, 0.2)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(232, 245, 233, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT CON DISEÑO PREMIUM */}
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#f8faf8",
        paddingTop: "70px",
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
                    onClick={handleClosePopup}
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
                    Cerrar
                  </button>
                  <button
                    onClick={() => {
                      handleClosePopup();
                      handleReservarCabin(selectedCabin);
                    }}
                    style={{
                      flex: 1,
                      padding: "0.8rem",
                      backgroundColor: "#3E7E5C",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    Reservar Ahora
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* HERO SECTION PREMIUM */}
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
                onClick={() => navigate("/cliente/mis-reservas")}
                style={{
                  backgroundColor: "#E8F5E9",
                  color: "#2E5939",
                  border: "none",
                  padding: "18px 35px",
                  borderRadius: "30px",
                  fontWeight: "600",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(232, 245, 233, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Mis Reservas
              </button>
            </div>
          </section>

          {/* CARRUSEL DE CABINAS */}
          <section style={{ padding: "5rem 0", backgroundColor: "#fff" }}>
            <div style={{ width: "100%" }}>
              <h2 style={{
                fontSize: "3rem",
                color: "#2E5939",
                textAlign: "center",
                marginBottom: "3rem",
                fontFamily: "'Playfair Display', serif"
              }}>
                Nuestras Cabañas
              </h2>
              <div style={{ position: "relative", width: "100%", height: "600px", overflow: "hidden" }}>
                {cabañas.map((cabin, index) => (
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

          {/* FILTROS SIMPLIFICADOS */}
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
               
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "1rem" }}>
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

          {/* SERVICIOS EXCLUSIVOS */}
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
                    onClick={() => navigate("/cliente/mis-reservas")}
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      textDecoration: "none",
                      cursor: "pointer",
                      transition: "color 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
                  >
                    Mis Reservas
                  </a>
                </li>
              </ul>
            </div>

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