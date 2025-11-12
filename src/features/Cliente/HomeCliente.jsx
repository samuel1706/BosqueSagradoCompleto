import React, { useState } from "react";
import { 
  FaUser, 
  FaMapMarkerAlt, 
  FaHome, 
  FaUsers, 
  FaBed, 
  FaStar, 
  FaSignOutAlt, 
  FaListAlt, 
  FaPlusCircle, 
  FaFacebook, 
  FaInstagram, 
  FaWhatsapp,
  FaChevronLeft,
  FaChevronRight,
  FaPhone,
  FaEnvelope
} from "react-icons/fa";
import { getUser, saveUser, logout } from "../../utils/auth"; // Cambiar removeUser por logout
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Datos de las cabañas
const cabañas = [
  {
    id: 101,
    name: "Cabaña Ambar Room",
    description: "Amplia cabaña con jacuzzi privado. Ideal para parejas que buscan privacidad y lujo.",
    img: "/images/C_Ambar_Room/img1.jpg",
    price: "$395.000 COP/noche",
    sede: "Copacabana",
    tipo: "Premium",
    capacidad: 2,
    habitaciones: 1,
    imagenes: [
      "/images/C_Ambar_Room/img1.jpg",
      "/images/C_Ambar_Room/img2.jpg",
      "/images/C_Ambar_Room/img3.jpg"
    ],
    comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"]
  },
  {
    id: 102,
    name: "Cabaña Bali Suite",
    description: "Cabaña Premium. Perfecta para una escapada romántica con todas las comodidades.",
    img: "/images/C_Bali_Suite/img1.jpg",
    price: "$520.000 COP/noche",
    sede: "Copacabana",
    tipo: "Premium",
    capacidad: 2,
    habitaciones: 1,
    imagenes: [
      "/images/C_Bali_Suite/img1.jpg",
      "/images/C_Bali_Suite/img2.jpg",
      "/images/C_Bali_Suite/img3.jpg"
    ],
    comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"]
  },
  {
    id: 103,
    name: "Cabaña Habana Room",
    description: "Espaciosa cabaña ideal para familias, Perfecta para vacaciones familiares inolvidables.",
    img: "/images/C_Habana_Room/img1.jpg",
    price: "$520.000 COP/noche",
    sede: "Copacabana",
    tipo: "Familiar",
    capacidad: 6,
    habitaciones: 1,
    imagenes: [
      "/images/C_Habana_Room/img1.jpg",
      "/images/C_Habana_Room/img2.jpg",
      "/images/C_Habana_Room/img3.jpg"
    ],
    comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Piscina Privada", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"]
  },
  {
    id: 201,
    name: "Chalets",
    description: "Ideal para parejas, con cama king. Un refugio íntimo para reconectar con tu pareja.",
    img: "/images/S_Chalets/img1.jpg",
    price: "$380.000 COP/noche",
    sede: "San Felix",
    tipo: "Premium",
    capacidad: 2,
    habitaciones: 1,
    imagenes: [
      "/images/S_Chalets/img1.jpg",
      "/images/S_Chalets/img2.jpg"
    ],
    comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"]
  },
  {
    id: 202,
    name: "Cabaña Crystal Garden",
    description: "Perfecta para una escapada romántica con todas las comodidades.",
    img: "/images/S_Crystal_Garden/img1.jpg",
    price: "$495.000 COP/noche",
    sede: "San Felix",
    tipo: "Premium",
    capacidad: 2,
    habitaciones: 1,
    imagenes: [
      "/images/S_Crystal_Garden/img1.jpg",
      "/images/S_Crystal_Garden/img2.jpg"
    ],
    comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"]
  }
];

