// src/components/Cabins.jsx
import { FaEye, FaEdit, FaTrash, FaTimes, FaExclamationTriangle, FaPlus, FaChair, FaCheck, FaInfoCircle, FaSearch, FaImage, FaUpload, FaCamera, FaUsers } from "react-icons/fa";
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";

// ===============================================
// ESTILOS MEJORADOS PARA ALERTAS
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
  maxWidth: 700,
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
  marginBottom: 5,
  fontSize: "14px"
};

const detailValueStyle = {
  fontSize: 16,
  color: "#2E5939",
  fontWeight: "500"
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
  // Solo letras y espacios, sin números ni caracteres especiales
  nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  tipoCabana: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
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
      pattern: "El nombre contiene caracteres no permitidos. Solo se permiten letras, números, espacios, guiones y guiones bajos."
    }
  },
  tipoCabana: {
    required: true,
    pattern: VALIDATION_PATTERNS.tipoCabana,
    errorMessages: {
      required: "El tipo de cabaña es obligatorio.",
      pattern: "Tipo de cabaña no válido."
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
  cantidadPersonas: {
    min: 1,
    max: 20,
    required: true,
    errorMessages: {
      required: "La cantidad de personas es obligatoria.",
      min: "La cantidad mínima es 1 persona.",
      max: "La cantidad máxima es 20 personas.",
      invalid: "La cantidad debe ser un número entero válido."
    }
  }
};

// ===============================================
// DATOS DE CONFIGURACIÓN
// ===============================================
const API_CABANAS = "http://localhost:5255/api/Cabanas";
const API_SEDES = "http://localhost:5255/api/Sede";
const API_TEMPORADAS = "http://localhost:5255/api/Temporada";
const API_COMODIDADES = "http://localhost:5255/api/Comodidades";
const API_CABANA_COMODIDADES = "http://localhost:5255/api/CabanaPorComodidades";
const API_RESERVAS = "http://localhost:5255/api/Reserva";
const API_IMAGENES = "http://localhost:5255/api/ImgCabana";

const tiposCabana = ["Familiar", "Pareja", "Individual", "Lujo", "Económica"];

const ITEMS_PER_PAGE = 10;

// ===============================================
// COMPONENTE FormField PARA CABAÑAS
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
  maxLength,
  placeholder,
  showCharCount = false,
  min,
  max,
  step
}) => {
  const finalOptions = useMemo(() => {
    if (type === "select") {
      const placeholderOption = { value: "", label: "Seleccionar", disabled: required };
      return [placeholderOption, ...options];
    }
    return options;
  }, [options, type, required]);

  const handleFilteredInputChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (name === 'nombre') {
      // Solo letras y espacios
      filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    } else if (name === 'cantidadPersonas') {
      // Solo números enteros positivos
      filteredValue = value.replace(/[^0-9]/g, "");
      if (filteredValue && parseInt(filteredValue) > (max || 20)) {
        filteredValue = max || "20";
      }
    } else {
      filteredValue = value;
    }
    
    onChange({ target: { name, value: filteredValue } });
  };

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
            onChange={handleFilteredInputChange}
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
// COMPONENTE PRINCIPAL Cabins CON MANEJO MEJORADO DE ALERTAS
// ===============================================
const Cabins = () => {
  const [cabins, setCabins] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [temporadas, setTemporadas] = useState([]);
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
  const [loadingComodidades, setLoadingComodidades] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState({});
  const [formWarnings, setFormWarnings] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [newCabin, setNewCabin] = useState({
    nombre: "",
    tipoCabana: "Familiar",
    estado: true,
    idTemporada: "",
    idSede: "",
    cantidadPersonas: 2, // Valor por defecto
    comodidadesSeleccionadas: []
  });

  const [imagenesSeleccionadas, setImagenesSeleccionadas] = useState([]);

  // ===============================================
  // EFECTOS
  // ===============================================
  useEffect(() => {
    fetchCabins();
    fetchSedes();
    fetchTemporadas();
    fetchComodidades();
    fetchCabanaComodidades();
    fetchReservas();
    fetchImagenes();
  }, []);

  // Validar formulario en tiempo real
  useEffect(() => {
    if (showForm) {
      validateField('nombre', newCabin.nombre);
      validateField('tipoCabana', newCabin.tipoCabana);
      validateField('idSede', newCabin.idSede);
      validateField('idTemporada', newCabin.idTemporada);
      validateField('cantidadPersonas', newCabin.cantidadPersonas);
    }
  }, [newCabin, showForm]);

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
    // Validaciones numéricas para cantidadPersonas
    else if (fieldName === 'cantidadPersonas' && trimmedValue) {
      const numericValue = parseInt(trimmedValue);
      
      if (isNaN(numericValue)) {
        error = rules.errorMessages.invalid;
      } else if (rules.min !== undefined && numericValue < rules.min) {
        error = rules.errorMessages.min;
      } else if (rules.max !== undefined && numericValue > rules.max) {
        error = rules.errorMessages.max;
      } else {
        success = "Cantidad de personas válida.";
        
        // Advertencias específicas
        if (numericValue > 10) {
          warning = "Esta cabaña tiene capacidad para muchas personas. Verifique que sea correcto.";
        } else if (numericValue === 1 && newCabin.tipoCabana === "Familiar") {
          warning = "Las cabañas familiares suelen tener capacidad para más de 1 persona.";
        }
      }
    }
    else if (trimmedValue) {
      success = `${fieldName === 'nombre' ? 'Nombre' : fieldName === 'tipoCabana' ? 'Tipo' : fieldName === 'idSede' ? 'Sede' : 'Temporada'} válido.`;
      
      if (fieldName === 'nombre' && trimmedValue.length > 30) {
        warning = "El nombre es bastante largo. Considere un nombre más corto si es posible.";
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
    const nombreValid = validateField('nombre', newCabin.nombre);
    const tipoValid = validateField('tipoCabana', newCabin.tipoCabana);
    const sedeValid = validateField('idSede', newCabin.idSede);
    const temporadaValid = validateField('idTemporada', newCabin.idTemporada);
    const cantidadPersonasValid = validateField('cantidadPersonas', newCabin.cantidadPersonas);

    const isValid = nombreValid && tipoValid && sedeValid && temporadaValid && cantidadPersonasValid;
    
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
        if (res.data.length > 0 && !newCabin.idSede) {
          setNewCabin(prev => ({ ...prev, idSede: res.data[0].idSede.toString() }));
        }
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
        if (res.data.length > 0 && !newCabin.idTemporada) {
          setNewCabin(prev => ({ ...prev, idTemporada: res.data[0].idTemporada.toString() }));
        }
      }
    } catch (error) {
      console.error("Error al obtener temporadas:", error);
      handleApiError(error, "cargar las temporadas");
    } finally {
      setLoadingTemporadas(false);
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

  // Función para verificar si una cabaña tiene reservas activas
  const tieneReservasActivas = (cabanaId) => {
    return reservas.some(reserva => 
      reserva.idCabana === cabanaId && 
      reserva.estado !== 'Cancelada' && 
      reserva.estado !== 'Finalizada'
    );
  };

  // ===============================================
  // FUNCIONES PARA MANEJO DE IMÁGENES
  // ===============================================
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
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

    // Crear URLs para previsualización
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      descripcion: `Imagen de ${newCabin.nombre || 'cabaña'}`,
      isNew: true
    }));

    setImagenesSeleccionadas(prev => [...prev, ...newImages]);
    e.target.value = ''; // Reset input
  };

  const removeImage = (index) => {
    setImagenesSeleccionadas(prev => {
      const newImages = [...prev];
      // Liberar URL de objeto si es una imagen nueva
      if (newImages[index].isNew) {
        URL.revokeObjectURL(newImages[index].preview);
      }
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const uploadImagesToServer = async (cabanaId) => {
    if (imagenesSeleccionadas.length === 0) return;

    setUploadingImages(true);
    
    try {
      for (const imagen of imagenesSeleccionadas) {
        if (imagen.isNew) {
          // Para imágenes nuevas, necesitarías enviar el archivo
          // Aquí asumimos que la API acepta base64 o URLs
          const formData = new FormData();
          formData.append('file', imagen.file);
          formData.append('idCabana', cabanaId);
          formData.append('descripcion', imagen.descripcion);

          await axios.post(API_IMAGENES, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        }
      }
    } catch (error) {
      console.error("Error al subir imágenes:", error);
      throw error;
    } finally {
      setUploadingImages(false);
    }
  };

  const deleteImage = async (imageId) => {
    try {
      await axios.delete(`${API_IMAGENES}/${imageId}`);
      await fetchImagenes();
      displayAlert("Imagen eliminada exitosamente", "success");
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
      handleApiError(error, "eliminar la imagen");
    }
  };

  const getImagenesPorCabana = (cabanaId) => {
    return imagenes.filter(img => img.idCabana === cabanaId);
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
      const cabinData = {
        ...newCabin,
        idTemporada: parseInt(newCabin.idTemporada),
        idSede: parseInt(newCabin.idSede),
        cantidadPersonas: parseInt(newCabin.cantidadPersonas) // Asegurar que sea número
      };

      let cabanaId;

      if (isEditing) {
        await axios.put(`${API_CABANAS}/${newCabin.idCabana}`, cabinData, {
          headers: { 'Content-Type': 'application/json' }
        });
        cabanaId = newCabin.idCabana;
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
      const relacionesExistentes = cabanaComodidades.filter(cc => cc.idCabana === cabanaId);
      for (const relacion of relacionesExistentes) {
        await axios.delete(`${API_CABANA_COMODIDADES}/${relacion.idCabanaComodidades}`);
        await actualizarCantidadComodidad(relacion.idComodidades, 1);
      }

      for (const comodidadId of newCabin.comodidadesSeleccionadas) {
        const relacionData = {
          idCabana: cabanaId,
          idComodidades: parseInt(comodidadId)
        };
        await axios.post(API_CABANA_COMODIDADES, relacionData, {
          headers: { 'Content-Type': 'application/json' }
        });
        await actualizarCantidadComodidad(parseInt(comodidadId), -1);
      }
    } catch (error) {
      console.error("Error al manejar comodidades:", error);
      throw error;
    }
  };

  const actualizarCantidadComodidad = async (comodidadId, cambio) => {
    try {
      const comodidad = comodidades.find(c => c.idComodidades === comodidadId);
      if (comodidad) {
        const nuevaCantidad = comodidad.cantidad + cambio;
        if (nuevaCantidad >= 0) {
          await axios.put(`${API_COMODIDADES}/${comodidadId}`, {
            ...comodidad,
            cantidad: nuevaCantidad
          }, {
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
    } catch (error) {
      console.error("Error al actualizar cantidad de comodidad:", error);
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
          await axios.delete(`${API_IMAGENES}/${imagen.idImagen}`);
        }

        // Luego eliminar las relaciones con comodidades
        const relacionesCabin = cabanaComodidades.filter(cc => cc.idCabana === cabinToDelete.idCabana);
        for (const relacion of relacionesCabin) {
          await axios.delete(`${API_CABANA_COMODIDADES}/${relacion.idCabanaComodidades}`);
          await actualizarCantidadComodidad(relacion.idComodidades, 1);
        }

        // Finalmente eliminar la cabaña
        await axios.delete(`${API_CABANAS}/${cabinToDelete.idCabana}`);
        displayAlert("Cabaña eliminada exitosamente.", "success");
        await fetchCabins();
        await fetchCabanaComodidades();
        await fetchComodidades();
        await fetchImagenes();
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
      errorMessage = "No se puede conectar al servidor en http://localhost:5255";
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

  const handleComodidadChange = (comodidadId) => {
    setNewCabin(prev => {
      const comodidadesActuales = [...prev.comodidadesSeleccionadas];
      const index = comodidadesActuales.indexOf(comodidadId);
      
      if (index > -1) {
        comodidadesActuales.splice(index, 1);
      } else {
        const comodidad = comodidades.find(c => c.idComodidades === parseInt(comodidadId));
        if (comodidad && comodidad.cantidad > 0) {
          comodidadesActuales.push(comodidadId);
        } else {
          displayAlert("Esta comodidad no está disponible en este momento.", "warning");
        }
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
    setImagenesSeleccionadas([]);
    setNewCabin({
      nombre: "",
      tipoCabana: "Familiar",
      estado: true,
      idTemporada: temporadas.length > 0 ? temporadas[0].idTemporada.toString() : "",
      idSede: sedes.length > 0 ? sedes[0].idSede.toString() : "",
      cantidadPersonas: 2, // Reset a valor por defecto
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
      const updatedCabin = { ...cabin, estado: !cabin.estado };
      await axios.put(`${API_CABANAS}/${cabin.idCabana}`, updatedCabin);
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
    const comodidadesActuales = cabanaComodidades
      .filter(cc => cc.idCabana === cabin.idCabana)
      .map(cc => cc.idComodidades.toString());

    // Cargar imágenes existentes de la cabaña
    const imagenesExistentes = getImagenesPorCabana(cabin.idCabana).map(img => ({
      ...img,
      preview: img.rutaImagen,
      isNew: false
    }));

    setNewCabin({
      ...cabin,
      idTemporada: cabin.idTemporada ? cabin.idTemporada.toString() : (temporadas.length > 0 ? temporadas[0].idTemporada.toString() : ""),
      idSede: cabin.idSede ? cabin.idSede.toString() : (sedes.length > 0 ? sedes[0].idSede.toString() : ""),
      cantidadPersonas: cabin.cantidadPersonas || 2, // Incluir cantidad de personas
      comodidadesSeleccionadas: comodidadesActuales
    });
    setImagenesSeleccionadas(imagenesExistentes);
    setIsEditing(true);
    setShowForm(true);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
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
  // FUNCIONES DE FILTRADO Y PAGINACIÓN
  // ===============================================
  const filteredCabins = useMemo(() => {
    return cabins.filter(cabin =>
      cabin.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cabin.tipoCabana?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cabins, searchTerm]);

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

  const getComodidadesPorCabana = (cabanaId) => {
    const relaciones = cabanaComodidades.filter(cc => cc.idCabana === cabanaId);
    return relaciones.map(relacion => {
      const comodidad = comodidades.find(c => c.idComodidades === relacion.idComodidades);
      return comodidad ? comodidad.nombreComodidades : `Comodidad ${relacion.idComodidades}`;
    });
  };

  const getComodidadDisponible = (comodidadId) => {
    const comodidad = comodidades.find(c => c.idComodidades === parseInt(comodidadId));
    return comodidad ? comodidad.cantidad > 0 : false;
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
            {cabins.length} cabañas registradas | {sedes.length} sedes | {temporadas.length} temporadas | {comodidades.length} comodidades
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setIsEditing(false);
            setFormErrors({});
            setFormSuccess({});
            setFormWarnings({});
            setImagenesSeleccionadas([]);
            setNewCabin({
              nombre: "",
              tipoCabana: "Familiar",
              estado: true,
              idTemporada: temporadas.length > 0 ? temporadas[0].idTemporada.toString() : "",
              idSede: sedes.length > 0 ? sedes[0].idSede.toString() : "",
              cantidadPersonas: 2, // Valor por defecto al crear nueva cabaña
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

      {/* Barra de búsqueda */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 400 }}>
          <FaSearch style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#2E5939" }} />
          <input
            type="text"
            placeholder="Buscar por nombre o tipo..."
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
        <div style={{ color: '#2E5939', fontSize: '14px', whiteSpace: 'nowrap' }}>
          {filteredCabins.length} resultados
        </div>
      </div>

      {/* Formulario de agregar/editar */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 700 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939" }}>
                {isEditing ? "Editar Cabaña" : "Nueva Cabaña"}
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
                disabled={isSubmitting}
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleAddCabin}>
              {/* Primera fila: Nombre */}
              <FormField
                label="Nombre de la Cabaña"
                name="nombre"
                value={newCabin.nombre}
                onChange={handleInputChange}
                error={formErrors.nombre}
                success={formSuccess.nombre}
                warning={formWarnings.nombre}
                required={true}
                disabled={loading}
                maxLength={VALIDATION_RULES.nombre.maxLength}
                showCharCount={true}
                placeholder="Ej: Mykonos, Paraíso, Cabaña Familiar"
              />

              {/* Segunda fila: Tipo y Capacidad en grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '15px', 
                marginBottom: '15px',
                alignItems: 'start'
              }}>
                <FormField
                  label="Tipo de Cabaña"
                  name="tipoCabana"
                  type="select"
                  value={newCabin.tipoCabana}
                  onChange={handleInputChange}
                  error={formErrors.tipoCabana}
                  success={formSuccess.tipoCabana}
                  warning={formWarnings.tipoCabana}
                  options={tiposCabana.map(tipo => ({ value: tipo, label: tipo }))}
                  required={true}
                  disabled={loading}
                />
                
                <FormField
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaUsers />
                      Capacidad de Personas
                    </div>
                  }
                  name="cantidadPersonas"
                  type="number"
                  value={newCabin.cantidadPersonas}
                  onChange={handleInputChange}
                  error={formErrors.cantidadPersonas}
                  success={formSuccess.cantidadPersonas}
                  warning={formWarnings.cantidadPersonas}
                  required={true}
                  disabled={loading}
                  min={VALIDATION_RULES.cantidadPersonas.min}
                  max={VALIDATION_RULES.cantidadPersonas.max}
                  step="1"
                  placeholder="Ej: 2, 4, 6..."
                />
              </div>

              {/* Tercera fila: Sede y Temporada en grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '15px', 
                marginBottom: '15px',
                alignItems: 'start'
              }}>
                <FormField
                  label="Sede"
                  name="idSede"
                  type="select"
                  value={newCabin.idSede}
                  onChange={handleInputChange}
                  error={formErrors.idSede}
                  success={formSuccess.idSede}
                  warning={formWarnings.idSede}
                  options={sedes.map(sede => ({ 
                    value: sede.idSede.toString(), 
                    label: sede.nombreSede 
                  }))}
                  required={true}
                  disabled={loadingSedes || sedes.length === 0}
                />

                <FormField
                  label="Temporada"
                  name="idTemporada"
                  type="select"
                  value={newCabin.idTemporada}
                  onChange={handleInputChange}
                  error={formErrors.idTemporada}
                  success={formSuccess.idTemporada}
                  warning={formWarnings.idTemporada}
                  options={temporadas.map(temp => ({ 
                    value: temp.idTemporada.toString(), 
                    label: `${temp.nombreTemporada} ($${temp.precio})` 
                  }))}
                  required={true}
                  disabled={loadingTemporadas || temporadas.length === 0}
                />
              </div>

              {/* Gestión de Imágenes */}
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
                      </span>
                      <button
                        type="button"
                        onClick={() => setImagenesSeleccionadas([])}
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
                            src={imagen.preview} 
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
                          cursor: getComodidadDisponible(comodidad.idComodidades.toString()) || 
                                 newCabin.comodidadesSeleccionadas.includes(comodidad.idComodidades.toString()) ? 
                                 'pointer' : 'not-allowed'
                        }}>
                          <input
                            type="checkbox"
                            checked={newCabin.comodidadesSeleccionadas.includes(comodidad.idComodidades.toString())}
                            onChange={() => handleComodidadChange(comodidad.idComodidades.toString())}
                            disabled={!getComodidadDisponible(comodidad.idComodidades.toString()) && 
                                     !newCabin.comodidadesSeleccionadas.includes(comodidad.idComodidades.toString())}
                          />
                          <span style={{ 
                            color: getComodidadDisponible(comodidad.idComodidades.toString()) ? 
                                  '#2E5939' : '#999' 
                          }}>
                            {comodidad.nombreComodidades} 
                            <small style={{ marginLeft: '8px', color: '#679750' }}>
                              (Disponibles: {comodidad.cantidad})
                            </small>
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
                   (isEditing ? "Actualizar" : "Guardar")} Cabaña
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
          <div style={{ ...detailsModalStyle, maxWidth: 800 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939" }}>Detalles de la Cabaña</h2>
              <button
                onClick={closeDetailsModal}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2E5939",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
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
                <div style={detailValueStyle}>{currentCabin.tipoCabana}</div>
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
                    {currentCabin.cantidadPersonas || 2} persona(s)
                  </span>
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
                          />
                          <button
                            onClick={() => deleteImage(imagen.idImagen)}
                            style={imageRemoveButtonStyle}
                            title="Eliminar imagen"
                          >
                            <FaTimes size={10} />
                          </button>
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
                  <td colSpan={9} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
                    {cabins.length === 0 ? "No hay cabañas registradas" : "No se encontraron resultados"}
                  </td>
                </tr>
              ) : (
                paginatedCabins.map((cabin) => (
                  <tr key={cabin.idCabana} style={{ borderBottom: "1px solid #eee" }}>
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
                    <td style={{ padding: "15px" }}>{cabin.tipoCabana}</td>
                    <td style={{ padding: "15px" }}>{getSedeNombre(cabin.idSede)}</td>
                    <td style={{ padding: "15px", textAlign: "center" }}>{getTemporadaNombre(cabin.idTemporada)}</td>
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
                          {cabin.cantidadPersonas || 2}
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
                        style={{
                          cursor: "pointer",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          border: "none",
                          backgroundColor: cabin.estado ? "#4caf50" : "#e57373",
                          color: "white",
                          fontWeight: "600",
                          fontSize: "12px",
                          minWidth: "80px"
                        }}
                      >
                        {cabin.estado ? "Activa" : "Inactiva"}
                      </button>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
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
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(cabin)}
                        style={btnAccion("#fbe9e7", "#e57373")}
                        title={tieneReservasActivas(cabin.idCabana) ? "No se puede eliminar - Tiene reservas activas" : "Eliminar"}
                        disabled={tieneReservasActivas(cabin.idCabana)}
                      >
                        <FaTrash />
                      </button>
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