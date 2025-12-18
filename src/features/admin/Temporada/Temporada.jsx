// src/components/Temporada.jsx
import React, { useState, useMemo, useEffect } from "react";
import { 
  FaEye, FaEdit, FaTrash, FaTimes, FaSearch, FaPlus, 
  FaExclamationTriangle, FaCheck, FaInfoCircle, FaCalendarAlt,
  FaPercentage, FaSync, FaShoppingCart, FaSlidersH
} from "react-icons/fa";
import axios from "axios";

// ===============================================
// ESTILOS MEJORADOS (CONSISTENTES CON MARCAS)
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

const formContainerStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '15px',
  padding: '0 10px'
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
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: 30,
  borderRadius: 12,
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  width: "90%",
  maxWidth: 500,
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

const detailsModalStyle = {
  backgroundColor: "#fff",
  padding: 30,
  borderRadius: 12,
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  width: "90%",
  maxWidth: 500,
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
// VALIDACIONES Y PATRONES PARA TEMPORADAS
// ===============================================
const VALIDATION_PATTERNS = {
  nombreTemporada: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-_&]+$/,
};

const VALIDATION_RULES = {
  nombreTemporada: {
    minLength: 2,
    maxLength: 50,
    required: true,
    pattern: VALIDATION_PATTERNS.nombreTemporada,
    errorMessages: {
      required: "El nombre de la temporada es obligatorio.",
      minLength: "El nombre debe tener al menos 2 caracteres.",
      maxLength: "El nombre no puede exceder los 50 caracteres.",
      pattern: "El nombre contiene caracteres no permitidos. Solo se permiten letras, espacios, guiones y el símbolo &."
    }
  },
  porcentaje: {
    required: true,
    min: 0,
    max: 100,
    errorMessages: {
      required: "El porcentaje es obligatorio.",
      min: "El porcentaje no puede ser menor a 0%.",
      max: "El porcentaje no puede ser mayor a 100%.",
      invalid: "El porcentaje debe ser un número válido (ej: 10 o 15.5)."
    }
  }
};

// ===============================================
// DATOS DE CONFIGURACIÓN
// ===============================================
const API_TEMPORADA = "https://www.bosquesagrado.somee.com/api/Temporada";
const ITEMS_PER_PAGE = 10;

// ===============================================
// COMPONENTE FormField PARA TEMPORADA
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
  style = {}, 
  required = true, 
  disabled = false,
  maxLength,
  placeholder,
  showCharCount = false,
  min,
  max,
  step,
  touched = false
}) => {
  const handleFilteredInputChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (name === 'nombreTemporada') {
      filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-_&]/g, "");
    } else if (name === 'porcentaje') {
      filteredValue = value.replace(/[^0-9.]/g, "");
      const parts = filteredValue.split('.');
      if (parts.length > 2) {
        filteredValue = parts[0] + '.' + parts.slice(1).join('');
      }
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
      {getValidationMessage()}
    </div>
  );
};

