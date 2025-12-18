// src/components/Cabins.jsx
import { FaEye, FaEdit, FaTrash, FaTimes, FaExclamationTriangle, FaPlus, FaChair, FaCheck, FaInfoCircle, FaSearch, FaImage, FaUpload, FaCamera, FaUsers, FaDollarSign, FaSlidersH } from "react-icons/fa";
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { useCloudinary } from '../../../hooks/useCloudinary';

// ===============================================
// ESTILOS MEJORADOS (CONSISTENTES)
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
};

const inputErrorStyle = {
  ...inputStyle,
  border: "2px solid #e74c3c",
  backgroundColor: "#fdf2f2",
};

const yellowBlockedInputStyle = {
  ...inputStyle,
  backgroundColor: "#fffde7",
  color: "#bfa100",
  cursor: "not-allowed",
  border: "1.5px solid #ffe082"
};

const navBtnStyle = (disabled) => ({
  cursor: disabled ? "not-allowed" : "pointer",
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #ccc",
  backgroundColor: disabled ? "#e0e0e0" : "#F7F4EA",
  color: "#2E5939",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: 30,
  borderRadius: 12,
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  width: "90%",
  maxWidth: 600,
  color: "#2E5939",
  boxSizing: 'border-box',
  maxHeight: '90vh',
  overflowY: 'auto',
  position: 'relative',
  border: "2px solid #679750",
};

// Estilos mejorados para alertas
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
  animation: 'slideInRight 0.3s ease-out',
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
  padding: 30,
  borderRadius: 12,
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  width: "90%",
  maxWidth: 700,
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
  marginBottom: 5
};

const detailValueStyle = {
  fontSize: 16,
  color: "#2E5939"
};

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
// ESTILOS PARA IMÁGENES
// ===============================================
const imageUploadStyle = {
  border: '2px dashed #679750',
  borderRadius: '10px',
  padding: '20px',
  textAlign: 'center',
  backgroundColor: '#F7F4EA',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  marginBottom: '15px'
};

const imagePreviewContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
  gap: '10px',
  marginTop: '15px'
};

const imagePreviewStyle = {
  position: 'relative',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
};

const imageStyle = {
  width: '100%',
  height: '100px',
  objectFit: 'cover',
  display: 'block'
};

const imageRemoveButtonStyle = {
  position: 'absolute',
  top: '5px',
  right: '5px',
  background: 'rgba(229, 115, 115, 0.9)',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: '24px',
  height: '24px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px'
};

const imageGalleryStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gap: '15px',
  marginTop: '15px'
};

const galleryImageStyle = {
  width: '100%',
  height: '120px',
  objectFit: 'cover',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
};

// ===============================================
// VALIDACIONES Y PATRONES
// ===============================================
const VALIDATION_PATTERNS = {
  nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  descripcion: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,!?()-]+$/,
  precio: /^\d+(\.\d{1,2})?$/
};

const VALIDATION_RULES = {
  nombre: {
    minLength: 2,
    maxLength: 50,
    required: true,
    pattern: VALIDATION_PATTERNS.nombre,
    errorMessages: {
      required: "El nombre de la cabaña es obligatorio.",
      minLength: "El nombre debe tener al menos 2 caracteres.",
      maxLength: "El nombre no puede exceder los 50 caracteres.",
      pattern: "El nombre solo puede contener letras y espacios."
    }
  },
  descripcion: {
    minLength: 10,
    maxLength: 500,
    required: true,
    pattern: VALIDATION_PATTERNS.descripcion,
    errorMessages: {
      required: "La descripción es obligatoria.",
      minLength: "La descripción debe tener al menos 10 caracteres.",
      maxLength: "La descripción no puede exceder los 500 caracteres.",
      pattern: "La descripción contiene caracteres no válidos."
    }
  },
  precio: {
    min: 0,
    max: 1000000,
    required: true,
    pattern: VALIDATION_PATTERNS.precio,
    errorMessages: {
      required: "El precio es obligatorio.",
      min: "El precio no puede ser negativo.",
      max: "El precio no puede exceder $1,000,000.",
      pattern: "El precio debe ser un número válido (ej: 150.00)",
      invalid: "El precio debe ser un número válido."
    }
  },
  idTipoCabana: {
    required: true,
    errorMessages: {
      required: "El tipo de cabaña es obligatorio."
    }
  },
  idSede: {
    required: true,
    errorMessages: {
      required: "Debe seleccionar una sede."
    }
  },
  idTemporada: {
    required: true,
    errorMessages: {
      required: "Debe seleccionar una temporada."
    }
  },
  capacidad: {
    min: 1,
    max: 20,
    required: true,
    errorMessages: {
      required: "La capacidad es obligatoria.",
      min: "La capacidad mínima es 1 persona.",
      max: "La capacidad máxima es 20 personas.",
      invalid: "La capacidad debe ser un número entero válido."
    }
  }
};

// ===============================================
// DATOS DE CONFIGURACIÓN
// ===============================================
const API_CABANAS = "https://www.bosquesagrado.somee.com/api/Cabanas";
const API_SEDES = "https://www.bosquesagrado.somee.com/api/Sede";
const API_TEMPORADAS = "https://www.bosquesagrado.somee.com/api/Temporada";
const API_TIPOS_CABANA = "https://www.bosquesagrado.somee.com/api/TipoCabana";
const API_COMODIDADES = "https://www.bosquesagrado.somee.com/api/Comodidades";
const API_CABANA_COMODIDADES = "https://www.bosquesagrado.somee.com/api/CabanaPorComodidades";
const API_RESERVAS = "https://www.bosquesagrado.somee.com/api/Reservas";
const API_IMAGENES = "https://www.bosquesagrado.somee.com/api/ImgCabana";

const ITEMS_PER_PAGE = 5;

// ===============================================
// COMPONENTE FormField MEJORADO
// ===============================================
const FormField = ({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  onBlur,
  error, 
  success,
  warning,
  options = [], 
  style = {}, 
  required = true, 
  disabled = false,
  maxLength,
  placeholder,
  showCharCount = false,
  min,
  max,
  step,
  touched = false,
  textarea = false,
  rows = 4
}) => {
  const finalOptions = useMemo(() => {
    if (type === "select") {
      const placeholderOption = { value: "", label: placeholder || "Seleccionar", disabled: required };
      return [placeholderOption, ...options];
    }
    return options;
  }, [options, type, required, placeholder]);

  const handleFilteredInputChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (name === 'nombre') {
      filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    } else if (name === 'capacidad') {
      filteredValue = value.replace(/[^0-9]/g, "");
      if (filteredValue && parseInt(filteredValue) > (max || 20)) {
        filteredValue = max || "20";
      }
    } else if (name === 'precio') {
      // Permitir solo números y un punto decimal
      filteredValue = value.replace(/[^0-9.]/g, "");
      // Permitir solo un punto decimal
      const parts = filteredValue.split('.');
      if (parts.length > 2) {
        filteredValue = parts[0] + '.' + parts.slice(1).join('');
      }
      // Limitar a 2 decimales
      if (parts.length === 2 && parts[1].length > 2) {
        filteredValue = parts[0] + '.' + parts[1].substring(0, 2);
      }
    } else if (name === 'descripcion') {
      // Permitir letras, números y caracteres básicos de puntuación
      filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,!?()-]/g, "");
    } else {
      filteredValue = value;
    }
    
    onChange({ target: { name, value: filteredValue } });
  };

  // Solo mostrar errores si el campo ha sido tocado
  const showError = touched && error;
  const showSuccess = touched && success && !error;
  const showWarning = touched && warning && !error;

  const getInputStyle = () => {
    let borderColor = "#ccc";
    if (showError) borderColor = "#e57373";
    else if (showSuccess) borderColor = "#4caf50";
    else if (showWarning) borderColor = "#ff9800";

    return {
      ...inputStyle,
      border: `1px solid ${borderColor}`,
      borderLeft: showError || showSuccess || showWarning ? `4px solid ${borderColor}` : `1px solid ${borderColor}`,
    };
  };

  const getValidationMessage = () => {
    if (showError) {
      return (
        <div style={errorValidationStyle}>
          <FaExclamationTriangle size={12} />
          {error}
        </div>
      );
    }
    if (showSuccess) {
      return (
        <div style={successValidationStyle}>
          <FaCheck size={12} />
          {success}
        </div>
      );
    }
    if (showWarning) {
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
          onBlur={onBlur}
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
      ) : textarea ? (
        <div>
          <textarea
            name={name}
            value={value}
            onChange={handleFilteredInputChange}
            onBlur={onBlur}
            style={{
              ...getInputStyle(),
              minHeight: `${rows * 20}px`,
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            required={required}
            disabled={disabled}
            maxLength={maxLength}
            placeholder={placeholder}
            rows={rows}
          />
          {showCharCount && maxLength && (
            <div style={{
              fontSize: "0.75rem",
              color: value.length > maxLength * 0.8 ? "#ff9800" : "#679750",
              textAlign: "right",
              marginTop: "4px"
            }}>
              {value.length}/{maxLength} caracteres
            </div>
          )}
        </div>
      ) : (
        <div>
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleFilteredInputChange}
            onBlur={onBlur}
            style={getInputStyle()}
            required={required}
            disabled={disabled}
            maxLength={maxLength}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
          />
          {showCharCount && maxLength && (
            <div style={{
              fontSize: "0.75rem",
              color: value.length > maxLength * 0.8 ? "#ff9800" : "#679750",
              textAlign: "right",
              marginTop: "4px"
            }}>
              {value.length}/{maxLength} caracteres
            </div>
          )}
        </div>
      )}
      {getValidationMessage()}
    </div>
  );
};

