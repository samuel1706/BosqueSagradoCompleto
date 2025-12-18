import React, { useState, useMemo, useEffect } from "react";
import { 
  FaEye, FaEdit, FaTrash, FaTimes, FaSearch, FaPlus, 
  FaExclamationTriangle, FaCheck, FaInfoCircle, FaCalendarAlt,
  FaBed, FaCalendarCheck, FaCalendarTimes, FaFilter,
  FaHome, FaCouch, FaMountain, FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import axios from "axios";

// ===============================================
// ESTILOS MEJORADOS - VERSIÓN COMPACTA
// ===============================================
const btnAccion = (bg, borderColor) => ({
  marginRight: 4,
  cursor: "pointer",
  padding: "6px 10px",
  borderRadius: 6,
  border: `1px solid ${borderColor}`,
  backgroundColor: bg,
  color: borderColor,
  fontWeight: "600",
  fontSize: "12px",
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  transition: "all 0.2s ease",
});

const labelStyle = {
  display: "block",
  fontWeight: "600",
  marginBottom: 4,
  color: "#2E5939",
  fontSize: "12px",
};

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  border: "1px solid #e0e0e0",
  borderRadius: 6,
  backgroundColor: "#F7F4EA",
  color: "#2E5939",
  boxSizing: 'border-box',
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  transition: "all 0.2s ease",
  fontSize: "12px",
};

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
  padding: "15px",
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: 10,
  boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
  width: "90%",
  maxWidth: "500px",
  color: "#2E5939",
  boxSizing: 'border-box',
  maxHeight: '85vh',
  overflowY: 'auto',
  position: 'relative',
  border: "1px solid #679750",
};

// Estilos para alertas
const alertStyle = {
  position: 'fixed',
  top: 15,
  right: 15,
  padding: '12px 16px',
  borderRadius: '8px',
  boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
  zIndex: 10000,
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontWeight: '600',
  fontSize: '14px',
  minWidth: '250px',
  maxWidth: '400px',
  borderLeft: '4px solid',
  backdropFilter: 'blur(10px)',
};

const alertIconStyle = {
  fontSize: '16px',
  flexShrink: 0,
};

const alertSuccessStyle = {
  ...alertStyle,
  backgroundColor: '#f0f9f0',
  color: '#1e7e34',
  borderLeftColor: '#28a745',
};

const alertErrorStyle = {
  ...alertStyle,
  backgroundColor: '#fdf2f2',
  color: '#c53030',
  borderLeftColor: '#e53e3e',
};

const alertWarningStyle = {
  ...alertStyle,
  backgroundColor: '#fffaf0',
  color: '#b7791f',
  borderLeftColor: '#ed8936',
};

const alertInfoStyle = {
  ...alertStyle,
  backgroundColor: '#f0f9ff',
  color: '#1e40af',
  borderLeftColor: '#3b82f6',
};

const detailsModalStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: 10,
  boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
  width: "90%",
  maxWidth: "500px",
  color: "#2E5939",
  boxSizing: 'border-box',
  maxHeight: '75vh',
  overflowY: 'auto',
  border: "1px solid #679750",
};

const detailItemStyle = {
  marginBottom: 12,
  paddingBottom: 12,
  borderBottom: "1px solid rgba(46, 89, 57, 0.1)"
};

const detailLabelStyle = {
  fontWeight: "bold",
  color: "#2E5939",
  marginBottom: 4,
  fontSize: "12px"
};

const detailValueStyle = {
  fontSize: 14,
  color: "#2E5939",
  fontWeight: "500",
};

const validationMessageStyle = {
  fontSize: "0.7rem",
  marginTop: "3px",
  display: "flex",
  alignItems: "center",
  gap: "4px"
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
// ESTILOS ESPECÍFICOS PARA CALENDARIO COMPACTO
// ===============================================
const calendarHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px',
  padding: '12px 15px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
};

const calendarNavButtonStyle = {
  backgroundColor: '#2E5939',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  padding: '8px 12px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontWeight: '600',
  fontSize: '12px',
  transition: 'all 0.2s ease',
};

const calendarTitleStyle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#2E5939',
  margin: 0,
};

const calendarGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '6px',
  marginBottom: '15px',
};

const dayHeaderStyle = {
  padding: '8px 4px',
  textAlign: 'center',
  fontWeight: 'bold',
  color: '#2E5939',
  backgroundColor: '#f8fbf8',
  borderRadius: '6px',
  fontSize: '11px',
  border: '1px solid #e8f0e8',
};

