// src/components/Furniture.jsx
import React, { useState, useMemo, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaTimes, FaSearch, FaPlus, FaExclamationTriangle, FaCheck, FaInfoCircle, FaDollarSign, FaBox, FaHome, FaCouch, FaSlidersH } from "react-icons/fa";
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
  maxHeight: 'calc(90vh - 40px)',
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
  maxHeight: 'calc(80vh - 40px)',
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
  nombreComodidades: /^(?=.*[a-zA-ZáéíóúÁÉÍÓÚñÑ])[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-_&()]+$/,
  descripcion: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-_.,!?@#$%&*()+=:;"'{}[\]<>/\\|~`^]+$/
};

const VALIDATION_RULES = {
  nombreComodidades: {
    minLength: 2,
    maxLength: 100,
    required: true,
    pattern: VALIDATION_PATTERNS.nombreComodidades,
    errorMessages: {
      required: "El nombre de la comodidad es obligatorio.",
      minLength: "El nombre debe tener al menos 2 caracteres.",
      maxLength: "El nombre no puede exceder los 100 caracteres.",
      pattern: "El nombre contiene caracteres no permitidos o no tiene letras.",
      onlyNumbers: "El nombre no puede ser solo números."
    }
  },
  descripcion: {
    minLength: 0,
    maxLength: 500,
    required: false,
    pattern: VALIDATION_PATTERNS.descripcion,
    errorMessages: {
      maxLength: "La descripción no puede exceder los 500 caracteres.",
      pattern: "La descripción contiene caracteres no válidos."
    }
  },
  fechaRegistro: {
    required: true,
    errorMessages: {
      required: "La fecha de registro es obligatoria."
    }
  },
  cantidad: {
    min: 0, // Cambiado a 0 para permitir agotar stock
    max: 1000,
    required: true,
    errorMessages: {
      required: "La cantidad es obligatoria.",
      min: "La cantidad mínima es 0.",
      max: "La cantidad máxima es 1000.",
      invalid: "La cantidad debe ser un número entero válido."
    }
  },
  precio: {
    min: 0,
    max: 10000000,
    required: true,
    errorMessages: {
      required: "El precio es obligatorio.",
      min: "El precio mínimo es $0.",
      max: "El precio máximo es $10,000,000.",
      invalid: "El precio debe ser un valor numérico válido."
    }
  }
};

