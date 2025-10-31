// src/components/Gestipaq.jsx
import React, { useState, useMemo, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaTimes, FaSearch, FaPlus, FaExclamationTriangle, FaCheck, FaInfoCircle, FaDollarSign, FaUsers, FaCalendarDay, FaTag, FaImage, FaUpload, FaCamera, FaConciergeBell, FaMapMarkerAlt, FaList, FaHotel, FaBoxOpen, FaPercent } from "react-icons/fa";
import axios from "axios";

// ===============================================
// ESTILOS MEJORADOS (CONSISTENTES CON SERVICIOS)
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

const imagePreviewStyle = {
  position: 'relative',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  maxWidth: '200px'
};

const imageStyle = {
  width: '100%',
  height: '120px',
  objectFit: 'cover',
  display: 'block'
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
  border: '1px solid #e0e0e0',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
};

const selectorItemSelectedStyle = {
  ...selectorItemStyle,
  backgroundColor: '#E8F5E8',
  border: '1px solid #679750'
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
// VALIDACIONES Y PATRONES PARA PAQUETES
// ===============================================
const VALIDATION_PATTERNS = {
  nombrePaquete: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-&]+$/,
  imagen: /^[a-zA-Z0-9\-_\.\/:]+$/
};

const VALIDATION_RULES = {
  nombrePaquete: {
    minLength: 2,
    maxLength: 100,
    required: true,
    pattern: VALIDATION_PATTERNS.nombrePaquete,
    errorMessages: {
      required: "El nombre del paquete es obligatorio.",
      minLength: "El nombre debe tener al menos 2 caracteres.",
      maxLength: "El nombre no puede exceder los 100 caracteres.",
      pattern: "El nombre contiene caracteres no permitidos. Solo se permiten letras, espacios, guiones y el símbolo &."
    }
  },
  precioPaquete: {
    min: 1000,
    max: 10000000,
    required: true,
    errorMessages: {
      required: "El precio es obligatorio.",
      min: "El precio mínimo es $1,000 COP.",
      max: "El precio máximo es $10,000,000 COP.",
      invalid: "El precio debe ser un valor numérico válido."
    }
  },
  personas: {
    min: 1,
    max: 50,
    required: true,
    errorMessages: {
      required: "El número de personas es obligatorio.",
      min: "Mínimo 1 persona.",
      max: "Máximo 50 personas.",
      invalid: "El número de personas debe ser un valor numérico válido."
    }
  },
  dias: {
    min: 1,
    max: 30,
    required: true,
    errorMessages: {
      required: "El número de días es obligatorio.",
      min: "Mínimo 1 día.",
      max: "Máximo 30 días.",
      invalid: "El número de días debe ser un valor numérico válido."
    }
  },
  descuento: {
    min: 0,
    max: 50,
    required: true,
    errorMessages: {
      required: "El descuento es obligatorio.",
      min: "El descuento mínimo es 0%.",
      max: "El descuento máximo es 50%.",
      invalid: "El descuento debe ser un valor numérico válido."
    }
  },
  imagen: {
    maxLength: 500,
    required: false,
    pattern: VALIDATION_PATTERNS.imagen,
    errorMessages: {
      maxLength: "La URL de la imagen no puede exceder los 500 caracteres.",
      pattern: "La URL de la imagen contiene caracteres no válidos."
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
const API_PAQUETES = "http://localhost:5018/api/Paquetes";
const API_SERVICIOS = "http://localhost:5018/api/Servicios";
const API_SEDES = "http://localhost:5018/api/Sede";
const API_SERVICIO_POR_PAQUETE = "http://localhost:5018/api/ServicioPorPaquete";
const API_SEDE_POR_PAQUETE = "http://localhost:5018/api/SedePorPaquete";
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
  icon
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

    if (name === 'nombrePaquete') {
      filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-&]/g, "");
    } else if (name === 'precioPaquete' || name === 'personas' || name === 'dias' || name === 'descuento') {
      filteredValue = value.replace(/[^0-9.]/g, "");
      const parts = filteredValue.split('.');
      if (parts.length > 2) {
        filteredValue = parts[0] + '.' + parts.slice(1).join('');
      }
      if (name === 'precioPaquete' && parts.length === 2 && parts[1].length > 2) {
        filteredValue = parts[0] + '.' + parts[1].substring(0, 2);
      }
    } else if (name === 'imagen') {
      if (value === "" || VALIDATION_PATTERNS.imagen.test(value)) {
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
      paddingLeft: icon ? '40px' : '12px'
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
      ) : (
        <div style={{ position: 'relative' }}>
          {icon && (
            <div style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#2E5939',
              zIndex: 1
            }}>
              {icon}
            </div>
          )}
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
        </div>
      )}
      {getValidationMessage()}
    </div>
  );
};

