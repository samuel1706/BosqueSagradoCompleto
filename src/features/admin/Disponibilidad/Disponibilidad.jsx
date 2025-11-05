import React, { useState, useMemo, useEffect } from "react";
import { 
  FaEye, FaEdit, FaTrash, FaTimes, FaSearch, FaPlus, 
  FaExclamationTriangle, FaCheck, FaInfoCircle, FaCalendarAlt,
  FaBed, FaCalendarCheck, FaCalendarTimes, FaFilter,
  FaHome, FaCouch, FaMountain
} from "react-icons/fa";
import axios from "axios";

// ===============================================
// ESTILOS MEJORADOS Y RESPONSIVOS
// ===============================================
const btnAccion = (bg, borderColor) => ({
  marginRight: 6,
  cursor: "pointer",
  padding: "8px 12px",
  borderRadius: 8,
  border: `1px solid ${borderColor}`,
  backgroundColor: bg,
  color: borderColor,
  fontWeight: "600",
  fontSize: "16px",
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '5px',
  transition: "all 0.3s ease",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
});

const labelStyle = {
  display: "block",
  fontWeight: "600",
  marginBottom: 4,
  color: "#2E5939",
  fontSize: "14px",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #ccc",
  borderRadius: 8,
  backgroundColor: "#F7F4EA",
  color: "#2E5939",
  boxSizing: 'border-box',
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  transition: "all 0.3s ease",
  fontSize: "14px",
};

const navBtnStyle = (disabled) => ({
  cursor: disabled ? "not-allowed" : "pointer",
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #ccc",
  backgroundColor: disabled ? "#e0e0e0" : "#F7F4EA",
  color: "#2E5939",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  fontSize: "14px",
});

const pageBtnStyle = (active) => ({
  cursor: "pointer",
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #2E5939",
  backgroundColor: active ? "#2E5939" : "#F7F4EA",
  color: active ? "white" : "#2E5939",
  fontWeight: "600",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  fontSize: "14px",
});

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
  padding: "20px",
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: 12,
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  width: "90%",
  maxWidth: "600px",
  color: "#2E5939",
  boxSizing: 'border-box',
  maxHeight: '90vh',
  overflowY: 'auto',
  position: 'relative',
  border: "2px solid #679750",
};

// Estilos para alertas
const alertStyle = {
  position: 'fixed',
  top: 20,
  right: 20,
  padding: '15px 20px',
  borderRadius: '10px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  zIndex: 10000,
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontWeight: '600',
  fontSize: '16px',
  minWidth: '300px',
  maxWidth: '500px',
  borderLeft: '5px solid',
  backdropFilter: 'blur(10px)',
};

const alertIconStyle = {
  fontSize: '20px',
  flexShrink: 0,
};

const alertSuccessStyle = {
  ...alertStyle,
  backgroundColor: '#d4edda',
  color: '#155724',
  borderLeftColor: '#28a745',
};

const alertErrorStyle = {
  ...alertStyle,
  backgroundColor: '#f8d7da',
  color: '#721c24',
  borderLeftColor: '#dc3545',
};

const alertWarningStyle = {
  ...alertStyle,
  backgroundColor: '#fff3cd',
  color: '#856404',
  borderLeftColor: '#ffc107',
};

const alertInfoStyle = {
  ...alertStyle,
  backgroundColor: '#d1ecf1',
  color: '#0c5460',
  borderLeftColor: '#17a2b8',
};

const detailsModalStyle = {
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: 12,
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  width: "90%",
  maxWidth: "600px",
  color: "#2E5939",
  boxSizing: 'border-box',
  maxHeight: '80vh',
  overflowY: 'auto',
  border: "2px solid #679750",
};

const detailItemStyle = {
  marginBottom: 15,
  paddingBottom: 15,
  borderBottom: "1px solid rgba(46, 89, 57, 0.1)"
};

const detailLabelStyle = {
  fontWeight: "bold",
  color: "#2E5939",
  marginBottom: 5,
  fontSize: "14px"
};

const detailValueStyle = {
  fontSize: 16,
  color: "#2E5939",
  fontWeight: "500",
};

const validationMessageStyle = {
  fontSize: "0.8rem",
  marginTop: "4px",
  display: "flex",
  alignItems: "center",
  gap: "5px"
};

const successValidationStyle = {
  ...validationMessageStyle,
  color: "#4caf50"
};

const errorValidationStyle = {
  ...validationMessageStyle,
  color: "#e57373"
};

const warningValidationStyle = {
  ...validationMessageStyle,
  color: "#ff9800"
};

