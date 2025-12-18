// src/components/TipoCabana.jsx
import React, { useState, useMemo, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaTimes, FaExclamationTriangle, FaPlus, FaCheck, FaInfoCircle, FaSearch, FaHome, FaCouch, FaBed, FaStar, FaUsers, FaTree, FaSlidersH } from "react-icons/fa";
import axios from "axios";

// ===============================================
// ESTILOS MEJORADOS
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
  overflow: "hidden",
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
// VALIDACIONES Y PATRONES
// ===============================================
const VALIDATION_PATTERNS = {
  nombreTipoCabana: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-_&]+$/,
  descripcion: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-_.,!?@#$%&*()+=:;"'{}[\]<>/\\|~`^]+$/
};

const VALIDATION_RULES = {
  nombreTipoCabana: {
    minLength: 2,
    maxLength: 50,
    required: true,
    pattern: VALIDATION_PATTERNS.nombreTipoCabana,
    errorMessages: {
      required: "El nombre del tipo de cabaña es obligatorio.",
      minLength: "El nombre debe tener al menos 2 caracteres.",
      maxLength: "El nombre no puede exceder los 50 caracteres.",
      pattern: "El nombre contiene caracteres no permitidos. Solo se permiten letras, espacios, guiones y el símbolo &."
    }
  },
  descripcion: {
    minLength: 5,
    maxLength: 200,
    required: true,
    pattern: VALIDATION_PATTERNS.descripcion,
    errorMessages: {
      required: "La descripción es obligatoria.",
      minLength: "La descripción debe tener al menos 5 caracteres.",
      maxLength: "La descripción no puede exceder los 200 caracteres.",
      pattern: "La descripción contiene caracteres no válidos."
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
const API_TIPO_CABANA = "https://www.bosquesagrado.somee.com/api/TipoCabana";
const ITEMS_PER_PAGE = 10;

// ===============================================
// COMPONENTE FormField PARA TIPO CABAÑA
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
  touched = false
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

    if (name === 'nombreTipoCabana') {
      filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-_&]/g, "");
    } else if (name === 'descripcion') {
      if (value === "" || VALIDATION_PATTERNS.descripcion.test(value)) {
        filteredValue = value;
      } else {
        return;
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
      ) : type === "textarea" ? (
        <div>
          <textarea
            name={name}
            value={value}
            onChange={handleFilteredInputChange}
            style={{
              ...getInputStyle(),
              minHeight: "80px",
              resize: "vertical",
              fontFamily: "inherit"
            }}
            required={required}
            disabled={disabled}
            maxLength={maxLength}
            placeholder={placeholder}
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
            style={getInputStyle()}
            required={required}
            disabled={disabled}
            maxLength={maxLength}
            placeholder={placeholder}
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
// COMPONENTE PRINCIPAL TipoCabana CON FILTROS MEJORADOS
// ===============================================
const TipoCabana = () => {
  const [tiposCabana, setTiposCabana] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTipoCabana, setSelectedTipoCabana] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tipoCabanaToDelete, setTipoCabanaToDelete] = useState(null);
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

  // Estados para filtros - MEJORADO COMO EN ROLES Y SEDES
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    estado: "all",
    fechaDesde: "",
    fechaHasta: ""
  });

  const [newTipoCabana, setNewTipoCabana] = useState({
    idTipoCabana: 0,
    nombreTipoCabana: "",
    descripcion: "",
    estado: true
  });

  // ===============================================
  // EFECTOS
  // ===============================================
  useEffect(() => {
    fetchTiposCabana();
  }, []);

  // Efecto para bloquear el scroll cuando se abren modales
  useEffect(() => {
    if (showForm || showDetails || showDeleteConfirm) {
      // Guardar la posición actual del scroll
      const scrollY = window.scrollY;
      // Bloquear el scroll del body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restaurar el scroll del body
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    return () => {
      // Limpiar al desmontar
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [showForm, showDetails, showDeleteConfirm]);

  useEffect(() => {
    if (showForm) {
      Object.keys(touchedFields).forEach(fieldName => {
        if (touchedFields[fieldName]) {
          validateField(fieldName, newTipoCabana[fieldName]);
        }
      });
    }
  }, [newTipoCabana, showForm, touchedFields]);

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
    else if (fieldName === 'estado') {
      success = value === true || value === "true" ? "Tipo de cabaña activo" : "Tipo de cabaña inactivo";
    }
    else if (trimmedValue) {
      success = `${fieldName === 'nombreTipoCabana' ? 'Nombre' : 'Descripción'} válido.`;
      
      if (fieldName === 'nombreTipoCabana' && trimmedValue.length > 30) {
        warning = "El nombre es bastante largo. Considere un nombre más corto si es posible.";
      } else if (fieldName === 'descripcion' && trimmedValue.length > 150) {
        warning = "La descripción es muy larga. Considere ser más conciso.";
      } else if (fieldName === 'descripcion' && trimmedValue.length < 10) {
        warning = "La descripción es muy breve. Sea más descriptivo.";
      }
    }

    if (fieldName === 'nombreTipoCabana' && trimmedValue && !error) {
      const duplicate = tiposCabana.find(tipo => 
        tipo.nombreTipoCabana.toLowerCase() === trimmedValue.toLowerCase() && 
        (!isEditing || tipo.idTipoCabana !== newTipoCabana.idTipoCabana)
      );
      if (duplicate) {
        error = "Ya existe un tipo de cabaña con este nombre.";
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
      nombreTipoCabana: true,
      descripcion: true,
      estado: true
    };
    setTouchedFields(allFieldsTouched);

    const nombreValid = validateField('nombreTipoCabana', newTipoCabana.nombreTipoCabana);
    const descripcionValid = validateField('descripcion', newTipoCabana.descripcion);
    const estadoValid = validateField('estado', newTipoCabana.estado);

    const isValid = nombreValid && descripcionValid && estadoValid;
    
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
  // FUNCIONES DE FILTRADO MEJORADAS - IGUAL QUE EN ROLES Y SEDES
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
      estado: "all",
      fechaDesde: "",
      fechaHasta: ""
    });
    setCurrentPage(1);
  };

  // Contador de filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.estado !== "all") count++;
    if (filters.fechaDesde) count++;
    if (filters.fechaHasta) count++;
    return count;
  }, [filters]);

  // ===============================================
  // FUNCIONES DE LA API CORREGIDAS
  // ===============================================
  const fetchTiposCabana = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔄 Intentando conectar a:", API_TIPO_CABANA);
      const res = await axios.get(API_TIPO_CABANA, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log("✅ Respuesta de la API:", res);
      console.log("📊 Datos recibidos:", res.data);
      
      if (Array.isArray(res.data)) {
        setTiposCabana(res.data);
        console.log(`📝 ${res.data.length} tipos de cabaña cargados`);
      } else if (res.data && Array.isArray(res.data.$values)) {
        setTiposCabana(res.data.$values);
        console.log(`📝 ${res.data.$values.length} tipos de cabaña cargados`);
      } else {
        console.warn("⚠️ Formato de datos inesperado:", res.data);
        throw new Error("Formato de datos inválido del servidor");
      }
    } catch (error) {
      console.error("❌ Error completo al cargar:", error);
      handleApiError(error, "cargar los tipos de cabaña");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTipoCabana = async (e) => {
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
      // FORMATO CORREGIDO: Enviar exactamente como espera la API
      const tipoCabanaData = {
        idTipoCabana: isEditing ? newTipoCabana.idTipoCabana : 0,
        nombreTipoCabana: newTipoCabana.nombreTipoCabana.trim(),
        descripcion: newTipoCabana.descripcion.trim(),
        estado: newTipoCabana.estado === "true" || newTipoCabana.estado === true
      };

      console.log("📤 Enviando datos a la API:", tipoCabanaData);

      let response;
      if (isEditing) {
        response = await axios.put(
          `${API_TIPO_CABANA}/${newTipoCabana.idTipoCabana}`, 
          tipoCabanaData,
          {
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
        console.log("✅ Respuesta de actualización:", response.data);
        displayAlert("Tipo de cabaña actualizado exitosamente.", "success");
      } else {
        response = await axios.post(
          API_TIPO_CABANA, 
          tipoCabanaData,
          {
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
        console.log("✅ Respuesta de creación:", response.data);
        displayAlert("Tipo de cabaña agregado exitosamente.", "success");
      }
      
      await fetchTiposCabana();
      closeForm();
    } catch (error) {
      console.error("❌ Error completo:", error);
      console.error("❌ Respuesta del error:", error.response?.data);
      handleApiError(error, isEditing ? "actualizar el tipo de cabaña" : "agregar el tipo de cabaña");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  // ===============================================
  // FUNCIÓN DE ELIMINACIÓN CORREGIDA
  // ===============================================
  const confirmDelete = async () => {
    if (!tipoCabanaToDelete) return;
    setLoading(true);
    try {
      console.log("🗑️ Intentando eliminar:", tipoCabanaToDelete.idTipoCabana);
      
      await axios.delete(`${API_TIPO_CABANA}/${tipoCabanaToDelete.idTipoCabana}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTiposCabana(prev => prev.filter(t => t.idTipoCabana !== tipoCabanaToDelete.idTipoCabana));
      displayAlert("Tipo de cabaña eliminado correctamente.", "success");
    } catch (error) {
      console.error("❌ Error al eliminar tipo de cabaña:", error);
      console.error("❌ Detalles del error:", error.response?.data);
      
      if (error.response && error.response.status === 409) {
        displayAlert("No se puede eliminar el tipo de cabaña porque está siendo utilizado en cabañas existentes.", "error");
      } else if (error.response && error.response.status === 404) {
        displayAlert("El tipo de cabaña no fue encontrado en el servidor.", "error");
      } else {
        handleApiError(error, "eliminar el tipo de cabaña");
      }
    } finally {
      setLoading(false);
      setTipoCabanaToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  // ===============================================
  // FUNCIONES AUXILIARES MEJORADAS
  // ===============================================
  const handleApiError = (error, operation) => {
    let errorMessage = `Error al ${operation}`;
    let alertType = "error";
    
    console.error(`🔴 Error en ${operation}:`, error);

    if (axios.isAxiosError(error)) {
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        errorMessage = "Error de conexión. Verifica que el servidor esté ejecutándose en https://www.bosquesagrado.somee.com";
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = "No se puede conectar al servidor. Verifica que esté ejecutándose en el puerto 5272";
      } else if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        console.error(`📊 Error ${status}:`, data);
        
        switch (status) {
          case 400:
            errorMessage = `Error de validación: ${data?.title || data?.message || 'Datos inválidos'}`;
            break;
          case 404:
            errorMessage = "Recurso no encontrado en el servidor.";
            break;
          case 409:
            errorMessage = data?.message || "Conflicto: El registro no puede ser procesado.";
            alertType = "warning";
            break;
          case 500:
            errorMessage = `Error interno del servidor: ${data?.title || 'Contacta al administrador'}`;
            break;
          default:
            errorMessage = `Error ${status}: ${JSON.stringify(data)}`;
        }
      } else if (error.request) {
        errorMessage = "El servidor no respondió. Verifica que la API esté funcionando.";
      }
    } else {
      errorMessage = `Error: ${error.message}`;
    }
    
    setError(errorMessage);
    displayAlert(errorMessage, alertType);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTipoCabana((prev) => ({
      ...prev,
      [name]: name === 'estado' ? (value === "true") : value
    }));
  };

  const handleInputBlur = (e) => {
    const { name } = e.target;
    markFieldAsTouched(name);
    validateField(name, newTipoCabana[name]);
  };

  const toggleEstado = async (tipoCabana) => {
    setLoading(true);
    try {
      const updatedTipoCabana = { 
        ...tipoCabana, 
        estado: !tipoCabana.estado 
      };
      
      console.log("🔄 Actualizando estado:", updatedTipoCabana);
      
      const response = await axios.put(
        `${API_TIPO_CABANA}/${tipoCabana.idTipoCabana}`, 
        updatedTipoCabana,
        {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      console.log("✅ Estado actualizado:", response.data);
      
      displayAlert(`Tipo de cabaña ${updatedTipoCabana.estado ? 'activado' : 'desactivado'} exitosamente.`, "success");
      await fetchTiposCabana();
    } catch (error) {
      console.error("❌ Error al cambiar estado:", error);
      handleApiError(error, "cambiar el estado");
    } finally {
      setLoading(false);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
    setTouchedFields({});
    setNewTipoCabana({
      idTipoCabana: 0,
      nombreTipoCabana: "",
      descripcion: "",
      estado: true
    });
  };

  const closeDetailsModal = () => {
    setShowDetails(false);
    setSelectedTipoCabana(null);
  };

  const cancelDelete = () => {
    setTipoCabanaToDelete(null);
    setShowDeleteConfirm(false);
  };

  const handleView = (tipoCabana) => {
    setSelectedTipoCabana(tipoCabana);
    setShowDetails(true);
  };

  const handleEdit = (tipoCabana) => {
    setNewTipoCabana({
      ...tipoCabana,
      estado: tipoCabana.estado
    });
    setIsEditing(true);
    setShowForm(true);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
    setTouchedFields({});
  };

  const handleDeleteClick = (tipoCabana) => {
    setTipoCabanaToDelete(tipoCabana);
    setShowDeleteConfirm(true);
  };

  // ===============================================
  // FUNCIONES DE FILTRADO Y PAGINACIÓN MEJORADAS
  // ===============================================
  const filteredTiposCabana = useMemo(() => {
    let filtered = tiposCabana.filter(tipo => {
      // Búsqueda general
      const matchesSearch = 
        tipo.nombreTipoCabana?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tipo.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Filtro por estado
      if (filters.estado !== "all") {
        const estadoFilter = filters.estado === "activo";
        if (tipo.estado !== estadoFilter) return false;
      }

      return true;
    });

    return filtered;
  }, [tiposCabana, searchTerm, filters]);

  const totalPages = Math.ceil(filteredTiposCabana.length / ITEMS_PER_PAGE);

  const paginatedTiposCabana = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTiposCabana.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTiposCabana, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Función para obtener el icono según el tipo de cabaña
  const getTipoIcon = (nombreTipo) => {
    const nombre = nombreTipo?.toLowerCase();
    if (nombre?.includes('lujo') || nombre?.includes('premium') || nombre?.includes('vip')) {
      return <FaStar style={{ color: '#FFD700' }} />;
    } else if (nombre?.includes('familiar') || nombre?.includes('family')) {
      return <FaHome style={{ color: '#4CAF50' }} />;
    } else if (nombre?.includes('económica') || nombre?.includes('economica') || nombre?.includes('standard')) {
      return <FaBed style={{ color: '#2196F3' }} />;
    } else if (nombre?.includes('rústica') || nombre?.includes('rustica') || nombre?.includes('campestre')) {
      return <FaTree style={{ color: '#8B4513' }} />;
    } else if (nombre?.includes('suite') || nombre?.includes('ejecutiva')) {
      return <FaCouch style={{ color: '#9C27B0' }} />;
    } else {
      return <FaHome style={{ color: '#679750' }} />;
    }
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
              onClick={fetchTiposCabana}
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
          <h2 style={{ margin: 0, color: "#2E5939" }}>Gestión de Tipos de Cabaña</h2>
          <p style={{ margin: "5px 0 0 0", color: "#679750", fontSize: "14px" }}>
            {tiposCabana.length} tipos registrados • 
            {tiposCabana.filter(t => t.estado).length} activos
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
            setNewTipoCabana({
              idTipoCabana: 0,
              nombreTipoCabana: "",
              descripcion: "",
              estado: true
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
          <FaPlus /> Agregar Tipo
        </button>
      </div>

      {/* Estadísticas */}
      {!loading && tiposCabana.length > 0 && (
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
              {tiposCabana.length}
            </div>
            <div style={{ fontSize: '16px', color: '#679750', fontWeight: '600' }}>
              Total Tipos
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
              {tiposCabana.filter(t => t.estado).length}
            </div>
            <div style={{ fontSize: '16px', color: '#4caf50', fontWeight: '600' }}>
              Tipos Activos
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
              {tiposCabana.filter(t => !t.estado).length}
            </div>
            <div style={{ fontSize: '16px', color: '#e57373', fontWeight: '600' }}>
              Tipos Inactivos
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
              {filteredTiposCabana.length}
            </div>
            <div style={{ fontSize: '16px', color: '#2196f3', fontWeight: '600' }}>
              Resultados Filtrados
            </div>
          </div>
        </div>
      )}

      {/* Barra de búsqueda y filtros - MEJORADO COMO EN ROLES Y SEDES */}
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
              placeholder="Buscar por nombre o descripción..."
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
                  <option value="all">Todos los estados</option>
                  <option value="activo">Activos</option>
                  <option value="inactivo">Inactivos</option>
                </select>
              </div>

              {/* Filtro por fecha de creación */}
              <div>
                <label style={labelStyle}>Fecha Creación Desde</label>
                <input
                  type="date"
                  name="fechaDesde"
                  value={filters.fechaDesde}
                  onChange={handleFilterChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Fecha Creación Hasta</label>
                <input
                  type="date"
                  name="fechaHasta"
                  value={filters.fechaHasta}
                  onChange={handleFilterChange}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        )}

        {/* Información de resultados filtrados */}
        {filteredTiposCabana.length !== tiposCabana.length && (
          <div style={{
            marginTop: '10px',
            padding: '8px 12px',
            backgroundColor: '#E8F5E8',
            borderRadius: '6px',
            color: '#2E5939',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Mostrando {filteredTiposCabana.length} de {tiposCabana.length} tipos de cabaña
            {activeFiltersCount > 0 && ` (filtros aplicados: ${activeFiltersCount})`}
          </div>
        )}
      </div>

      {/* Formulario de agregar/editar */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939" }}>
                {isEditing ? "Editar Tipo de Cabaña" : "Nuevo Tipo de Cabaña"}
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
            
            <form onSubmit={handleAddTipoCabana} style={formContainerStyle}>
              <FormField
                label="Nombre del Tipo"
                name="nombreTipoCabana"
                value={newTipoCabana.nombreTipoCabana}
                onChange={handleChange}
                onBlur={handleInputBlur}
                error={formErrors.nombreTipoCabana}
                success={formSuccess.nombreTipoCabana}
                warning={formWarnings.nombreTipoCabana}
                required={true}
                disabled={loading}
                maxLength={VALIDATION_RULES.nombreTipoCabana.maxLength}
                showCharCount={true}
                placeholder="Ej: Lujo, Familiar, Económica, Premium..."
                touched={touchedFields.nombreTipoCabana}
              />

              <FormField
                label="Descripción"
                name="descripcion"
                type="textarea"
                value={newTipoCabana.descripcion}
                onChange={handleChange}
                onBlur={handleInputBlur}
                error={formErrors.descripcion}
                success={formSuccess.descripcion}
                warning={formWarnings.descripcion}
                required={true}
                disabled={loading}
                maxLength={VALIDATION_RULES.descripcion.maxLength}
                showCharCount={true}
                placeholder="Descripción detallada del tipo de cabaña, características principales..."
                touched={touchedFields.descripcion}
              />

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
                  {loading ? "Guardando..." : (isEditing ? "Actualizar" : "Guardar")} Tipo
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
      {showDetails && selectedTipoCabana && (
        <div style={modalOverlayStyle}>
          <div style={detailsModalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939" }}>Detalles del Tipo de Cabaña</h2>
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
                <div style={detailValueStyle}>#{selectedTipoCabana.idTipoCabana}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Nombre</div>
                <div style={detailValueStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {getTipoIcon(selectedTipoCabana.nombreTipoCabana)}
                    {selectedTipoCabana.nombreTipoCabana}
                  </div>
                </div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Descripción</div>
                <div style={detailValueStyle}>{selectedTipoCabana.descripcion}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Estado</div>
                <div style={{
                  ...detailValueStyle,
                  color: selectedTipoCabana.estado ? '#4caf50' : '#e57373',
                  fontWeight: 'bold'
                }}>
                  {selectedTipoCabana.estado ? '🟢 Activo' : '🔴 Inactivo'}
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
      {showDeleteConfirm && tipoCabanaToDelete && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 500, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 12, color: "#2E5939" }}>Confirmar Eliminación</h3>
            <p style={{ marginBottom: 18, fontSize: '1rem', color: "#2E5939" }}>
              ¿Estás seguro de eliminar de forma permanente el tipo de cabaña "<strong>{tipoCabanaToDelete.nombreTipoCabana}</strong>"? Esta acción no se puede deshacer.
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
                Si el tipo está asociado a cabañas, la eliminación será rechazada por el servidor y se mostrará el motivo.
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
              🔄 Cargando tipos de cabaña...
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
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Tipo</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Descripción</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Estado</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTiposCabana.length === 0 && !loading ? (
                <tr>
                  <td colSpan={4} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <FaInfoCircle size={30} color="#679750" />
                      {tiposCabana.length === 0 ? "No hay tipos de cabaña registrados" : "No se encontraron resultados con los filtros aplicados"}
                      {activeFiltersCount > 0 && (
                        <div style={{ color: '#679750', fontSize: '14px', marginTop: '5px' }}>
                          Filtros activos: {activeFiltersCount}
                        </div>
                      )}
                      {tiposCabana.length === 0 && (
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
                          Agregar Primer Tipo
                        </button>
                      )}
                      {tiposCabana.length > 0 && activeFiltersCount > 0 && (
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
                paginatedTiposCabana.map((tipo) => (
                  <tr key={tipo.idTipoCabana} style={{ 
                    borderBottom: "1px solid #eee",
                    backgroundColor: tipo.estado ? '#fff' : '#f9f9f9'
                  }}>
                    <td style={{ padding: "15px", fontWeight: "500" }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {getTipoIcon(tipo.nombreTipoCabana)}
                        {tipo.nombreTipoCabana}
                      </div>
                    </td>
                    <td style={{ padding: "15px" }}>
                      {tipo.descripcion?.length > 100 
                        ? `${tipo.descripcion.substring(0, 100)}...` 
                        : tipo.descripcion}
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <button
                        onClick={() => toggleEstado(tipo)}
                        disabled={loading}
                        style={{
                          cursor: loading ? "not-allowed" : "pointer",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          border: "none",
                          backgroundColor: tipo.estado ? "#4caf50" : "#e57373",
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
                        {tipo.estado ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <div style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
                        <button
                          onClick={() => handleView(tipo)}
                          style={btnAccion("#F7F4EA", "#2E5939")}
                          title="Ver Detalles"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(tipo)}
                          style={btnAccion("#F7F4EA", "#2E5939")}
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteClick(tipo); }}
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

export default TipoCabana;