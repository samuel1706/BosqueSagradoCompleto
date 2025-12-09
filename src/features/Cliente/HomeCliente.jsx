import React, { useState, useEffect, useMemo } from "react";
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
  FaEnvelope,
  FaChair,
  FaDollarSign,
  FaImage,
  FaSearch,
  FaArrowUp,
  FaChevronDown,
  FaChevronUp,
  FaCrown,
  FaLightbulb,
  FaEye
} from "react-icons/fa";
import { getUser, logout } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// URL base de la API
const API_BASE_URL = 'http://localhost:5272/api';

// Funciones API para obtener datos
const fetchCabinsFromAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Cabanas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error obteniendo cabañas');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error obteniendo cabañas:', error);
    throw error;
  }
};

const fetchServicesFromAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Servicios`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error obteniendo servicios');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error obteniendo servicios:', error);
    throw error;
  }
};

const fetchSedesFromAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Sede`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error obteniendo sedes');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error obteniendo sedes:', error);
    throw error;
  }
};

const fetchTiposCabanasFromAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/TipoCabana`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error obteniendo tipos de cabañas');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error obteniendo tipos de cabañas:', error);
    throw error;
  }
};

const fetchComodidadesFromAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Comodidades`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error obteniendo comodidades');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error obteniendo comodidades:', error);
    throw error;
  }
};

const fetchCabanaComodidadesFromAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/CabanaPorComodidades`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error obteniendo relaciones cabaña-comodidades');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error obteniendo relaciones cabaña-comodidades:', error);
    throw error;
  }
};

const fetchImagenesFromAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ImgCabana`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error obteniendo imágenes');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error obteniendo imágenes:', error);
    throw error;
  }
};