// ===============================================
// VALIDACIONES Y PATRONES
// ===============================================
const VALIDATION_RULES = {
  idCabana: {
    required: true,
    errorMessages: {
      required: "Debe seleccionar una cabaña."
    }
  },
  dia: {
    required: true,
    errorMessages: {
      required: "La fecha es obligatoria.",
      invalid: "La fecha debe ser válida y no puede ser anterior al día actual."
    }
  },
  estado: {
    required: true,
    errorMessages: {
      required: "El estado es obligatorio."
    }
  }
};

// ===============================================
// DATOS DE CONFIGURACIÓN
// ===============================================
const API_DISPONIBILIDAD = "http://localhost:5272/api/Disponibilidad";
const API_CABANAS = "http://localhost:5272/api/Cabanas";
const ITEMS_PER_PAGE = 10;

// ===============================================
// COMPONENTE FormField PARA DISPONIBILIDAD
// ===============================================
const FormField = ({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  error, 
  success,
  warning,
  options = [],
  style = {}, 
  required = true, 
  disabled = false,
  placeholder,
  min,
  max
}) => {
  const finalOptions = useMemo(() => {
    if (type === "select") {
      const placeholderOption = { value: "", label: "Seleccionar", disabled: required };
      return [placeholderOption, ...options];
    }
    return options;
  }, [options, type, required]);

  const getInputStyle = () => {
    let borderColor = "#ccc";
    if (error) borderColor = "#e57373";
    else if (success) borderColor = "#4caf50";
    else if (warning) borderColor = "#ff9800";

    return {
      ...inputStyle,
      border: `1px solid ${borderColor}`,
      borderLeft: `4px solid ${borderColor}`,
    };
  };

  const getValidationMessage = () => {
    if (error) {
      return (
        <div style={errorValidationStyle}>
          <FaExclamationTriangle size={12} />
          {error}
        </div>
      );
    }
    if (success) {
      return (
        <div style={successValidationStyle}>
          <FaCheck size={12} />
          {success}
        </div>
      );
    }
    if (warning) {
      return (
        <div style={warningValidationStyle}>
          <FaInfoCircle size={12} />
          {warning}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ marginBottom: '15px', ...style }}>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: "red" }}>*</span>}
      </label>
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          style={getInputStyle()}
          required={required}
          disabled={disabled}
        >
          {finalOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <div>
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            style={getInputStyle()}
            required={required}
            disabled={disabled}
            placeholder={placeholder}
            min={min}
            max={max}
          />
        </div>
      )}
      {getValidationMessage()}
    </div>
  );
};

