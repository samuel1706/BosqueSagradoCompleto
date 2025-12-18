// src/components/Admisede.jsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { FaEye, FaEdit, FaTrash, FaTimes, FaSearch, FaPlus, FaExclamationTriangle, FaCheck, FaInfoCircle, FaMapMarkerAlt, FaBox, FaList, FaSlidersH } from "react-icons/fa";
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
  overflow: "hidden",
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: 30,
  borderRadius: 12,
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  width: "90%",
  maxWidth: 800,
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
  maxWidth: 800,
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
// ESTILOS PARA SELECTORES MÚLTIPLES
// ===============================================
const selectorMultipleStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '15px',
  backgroundColor: '#F7F4EA',
  marginBottom: '15px'
};

const selectorItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '8px',
  marginBottom: '5px',
  backgroundColor: 'white',
  borderRadius: '5px',
  border: '1px solid #e0e0e0'
};

const selectorListStyle = {
  maxHeight: '200px',
  overflowY: 'auto',
  marginTop: '10px',
  border: '1px solid #e0e0e0',
  borderRadius: '5px',
  padding: '10px'
};

// ===============================================
// VALIDACIONES Y PATRONES
// ===============================================
const VALIDATION_PATTERNS = {
  nombreSede: /^(?=.*[a-zA-ZáéíóúÁÉÍÓÚñÑ])[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-_&()]+$/,
  ubicacionSede: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-_.,!?@#$%&*()+=:;"'{}[\]<>/\\|~`^°]+$/,
  celular: /^3[0-9]{9}$/
};

const VALIDATION_RULES = {
  nombreSede: {
    minLength: 2,
    maxLength: 100,
    required: true,
    pattern: VALIDATION_PATTERNS.nombreSede,
    errorMessages: {
      required: "El nombre de la sede es obligatorio.",
      minLength: "El nombre debe tener al menos 2 caracteres.",
      maxLength: "El nombre no puede exceder los 100 caracteres.",
      pattern: "El nombre contiene caracteres no permitidos o no tiene letras.",
      onlyNumbers: "El nombre no puede ser solo números."
    }
  },
  ubicacionSede: {
    minLength: 10,
    maxLength: 200,
    required: true,
    pattern: VALIDATION_PATTERNS.ubicacionSede,
    errorMessages: {
      required: "La ubicación es obligatoria.",
      minLength: "La ubicación debe tener al menos 10 caracteres.",
      maxLength: "La ubicación no puede exceder los 200 caracteres.",
      pattern: "La ubicación contiene caracteres no válidos."
    }
  },
  celular: {
    exactLength: 10,
    required: true,
    pattern: VALIDATION_PATTERNS.celular,
    errorMessages: {
      required: "El número de celular es obligatorio.",
      exactLength: "El celular debe tener exactamente 10 dígitos.",
      pattern: "El celular debe comenzar con 3 y contener solo números."
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
const API_SEDES = "https://www.bosquesagrado.somee.com/api/Sede";
const API_PAQUETES = "https://www.bosquesagrado.somee.com/api/Paquetes";
const API_SEDE_POR_PAQUETE = "https://www.bosquesagrado.somee.com/api/SedePorPaquete";
const API_SEDES_POR_SERVICIO = "https://www.bosquesagrado.somee.com/api/SedePorServicio";
const ITEMS_PER_PAGE = 5;

// ===============================================
// FUNCIÓN PARA FORMATEAR PRECIOS
// ===============================================
const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

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
  options = [],
  maxLength,
  placeholder,
  showCharCount = false,
  rows = 3,
  touched = false
}) => {
  const handleFilteredInputChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (name === 'celular') {
      filteredValue = value.replace(/[^0-9]/g, "").slice(0, 10);
    } else if (name === 'nombreSede') {
      if (value === "" || VALIDATION_PATTERNS.nombreSede.test(value)) {
        filteredValue = value;
      } else {
        return;
      }
    } else if (name === 'ubicacionSede') {
      if (value === "" || VALIDATION_PATTERNS.ubicacionSede.test(value)) {
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
        {required && <span style={{ color: "red" }}></span>}
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
// COMPONENTE PARA SELECTOR MÚLTIPLE DE PAQUETES
// ===============================================
const SelectorPaquetes = ({ 
  paquetes, 
  paquetesSeleccionados, 
  onTogglePaquete 
}) => {
  return (
    <div style={selectorMultipleStyle}>
      <label style={labelStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaBox />
          Paquetes Disponibles en esta Sede
        </div>
      </label>
      
      <div style={selectorListStyle}>
        {paquetes.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#679750', padding: '10px' }}>
            No hay paquetes disponibles
          </div>
        ) : (
          paquetes.map(paquete => (
            <div key={paquete.idPaquete} style={selectorItemStyle}>
              <input
                type="checkbox"
                checked={paquetesSeleccionados.some(sel => sel.idPaquete === paquete.idPaquete)}
                onChange={() => onTogglePaquete(paquete)}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ flex: 1 }}>
                {paquete.nombrePaquete}
                <span style={{ color: '#679750', fontSize: '0.8rem', marginLeft: '8px' }}>
                  ({formatPrice(paquete.precioPaquete)})
                </span>
              </span>
              <span style={{
                fontSize: '0.7rem',
                padding: '2px 6px',
                borderRadius: '10px',
                backgroundColor: paquete.estado ? '#4caf50' : '#e57373',
                color: 'white'
              }}>
                {paquete.estado ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          ))
        )}
      </div>
      
      {paquetesSeleccionados.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ fontSize: '0.8rem', color: '#2E5939', marginBottom: '5px' }}>
            Paquetes seleccionados: {paquetesSeleccionados.length}
          </div>
        </div>
      )}
    </div>
  );
};