// ===============================================
// COMPONENTE PRINCIPAL Cabins MEJORADO
// ===============================================
const Cabins = () => {
  const [cabins, setCabins] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [temporadas, setTemporadas] = useState([]);
  const [tiposCabana, setTiposCabana] = useState([]);
  const [comodidades, setComodidades] = useState([]);
  const [cabanaComodidades, setCabanaComodidades] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentCabin, setCurrentCabin] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [cabinToDelete, setCabinToDelete] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [loading, setLoading] = useState(false);
  const [loadingSedes, setLoadingSedes] = useState(false);
  const [loadingTemporadas, setLoadingTemporadas] = useState(false);
  const [loadingTiposCabana, setLoadingTiposCabana] = useState(false);
  const [loadingComodidades, setLoadingComodidades] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState({});
  const [formWarnings, setFormWarnings] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  // ===============================================
  // FILTROS MEJORADOS
  // ===============================================
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sede: '',
    tipo: '',
    estado: '',
    precioMin: '',
    precioMax: '',
    capacidadMin: '',
    capacidadMax: ''
  });

  const [newCabin, setNewCabin] = useState({
    nombre: "",
    idTipoCabana: "",
    estado: true,
    idTemporada: "",
    idSede: "",
    capacidad: 2,
    precio: "",
    descripcion: "",
    comodidadesSeleccionadas: []
  });

  const [imagenesSeleccionadas, setImagenesSeleccionadas] = useState([]);
  const [imagenesAEliminar, setImagenesAEliminar] = useState([]);

  // ===============================================
  // EFECTOS
  // ===============================================
  useEffect(() => {
    fetchCabins();
    fetchSedes();
    fetchTemporadas();
    fetchTiposCabana();
    fetchComodidades();
    fetchCabanaComodidades();
    fetchReservas();
    fetchImagenes();
  }, []);

  // Validar formulario en tiempo real solo para campos tocados
  useEffect(() => {
    if (showForm) {
      Object.keys(touchedFields).forEach(fieldName => {
        if (touchedFields[fieldName]) {
          validateField(fieldName, newCabin[fieldName]);
        }
      });
    }
  }, [newCabin, showForm, touchedFields]);

  // Efecto para controlar el scroll del body cuando hay modales abiertos
  useEffect(() => {
    const hasModalOpen = showForm || showDetails || showDeleteConfirm || showAlert;
    
    if (hasModalOpen) {
      // Guardar la posición actual del scroll
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restaurar el scroll
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      // Limpiar al desmontar
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [showForm, showDetails, showDeleteConfirm, showAlert]);

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
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Clase para bloquear el scroll */
      .modal-open {
        overflow: hidden !important;
        position: fixed;
        width: 100%;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // ===============================================
  // FUNCIONES DE ALERTAS MEJORADAS
  // ===============================================
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

  // ===============================================
  // FUNCIONES DE LA API CON MANEJO MEJORADO DE ERRORES
  // ===============================================
  const fetchCabins = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_CABANAS, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (Array.isArray(res.data)) {
        setCabins(res.data);
      } else {
        throw new Error("Formato de datos inválido");
      }
    } catch (error) {
      console.error("Error al obtener cabañas:", error);
      handleApiError(error, "cargar las cabañas");
    } finally {
      setLoading(false);
    }
  };

  const fetchSedes = async () => {
    setLoadingSedes(true);
    try {
      const res = await axios.get(API_SEDES, { timeout: 10000 });
      
      if (Array.isArray(res.data)) {
        setSedes(res.data);
      }
    } catch (error) {
      console.error("Error al obtener sedes:", error);
      handleApiError(error, "cargar las sedes");
    } finally {
      setLoadingSedes(false);
    }
  };

  const fetchTemporadas = async () => {
    setLoadingTemporadas(true);
    try {
      const res = await axios.get(API_TEMPORADAS, { timeout: 10000 });
      
      if (Array.isArray(res.data)) {
        setTemporadas(res.data);
      }
    } catch (error) {
      console.error("Error al obtener temporadas:", error);
      handleApiError(error, "cargar las temporadas");
    } finally {
      setLoadingTemporadas(false);
    }
  };

  const fetchTiposCabana = async () => {
    setLoadingTiposCabana(true);
    try {
      const res = await axios.get(API_TIPOS_CABANA, { timeout: 10000 });
      
      if (Array.isArray(res.data)) {
        setTiposCabana(res.data);
      }
    } catch (error) {
      console.error("Error al obtener tipos de cabaña:", error);
      handleApiError(error, "cargar los tipos de cabaña");
    } finally {
      setLoadingTiposCabana(false);
    }
  };

  const fetchComodidades = async () => {
    setLoadingComodidades(true);
    try {
      const res = await axios.get(API_COMODIDADES, { timeout: 10000 });
      
      if (Array.isArray(res.data)) {
        setComodidades(res.data);
      }
    } catch (error) {
      console.error("Error al obtener comodidades:", error);
      handleApiError(error, "cargar las comodidades");
    } finally {
      setLoadingComodidades(false);
    }
  };

  const fetchCabanaComodidades = async () => {
    try {
      const res = await axios.get(API_CABANA_COMODIDADES, { timeout: 10000 });
      
      if (Array.isArray(res.data)) {
        setCabanaComodidades(res.data);
      }
    } catch (error) {
      console.error("Error al obtener relaciones cabaña-comodidades:", error);
    }
  };

  const fetchReservas = async () => {
    try {
      const res = await axios.get(API_RESERVAS, { timeout: 10000 });
      
      if (Array.isArray(res.data)) {
        setReservas(res.data);
      }
    } catch (error) {
      console.error("Error al obtener reservas:", error);
    }
  };

  const fetchImagenes = async () => {
    try {
      const res = await axios.get(API_IMAGENES, { timeout: 10000 });
      
      if (Array.isArray(res.data)) {
        setImagenes(res.data);
      }
    } catch (error) {
      console.error("Error al obtener imágenes:", error);
    }
  };

  // ===============================================
  // FUNCIONES DE FILTRADO MEJORADAS
  // ===============================================
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      sede: '',
      tipo: '',
      estado: '',
      precioMin: '',
      precioMax: '',
      capacidadMin: '',
      capacidadMax: ''
    });
    setCurrentPage(1);
  };

  // Contador de filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.sede) count++;
    if (filters.tipo) count++;
    if (filters.estado !== '') count++;
    if (filters.precioMin) count++;
    if (filters.precioMax) count++;
    if (filters.capacidadMin) count++;
    if (filters.capacidadMax) count++;
    return count;
  }, [filters]);

  // Función para verificar si una cabaña tiene reservas activas
  const tieneReservasActivas = (cabanaId) => {
    return reservas.some(reserva => 
      reserva.idCabana === cabanaId && 
      reserva.estado !== 'Cancelada' && 
      reserva.estado !== 'Finalizada'
    );
  };

  // ===============================================
  // FUNCIONES PARA MANEJO DE IMÁGENES - CORREGIDAS
  // ===============================================
  const { uploadImage, uploadMultipleImages, uploading: cloudinaryUploading, deleteImage: deleteCloudinaryImage } = useCloudinary();

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validar tipos de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      displayAlert("Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)", "error");
      return;
    }

    // Validar tamaño (máximo 5MB por imagen)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      displayAlert("Algunas imágenes son demasiado grandes. El tamaño máximo por imagen es 5MB.", "error");
      return;
    }

    setUploadingImages(true);

    try {
      // Subir imágenes a Cloudinary
      const uploadResults = await uploadMultipleImages(files);
      
      const successfulUploads = uploadResults.filter(result => result.success);
      
      if (successfulUploads.length === 0) {
        displayAlert("Error al subir las imágenes. Inténtalo de nuevo.", "error");
        return;
      }

      // Crear objetos de imagen para previsualización
      const newImages = successfulUploads.map(result => ({
        url: result.url,
        publicId: result.publicId,
        descripcion: `Imagen de ${newCabin.nombre || 'cabaña'}`,
        isNew: true,
        isCloudinary: true
      }));

      setImagenesSeleccionadas(prev => [...prev, ...newImages]);
      displayAlert(`${successfulUploads.length} imagen(es) subida(s) exitosamente`, "success");
      
    } catch (error) {
      console.error("Error en la subida de imágenes:", error);
      displayAlert("Error al subir las imágenes", "error");
    } finally {
      setUploadingImages(false);
      e.target.value = ''; // Reset input
    }
  };

  const removeImage = (index) => {
    setImagenesSeleccionadas(prev => {
      const imageToRemove = prev[index];
      const newImages = [...prev];
      
      // Si la imagen es existente (no nueva), agregarla a la lista de imágenes a eliminar
      if (!imageToRemove.isNew && imageToRemove.idImagen) {
        setImagenesAEliminar(prev => [...prev, imageToRemove]);
      }
      
      // Si la imagen es nueva y de Cloudinary, eliminarla de Cloudinary
      if (imageToRemove.isNew && imageToRemove.isCloudinary && imageToRemove.publicId) {
        deleteCloudinaryImage(imageToRemove.publicId).catch(error => {
          console.error("Error al eliminar imagen de Cloudinary:", error);
        });
      }
      
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const uploadImagesToServer = async (cabanaId) => {
    if (imagenesSeleccionadas.length === 0) return;

    setUploadingImages(true);
    
    try {
      // Filtrar solo las imágenes nuevas que necesitan ser guardadas en tu base de datos
      const nuevasImagenes = imagenesSeleccionadas.filter(img => img.isNew);

      for (const imagen of nuevasImagenes) {
        const imagenData = {
          idCabana: cabanaId,
          rutaImagen: imagen.url, // Ahora usamos la URL de Cloudinary
          descripcion: imagen.descripcion
        };

        await axios.post(API_IMAGENES, imagenData, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 15000
        });
      }
      
      displayAlert("Imágenes guardadas exitosamente", "success");
    } catch (error) {
      console.error("Error al guardar imágenes en la base de datos:", error);
      throw error;
    } finally {
      setUploadingImages(false);
    }
  };

  const deleteImagesFromServer = async () => {
    if (imagenesAEliminar.length === 0) return;

    try {
      for (const imagen of imagenesAEliminar) {
        // Eliminar de la base de datos
        await axios.delete(`${API_IMAGENES}/${imagen.idImagen}`);
        
        // Si la imagen está en Cloudinary, eliminarla de allí también
        if (imagen.isCloudinary && imagen.publicId) {
          await deleteCloudinaryImage(imagen.publicId);
        }
      }
      
      console.log(`${imagenesAEliminar.length} imagen(es) eliminada(s) correctamente`);
    } catch (error) {
      console.error("Error al eliminar imágenes:", error);
      throw error;
    }
  };

  const getImagenesPorCabana = (cabanaId) => {
    return imagenes.filter(img => img.idCabana === cabanaId);
  };

  // ===============================================
  // FUNCIONES DE VALIDACIÓN MEJORADAS
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
    else if (trimmedValue && rules.minLength && trimmedValue.length < rules.minLength) {
      error = rules.errorMessages.minLength;
    }
    else if (trimmedValue && rules.maxLength && trimmedValue.length > rules.maxLength) {
      error = rules.errorMessages.maxLength;
    }
    else if (trimmedValue && rules.pattern && !rules.pattern.test(trimmedValue)) {
      error = rules.errorMessages.pattern;
    }
    // Validaciones numéricas para capacidad
    else if (fieldName === 'capacidad' && trimmedValue) {
      const numericValue = parseInt(trimmedValue);
      
      if (isNaN(numericValue)) {
        error = rules.errorMessages.invalid;
      } else if (rules.min !== undefined && numericValue < rules.min) {
        error = rules.errorMessages.min;
      } else if (rules.max !== undefined && numericValue > rules.max) {
        error = rules.errorMessages.max;
      } else {
        success = "Capacidad válida.";
        
        // Advertencias específicas
        if (numericValue > 10) {
          warning = "Esta cabaña tiene capacidad para muchas personas. Verifique que sea correcto.";
        }
      }
    }
    // Validaciones numéricas para precio
    else if (fieldName === 'precio' && trimmedValue) {
      const numericValue = parseFloat(trimmedValue);
      
      if (isNaN(numericValue)) {
        error = rules.errorMessages.invalid;
      } else if (rules.min !== undefined && numericValue < rules.min) {
        error = rules.errorMessages.min;
      } else if (rules.max !== undefined && numericValue > rules.max) {
        error = rules.errorMessages.max;
      } else {
        success = "Precio válido.";
        
        // Advertencias específicas
        if (numericValue > 5000) {
          warning = "Este precio es bastante alto. Verifique que sea correcto.";
        } else if (numericValue < 50) {
          warning = "Este precio es muy bajo. Verifique que sea correcto.";
        }
      }
    }
    else if (trimmedValue) {
      success = `${fieldName === 'nombre' ? 'Nombre' : fieldName === 'idTipoCabana' ? 'Tipo' : fieldName === 'idSede' ? 'Sede' : fieldName === 'descripcion' ? 'Descripción' : fieldName === 'precio' ? 'Precio' : 'Temporada'} válido.`;
      
      if (fieldName === 'nombre' && trimmedValue.length > 30) {
        warning = "El nombre es bastante largo. Considere un nombre más corto si es posible.";
      } else if (fieldName === 'descripcion' && trimmedValue.length > 300) {
        warning = "La descripción es bastante larga. Considere hacerla más concisa.";
      }
    }

    // Verificación de duplicados para nombre
    if (fieldName === 'nombre' && trimmedValue && !error) {
      const duplicate = cabins.find(cabin => 
        cabin.nombre.toLowerCase() === trimmedValue.toLowerCase() && 
        (!isEditing || cabin.idCabana !== newCabin.idCabana)
      );
      if (duplicate) {
        error = "Ya existe una cabaña con este nombre.";
      }
    }

    setFormErrors(prev => ({ ...prev, [fieldName]: error }));
    setFormSuccess(prev => ({ ...prev, [fieldName]: success }));
    setFormWarnings(prev => ({ ...prev, [fieldName]: warning }));

    return !error;
  };

  const validateForm = () => {
    // Marcar todos los campos como tocados al enviar el formulario
    const allFieldsTouched = {
      nombre: true,
      idTipoCabana: true,
      idSede: true,
      idTemporada: true,
      capacidad: true,
      precio: true,
      descripcion: true
    };
    setTouchedFields(allFieldsTouched);

    const nombreValid = validateField('nombre', newCabin.nombre);
    const tipoValid = validateField('idTipoCabana', newCabin.idTipoCabana);
    const sedeValid = validateField('idSede', newCabin.idSede);
    const temporadaValid = validateField('idTemporada', newCabin.idTemporada);
    const capacidadValid = validateField('capacidad', newCabin.capacidad);
    const precioValid = validateField('precio', newCabin.precio);
    const descripcionValid = validateField('descripcion', newCabin.descripcion);

    const isValid = nombreValid && tipoValid && sedeValid && temporadaValid && capacidadValid && precioValid && descripcionValid;
    
    if (!isValid) {
      displayAlert("Por favor, corrige los errores en el formulario antes de guardar.", "error");
      setTimeout(() => {
        const firstErrorField = document.querySelector('[style*="border-color: #e57373"]');
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }

    return isValid;
  };

  // Función para marcar campo como tocado
  const markFieldAsTouched = (fieldName) => {
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
  };

  const handleAddCabin = async (e) => {
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
      // Preparar datos según el modelo del backend
      const cabinData = {
        nombre: newCabin.nombre,
        idTipoCabana: parseInt(newCabin.idTipoCabana),
        estado: newCabin.estado,
        idTemporada: parseInt(newCabin.idTemporada),
        idSede: parseInt(newCabin.idSede),
        capacidad: parseInt(newCabin.capacidad),
        precio: parseFloat(newCabin.precio),
        descripcion: newCabin.descripcion
      };

      console.log("Enviando datos de cabaña:", cabinData);

      let cabanaId;

      if (isEditing) {
        // Incluir el ID en los datos para la edición
        const updateData = {
          ...cabinData,
          idCabana: parseInt(newCabin.idCabana)
        };
        
        await axios.put(`${API_CABANAS}/${newCabin.idCabana}`, updateData, {
          headers: { 'Content-Type': 'application/json' }
        });
        cabanaId = newCabin.idCabana;
        
        // Eliminar imágenes marcadas para eliminación
        if (imagenesAEliminar.length > 0) {
          await deleteImagesFromServer();
        }
        
        displayAlert("Cabaña actualizada exitosamente.", "success");
      } else {
        const response = await axios.post(API_CABANAS, cabinData, {
          headers: { 'Content-Type': 'application/json' }
        });
        cabanaId = response.data.idCabana;
        displayAlert("Cabaña agregada exitosamente.", "success");
      }

      // Manejar comodidades
      await handleComodidades(cabanaId);
      
      // Manejar imágenes
      if (imagenesSeleccionadas.length > 0) {
        await uploadImagesToServer(cabanaId);
      }
      
      await fetchCabins();
      await fetchCabanaComodidades();
      await fetchImagenes();
      
      // Limpiar lista de imágenes a eliminar después de una edición exitosa
      if (isEditing) {
        setImagenesAEliminar([]);
      }
      
      closeForm();
    } catch (error) {
      console.error("Error al guardar cabaña:", error);
      handleApiError(error, isEditing ? "actualizar la cabaña" : "agregar la cabaña");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleComodidades = async (cabanaId) => {
    try {
      // Eliminar relaciones existentes
      const relacionesExistentes = cabanaComodidades.filter(cc => cc.idCabana === cabanaId);
      for (const relacion of relacionesExistentes) {
        await axios.delete(`${API_CABANA_COMODIDADES}/${relacion.idCabanaComodidades}`);
      }

      // Crear nuevas relaciones
      for (const comodidadId of newCabin.comodidadesSeleccionadas) {
        const relacionData = {
          idCabana: parseInt(cabanaId),
          idComodidades: parseInt(comodidadId)
        };
        await axios.post(API_CABANA_COMODIDADES, relacionData, {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (error) {
      console.error("Error al manejar comodidades:", error);
      throw error;
    }
  };

  const confirmDelete = async () => {
    if (cabinToDelete) {
      // Verificar si la cabaña tiene reservas activas
      if (tieneReservasActivas(cabinToDelete.idCabana)) {
        displayAlert("No se puede eliminar la cabaña porque tiene reservas activas asociadas. Cancele las reservas primero.", "error");
        setCabinToDelete(null);
        setShowDeleteConfirm(false);
        return;
      }

      setLoading(true);
      try {
        // Primero eliminar las imágenes asociadas
        const imagenesCabin = imagenes.filter(img => img.idCabana === cabinToDelete.idCabana);
        for (const imagen of imagenesCabin) {
          // Eliminar de Cloudinary si es necesario
          if (imagen.isCloudinary && imagen.publicId) {
            await deleteCloudinaryImage(imagen.publicId);
          }
          // Eliminar de la base de datos
          await axios.delete(`${API_IMAGENES}/${imagen.idImagen}`);
        }

        // Luego eliminar las relaciones con comodidades
        const relacionesCabin = cabanaComodidades.filter(cc => cc.idCabana === cabinToDelete.idCabana);
        for (const relacion of relacionesCabin) {
          await axios.delete(`${API_CABANA_COMODIDADES}/${relacion.idCabanaComodidades}`);
        }

        // Finalmente eliminar la cabaña
        await axios.delete(`${API_CABANAS}/${cabinToDelete.idCabana}`);
        displayAlert("Cabaña eliminada exitosamente.", "success");
        await fetchCabins();
        await fetchCabanaComodidades();
        await fetchImagenes();
        
        if (paginatedCabins.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("Error al eliminar cabaña:", error);
        
        // Manejo específico para error de integridad referencial
        if (error.response && error.response.status === 409) {
          displayAlert("No se puede eliminar la cabaña porque tiene reservas asociadas. Cancele las reservas primero.", "error");
        } else {
          handleApiError(error, "eliminar la cabaña");
        }
      } finally {
        setLoading(false);
        setCabinToDelete(null);
        setShowDeleteConfirm(false);
      }
    }
  };

  // ===============================================
  // FUNCIONES AUXILIARES MEJORADAS
  // ===============================================
  const handleApiError = (error, operation) => {
    let errorMessage = `Error al ${operation}`;
    let alertType = "error";
    
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      errorMessage = "Error de conexión. Verifica que el servidor esté ejecutándose.";
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = "No se puede conectar al servidor en https://www.bosquesagrado.somee.com";
    } else if (error.response) {
      if (error.response.status === 400) {
        errorMessage = `Error de validación: ${error.response.data?.title || error.response.data?.message || 'Datos inválidos'}`;
      } else if (error.response.status === 404) {
        errorMessage = "Recurso no encontrado.";
      } else if (error.response.status === 409) {
        errorMessage = "Conflicto: La cabaña tiene reservas asociadas y no puede ser eliminada.";
        alertType = "warning";
      } else if (error.response.status === 500) {
        errorMessage = "Error interno del servidor.";
      } else {
        errorMessage = `Error ${error.response.status}: ${error.response.data?.message || 'Error del servidor'}`;
      }
    } else if (error.request) {
      errorMessage = "No hay respuesta del servidor.";
    } else {
      errorMessage = `Error inesperado: ${error.message}`;
    }
    
    setError(errorMessage);
    displayAlert(errorMessage, alertType);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCabin((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Nueva función para manejar el blur (cuando el campo pierde el foco)
  const handleInputBlur = (e) => {
    const { name } = e.target;
    markFieldAsTouched(name);
    validateField(name, newCabin[name]);
  };

  const handleComodidadChange = (comodidadId) => {
    setNewCabin(prev => {
      const comodidadesActuales = [...prev.comodidadesSeleccionadas];
      const index = comodidadesActuales.indexOf(comodidadId);
      
      if (index > -1) {
        comodidadesActuales.splice(index, 1);
      } else {
        comodidadesActuales.push(comodidadId);
      }
      
      return { ...prev, comodidadesSeleccionadas: comodidadesActuales };
    });
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
    setTouchedFields({});
    setImagenesSeleccionadas([]);
    setImagenesAEliminar([]);
    setNewCabin({
      nombre: "",
      idTipoCabana: "",
      estado: true,
      idTemporada: "",
      idSede: "",
      capacidad: 2,
      precio: "",
      descripcion: "",
      comodidadesSeleccionadas: []
    });
  };

  const closeDetailsModal = () => {
    setShowDetails(false);
    setCurrentCabin(null);
  };

  const cancelDelete = () => {
    setCabinToDelete(null);
    setShowDeleteConfirm(false);
  };

  const toggleActive = async (cabin) => {
    setLoading(true);
    try {
      // Enviar todos los campos requeridos según el modelo
      const updatedCabin = { 
        idCabana: cabin.idCabana,
        nombre: cabin.nombre,
        idTipoCabana: cabin.idTipoCabana,
        capacidad: cabin.capacidad,
        estado: !cabin.estado,
        idTemporada: cabin.idTemporada,
        idSede: cabin.idSede,
        precio: cabin.precio || 0,
        descripcion: cabin.descripcion || ""
      };
      
      await axios.put(`${API_CABANAS}/${cabin.idCabana}`, updatedCabin, {
        headers: { 'Content-Type': 'application/json' }
      });
      displayAlert(`Cabaña ${updatedCabin.estado ? 'activada' : 'desactivada'} exitosamente.`, "success");
      await fetchCabins();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      handleApiError(error, "cambiar el estado");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (cabin) => {
    setCurrentCabin(cabin);
    setShowDetails(true);
  };

  const handleEdit = (cabin) => {
    console.log("Editando cabaña:", cabin);
    
    // Cargar datos correctamente para edición
    const comodidadesActuales = cabanaComodidades
      .filter(cc => cc.idCabana === cabin.idCabana)
      .map(cc => cc.idComodidades.toString());

    // Cargar imágenes existentes de la cabaña
    const imagenesExistentes = getImagenesPorCabana(cabin.idCabana).map(img => ({
      ...img,
      url: img.rutaImagen,
      preview: img.rutaImagen,
      isNew: false,
      idImagen: img.idImagen
    }));

    // Asegurar que todos los campos se carguen correctamente
    setNewCabin({
      idCabana: cabin.idCabana,
      nombre: cabin.nombre || "",
      idTipoCabana: cabin.idTipoCabana ? cabin.idTipoCabana.toString() : "",
      estado: cabin.estado !== undefined ? cabin.estado : true,
      idTemporada: cabin.idTemporada ? cabin.idTemporada.toString() : "",
      idSede: cabin.idSede ? cabin.idSede.toString() : "",
      capacidad: cabin.capacidad || 2,
      precio: cabin.precio ? cabin.precio.toString() : "",
      descripcion: cabin.descripcion || "",
      comodidadesSeleccionadas: comodidadesActuales
    });
    
    setImagenesSeleccionadas(imagenesExistentes);
    setImagenesAEliminar([]); // Limpiar imágenes a eliminar al iniciar edición
    setIsEditing(true);
    setShowForm(true);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
    setTouchedFields({});
  };

  const handleDeleteClick = (cabin) => {
    // Verificar si la cabaña tiene reservas activas antes de mostrar el modal de confirmación
    if (tieneReservasActivas(cabin.idCabana)) {
      displayAlert("Esta cabaña tiene reservas activas y no puede ser eliminada. Cancele las reservas primero.", "warning");
      return;
    }
    
    setCabinToDelete(cabin);
    setShowDeleteConfirm(true);
  };

  // ===============================================
  // FUNCIONES DE FILTRADO Y PAGINACIÓN MEJORADAS
  // ===============================================
  const filteredCabins = useMemo(() => {
    let filtered = cabins;

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(cabin =>
        cabin.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (getTipoCabanaNombre(cabin.idTipoCabana)?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cabin.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtro por sede
    if (filters.sede) {
      filtered = filtered.filter(cabin => cabin.idSede === parseInt(filters.sede));
    }

    // Filtro por tipo
    if (filters.tipo) {
      filtered = filtered.filter(cabin => cabin.idTipoCabana === parseInt(filters.tipo));
    }

    // Filtro por estado
    if (filters.estado !== '') {
      const estadoBool = filters.estado === 'true';
      filtered = filtered.filter(cabin => cabin.estado === estadoBool);
    }

    // Filtro por precio mínimo
    if (filters.precioMin) {
      filtered = filtered.filter(cabin => cabin.precio >= parseFloat(filters.precioMin));
    }

    // Filtro por precio máximo
    if (filters.precioMax) {
      filtered = filtered.filter(cabin => cabin.precio <= parseFloat(filters.precioMax));
    }

    // Filtro por capacidad mínima
    if (filters.capacidadMin) {
      filtered = filtered.filter(cabin => cabin.capacidad >= parseInt(filters.capacidadMin));
    }

    // Filtro por capacidad máxima
    if (filters.capacidadMax) {
      filtered = filtered.filter(cabin => cabin.capacidad <= parseInt(filters.capacidadMax));
    }

    return filtered;
  }, [cabins, searchTerm, filters]);

  const totalPages = Math.ceil(filteredCabins.length / ITEMS_PER_PAGE);

  const paginatedCabins = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCabins.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCabins, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ===============================================
  // FUNCIONES PARA OBTENER NOMBRES Y DATOS
  // ===============================================
  const getSedeNombre = (idSede) => {
    const sede = sedes.find(s => s.idSede === idSede);
    return sede ? sede.nombreSede : `Sede ${idSede}`;
  };

  const getTemporadaNombre = (idTemporada) => {
    const temporada = temporadas.find(t => t.idTemporada === idTemporada);
    return temporada ? temporada.nombreTemporada : `Temporada ${idTemporada}`;
  };

  const getTipoCabanaNombre = (idTipoCabana) => {
    const tipo = tiposCabana.find(t => t.idTipoCabana === idTipoCabana);
    return tipo ? tipo.nombreTipoCabana : `Tipo ${idTipoCabana}`;
  };

  const getComodidadesPorCabana = (cabanaId) => {
    const relaciones = cabanaComodidades.filter(cc => cc.idCabana === cabanaId);
    return relaciones.map(relacion => {
      const comodidad = comodidades.find(c => c.idComodidades === relacion.idComodidades);
      return comodidad ? comodidad.nombreComodidades : `Comodidad ${relacion.idComodidades}`;
    });
  };

  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(precio || 0);
  };

  // ===============================================
  // RENDERIZADO
  // ===============================================
  return (
    <div style={{ position: "relative", padding: 20, marginLeft: 260, backgroundColor: "#f5f8f2", minHeight: "100vh" }}>
      
      {/* Alerta Mejorada */}
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
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Panel de error */}
      {error && (
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '10px',
          padding: '15px',
          marginBottom: '20px',
          color: '#856404'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <FaExclamationTriangle />
            <strong>Error de conexión</strong>
          </div>
          <p>{error}</p>
          <div style={{ marginTop: '10px' }}>
            <button
              onClick={fetchCabins}
              style={{
                backgroundColor: '#2E5939',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Reintentar
            </button>
            <button
              onClick={() => setError(null)}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, color: "#2E5939" }}>Gestión de Cabañas</h2>
          <p style={{ margin: "5px 0 0 0", color: "#679750", fontSize: "14px" }}>
            {cabins.length} cabañas registradas • {cabins.filter(c => c.estado).length} activas
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setIsEditing(false);
            setFormErrors({});
            setFormSuccess({});
            setFormWarnings({});
            setTouchedFields({});
            setImagenesSeleccionadas([]);
            setImagenesAEliminar([]);
            setNewCabin({
              nombre: "",
              idTipoCabana: "",
              estado: true,
              idTemporada: "",
              idSede: "",
              capacidad: 2,
              precio: "",
              descripcion: "",
              comodidadesSeleccionadas: []
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
            boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease",
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
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
          <FaPlus /> Agregar Cabaña
        </button>
      </div>

      {/* Estadísticas */}
      {!loading && cabins.length > 0 && (
        <div style={{
          marginBottom: '25px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <div style={{
            backgroundColor: '#E8F5E8',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '2px solid #679750',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease'
          }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2E5939', marginBottom: '8px' }}>
              {cabins.length}
            </div>
            <div style={{ fontSize: '16px', color: '#679750', fontWeight: '600' }}>
              Total Cabañas
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#E8F5E8',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '2px solid #4caf50',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease'
          }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2E5939', marginBottom: '8px' }}>
              {cabins.filter(c => c.estado).length}
            </div>
            <div style={{ fontSize: '16px', color: '#4caf50', fontWeight: '600' }}>
              Cabañas Activas
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#E8F5E8',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '2px solid #e57373',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease'
          }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2E5939', marginBottom: '8px' }}>
              {cabins.filter(c => !c.estado).length}
            </div>
            <div style={{ fontSize: '16px', color: '#e57373', fontWeight: '600' }}>
              Cabañas Inactivas
            </div>
          </div>

          <div style={{
            backgroundColor: '#E8F5E8',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '2px solid #2196f3',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease'
          }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2E5939', marginBottom: '8px' }}>
              {filteredCabins.length}
            </div>
            <div style={{ fontSize: '16px', color: '#2196f3', fontWeight: '600' }}>
              Resultados Filtrados
            </div>
          </div>
        </div>
      )}

      {/* Barra de búsqueda y filtros - MEJORADO CON BOTÓN AL LADO */}
      <div style={{ 
        marginBottom: '20px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {/* Búsqueda principal CON BOTÓN DE FILTROS AL LADO */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: showFilters ? '15px' : '0'
        }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 400 }}>
            <FaSearch style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#2E5939" }} />
            <input
              type="text"
              placeholder="Buscar por nombre, tipo o descripción..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: "12px 12px 12px 40px",
                borderRadius: 10,
                border: "1px solid #ccc",
                width: "100%",
                backgroundColor: "#F7F4EA",
                color: "#2E5939",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />
          </div>

          {/* Botón para mostrar/ocultar filtros avanzados - AL LADO DE LA BÚSQUEDA */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              backgroundColor: activeFiltersCount > 0 ? "#4caf50" : "#2E5939",
              color: "white",
              padding: "10px 15px",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: "600",
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              marginLeft: '50px'
            }}
          >
            <FaSlidersH />
            Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>

          {/* Mostrar filtros activos */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              style={{
                backgroundColor: "transparent",
                color: "#e57373",
                padding: "8px 12px",
                border: "1px solid #e57373",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: "600",
                fontSize: '14px'
              }}
            >
              Limpiar Filtros
            </button>
          )}
        </div>

        {/* Filtros avanzados */}
        {showFilters && (
          <div style={{
            padding: '15px',
            backgroundColor: '#FBFDF9',
            borderRadius: '8px',
            border: '1px solid rgba(103,151,80,0.2)',
            animation: 'slideDown 0.3s ease-out'
          }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#2E5939', fontSize: '16px' }}>
              Filtros Avanzados
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px'
            }}>
              {/* Filtro por sede */}
              <div>
                <label style={labelStyle}>Sede</label>
                <select
                  name="sede"
                  value={filters.sede}
                  onChange={handleFilterChange}
                  style={{
                    ...inputStyle,
                    width: '100%'
                  }}
                >
                  <option value="">Todas las sedes</option>
                  {sedes.map(sede => (
                    <option key={sede.idSede} value={sede.idSede}>
                      {sede.nombreSede}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por tipo */}
              <div>
                <label style={labelStyle}>Tipo de Cabaña</label>
                <select
                  name="tipo"
                  value={filters.tipo}
                  onChange={handleFilterChange}
                  style={{
                    ...inputStyle,
                    width: '100%'
                  }}
                >
                  <option value="">Todos los tipos</option>
                  {tiposCabana.map(tipo => (
                    <option key={tipo.idTipoCabana} value={tipo.idTipoCabana}>
                      {tipo.nombreTipoCabana}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por estado */}
              <div>
                <label style={labelStyle}>Estado</label>
                <select
                  name="estado"
                  value={filters.estado}
                  onChange={handleFilterChange}
                  style={{
                    ...inputStyle,
                    width: '100%'
                  }}
                >
                  <option value="">Todos los estados</option>
                  <option value="true">Activas</option>
                  <option value="false">Inactivas</option>
                </select>
              </div>

              {/* Filtro por precio mínimo */}
              <div>
                <label style={labelStyle}>Precio Mínimo</label>
                <div style={{ position: 'relative' }}>
                  <FaDollarSign style={{ 
                    position: "absolute", 
                    left: 12, 
                    top: "50%", 
                    transform: "translateY(-50%)", 
                    color: "#2E5939",
                    fontSize: '14px'
                  }} />
                  <input
                    type="number"
                    name="precioMin"
                    placeholder="0.00"
                    value={filters.precioMin}
                    onChange={handleFilterChange}
                    style={{
                      ...inputStyle,
                      paddingLeft: '30px'
                    }}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Filtro por precio máximo */}
              <div>
                <label style={labelStyle}>Precio Máximo</label>
                <div style={{ position: 'relative' }}>
                  <FaDollarSign style={{ 
                    position: "absolute", 
                    left: 12, 
                    top: "50%", 
                    transform: "translateY(-50%)", 
                    color: "#2E5939",
                    fontSize: '14px'
                  }} />
                  <input
                    type="number"
                    name="precioMax"
                    placeholder="10000.00"
                    value={filters.precioMax}
                    onChange={handleFilterChange}
                    style={{
                      ...inputStyle,
                      paddingLeft: '30px'
                    }}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Filtro por capacidad mínima */}
              <div>
                <label style={labelStyle}>Capacidad Mínima</label>
                <div style={{ position: 'relative' }}>
                  <FaUsers style={{ 
                    position: "absolute", 
                    left: 12, 
                    top: "50%", 
                    transform: "translateY(-50%)", 
                    color: "#2E5939",
                    fontSize: '14px'
                  }} />
                  <input
                    type="number"
                    name="capacidadMin"
                    placeholder="1"
                    value={filters.capacidadMin}
                    onChange={handleFilterChange}
                    style={{
                      ...inputStyle,
                      paddingLeft: '30px'
                    }}
                    min="1"
                    max="20"
                  />
                </div>
              </div>

              {/* Filtro por capacidad máxima */}
              <div>
                <label style={labelStyle}>Capacidad Máxima</label>
                <div style={{ position: 'relative' }}>
                  <FaUsers style={{ 
                    position: "absolute", 
                    left: 12, 
                    top: "50%", 
                    transform: "translateY(-50%)", 
                    color: "#2E5939",
                    fontSize: '14px'
                  }} />
                  <input
                    type="number"
                    name="capacidadMax"
                    placeholder="20"
                    value={filters.capacidadMax}
                    onChange={handleFilterChange}
                    style={{
                      ...inputStyle,
                      paddingLeft: '30px'
                    }}
                    min="1"
                    max="20"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Información de resultados filtrados */}
        {filteredCabins.length !== cabins.length && (
          <div style={{
            marginTop: '10px',
            padding: '8px 12px',
            backgroundColor: '#E8F5E8',
            borderRadius: '6px',
            color: '#2E5939',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Mostrando {filteredCabins.length} de {cabins.length} cabañas
            {activeFiltersCount > 0 && ` (filtros aplicados: ${activeFiltersCount})`}
          </div>
        )}
      </div>

      {/* Formulario de agregar/editar - CON ORDEN CORREGIDO */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={{...modalContentStyle, maxWidth: 700}}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939", textAlign: 'center' }}>
                {isEditing ? "Editar Cabaña" : "Agregar Nueva Cabaña"}
              </h2>
              <button
                onClick={closeForm}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2E5939",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
                title="Cerrar"
                disabled={isSubmitting}
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleAddCabin}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px 20px', marginBottom: '20px' }}>
                {/* ORDEN CORREGIDO: Sede primero */}
                <FormField
                  label="Sede"
                  name="idSede"
                  type="select"
                  value={newCabin.idSede}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  error={formErrors.idSede}
                  success={formSuccess.idSede}
                  warning={formWarnings.idSede}
                  options={sedes.map(sede => ({ 
                    value: sede.idSede.toString(), 
                    label: sede.nombreSede 
                  }))}
                  required={true}
                  disabled={loadingSedes || sedes.length === 0}
                  placeholder="Selecciona una sede"
                  touched={touchedFields.idSede}
                />

                {/* Tipo de Cabaña */}
                <FormField
                  label="Tipo de Cabaña"
                  name="idTipoCabana"
                  type="select"
                  value={newCabin.idTipoCabana}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  error={formErrors.idTipoCabana}
                  success={formSuccess.idTipoCabana}
                  warning={formWarnings.idTipoCabana}
                  options={tiposCabana.map(tipo => ({ 
                    value: tipo.idTipoCabana.toString(), 
                    label: tipo.nombreTipoCabana 
                  }))}
                  required={true}
                  disabled={loadingTiposCabana || tiposCabana.length === 0}
                  placeholder="Selecciona un tipo"
                  touched={touchedFields.idTipoCabana}
                />

                {/* Nombre - Ahora ocupa toda la fila */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <FormField
                    label="Nombre de la Cabaña"
                    name="nombre"
                    value={newCabin.nombre}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    error={formErrors.nombre}
                    success={formSuccess.nombre}
                    warning={formWarnings.nombre}
                    required={true}
                    disabled={loading}
                    maxLength={VALIDATION_RULES.nombre.maxLength}
                    showCharCount={true}
                    placeholder="Ej: Mykonos, Paraíso, Cabaña Familiar"
                    touched={touchedFields.nombre}
                  />
                </div>

                {/* Descripción - Ahora ocupa toda la fila */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <FormField
                    label="Descripción de la Cabaña"
                    name="descripcion"
                    value={newCabin.descripcion}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    error={formErrors.descripcion}
                    success={formSuccess.descripcion}
                    warning={formWarnings.descripcion}
                    required={true}
                    disabled={loading}
                    maxLength={VALIDATION_RULES.descripcion.maxLength}
                    showCharCount={true}
                    placeholder="Describe las características, ubicación, vistas y comodidades especiales de la cabaña..."
                    touched={touchedFields.descripcion}
                    textarea={true}
                    rows={4}
                  />
                </div>

                {/* Resto de campos */}
                <FormField
                  label="Temporada"
                  name="idTemporada"
                  type="select"
                  value={newCabin.idTemporada}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  error={formErrors.idTemporada}
                  success={formSuccess.idTemporada}
                  warning={formWarnings.idTemporada}
                  options={temporadas.map(temp => ({ 
                    value: temp.idTemporada.toString(), 
                    label: `${temp.nombreTemporada} ($${temp.precio || '0'})` 
                  }))}
                  required={true}
                  disabled={loadingTemporadas || temporadas.length === 0}
                  placeholder="Selecciona una temporada"
                  touched={touchedFields.idTemporada}
                />

                <FormField
                  label="Precio por Noche"
                  name="precio"
                  type="number"
                  value={newCabin.precio}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  error={formErrors.precio}
                  success={formSuccess.precio}
                  warning={formWarnings.precio}
                  required={true}
                  disabled={loading}
                  min={VALIDATION_RULES.precio.min}
                  max={VALIDATION_RULES.precio.max}
                  step="0.01"
                  placeholder="Ej: 150.00, 299.99"
                  touched={touchedFields.precio}
                />

                <div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={labelStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaUsers />
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <span>Capacidad de Personas</span>
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      </div>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        name="capacidad"
                        value={newCabin.capacidad}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        style={{
                          ...inputStyle,
                          border: `1px solid ${touchedFields.capacidad && formErrors.capacidad ? '#e57373' : touchedFields.capacidad && formSuccess.capacidad ? '#4caf50' : touchedFields.capacidad && formWarnings.capacidad ? '#ff9800' : '#ccc'}`,
                          borderLeft: `4px solid ${touchedFields.capacidad && formErrors.capacidad ? '#e57373' : touchedFields.capacidad && formSuccess.capacidad ? '#4caf50' : touchedFields.capacidad && formWarnings.capacidad ? '#ff9800' : '#ccc'}`,
                          paddingRight: '60px'
                        }}
                        required={true}
                        disabled={loading}
                        min={VALIDATION_RULES.capacidad.min}
                        max={VALIDATION_RULES.capacidad.max}
                        step="1"
                        placeholder="Ej: 2, 4, 6..."
                      />
                      <div style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#679750',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>
                        personas
                      </div>
                    </div>
                    {touchedFields.capacidad && formErrors.capacidad && (
                      <div style={errorValidationStyle}>
                        <FaExclamationTriangle size={12} />
                        {formErrors.capacidad}
                      </div>
                    )}
                    {touchedFields.capacidad && formSuccess.capacidad && !formErrors.capacidad && (
                      <div style={successValidationStyle}>
                        <FaCheck size={12} />
                        {formSuccess.capacidad}
                      </div>
                    )}
                    {touchedFields.capacidad && formWarnings.capacidad && !formErrors.capacidad && (
                      <div style={warningValidationStyle}>
                        <FaInfoCircle size={12} />
                        {formWarnings.capacidad}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Gestión de Imágenes - MEJORADA */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>
                  Imágenes de la Cabaña
                  <span style={{ color: '#679750', fontSize: '0.8rem', marginLeft: '8px' }}>
                    (Puedes subir múltiples imágenes)
                  </span>
                </label>
                
                {/* Área de subida de imágenes */}
                <div 
                  style={imageUploadStyle}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.backgroundColor = '#E8F5E8';
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.backgroundColor = '#F7F4EA';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.backgroundColor = '#F7F4EA';
                    handleImageUpload({ target: { files: e.dataTransfer.files } });
                  }}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <label 
                    htmlFor="image-upload"
                    style={{ 
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <FaUpload size={30} color="#679750" />
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#2E5939', marginBottom: '5px' }}>
                        Haz clic o arrastra imágenes aquí
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#679750' }}>
                        Formatos: JPEG, PNG, GIF, WebP (Máx. 5MB por imagen)
                      </div>
                    </div>
                  </label>
                </div>

                {/* Previsualización de imágenes */}
                {imagenesSeleccionadas.length > 0 && (
                  <div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '10px'
                    }}>
                      <span style={{ fontWeight: '600', color: '#2E5939' }}>
                        Imágenes seleccionadas ({imagenesSeleccionadas.length})
                        {imagenesAEliminar.length > 0 && (
                          <span style={{ 
                            color: '#e57373', 
                            fontSize: '0.8rem', 
                            marginLeft: '10px',
                            fontWeight: 'normal'
                          }}>
                            ({imagenesAEliminar.length} marcadas para eliminar)
                          </span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          // Si estamos editando, marcar todas las imágenes existentes para eliminación
                          if (isEditing) {
                            const imagenesExistentes = imagenesSeleccionadas.filter(img => !img.isNew);
                            setImagenesAEliminar(prev => [...prev, ...imagenesExistentes]);
                          }
                          setImagenesSeleccionadas([]);
                        }}
                        style={{
                          background: '#e57373',
                          color: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Eliminar todas
                      </button>
                    </div>
                    <div style={imagePreviewContainerStyle}>
                      {imagenesSeleccionadas.map((imagen, index) => (
                        <div key={index} style={imagePreviewStyle}>
                          <img 
                            src={imagen.url || imagen.preview} 
                            alt={`Preview ${index + 1}`}
                            style={imageStyle}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            style={imageRemoveButtonStyle}
                            title="Eliminar imagen"
                          >
                            <FaTimes size={10} />
                          </button>
                          {!imagen.isNew && (
                            <div style={{
                              position: 'absolute',
                              bottom: '5px',
                              left: '5px',
                              background: 'rgba(46, 89, 57, 0.8)',
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10px'
                            }}>
                              Existente
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Selección de Comodidades */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>
                  Comodidades Disponibles
                  <span style={{ color: '#679750', fontSize: '0.8rem', marginLeft: '8px' }}>
                    (Selecciona las comodidades que tendrá esta cabaña)
                  </span>
                </label>
                <div style={{ 
                  border: '1px solid #ccc', 
                  borderRadius: '8px', 
                  padding: '15px',
                  backgroundColor: '#F7F4EA',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {loadingComodidades ? (
                    <div style={{ textAlign: 'center', color: '#679750' }}>Cargando comodidades...</div>
                  ) : comodidades.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#666' }}>No hay comodidades disponibles</div>
                  ) : (
                    comodidades.map(comodidad => (
                      <div key={comodidad.idComodidades} style={{ marginBottom: '10px' }}>
                        <label style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px', 
                          cursor: 'pointer'
                        }}>
                          <input
                            type="checkbox"
                            checked={newCabin.comodidadesSeleccionadas.includes(comodidad.idComodidades.toString())}
                            onChange={() => handleComodidadChange(comodidad.idComodidades.toString())}
                          />
                          <span style={{ color: '#2E5939' }}>
                            {comodidad.nombreComodidades}
                          </span>
                        </label>
                      </div>
                    ))
                  )}
                </div>
                {newCabin.comodidadesSeleccionadas.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={successValidationStyle}>
                      <FaCheck size={12} />
                      {newCabin.comodidadesSeleccionadas.length} comodidad(es) seleccionada(s)
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <button
                  type="submit"
                  disabled={loading || isSubmitting || uploadingImages}
                  style={{
                    backgroundColor: (loading || isSubmitting || uploadingImages) ? "#ccc" : "#2E5939",
                    color: "#fff",
                    padding: "12px 25px",
                    border: "none",
                    borderRadius: 10,
                    cursor: (loading || isSubmitting || uploadingImages) ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    flex: 1,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    if (!loading && !isSubmitting && !uploadingImages) {
                      e.target.style.background = "linear-gradient(90deg, #67d630, #95d34e)";
                      e.target.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loading && !isSubmitting && !uploadingImages) {
                      e.target.style.background = "#2E5939";
                      e.target.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {uploadingImages ? "Subiendo imágenes..." : 
                   loading ? "Guardando..." : 
                   (isEditing ? "Actualizar Cabaña" : "Guardar Cabaña")}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={loading || isSubmitting || uploadingImages}
                  style={{
                    backgroundColor: "#ccc",
                    color: "#333",
                    padding: "12px 25px",
                    border: "none",
                    borderRadius: 10,
                    cursor: (loading || isSubmitting || uploadingImages) ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    flex: 1,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
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
      {showDetails && currentCabin && (
        <div style={modalOverlayStyle}>
          <div style={detailsModalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939", textAlign: 'center' }}>Detalles de la Cabaña</h2>
              <button
                onClick={closeDetailsModal}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2E5939",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
                title="Cerrar"
              >
                <FaTimes />
              </button>
            </div>
            
            <div>
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>ID</div>
                <div style={detailValueStyle}>#{currentCabin.idCabana}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Nombre</div>
                <div style={detailValueStyle}>{currentCabin.nombre}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Tipo</div>
                <div style={detailValueStyle}>{getTipoCabanaNombre(currentCabin.idTipoCabana)}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Sede</div>
                <div style={detailValueStyle}>{getSedeNombre(currentCabin.idSede)}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Temporada</div>
                <div style={detailValueStyle}>{getTemporadaNombre(currentCabin.idTemporada)}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaDollarSign />
                    Precio por Noche
                  </div>
                </div>
                <div style={detailValueStyle}>
                  <span style={{ 
                    backgroundColor: '#E8F5E8',
                    color: '#2E5939',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {formatPrecio(currentCabin.precio)}
                  </span>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaUsers />
                    Capacidad
                  </div>
                </div>
                <div style={detailValueStyle}>
                  <span style={{ 
                    backgroundColor: '#E8F5E8',
                    color: '#2E5939',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {currentCabin.capacidad || 2} persona(s)
                  </span>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Descripción</div>
                <div style={{
                  ...detailValueStyle,
                  lineHeight: '1.6',
                  backgroundColor: '#F7F4EA',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid #E8F5E8'
                }}>
                  {currentCabin.descripcion || (
                    <span style={{ color: '#999', fontStyle: 'italic' }}>
                      No hay descripción disponible para esta cabaña.
                    </span>
                  )}
                </div>
              </div>

              {/* Galería de imágenes */}
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>
                  Imágenes
                  <span style={{ marginLeft: '10px', color: '#679750', fontSize: '0.8rem', fontWeight: 'normal' }}>
                    ({getImagenesPorCabana(currentCabin.idCabana).length} imágenes)
                  </span>
                </div>
                <div style={detailValueStyle}>
                  {getImagenesPorCabana(currentCabin.idCabana).length > 0 ? (
                    <div style={imageGalleryStyle}>
                      {getImagenesPorCabana(currentCabin.idCabana).map((imagen) => (
                        <div key={imagen.idImagen} style={imagePreviewStyle}>
                          <img 
                            src={imagen.rutaImagen} 
                            alt={imagen.descripcion}
                            style={galleryImageStyle}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/150x120/679750/FFFFFF?text=Imagen+No+Disponible';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: '#999', fontStyle: 'italic' }}>No hay imágenes registradas</span>
                  )}
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Comodidades</div>
                <div style={detailValueStyle}>
                  {getComodidadesPorCabana(currentCabin.idCabana).length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                      {getComodidadesPorCabana(currentCabin.idCabana).map((comodidad, index) => (
                        <span key={index} style={comodidadTagStyle}>
                          <FaChair size={10} /> {comodidad}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: '#999', fontStyle: 'italic' }}>No tiene comodidades asignadas</span>
                  )}
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Estado</div>
                <div style={{
                  ...detailValueStyle,
                  color: currentCabin.estado ? '#4caf50' : '#e57373',
                  fontWeight: 'bold'
                }}>
                  {currentCabin.estado ? '🟢 Activa' : '🔴 Inactiva'}
                </div>
              </div>

              {/* Información de reservas activas */}
              {tieneReservasActivas(currentCabin.idCabana) && (
                <div style={detailItemStyle}>
                  <div style={detailLabelStyle}>Reservas Activas</div>
                  <div style={{
                    ...detailValueStyle,
                    color: '#ff9800',
                    fontWeight: 'bold'
                  }}>
                    ⚠️ Esta cabaña tiene reservas activas
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
              <button
                onClick={closeDetailsModal}
                style={{
                  backgroundColor: "#2E5939",
                  color: "#fff",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontWeight: "600",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
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
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteConfirm && cabinToDelete && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 450, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 20, color: "#2E5939" }}>Confirmar Eliminación</h3>
            <p style={{ marginBottom: 30, fontSize: '1.1rem', color: "#2E5939" }}>
              ¿Estás seguro de eliminar la cabaña "<strong>{cabinToDelete.nombre}</strong>"?
            </p>
            
            {/* Advertencia sobre comodidades e imágenes */}
            <div style={{ 
              backgroundColor: '#fff3cd', 
              border: '1px solid #ffeaa7',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <FaInfoCircle style={{ color: '#856404' }} />
                <strong style={{ color: '#856404' }}>Importante</strong>
              </div>
              <p style={{ color: '#856404', margin: 0, fontSize: '0.9rem' }}>
                Esta acción eliminará permanentemente la cabaña, todas sus imágenes y relaciones con comodidades.
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 15 }}>
              <button
                onClick={confirmDelete}
                disabled={loading}
                style={{
                  backgroundColor: loading ? "#ccc" : "#e57373",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: 10,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                }}
              >
                {loading ? "Eliminando..." : "Sí, Eliminar"}
              </button>
              <button
                onClick={cancelDelete}
                disabled={loading}
                style={{
                  backgroundColor: loading ? "#ccc" : "#2E5939",
                  color: "#fff",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: 10,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.background = "linear-gradient(90deg, #67d630, #95d34e)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading) {
                    e.target.style.background = "#2E5939";
                  }
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Loading */}
        {loading && (
          <div style={{ 
            textAlign: "center", 
            padding: "40px", 
            color: "#2E5939"
          }}>
            <div style={{ fontSize: '18px', marginBottom: '10px' }}>
              🔄 Cargando cabañas...
            </div>
          </div>
        )}

        {/* Tabla */}
        {!loading && (
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#fff",
            color: "#2E5939",
          }}>
            <thead>
              <tr style={{ backgroundColor: "#679750", color: "#fff" }}>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Nombre</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Tipo</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Sede</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Temporada</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Precio</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Capacidad</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Imágenes</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Comodidades</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Estado</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCabins.length === 0 && !loading ? (
                <tr>
                  <td colSpan={10} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <FaInfoCircle size={30} color="#679750" />
                      {cabins.length === 0 ? "No hay cabañas registradas" : "No se encontraron resultados"}
                      {cabins.length === 0 && (
                        <button
                          onClick={() => setShowForm(true)}
                          style={{
                            backgroundColor: "#2E5939",
                            color: "white",
                            padding: "8px 16px",
                            border: "none",
                            borderRadius: 8,
                            cursor: "pointer",
                            fontWeight: "600",
                            marginTop: '10px'
                          }}
                        >
                          <FaPlus style={{ marginRight: '5px' }} />
                          Agregar Primera Cabaña
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCabins.map((cabin) => (
                  <tr key={cabin.idCabana} style={{ 
                    borderBottom: "1px solid #eee",
                    backgroundColor: cabin.estado ? '#fff' : '#f9f9f9'
                  }}>
                    <td style={{ padding: "15px", fontWeight: "500" }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {cabin.nombre}
                        {tieneReservasActivas(cabin.idCabana) && (
                          <span style={{
                            backgroundColor: '#fff3cd',
                            color: '#856404',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: 'bold'
                          }} title="Tiene reservas activas">
                            📅
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "15px" }}>{getTipoCabanaNombre(cabin.idTipoCabana)}</td>
                    <td style={{ padding: "15px" }}>{getSedeNombre(cabin.idSede)}</td>
                    <td style={{ padding: "15px", textAlign: "center" }}>{getTemporadaNombre(cabin.idTemporada)}</td>
                    <td style={{ padding: "15px", textAlign: "center", fontWeight: "600", color: "#2E5939" }}>
                      {formatPrecio(cabin.precio)}
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                        <FaUsers color="#679750" />
                        <span style={{ 
                          backgroundColor: '#E8F5E8',
                          color: '#2E5939',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {cabin.capacidad || 2}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                        <FaImage color="#679750" />
                        <span style={{ 
                          backgroundColor: '#E8F5E8',
                          color: '#2E5939',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {getImagenesPorCabana(cabin.idCabana).length}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', justifyContent: 'center' }}>
                        {getComodidadesPorCabana(cabin.idCabana).slice(0, 3).map((comodidad, index) => (
                          <span key={index} style={comodidadTagStyle}>
                            <FaChair size={8} /> {comodidad}
                          </span>
                        ))}
                        {getComodidadesPorCabana(cabin.idCabana).length > 3 && (
                          <span style={{
                            ...comodidadTagStyle,
                            backgroundColor: '#F7F4EA'
                          }}>
                            +{getComodidadesPorCabana(cabin.idCabana).length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <button
                        onClick={() => toggleActive(cabin)}
                        disabled={loading}
                        style={{
                          cursor: loading ? "not-allowed" : "pointer",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          border: "none",
                          backgroundColor: cabin.estado ? "#4caf50" : "#e57373",
                          color: "white",
                          fontWeight: "600",
                          fontSize: "12px",
                          minWidth: "80px",
                          opacity: loading ? 0.6 : 1,
                          transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) => {
                          if (!loading) {
                            e.target.style.transform = "scale(1.05)";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!loading) {
                            e.target.style.transform = "scale(1)";
                          }
                        }}
                      >
                        {cabin.estado ? "Activa" : "Inactiva"}
                      </button>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                        <button
                          onClick={() => handleView(cabin)}
                          style={btnAccion("#F7F4EA", "#2E5939")}
                          title="Ver Detalles"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(cabin)}
                          style={btnAccion("#F7F4EA", "#2E5939")}
                          title="Editar Cabaña"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(cabin)}
                          style={{
                            ...btnAccion("#fbe9e7", "#e57373"),
                            opacity: tieneReservasActivas(cabin.idCabana) ? 0.5 : 1,
                            cursor: tieneReservasActivas(cabin.idCabana) ? "not-allowed" : "pointer"
                          }}
                          title={tieneReservasActivas(cabin.idCabana) ? "No se puede eliminar - Tiene reservas activas" : "Eliminar Cabaña"}
                          disabled={tieneReservasActivas(cabin.idCabana)}
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
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 10 }}>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            style={navBtnStyle(currentPage === 1)}
          >
            Anterior
          </button>
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => goToPage(page)}
                style={pageBtnStyle(currentPage === page)}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={navBtnStyle(currentPage === totalPages)}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default Cabins;