const dayCellStyle = (isCurrentMonth, isToday) => ({
  backgroundColor: isCurrentMonth ? (isToday ? '#e8f5e8' : '#fff') : '#fafafa',
  border: `1px solid ${isCurrentMonth ? '#e8f0e8' : '#f0f0f0'}`,
  borderRadius: '6px',
  padding: '6px',
  minHeight: '80px',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
});

const dayNumberStyle = (isCurrentMonth, isToday) => ({
  fontWeight: 'bold',
  fontSize: '12px',
  marginBottom: '4px',
  color: isToday ? '#fff' : (isCurrentMonth ? '#333' : '#bbb'),
  backgroundColor: isToday ? '#2E5939' : 'transparent',
  borderRadius: '50%',
  width: '22px',
  height: '22px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'flex-start',
});

const availabilityItemStyle = (estado) => ({
  backgroundColor: estado ? '#f0f9f0' : '#fdf2f2',
  border: `1px solid ${estado ? '#c6f6d5' : '#fed7d7'}`,
  borderRadius: '4px',
  padding: '3px 5px',
  marginBottom: '3px',
  fontSize: '10px',
  color: estado ? '#2E5939' : '#c53030',
  display: 'flex',
  alignItems: 'center',
  gap: '3px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const cabanaSelectorStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gap: '10px',
  marginBottom: '15px',
};

const cabanaCardStyle = (selected) => ({
  backgroundColor: selected ? '#f0f7f0' : '#fff',
  border: `1px solid ${selected ? '#2E5939' : '#e0e0e0'}`,
  borderRadius: '8px',
  padding: '10px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
});

const filterSectionStyle = {
  backgroundColor: '#fff',
  borderRadius: '8px',
  padding: '15px',
  marginBottom: '15px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  border: '1px solid #e8f0e8',
};

const filterGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '12px',
  alignItems: 'end',
};