// ===============================================
// FUNCIÓN PARA BLOQUEAR/DESBLOQUEAR SCROLL
// ===============================================
const useBodyScrollLock = () => {
  const lockScroll = useCallback(() => {
    const body = document.body;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // Guardar la posición actual del scroll
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Aplicar estilos para bloquear el scroll
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollTop}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    
    // Prevenir el desplazamiento en el cuerpo
    if (scrollBarWidth > 0) {
      body.style.paddingRight = `${scrollBarWidth}px`;
    }
    
    // Guardar la posición del scroll para restaurarla después
    body.setAttribute('data-scroll-position', scrollTop);
  }, []);

  const unlockScroll = useCallback(() => {
    const body = document.body;
    const scrollTop = body.getAttribute('data-scroll-position') || '0';
    
    // Remover estilos de bloqueo
    body.style.removeProperty('overflow');
    body.style.removeProperty('position');
    body.style.removeProperty('top');
    body.style.removeProperty('left');
    body.style.removeProperty('right');
    body.style.removeProperty('width');
    body.style.removeProperty('padding-right');
    
    // Restaurar la posición del scroll
    window.scrollTo(0, parseInt(scrollTop, 10));
    
    body.removeAttribute('data-scroll-position');
  }, []);

  return { lockScroll, unlockScroll };
};