// ===============================================
// CONFIGURACIÓN DE API
// ===============================================
const API_COMODIDADES = "https://www.bosquesagrado.somee.com/api/Comodidades";
const API_CABANA_COMODIDADES = "https://www.bosquesagrado.somee.com/api/CabanaPorComodidades";
const API_CABANAS = "https://www.bosquesagrado.somee.com/api/Cabanas";
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

    if (name === 'nombreComodidades') {
      if (value === "" || VALIDATION_PATTERNS.nombreComodidades.test(value)) {
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
    } else if (name === 'cantidad') {
      filteredValue = value.replace(/[^0-9]/g, "");
      if (filteredValue && parseInt(filteredValue) > (max || 1000)) {
        filteredValue = max || "1000";
      }
    } else if (name === 'precio') {
      filteredValue = value.replace(/[^0-9.]/g, "");
      const parts = filteredValue.split('.');
      if (parts.length > 2) {
        filteredValue = parts[0] + '.' + parts.slice(1).join('');
      }
      if (parts.length === 2 && parts[1].length > 2) {
        filteredValue = parts[0] + '.' + parts[1].substring(0, 2);
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
        {required && <span style={{ color: "red" }}></span>}
      </label>
      {type === "textarea" ? (
        <div>
          <textarea
            name={name}
            value={value}
            onChange={handleFilteredInputChange}
            onBlur={onBlur}
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
            onBlur={onBlur}
            style={
              name === "fechaRegistro" && disabled
                ? yellowBlockedInputStyle
                : getInputStyle()
            }
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
// COMPONENTE PRINCIPAL Furniture (Comodidades) MEJORADO
// ===============================================
const Furniture = () => {
  const [comodidades, setComodidades] = useState([]);
  const [cabanaComodidades, setCabanaComodidades] = useState([]);
  const [cabanas, setCabanas] = useState([]);
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

  // Estados para filtros - MEJORADO COMO EN SEDES
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    stockStatus: "all", // all, available, outOfStock
    fechaDesde: "",
    fechaHasta: ""
  });

  // Función para obtener la fecha actual en formato YYYY-MM-DD
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const [newItem, setNewItem] = useState({
    nombreComodidades: "",
    descripcion: "",
    fechaRegistro: getCurrentDate(),
    cantidad: 1,
    precio: 0
  });

  // ===============================================
  // EFECTOS PARA CONTROLAR EL SCROLL
  // ===============================================
  useEffect(() => {
    // Agregar/quitar clase al body para controlar el scroll
    const body = document.body;
    
    if (showForm || showDetails || showDeleteConfirm) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = 'auto';
    }

    // Cleanup al desmontar
    return () => {
      body.style.overflow = 'auto';
    };
  }, [showForm, showDetails, showDeleteConfirm]);

  useEffect(() => {
    fetchComodidades();
    fetchCabanaComodidades();
    fetchCabanas();
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
  const fetchComodidades = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_COMODIDADES, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (Array.isArray(res.data)) {
        setComodidades(res.data);
      } else {
        throw new Error("Formato de datos inválido");
      }
    } catch (error) {
      console.error("❌ Error al obtener comodidades:", error);
      handleApiError(error, "cargar las comodidades");
    } finally {
      setLoading(false);
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

  const fetchCabanas = async () => {
    try {
      const res = await axios.get(API_CABANAS, { timeout: 10000 });
      if (Array.isArray(res.data)) {
        setCabanas(res.data);
      }
    } catch (error) {
      console.error("Error al obtener cabañas:", error);
    }
  };

  // ===============================================
  // FUNCIONES PARA EL SISTEMA DE STOCK
  // ===============================================
  
  // Función para obtener la cantidad disponible (total - usadas)
  const getCantidadDisponible = (comodidadId) => {
    const comodidad = comodidades.find(c => c.idComodidades === comodidadId);
    if (!comodidad) return 0;
    
    const cantidadUsada = getCantidadUsada(comodidadId);
    return Math.max(0, comodidad.cantidad - cantidadUsada);
  };

  // Función para obtener la cantidad usada en cabañas
  const getCantidadUsada = (comodidadId) => {
    const relaciones = cabanaComodidades.filter(cc => cc.idComodidades === comodidadId);
    return relaciones.length; // Cada relación representa una cabaña que usa esta comodidad
  };

  // Función para verificar si una comodidad puede ser usada (tiene stock disponible)
  const puedeUsarComodidad = (comodidadId) => {
    return getCantidadDisponible(comodidadId) > 0;
  };

  // Función para obtener las cabañas que usan una comodidad
  const getCabanasQueUsanComodidad = (comodidadId) => {
    const relaciones = cabanaComodidades.filter(cc => cc.idComodidades === comodidadId);
    return relaciones.map(relacion => {
      const cabana = cabanas.find(c => c.idCabana === relacion.idCabana);
      return cabana ? cabana.nombre : `Cabaña ${relacion.idCabana}`;
    });
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
    else if (fieldName === 'nombreComodidades' && /^\d+$/.test(trimmedValue)) {
      error = rules.errorMessages.onlyNumbers;
    }
    else if (trimmedValue && (fieldName === 'cantidad' || fieldName === 'precio')) {
      const numericValue = fieldName === 'cantidad' ? parseInt(trimmedValue) : parseFloat(trimmedValue);
      
      if (isNaN(numericValue)) {
        error = rules.errorMessages.invalid;
      } else if (rules.min !== undefined && numericValue < rules.min) {
        error = rules.errorMessages.min;
      } else if (rules.max !== undefined && numericValue > rules.max) {
        error = rules.errorMessages.max;
      } else {
        success = `${fieldName === 'cantidad' ? 'Cantidad' : 'Precio'} válido.`;
        
        // Advertencias específicas
        if (fieldName === 'precio' && numericValue > 1000000) {
          warning = "El precio es bastante alto. Verifique que sea correcto.";
        } else if (fieldName === 'cantidad' && numericValue > 100) {
          warning = "La cantidad es alta. Verifique que sea necesaria.";
        }
      }
    }
    else if (trimmedValue) {
      success = `${fieldName === 'nombreComodidades' ? 'Nombre' : fieldName === 'descripcion' ? 'Descripción' : 'Fecha'} válido.`;
      
      if (fieldName === 'nombreComodidades' && trimmedValue.length > 50) {
        warning = "El nombre es bastante largo. Considere un nombre más corto si es posible.";
      } else if (fieldName === 'descripcion' && trimmedValue.length > 300) {
        warning = "La descripción es muy larga. Considere ser más conciso.";
      }
    }

    // Verificación de duplicados para nombre
    if (fieldName === 'nombreComodidades' && trimmedValue && !error) {
      const duplicate = comodidades.find(item => 
        item.nombreComodidades.toLowerCase() === trimmedValue.toLowerCase() && 
        (!isEditing || item.idComodidades !== newItem.idComodidades)
      );
      if (duplicate) {
        error = "Ya existe una comodidad con este nombre.";
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
      nombreComodidades: true,
      descripcion: true,
      fechaRegistro: true,
      cantidad: true,
      precio: true
    };
    setTouchedFields(allFieldsTouched);

    const nombreValid = validateField('nombreComodidades', newItem.nombreComodidades);
    const descripcionValid = validateField('descripcion', newItem.descripcion);
    const fechaValid = validateField('fechaRegistro', newItem.fechaRegistro);
    const cantidadValid = validateField('cantidad', newItem.cantidad);
    const precioValid = validateField('precio', newItem.precio);

    const isValid = nombreValid && descripcionValid && fechaValid && cantidadValid && precioValid;
    
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

  const handleAddComodidad = async (e) => {
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
      const comodidadData = {
        nombreComodidades: newItem.nombreComodidades.trim(),
        descripcion: newItem.descripcion.trim(),
        fechaRegistro: newItem.fechaRegistro || getCurrentDate(),
        cantidad: parseInt(newItem.cantidad),
        precio: parseFloat(newItem.precio)
      };

      console.log("📤 Enviando datos al servidor:", comodidadData);

      if (isEditing) {
        const dataToUpdate = {
          idComodidades: parseInt(newItem.idComodidades),
          ...comodidadData
        };
        
        await axios.put(`${API_COMODIDADES}/${newItem.idComodidades}`, dataToUpdate, {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        displayAlert("Comodidad actualizada exitosamente.", "success");
      } else {
        await axios.post(API_COMODIDADES, comodidadData, {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        displayAlert("Comodidad agregada exitosamente.", "success");
      }
      
      await fetchComodidades();
      closeForm();
    } catch (error) {
      console.error("❌ Error al guardar comodidad:", error);
      handleApiError(error, isEditing ? "actualizar la comodidad" : "agregar la comodidad");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      // Verificar si la comodidad está siendo usada
      const cantidadUsada = getCantidadUsada(itemToDelete.idComodidades);
      if (cantidadUsada > 0) {
        displayAlert(`No se puede eliminar la comodidad porque está siendo usada en ${cantidadUsada} cabaña(s).`, "error");
        setItemToDelete(null);
        setShowDeleteConfirm(false);
        return;
      }

      setLoading(true);
      try {
        await axios.delete(`${API_COMODIDADES}/${itemToDelete.idComodidades}`);
        displayAlert("Comodidad eliminada exitosamente.", "success");
        await fetchComodidades();
        
        if (paginatedItems.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("❌ Error al eliminar comodidad:", error);
        
        if (error.response && error.response.status === 409) {
          displayAlert("No se puede eliminar la comodidad porque está siendo utilizada en cabañas.", "error");
        } else {
          handleApiError(error, "eliminar la comodidad");
        }
      } finally {
        setLoading(false);
        setItemToDelete(null);
        setShowDeleteConfirm(false);
      }
    }
  };

  // ===============================================
  // FUNCIONES DE FILTRADO MEJORADAS - IGUAL QUE EN SEDES
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
      stockStatus: "all",
      fechaDesde: "",
      fechaHasta: ""
    });
    setCurrentPage(1);
  };

  // Contador de filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.stockStatus !== "all") count++;
    if (filters.fechaDesde) count++;
    if (filters.fechaHasta) count++;
    return count;
  }, [filters]);

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
        errorMessage = "Conflicto: La comodidad está siendo utilizada y no puede ser eliminada.";
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
    setTouchedFields({});
    setNewItem({
      nombreComodidades: "",
      descripcion: "",
      fechaRegistro: getCurrentDate(),
      cantidad: 1,
      precio: 0
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
    try {
      let fechaRegistro = "";
      if (item.fechaRegistro) {
        if (item.fechaRegistro.includes('T')) {
          fechaRegistro = item.fechaRegistro.split('T')[0];
        } else {
          fechaRegistro = item.fechaRegistro;
        }
      } else {
        fechaRegistro = getCurrentDate();
      }

      setNewItem({
        idComodidades: item.idComodidades || "",
        nombreComodidades: item.nombreComodidades || "",
        descripcion: item.descripcion || "",
        fechaRegistro: fechaRegistro,
        cantidad: item.cantidad || 1,
        precio: item.precio || 0
      });
      
      setIsEditing(true);
      setShowForm(true);
      setFormErrors({});
      setFormSuccess({});
      setFormWarnings({});
      setTouchedFields({});
    } catch (error) {
      console.error("❌ Error al cargar datos para edición:", error);
      displayAlert("Error al cargar los datos para edición", "error");
    }
  };

  const handleDeleteClick = (item) => {
    // Verificar si la comodidad está siendo usada
    const cantidadUsada = getCantidadUsada(item.idComodidades);
    if (cantidadUsada > 0) {
      displayAlert(`No se puede eliminar. Esta comodidad está siendo usada en ${cantidadUsada} cabaña(s).`, "warning");
      return;
    }
    
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  // ===============================================
  // FUNCIONES DE FILTRADO Y PAGINACIÓN MEJORADAS
  // ===============================================
  const filteredItems = useMemo(() => {
    let filtered = comodidades.filter(item => {
      // Búsqueda general
      const matchesSearch = 
        item.nombreComodidades?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Filtro por estado de stock
      if (filters.stockStatus !== "all") {
        const disponible = getCantidadDisponible(item.idComodidades);
        if (filters.stockStatus === "available" && disponible === 0) return false;
        if (filters.stockStatus === "outOfStock" && disponible > 0) return false;
      }

      // Filtro por fecha
      if (filters.fechaDesde) {
        const itemDate = new Date(item.fechaRegistro);
        const filterDate = new Date(filters.fechaDesde);
        if (itemDate < filterDate) return false;
      }

      if (filters.fechaHasta) {
        const itemDate = new Date(item.fechaRegistro);
        const filterDate = new Date(filters.fechaHasta);
        if (itemDate > filterDate) return false;
      }

      return true;
    });

    return filtered;
  }, [comodidades, searchTerm, filters]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ===============================================
  // FUNCIONES PARA FORMATEAR DATOS
  // ===============================================
  const formatDate = (dateString) => {
    if (!dateString) return "No especificada";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return "Fecha inválida";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
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
              onClick={fetchComodidades}
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
          <h2 style={{ margin: 0, color: "#2E5939" }}>Gestión de Comodidades</h2>
          <p style={{ margin: "5px 0 0 0", color: "#679750", fontSize: "14px" }}>
            {comodidades.length} comodidades registradas • {comodidades.filter(c => getCantidadDisponible(c.idComodidades) === 0).length} agotadas
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
            setNewItem({
              nombreComodidades: "",
              descripcion: "",
              fechaRegistro: getCurrentDate(),
              cantidad: 1,
              precio: 0
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
          <FaPlus /> Agregar Comodidad
        </button>
      </div>

      {/* Estadísticas */}
      {!loading && comodidades.length > 0 && (
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
              {comodidades.length}
            </div>
            <div style={{ fontSize: '16px', color: '#679750', fontWeight: '600' }}>
              Total Comodidades
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
              {comodidades.filter(c => getCantidadDisponible(c.idComodidades) > 0).length}
            </div>
            <div style={{ fontSize: '16px', color: '#4caf50', fontWeight: '600' }}>
              Con Stock Disponible
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
              {comodidades.filter(c => getCantidadDisponible(c.idComodidades) === 0).length}
            </div>
            <div style={{ fontSize: '16px', color: '#e57373', fontWeight: '600' }}>
              Agotadas
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
              {formatPrice(comodidades.reduce((sum, item) => sum + (item.precio * item.cantidad), 0))}
            </div>
            <div style={{ fontSize: '16px', color: '#2196f3', fontWeight: '600' }}>
              Valor Total en Stock
            </div>
          </div>
        </div>
      )}

      {/* Barra de búsqueda y filtros - MEJORADO COMO EN SEDES */}
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
              {/* Filtro por estado de stock */}
              <div>
                <label style={labelStyle}>Estado de Stock</label>
                <select
                  name="stockStatus"
                  value={filters.stockStatus}
                  onChange={handleFilterChange}
                  style={{
                    ...inputStyle,
                    width: '100%'
                  }}
                >
                  <option value="all">Todos los estados</option>
                  <option value="available">Con stock disponible</option>
                  <option value="outOfStock">Agotadas</option>
                </select>
              </div>

              {/* Filtro por fecha de registro */}
              <div>
                <label style={labelStyle}>Fecha Registro Desde</label>
                <input
                  type="date"
                  name="fechaDesde"
                  value={filters.fechaDesde}
                  onChange={handleFilterChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Fecha Registro Hasta</label>
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
        {filteredItems.length !== comodidades.length && (
          <div style={{
            marginTop: '10px',
            padding: '8px 12px',
            backgroundColor: '#E8F5E8',
            borderRadius: '6px',
            color: '#2E5939',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Mostrando {filteredItems.length} de {comodidades.length} comodidades
            {activeFiltersCount > 0 && ` (filtros aplicados: ${activeFiltersCount})`}
          </div>
        )}
      </div>

      {/* Formulario de agregar/editar */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939", textAlign: 'center' }}>
                {isEditing ? "Editar Comodidad" : "Agregar Nueva Comodidad"}
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
            
            <form onSubmit={handleAddComodidad}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px 20px', marginBottom: '20px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <FormField
                    label={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaBox />
                        Nombre de la Comodidad
                      </div>
                    }
                    name="nombreComodidades"
                    value={newItem.nombreComodidades}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    error={formErrors.nombreComodidades}
                    success={formSuccess.nombreComodidades}
                    warning={formWarnings.nombreComodidades}
                    required={true}
                    disabled={loading}
                    maxLength={VALIDATION_RULES.nombreComodidades.maxLength}
                    showCharCount={true}
                    placeholder="Ej: TV, WiFi, Aire Acondicionado..."
                    touched={touchedFields.nombreComodidades}
                  />
                </div>
                
                <div>
                  <FormField
                    label="Fecha de Registro"
                    name="fechaRegistro"
                    type="date"
                    value={newItem.fechaRegistro}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    error={formErrors.fechaRegistro}
                    success={formSuccess.fechaRegistro}
                    warning={formWarnings.fechaRegistro}
                    required={true}
                    disabled={loading || isEditing}
                    min={getCurrentDate()}
                    max="2099-12-31"
                    touched={touchedFields.fechaRegistro}
                  />
                </div>
                
                <div>
                  <FormField
                    label="Cantidad Total"
                    name="cantidad"
                    type="number"
                    value={newItem.cantidad}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    error={formErrors.cantidad}
                    success={formSuccess.cantidad}
                    warning={formWarnings.cantidad}
                    required={true}
                    disabled={loading}
                    min={VALIDATION_RULES.cantidad.min}
                    max={VALIDATION_RULES.cantidad.max}
                    step="1"
                    touched={touchedFields.cantidad}
                  />
                </div>

                <div>
                  <FormField
                    label={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaDollarSign />
                        Precio Unitario (COP)
                      </div>
                    }
                    name="precio"
                    type="number"
                    value={newItem.precio}
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
                    touched={touchedFields.precio}
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
                    required={false}
                    disabled={loading}
                    maxLength={VALIDATION_RULES.descripcion.maxLength}
                    showCharCount={true}
                    placeholder="Descripción detallada de la comodidad..."
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
                  {loading ? "Guardando..." : (isEditing ? "Actualizar Comodidad" : "Guardar Comodidad")}
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
              <h2 style={{ margin: 0, color: "#2E5939", textAlign: 'center' }}>Detalles de la Comodidad</h2>
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
                <div style={detailValueStyle}>#{currentItem.idComodidades}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Nombre</div>
                <div style={detailValueStyle}>{currentItem.nombreComodidades}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Fecha de Registro</div>
                <div style={detailValueStyle}>{formatDate(currentItem.fechaRegistro)}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Cantidad Total</div>
                <div style={detailValueStyle}>{currentItem.cantidad}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Cantidad Usada</div>
                <div style={detailValueStyle}>
                  <span style={{ 
                    color: getCantidadUsada(currentItem.idComodidades) > 0 ? '#ff9800' : '#4caf50',
                    fontWeight: 'bold'
                  }}>
                    {getCantidadUsada(currentItem.idComodidades)}
                  </span>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Cantidad Disponible</div>
                <div style={detailValueStyle}>
                  <span style={{ 
                    color: getCantidadDisponible(currentItem.idComodidades) > 0 ? '#4caf50' : '#e57373',
                    fontWeight: 'bold'
                  }}>
                    {getCantidadDisponible(currentItem.idComodidades)}
                  </span>
                  {getCantidadDisponible(currentItem.idComodidades) === 0 && (
                    <span style={{ color: '#e57373', marginLeft: '10px', fontSize: '14px' }}>
                      (AGOTADO)
                    </span>
                  )}
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Precio Unitario</div>
                <div style={detailValueStyle}>{formatPrice(currentItem.precio)}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Valor Total en Stock</div>
                <div style={{...detailValueStyle, fontWeight: 'bold', color: '#2E5939'}}>
                  {formatPrice(currentItem.precio * currentItem.cantidad)}
                </div>
              </div>

              {/* Cabañas que usan esta comodidad */}
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaHome />
                    Cabañas que usan esta comodidad
                  </div>
                </div>
                <div style={detailValueStyle}>
                  {getCabanasQueUsanComodidad(currentItem.idComodidades).length > 0 ? (
                    <div style={{ 
                      backgroundColor: "#F7F4EA", 
                      padding: 15,
                      borderRadius: 8,
                      fontSize: 14,
                      color: '#2E5939',
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      lineHeight: '1.5'
                    }}>
                      {getCabanasQueUsanComodidad(currentItem.idComodidades).map((cabana, index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          marginBottom: '5px',
                          padding: '5px'
                        }}>
                          <FaCouch size={12} color="#679750" />
                          {cabana}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: '#999', fontStyle: 'italic' }}>
                      Esta comodidad no está siendo usada en ninguna cabaña
                    </span>
                  )}
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
              ¿Estás seguro de eliminar la comodidad "<strong>{itemToDelete.nombreComodidades}</strong>"?
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
                Valor total: {formatPrice(itemToDelete.precio * itemToDelete.cantidad)}
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
              🔄 Cargando comodidades...
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
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Comodidad</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Fecha Registro</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Cantidad Total</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Usadas</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Disponibles</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Precio Unitario</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length === 0 && !loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <FaInfoCircle size={30} color="#679750" />
                      {comodidades.length === 0 ? "No hay comodidades registradas" : "No se encontraron resultados con los filtros aplicados"}
                      {activeFiltersCount > 0 && (
                        <div style={{ color: '#679750', fontSize: '14px', marginTop: '5px' }}>
                          Filtros activos: {activeFiltersCount}
                        </div>
                      )}
                      {comodidades.length === 0 && (
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
                          Agregar Primera Comodidad
                        </button>
                      )}
                      {comodidades.length > 0 && activeFiltersCount > 0 && (
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
                paginatedItems.map((item) => {
                  const cantidadUsada = getCantidadUsada(item.idComodidades);
                  const cantidadDisponible = getCantidadDisponible(item.idComodidades);
                  const estaAgotada = cantidadDisponible === 0;
                  
                  return (
                    <tr key={item.idComodidades} style={{ 
                      borderBottom: "1px solid #eee",
                      backgroundColor: estaAgotada ? '#fff8e1' : '#fff'
                    }}>
                      <td style={{ padding: "15px", fontWeight: "500" }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {item.nombreComodidades}
                          {estaAgotada && (
                            <span style={{
                              backgroundColor: '#ff9800',
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: 'bold'
                            }}>
                              AGOTADO
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>{formatDate(item.fechaRegistro)}</td>
                      <td style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>{item.cantidad}</td>
                      <td style={{ padding: "15px", textAlign: "center", color: cantidadUsada > 0 ? '#ff9800' : '#4caf50' }}>
                        {cantidadUsada}
                      </td>
                      <td style={{ padding: "15px", textAlign: "center", color: cantidadDisponible > 0 ? '#4caf50' : '#e57373', fontWeight: "bold" }}>
                        {cantidadDisponible}
                      </td>
                      <td style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>{formatPrice(item.precio)}</td>
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
                            title="Editar Comodidad"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            style={{
                              ...btnAccion("#fbe9e7", "#e57373"),
                              opacity: cantidadUsada > 0 ? 0.5 : 1,
                              cursor: cantidadUsada > 0 ? "not-allowed" : "pointer"
                            }}
                            title={cantidadUsada > 0 ? "No se puede eliminar - Está siendo usada" : "Eliminar Comodidad"}
                            disabled={cantidadUsada > 0}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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

export default Furniture;