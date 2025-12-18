// src/components/Rol.jsx
import React, { useState, useMemo, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaTimes, FaSearch, FaPlus, FaExclamationTriangle, FaCheck, FaInfoCircle, FaUserShield, FaFilter, FaSync, FaSlidersH } from "react-icons/fa";
import axios from "axios";

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
  overflowY: 'auto',
  padding: '20px 0'
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
  margin: 'auto'
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
  margin: 'auto'
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
  nombreRol: /^(?=.*[a-zA-ZáéíóúÁÉÍÓÚñÑ])[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  descripcion: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-_.,!?@#$%&*()+=:;"'{}[\]<>/\\|~`^]+$/
};

const VALIDATION_RULES = {
  nombreRol: {
    minLength: 2,
    maxLength: 50,
    required: true,
    pattern: VALIDATION_PATTERNS.nombreRol,
    errorMessages: {
      required: "El nombre del rol es obligatorio.",
      minLength: "El nombre debe tener al menos 2 caracteres.",
      maxLength: "El nombre no puede exceder los 50 caracteres.",
      pattern: "El nombre solo puede contener letras y espacios. No se permiten números ni caracteres especiales.",
      onlyNumbers: "El nombre no puede ser solo números."
    }
  },
  descripcion: {
    minLength: 10,
    maxLength: 200,
    required: true,
    pattern: VALIDATION_PATTERNS.descripcion,
    errorMessages: {
      required: "La descripción es obligatoria.",
      minLength: "La descripción debe tener al menos 10 caracteres.",
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
// CONFIGURACIÓN DE API
// ===============================================
const API_ROLES = "https://www.bosquesagrado.somee.com/api/Rol";
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
  error, 
  success,
  warning,
  style = {}, 
  required = true, 
  disabled = false,
  options = [],
  maxLength,
  placeholder,
  showCharCount = false,
  rows = 3,
  touched = false,
  onBlur
}) => {
  const handleFilteredInputChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (name === 'nombreRol') {
      if (value === "" || VALIDATION_PATTERNS.nombreRol.test(value)) {
        filteredValue = value;
      } else {
        return;
      }
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

  const finalOptions = useMemo(() => {
    if (type === "select") {
      const placeholderOption = { value: "", label: placeholder || "Selecciona", disabled: required };
      return [placeholderOption, ...options];
    }
    return options;
  }, [options, type, required, placeholder]);

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
      ) : type === "textarea" ? (
        <div>
          <textarea
            name={name}
            value={value}
            onChange={handleFilteredInputChange}
            onBlur={onBlur}
            style={{
              ...getInputStyle(),
              minHeight: `${rows * 20}px`,
              resize: "vertical",
              fontFamily: "inherit"
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
// COMPONENTE PRINCIPAL Rol CON FILTROS MEJORADOS
// ===============================================
const Rol = () => {
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState({});
  const [formWarnings, setFormWarnings] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  // Estados para filtros - MEJORADO COMO EN USUARIOS
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    estado: "all",
    fechaDesde: "",
    fechaHasta: ""
  });

  const [newItem, setNewItem] = useState({
    nombreRol: "",
    descripcion: "",
    estado: true
  });

  // ===============================================
  // EFECTOS PARA BLOQUEAR SCROLL
  // ===============================================
  useEffect(() => {
    // Efecto para bloquear/desbloquear el scroll del body
    const handleBodyScroll = (shouldBlock) => {
      if (shouldBlock) {
        // Guardar la posición actual del scroll
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflowY = 'hidden';
      } else {
        // Restaurar el scroll
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflowY = '';
        
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
      }
    };

    // Bloquear scroll cuando se abre cualquier modal
    if (showForm || showDetails || showDeleteConfirm) {
      handleBodyScroll(true);
    } else {
      handleBodyScroll(false);
    }

    // Limpiar al desmontar el componente
    return () => {
      handleBodyScroll(false);
    };
  }, [showForm, showDetails, showDeleteConfirm]);

  useEffect(() => {
    fetchRoles();
  }, []);

  // Validar formulario en tiempo real solo para campos tocados
  useEffect(() => {
    if (showForm) {
      Object.keys(touchedFields).forEach(fieldName => {
        if (touchedFields[fieldName]) {
          validateField(fieldName, newItem[fieldName]);
        }
      });
    }
  }, [newItem, showForm, touchedFields]);

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
  // FUNCIONES DE LA API
  // ===============================================
  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_ROLES, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (Array.isArray(res.data)) {
        setRoles(res.data);
      } else {
        throw new Error("Formato de datos inválido");
      }
    } catch (error) {
      console.error("❌ Error al obtener roles:", error);
      handleApiError(error, "cargar los roles");
    } finally {
      setLoading(false);
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
    else if (fieldName === 'nombreRol' && /^\d+$/.test(trimmedValue)) {
      error = rules.errorMessages.onlyNumbers;
    }
    else if (trimmedValue) {
      success = `${fieldName === 'nombreRol' ? 'Nombre' : 'Descripción'} válido.`;
      
      // Advertencias específicas
      if (fieldName === 'nombreRol' && trimmedValue.length > 30) {
        warning = "El nombre es bastante largo. Considere un nombre más corto si es posible.";
      } else if (fieldName === 'descripcion' && trimmedValue.length < 20) {
        warning = "La descripción es muy breve. Sea más específico sobre las funciones del rol.";
      } else if (fieldName === 'descripcion' && trimmedValue.length > 150) {
        warning = "La descripción es muy larga. Considere ser más conciso.";
      }
    }

    // Verificación de duplicados para nombre
    if (fieldName === 'nombreRol' && trimmedValue && !error) {
      const duplicate = roles.find(item => 
        item.nombreRol.toLowerCase() === trimmedValue.toLowerCase() && 
        (!isEditing || item.idRol !== newItem.idRol)
      );
      if (duplicate) {
        error = "Ya existe un rol con este nombre.";
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
      nombreRol: true,
      descripcion: true,
      estado: true
    };
    setTouchedFields(allFieldsTouched);

    const nombreValid = validateField('nombreRol', newItem.nombreRol);
    const descripcionValid = validateField('descripcion', newItem.descripcion);
    const estadoValid = validateField('estado', newItem.estado);

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

  const handleAddRol = async (e) => {
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
      const rolData = {
        nombreRol: newItem.nombreRol.trim(),
        descripcion: newItem.descripcion.trim(),
        estado: newItem.estado === "true" || newItem.estado === true
      };

      console.log("📤 Enviando datos al servidor:", rolData);

      if (isEditing) {
        const dataToUpdate = {
          idRol: parseInt(newItem.idRol),
          ...rolData
        };
        
        await axios.put(`${API_ROLES}/${newItem.idRol}`, dataToUpdate, {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        displayAlert("Rol actualizado exitosamente.", "success");
      } else {
        await axios.post(API_ROLES, rolData, {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        displayAlert("Rol agregado exitosamente.", "success");
      }
      
      await fetchRoles();
      closeForm();
    } catch (error) {
      console.error("❌ Error al guardar rol:", error);
      handleApiError(error, isEditing ? "actualizar el rol" : "agregar el rol");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      setLoading(true);
      try {
        await axios.delete(`${API_ROLES}/${itemToDelete.idRol}`);
        displayAlert("Rol eliminado exitosamente.", "success");
        
        await fetchRoles();
        
        if (paginatedItems.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("❌ Error al eliminar rol:", error);
        
        if (error.response && error.response.status === 409) {
          displayAlert("No se puede eliminar el rol porque tiene usuarios asociados.", "error");
        } else {
          handleApiError(error, "eliminar el rol");
        }
      } finally {
        setLoading(false);
        setItemToDelete(null);
        setShowDeleteConfirm(false);
      }
    }
  };

  const toggleEstado = async (rol) => {
    setLoading(true);
    try {
      const updatedRol = { 
        ...rol, 
        estado: !rol.estado 
      };
      
      await axios.put(`${API_ROLES}/${rol.idRol}`, updatedRol, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      displayAlert(`Rol ${updatedRol.estado ? 'activado' : 'desactivado'} exitosamente.`, "success");
      await fetchRoles();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      handleApiError(error, "cambiar el estado del rol");
    } finally {
      setLoading(false);
    }
  };

  // ===============================================
  // FUNCIONES DE FILTRADO MEJORADAS - IGUAL QUE EN USUARIOS
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

  // ===============================================
  // FUNCIONES AUXILIARES
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
        errorMessage = "Conflicto: El rol tiene usuarios asociados y no puede ser eliminado.";
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
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Nueva función para manejar el blur (cuando el campo pierde el foco)
  const handleInputBlur = (e) => {
    const { name } = e.target;
    markFieldAsTouched(name);
    validateField(name, newItem[name]);
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
    setTouchedFields({}); // Limpiar campos tocados al cerrar
    setNewItem({
      nombreRol: "",
      descripcion: "",
      estado: true
    });
  };

  const closeDetailsModal = () => {
    setShowDetails(false);
    setCurrentItem(null);
  };

  const cancelDelete = () => {
    setItemToDelete(null);
    setShowDeleteConfirm(false);
  };

  const handleView = (item) => {
    setCurrentItem(item);
    setShowDetails(true);
  };

  const handleEdit = (item) => {
    setNewItem({
      idRol: item.idRol,
      nombreRol: item.nombreRol || "",
      descripcion: item.descripcion || "",
      estado: item.estado.toString()
    });
    
    setIsEditing(true);
    setShowForm(true);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
    setTouchedFields({}); // Limpiar campos tocados al editar
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  // ===============================================
  // FUNCIONES DE FILTRADO Y PAGINACIÓN MEJORADAS
  // ===============================================
  const filteredItems = useMemo(() => {
    let filtered = roles.filter(item => {
      // Búsqueda general
      const matchesSearch = 
        item.nombreRol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Filtro por estado
      if (filters.estado !== "all") {
        const estadoFilter = filters.estado === "activo";
        if (item.estado !== estadoFilter) return false;
      }

      return true;
    });

    return filtered;
  }, [roles, searchTerm, filters]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Contador de filtros activos - IGUAL QUE EN USUARIOS
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.estado !== "all") count++;
    if (filters.fechaDesde) count++;
    if (filters.fechaHasta) count++;
    return count;
  }, [filters]);

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
              onClick={fetchRoles}
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
          <h2 style={{ margin: 0, color: "#2E5939" }}>Gestión de Roles</h2>
          <p style={{ margin: "5px 0 0 0", color: "#679750", fontSize: "14px" }}>
            {roles.length} roles registrados • {roles.filter(r => r.estado).length} activos
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
              setNewItem({
                nombreRol: "",
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
            <FaPlus /> Agregar Rol
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      {!loading && roles.length > 0 && (
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
              {roles.length}
            </div>
            <div style={{ fontSize: '16px', color: '#679750', fontWeight: '600' }}>
              Total Roles
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
              {roles.filter(r => r.estado).length}
            </div>
            <div style={{ fontSize: '16px', color: '#4caf50', fontWeight: '600' }}>
              Roles Activos
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
              {roles.filter(r => !r.estado).length}
            </div>
            <div style={{ fontSize: '16px', color: '#e57373', fontWeight: '600' }}>
              Roles Inactivos
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
              {filteredItems.length}
            </div>
            <div style={{ fontSize: '16px', color: '#2196f3', fontWeight: '600' }}>
              Resultados Filtrados
            </div>
          </div>
        </div>
      )}

      {/* Barra de búsqueda y filtros - MEJORADO COMO EN USUARIOS */}
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
        {filteredItems.length !== roles.length && (
          <div style={{
            marginTop: '10px',
            padding: '8px 12px',
            backgroundColor: '#E8F5E8',
            borderRadius: '6px',
            color: '#2E5939',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Mostrando {filteredItems.length} de {roles.length} roles
            {activeFiltersCount > 0 && ` (filtros aplicados: ${activeFiltersCount})`}
          </div>
        )}
      </div>

      {/* Resto del código (Formulario, Modal de detalles, Modal de confirmación, Tabla, Paginación) */}
      {/* Formulario de agregar/editar */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939", textAlign: 'center' }}>
                {isEditing ? "Editar Rol" : "Agregar Nuevo Rol"}
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
            
            <form onSubmit={handleAddRol}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px 20px', marginBottom: '20px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <FormField
                    label={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaUserShield />
                        Nombre del Rol
                      </div>
                    }
                    name="nombreRol"
                    value={newItem.nombreRol}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    error={formErrors.nombreRol}
                    success={formSuccess.nombreRol}
                    warning={formWarnings.nombreRol}
                    required={true}
                    disabled={loading}
                    maxLength={VALIDATION_RULES.nombreRol.maxLength}
                    showCharCount={true}
                    placeholder="Ej: Administrador, Empleado, Cliente..."
                    touched={touchedFields.nombreRol}
                  />
                </div>
                
                <div style={{ gridColumn: '1 / -1' }}>
                  <FormField
                    label="Descripción"
                    name="descripcion"
                    type="textarea"
                    value={newItem.descripcion}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    error={formErrors.descripcion}
                    success={formSuccess.descripcion}
                    warning={formWarnings.descripcion}
                    required={true}
                    disabled={loading}
                    maxLength={VALIDATION_RULES.descripcion.maxLength}
                    showCharCount={true}
                    rows={4}
                    placeholder="Descripción de los permisos y funciones del rol..."
                    touched={touchedFields.descripcion}
                  />
                </div>

              </div>

              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
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
                    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                    transition: "all 0.3s ease",
                    flex: 1
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
                  {loading ? "Guardando..." : (isEditing ? "Actualizar Rol" : "Guardar Rol")}
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
                    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                    flex: 1
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
      {showDetails && currentItem && (
        <div style={modalOverlayStyle}>
          <div style={detailsModalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939", textAlign: 'center' }}>Detalles del Rol</h2>
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
                <div style={detailValueStyle}>#{currentItem.idRol}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaUserShield />
                    Nombre del Rol
                  </div>
                </div>
                <div style={detailValueStyle}>{currentItem.nombreRol}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Estado</div>
                <div style={{
                  ...detailValueStyle,
                  color: currentItem.estado ? '#4caf50' : '#e57373',
                  fontWeight: 'bold'
                }}>
                  {currentItem.estado ? '🟢 Activo' : '🔴 Inactivo'}
                </div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Descripción</div>
                <div style={{ 
                  backgroundColor: "#F7F4EA", 
                  padding: 15,
                  borderRadius: 8,
                  fontSize: 15,
                  color: '#2E5939',
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  lineHeight: '1.5'
                }}>
                  {currentItem.descripcion || "No hay descripción disponible"}
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
      {showDeleteConfirm && itemToDelete && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 450, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 20, color: "#2E5939" }}>Confirmar Eliminación</h3>
            <p style={{ marginBottom: 30, fontSize: '1.1rem', color: "#2E5939" }}>
              ¿Estás seguro de eliminar el rol "<strong>{itemToDelete.nombreRol}</strong>"?
            </p>
            
            <div style={{ 
              backgroundColor: '#fff3cd', 
              border: '1px solid #ffeaa7',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <FaInfoCircle style={{ color: '#856404' }} />
                <strong style={{ color: '#856404' }}>Información</strong>
              </div>
              <p style={{ color: '#856404', margin: 0, fontSize: '0.9rem' }}>
                Estado: {itemToDelete.estado ? 'Activo' : 'Inactivo'}
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
              🔄 Cargando roles...
            </div>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #2E5939',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
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
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Rol</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Descripción</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Estado</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length === 0 && !loading ? (
                <tr>
                  <td colSpan={4} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <FaInfoCircle size={30} color="#679750" />
                      {roles.length === 0 ? "No hay roles registrados" : "No se encontraron resultados con los filtros aplicados"}
                      {activeFiltersCount > 0 && (
                        <div style={{ color: '#679750', fontSize: '14px', marginTop: '5px' }}>
                          Filtros activos: {activeFiltersCount}
                        </div>
                      )}
                      {roles.length === 0 && (
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
                          Agregar Primer Rol
                        </button>
                      )}
                      {roles.length > 0 && activeFiltersCount > 0 && (
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
                paginatedItems.map((item) => (
                  <tr key={item.idRol} style={{ 
                    borderBottom: "1px solid #eee",
                    backgroundColor: item.estado ? '#fff' : '#f9f9f9'
                  }}>
                    <td style={{ padding: "15px", fontWeight: "500" }}>{item.nombreRol}</td>
                    <td style={{ padding: "15px" }}>
                      {item.descripcion?.length > 50 
                        ? `${item.descripcion.substring(0, 50)}...` 
                        : item.descripcion}
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <button
                        onClick={() => toggleEstado(item)}
                        disabled={loading}
                        style={{
                          cursor: loading ? "not-allowed" : "pointer",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          border: "none",
                          backgroundColor: item.estado ? "#4caf50" : "#e57373",
                          color: "white",
                          fontWeight: "600",
                          fontSize: "12px",
                          minWidth: "80px",
                          opacity: loading ? 0.6 : 1
                        }}
                      >
                        {item.estado ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                        <button
                          onClick={() => handleView(item)}
                          style={btnAccion("#F7F4EA", "#2E5939")}
                          title="Ver Detalles"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          style={btnAccion("#F7F4EA", "#2E5939")}
                          title="Editar Rol"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          style={btnAccion("#fbe9e7", "#e57373")}
                          title="Eliminar Rol"
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

export default Rol;