// ===============================================
// COMPONENTE PRINCIPAL Admisede CON GESTIÓN DE PAQUETES Y FILTROS MEJORADOS
// ===============================================
const Admisede = () => {
  const [sedes, setSedes] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [sedePorPaquete, setSedePorPaquete] = useState([]);
  
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

  // Estados para selección múltiple de paquetes
  const [paquetesSeleccionados, setPaquetesSeleccionados] = useState([]);

  // Estados para filtros - MEJORADO COMO EN ROLES
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    estado: "all",
    fechaDesde: "",
    fechaHasta: ""
  });

  const [newItem, setNewItem] = useState({
    nombreSede: "",
    ubicacionSede: "",
    celular: "",
    estado: "true"
  });

  // Hook para manejar el bloqueo del scroll
  const { lockScroll, unlockScroll } = useBodyScrollLock();

  // ===============================================
  // EFECTOS PARA MANEJAR EL SCROLL
  // ===============================================
  useEffect(() => {
    // Bloquear scroll cuando hay modales abiertos
    if (showForm || showDetails || showDeleteConfirm) {
      lockScroll();
    } else {
      unlockScroll();
    }

    // Limpiar al desmontar
    return () => {
      unlockScroll();
    };
  }, [showForm, showDetails, showDeleteConfirm, lockScroll, unlockScroll]);

  // ===============================================
  // EFECTOS
  // ===============================================
  useEffect(() => {
    fetchSedes();
    fetchPaquetes();
    fetchSedePorPaquete();
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
  const fetchSedes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_SEDES);
      setSedes(res.data);
    } catch (error) {
      console.error("❌ Error al obtener sedes:", error);
      handleApiError(error, "cargar las sedes");
    } finally {
      setLoading(false);
    }
  };

  const fetchPaquetes = async () => {
    try {
      const res = await axios.get(API_PAQUETES);
      setPaquetes(res.data);
    } catch (error) {
      console.error("❌ Error al obtener paquetes:", error);
    }
  };

  const fetchSedePorPaquete = async () => {
    try {
      const res = await axios.get(API_SEDE_POR_PAQUETE);
      setSedePorPaquete(res.data);
    } catch (error) {
      console.error("❌ Error al obtener relaciones sede-paquete:", error);
    }
  };

  // Obtener paquetes asociados a una sede
  const getPaquetesDeLaSede = (idSede) => {
    const relaciones = sedePorPaquete.filter(sp => sp.idSede === idSede);
    return relaciones.map(rel => 
      paquetes.find(p => p.idPaquete === rel.idPaquete)
    ).filter(paquete => paquete !== undefined);
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
    else if (trimmedValue && rules.exactLength && trimmedValue.length !== rules.exactLength) {
      error = rules.errorMessages.exactLength;
    }
    else if (trimmedValue && rules.pattern && !rules.pattern.test(trimmedValue)) {
      error = rules.errorMessages.pattern;
    }
    else if (fieldName === 'nombreSede' && /^\d+$/.test(trimmedValue)) {
      error = rules.errorMessages.onlyNumbers;
    }
    else if (trimmedValue) {
      success = `${fieldName === 'nombreSede' ? 'Nombre' : fieldName === 'ubicacionSede' ? 'Ubicación' : fieldName === 'celular' ? 'Celular' : 'Estado'} válido.`;
      
      // Advertencias específicas
      if (fieldName === 'nombreSede' && trimmedValue.length > 50) {
        warning = "El nombre es bastante largo. Considere un nombre más corto si es posible.";
      } else if (fieldName === 'ubicacionSede' && trimmedValue.length < 20) {
        warning = "La ubicación es breve. Sea más específico para mejor ubicación.";
      } else if (fieldName === 'celular') {
        if (!trimmedValue.startsWith('3')) {
          warning = "Los números celulares en Colombia generalmente empiezan con 3.";
        }
      }
    }

    // Verificación de duplicados para nombre y celular
    if ((fieldName === 'nombreSede' || fieldName === 'celular') && trimmedValue && !error) {
      const duplicate = sedes.find(item => {
        if (fieldName === 'nombreSede') {
          return item.nombreSede.toLowerCase() === trimmedValue.toLowerCase() && 
                 (!isEditing || item.idSede !== newItem.idSede);
        } else if (fieldName === 'celular') {
          return item.celular === trimmedValue && 
                 (!isEditing || item.idSede !== newItem.idSede);
        }
        return false;
      });
      
      if (duplicate) {
        error = fieldName === 'nombreSede' 
          ? "Ya existe una sede con este nombre." 
          : "Ya existe una sede con este número de celular.";
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
      nombreSede: true,
      ubicacionSede: true,
      celular: true,
      estado: true
    };
    setTouchedFields(allFieldsTouched);

    const nombreValid = validateField('nombreSede', newItem.nombreSede);
    const ubicacionValid = validateField('ubicacionSede', newItem.ubicacionSede);
    const celularValid = validateField('celular', newItem.celular);
    const estadoValid = validateField('estado', newItem.estado);

    const isValid = nombreValid && ubicacionValid && celularValid && estadoValid;
    
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
  // FUNCIONES PARA SELECTORES MÚLTIPLES
  // ===============================================
  const togglePaquete = (paquete) => {
    setPaquetesSeleccionados(prev => {
      const exists = prev.some(p => p.idPaquete === paquete.idPaquete);
      if (exists) {
        return prev.filter(p => p.idPaquete !== paquete.idPaquete);
      } else {
        return [...prev, paquete];
      }
    });
  };

  // ===============================================
  // FUNCIONES DE FILTRADO MEJORADAS - IGUAL QUE EN ROLES
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
  // FUNCIONES CRUD PARA SEDES
  // ===============================================
  const handleAddSede = async (e) => {
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
      // Preparar datos de la sede
      const sedeData = {
        nombreSede: newItem.nombreSede.trim(),
        ubicacionSede: newItem.ubicacionSede.trim(),
        celular: newItem.celular.trim(),
        estado: newItem.estado === "true" || newItem.estado === true
      };

      let idSedeCreada;

      if (isEditing) {
        // Editar sede existente
        sedeData.idSede = parseInt(newItem.idSede);
        await axios.put(`${API_SEDES}/${newItem.idSede}`, sedeData);
        idSedeCreada = newItem.idSede;
        displayAlert("Sede actualizada exitosamente.", "success");
      } else {
        // Crear nueva sede
        const response = await axios.post(API_SEDES, sedeData);
        idSedeCreada = response.data.idSede;
        displayAlert("Sede agregada exitosamente.", "success");
      }

      // Guardar relaciones con paquetes
      await guardarRelacionesPaquetes(idSedeCreada);

      await fetchSedes();
      await fetchSedePorPaquete();
      closeForm();
    } catch (error) {
      console.error("❌ Error al guardar sede:", error);
      handleApiError(error, isEditing ? "actualizar la sede" : "agregar la sede");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const guardarRelacionesPaquetes = async (idSede) => {
    try {
      // Eliminar relaciones existentes si estamos editando
      if (isEditing) {
        const relacionesExistentes = sedePorPaquete.filter(sp => sp.idSede === parseInt(idSede));
        for (const relacion of relacionesExistentes) {
          await axios.delete(`${API_SEDE_POR_PAQUETE}/${relacion.idSedePorPaquete}`);
        }
      }

      // Crear nuevas relaciones
      for (const paquete of paquetesSeleccionados) {
        await axios.post(API_SEDE_POR_PAQUETE, {
          idSede: parseInt(idSede),
          idPaquete: paquete.idPaquete
        });
      }
    } catch (error) {
      console.error("❌ Error al guardar relaciones sede-paquete:", error);
      throw error;
    }
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      setLoading(true);
      try {
        // Primero eliminar las relaciones con paquetes
        const relacionesPaquetes = sedePorPaquete.filter(sp => sp.idSede === itemToDelete.idSede);
        for (const relacion of relacionesPaquetes) {
          await axios.delete(`${API_SEDE_POR_PAQUETE}/${relacion.idSedePorPaquete}`);
        }

        // Luego eliminar la sede
        await axios.delete(`${API_SEDES}/${itemToDelete.idSede}`);
        displayAlert("Sede eliminada exitosamente.", "success");
        
        await fetchSedes();
        await fetchSedePorPaquete();
        
        if (paginatedItems.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("❌ Error al eliminar sede:", error);
        
        if (error.response && error.response.status === 409) {
          displayAlert("No se puede eliminar la sede porque tiene datos asociados.", "error");
        } else {
          handleApiError(error, "eliminar la sede");
        }
      } finally {
        setLoading(false);
        setItemToDelete(null);
        setShowDeleteConfirm(false);
      }
    }
  };

  const toggleEstado = async (sede) => {
    setLoading(true);
    try {
      const updatedSede = { 
        ...sede, 
        estado: !sede.estado 
      };
      
      await axios.put(`${API_SEDES}/${sede.idSede}`, updatedSede);
      
      displayAlert(`Sede ${updatedSede.estado ? 'activada' : 'desactivada'} exitosamente.`, "success");
      await fetchSedes();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      handleApiError(error, "cambiar el estado de la sede");
    } finally {
      setLoading(false);
    }
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
        errorMessage = "Conflicto: La sede tiene datos asociados y no puede ser eliminada.";
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
    setPaquetesSeleccionados([]);
    setNewItem({
      nombreSede: "",
      ubicacionSede: "",
      celular: "",
      estado: "true"
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

  const handleEdit = async (item) => {
    setNewItem({
      idSede: item.idSede,
      nombreSede: item.nombreSede || "",
      ubicacionSede: item.ubicacionSede || "",
      celular: item.celular || "",
      estado: item.estado.toString()
    });

    // Cargar paquetes asociados
    const paquetesAsociados = getPaquetesDeLaSede(item.idSede);
    setPaquetesSeleccionados(paquetesAsociados);
    
    setIsEditing(true);
    setShowForm(true);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
    setTouchedFields({});
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  // ===============================================
  // FUNCIONES DE FILTRADO Y PAGINACIÓN MEJORADAS
  // ===============================================
  const filteredItems = useMemo(() => {
    let filtered = sedes.filter(item => {
      // Búsqueda general
      const matchesSearch = 
        item.nombreSede?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ubicacionSede?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.celular?.includes(searchTerm);

      if (!matchesSearch) return false;

      // Filtro por estado
      if (filters.estado !== "all") {
        const estadoFilter = filters.estado === "activo";
        if (item.estado !== estadoFilter) return false;
      }

      return true;
    });

    return filtered;
  }, [sedes, searchTerm, filters]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
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
              onClick={() => {
                fetchSedes();
                fetchPaquetes();
                fetchSedePorPaquete();
              }}
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
          <h2 style={{ margin: 0, color: "#2E5939" }}>Gestión de Sedes</h2>
          <p style={{ margin: "5px 0 0 0", color: "#679750", fontSize: "14px" }}>
            {sedes.length} sedes registradas • {sedes.filter(s => s.estado).length} activas
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
            setPaquetesSeleccionados([]);
            setNewItem({
              nombreSede: "",
              ubicacionSede: "",
              celular: "",
              estado: "true"
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
          <FaPlus /> Agregar Sede
        </button>
      </div>

      {/* Estadísticas */}
      {!loading && sedes.length > 0 && (
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
              {sedes.length}
            </div>
            <div style={{ fontSize: '16px', color: '#679750', fontWeight: '600' }}>
              Total Sedes
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
              {sedes.filter(s => s.estado).length}
            </div>
            <div style={{ fontSize: '16px', color: '#4caf50', fontWeight: '600' }}>
              Sedes Activas
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
              {sedes.filter(s => !s.estado).length}
            </div>
            <div style={{ fontSize: '16px', color: '#e57373', fontWeight: '600' }}>
              Sedes Inactivas
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

      {/* Barra de búsqueda y filtros - MEJORADO COMO EN ROLES */}
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
              placeholder="Buscar por nombre, ubicación o celular..."
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
                  <option value="activo">Activas</option>
                  <option value="inactivo">Inactivas</option>
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
        {filteredItems.length !== sedes.length && (
          <div style={{
            marginTop: '10px',
            padding: '8px 12px',
            backgroundColor: '#E8F5E8',
            borderRadius: '6px',
            color: '#2E5939',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Mostrando {filteredItems.length} de {sedes.length} sedes
            {activeFiltersCount > 0 && ` (filtros aplicados: ${activeFiltersCount})`}
          </div>
        )}
      </div>

      {/* Formulario de agregar/editar */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 800 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939", textAlign: 'center' }}>
                {isEditing ? "Editar Sede" : "Agregar Nueva Sede"}
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
            
            <form onSubmit={handleAddSede}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px 20px', marginBottom: '20px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <FormField
                    label="Nombre de la Sede"
                    name="nombreSede"
                    value={newItem.nombreSede}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    error={formErrors.nombreSede}
                    success={formSuccess.nombreSede}
                    warning={formWarnings.nombreSede}
                    required={true}
                    disabled={loading}
                    maxLength={VALIDATION_RULES.nombreSede.maxLength}
                    showCharCount={true}
                    placeholder="Ej: Sede Principal, Sede Norte..."
                    touched={touchedFields.nombreSede}
                  />
                </div>
                
                <div style={{ gridColumn: '1 / -1' }}>
                  <FormField
                    label={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaMapMarkerAlt />
                        Ubicación
                      </div>
                    }
                    name="ubicacionSede"
                    type="textarea"
                    value={newItem.ubicacionSede}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    error={formErrors.ubicacionSede}
                    success={formSuccess.ubicacionSede}
                    warning={formWarnings.ubicacionSede}
                    required={true}
                    disabled={loading}
                    maxLength={VALIDATION_RULES.ubicacionSede.maxLength}
                    showCharCount={true}
                    rows={4}
                    placeholder="Ej: Calle 123 #45-67, Barrio El Poblado, Medellín..."
                    touched={touchedFields.ubicacionSede}
                  />
                </div>
                
                <div>
                  <FormField
                    label="Celular de Contacto"
                    name="celular"
                    type="tel"
                    value={newItem.celular}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    error={formErrors.celular}
                    success={formSuccess.celular}
                    warning={formWarnings.celular}
                    required={true}
                    disabled={loading}
                    maxLength={VALIDATION_RULES.celular.exactLength}
                    placeholder="10 dígitos, comenzando con 3"
                    touched={touchedFields.celular}
                  />
                </div>

                {/* Selector de Paquetes */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <SelectorPaquetes
                    paquetes={paquetes.filter(p => p.estado)}
                    paquetesSeleccionados={paquetesSeleccionados}
                    onTogglePaquete={togglePaquete}
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
                  {loading ? "Guardando..." : (isEditing ? "Actualizar Sede" : "Guardar Sede")}
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
              <h2 style={{ margin: 0, color: "#2E5939", textAlign: 'center' }}>Detalles de la Sede</h2>
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
                <div style={detailValueStyle}>#{currentItem.idSede}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Nombre</div>
                <div style={detailValueStyle}>{currentItem.nombreSede}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaMapMarkerAlt />
                    Ubicación
                  </div>
                </div>
                <div style={{ 
                  backgroundColor: "#F7F4EA", 
                  padding: 15,
                  borderRadius: 8,
                  fontSize: 15,
                  color: '#2E5939',
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  lineHeight: '1.5'
                }}>
                  {currentItem.ubicacionSede}
                </div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Celular</div>
                <div style={detailValueStyle}>{currentItem.celular}</div>
              </div>

              {/* Paquetes asociados */}
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaBox />
                    Paquetes Disponibles ({getPaquetesDeLaSede(currentItem.idSede).length})
                  </div>
                </div>
                <div style={detailValueStyle}>
                  {getPaquetesDeLaSede(currentItem.idSede).length > 0 ? (
                    <div style={selectorListStyle}>
                      {getPaquetesDeLaSede(currentItem.idSede).map(paquete => (
                        <div key={paquete.idPaquete} style={selectorItemStyle}>
                          <span>{paquete.nombrePaquete}</span>
                          <span style={{ color: '#679750', fontSize: '0.8rem' }}>
                            {formatPrice(paquete.precioPaquete)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: '#679750' }}>No hay paquetes asociados</span>
                  )}
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Estado</div>
                <div style={{
                  ...detailValueStyle,
                  color: currentItem.estado ? '#4caf50' : '#e57373',
                  fontWeight: 'bold'
                }}>
                  {currentItem.estado ? '🟢 Activa' : '🔴 Inactiva'}
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
              ¿Estás seguro de eliminar la sede "<strong>{itemToDelete.nombreSede}</strong>"?
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
                Estado: {itemToDelete.estado ? 'Activa' : 'Inactiva'} | 
                Paquetes asociados: {getPaquetesDeLaSede(itemToDelete.idSede).length}
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
              🔄 Cargando sedes...
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
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Ubicación</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Celular</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Paquetes</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Estado</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <FaInfoCircle size={30} color="#679750" />
                      {sedes.length === 0 ? "No hay sedes registradas" : "No se encontraron resultados con los filtros aplicados"}
                      {activeFiltersCount > 0 && (
                        <div style={{ color: '#679750', fontSize: '14px', marginTop: '5px' }}>
                          Filtros activos: {activeFiltersCount}
                        </div>
                      )}
                      {sedes.length === 0 && (
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
                          Agregar Primera Sede
                        </button>
                      )}
                      {sedes.length > 0 && activeFiltersCount > 0 && (
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
                  const paquetesAsociados = getPaquetesDeLaSede(item.idSede);
                  
                  return (
                    <tr key={item.idSede} style={{ 
                      borderBottom: "1px solid #eee",
                      backgroundColor: item.estado ? '#fff' : '#f9f9f9'
                    }}>
                      <td style={{ padding: "15px", fontWeight: "500" }}>{item.nombreSede}</td>
                      <td style={{ padding: "15px" }}>
                        {item.ubicacionSede?.length > 50 
                          ? `${item.ubicacionSede.substring(0, 50)}...` 
                          : item.ubicacionSede}
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>{item.celular}</td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                          <span style={{ fontWeight: 'bold' }}>{paquetesAsociados.length}</span>
                          <span style={{ fontSize: '12px', color: '#679750' }}>
                            paquetes
                          </span>
                        </div>
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
                          {item.estado ? "Activa" : "Inactiva"}
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
                            title="Editar Sede"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            style={btnAccion("#fbe9e7", "#e57373")}
                            title="Eliminar Sede"
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

export default Admisede;