// ===============================================
// COMPONENTE PRINCIPAL TEMPORADA MEJORADO CON FILTROS
// ===============================================
const Temporada = () => {
  const [temporadas, setTemporadas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTemporada, setSelectedTemporada] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [temporadaToDelete, setTemporadaToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState({});
  const [formWarnings, setFormWarnings] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  // Estados para filtros - MEJORADO COMO EN SERVICIOS Y SEDES
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    porcentajeMin: "",
    porcentajeMax: "",
    tipoPorcentaje: "all"
  });

  const [newTemporada, setNewTemporada] = useState({
    idTemporada: 0,
    nombreTemporada: "",
    porcentaje: ""
  });

  // ===============================================
  // EFECTOS
  // ===============================================
  useEffect(() => {
    fetchTemporadas();
  }, []);

  // Validar formulario en tiempo real solo para campos tocados
  useEffect(() => {
    if (showForm) {
      Object.keys(touchedFields).forEach(fieldName => {
        if (touchedFields[fieldName]) {
          validateField(fieldName, newTemporada[fieldName]);
        }
      });
    }
  }, [newTemporada, showForm, touchedFields]);

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
    else if (trimmedValue && fieldName === 'porcentaje') {
      const numericValue = parseFloat(trimmedValue);
      
      if (isNaN(numericValue)) {
        error = rules.errorMessages.invalid;
      } else if (rules.min !== undefined && numericValue < rules.min) {
        error = rules.errorMessages.min;
      } else if (rules.max !== undefined && numericValue > rules.max) {
        error = rules.errorMessages.max;
      } else {
        success = "Porcentaje válido.";
        
        // Advertencias específicas
        if (numericValue > 70) {
          warning = "Porcentaje muy alto. Verifique que sea correcto.";
        } else if (numericValue === 0) {
          warning = "Porcentaje en 0% — no se aplicará incremento.";
        } else if (numericValue < 5) {
          warning = "Porcentaje bajo. Verifique que sea correcto.";
        }
      }
    }
    else if (trimmedValue) {
      success = "Campo válido.";
    }

    // Verificación de duplicados para nombre
    if (fieldName === 'nombreTemporada' && trimmedValue && !error) {
      const duplicate = temporadas.find(temp => 
        temp.nombreTemporada.toLowerCase() === trimmedValue.toLowerCase() && 
        (!isEditing || temp.idTemporada !== newTemporada.idTemporada)
      );
      if (duplicate) {
        error = "Ya existe una temporada con este nombre.";
      }
    }

    // Advertencias específicas para nombre
    if (fieldName === 'nombreTemporada' && trimmedValue && !error) {
      // Advertencia para nombres muy similares
      const temporadaSimilar = temporadas.find(temp => 
        temp.nombreTemporada.toLowerCase().includes(trimmedValue.toLowerCase()) && 
        temp.idTemporada !== (isEditing ? newTemporada.idTemporada : null)
      );
      if (temporadaSimilar) {
        warning = `Existe una temporada similar: "${temporadaSimilar.nombreTemporada}"`;
      }
      
      // Advertencia para nombres muy genéricos
      const nombresGenericos = ['temporada', 'general', 'normal', 'regular'];
      if (nombresGenericos.includes(trimmedValue.toLowerCase())) {
        warning = 'Considera usar un nombre más específico para la temporada';
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
      nombreTemporada: true,
      porcentaje: true
    };
    setTouchedFields(allFieldsTouched);

    const nombreValid = validateField('nombreTemporada', newTemporada.nombreTemporada);
    const porcentajeValid = validateField('porcentaje', newTemporada.porcentaje);

    const isValid = nombreValid && porcentajeValid;
    
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

  // ===============================================
  // FUNCIONES DE FILTRADO MEJORADAS - IGUAL QUE EN SERVICIOS Y SEDES
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
      porcentajeMin: "",
      porcentajeMax: "",
      tipoPorcentaje: "all"
    });
    setCurrentPage(1);
  };

  // Contador de filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.porcentajeMin) count++;
    if (filters.porcentajeMax) count++;
    if (filters.tipoPorcentaje !== "all") count++;
    return count;
  }, [filters]);

  // ===============================================
  // FUNCIONES DE LA API
  // ===============================================
  const fetchTemporadas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_TEMPORADA, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (Array.isArray(res.data)) {
        setTemporadas(res.data);
      } else {
        throw new Error("Formato de datos inválido");
      }
    } catch (error) {
      console.error("❌ Error al obtener temporadas:", error);
      handleApiError(error, "cargar las temporadas");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTemporada = async (e) => {
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
      // Preparar datos según la estructura de tu API
      const temporadaData = {
        nombreTemporada: newTemporada.nombreTemporada.trim(),
        porcentaje: parseFloat(newTemporada.porcentaje)
      };

      console.log("📤 Enviando datos:", temporadaData);

      if (isEditing) {
        // Para edición, incluir el idTemporada
        temporadaData.idTemporada = newTemporada.idTemporada;
        await axios.put(`${API_TEMPORADA}/${newTemporada.idTemporada}`, temporadaData, {
          headers: { 'Content-Type': 'application/json' }
        });
        displayAlert("Temporada actualizada exitosamente.", "success");
      } else {
        await axios.post(API_TEMPORADA, temporadaData, {
          headers: { 'Content-Type': 'application/json' }
        });
        displayAlert("Temporada agregada exitosamente.", "success");
      }
      
      await fetchTemporadas();
      closeForm();
    } catch (error) {
      console.error("❌ Error al guardar temporada:", error);
      handleApiError(error, isEditing ? "actualizar la temporada" : "agregar la temporada");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (temporadaToDelete) {
      setLoading(true);
      try {
        await axios.delete(`${API_TEMPORADA}/${temporadaToDelete.idTemporada}`);
        displayAlert("Temporada eliminada exitosamente.", "success");
        await fetchTemporadas();
      } catch (error) {
        console.error("❌ Error al eliminar temporada:", error);
        
        if (error.response && error.response.status === 409) {
          displayAlert("No se puede eliminar la temporada porque está siendo utilizada en tarifas existentes.", "error");
        } else {
          handleApiError(error, "eliminar la temporada");
        }
      } finally {
        setLoading(false);
        setTemporadaToDelete(null);
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
        errorMessage = "Conflicto: La temporada está siendo utilizada y no puede ser eliminada.";
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTemporada((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Nueva función para manejar el blur (cuando el campo pierde el foco)
  const handleInputBlur = (e) => {
    const { name } = e.target;
    markFieldAsTouched(name);
    validateField(name, newTemporada[name]);
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
    setTouchedFields({});
    setNewTemporada({
      idTemporada: 0,
      nombreTemporada: "",
      porcentaje: ""
    });
  };

  const closeDetailsModal = () => {
    setShowDetails(false);
    setSelectedTemporada(null);
  };

  const cancelDelete = () => {
    setTemporadaToDelete(null);
    setShowDeleteConfirm(false);
  };

  const handleView = (temporada) => {
    setSelectedTemporada(temporada);
    setShowDetails(true);
  };

  const handleEdit = (temporada) => {
    setNewTemporada({
      ...temporada,
      porcentaje: temporada.porcentaje.toString()
    });
    setIsEditing(true);
    setShowForm(true);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
    setTouchedFields({});
  };

  const handleDeleteClick = (temporada) => {
    setTemporadaToDelete(temporada);
    setShowDeleteConfirm(true);
  };

  // ===============================================
  // FUNCIONES DE FILTRADO Y PAGINACIÓN MEJORADAS
  // ===============================================
  const filteredTemporadas = useMemo(() => {
    let filtered = temporadas.filter(temporada => {
      // Búsqueda general
      const matchesSearch = 
        temporada.nombreTemporada?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Filtro por porcentaje mínimo
      if (filters.porcentajeMin) {
        const porcentajeMin = parseFloat(filters.porcentajeMin);
        if (temporada.porcentaje < porcentajeMin) return false;
      }

      // Filtro por porcentaje máximo
      if (filters.porcentajeMax) {
        const porcentajeMax = parseFloat(filters.porcentajeMax);
        if (temporada.porcentaje > porcentajeMax) return false;
      }

      // Filtro por tipo de porcentaje
      if (filters.tipoPorcentaje !== "all") {
        if (filters.tipoPorcentaje === "sin" && temporada.porcentaje > 0) return false;
        if (filters.tipoPorcentaje === "con" && temporada.porcentaje === 0) return false;
        if (filters.tipoPorcentaje === "alto" && temporada.porcentaje < 20) return false;
        if (filters.tipoPorcentaje === "bajo" && temporada.porcentaje >= 20) return false;
      }

      return true;
    });

    return filtered;
  }, [temporadas, searchTerm, filters]);

  const totalPages = Math.ceil(filteredTemporadas.length / ITEMS_PER_PAGE);

  const paginatedTemporadas = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTemporadas.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTemporadas, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ===============================================
  // FUNCIONES PARA FORMATEAR DATOS
  // ===============================================
  const formatPercentage = (value) => {
    const v = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
    return Number.isInteger(v) ? `${v}%` : `${v.toFixed(1)}%`;
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
              onClick={fetchTemporadas}
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
          <h2 style={{ margin: 0, color: "#2E5939" }}>Gestión de Temporadas</h2>
          <p style={{ margin: "5px 0 0 0", color: "#679750", fontSize: "14px" }}>
            {temporadas.length} temporadas registradas
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={() => {
              setShowForm(true);
              setIsEditing(false);
              setFormErrors({});
              setFormSuccess({});
              setFormWarnings({});
              setTouchedFields({});
              setNewTemporada({
                idTemporada: 0,
                nombreTemporada: "",
                porcentaje: ""
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
            <FaPlus /> Nueva Temporada
          </button>
        </div>
      </div>

      {/* Estadísticas - MEJORADO COMO EN SERVICIOS */}
      {!loading && temporadas.length > 0 && (
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
              {temporadas.length}
            </div>
            <div style={{ fontSize: '16px', color: '#679750', fontWeight: '600' }}>
              Total Temporadas
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
              {temporadas.filter(t => t.porcentaje > 0).length}
            </div>
            <div style={{ fontSize: '16px', color: '#4caf50', fontWeight: '600' }}>
              Con Incremento
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
              {temporadas.filter(t => t.porcentaje === 0).length}
            </div>
            <div style={{ fontSize: '16px', color: '#e57373', fontWeight: '600' }}>
              Sin Incremento
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
              {filteredTemporadas.length}
            </div>
            <div style={{ fontSize: '16px', color: '#2196f3', fontWeight: '600' }}>
              Resultados Filtrados
            </div>
          </div>
        </div>
      )}

      {/* Barra de búsqueda y filtros - MEJORADO COMO EN SERVICIOS Y SEDES */}
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
              placeholder="Buscar por nombre de temporada..."
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
              {/* Filtro por porcentaje mínimo */}
              <div>
                <label style={labelStyle}>Porcentaje Mínimo</label>
                <div style={{ position: 'relative' }}>
                  <FaPercentage style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: '#2E5939' 
                  }} />
                  <input
                    type="number"
                    name="porcentajeMin"
                    value={filters.porcentajeMin}
                    onChange={handleFilterChange}
                    style={{
                      ...inputStyle,
                      paddingLeft: '35px'
                    }}
                    placeholder="0"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>

              {/* Filtro por porcentaje máximo */}
              <div>
                <label style={labelStyle}>Porcentaje Máximo</label>
                <div style={{ position: 'relative' }}>
                  <FaPercentage style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: '#2E5939' 
                  }} />
                  <input
                    type="number"
                    name="porcentajeMax"
                    value={filters.porcentajeMax}
                    onChange={handleFilterChange}
                    style={{
                      ...inputStyle,
                      paddingLeft: '35px'
                    }}
                    placeholder="100"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>

              {/* Filtro por tipo de porcentaje */}
              <div>
                <label style={labelStyle}>Tipo de Temporada</label>
                <select
                  name="tipoPorcentaje"
                  value={filters.tipoPorcentaje}
                  onChange={handleFilterChange}
                  style={{
                    ...inputStyle,
                    width: '100%'
                  }}
                >
                  <option value="all">Todas las temporadas</option>
                  <option value="sin">Sin incremento (0%)</option>
                  <option value="con">Con incremento</option>
                  <option value="bajo">Incremento bajo (1-19%)</option>
                  <option value="alto">Incremento alto (20%+)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Información de resultados filtrados */}
        {filteredTemporadas.length !== temporadas.length && (
          <div style={{
            marginTop: '10px',
            padding: '8px 12px',
            backgroundColor: '#E8F5E8',
            borderRadius: '6px',
            color: '#2E5939',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Mostrando {filteredTemporadas.length} de {temporadas.length} temporadas
            {activeFiltersCount > 0 && ` (filtros aplicados: ${activeFiltersCount})`}
          </div>
        )}
      </div>

      {/* Resto del código permanece igual (Formulario, Modal de detalles, Modal de confirmación, Tabla, Paginación) */}
      {/* ... */}

      {/* Formulario de agregar/editar */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939" }}>
                {isEditing ? "Editar Temporada" : "Nueva Temporada"}
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
            
            <form onSubmit={handleAddTemporada} style={formContainerStyle}>
              <FormField
                label="Nombre de la Temporada"
                name="nombreTemporada"
                value={newTemporada.nombreTemporada}
                onChange={handleChange}
                onBlur={handleInputBlur}
                error={formErrors.nombreTemporada}
                success={formSuccess.nombreTemporada}
                warning={formWarnings.nombreTemporada}
                required={true}
                disabled={loading}
                maxLength={VALIDATION_RULES.nombreTemporada.maxLength}
                showCharCount={true}
                placeholder="Ej: Alta Temporada, Baja Temporada, Temporada Media..."
                touched={touchedFields.nombreTemporada}
              />

              <FormField
                label="Porcentaje de Incremento (%)"
                name="porcentaje"
                type="number"
                value={newTemporada.porcentaje}
                onChange={handleChange}
                onBlur={handleInputBlur}
                error={formErrors.porcentaje}
                success={formSuccess.porcentaje}
                warning={formWarnings.porcentaje}
                required={true}
                disabled={loading}
                min={VALIDATION_RULES.porcentaje.min}
                max={VALIDATION_RULES.porcentaje.max}
                step="0.1"
                placeholder="10"
                touched={touchedFields.porcentaje}
              />

              {/* Resumen de la temporada */}
              {newTemporada.porcentaje && (
                <div style={{
                  backgroundColor: '#E8F5E8',
                  border: '1px solid #679750',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#2E5939' }}>Resumen de la Temporada</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                    <div>Porcentaje de incremento:</div>
                    <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      {formatPercentage(newTemporada.porcentaje)}
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 20 }}>
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
                    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                    transition: "all 0.3s ease",
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
                  {loading ? "Guardando..." : (isEditing ? "Actualizar" : "Guardar")} Temporada
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
      {showDetails && selectedTemporada && (
        <div style={modalOverlayStyle}>
          <div style={detailsModalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939" }}>Detalles de la Temporada</h2>
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
                <div style={detailValueStyle}>#{selectedTemporada.idTemporada}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Nombre de la Temporada</div>
                <div style={detailValueStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaCalendarAlt color="#679750" />
                    {selectedTemporada.nombreTemporada}
                  </div>
                </div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Porcentaje de Incremento</div>
                <div style={{ ...detailValueStyle, fontWeight: 'bold', color: '#2E5939' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaPercentage color="#679750" />
                    {formatPercentage(selectedTemporada.porcentaje)}
                  </div>
                </div>
              </div>
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
      {showDeleteConfirm && temporadaToDelete && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 500, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 12, color: "#2E5939" }}>Confirmar Eliminación</h3>
            <p style={{ marginBottom: 18, fontSize: '1rem', color: "#2E5939" }}>
              ¿Estás seguro de eliminar de forma permanente la temporada "<strong>{temporadaToDelete.nombreTemporada}</strong>"? Esta acción no se puede deshacer.
            </p>

            <div style={{ 
              backgroundColor: '#ffecec', 
              border: '1px solid #e57373',
              borderRadius: '8px',
              padding: '12px 15px',
              marginBottom: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <FaInfoCircle style={{ color: '#e57373' }} />
                <strong style={{ color: '#2E5939' }}>Atención</strong>
              </div>
              <p style={{ color: '#2E5939', margin: 0, fontSize: '0.9rem' }}>
                Si la temporada está asociada a tarifas, la eliminación será rechazada por el servidor y se mostrará el motivo.
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
              <button
                onClick={confirmDelete}
                disabled={loading}
                style={{
                  backgroundColor: loading ? "#ccc" : "#e53935",
                  color: "white",
                  padding: "10px 22px",
                  border: "none",
                  borderRadius: 10,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "700",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
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
                  padding: "10px 22px",
                  border: "none",
                  borderRadius: 10,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "600",
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
              🔄 Cargando temporadas...
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
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Temporada</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Porcentaje</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTemporadas.length === 0 && !loading ? (
                <tr>
                  <td colSpan={3} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <FaInfoCircle size={30} color="#679750" />
                      {temporadas.length === 0 ? "No hay temporadas registradas" : "No se encontraron resultados con los filtros aplicados"}
                      {activeFiltersCount > 0 && (
                        <div style={{ color: '#679750', fontSize: '14px', marginTop: '5px' }}>
                          Filtros activos: {activeFiltersCount}
                        </div>
                      )}
                      {temporadas.length === 0 && (
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
                          Agregar Primera Temporada
                        </button>
                      )}
                      {temporadas.length > 0 && activeFiltersCount > 0 && (
                        <button
                          onClick={clearFilters}
                          style={{
                            backgroundColor: "#2E5939",
                            color: "white",
                            padding: "8px 16px",
                            border: "none",
                            borderRadius: 8,
                            cursor: "pointer",
                            fontWeight: "600",
                            marginTop: '10px',
                          }}
                        >
                          Limpiar Filtros
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTemporadas.map((temporada) => (
                  <tr key={temporada.idTemporada} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "15px", fontWeight: "500" }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaCalendarAlt color="#679750" />
                        {temporada.nombreTemporada}
                      </div>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>
                      {formatPercentage(temporada.porcentaje)}
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <div style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
                        <button
                          onClick={() => handleView(temporada)}
                          style={btnAccion("#F7F4EA", "#2E5939")}
                          title="Ver Detalles"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(temporada)}
                          style={btnAccion("#F7F4EA", "#2E5939")}
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteClick(temporada); }}
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
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 10, alignItems: "center" }}>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            style={navBtnStyle(currentPage === 1)}
          >
            Anterior
          </button>
          
          <div style={{ display: "flex", gap: 5 }}>
            {(() => {
              const pages = [];
              const maxVisiblePages = 5;
              let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
              let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
              
              if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
              }
              
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
          </div>
          
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={navBtnStyle(currentPage === totalPages)}
          >
            Siguiente
          </button>
          
          <div style={{ 
            color: '#2E5939', 
            fontSize: '14px', 
            marginLeft: '15px',
            fontWeight: '500'
          }}>
            Página {currentPage} de {totalPages}
          </div>
        </div>
      )}
    </div>
  );
};

export default Temporada;