// ===============================================
// COMPONENTE PARA SELECTOR MÚLTIPLE CORREGIDO
// ===============================================
const SelectorMultiple = ({ 
  titulo, 
  items, 
  itemsSeleccionados, 
  onToggleItem, 
  icon,
  tipo = "multiple", // "multiple" o "single"
  idField = "idServicio" // clave de id que identifica al item (ej. idServicio o idSede)
}) => {
  const isSelected = (item) => {
    return itemsSeleccionados.some(sel => sel && item && sel[idField] === item[idField]);
  };

  const handleItemClick = (item) => {
    if (tipo === "single") {
      if (isSelected(item)) {
        // deseleccionar el mismo
        onToggleItem(item, { action: "deselect", idField });
      } else {
        // seleccionar solo este (reemplaza cualquier otro)
        onToggleItem(item, { action: "selectSingle", idField });
      }
    } else {
      // toggle normal para múltiples
      onToggleItem(item, { action: "toggle", idField });
    }
  };

  return (
    <div style={selectorMultipleStyle}>
      <label style={labelStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon}
          {titulo}
          <span style={{ color: '#679750', fontSize: '0.8rem', marginLeft: '8px' }}>
            ({tipo === "single" ? "Selecciona solo uno" : "Selecciona uno o varios"})
          </span>
        </div>
      </label>
      
      <div style={selectorListStyle}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#679750', padding: '10px' }}>
            No hay elementos disponibles
          </div>
        ) : (
          items.map(item => {
            const selected = isSelected(item);
            return (
              <div 
                key={item[idField]}
                style={selected ? selectorItemSelectedStyle : selectorItemStyle}
                onClick={() => handleItemClick(item)}
                onMouseOver={(e) => {
                  if (!selected) {
                    e.currentTarget.style.backgroundColor = '#f0f0f0';
                  }
                }}
                onMouseOut={(e) => {
                  if (!selected) {
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                <input
                  type={tipo === "single" ? "radio" : "checkbox"}
                  checked={selected}
                  onChange={() => handleItemClick(item)}
                  style={{ cursor: 'pointer' }}
                  name={tipo === "single" ? "selector-unico" : undefined}
                />
                <span style={{ flex: 1 }}>
                  {item.nombre || item.nombreServicio || item.nombreSede}
                  {item.precioServicio && (
                    <span style={{ color: '#679750', fontSize: '0.8rem', marginLeft: '8px' }}>
                      ({formatPrice(item.precioServicio)})
                    </span>
                  )}
                </span>
                {item.estado !== undefined && (
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    backgroundColor: item.estado ? '#4caf50' : '#e57373',
                    color: 'white'
                  }}>
                    {item.estado ? 'Activo' : 'Inactivo'}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
      
      {itemsSeleccionados.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ fontSize: '0.8rem', color: '#2E5939', marginBottom: '5px' }}>
            {tipo === "single" ? 'Seleccionado:' : 'Seleccionados:'} {itemsSeleccionados.length}
          </div>
          {tipo === "multiple" && (
            <div style={{ fontSize: '0.7rem', color: '#679750' }}>
              {itemsSeleccionados.map(item => item.nombre || item.nombreServicio || item.nombreSede).join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ===============================================
// COMPONENTE PRINCIPAL Gestipaq MEJORADO
// ===============================================
const Gestipaq = () => {
  const [paquetes, setPaquetes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [serviciosPorPaquete, setServiciosPorPaquete] = useState([]);
  const [sedesPorPaquete, setSedesPorPaquete] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPaquete, setSelectedPaquete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [paqueteToDelete, setPaqueteToDelete] = useState(null);
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
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

  // Estados para selección múltiple
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [sedesSeleccionadas, setSedesSeleccionadas] = useState([]);

  // Estado inicial basado en la estructura de tu API
  const [newPaquete, setNewPaquete] = useState({
    idPaquete: 0,
    nombrePaquete: "",
    precioPaquete: "",
    personas: "2",
    dias: "1",
    descuento: "0",
    imagen: "",
    estado: "true"
  });

  // ===============================================
  // EFECTOS
  // ===============================================
  useEffect(() => {
    fetchPaquetes();
    fetchServicios();
    fetchSedes();
    fetchServiciosPorPaquete();
    fetchSedesPorPaquete();
  }, []);

  // Validar formulario en tiempo real solo para campos tocados
  useEffect(() => {
    if (showForm) {
      Object.keys(touchedFields).forEach(fieldName => {
        if (touchedFields[fieldName]) {
          validateField(fieldName, newPaquete[fieldName]);
        }
      });
    }
  }, [newPaquete, showForm, touchedFields]);

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
  const fetchPaquetes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_PAQUETES);
      setPaquetes(res.data);
    } catch (error) {
      console.error("❌ Error al obtener paquetes:", error);
      handleApiError(error, "cargar los paquetes");
    } finally {
      setLoading(false);
    }
  };

  const fetchServicios = async () => {
    try {
      const res = await axios.get(API_SERVICIOS);
      setServicios(res.data);
    } catch (error) {
      console.error("❌ Error al obtener servicios:", error);
    }
  };

  const fetchSedes = async () => {
    try {
      const res = await axios.get(API_SEDES);
      setSedes(res.data);
    } catch (error) {
      console.error("❌ Error al obtener sedes:", error);
      // No mostrar error para sedes ya que es opcional
    }
  };

  const fetchServiciosPorPaquete = async () => {
    try {
      const res = await axios.get(API_SERVICIO_POR_PAQUETE);
      setServiciosPorPaquete(res.data);
    } catch (error) {
      console.error("❌ Error al obtener servicios por paquete:", error);
    }
  };

  const fetchSedesPorPaquete = async () => {
    try {
      const res = await axios.get(API_SEDE_POR_PAQUETE);
      setSedesPorPaquete(res.data);
    } catch (error) {
      console.error("❌ Error al obtener sedes por paquete:", error);
    }
  };

  // Obtener servicios asociados a un paquete
  const getServiciosDelPaquete = (idPaquete) => {
    const relaciones = serviciosPorPaquete.filter(sp => sp.idPaquete === idPaquete);
    return relaciones.map(rel => 
      servicios.find(s => s.idServicio === rel.idServicio)
    ).filter(servicio => servicio !== undefined);
  };

  // Obtener sedes asociadas a un paquete
  const getSedesDelPaquete = (idPaquete) => {
    const relaciones = sedesPorPaquete.filter(sp => sp.idPaquete === idPaquete);
    return relaciones.map(rel => 
      sedes.find(s => s.idSede === rel.idSede)
    ).filter(sede => sede !== undefined);
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
    else if (trimmedValue && (fieldName === 'precioPaquete' || fieldName === 'personas' || fieldName === 'dias' || fieldName === 'descuento')) {
      const numericValue = parseFloat(trimmedValue);
      
      if (isNaN(numericValue)) {
        error = rules.errorMessages.invalid;
      } else if (rules.min !== undefined && numericValue < rules.min) {
        error = rules.errorMessages.min;
      } else if (rules.max !== undefined && numericValue > rules.max) {
        error = rules.errorMessages.max;
      } else {
        success = `${fieldName === 'precioPaquete' ? 'Precio' : 
                  fieldName === 'personas' ? 'Personas' :
                  fieldName === 'dias' ? 'Días' : 'Descuento'} válido.`;
        
        // Advertencias específicas
        if (fieldName === 'precioPaquete' && numericValue > 1000000) {
          warning = "El precio es bastante alto. Verifique que sea correcto.";
        } else if (fieldName === 'descuento' && numericValue > 30) {
          warning = "Descuento muy alto. Considere si es sostenible.";
        } else if (fieldName === 'personas' && numericValue > 20) {
          warning = "Grupo grande. Verifique disponibilidad.";
        } else if (fieldName === 'dias' && numericValue > 15) {
          warning = "Estadía extensa. Verifique disponibilidad.";
        }
      }
    }
    else if (fieldName === 'estado') {
      success = value === "true" ? "Paquete activo" : "Paquete inactivo";
    }
    else if (trimmedValue) {
      success = `${fieldName === 'nombrePaquete' ? 'Nombre' : fieldName === 'imagen' ? 'Imagen' : 'Campo'} válido.`;
      
      if (fieldName === 'nombrePaquete' && trimmedValue.length > 50) {
        warning = "El nombre es bastante largo. Considere un nombre más corto si es posible.";
      } else if (fieldName === 'imagen' && !trimmedValue.startsWith('http')) {
        warning = "La URL de la imagen debería comenzar con http:// o https://";
      }
    }

    // Verificación de duplicados para nombre
    if (fieldName === 'nombrePaquete' && trimmedValue && !error) {
      const duplicate = paquetes.find(paquete => 
        paquete.nombrePaquete.toLowerCase() === trimmedValue.toLowerCase() && 
        (!isEditing || paquete.idPaquete !== newPaquete.idPaquete)
      );
      if (duplicate) {
        error = "Ya existe un paquete con este nombre.";
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
      nombrePaquete: true,
      precioPaquete: true,
      personas: true,
      dias: true,
      descuento: true,
      estado: true,
      imagen: true
    };
    setTouchedFields(allFieldsTouched);

    const nombreValid = validateField('nombrePaquete', newPaquete.nombrePaquete);
    const precioValid = validateField('precioPaquete', newPaquete.precioPaquete);
    const personasValid = validateField('personas', newPaquete.personas);
    const diasValid = validateField('dias', newPaquete.dias);
    const descuentoValid = validateField('descuento', newPaquete.descuento);
    const estadoValid = validateField('estado', newPaquete.estado);

    // La imagen es opcional según la API
    const imagenValid = !newPaquete.imagen || validateField('imagen', newPaquete.imagen);

    const isValid = nombreValid && precioValid && personasValid && diasValid && descuentoValid && estadoValid && imagenValid;
    
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
  // FUNCIONES PARA MANEJO DE IMÁGENES
  // ===============================================
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      displayAlert("Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)", "error");
      return;
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      displayAlert("La imagen es demasiado grande. El tamaño máximo es 5MB.", "error");
      return;
    }

    // Crear URL para previsualización
    const imageUrl = URL.createObjectURL(file);
    setImagenSeleccionada({
      file,
      preview: imageUrl,
      isNew: true
    });

    // También actualizar el campo de imagen en el formulario
    setNewPaquete(prev => ({
      ...prev,
      imagen: imageUrl // URL temporal para previsualización
    }));

    e.target.value = ''; // Reset input
  };

  const removeImage = () => {
    if (imagenSeleccionada && imagenSeleccionada.isNew) {
      URL.revokeObjectURL(imagenSeleccionada.preview);
    }
    setImagenSeleccionada(null);
    setNewPaquete(prev => ({
      ...prev,
      imagen: ""
    }));
  };

  // ===============================================
  // FUNCIONES PARA SELECTORES MÚLTIPLES CORREGIDAS
  // ===============================================
  const toggleServicio = (servicio, opts = { action: "toggle", idField: "idServicio" }) => {
    const { action, idField } = opts;
    setServiciosSeleccionados(prev => {
      if (action === "selectSingle") {
        return [servicio];
      } else if (action === "deselect") {
        return prev.filter(s => s[idField] !== servicio[idField]);
      } else { // toggle
        const exists = prev.some(s => s[idField] === servicio[idField]);
        if (exists) return prev.filter(s => s[idField] !== servicio[idField]);
        return [...prev, servicio];
      }
    });
  };

  const toggleSede = (sede, opts = { action: "toggle", idField: "idSede" }) => {
    const { action, idField } = opts;
    setSedesSeleccionadas(prev => {
      if (action === "selectSingle") {
        return [sede];
      } else if (action === "deselect") {
        return prev.filter(s => s[idField] !== sede[idField]);
      } else { // toggle
        const exists = prev.some(s => s[idField] === sede[idField]);
        if (exists) return prev.filter(s => s[idField] !== sede[idField]);
        return [...prev, sede];
      }
    });
  };

  // ===============================================
  // FUNCIONES CRUD PARA PAQUETES
  // ===============================================
  const handleAddPaquete = async (e) => {
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
      // Preparar datos del paquete
      const paqueteData = {
        nombrePaquete: newPaquete.nombrePaquete.trim(),
        precioPaquete: parseFloat(newPaquete.precioPaquete),
        personas: parseInt(newPaquete.personas),
        dias: parseInt(newPaquete.dias),
        descuento: parseFloat(newPaquete.descuento),
        imagen: newPaquete.imagen?.trim() || null,
        estado: newPaquete.estado === "true"
      };

      let idPaqueteCreado;

      if (isEditing) {
        // Editar paquete existente
        paqueteData.idPaquete = parseInt(newPaquete.idPaquete);
        await axios.put(`${API_PAQUETES}/${newPaquete.idPaquete}`, paqueteData);
        idPaqueteCreado = newPaquete.idPaquete;
        displayAlert("Paquete actualizado exitosamente.", "success");
      } else {
        // Crear nuevo paquete
        const response = await axios.post(API_PAQUETES, paqueteData);
        idPaqueteCreado = response.data.idPaquete;
        displayAlert("Paquete agregado exitosamente.", "success");
      }

      // Guardar relaciones con servicios
      await guardarRelacionesServicios(idPaqueteCreado);
      
      // Guardar relaciones con sedes
      await guardarRelacionesSedes(idPaqueteCreado);

      await fetchPaquetes();
      await fetchServiciosPorPaquete();
      await fetchSedesPorPaquete();
      closeForm();
    } catch (error) {
      console.error("❌ Error al guardar paquete:", error);
      handleApiError(error, isEditing ? "actualizar el paquete" : "agregar el paquete");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const guardarRelacionesServicios = async (idPaquete) => {
    try {
      // Eliminar relaciones existentes si estamos editando
      if (isEditing) {
        const relacionesExistentes = serviciosPorPaquete.filter(sp => sp.idPaquete === parseInt(idPaquete));
        for (const relacion of relacionesExistentes) {
          await axios.delete(`${API_SERVICIO_POR_PAQUETE}/${relacion.idServicioPaquete}`);
        }
      }

      // Crear nuevas relaciones
      for (const servicio of serviciosSeleccionados) {
        await axios.post(API_SERVICIO_POR_PAQUETE, {
          idServicio: servicio.idServicio,
          idPaquete: parseInt(idPaquete)
        });
      }
    } catch (error) {
      console.error("❌ Error al guardar relaciones servicios-paquete:", error);
      throw error;
    }
  };

  const guardarRelacionesSedes = async (idPaquete) => {
    try {
      // Eliminar relaciones existentes si estamos editando
      if (isEditing) {
        const relacionesExistentes = sedesPorPaquete.filter(sp => sp.idPaquete === parseInt(idPaquete));
        for (const relacion of relacionesExistentes) {
          await axios.delete(`${API_SEDE_POR_PAQUETE}/${relacion.idSedePorPaquete}`);
        }
      }

      // Crear nuevas relaciones
      for (const sede of sedesSeleccionadas) {
        await axios.post(API_SEDE_POR_PAQUETE, {
          idSede: sede.idSede,
          idPaquete: parseInt(idPaquete)
        });
      }
    } catch (error) {
      console.error("❌ Error al guardar relaciones sedes-paquete:", error);
      throw error;
    }
  };

  const confirmDelete = async () => {
    if (paqueteToDelete) {
      setLoading(true);
      try {
        // Primero eliminar las relaciones
        const relacionesServicios = serviciosPorPaquete.filter(sp => sp.idPaquete === paqueteToDelete.idPaquete);
        for (const relacion of relacionesServicios) {
          await axios.delete(`${API_SERVICIO_POR_PAQUETE}/${relacion.idServicioPaquete}`);
        }

        const relacionesSedes = sedesPorPaquete.filter(sp => sp.idPaquete === paqueteToDelete.idPaquete);
        for (const relacion of relacionesSedes) {
          await axios.delete(`${API_SEDE_POR_PAQUETE}/${relacion.idSedePorPaquete}`);
        }

        // Luego eliminar el paquete
        await axios.delete(`${API_PAQUETES}/${paqueteToDelete.idPaquete}`);
        displayAlert("Paquete eliminado exitosamente.", "success");
        
        await fetchPaquetes();
        await fetchServiciosPorPaquete();
        await fetchSedesPorPaquete();
        
        if (paginatedPaquetes.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("❌ Error al eliminar paquete:", error);
        
        if (error.response && error.response.status === 409) {
          displayAlert("No se puede eliminar el paquete porque está siendo utilizado en reservas.", "error");
        } else {
          handleApiError(error, "eliminar el paquete");
        }
      } finally {
        setLoading(false);
        setPaqueteToDelete(null);
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
      errorMessage = "No se puede conectar al servidor en http://localhost:5018";
    } else if (error.response) {
      if (error.response.status === 400) {
        errorMessage = `Error de validación: ${error.response.data?.title || error.response.data?.message || 'Datos inválidos'}`;
      } else if (error.response.status === 404) {
        errorMessage = "Recurso no encontrado.";
      } else if (error.response.status === 409) {
        errorMessage = "Conflicto: El paquete está siendo utilizado y no puede ser eliminado.";
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
    setNewPaquete((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Nueva función para manejar el blur (cuando el campo pierde el foco)
  const handleInputBlur = (e) => {
    const { name } = e.target;
    markFieldAsTouched(name);
    validateField(name, newPaquete[name]);
  };

  const toggleEstado = async (paquete) => {
    setLoading(true);
    try {
      const updatedPaquete = { 
        ...paquete, 
        estado: !paquete.estado 
      };
      await axios.put(`${API_PAQUETES}/${paquete.idPaquete}`, updatedPaquete);
      displayAlert(`Paquete ${updatedPaquete.estado ? 'activado' : 'desactivado'} exitosamente.`, "success");
      await fetchPaquetes();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
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
    setImagenSeleccionada(null);
    setServiciosSeleccionados([]);
    setSedesSeleccionadas([]);
    setNewPaquete({
      idPaquete: 0,
      nombrePaquete: "",
      precioPaquete: "",
      personas: "2",
      dias: "1",
      descuento: "0",
      imagen: "",
      estado: "true"
    });
  };

  const closeDetailsModal = () => {
    setShowDetails(false);
    setSelectedPaquete(null);
  };

  const cancelDelete = () => {
    setPaqueteToDelete(null);
    setShowDeleteConfirm(false);
  };

  const handleView = (paquete) => {
    setSelectedPaquete(paquete);
    setShowDetails(true);
  };

  const handleEdit = async (paquete) => {
    setNewPaquete({
      ...paquete,
      precioPaquete: paquete.precioPaquete.toString(),
      personas: paquete.personas.toString(),
      dias: paquete.dias.toString(),
      descuento: paquete.descuento.toString(),
      imagen: paquete.imagen || "",
      estado: paquete.estado ? "true" : "false"
    });

    // Cargar imagen existente si hay una
    if (paquete.imagen) {
      setImagenSeleccionada({
        preview: paquete.imagen,
        isNew: false
      });
    }

    // Cargar servicios asociados
    const serviciosAsociados = getServiciosDelPaquete(paquete.idPaquete);
    setServiciosSeleccionados(serviciosAsociados);

    // Cargar sedes asociadas
    const sedesAsociadas = getSedesDelPaquete(paquete.idPaquete);
    setSedesSeleccionadas(sedesAsociadas);

    setIsEditing(true);
    setShowForm(true);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
    setTouchedFields({});
  };

  const handleDeleteClick = (paquete) => {
    setPaqueteToDelete(paquete);
    setShowDeleteConfirm(true);
  };

  // ===============================================
  // FUNCIONES DE FILTRADO Y PAGINACIÓN
  // ===============================================
  const filteredPaquetes = useMemo(() => {
    return paquetes.filter(paquete =>
      paquete.nombrePaquete?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [paquetes, searchTerm]);

  const totalPages = Math.ceil(filteredPaquetes.length / ITEMS_PER_PAGE);

  const paginatedPaquetes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPaquetes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPaquetes, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ===============================================
  // FUNCIONES PARA FORMATEAR DATOS
  // ===============================================
  const calcularPrecioConDescuento = (precio, descuento) => {
    return precio - (precio * descuento / 100);
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
                fetchPaquetes();
                fetchServicios();
                fetchSedes();
                fetchServiciosPorPaquete();
                fetchSedesPorPaquete();
              }}
              style={{
                backgroundColor: "#2E5939",
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
          <h2 style={{ margin: 0, color: "#2E5939" }}>Gestión de Paquetes</h2>
          <p style={{ margin: "5px 0 0 0", color: "#679750", fontSize: "14px" }}>
            {paquetes.length} paquetes registrados • {paquetes.filter(p => p.estado).length} activos
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
            setImagenSeleccionada(null);
            setServiciosSeleccionados([]);
            setSedesSeleccionadas([]);
            setNewPaquete({
              idPaquete: 0,
              nombrePaquete: "",
              precioPaquete: "",
              personas: "2",
              dias: "1",
              descuento: "0",
              imagen: "",
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
          <FaPlus /> Agregar Paquete
        </button>
      </div>

      {/* Tarjetas de Estadísticas */}
      {!loading && paquetes.length > 0 && (
        <div style={{
          marginBottom: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <div style={{
            backgroundColor: '#E8F5E8',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center',
            border: '1px solid #679750'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2E5939' }}>
              {paquetes.length}
            </div>
            <div style={{ fontSize: '14px', color: '#679750' }}>
              Total Paquetes
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#E8F5E8',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center',
            border: '1px solid #679750'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2E5939' }}>
              {paquetes.filter(p => p.estado).length}
            </div>
            <div style={{ fontSize: '14px', color: '#679750' }}>
              Paquetes Activos
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#fff8e1',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center',
            border: '1px solid #ffd54f'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff9800' }}>
              {paquetes.filter(p => !p.estado).length}
            </div>
            <div style={{ fontSize: '14px', color: '#ff9800' }}>
              Paquetes Inactivos
            </div>
          </div>

          <div style={{
            backgroundColor: '#E8F5E8',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center',
            border: '1px solid #679750'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2E5939' }}>
              {serviciosPorPaquete.length}
            </div>
            <div style={{ fontSize: '14px', color: '#679750' }}>
              Relaciones Servicios
            </div>
          </div>

          <div style={{
            backgroundColor: '#E8F5E8',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center',
            border: '1px solid #679750'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2E5939' }}>
              {sedesPorPaquete.length}
            </div>
            <div style={{ fontSize: '14px', color: '#679750' }}>
              Relaciones Sedes
            </div>
          </div>
        </div>
      )}

      {/* Barra de búsqueda */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: "relative", maxWidth: 500 }}>
          <FaSearch style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#2E5939" }} />
          <input
            type="text"
            placeholder="Buscar por nombre de paquete..."
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
      </div>

      {/* Formulario de agregar/editar */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 900 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939", textAlign: 'center' }}>
                {isEditing ? "Editar Paquete" : "Agregar Nuevo Paquete"}
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
            
            <form onSubmit={handleAddPaquete}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px 20px', marginBottom: '20px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <FormField
                    label="Nombre del Paquete"
                    name="nombrePaquete"
                    value={newPaquete.nombrePaquete}
                    onChange={handleChange}
                    onBlur={handleInputBlur}
                    error={formErrors.nombrePaquete}
                    success={formSuccess.nombrePaquete}
                    warning={formWarnings.nombrePaquete}
                    required={true}
                    disabled={loading}
                    maxLength={VALIDATION_RULES.nombrePaquete.maxLength}
                    showCharCount={true}
                    placeholder="Ej: Paquete Romántico, Aventura Familiar, Relax Total..."
                    touched={touchedFields.nombrePaquete}
                  />
                </div>

                <div>
                  <FormField
                    label={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaDollarSign />
                        Precio Base (COP)
                      </div>
                    }
                    name="precioPaquete"
                    type="number"
                    value={newPaquete.precioPaquete}
                    onChange={handleChange}
                    onBlur={handleInputBlur}
                    error={formErrors.precioPaquete}
                    success={formSuccess.precioPaquete}
                    warning={formWarnings.precioPaquete}
                    required={true}
                    disabled={loading}
                    min={VALIDATION_RULES.precioPaquete.min}
                    max={VALIDATION_RULES.precioPaquete.max}
                    step="1000"
                    placeholder="1000"
                    touched={touchedFields.precioPaquete}
                    icon={<FaDollarSign />}
                  />
                </div>

                <div>
                  <FormField
                    label={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaUsers />
                        Personas
                      </div>
                    }
                    name="personas"
                    type="number"
                    value={newPaquete.personas}
                    onChange={handleChange}
                    onBlur={handleInputBlur}
                    error={formErrors.personas}
                    success={formSuccess.personas}
                    warning={formWarnings.personas}
                    required={true}
                    disabled={loading}
                    min={VALIDATION_RULES.personas.min}
                    max={VALIDATION_RULES.personas.max}
                    placeholder="2"
                    touched={touchedFields.personas}
                    icon={<FaUsers />}
                  />
                </div>

                <div>
                  <FormField
                    label={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaCalendarDay />
                        Días
                      </div>
                    }
                    name="dias"
                    type="number"
                    value={newPaquete.dias}
                    onChange={handleChange}
                    onBlur={handleInputBlur}
                    error={formErrors.dias}
                    success={formSuccess.dias}
                    warning={formWarnings.dias}
                    required={true}
                    disabled={loading}
                    min={VALIDATION_RULES.dias.min}
                    max={VALIDATION_RULES.dias.max}
                    placeholder="1"
                    touched={touchedFields.dias}
                    icon={<FaCalendarDay />}
                  />
                </div>

                <div>
                  <FormField
                    label={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaTag />
                        Descuento (%)
                      </div>
                    }
                    name="descuento"
                    type="number"
                    value={newPaquete.descuento}
                    onChange={handleChange}
                    onBlur={handleInputBlur}
                    error={formErrors.descuento}
                    success={formSuccess.descuento}
                    warning={formWarnings.descuento}
                    required={true}
                    disabled={loading}
                    min={VALIDATION_RULES.descuento.min}
                    max={VALIDATION_RULES.descuento.max}
                    step="0.1"
                    placeholder="0"
                    touched={touchedFields.descuento}
                    icon={<FaTag />}
                  />
                </div>

                <div>
                  <FormField
                    label="Estado"
                    name="estado"
                    type="select"
                    value={newPaquete.estado}
                    onChange={handleChange}
                    onBlur={handleInputBlur}
                    error={formErrors.estado}
                    success={formSuccess.estado}
                    warning={formWarnings.estado}
                    required={true}
                    disabled={loading}
                    options={[
                      { value: "true", label: "Activo" },
                      { value: "false", label: "Inactivo" }
                    ]}
                    touched={touchedFields.estado}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaImage />
                      Imagen del Paquete
                      <span style={{ color: '#679750', fontSize: '0.8rem', marginLeft: '8px' }}>
                        (Opcional)
                      </span>
                    </div>
                  </label>
                  
                  {/* Área de subida de imagen */}
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
                          Haz clic o arrastra una imagen aquí
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#679750' }}>
                          Formatos: JPEG, PNG, GIF, WebP (Máx. 5MB)
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Campo para URL de imagen */}
                  <FormField
                    label="URL de la Imagen"
                    name="imagen"
                    value={newPaquete.imagen}
                    onChange={handleChange}
                    onBlur={handleInputBlur}
                    error={formErrors.imagen}
                    success={formSuccess.imagen}
                    warning={formWarnings.imagen}
                    required={false}
                    disabled={loading}
                    maxLength={VALIDATION_RULES.imagen.maxLength}
                    showCharCount={true}
                    placeholder="https://ejemplo.com/imagen-paquete.jpg"
                    touched={touchedFields.imagen}
                  />

                  {/* Previsualización de imagen */}
                  {(imagenSeleccionada || newPaquete.imagen) && (
                    <div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '10px'
                      }}>
                        <span style={{ fontWeight: '600', color: '#2E5939' }}>
                          Vista previa
                        </span>
                        <button
                          type="button"
                          onClick={removeImage}
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
                          Eliminar imagen
                        </button>
                      </div>
                      <div style={imagePreviewStyle}>
                        <img 
                          src={imagenSeleccionada ? imagenSeleccionada.preview : newPaquete.imagen} 
                          alt="Preview del paquete"
                          style={imageStyle}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200x120/679750/FFFFFF?text=Imagen+No+Disponible';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Selector de Servicios - MÚLTIPLE */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <SelectorMultiple
                    titulo="Servicios Incluidos"
                    items={servicios.filter(s => s.estado)}
                    itemsSeleccionados={serviciosSeleccionados}
                    onToggleItem={toggleServicio}
                    icon={<FaConciergeBell />}
                    tipo="multiple" // Permite selección múltiple
                    idField="idServicio" // clave de id que identifica al item
                  />
                </div>

                {/* Selector de Sedes - ÚNICO */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <SelectorMultiple
                    titulo="Sede Principal"
                    items={sedes.filter(s => s.estado)}
                    itemsSeleccionados={sedesSeleccionadas}
                    onToggleItem={toggleSede}
                    icon={<FaMapMarkerAlt />}
                    tipo="single" // Permite selección única
                    idField="idSede" // clave de id que identifica al item
                  />
                </div>
              </div>

              {/* Resumen del paquete */}
              {newPaquete.precioPaquete && (
                <div style={{
                  backgroundColor: '#E8F5E8',
                  border: '1px solid #679750',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '20px'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#2E5939' }}>Resumen del Paquete</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                    <div>Precio base:</div>
                    <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      {formatPrice(parseFloat(newPaquete.precioPaquete))}
                    </div>
                    
                    <div>Personas:</div>
                    <div style={{ textAlign: 'right' }}>{newPaquete.personas}</div>
                    
                    <div>Días:</div>
                    <div style={{ textAlign: 'right' }}>{newPaquete.dias}</div>

                    <div>Servicios incluidos:</div>
                    <div style={{ textAlign: 'right' }}>{serviciosSeleccionados.length}</div>

                    <div>Sede principal:</div>
                    <div style={{ textAlign: 'right' }}>
                      {sedesSeleccionadas.length > 0 ? sedesSeleccionadas[0].nombreSede : 'No seleccionada'}
                    </div>
                    
                    {newPaquete.descuento > 0 && (
                      <>
                        <div>Descuento ({newPaquete.descuento}%):</div>
                        <div style={{ textAlign: 'right', color: '#e57373' }}>
                          -{formatPrice(parseFloat(newPaquete.precioPaquete) * parseFloat(newPaquete.descuento) / 100)}
                        </div>
                        
                        <div style={{ borderTop: '1px solid #ccc', paddingTop: '5px' }}>
                          <strong>Precio final:</strong>
                        </div>
                        <div style={{ textAlign: 'right', fontWeight: 'bold', color: '#2E5939', borderTop: '1px solid #ccc', paddingTop: '5px' }}>
                          {formatPrice(calcularPrecioConDescuento(parseFloat(newPaquete.precioPaquete), parseFloat(newPaquete.descuento)))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

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
                  {loading ? "Guardando..." : (isEditing ? "Actualizar Paquete" : "Guardar Paquete")}
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
      {showDetails && selectedPaquete && (
        <div style={modalOverlayStyle}>
          <div style={detailsModalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939", textAlign: 'center' }}>Detalles del Paquete</h2>
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
                <div style={detailValueStyle}>#{selectedPaquete.idPaquete}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Nombre</div>
                <div style={detailValueStyle}>{selectedPaquete.nombrePaquete}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Precio Base</div>
                <div style={detailValueStyle}>{formatPrice(selectedPaquete.precioPaquete)}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Personas</div>
                <div style={detailValueStyle}>{selectedPaquete.personas}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Días</div>
                <div style={detailValueStyle}>{selectedPaquete.dias}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Descuento</div>
                <div style={detailValueStyle}>{selectedPaquete.descuento}%</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Precio Final</div>
                <div style={{...detailValueStyle, fontWeight: 'bold', color: '#679750'}}>
                  {formatPrice(calcularPrecioConDescuento(selectedPaquete.precioPaquete, selectedPaquete.descuento))}
                </div>
              </div>

              {/* Servicios asociados */}
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaConciergeBell />
                    Servicios Incluidos ({getServiciosDelPaquete(selectedPaquete.idPaquete).length})
                  </div>
                </div>
                <div style={detailValueStyle}>
                  {getServiciosDelPaquete(selectedPaquete.idPaquete).length > 0 ? (
                    <div style={selectorListStyle}>
                      {getServiciosDelPaquete(selectedPaquete.idPaquete).map(servicio => (
                        <div key={servicio.idServicio} style={selectorItemStyle}>
                          <span>{servicio.nombreServicio}</span>
                          <span style={{ color: '#679750', fontSize: '0.8rem' }}>
                            {formatPrice(servicio.precioServicio)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: '#679750' }}>No hay servicios asociados</span>
                  )}
                </div>
              </div>

              {/* Sedes asociadas */}
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaMapMarkerAlt />
                    Sede Principal ({getSedesDelPaquete(selectedPaquete.idPaquete).length})
                  </div>
                </div>
                <div style={detailValueStyle}>
                  {getSedesDelPaquete(selectedPaquete.idPaquete).length > 0 ? (
                    <div style={selectorListStyle}>
                      {getSedesDelPaquete(selectedPaquete.idPaquete).map(sede => (
                        <div key={sede.idSede} style={selectorItemStyle}>
                          <span>{sede.nombreSede}</span>
                          <span style={{ color: '#679750', fontSize: '0.8rem' }}>
                            {sede.ubicacionSede}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: '#679750' }}>No hay sede asociada</span>
                  )}
                </div>
              </div>

              {/* Imagen del paquete */}
              {selectedPaquete.imagen && (
                <div style={detailItemStyle}>
                  <div style={detailLabelStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaImage />
                      Imagen del Paquete
                    </div>
                  </div>
                  <div style={detailValueStyle}>
                    <div style={imagePreviewStyle}>
                      <img 
                        src={selectedPaquete.imagen} 
                        alt={selectedPaquete.nombrePaquete}
                        style={imageStyle}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200x120/679750/FFFFFF?text=Imagen+No+Disponible';
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Estado</div>
                <div style={{
                  ...detailValueStyle,
                  color: selectedPaquete.estado ? '#4caf50' : '#e57373',
                  fontWeight: 'bold'
                }}>
                  {selectedPaquete.estado ? '🟢 Activo' : '🔴 Inactivo'}
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
      {showDeleteConfirm && paqueteToDelete && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 450, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 20, color: "#2E5939" }}>Confirmar Eliminación</h3>
            <p style={{ marginBottom: 30, fontSize: '1.1rem', color: "#2E5939" }}>
              ¿Estás seguro de eliminar el paquete "<strong>{paqueteToDelete.nombrePaquete}</strong>"?
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
                <strong style={{ color: '#856404' }}>Paquete a eliminar</strong>
              </div>
              <p style={{ color: '#856404', margin: 0, fontSize: '0.9rem' }}>
                Precio: {formatPrice(paqueteToDelete.precioPaquete)} | 
                Personas: {paqueteToDelete.personas} | 
                Días: {paqueteToDelete.dias} | 
                Estado: {paqueteToDelete.estado ? 'Activo' : 'Inactivo'}
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: '15px' }}>
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
              🔄 Cargando paquetes...
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
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Paquete</th>
                <th style={{ padding: "15px", textAlign: "right", fontWeight: "bold" }}>Precio Base</th>
                <th style={{ padding: "15px", textAlign: "right", fontWeight: "bold" }}>Precio Final</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Servicios</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Sede</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Estado</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPaquetes.length === 0 && !loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <FaInfoCircle size={30} color="#679750" />
                      {paquetes.length === 0 ? "No hay paquetes registrados" : "No se encontraron resultados"}
                      {paquetes.length === 0 && (
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
                          Agregar Primer Paquete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedPaquetes.map((paquete) => {
                  const serviciosAsociados = getServiciosDelPaquete(paquete.idPaquete);
                  const sedesAsociadas = getSedesDelPaquete(paquete.idPaquete);
                  
                  return (
                    <tr key={paquete.idPaquete} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "15px", fontWeight: "500" }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          {paquete.imagen && (
                            <div style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              flexShrink: 0
                            }}>
                              <img 
                                src={paquete.imagen} 
                                alt={paquete.nombrePaquete}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/50x50/679750/FFFFFF?text=P';
                                }}
                              />
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: "600", marginBottom: "5px" }}>
                              {paquete.nombrePaquete}
                            </div>
                            <div style={{ fontSize: "13px", color: "#679750" }}>
                              {paquete.personas} personas • {paquete.dias} días
                              {paquete.descuento > 0 && ` • ${paquete.descuento}% desc.`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "15px", textAlign: "right" }}>
                        {formatPrice(paquete.precioPaquete)}
                      </td>
                      <td style={{ padding: "15px", textAlign: "right", fontWeight: "bold", color: "#679750" }}>
                        {formatPrice(calcularPrecioConDescuento(paquete.precioPaquete, paquete.descuento))}
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                          <span style={{ fontWeight: 'bold' }}>{serviciosAsociados.length}</span>
                          <span style={{ fontSize: '12px', color: '#679750' }}>
                            servicios
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                          <span style={{ fontWeight: 'bold' }}>{sedesAsociadas.length}</span>
                          <span style={{ fontSize: '12px', color: '#679750' }}>
                            sede
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <button
                          onClick={() => toggleEstado(paquete)}
                          disabled={loading}
                          style={{
                            cursor: loading ? "not-allowed" : "pointer",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            border: "none",
                            backgroundColor: paquete.estado ? "#4caf50" : "#e57373",
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
                          {paquete.estado ? "Activo" : "Inactivo"}
                        </button>
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                          <button
                            onClick={() => handleView(paquete)}
                            style={btnAccion("#F7F4EA", "#2E5939")}
                            title="Ver Detalles"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleEdit(paquete)}
                            style={btnAccion("#F7F4EA", "#2E5939")}
                            title="Editar Paquete"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(paquete)}
                            style={btnAccion("#fbe9e7", "#e57373")}
                            title="Eliminar Paquete"
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

export default Gestipaq;