// ===============================================
// COMPONENTE PRINCIPAL Disponibilidad
// ===============================================
const Disponibilidad = () => {
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [cabanas, setCabanas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [filterCabana, setFilterCabana] = useState("todos");
  const [filterFecha, setFilterFecha] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedDisponibilidad, setSelectedDisponibilidad] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [disponibilidadToDelete, setDisponibilidadToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [loading, setLoading] = useState(false);
  const [loadingCabanas, setLoadingCabanas] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState({});
  const [formWarnings, setFormWarnings] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newDisponibilidad, setNewDisponibilidad] = useState({
    dia: "",
    estado: true,
    idCabana: ""
  });

  // Responsive helpers: evita que un margin fijo o minWidth rompa el layout en pantallas pequeñas
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const showSidebarOffset = windowWidth >= 992;
  const containerStyle = {
    position: "relative",
    padding: windowWidth < 600 ? "12px" : "20px",
    backgroundColor: "#f5f8f2",
    minHeight: "100vh",
    marginLeft: showSidebarOffset ? "260px" : 0,
    boxSizing: "border-box"
  };
  
  // ===============================================
  // FUNCIONES PARA OBTENER NOMBRES
  // ===============================================
  const getCabanaNombre = (idCabana) => {
    const cabana = cabanas.find(c => c.idCabana === idCabana);
    return cabana ? cabana.nombre : `Cabaña ${idCabana}`;
  };

  const getCabanaIcon = (cabanaNombre) => {
    if (!cabanaNombre) return <FaBed color="#679750" />;
    
    const nombre = cabanaNombre.toLowerCase();
    if (nombre.includes('lujo') || nombre.includes('premium')) return <FaCouch color="#FFD700" />;
    if (nombre.includes('familiar')) return <FaHome color="#4CAF50" />;
    if (nombre.includes('montaña') || nombre.includes('montana')) return <FaMountain color="#795548" />;
    return <FaBed color="#679750" />;
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "No especificada";
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return fecha;
    }
  };

  const formatFechaCorta = (fecha) => {
    if (!fecha) return "N/A";
    try {
      return new Date(fecha).toLocaleDateString('es-ES');
    } catch {
      return fecha;
    }
  };

  const getMesFromFecha = (fecha) => {
    if (!fecha) return "N/A";
    try {
      return new Date(fecha).toLocaleDateString('es-ES', { month: 'long' });
    } catch {
      return fecha.substring(5, 7) || "N/A";
    }
  };

  // ===============================================
  // EFECTOS
  // ===============================================
  useEffect(() => {
    console.log("🔍 Componente Disponibilidad montado, cargando datos...");
    fetchDisponibilidades();
    fetchCabanas();
  }, []);

  // Efecto para agregar estilos de animación
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @media (max-width: 768px) {
        .table-container {
          overflow-x: auto;
        }
        
        .mobile-hidden {
          display: none;
        }
        
        .mobile-stack {
          flex-direction: column;
        }
        
        .mobile-full {
          width: 100%;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // ===============================================
  // FUNCIONES DE LA API
  // ===============================================
  const fetchDisponibilidades = async () => {
    console.log("🔄 Iniciando carga de disponibilidades...");
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_DISPONIBILIDAD, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log("✅ Datos de disponibilidad recibidos:", res.data);
      
      if (Array.isArray(res.data)) {
        setDisponibilidades(res.data);
      } else {
        console.error("❌ Formato de datos inválido:", res.data);
        throw new Error("Formato de datos inválido del servidor");
      }
    } catch (error) {
      console.error("❌ Error al obtener disponibilidades:", error);
      handleApiError(error, "cargar las disponibilidades");
    } finally {
      setLoading(false);
    }
  };

  const fetchCabanas = async () => {
    console.log("🔄 Cargando cabañas...");
    setLoadingCabanas(true);
    try {
      const res = await axios.get(API_CABANAS, {
        timeout: 10000
      });
      
      if (Array.isArray(res.data)) {
        setCabanas(res.data);
        console.log(`✅ ${res.data.length} cabañas cargadas`);
      }
    } catch (error) {
      console.error("❌ Error al obtener cabañas:", error);
      displayAlert("Error al cargar las cabañas", "warning");
    } finally {
      setLoadingCabanas(false);
    }
  };

  const handleAddDisponibilidad = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) {
      displayAlert("Ya se está procesando una solicitud. Por favor espere.", "warning");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setLoading(true);
    
    try {
      // Formatear la fecha correctamente para la API
      const fecha = new Date(newDisponibilidad.dia);
      const dia = fecha.toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Extraer mes y año de la fecha
      const mes = fecha.toISOString().substring(0, 7); // YYYY-MM
      const anio = fecha.getFullYear().toString();

      const disponibilidadData = {
        ...newDisponibilidad,
        dia: dia,
        mes: mes,
        anio: anio,
        estado: newDisponibilidad.estado === "true" || newDisponibilidad.estado === true,
        idCabana: parseInt(newDisponibilidad.idCabana)
      };

      // Si estamos editando, agregar el ID
      if (isEditing) {
        disponibilidadData.idDisponibilidad = newDisponibilidad.idDisponibilidad;
      }

      console.log("📤 Enviando datos de disponibilidad:", disponibilidadData);

      let response;
      if (isEditing) {
        response = await axios.put(`${API_DISPONIBILIDAD}/${newDisponibilidad.idDisponibilidad}`, disponibilidadData, {
          headers: { 'Content-Type': 'application/json' }
        });
        displayAlert("Disponibilidad actualizada exitosamente.", "success");
      } else {
        response = await axios.post(API_DISPONIBILIDAD, disponibilidadData, {
          headers: { 'Content-Type': 'application/json' }
        });
        displayAlert("Disponibilidad agregada exitosamente.", "success");
      }
      
      console.log("✅ Respuesta del servidor:", response.data);
      await fetchDisponibilidades();
      closeForm();
    } catch (error) {
      console.error("❌ Error al guardar disponibilidad:", error);
      handleApiError(error, isEditing ? "actualizar la disponibilidad" : "agregar la disponibilidad");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  // ===============================================
  // FUNCIONES DE VALIDACIÓN
  // ===============================================
  const validateField = (fieldName, value) => {
    const rules = VALIDATION_RULES[fieldName];
    if (!rules) return true;

    let error = "";
    let success = "";
    let warning = "";

    const trimmedValue = value ? value.toString().trim() : "";

    if (rules.required && !trimmedValue) {
      error = rules.errorMessages.required;
    }
    // Validación especial para fecha
    else if (fieldName === 'dia' && trimmedValue) {
      const selectedDate = new Date(trimmedValue);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (isNaN(selectedDate.getTime())) {
        error = rules.errorMessages.invalid;
      } else if (selectedDate < today) {
        error = "No se puede asignar disponibilidad para fechas pasadas";
      } else {
        success = "Fecha válida";
        
        // Advertencia para fechas muy lejanas
        const diffTime = Math.abs(selectedDate - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 365) {
          warning = "La fecha está a más de un año. Verifique que sea correcta.";
        }
      }
    }
    else if (trimmedValue) {
      success = "Campo válido";
    }

    setFormErrors(prev => ({ ...prev, [fieldName]: error }));
    setFormSuccess(prev => ({ ...prev, [fieldName]: success }));
    setFormWarnings(prev => ({ ...prev, [fieldName]: warning }));

    return !error;
  };

  const validateForm = () => {
    const cabanaValid = validateField('idCabana', newDisponibilidad.idCabana);
    const fechaValid = validateField('dia', newDisponibilidad.dia);
    const estadoValid = validateField('estado', newDisponibilidad.estado);

    const isValid = cabanaValid && fechaValid && estadoValid;
    
    if (!isValid) {
      displayAlert("Por favor, corrige los errores en el formulario antes de guardar.", "error");
    }

    return isValid;
  };

  // ===============================================
  // FUNCIONES AUXILIARES
  // ===============================================
  const handleApiError = (error, operation) => {
    let errorMessage = `Error al ${operation}`;
    let alertType = "error";
    
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      errorMessage = "Error de conexión. Verifica que el servidor esté ejecutándose en http://localhost:5272";
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = "No se puede conectar al servidor. Asegúrate de que la API esté corriendo en http://localhost:5272";
    } else if (error.response) {
      if (error.response.status === 400) {
        errorMessage = "Error de validación: Verifica los datos ingresados";
      } else if (error.response.status === 409) {
        errorMessage = "Ya existe una disponibilidad para esta cabaña en esta fecha";
        alertType = "warning";
      } else if (error.response.status === 404) {
        errorMessage = "Recurso no encontrado.";
      } else if (error.response.status === 500) {
        errorMessage = "Error interno del servidor.";
      } else {
        errorMessage = `Error ${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
      }
    } else if (error.request) {
      errorMessage = "No hay respuesta del servidor.";
    } else {
      errorMessage = `Error inesperado: ${error.message}`;
    }
    
    setError(errorMessage);
    displayAlert(errorMessage, alertType);
  };

  const displayAlert = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage("");
    }, 5000);
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case "success":
        return <FaCheck style={alertIconStyle} />;
      case "error":
        return <FaExclamationTriangle style={alertIconStyle} />;
      case "warning":
        return <FaExclamationTriangle style={alertIconStyle} />;
      case "info":
        return <FaInfoCircle style={alertIconStyle} />;
      default:
        return <FaInfoCircle style={alertIconStyle} />;
    }
  };

  const getAlertStyle = (type) => {
    switch (type) {
      case "success":
        return alertSuccessStyle;
      case "error":
        return alertErrorStyle;
      case "warning":
        return alertWarningStyle;
      case "info":
        return alertInfoStyle;
      default:
        return alertSuccessStyle;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDisponibilidad((prev) => ({
      ...prev,
      [name]: value
    }));

    // Validar en tiempo real
    if (showForm) {
      validateField(name, value);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
    setNewDisponibilidad({
      dia: "",
      estado: true,
      idCabana: ""
    });
  };

  const handleEdit = (disponibilidad) => {
    console.log("✏️ Editando disponibilidad:", disponibilidad);
    
    // Formatear la fecha para el input date (YYYY-MM-DD)
    const fecha = disponibilidad.dia ? disponibilidad.dia.split('T')[0] : "";
    
    setNewDisponibilidad({
      ...disponibilidad,
      dia: fecha,
      estado: disponibilidad.estado ? "true" : "false",
      idCabana: disponibilidad.idCabana ? disponibilidad.idCabana.toString() : ""
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteClick = (disponibilidad) => {
    console.log("🗑️ Solicitando eliminar:", disponibilidad);
    setDisponibilidadToDelete(disponibilidad);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (disponibilidadToDelete) {
      setLoading(true);
      try {
        await axios.delete(`${API_DISPONIBILIDAD}/${disponibilidadToDelete.idDisponibilidad}`);
        displayAlert("Disponibilidad eliminada exitosamente.", "success");
        await fetchDisponibilidades();
        
        // Ajustar página si es necesario
        if (paginatedDisponibilidades.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("❌ Error al eliminar:", error);
        handleApiError(error, "eliminar la disponibilidad");
      } finally {
        setLoading(false);
        setDisponibilidadToDelete(null);
        setShowDeleteConfirm(false);
      }
    }
  };

  const cancelDelete = () => {
    setDisponibilidadToDelete(null);
    setShowDeleteConfirm(false);
  };

  const toggleEstado = async (disponibilidad) => {
    setLoading(true);
    try {
      const updatedDisponibilidad = { 
        ...disponibilidad, 
        estado: !disponibilidad.estado 
      };
      await axios.put(`${API_DISPONIBILIDAD}/${disponibilidad.idDisponibilidad}`, updatedDisponibilidad, {
        headers: { 'Content-Type': 'application/json' }
      });
      displayAlert(`Disponibilidad ${updatedDisponibilidad.estado ? 'activada' : 'desactivada'} exitosamente.`, "success");
      await fetchDisponibilidades();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      displayAlert("Error al cambiar el estado de la disponibilidad.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (disponibilidad) => {
    setSelectedDisponibilidad(disponibilidad);
    setShowDetails(true);
  };

  const closeDetailsModal = () => {
    setShowDetails(false);
    setSelectedDisponibilidad(null);
  };

  // ===============================================
  // FUNCIONES DE FILTRADO Y PAGINACIÓN
  // ===============================================
  const filteredDisponibilidades = useMemo(() => {
    return disponibilidades.filter(disp => {
      const matchesSearch = 
        getCabanaNombre(disp.idCabana)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disp.dia?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesEstado = filterEstado === "todos" || 
        (filterEstado === "activo" && disp.estado) || 
        (filterEstado === "inactivo" && !disp.estado);
      
      const matchesCabana = filterCabana === "todos" || 
        disp.idCabana?.toString() === filterCabana;
      
      const matchesFecha = !filterFecha || 
        disp.dia?.includes(filterFecha);

      return matchesSearch && matchesEstado && matchesCabana && matchesFecha;
    });
  }, [disponibilidades, searchTerm, filterEstado, filterCabana, filterFecha, cabanas]);

  const totalPages = Math.ceil(filteredDisponibilidades.length / ITEMS_PER_PAGE);

  const paginatedDisponibilidades = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDisponibilidades.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDisponibilidades, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ===============================================
  // RENDERIZADO PRINCIPAL
  // ===============================================
  console.log("🎨 Renderizando componente Disponibilidad...");

  return (
    <div style={containerStyle}>

      {/* Alerta */}
      {showAlert && (
        <div style={getAlertStyle(alertType)}>
          {getAlertIcon(alertType)}
          <span style={{ flex: 1 }}>{alertMessage}</span>
          <button 
            onClick={() => setShowAlert(false)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'inherit', 
              cursor: 'pointer',
              fontSize: '16px',
              padding: 0,
            }}
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: 20,
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div style={{ minWidth: '250px' }}>
          <h1 style={{ margin: 0, color: "#2E5939", fontSize: "28px" }}>
            Gestión de Disponibilidad
          </h1>
          <p style={{ margin: "5px 0 0 0", color: "#679750", fontSize: "14px" }}>
            {disponibilidades.length} registros • {cabanas.length} cabañas
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setIsEditing(false);
            setNewDisponibilidad({
              dia: "",
              estado: true,
              idCabana: cabanas.length > 0 ? cabanas[0].idCabana.toString() : ""
            });
          }}
          style={{
            backgroundColor: "#2E5939",
            color: "white",
            padding: "12px 20px",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: "600",
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: "14px",
            whiteSpace: 'nowrap',
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "linear-gradient(90deg, #67d630, #95d34e)";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "#2E5939";
            e.target.style.transform = "translateY(0)";
          }}
        >
          <FaPlus /> Nueva Disponibilidad
        </button>
      </div>

      {/* Filtros */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px', 
        marginBottom: '20px',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <div>
          <label style={{...labelStyle, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px'}}>
            <FaSearch />
            Buscar
          </label>
          <input
            type="text"
            placeholder="Buscar por cabaña o fecha..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{...labelStyle, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px'}}>
            <FaFilter />
            Estado
          </label>
          <select
            value={filterEstado}
            onChange={(e) => {
              setFilterEstado(e.target.value);
              setCurrentPage(1);
            }}
            style={inputStyle}
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        <div>
          <label style={{...labelStyle, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px'}}>
            <FaBed />
            Cabaña
          </label>
          <select
            value={filterCabana}
            onChange={(e) => {
              setFilterCabana(e.target.value);
              setCurrentPage(1);
            }}
            style={inputStyle}
          >
            <option value="todos">Todas las cabañas</option>
            {cabanas.map(cabana => (
              <option key={cabana.idCabana} value={cabana.idCabana.toString()}>
                {cabana.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{...labelStyle, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px'}}>
            <FaCalendarAlt />
            Fecha
          </label>
          <input
            type="date"
            value={filterFecha}
            onChange={(e) => {
              setFilterFecha(e.target.value);
              setCurrentPage(1);
            }}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Estadísticas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px',
        marginBottom: '20px',
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '15px',
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #679750'
        }}>
          <div style={{ fontSize: '12px', color: '#679750', fontWeight: '600' }}>TOTAL</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2E5939' }}>
            {disponibilidades.length}
          </div>
        </div>
        <div style={{
          backgroundColor: '#fff',
          padding: '15px',
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #4caf50'
        }}>
          <div style={{ fontSize: '12px', color: '#4caf50', fontWeight: '600' }}>DISPONIBLES</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2E5939' }}>
            {disponibilidades.filter(d => d.estado).length}
          </div>
        </div>
        <div style={{
          backgroundColor: '#fff',
          padding: '15px',
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #e57373'
        }}>
          <div style={{ fontSize: '12px', color: '#e57373', fontWeight: '600' }}>NO DISPONIBLES</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2E5939' }}>
            {disponibilidades.filter(d => !d.estado).length}
          </div>
        </div>
        <div style={{
          backgroundColor: '#fff',
          padding: '15px',
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #2196F3'
        }}>
          <div style={{ fontSize: '12px', color: '#2196F3', fontWeight: '600' }}>CABAÑAS</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2E5939' }}>
            {cabanas.length}
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ 
          textAlign: "center", 
          padding: "40px", 
          color: "#2E5939",
          backgroundColor: '#fff',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>
            🔄 Cargando disponibilidades...
          </div>
          <div style={{ fontSize: '14px', color: '#679750' }}>
            Obteniendo información actualizada del servidor
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '20px',
          color: '#856404'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <FaExclamationTriangle />
            <strong style={{ fontSize: '16px' }}>Error de Conexión</strong>
          </div>
          <p style={{ margin: '10px 0', fontSize: '14px' }}>{error}</p>
          <button
            onClick={fetchDisponibilidades}
            style={{
              backgroundColor: '#2E5939',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = "linear-gradient(90deg, #67d630, #95d34e)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "#2E5939";
            }}
          >
            Reintentar Conexión
          </button>
        </div>
      )}

      {/* Tabla */}
      {!loading && !error && (
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {/* contenedor con scroll horizontal en pantallas pequeñas */}
          <div className="table-container" style={{ overflowX: 'auto', padding: windowWidth < 480 ? '8px' : '0' }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#fff",
              color: "#2E5939",
              minWidth: windowWidth < 720 ? '700px' : '0' // permitir scroll en móviles pero no forzar blanco
            }}>
               <thead>
                 <tr style={{ backgroundColor: "#679750", color: "#fff" }}>
                   <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold", fontSize: "14px" }}>Cabaña</th>
                   <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold", fontSize: "14px" }}>Fecha</th>
                   <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold", fontSize: "14px" }} className="mobile-hidden">Mes</th>
                   <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold", fontSize: "14px" }} className="mobile-hidden">Año</th>
                   <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold", fontSize: "14px" }}>Estado</th>
                   <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold", fontSize: "14px" }}>Acciones</th>
                 </tr>
               </thead>
               <tbody>
                 {filteredDisponibilidades.length === 0 ? (
                   <tr>
                     <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
                       <div style={{ fontSize: "16px", marginBottom: "10px" }}>
                         {disponibilidades.length === 0 ? "No hay disponibilidades registradas" : "No se encontraron resultados"}
                       </div>
                       <div style={{ fontSize: "14px", color: "#679750" }}>
                         {disponibilidades.length === 0 ? 
                           "Haz clic en 'Nueva Disponibilidad' para agregar la primera" : 
                           "Intenta con otros términos de búsqueda o filtros"}
                       </div>
                     </td>
                   </tr>
                 ) : (
                   paginatedDisponibilidades.map((disp) => (
                    <tr key={disp.idDisponibilidad} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "15px", fontWeight: "500" }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {getCabanaIcon(getCabanaNombre(disp.idCabana))}
                          <div>
                            <div style={{ fontWeight: '600' }}>{getCabanaNombre(disp.idCabana)}</div>
                            <div style={{ fontSize: '12px', color: '#679750' }} className="mobile-hidden">
                              ID: {disp.idCabana}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "15px" }}>
                        <div style={{ fontWeight: '500' }}>{formatFechaCorta(disp.dia)}</div>
                        <div style={{ fontSize: '12px', color: '#679750' }} className="mobile-hidden">
                          {formatFecha(disp.dia)}
                        </div>
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }} className="mobile-hidden">
                        {getMesFromFecha(disp.dia)}
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }} className="mobile-hidden">
                        {disp.anio || "N/A"}
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <button
                          onClick={() => toggleEstado(disp)}
                          style={{
                            cursor: "pointer",
                            padding: "8px 12px",
                            borderRadius: "20px",
                            border: "none",
                            backgroundColor: disp.estado ? "#4caf50" : "#e57373",
                            color: "white",
                            fontWeight: "600",
                            fontSize: "12px",
                            minWidth: "120px",
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = "scale(1.05)";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = "scale(1)";
                          }}
                        >
                          {disp.estado ? 
                            <><FaCalendarCheck /> Disponible</> : 
                            <><FaCalendarTimes /> No Disponible</>
                          }
                        </button>
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => handleView(disp)}
                            style={btnAccion("#F7F4EA", "#2E5939")}
                            title="Ver Detalles"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleEdit(disp)}
                            style={btnAccion("#F7F4EA", "#2E5939")}
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(disp)}
                            style={btnAccion("#fbe9e7", "#e57373")}
                            title="Eliminar"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div style={{ 
          marginTop: 20, 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          gap: 10,
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            style={navBtnStyle(currentPage === 1)}
          >
            Anterior
          </button>
          
          {/* Mostrar máximo 5 páginas alrededor de la actual */}
          {(() => {
            const pages = [];
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(totalPages, currentPage + 2);
            
            for (let i = startPage; i <= endPage; i++) {
              pages.push(
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  style={pageBtnStyle(currentPage === i)}
                >
                  {i}
                </button>
              );
            }
            return pages;
          })()}
          
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={navBtnStyle(currentPage === totalPages)}
          >
            Siguiente
          </button>
          
          <div style={{ 
            fontSize: '14px', 
            color: '#2E5939', 
            marginLeft: '15px',
            fontWeight: '500'
          }}>
            Página {currentPage} de {totalPages}
          </div>
        </div>
      )}

      {/* Modal de formulario */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939", fontSize: "24px" }}>
                {isEditing ? "Editar Disponibilidad" : "Nueva Disponibilidad"}
              </h2>
              <button
                onClick={closeForm}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2E5939",
                  fontSize: "20px",
                  cursor: "pointer",
                  padding: "5px",
                  borderRadius: "5px",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#f0f0f0";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleAddDisponibilidad}>
              <FormField
                label="Cabaña"
                name="idCabana"
                type="select"
                value={newDisponibilidad.idCabana}
                onChange={handleChange}
                error={formErrors.idCabana}
                success={formSuccess.idCabana}
                warning={formWarnings.idCabana}
                options={cabanas.map(cabana => ({ 
                  value: cabana.idCabana.toString(), 
                  label: cabana.nombre 
                }))}
                required={true}
                disabled={loadingCabanas || cabanas.length === 0}
              />

              <FormField
                label={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaCalendarAlt />
                    Fecha de Disponibilidad
                  </div>
                }
                name="dia"
                type="date"
                value={newDisponibilidad.dia}
                onChange={handleChange}
                error={formErrors.dia}
                success={formSuccess.dia}
                warning={formWarnings.dia}
                required={true}
                disabled={loading}
                min={new Date().toISOString().split('T')[0]}
              />

              <FormField
                label="Estado"
                name="estado"
                type="select"
                value={newDisponibilidad.estado}
                onChange={handleChange}
                error={formErrors.estado}
                success={formSuccess.estado}
                warning={formWarnings.estado}
                options={[
                  { value: "true", label: "🟢 Disponible" },
                  { value: "false", label: "🔴 No Disponible" }
                ]}
                required={true}
                disabled={loading}
              />

              <div style={{ display: "flex", gap: 10, marginTop: 30 }}>
                <button
                  type="submit"
                  disabled={loading || isSubmitting}
                  style={{
                    backgroundColor: (loading || isSubmitting) ? "#ccc" : "#2E5939",
                    color: "#fff",
                    padding: "12px 25px",
                    border: "none",
                    borderRadius: 10,
                    cursor: (loading || isSubmitting) ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    flex: 1,
                    fontSize: "14px",
                    transition: "all 0.3s ease"
                  }}
                  onMouseOver={(e) => {
                    if (!loading && !isSubmitting) {
                      e.target.style.background = "linear-gradient(90deg, #67d630, #95d34e)";
                      e.target.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loading && !isSubmitting) {
                      e.target.style.background = "#2E5939";
                      e.target.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {loading ? "Guardando..." : (isEditing ? "Actualizar" : "Guardar")} Disponibilidad
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={loading || isSubmitting}
                  style={{
                    backgroundColor: "#ccc",
                    color: "#333",
                    padding: "12px 25px",
                    border: "none",
                    borderRadius: 10,
                    cursor: (loading || isSubmitting) ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    flex: 1,
                    fontSize: "14px"
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de detalles */}
      {showDetails && selectedDisponibilidad && (
        <div style={modalOverlayStyle}>
          <div style={detailsModalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939", fontSize: "24px" }}>Detalles de Disponibilidad</h2>
              <button
                onClick={closeDetailsModal}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2E5939",
                  fontSize: "20px",
                  cursor: "pointer",
                  padding: "5px",
                  borderRadius: "5px",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#f0f0f0";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                <FaTimes />
              </button>
            </div>
            
            <div>
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>ID de Disponibilidad</div>
                <div style={detailValueStyle}>#{selectedDisponibilidad.idDisponibilidad}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Cabaña</div>
                <div style={detailValueStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {getCabanaIcon(getCabanaNombre(selectedDisponibilidad.idCabana))}
                    <div>
                      <div style={{ fontWeight: '600' }}>{getCabanaNombre(selectedDisponibilidad.idCabana)}</div>
                      <div style={{ fontSize: '14px', color: '#679750' }}>
                        ID: {selectedDisponibilidad.idCabana}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Fecha</div>
                <div style={detailValueStyle}>{formatFecha(selectedDisponibilidad.dia)}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Mes</div>
                <div style={detailValueStyle}>{getMesFromFecha(selectedDisponibilidad.dia)}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Año</div>
                <div style={detailValueStyle}>{selectedDisponibilidad.anio || "No especificado"}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Estado</div>
                <div style={{
                  ...detailValueStyle,
                  color: selectedDisponibilidad.estado ? '#4caf50' : '#e57373',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {selectedDisponibilidad.estado ? 
                    <><FaCalendarCheck /> Disponible</> : 
                    <><FaCalendarTimes /> No Disponible</>
                  }
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
              <button
                onClick={closeDetailsModal}
                style={{
                  backgroundColor: "#2E5939",
                  color: "#fff",
                  padding: "12px 30px",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "linear-gradient(90deg, #67d630, #95d34e)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "#2E5939";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Cerrar Detalles
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && disponibilidadToDelete && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 500, textAlign: 'center' }}>
            <div style={{ marginBottom: 20 }}>
              <FaExclamationTriangle 
                style={{ 
                  fontSize: '48px', 
                  color: '#e57373',
                  marginBottom: '15px'
                }} 
              />
              <h3 style={{ marginBottom: 15, color: "#2E5939", fontSize: "22px" }}>
                Confirmar Eliminación
              </h3>
            </div>
            
            <p style={{ marginBottom: 25, fontSize: '16px', color: "#2E5939", lineHeight: '1.5' }}>
              ¿Estás seguro de eliminar la disponibilidad de<br />
              "<strong>{getCabanaNombre(disponibilidadToDelete.idCabana)}</strong>"<br />
              para la fecha "<strong>{formatFecha(disponibilidadToDelete.dia)}</strong>"?
            </p>

            <div style={{ 
              backgroundColor: '#fff3cd', 
              border: '1px solid #ffeaa7',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '25px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <FaInfoCircle style={{ color: '#856404' }} />
                <strong style={{ color: '#856404', fontSize: '14px' }}>Importante</strong>
              </div>
              <p style={{ color: '#856404', margin: 0, fontSize: '13px', lineHeight: '1.4' }}>
                Esta acción no se puede deshacer. La disponibilidad será eliminada permanentemente del sistema.
              </p>
            </div>

            <div style={{ display: "flex", gap: 15, justifyContent: "center" }}>
              <button
                onClick={confirmDelete}
                disabled={loading}
                style={{
                  backgroundColor: loading ? "#ccc" : "#e57373",
                  color: "white",
                  padding: "12px 25px",
                  border: "none",
                  borderRadius: 10,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                  minWidth: "120px",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading) {
                    e.target.style.transform = "translateY(0)";
                  }
                }}
              >
                {loading ? "Eliminando..." : "Sí, Eliminar"}
              </button>
              <button
                onClick={cancelDelete}
                disabled={loading}
                style={{
                  backgroundColor: "#2E5939",
                  color: "#fff",
                  padding: "12px 25px",
                  border: "none",
                  borderRadius: 10,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                  minWidth: "120px",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.background = "linear-gradient(90deg, #67d630, #95d34e)";
                    e.target.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading) {
                    e.target.style.background = "#2E5939";
                    e.target.style.transform = "translateY(0)";
                  }
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Disponibilidad;