const HomeCliente = () => {
  const user = getUser();
  const navigate = useNavigate();
  
  // Estados para filtros
  const [filtroSede, setFiltroSede] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroCapacidad, setFiltroCapacidad] = useState("");
  const [selectedCabin, setSelectedCabin] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedSede, setSelectedSede] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [cabinImageIndex, setCabinImageIndex] = useState(0);
  const [sedeImageIndex, setSedeImageIndex] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Estados para datos de la API
  const [cabañas, setCabañas] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [tiposCabanas, setTiposCabanas] = useState([]);
  const [comodidades, setComodidades] = useState([]);
  const [cabanaComodidades, setCabanaComodidades] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  // Estados para mostrar más contenido
  const [showAllCabins, setShowAllCabins] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);

  // Estados para paginación
  const [currentSedePage, setCurrentSedePage] = useState(1);
  const sedesPerPage = 3;

  // Efecto para scroll al inicio al cargar la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Efecto para deshabilitar scroll cuando hay popup abierto
  useEffect(() => {
    if (showPopup) {
      // Guardar el valor actual del scroll
      const scrollY = window.scrollY;
      // Deshabilitar scroll en body
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restaurar scroll cuando se cierra el popup
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    // Limpiar el efecto al desmontar
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [showPopup]);

  // Cargar datos de la API al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [cabinsData, servicesData, sedesData, tiposData, comodidadesData, cabanaComodidadesData, imagenesData] = await Promise.all([
          fetchCabinsFromAPI(),
          fetchServicesFromAPI(),
          fetchSedesFromAPI(),
          fetchTiposCabanasFromAPI(),
          fetchComodidadesFromAPI(),
          fetchCabanaComodidadesFromAPI(),
          fetchImagenesFromAPI()
        ]);

        console.log("📊 Datos obtenidos de la API:", {
          cabañas: cabinsData,
          servicios: servicesData,
          sedes: sedesData,
          tipos: tiposData,
          comodidades: comodidadesData,
          relaciones: cabanaComodidadesData,
          imágenes: imagenesData
        });

        // Transformar datos de cabañas para que coincidan con la estructura esperada
        const transformedCabins = cabinsData.map(cabin => {
          // Obtener comodidades de esta cabaña
          const comodidadesCabin = cabanaComodidadesData
            .filter(cc => cc.idCabana === cabin.idCabana)
            .map(cc => {
              const comodidad = comodidadesData.find(c => c.idComodidades === cc.idComodidades);
              return comodidad ? comodidad.nombreComodidades : null;
            })
            .filter(Boolean);

          // Obtener imágenes de esta cabaña
          const imagenesCabin = imagenesData
            .filter(img => img.idCabana === cabin.idCabana)
            .map(img => img.rutaImagen);

          // Obtener tipo de cabaña
          const tipoCabana = tiposData.find(t => t.idTipoCabana === cabin.idTipoCabana);
          const nombreTipo = tipoCabana ? tipoCabana.nombreTipoCabana : "Estándar";

          // Obtener sede
          const sede = sedesData.find(s => s.idSede === cabin.idSede);
          const nombreSede = sede ? sede.nombreSede : "Sede Principal";

          return {
            id: cabin.idCabana,
            name: cabin.nombre,
            description: cabin.descripcion || "Cabaña cómoda y acogedora para tu estadía.",
            img: imagenesCabin.length > 0 ? imagenesCabin[0] : "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575207/img1_gi8hgx.jpg",
            price: `$${(cabin.precio || 0).toLocaleString()} COP/noche`,
            precioNumerico: cabin.precio || 0,
            sede: nombreSede,
            tipo: nombreTipo,
            capacidad: cabin.capacidad || 2,
            habitaciones: cabin.habitaciones || 1,
            imagenes: imagenesCabin.length > 0 ? imagenesCabin : ["https://res.cloudinary.com/dou17w0m0/image/upload/v1763575207/img1_gi8hgx.jpg"],
            comodidades: comodidadesCabin.length > 0 ? comodidadesCabin : ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"],
            // Información adicional de la API
            idSede: cabin.idSede,
            idTipoCabana: cabin.idTipoCabana,
            precio: cabin.precio,
            descripcionCompleta: cabin.descripcion,
            estado: cabin.estado
          };
        });

        // Transformar datos de servicios
        const transformedServices = servicesData.map(service => ({
          name: service.nombreServicio,
          img: service.imagen || "https://res.cloudinary.com/dou17w0m0/image/upload/v1763576016/asados_nfmvlb.jpg",
          description: service.descripcion || "Servicio de calidad para tu comodidad.",
          price: `$${(service.precioServicio || 0).toLocaleString()} COP`
        }));

        setCabañas(transformedCabins);
        setPaquetes(transformedServices);
        setSedes(sedesData);
        setTiposCabanas(tiposData);
        setComodidades(comodidadesData);
        setCabanaComodidades(cabanaComodidadesData);
        setImagenes(imagenesData);
        setDataError(null);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setDataError('Error al cargar los datos. Mostrando información de ejemplo.');
        // Datos de ejemplo en caso de error
        setCabañas(getDefaultCabins());
        setPaquetes(getDefaultPackages());
        setSedes(getDefaultSedes());
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Datos por defecto en caso de error
  const getDefaultCabins = () => [
    {
      id: 101,
      name: "Cabaña Ambar Room",
      description: "Amplia cabaña con jacuzzi privado. Ideal para parejas que buscan privacidad y lujo.",
      img: "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575207/img1_gi8hgx.jpg",
      price: "$395.000 COP/noche",
      precioNumerico: 395000,
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
      comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"],
      estado: true
    }
  ];

  const getDefaultPackages = () => [
    {
      name: "Kit de Asado",
      img: "https://res.cloudinary.com/dou17w0m0/image/upload/v1763576016/asados_nfmvlb.jpg",
      description: "Perfecto para una noche especial, este kit incluye un jugoso corte de carne acompañado de papas doradas y crujientes.",
      price: "$150.000 COP",
    }
  ];

  const getDefaultSedes = () => [
    {
      idSede: 1,
      nombreSede: "Copacabana",
      descripcion: "Disfruta de una experiencia única en nuestras cabañas premium ubicadas en Copacabana.",
      images: [
        "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575207/img1_gi8hgx.jpg",
        "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575223/img1_x2yzaj.jpg"
      ],
      cabañasCount: 4
    },
    {
      idSede: 2,
      nombreSede: "San Felix",
      descripcion: "Vive momentos inolvidables en San Felix, donde la tranquilidad y el confort se fusionan.",
      images: [
        "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575279/img1_nmydmr.jpg",
        "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575322/img1_r6txan.jpg"
      ],
      cabañasCount: 7
    },
    {
      idSede: 3,
      nombreSede: "Cerro de las Cruces",
      descripcion: "Experimenta la magia de la montaña en nuestras cabañas con vistas espectaculares.",
      images: [
        "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575279/img1_nmydmr.jpg"
      ],
      cabañasCount: 0
    }
  ];

  // Transformar sedes para la galería - TODAS LAS SEDES
  const sedesParaGaleria = useMemo(() => {
    const sedesTransformadas = sedes.map(sede => ({
      id: sede.idSede,
      name: sede.nombreSede,
      description: sede.descripcion || `Disfruta de nuestras cabañas en ${sede.nombreSede}`,
      cabañasCount: cabañas.filter(c => c.idSede === sede.idSede).length,
      images: sede.images || ["https://res.cloudinary.com/dou17w0m0/image/upload/v1763575207/img1_gi8hgx.jpg"],
      cabañas: cabañas.filter(c => c.idSede === sede.idSede) // Agregar las cabañas de cada sede
    }));
    
    return sedesTransformadas;
  }, [sedes, cabañas]);

  // Obtener opciones únicas para filtros desde la API
  const sedesUnicas = useMemo(() => {
    if (sedes && sedes.length > 0) {
      return sedes.map(sede => ({
        id: sede.idSede,
        nombre: sede.nombreSede
      }));
    }
    return [];
  }, [sedes]);

  const tiposUnicos = useMemo(() => {
    if (tiposCabanas && tiposCabanas.length > 0) {
      return tiposCabanas.map(tipo => ({
        id: tipo.idTipoCabana,
        nombre: tipo.nombreTipoCabana
      }));
    }
    return [];
  }, [tiposCabanas]);

  const capacidadesUnicas = useMemo(() => {
    return [...new Set(cabañas.map(cabin => cabin.capacidad))].sort((a, b) => a - b).filter(Boolean);
  }, [cabañas]);

  // Función para filtrar cabañas
  const cabañasFiltradas = cabañas.filter(cabin => {
    const coincideSede = !filtroSede || cabin.idSede === parseInt(filtroSede);
    const coincideTipo = !filtroTipo || cabin.idTipoCabana === parseInt(filtroTipo);
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

  // Función para scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
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

  const handleShowCabinDetails = (cabin) => {
    setSelectedCabin(cabin);
    setCabinImageIndex(0);
    setShowPopup(true);
  };

  const handleShowPackageDetails = (paquete) => {
    setSelectedPackage(paquete);
    setShowPopup(true);
  };

  // Nueva función para mostrar galería de sede con cabañas
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
  if (selectedCabin) {
    setShowPopup(false);
    // Pasar TODOS los datos de la cabaña seleccionada a la página de reserva
    navigate("/reservar", { 
      state: { 
        cabana: {
          ...selectedCabin,
          // Asegurar que tenemos los campos correctos
          id: selectedCabin.id,
          idCabana: selectedCabin.id,
          name: selectedCabin.name,
          nombre: selectedCabin.name,
          descripcion: selectedCabin.description,
          descripcionCompleta: selectedCabin.descripcionCompleta,
          precio: selectedCabin.precioNumerico,
          precioNumerico: selectedCabin.precioNumerico,
          capacidad: selectedCabin.capacidad,
          habitaciones: selectedCabin.habitaciones,
          idSede: selectedCabin.idSede,
          idTipoCabana: selectedCabin.idTipoCabana,
          tipo: selectedCabin.tipo,
          sede: selectedCabin.sede,
          imagenes: selectedCabin.imagenes,
          comodidades: selectedCabin.comodidades,
          estado: selectedCabin.estado
        }
      } 
    });
  }
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
        logout();
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

  // Estilos para comodidades
  const comodidadTagStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    backgroundColor: '#E8F5E8',
    color: '#2E5939',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    margin: '2px'
  };

  // Lógica de paginación para sedes
  const sedesPaginadas = useMemo(() => {
    const startIndex = (currentSedePage - 1) * sedesPerPage;
    return sedesParaGaleria.slice(startIndex, startIndex + sedesPerPage);
  }, [sedesParaGaleria, currentSedePage]);

  const totalSedePages = Math.ceil(sedesParaGaleria.length / sedesPerPage);

  // Lógica para mostrar cabañas (6 iniciales, luego todas)
  const cabañasParaMostrar = useMemo(() => {
    if (showAllCabins) {
      return cabañasFiltradas;
    }
    return cabañasFiltradas.slice(0, 6);
  }, [cabañasFiltradas, showAllCabins]);

  // Lógica para mostrar servicios (6 iniciales, luego todas)
  const serviciosParaMostrar = useMemo(() => {
    if (showAllServices) {
      return paquetes;
    }
    return paquetes.slice(0, 6);
  }, [paquetes, showAllServices]);

  // Componente de paginación
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: '1rem', 
        marginTop: '2rem',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: currentPage === 1 ? '#e0e0e0' : '#2E5939',
            color: currentPage === 1 ? '#666' : '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontSize: '0.9rem'
          }}
        >
          <FaChevronLeft />
        </button>
        
        <span style={{ 
          color: '#2E5939', 
          fontWeight: 'bold',
          fontSize: '1rem'
        }}>
          Página {currentPage} de {totalPages}
        </span>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: currentPage === totalPages ? '#e0e0e0' : '#2E5939',
            color: currentPage === totalPages ? '#666' : '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontSize: '0.9rem'
          }}
        >
          <FaChevronRight />
        </button>
      </div>
    );
  };

  // Función para abrir enlaces de redes sociales en nueva ventana
  const handleSocialMediaClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Si no hay usuario, redirigir al login
  if (!user) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#f8faf8", 
      margin: 0,
      padding: 0,
      width: "100%",
      overflowX: "hidden"
    }}>
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
        zIndex: 100,
        width: "100%",
        boxSizing: "border-box"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img 
            src="/images/Logo.png" 
            alt="Bosque Sagrado" 
            style={{ width: "45px", height: "45px" }}
            onError={(e) => {
              e.target.src = "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575207/img1_gi8hgx.jpg";
            }}
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

          {/* Botones de acción */}
          <div style={{ display: "flex", gap: "1rem" }}>
            <button 
              onClick={handleNuevaReserva}
              style={{
                backgroundColor: "#E8F5E9",
                color: "#2E5939",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.9rem"
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
                border: "1px solid #E8F5E9",
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.9rem"
              }}
            >
              <FaListAlt />
              Mis Reservas
            </button>
            
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
                gap: "0.5rem",
                fontSize: "0.9rem"
              }}
            >
              <FaSignOutAlt />
              Salir
            </button>
          </div>
        </div>
      </nav>

      {/* Indicador de carga */}
      {loading && (
        <div style={{
          position: "fixed",
          top: "70px",
          left: 0,
          width: "100%",
          backgroundColor: "#2E5939",
          color: "white",
          padding: "10px",
          textAlign: "center",
          zIndex: 999,
          fontSize: "14px",
          fontWeight: "bold",
          boxSizing: "border-box"
        }}>
          📡 Cargando datos desde la API...
        </div>
      )}

      {/* Indicador de error de datos */}
      {dataError && (
        <div style={{
          position: "fixed",
          top: "70px",
          left: 0,
          width: "100%",
          backgroundColor: "#ff9800",
          color: "white",
          padding: "10px",
          textAlign: "center",
          zIndex: 999,
          fontSize: "14px",
          fontWeight: "bold",
          boxSizing: "border-box"
        }}>
          ⚠️ {dataError}
        </div>
      )}

      {/* Hero Section - IGUAL AL LANDING PRINCIPAL */}
      <section
        style={{
          width: "100%",
          height: "70vh",
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
          position: "relative",
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
            onClick={handleNuevaReserva}
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
            onClick={scrollToTop}
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
            Explorar Cabañas
          </button>
        </div>
      </section>

      {/* NUEVA SECCIÓN EXCLUSIVA CON IMAGEN DE FONDO COMPLETA */}
      <section
        style={{
          width: "100%",
          height: "60vh",
          backgroundImage: "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          margin: 0,
          padding: 0,
        }}
      >
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(46, 89, 57, 0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{
            textAlign: "center",
            color: "#fff",
            maxWidth: "800px",
            padding: "2rem",
          }}>
            <h2 style={{
              fontSize: "3.5rem",
              marginBottom: "1.5rem",
              fontFamily: "'Playfair Display', serif",
              fontWeight: "700",
              textShadow: "2px 2px 8px rgba(0,0,0,0.5)"
            }}>
              Vive una Experiencia Única
            </h2>
            <p style={{
              fontSize: "1.5rem",
              marginBottom: "2.5rem",
              lineHeight: "1.6",
              textShadow: "1px 1px 4px rgba(0,0,0,0.5)"
            }}>
              Descubre la magia de conectar con la naturaleza sin sacrificar el confort. 
              Nuestras cabañas premium te ofrecen el equilibrio perfecto entre lujo y aventura.
            </p>
            <button
              onClick={handleNuevaReserva}
              style={{
                backgroundColor: "#E8F5E9",
                color: "#2E5939",
                border: "none",
                padding: "18px 35px",
                borderRadius: "30px",
                fontWeight: "600",
                fontSize: "1.2rem",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
              }}
            >
              Reserva Ahora
            </button>
          </div>
        </div>
      </section>

      {/* SEDES - 3 SEDES POR PÁGINA CON PAGINACIÓN */}
      {sedesParaGaleria.length > 0 && (
        <section style={{ 
          padding: "5rem 2rem", 
          backgroundColor: "#fff", 
          margin: 0,
          width: "100%",
          boxSizing: "border-box"
        }}>
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
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
              justifyContent: "center",
              width: "100%"
            }}>
              {sedesPaginadas.map((sede, index) => (
                <div
                  key={sede.id}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "15px",
                    overflow: "hidden",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                    width: "100%",
                    maxWidth: "350px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    margin: "0 auto",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
                  }}
                >
                  <div style={{
                    backgroundColor: "#2E5939",
                    padding: "2rem 1.5rem",
                    textAlign: "center",
                    color: "#fff"
                  }}>
                    <div style={{
                      width: "60px",
                      height: "60px",
                      backgroundColor: "#E8F5E9",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 1rem",
                      color: "#2E5939",
                      fontSize: "1.5rem",
                      fontWeight: "bold"
                    }}>
                      {sede.name.charAt(0)}
                    </div>
                    <h3 style={{
                      margin: "0",
                      fontSize: "1.5rem",
                      textAlign: "center"
                    }}>
                      {sede.name}
                    </h3>
                  </div>
                  <div style={{ padding: "1.5rem" }}>
                    <p style={{
                      color: "#5D6D63",
                      marginBottom: "1.5rem",
                      lineHeight: "1.5",
                      textAlign: "center",
                      fontSize: "0.95rem"
                    }}>
                      {sede.description}
                    </p>
                    <div style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "1rem",
                      marginBottom: "1.5rem"
                    }}>
                      <span style={{
                        backgroundColor: "#E8F5E9",
                        color: "#2E5939",
                        padding: "0.4rem 0.8rem",
                        borderRadius: "15px",
                        fontWeight: "600",
                        fontSize: "0.85rem"
                      }}>
                        {sede.cabañasCount} cabaña{sede.cabañasCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div style={{
                      display: "flex",
                      justifyContent: "center"
                    }}>
                      <button
                        onClick={() => handleShowSedeGallery(sede)}
                        style={{
                          backgroundColor: "#2E5939",
                          color: "#fff",
                          border: "none",
                          padding: "10px 20px",
                          borderRadius: "20px",
                          fontWeight: "600",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                        }}
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación para sedes - SOLO SI HAY MÁS DE 3 SEDES */}
            {sedesParaGaleria.length > sedesPerPage && (
              <Pagination
                currentPage={currentSedePage}
                totalPages={totalSedePages}
                onPageChange={setCurrentSedePage}
              />
            )}
          </div>
        </section>
      )}

      {/* TODAS NUESTRAS CABAÑAS CON FILTROS - MEJORADO */}
      <section style={{ 
        padding: "3rem 2rem", 
        backgroundColor: "#f8faf8", 
        margin: 0,
        width: "100%",
        boxSizing: "border-box"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
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
            marginBottom: "2rem",
            width: "100%"
          }}>
            <h3 style={{ color: "#2E5939", marginBottom: "1.5rem", textAlign: "center" }}>
              Encuentra tu Cabaña Ideal
            </h3>
           
            {/* Filtros desde la API - CORREGIDOS Y MEJORADOS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "1rem", width: "100%" }}>
              {/* Filtro por sede - USANDO IDs */}
              <div style={{ width: "100%" }}>
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
                    background: "unset",
                    color: "#000",
                    boxSizing: "border-box"
                  }}
                >
                  <option value="">Todas las sedes</option>
                  {sedesUnicas.map((sede, index) => (
                    <option key={sede.id} value={sede.id}>{sede.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Filtro por tipo desde API - USANDO IDs */}
              <div style={{ width: "100%" }}>
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
                    background: "unset",
                    color: "#000",
                    boxSizing: "border-box"
                  }}
                >
                  <option value="">Todos los tipos</option>
                  {tiposUnicos.map((tipo, index) => (
                    <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Filtro por capacidad */}
              <div style={{ width: "100%" }}>
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
                    background: "unset",
                    color: "#000",
                    boxSizing: "border-box"
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

      {/* CABINAS DESTACADAS CON FILTROS APLICADOS Y BOTÓN VER MÁS - MEJORADO */}
      <section style={{ 
        padding: "0 2rem 5rem", 
        backgroundColor: "#f8faf8", 
        margin: 0,
        width: "100%",
        boxSizing: "border-box"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", 
            gap: "2rem",
            width: "100%"
          }}>
            {cabañasParaMostrar.map((cabin, index) => (
              <div
                key={cabin.id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  width: "100%"
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
                  src={cabin.imagenes && cabin.imagenes.length > 0 ? cabin.imagenes[0] : cabin.img}
                  alt={cabin.name}
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover"
                  }}
                  onError={(e) => {
                    e.target.src = "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575207/img1_gi8hgx.jpg";
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
                  
                  {/* Comodidades en la tarjeta */}
                  {cabin.comodidades && cabin.comodidades.length > 0 && (
                    <div style={{ marginBottom: "1rem" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                        {cabin.comodidades.slice(0, 3).map((comodidad, index) => (
                          <span
                            key={index}
                            style={comodidadTagStyle}
                          >
                            <FaChair size={8} /> {comodidad}
                          </span>
                        ))}
                        {cabin.comodidades.length > 3 && (
                          <span style={{
                            ...comodidadTagStyle,
                            backgroundColor: '#F7F4EA'
                          }}>
                            +{cabin.comodidades.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <p style={{ color: "#5D6D63", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
                    {cabin.description.length > 120 
                      ? `${cabin.description.substring(0, 120)}...` 
                      : cabin.description}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#3E7E5C", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <FaDollarSign size={14} /> {cabin.price}
                    </span>
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

          {/* Botón Ver Más Cabañas - SOLO SI HAY MÁS DE 6 CABAÑAS */}
          {cabañasFiltradas.length > 6 && !showAllCabins && (
            <div style={{ textAlign: "center", marginTop: "3rem" }}>
              <button
                onClick={() => setShowAllCabins(true)}
                style={{
                  backgroundColor: "#2E5939",
                  color: "#fff",
                  border: "none",
                  padding: "15px 30px",
                  borderRadius: "25px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  margin: "0 auto"
                }}
              >
                Ver Más Cabañas <FaChevronDown />
              </button>
            </div>
          )}

          {/* Botón Ver Menos Cabañas - CUANDO SE MUESTRAN TODAS */}
          {showAllCabins && (
            <div style={{ textAlign: "center", marginTop: "3rem" }}>
              <button
                onClick={() => setShowAllCabins(false)}
                style={{
                  backgroundColor: "#e0e0e0",
                  color: "#333",
                  border: "none",
                  padding: "15px 30px",
                  borderRadius: "25px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  margin: "0 auto"
                }}
              >
                Ver Menos Cabañas <FaChevronUp />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SERVICIOS CON BOTÓN VER MÁS */}
      <section style={{ 
        padding: "5rem 2rem", 
        backgroundColor: "#fff", 
        margin: 0,
        width: "100%",
        boxSizing: "border-box"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
          <h2 style={{
            fontSize: "3rem",
            color: "#2E5939",
            textAlign: "center",
            marginBottom: "3rem",
            fontFamily: "'Playfair Display', serif"
          }}>
            Servicios Exclusivos
          </h2>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "2rem",
            width: "100%"
          }}>
            {serviciosParaMostrar.map((paquete, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#f8faf8",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                  width: "100%"
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
                  onError={(e) => {
                    e.target.src = "https://res.cloudinary.com/dou17w0m0/image/upload/v1763576016/asados_nfmvlb.jpg";
                  }}
                />
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <h3 style={{ color: "#2E5939", marginBottom: "1rem", fontSize: "1.5rem" }}>{paquete.name}</h3>
                  <p style={{ color: "#5D6D63", marginBottom: "1.5rem" }}>{paquete.description}</p>
                  <div style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#3E7E5C", marginBottom: "1.5rem" }}>
                    {paquete.price}
                  </div>
                  <button
                    onClick={() => handleShowPackageDetails(paquete)}
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

          {/* Botón Ver Más Servicios - SOLO SI HAY MÁS DE 6 SERVICIOS */}
          {paquetes.length > 6 && !showAllServices && (
            <div style={{ textAlign: "center", marginTop: "3rem" }}>
              <button
                onClick={() => setShowAllServices(true)}
                style={{
                  backgroundColor: "#2E5939",
                  color: "#fff",
                  border: "none",
                  padding: "15px 30px",
                  borderRadius: "25px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  margin: "0 auto"
                }}
              >
                Ver Más Servicios <FaChevronDown />
              </button>
            </div>
          )}

          {/* Botón Ver Menos Servicios - CUANDO SE MUESTRAN TODOS */}
          {showAllServices && (
            <div style={{ textAlign: "center", marginTop: "3rem" }}>
              <button
                onClick={() => setShowAllServices(false)}
                style={{
                  backgroundColor: "#e0e0e0",
                  color: "#333",
                  border: "none",
                  padding: "15px 30px",
                  borderRadius: "25px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  margin: "0 auto"
                }}
              >
                Ver Menos Servicios <FaChevronUp />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* QUIENES SOMOS - MODIFICADO PARA MOSTRAR LOGO EN VEZ DE IMAGEN */}
      <section style={{ 
        padding: "4rem 2rem", 
        backgroundColor: "#f8faf8", 
        margin: 0,
        width: "100%",
        boxSizing: "border-box"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
          <div style={{
            backgroundColor: "#fff",
            padding: "3rem",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            marginBottom: "3rem",
            width: "100%"
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
            <div style={{ display: "flex", gap: "3rem", alignItems: "center", flexWrap: "wrap", width: "100%" }}>
              <div style={{ flex: 1, minWidth: "300px" }}>
                <p style={{ fontSize: "1.2rem", lineHeight: "1.8", marginBottom: "1.5rem",color: "black" }}>
                  En <strong>Bosque Sagrado</strong>, creemos que la conexión con la naturaleza no debe estar reñida con el lujo y la comodidad. Somos un santuario de glamping ubicado en Antioquia, Colombia, dedicados a ofrecerte una escapada mágica.
                </p>
                <p style={{ fontSize: "1.2rem", lineHeight: "1.8", color:"black" }}>
                  Nuestro objetivo es brindarte un refugio lejos del bullicio de la ciudad, un lugar para reconectar contigo mismo, con tu pareja o con tus seres queridos, rodeado de la belleza y la tranquilidad del entorno natural.
                </p>
              </div>
              <div style={{ flex: 1, minWidth: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img
                  src="/images/Logo.png"
                  alt="Bosque Sagrado Logo"
                  style={{
                    width: "250px",
                    height: "250px",
                    borderRadius: "15px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
            <div style={{
              flex: 1,
              minWidth: "280px",
              backgroundColor: "#fff",
              padding: "2.5rem",
              borderRadius: "15px",
              textAlign: "center",
              boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
              width: "100%"
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
              boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
              width: "100%"
            }}>
              <FaEye size={60} color="#3E7E5C" style={{ marginBottom: "1.5rem" }} />
              <h3 style={{ fontSize: "1.8rem", color: "#2E5939", marginBottom: "1rem" }}>Nuestra Visión</h3>
              <p style={{ color: "#000000ff", fontSize: "1.2rem" }}>Convertirnos en el destino de glamping líder en Colombia, reconocidos por nuestra excelencia en el servicio y la sostenibilidad.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section style={{ 
        padding: "5rem 2rem", 
        background: "linear-gradient(135deg, #2E5939 0%, #3E7E5C 100%)", 
        color: "#fff", 
        textAlign: "center", 
        margin: 0,
        width: "100%",
        boxSizing: "border-box"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>¿Listo para tu Aventura?</h2>
          <p style={{ fontSize: "1.3rem", marginBottom: "2.5rem" }}>
            Únete a la familia Bosque Sagrado y descubre la magia de conectar con la naturaleza sin sacrificar el confort.
          </p>
          <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={handleNuevaReserva}
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
              Hacer Reserva
            </button>
            <button
              onClick={handleMisReservas}
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
              Ver Mis Reservas
            </button>
          </div>
        </div>
      </section>

      {/* POPUPS */}
      {showPopup && selectedPackage && (
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
                onError={(e) => {
                  e.target.src = "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575207/img1_gi8hgx.jpg";
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

            {/* Información detallada - MEJORADA */}
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
                {selectedCabin.descripcionCompleta || selectedCabin.description}
              </p>

              {/* Comodidades desde la API - MEJORADO */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ color: "#2E5939", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FaChair /> Comodidades:
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {selectedCabin.comodidades && selectedCabin.comodidades.map((comodidad, index) => (
                    <span
                      key={index}
                      style={comodidadTagStyle}
                    >
                      <FaChair size={10} /> {comodidad}
                    </span>
                  ))}
                </div>
              </div>

              {/* Información de imágenes */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ color: "#2E5939", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FaImage /> Galería de Imágenes:
                </h4>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", 
                  gap: "0.5rem",
                  marginTop: "0.5rem"
                }}>
                  {selectedCabin.imagenes.slice(0, 6).map((imagen, index) => (
                    <img
                      key={index}
                      src={imagen}
                      alt={`${selectedCabin.name} ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() => setCabinImageIndex(index)}
                      onError={(e) => {
                        e.target.src = "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575207/img1_gi8hgx.jpg";
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <h4 style={{ 
              color: "#3E7E5C", 
              textAlign: "center", 
              fontSize: "1.8rem", 
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem"
            }}>
              <FaDollarSign /> Precio: {selectedCabin.price}
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

      {/* POPUP PARA GALERÍA DE SEDES - MODIFICADO PARA MOSTRAR CABAÑAS */}
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
              maxWidth: "900px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 5px 25px rgba(0,0,0,0.2)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ color: "#2E5939", textAlign: "center", marginBottom: "1.5rem" }}>{selectedSede.name}</h2>
           
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div style={{
                width: "100px",
                height: "100px",
                backgroundColor: "#2E5939",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
                color: "#fff",
                fontSize: "2rem",
                fontWeight: "bold"
              }}>
                {selectedSede.name.charAt(0)}
              </div>
              <h3 style={{ color: "#2E5939", marginBottom: "1rem" }}>{selectedSede.name}</h3>
              <p style={{ lineHeight: "1.6", color: "#2E3A30", marginBottom: "1rem" }}>
                {selectedSede.description}
              </p>
            </div>

            <p style={{ lineHeight: "1.6", color: "#2E3A30", marginBottom: "1.5rem", textAlign: "center" }}>
              {selectedSede.cabañasCount} cabaña{selectedSede.cabañasCount !== 1 ? 's' : ''} disponible{selectedSede.cabañasCount !== 1 ? 's' : ''}
            </p>

            {/* Mostrar cabañas de esta sede */}
            {selectedSede.cabañas && selectedSede.cabañas.length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h4 style={{ 
                  color: "#2E5939", 
                  marginBottom: "1rem", 
                  textAlign: "center",
                  borderBottom: "2px solid #2E5939",
                  paddingBottom: "0.5rem"
                }}>
                  Cabañas en {selectedSede.name}
                </h4>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
                  gap: "1rem",
                  maxHeight: "300px",
                  overflowY: "auto",
                  padding: "1rem",
                  backgroundColor: "#f8faf8",
                  borderRadius: "10px"
                }}>
                  {selectedSede.cabañas.map((cabin, index) => (
                    <div
                      key={cabin.id}
                      style={{
                        backgroundColor: "#fff",
                        padding: "1rem",
                        borderRadius: "10px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        cursor: "pointer",
                        transition: "transform 0.2s ease"
                      }}
                      onClick={() => {
                        setSelectedCabin(cabin);
                        setSelectedSede(null);
                        setCabinImageIndex(0);
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <img
                          src={cabin.imagenes && cabin.imagenes.length > 0 ? cabin.imagenes[0] : cabin.img}
                          alt={cabin.name}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "8px"
                          }}
                          onError={(e) => {
                            e.target.src = "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575207/img1_gi8hgx.jpg";
                          }}
                        />
                        <div>
                          <h5 style={{ margin: "0 0 0.3rem 0", color: "#2E5939" }}>{cabin.name}</h5>
                          <p style={{ margin: "0", fontSize: "0.9rem", color: "#5D6D63" }}>
                            {cabin.capacidad} personas • {cabin.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedSede.cabañasCount === 0 && (
              <div style={{ 
                textAlign: "center", 
                padding: "2rem", 
                backgroundColor: "#f8faf8", 
                borderRadius: "10px",
                marginBottom: "1.5rem"
              }}>
                <p style={{ color: "#5D6D63", margin: 0 }}>
                  Actualmente no hay cabañas disponibles en esta sede.
                </p>
              </div>
            )}

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

      {/* Footer */}
      <footer style={{
        backgroundColor: "#2E5939",
        color: "#fff",
        padding: "4rem 0 2rem",
        margin: 0,
        width: "100%",
        boxSizing: "border-box"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "3rem",
          marginBottom: "3rem",
          padding: "0 2rem",
          width: "100%"
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
                onError={(e) => {
                  e.target.src = "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575207/img1_gi8hgx.jpg";
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
                  onClick={scrollToTop}
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
                  onClick={handleNuevaReserva}
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    textDecoration: "none",
                    cursor: "pointer",
                    transition: "color 0.3s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
                >
                  Nueva Reserva
                </a>
              </li>
              <li style={{ marginBottom: "0.8rem" }}>
                <a
                  onClick={handleMisReservas}
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
          color: "rgba(255,255,255,0.6)",
          width: "100%",
          padding: "2rem 2rem 0",
          boxSizing: "border-box"
        }}>
          <p style={{ margin: 0 }}>
            © 2024 Bosque Sagrado. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Estilos CSS para fuentes */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          html, body {
            width: 100%;
            overflow-x: hidden;
          }
          
          /* Estilos para deshabilitar scroll cuando hay popup */
          body.no-scroll {
            overflow: hidden;
            position: fixed;
            width: 100%;
            height: 100%;
          }
        `}
      </style>
    </div>
  );
};

export default HomeCliente;