const filterButtonStyle = (active) => ({
  padding: '8px 12px',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: active ? '#2E5939' : '#f8fbf8',
  color: active ? 'white' : '#2E5939',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'all 0.2s ease',
  border: `1px solid ${active ? '#2E5939' : '#e8f0e8'}`,
});

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
const API_DISPONIBILIDAD = "https://www.bosquesagrado.somee.com/api/Disponibilidad";
const API_CABANAS = "https://www.bosquesagrado.somee.com/api/Cabanas";

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
    let borderColor = "#e0e0e0";
    if (error) borderColor = "#e57373";
    else if (success) borderColor = "#4caf50";
    else if (warning) borderColor = "#ff9800";

    return {
      ...inputStyle,
      border: `1px solid ${borderColor}`,
      borderLeft: `3px solid ${borderColor}`,
    };
  };

  const getValidationMessage = () => {
    if (error) {
      return (
        <div style={errorValidationStyle}>
          <FaExclamationTriangle size={10} />
          {error}
        </div>
      );
    }
    if (success) {
      return (
        <div style={successValidationStyle}>
          <FaCheck size={10} />
          {success}
        </div>
      );
    }
    if (warning) {
      return (
        <div style={warningValidationStyle}>
          <FaInfoCircle size={10} />
          {warning}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ marginBottom: '12px', ...style }}>
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
  const [selectedCabana, setSelectedCabana] = useState("todas");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [currentDate, setCurrentDate] = useState(new Date());
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

  // Responsive helpers
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const showSidebarOffset = windowWidth >= 992;
  const containerStyle = {
    position: "relative",
    padding: windowWidth < 600 ? "10px" : "15px",
    backgroundColor: "#f8fbf8",
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
    if (!cabanaNombre) return <FaBed color="#679750" size={14} />;
    
    const nombre = cabanaNombre.toLowerCase();
    if (nombre.includes('lujo') || nombre.includes('premium')) return <FaCouch color="#FFD700" size={14} />;
    if (nombre.includes('familiar')) return <FaHome color="#4CAF50" size={14} />;
    if (nombre.includes('montaña') || nombre.includes('montana')) return <FaMountain color="#795548" size={14} />;
    return <FaBed color="#679750" size={14} />;
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "No especificada";
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return fecha;
    }
  };

  // ===============================================
  // FUNCIONES DEL CALENDARIO
  // ===============================================
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + direction);
      return newDate;
    });
  };

  const getMonthYearString = (date) => {
    return date.toLocaleDateString('es-ES', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getDayAvailability = (day, month, year) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    let filtered = disponibilidades.filter(d => 
      d.dia && d.dia.includes(dateStr)
    );

    // Aplicar filtro de cabaña
    if (selectedCabana !== "todas") {
      filtered = filtered.filter(d => d.idCabana && d.idCabana.toString() === selectedCabana);
    }

    // Aplicar filtro de estado
    if (filterEstado !== "todos") {
      const estadoFilter = filterEstado === "activo";
      filtered = filtered.filter(d => d.estado === estadoFilter);
    }

    return filtered;
  };

  const isToday = (day, month, year) => {
    const today = new Date();
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  // ===============================================
  // EFECTOS
  // ===============================================
  useEffect(() => {
    console.log("🔍 Componente Disponibilidad montado, cargando datos...");
    fetchDisponibilidades();
    fetchCabanas();
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
      
      const disponibilidadData = {
        dia: dia,
        estado: newDisponibilidad.estado === "true" || newDisponibilidad.estado === true,
        idCabana: parseInt(newDisponibilidad.idCabana)
      };

      console.log("📤 Enviando datos de disponibilidad:", disponibilidadData);

      let response;
      if (isEditing && newDisponibilidad.idDisponibilidad) {
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
      errorMessage = "Error de conexión. Verifica que el servidor esté ejecutándose en https://www.bosquesagrado.somee.com";
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = "No se puede conectar al servidor. Asegúrate de que la API esté corriendo en https://www.bosquesagrado.somee.com";
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
    }, 4000);
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
      idDisponibilidad: disponibilidad.idDisponibilidad,
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

  const handleDayClick = (day, month, year) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    setNewDisponibilidad({
      dia: dateStr,
      estado: true,
      idCabana: selectedCabana !== "todas" ? selectedCabana : (cabanas.length > 0 ? cabanas[0].idCabana.toString() : "")
    });
    setIsEditing(false);
    setShowForm(true);
  };

  // ===============================================
  // RENDERIZADO DEL CALENDARIO
  // ===============================================
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    
    const days = [];
    
    // Días del mes anterior
    const prevMonthDays = getDaysInMonth(new Date(year, month - 1, 1));
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      days.push(
        <div 
          key={`prev-${day}`} 
          style={dayCellStyle(false, false)}
        >
          <div style={dayNumberStyle(false, false)}>{day}</div>
        </div>
      );
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const availability = getDayAvailability(day, month, year);
      const today = isToday(day, month, year);
      
      days.push(
        <div 
          key={`current-${day}`} 
          style={dayCellStyle(true, today)}
          onClick={() => handleDayClick(day, month, year)}
        >
          <div style={dayNumberStyle(true, today)}>{day}</div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {availability.map(disp => (
              <div 
                key={disp.idDisponibilidad}
                style={availabilityItemStyle(disp.estado)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleView(disp);
                }}
              >
                {disp.estado ? <FaCalendarCheck size={8} /> : <FaCalendarTimes size={8} />}
                {getCabanaNombre(disp.idCabana)}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    // Días del próximo mes
    const totalCells = 42; // 6 semanas * 7 días
    const nextMonthDays = totalCells - days.length;
    for (let day = 1; day <= nextMonthDays; day++) {
      days.push(
        <div 
          key={`next-${day}`} 
          style={dayCellStyle(false, false)}
        >
          <div style={dayNumberStyle(false, false)}>{day}</div>
        </div>
      );
    }
    
    return days;
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
              fontSize: '14px',
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
        marginBottom: 15,
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ minWidth: '200px' }}>
          <h1 style={{ margin: 0, color: "#2E5939", fontSize: "22px" }}>
            Calendario de Disponibilidad
          </h1>
          <p style={{ margin: "3px 0 0 0", color: "#679750", fontSize: "12px" }}>
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
            padding: "8px 15px",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "600",
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: "12px",
            whiteSpace: 'nowrap',
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "linear-gradient(90deg, #67d630, #95d34e)";
            e.target.style.transform = "translateY(-1px)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "#2E5939";
            e.target.style.transform = "translateY(0)";
          }}
        >
          <FaPlus size={12} /> Nueva Disponibilidad
        </button>
      </div>

      {/* Filtros Mejorados */}
      <div style={filterSectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <FaFilter color="#2E5939" size={14} />
          <h3 style={{ margin: 0, color: "#2E5939", fontSize: "14px" }}>Filtros</h3>
        </div>
        
        <div style={filterGridStyle}>
          <div>
            <label style={labelStyle}>Cabaña</label>
            <select
              value={selectedCabana}
              onChange={(e) => setSelectedCabana(e.target.value)}
              style={inputStyle}
            >
              <option value="todas">Todas las Cabañas</option>
              {cabanas.map(cabana => (
                <option key={cabana.idCabana} value={cabana.idCabana.toString()}>
                  {cabana.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Estado</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setFilterEstado("todos")}
                style={filterButtonStyle(filterEstado === "todos")}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterEstado("activo")}
                style={filterButtonStyle(filterEstado === "activo")}
              >
                <FaCalendarCheck size={10} /> Disponible
              </button>
              <button
                onClick={() => setFilterEstado("inactivo")}
                style={filterButtonStyle(filterEstado === "inactivo")}
              >
                <FaCalendarTimes size={10} /> No Disponible
              </button>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Acciones Rápidas</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={fetchDisponibilidades}
                style={{
                  ...filterButtonStyle(false),
                  backgroundColor: '#f0f9ff',
                  color: '#1e40af',
                  border: '1px solid #3b82f6'
                }}
              >
                <FaSearch size={10} /> Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ 
          textAlign: "center", 
          padding: "30px", 
          color: "#2E5939",
          backgroundColor: '#fff',
          borderRadius: '8px',
          marginBottom: '15px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>
            🔄 Cargando disponibilidades...
          </div>
          <div style={{ fontSize: '12px', color: '#679750' }}>
            Obteniendo información actualizada
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div style={{
          backgroundColor: '#fffaf0',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '15px',
          color: '#b7791f',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <FaExclamationTriangle size={14} />
            <strong style={{ fontSize: '14px' }}>Error de Conexión</strong>
          </div>
          <p style={{ margin: '8px 0', fontSize: '12px' }}>{error}</p>
          <button
            onClick={fetchDisponibilidades}
            style={{
              backgroundColor: '#2E5939',
              color: 'white',
              padding: '8px 15px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '12px',
              transition: 'all 0.2s ease'
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

      {/* Navegación del Calendario */}
      <div style={calendarHeaderStyle}>
        <button
          onClick={() => navigateMonth(-1)}
          style={calendarNavButtonStyle}
          onMouseOver={(e) => {
            e.target.style.background = "linear-gradient(90deg, #67d630, #95d34e)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "#2E5939";
          }}
        >
          <FaChevronLeft size={10} /> Anterior
        </button>
        
        <h2 style={calendarTitleStyle}>
          {getMonthYearString(currentDate)}
        </h2>
        
        <button
          onClick={() => navigateMonth(1)}
          style={calendarNavButtonStyle}
          onMouseOver={(e) => {
            e.target.style.background = "linear-gradient(90deg, #67d630, #95d34e)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "#2E5939";
          }}
        >
          Siguiente <FaChevronRight size={10} />
        </button>
      </div>

      {/* Calendario */}
      {!loading && !error && (
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          padding: '15px',
          overflow: 'hidden'
        }}>
          {/* Encabezados de días */}
          <div style={calendarGridStyle}>
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} style={dayHeaderStyle}>
                {day}
              </div>
            ))}
          </div>
          
          {/* Grid de días */}
          <div style={calendarGridStyle}>
            {renderCalendar()}
          </div>
          
          {/* Leyenda */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            marginTop: '15px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: '#4caf50',
                borderRadius: '2px'
              }}></div>
              <span style={{ fontSize: '11px', color: '#2E5939' }}>Disponible</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: '#e53e3e',
                borderRadius: '2px'
              }}></div>
              <span style={{ fontSize: '11px', color: '#2E5939' }}>No Disponible</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: '#2E5939',
                borderRadius: '50%'
              }}></div>
              <span style={{ fontSize: '11px', color: '#2E5939' }}>Hoy</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal de formulario */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
              <h2 style={{ margin: 0, color: "#2E5939", fontSize: "18px" }}>
                {isEditing ? "Editar Disponibilidad" : "Nueva Disponibilidad"}
              </h2>
              <button
                onClick={closeForm}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2E5939",
                  fontSize: "16px",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                  transition: "all 0.2s ease"
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FaCalendarAlt size={12} />
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

              <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                <button
                  type="submit"
                  disabled={loading || isSubmitting}
                  style={{
                    backgroundColor: (loading || isSubmitting) ? "#ccc" : "#2E5939",
                    color: "#fff",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: 6,
                    cursor: (loading || isSubmitting) ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    flex: 1,
                    fontSize: "12px",
                    transition: "all 0.2s ease"
                  }}
                  onMouseOver={(e) => {
                    if (!loading && !isSubmitting) {
                      e.target.style.background = "linear-gradient(90deg, #67d630, #95d34e)";
                      e.target.style.transform = "translateY(-1px)";
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
                    backgroundColor: "#e0e0e0",
                    color: "#333",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: 6,
                    cursor: (loading || isSubmitting) ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    flex: 1,
                    fontSize: "12px"
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
              <h2 style={{ margin: 0, color: "#2E5939", fontSize: "18px" }}>Detalles de Disponibilidad</h2>
              <button
                onClick={closeDetailsModal}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2E5939",
                  fontSize: "16px",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                  transition: "all 0.2s ease"
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {getCabanaIcon(getCabanaNombre(selectedDisponibilidad.idCabana))}
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>{getCabanaNombre(selectedDisponibilidad.idCabana)}</div>
                      <div style={{ fontSize: '12px', color: '#679750' }}>
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
                <div style={detailLabelStyle}>Estado</div>
                <div style={{
                  ...detailValueStyle,
                  color: selectedDisponibilidad.estado ? '#4caf50' : '#e53e3e',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {selectedDisponibilidad.estado ? 
                    <><FaCalendarCheck size={12} /> Disponible</> : 
                    <><FaCalendarTimes size={12} /> No Disponible</>
                  }
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: 20 }}>
              <button
                onClick={() => {
                  closeDetailsModal();
                  handleEdit(selectedDisponibilidad);
                }}
                style={{
                  backgroundColor: "#2E5939",
                  color: "#fff",
                  padding: "8px 15px",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "12px",
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "linear-gradient(90deg, #67d630, #95d34e)";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "#2E5939";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                <FaEdit size={12} /> Editar
              </button>
              <button
                onClick={() => {
                  closeDetailsModal();
                  handleDeleteClick(selectedDisponibilidad);
                }}
                style={{
                  backgroundColor: "#e53e3e",
                  color: "#fff",
                  padding: "8px 15px",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "12px",
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                }}
              >
                <FaTrash size={12} /> Eliminar
              </button>
              <button
                onClick={closeDetailsModal}
                style={{
                  backgroundColor: "#e0e0e0",
                  color: "#333",
                  padding: "8px 15px",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "12px",
                  transition: "all 0.2s ease"
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && disponibilidadToDelete && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 400, textAlign: 'center' }}>
            <div style={{ marginBottom: 15 }}>
              <FaExclamationTriangle 
                style={{ 
                  fontSize: '36px', 
                  color: '#e53e3e',
                  marginBottom: '10px'
                }} 
              />
              <h3 style={{ marginBottom: 12, color: "#2E5939", fontSize: "16px" }}>
                Confirmar Eliminación
              </h3>
            </div>
            
            <p style={{ marginBottom: 20, fontSize: '14px', color: "#2E5939", lineHeight: '1.4' }}>
              ¿Estás seguro de eliminar la disponibilidad de<br />
              "<strong>{getCabanaNombre(disponibilidadToDelete.idCabana)}</strong>"<br />
              para la fecha "<strong>{formatFecha(disponibilidadToDelete.dia)}</strong>"?
            </p>

            <div style={{ 
              backgroundColor: '#fffaf0', 
              border: '1px solid #ffeaa7',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <FaInfoCircle style={{ color: '#b7791f' }} size={12} />
                <strong style={{ color: '#b7791f', fontSize: '12px' }}>Importante</strong>
              </div>
              <p style={{ color: '#b7791f', margin: 0, fontSize: '11px', lineHeight: '1.3' }}>
                Esta acción no se puede deshacer. La disponibilidad será eliminada permanentemente.
              </p>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={confirmDelete}
                disabled={loading}
                style={{
                  backgroundColor: loading ? "#ccc" : "#e53e3e",
                  color: "white",
                  padding: "8px 20px",
                  border: "none",
                  borderRadius: 6,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  fontSize: "12px",
                  minWidth: "100px",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.transform = "translateY(-1px)";
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
                  padding: "8px 20px",
                  border: "none",
                  borderRadius: 6,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  fontSize: "12px",
                  minWidth: "100px",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.background = "linear-gradient(90deg, #67d630, #95d34e)";
                    e.target.style.transform = "translateY(-1px)";
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