const HomeCliente = () => {
  const user = getUser();
  const navigate = useNavigate();
  const [filtroSede, setFiltroSede] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroCapacidad, setFiltroCapacidad] = useState("");
  const [selectedCabin, setSelectedCabin] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [cabinImageIndex, setCabinImageIndex] = useState(0);

  // Obtener opciones únicas para filtros
  const sedesUnicas = [...new Set(cabañas.map(cabin => cabin.sede))];
  const tiposUnicos = [...new Set(cabañas.map(cabin => cabin.tipo))];
  const capacidadesUnicas = [...new Set(cabañas.map(cabin => cabin.capacidad))].sort((a, b) => a - b);

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

  const handleShowCabinDetails = (cabin) => {
    setSelectedCabin(cabin);
    setCabinImageIndex(0);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedCabin(null);
    setCabinImageIndex(0);
  };

  const handleReserveCabin = () => {
    setShowPopup(false);
    navigate("/reservar");
  };

  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas salir?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2E5939',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); // Cambiar removeUser por logout
        navigate("/", { replace: true });
      }
    });
  };

  const handleNuevaReserva = () => {
    navigate("/reservar");
  };

  const handleMisReservas = () => {
    navigate("/mis-reservas");
  };

  // Si no hay usuario, redirigir al login
  if (!user) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8faf8", margin: 0 }}>
      {/* Header */}
      <nav style={{
        backgroundColor: "#2E5939",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img 
            src="/images/Logo.png" 
            alt="Bosque Sagrado" 
            style={{ width: "45px", height: "45px" }}
          />
          <h1 style={{ color: 'white', margin: 0, fontSize: '1.5rem', fontFamily: "'Playfair Display', serif" }}>
            Bosque Sagrado
          </h1>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              <FaUser style={{ color: "#E8F5E9" }} />
              <span style={{ color: "#E8F5E9", fontWeight: "500" }}>
                Hola, {user?.nombre || "Cliente"}
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            style={{
              backgroundColor: "transparent",
              color: "#E8F5E9",
              border: "1px solid #E8F5E9",
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              cursor: "pointer",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            <FaSignOutAlt />
            Salir
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        background: "linear-gradient(135deg, rgba(46, 89, 57, 0.9) 0%, rgba(62, 126, 92, 0.8) 100%)",
        padding: "4rem 2rem",
        textAlign: "center",
        color: "#fff",
        marginBottom: "3rem"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{
            fontSize: "3rem",
            marginBottom: "1rem",
            fontFamily: "'Playfair Display', serif",
            fontWeight: "700"
          }}>
            Bienvenido a tu Paraíso
          </h1>
          <p style={{
            fontSize: "1.3rem",
            marginBottom: "2rem",
            opacity: 0.9
          }}>
            Descubre la magia de conectar con la naturaleza sin sacrificar el confort
          </p>
          
          {/* Quick Actions */}
          <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={handleNuevaReserva}
              style={{
                backgroundColor: "#E8F5E9",
                color: "#2E5939",
                border: "none",
                padding: "12px 25px",
                borderRadius: "25px",
                fontWeight: "600",
                fontSize: "1rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <FaPlusCircle />
              Nueva Reserva
            </button>
            
            <button
              onClick={handleMisReservas}
              style={{
                backgroundColor: "transparent",
                color: "#E8F5E9",
                border: "2px solid #E8F5E9",
                padding: "12px 25px",
                borderRadius: "25px",
                fontWeight: "600",
                fontSize: "1rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <FaListAlt />
              Mis Reservas
            </button>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "15px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
          marginBottom: "2rem"
        }}>
          <h3 style={{ color: "#2E5939", marginBottom: "1.5rem", textAlign: "center", fontSize: "1.5rem" }}>
            Encuentra tu Cabaña Ideal
          </h3>
         
          {/* Filtros */}
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
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <button
              onClick={limpiarFiltros}
              style={{
                padding: "0.8rem 1.5rem",
                backgroundColor: "#e0e0e0",
                color: "#333",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold"
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
      </section>

      {/* Cabañas Destacadas */}
      <section style={{ padding: "0 2rem 4rem", maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{
          fontSize: "2.5rem",
          color: "#2E5939",
          textAlign: "center",
          marginBottom: "3rem",
          fontFamily: "'Playfair Display', serif"
        }}>
          Nuestras Cabañas
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
          {cabañasFiltradas.map((cabin, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#fff",
                borderRadius: "15px",
                overflow: "hidden",
                boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                cursor: "pointer"
              }}
              onClick={() => handleShowCabinDetails(cabin)}
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
              <div style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <h3 style={{ margin: "0", color: "#2E5939", fontSize: "1.3rem" }}>{cabin.name}</h3>
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
                <p style={{ color: "#5D6D63", marginBottom: "1.5rem", lineHeight: "1.5", fontSize: "0.9rem" }}>{cabin.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#3E7E5C" }}>{cabin.price}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowCabinDetails(cabin);
                    }}
                    style={{
                      backgroundColor: "#2E5939",
                      color: "#fff",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontSize: "0.9rem"
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
            <h3 style={{ marginBottom: "1rem", color: "#2E5939" }}>No se encontraron cabañas</h3>
            <p>Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </section>

      {/* Popup de detalles de cabaña */}
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
                  height: "300px",
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
                      width: "40px",
                      height: "40px",
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
                      width: "40px",
                      height: "40px",
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
                          width: "10px",
                          height: "10px",
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
                  fontWeight: "bold"
                }}
              >
                Reservar Ahora
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
                  fontWeight: "bold"
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        backgroundColor: "#2E5939",
        color: "#fff",
        padding: "3rem 2rem 2rem",
        marginTop: "4rem"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "3rem",
          marginBottom: "2rem"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
              <img
                src="/images/Logo.png"
                alt="Bosque Sagrado"
                style={{
                  width: "40px",
                  height: "40px",
                  marginRight: "1rem",
                  filter: "brightness(0) invert(1)"
                }}
              />
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: "bold", fontSize: "1.5rem" }}>
                Bosque Sagrado
              </span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: "1.6", marginBottom: "1.5rem" }}>
              Donde el lujo se encuentra con la naturaleza. Experimenta la magia del glamping en los paisajes más espectaculares de Antioquia.
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              {[FaFacebook, FaInstagram, FaWhatsapp].map((Icon, index) => (
                <a key={index} href="#" style={{
                  color: "#fff",
                  fontSize: "1.2rem",
                  padding: "0.5rem",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.1)"
                }}>
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>Contacto</h4>
            <div style={{ color: "rgba(255,255,255,0.8)", lineHeight: "1.6" }}>
              <p style={{ margin: "0 0 0.8rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FaPhone /> +57 300 123 4567
              </p>
              <p style={{ margin: "0 0 0.8rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FaEnvelope /> info@bosquesagrado.com
              </p>
              <p style={{ margin: "0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FaMapMarkerAlt /> Antioquia, Colombia
              </p>
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
  );
};

export default HomeCliente;