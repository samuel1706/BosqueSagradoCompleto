// src/components/Admiprovee.jsx
import React, { useState, useMemo, useEffect } from "react";
import { 
  FaEye, FaEdit, FaTrash, FaTimes, FaSearch, FaPlus, 
  FaExclamationTriangle, FaCheck, FaInfoCircle, FaPhone,
  FaEnvelope, FaMapMarkerAlt, FaIdCard, FaSync, FaBuilding,
  FaShoppingCart, FaSlidersH
} from "react-icons/fa";
import axios from "axios";

// ===============================================
// ESTILOS MEJORADOS (CONSISTENTES CON MARCA)
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
  gridTemplateColumns: '1fr 1fr',
  gap: '15px 20px',
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
// VALIDACIONES Y PATRONES PARA PROVEEDORES
// ===============================================
const VALIDATION_RULES = {
  nombre: {
    minLength: 2,
    maxLength: 100,
    required: true,
    errorMessages: {
      required: "El nombre del proveedor es obligatorio.",
      minLength: "El nombre debe tener al menos 2 caracteres.",
      maxLength: "El nombre no puede exceder los 100 caracteres.",
      pattern: "El nombre solo puede contener letras y espacios."
    }
  },
  celular: {
    required: true,
    pattern: /^\d{10}$/,
    errorMessages: {
      required: "El número de celular es obligatorio.",
      pattern: "El celular debe tener exactamente 10 dígitos numéricos."
    }
  },
  correo: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessages: {
      required: "El correo electrónico es obligatorio.",
      pattern: "El formato del correo electrónico es inválido.",
      maxLength: "El correo no puede exceder los 100 caracteres."
    }
  },
  numeroDocumento: {
    required: true,
    pattern: /^\d+$/,
    errorMessages: {
      required: "El número de documento es obligatorio.",
      pattern: "El número de documento solo debe contener dígitos."
    }
  },
  departamento: {
    required: true,
    minLength: 2,
    maxLength: 50,
    errorMessages: {
      required: "El departamento es obligatorio.",
      minLength: "El departamento debe tener al menos 2 caracteres.",
      maxLength: "El departamento no puede exceder los 50 caracteres."
    }
  },
  ciudad: {
    required: true,
    minLength: 2,
    maxLength: 50,
    errorMessages: {
      required: "La ciudad es obligatoria.",
      minLength: "La ciudad debe tener al menos 2 caracteres.",
      maxLength: "La ciudad no puede exceder los 50 caracteres."
    }
  },
  barrio: {
    required: true,
    minLength: 2,
    maxLength: 50,
    errorMessages: {
      required: "El barrio es obligatorio.",
      minLength: "El barrio debe tener al menos 2 caracteres.",
      maxLength: "El barrio no puede exceder los 50 caracteres."
    }
  },
  direccion: {
    required: true,
    minLength: 5,
    maxLength: 200,
    errorMessages: {
      required: "La dirección es obligatoria.",
      minLength: "La dirección debe tener al menos 5 caracteres.",
      maxLength: "La dirección no puede exceder los 200 caracteres."
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
const API_PROVEEDORES = "https://www.bosquesagrado.somee.com/api/Proveedore";
const API_PRODUCTOS = "https://www.bosquesagrado.somee.com/api/Productos";
const ITEMS_PER_PAGE = 10;

// ===============================================
// COMPONENTE FormField PARA PROVEEDORES
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
  touched = false,
  icon
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

    if (name === 'celular' || name === 'numeroDocumento') {
      filteredValue = value.replace(/[^0-9]/g, "");
    } else if (name === 'nombre') {
      filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    } else if (name === 'departamento' || name === 'ciudad' || name === 'barrio') {
      filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-_&.,()]/g, "");
    }
    
    if (maxLength && filteredValue.length > maxLength) {
      filteredValue = filteredValue.slice(0, maxLength);
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
          <textarea
            name={name}
            value={value}
            onChange={handleFilteredInputChange}
            onBlur={onBlur}
            style={{
              ...getInputStyle(),
              minHeight: "80px",
              resize: "vertical"
            }}
            required={required}
            disabled={disabled}
            maxLength={maxLength}
            placeholder={placeholder}
          ></textarea>
        ) : (
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
        )}
        {showCharCount && maxLength && (
          <div style={{
            fontSize: "0.75rem",
            color: value && value.length > maxLength * 0.8 ? "#ff9800" : "#679750",
            textAlign: "right",
            marginTop: "4px"
          }}>
            {value?.length || 0}/{maxLength} caracteres
          </div>
        )}
      </div>
      {getValidationMessage()}
    </div>
  );
};

// ===============================================
// COMPONENTE PRINCIPAL Admiprovee MEJORADO
// ===============================================
const Admiprovee = () => {
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [proveedorToDelete, setProveedorToDelete] = useState(null);
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

  // Estados para filtros - MEJORADO COMO EN LOS OTROS MÓDULOS
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    estado: "all",
    departamento: "all",
    ciudad: "",
    productosMin: "",
    productosMax: ""
  });

  const [newProveedor, setNewProveedor] = useState({
    nombre: "",
    celular: "",
    correo: "",
    departamento: "",
    ciudad: "",
    barrio: "",
    direccion: "",
    tipoDocumento: "Cedula",
    numeroDocumento: "",
    estado: "true"
  });

  // ===============================================
  // EFECTOS
  // ===============================================
  useEffect(() => {
    fetchProveedores();
    fetchProductos();
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

  // Validar formulario en tiempo real solo para campos tocados
  useEffect(() => {
    if (showForm) {
      Object.keys(touchedFields).forEach(fieldName => {
        if (touchedFields[fieldName]) {
          validateField(fieldName, newProveedor[fieldName]);
        }
      });
    }
  }, [newProveedor, showForm, touchedFields]);

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
  // FUNCIONES DE FILTRADO MEJORADAS - IGUAL QUE EN OTROS MÓDULOS
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
      departamento: "all",
      ciudad: "",
      productosMin: "",
      productosMax: ""
    });
    setCurrentPage(1);
  };

  // Contador de filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.estado !== "all") count++;
    if (filters.departamento !== "all") count++;
    if (filters.ciudad) count++;
    if (filters.productosMin) count++;
    if (filters.productosMax) count++;
    return count;
  }, [filters]);

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
      success = value === "true" ? "Proveedor activo" : "Proveedor inactivo";
    }
    else if (trimmedValue) {
      success = "Campo válido.";
    }

    // Verificación de duplicados para campos únicos
    if ((fieldName === 'nombre' || fieldName === 'correo' || fieldName === 'numeroDocumento') && trimmedValue && !error) {
      const duplicate = proveedores.find(prov => {
        if (fieldName === 'nombre') {
          return prov.nombre.toLowerCase() === trimmedValue.toLowerCase() && 
                 (!isEditing || prov.idProveedor !== newProveedor.idProveedor);
        } else if (fieldName === 'correo') {
          return prov.correo.toLowerCase() === trimmedValue.toLowerCase() && 
                 (!isEditing || prov.idProveedor !== newProveedor.idProveedor);
        } else if (fieldName === 'numeroDocumento') {
          return prov.numeroDocumento === trimmedValue && 
                 (!isEditing || prov.idProveedor !== newProveedor.idProveedor);
        }
        return false;
      });
      
      if (duplicate) {
        if (fieldName === 'nombre') {
          error = "Ya existe un proveedor con este nombre.";
        } else if (fieldName === 'correo') {
          error = "Ya existe un proveedor con este correo.";
        } else if (fieldName === 'numeroDocumento') {
          error = "Ya existe un proveedor con este número de documento.";
        }
      }
    }

    // Advertencias específicas
    if (fieldName === 'celular' && trimmedValue && !error) {
      if (trimmedValue.startsWith('0')) {
        warning = 'El celular no debe empezar con 0';
      }
    }

    if (fieldName === 'direccion' && trimmedValue && !error && trimmedValue.length < 15) {
      warning = 'Considera agregar más detalles para una mejor ubicación';
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
      celular: true,
      correo: true,
      numeroDocumento: true,
      departamento: true,
      ciudad: true,
      barrio: true,
      direccion: true,
      estado: true
    };
    setTouchedFields(allFieldsTouched);

    const nombreValid = validateField('nombre', newProveedor.nombre);
    const celularValid = validateField('celular', newProveedor.celular);
    const correoValid = validateField('correo', newProveedor.correo);
    const documentoValid = validateField('numeroDocumento', newProveedor.numeroDocumento);
    const departamentoValid = validateField('departamento', newProveedor.departamento);
    const ciudadValid = validateField('ciudad', newProveedor.ciudad);
    const barrioValid = validateField('barrio', newProveedor.barrio);
    const direccionValid = validateField('direccion', newProveedor.direccion);
    const estadoValid = validateField('estado', newProveedor.estado);

    const isValid = nombreValid && celularValid && correoValid && documentoValid && 
                   departamentoValid && ciudadValid && barrioValid && direccionValid && estadoValid;
    
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
  // FUNCIONES DE LA API
  // ===============================================
  const fetchProveedores = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_PROVEEDORES, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (Array.isArray(res.data)) {
        setProveedores(res.data);
      } else {
        throw new Error("Formato de datos inválido");
      }
    } catch (error) {
      console.error("❌ Error al obtener proveedores:", error);
      handleApiError(error, "cargar los proveedores");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductos = async () => {
    try {
      const res = await axios.get(API_PRODUCTOS, { timeout: 10000 });
      if (Array.isArray(res.data)) {
        setProductos(res.data);
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const handleAddProveedor = async (e) => {
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
      const proveedorData = {
        nombre: newProveedor.nombre.trim(),
        celular: newProveedor.celular.trim(),
        correo: newProveedor.correo.trim(),
        departamento: newProveedor.departamento.trim(),
        ciudad: newProveedor.ciudad.trim(),
        barrio: newProveedor.barrio.trim(),
        direccion: newProveedor.direccion.trim(),
        tipoDocumento: newProveedor.tipoDocumento,
        numeroDocumento: newProveedor.numeroDocumento.trim(),
        estado: newProveedor.estado === "true"
      };

      console.log("📤 Enviando datos:", proveedorData);

      if (isEditing) {
        proveedorData.idProveedor = newProveedor.idProveedor;
        await axios.put(`${API_PROVEEDORES}/${newProveedor.idProveedor}`, proveedorData, {
          headers: { 'Content-Type': 'application/json' }
        });
        displayAlert("Proveedor actualizado exitosamente.", "success");
      } else {
        await axios.post(API_PROVEEDORES, proveedorData, {
          headers: { 'Content-Type': 'application/json' }
        });
        displayAlert("Proveedor agregado exitosamente.", "success");
      }
      
      await fetchProveedores();
      closeForm();
    } catch (error) {
      console.error("❌ Error al guardar proveedor:", error);
      handleApiError(error, isEditing ? "actualizar el proveedor" : "agregar el proveedor");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (proveedorToDelete) {
      setLoading(true);
      try {
        // Verificar si el proveedor tiene productos asociados
        const hasProducts = await checkIfProveedorHasProducts(proveedorToDelete.idProveedor);
        if (hasProducts) {
          displayAlert("No se puede eliminar un proveedor que tiene productos asociados", "error");
          setLoading(false);
          return;
        }

        await axios.delete(`${API_PROVEEDORES}/${proveedorToDelete.idProveedor}`);
        displayAlert("Proveedor eliminado exitosamente.", "success");
        await fetchProveedores();
      } catch (error) {
        console.error("❌ Error al eliminar proveedor:", error);
        
        if (error.response && error.response.status === 409) {
          displayAlert("No se puede eliminar el proveedor porque tiene productos asociados.", "error");
        } else {
          handleApiError(error, "eliminar el proveedor");
        }
      } finally {
        setLoading(false);
        setProveedorToDelete(null);
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
        errorMessage = "Conflicto: El proveedor está siendo utilizado y no puede ser eliminado.";
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
    setNewProveedor((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Nueva función para manejar el blur (cuando el campo pierde el foco)
  const handleInputBlur = (e) => {
    const { name } = e.target;
    markFieldAsTouched(name);
    validateField(name, newProveedor[name]);
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
    setTouchedFields({});
    setNewProveedor({
      nombre: "",
      celular: "",
      correo: "",
      departamento: "",
      ciudad: "",
      barrio: "",
      direccion: "",
      tipoDocumento: "Cedula",
      numeroDocumento: "",
      estado: "true"
    });
  };

  const closeDetailsModal = () => {
    setShowDetails(false);
    setSelectedProveedor(null);
  };

  const cancelDelete = () => {
    setProveedorToDelete(null);
    setShowDeleteConfirm(false);
  };

  const toggleEstadoProveedor = async (proveedor) => {
    setLoading(true);
    try {
      const updatedProveedor = { 
        ...proveedor, 
        estado: !proveedor.estado 
      };
      await axios.put(`${API_PROVEEDORES}/${proveedor.idProveedor}`, updatedProveedor, {
        headers: { 'Content-Type': 'application/json' }
      });
      displayAlert(`Proveedor ${updatedProveedor.estado ? 'activado' : 'desactivado'} exitosamente.`, "success");
      await fetchProveedores();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      handleApiError(error, "cambiar el estado");
    } finally {
      setLoading(false);
    }
  };

  // Función mejorada para verificar si un proveedor tiene productos asociados
  const checkIfProveedorHasProducts = async (proveedorId) => {
    try {
      const productosEnProveedor = productos.filter(producto => 
        producto.idProveedor === proveedorId
      );
      return productosEnProveedor.length > 0;
    } catch (error) {
      console.error("Error al verificar productos:", error);
      return true; // Por seguridad, asumir que tiene productos si hay error
    }
  };

  // Función para contar productos por proveedor
  const contarProductosPorProveedor = (proveedorId) => {
    return productos.filter(producto => producto.idProveedor === proveedorId).length;
  };

  const handleView = (proveedor) => {
    setSelectedProveedor(proveedor);
    setShowDetails(true);
  };

  const handleEdit = (proveedor) => {
    setNewProveedor({
      ...proveedor,
      estado: proveedor.estado.toString()
    });
    setIsEditing(true);
    setShowForm(true);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
    setTouchedFields({});
  };

  const handleDeleteClick = (proveedor) => {
    // Abrir confirmación de eliminación (la verificación de productos se realiza en el servidor)
    setProveedorToDelete(proveedor);
    setShowDeleteConfirm(true);
  };

  // ===============================================
  // FUNCIONES DE FILTRADO Y PAGINACIÓN MEJORADAS
  // ===============================================
  const filteredProveedores = useMemo(() => {
    let filtered = proveedores.filter(proveedor => {
      // Búsqueda general
      const matchesSearch = 
        proveedor.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proveedor.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proveedor.ciudad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proveedor.numeroDocumento?.includes(searchTerm);

      if (!matchesSearch) return false;

      // Filtro por estado
      if (filters.estado !== "all") {
        const estadoFilter = filters.estado === "activo";
        if (proveedor.estado !== estadoFilter) return false;
      }

      // Filtro por departamento
      if (filters.departamento !== "all" && proveedor.departamento !== filters.departamento) {
        return false;
      }

      // Filtro por ciudad
      if (filters.ciudad && !proveedor.ciudad?.toLowerCase().includes(filters.ciudad.toLowerCase())) {
        return false;
      }

      // Filtro por número de productos
      const productosCount = contarProductosPorProveedor(proveedor.idProveedor);
      if (filters.productosMin && productosCount < parseInt(filters.productosMin)) return false;
      if (filters.productosMax && productosCount > parseInt(filters.productosMax)) return false;

      return true;
    });

    return filtered;
  }, [proveedores, searchTerm, filters]);

  const totalPages = Math.ceil(filteredProveedores.length / ITEMS_PER_PAGE);

  const paginatedProveedores = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProveedores.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProveedores, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Opciones para los selects
  const tipoDocumentoOptions = [
    { value: "Cedula", label: "Cédula" },
    { value: "Pasaporte", label: "Pasaporte" },
    { value: "CedulaExtranjeria", label: "Cédula de Extranjería" }
  ];

  const departamentoOptions = [
    { value: "all", label: "Todos los departamentos" },
    { value: "Antioquia", label: "Antioquia" },
    { value: "Cundinamarca", label: "Cundinamarca" },
    { value: "Valle del Cauca", label: "Valle del Cauca" },
    { value: "Santander", label: "Santander" },
    { value: "Bolívar", label: "Bolívar" },
    { value: "Atlántico", label: "Atlántico" },
    { value: "Caldas", label: "Caldas" },
    { value: "Risaralda", label: "Risaralda" },
    { value: "Tolima", label: "Tolima" },
    { value: "Huila", label: "Huila" }
  ];

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
              onClick={fetchProveedores}
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
          <h2 style={{ margin: 0, color: "#2E5939" }}>Gestión de Proveedores</h2>
          <p style={{ margin: "5px 0 0 0", color: "#679750", fontSize: "14px" }}>
            {proveedores.length} proveedores registrados • {proveedores.filter(p => p.estado).length} activos
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
            setNewProveedor({
              nombre: "",
              celular: "",
              correo: "",
              departamento: "",
              ciudad: "",
              barrio: "",
              direccion: "",
              tipoDocumento: "Cedula",
              numeroDocumento: "",
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
          <FaPlus /> Nuevo Proveedor
        </button>
      </div>

      {/* Tarjetas de Estadísticas - MEJORADAS COMO EN OTROS MÓDULOS */}
      {!loading && proveedores.length > 0 && (
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
              {proveedores.length}
            </div>
            <div style={{ fontSize: '16px', color: '#679750', fontWeight: '600' }}>
              Total Proveedores
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
              {proveedores.filter(p => p.estado).length}
            </div>
            <div style={{ fontSize: '16px', color: '#4caf50', fontWeight: '600' }}>
              Proveedores Activos
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
              {proveedores.filter(p => !p.estado).length}
            </div>
            <div style={{ fontSize: '16px', color: '#e57373', fontWeight: '600' }}>
              Proveedores Inactivos
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
              {filteredProveedores.length}
            </div>
            <div style={{ fontSize: '16px', color: '#2196f3', fontWeight: '600' }}>
              Resultados Filtrados
            </div>
          </div>
        </div>
      )}

      {/* Barra de búsqueda y filtros - MEJORADO COMO EN OTROS MÓDULOS */}
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
              placeholder="Buscar por nombre, correo, ciudad o documento..."
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

              {/* Filtro por departamento */}
              <div>
                <label style={labelStyle}>Departamento</label>
                <select
                  name="departamento"
                  value={filters.departamento}
                  onChange={handleFilterChange}
                  style={{
                    ...inputStyle,
                    width: '100%'
                  }}
                >
                  {departamentoOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por ciudad */}
              <div>
                <label style={labelStyle}>Ciudad</label>
                <input
                  type="text"
                  name="ciudad"
                  value={filters.ciudad}
                  onChange={handleFilterChange}
                  style={inputStyle}
                  placeholder="Filtrar por ciudad..."
                  maxLength={50}
                />
              </div>

              {/* Filtro por número de productos */}
              <div>
                <label style={labelStyle}>Productos Mínimo</label>
                <input
                  type="number"
                  name="productosMin"
                  value={filters.productosMin}
                  onChange={handleFilterChange}
                  style={inputStyle}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label style={labelStyle}>Productos Máximo</label>
                <input
                  type="number"
                  name="productosMax"
                  value={filters.productosMax}
                  onChange={handleFilterChange}
                  style={inputStyle}
                  placeholder="50"
                  min="0"
                />
              </div>
            </div>
          </div>
        )}

        {/* Información de resultados filtrados */}
        {filteredProveedores.length !== proveedores.length && (
          <div style={{
            marginTop: '10px',
            padding: '8px 12px',
            backgroundColor: '#E8F5E8',
            borderRadius: '6px',
            color: '#2E5939',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Mostrando {filteredProveedores.length} de {proveedores.length} proveedores
            {activeFiltersCount > 0 && ` (filtros aplicados: ${activeFiltersCount})`}
          </div>
        )}
      </div>

      {/* Resto del código del formulario, modales y tabla se mantiene igual */}
      {/* ... (el resto del código permanece igual) ... */}

      {/* Formulario de agregar/editar */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 700 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939" }}>
                {isEditing ? "Editar Proveedor" : "Nuevo Proveedor"}
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
            
            <form onSubmit={handleAddProveedor}>
              <div style={formContainerStyle}>
                <FormField
                  label="Nombre del Proveedor"
                  name="nombre"
                  value={newProveedor.nombre}
                  onChange={handleChange}
                  onBlur={handleInputBlur}
                  error={formErrors.nombre}
                  success={formSuccess.nombre}
                  warning={formWarnings.nombre}
                  style={{ gridColumn: '1 / -1' }}
                  required={true}
                  disabled={loading}
                  maxLength={VALIDATION_RULES.nombre.maxLength}
                  showCharCount={true}
                  placeholder="Ej: Distribuidora ABC, Importaciones XYZ..."
                  touched={touchedFields.nombre}
                  icon={<FaBuilding />}
                />

                <FormField
                  label="Tipo de Documento"
                  name="tipoDocumento"
                  type="select"
                  value={newProveedor.tipoDocumento}
                  onChange={handleChange}
                  onBlur={handleInputBlur}
                  error={formErrors.tipoDocumento}
                  success={formSuccess.tipoDocumento}
                  options={tipoDocumentoOptions}
                  required={true}
                  disabled={loading}
                  touched={touchedFields.tipoDocumento}
                  icon={<FaIdCard />}
                />

                <FormField
                  label="Número de Documento"
                  name="numeroDocumento"
                  value={newProveedor.numeroDocumento}
                  onChange={handleChange}
                  onBlur={handleInputBlur}
                  error={formErrors.numeroDocumento}
                  success={formSuccess.numeroDocumento}
                  warning={formWarnings.numeroDocumento}
                  required={true}
                  disabled={loading || isEditing}
                  maxLength={20}
                  placeholder="Solo números"
                  touched={touchedFields.numeroDocumento}
                  icon={<FaIdCard />}
                />

                <FormField
                  label="Celular"
                  name="celular"
                  type="tel"
                  value={newProveedor.celular}
                  onChange={handleChange}
                  onBlur={handleInputBlur}
                  error={formErrors.celular}
                  success={formSuccess.celular}
                  warning={formWarnings.celular}
                  required={true}
                  disabled={loading}
                  maxLength={10}
                  placeholder="10 dígitos"
                  touched={touchedFields.celular}
                  icon={<FaPhone />}
                />

                <FormField
                  label="Correo Electrónico"
                  name="correo"
                  type="email"
                  value={newProveedor.correo}
                  onChange={handleChange}
                  onBlur={handleInputBlur}
                  error={formErrors.correo}
                  success={formSuccess.correo}
                  warning={formWarnings.correo}
                  style={{ gridColumn: '1 / -1' }}
                  required={true}
                  disabled={loading}
                  maxLength={100}
                  placeholder="ejemplo@correo.com"
                  touched={touchedFields.correo}
                  icon={<FaEnvelope />}
                />

                <FormField
                  label="Departamento"
                  name="departamento"
                  type="select"
                  value={newProveedor.departamento}
                  onChange={handleChange}
                  onBlur={handleInputBlur}
                  error={formErrors.departamento}
                  success={formSuccess.departamento}
                  warning={formWarnings.departamento}
                  options={departamentoOptions.filter(d => d.value !== "all")}
                  required={true}
                  disabled={loading}
                  touched={touchedFields.departamento}
                  icon={<FaMapMarkerAlt />}
                />

                <FormField
                  label="Ciudad"
                  name="ciudad"
                  value={newProveedor.ciudad}
                  onChange={handleChange}
                  onBlur={handleInputBlur}
                  error={formErrors.ciudad}
                  success={formSuccess.ciudad}
                  warning={formWarnings.ciudad}
                  required={true}
                  disabled={loading}
                  maxLength={50}
                  placeholder="Nombre de la ciudad"
                  touched={touchedFields.ciudad}
                  icon={<FaMapMarkerAlt />}
                />

                <FormField
                  label="Barrio"
                  name="barrio"
                  value={newProveedor.barrio}
                  onChange={handleChange}
                  onBlur={handleInputBlur}
                  error={formErrors.barrio}
                  success={formSuccess.barrio}
                  warning={formWarnings.barrio}
                  required={true}
                  disabled={loading}
                  maxLength={50}
                  placeholder="Nombre del barrio"
                  touched={touchedFields.barrio}
                  icon={<FaMapMarkerAlt />}
                />

                <FormField
                  label="Dirección Completa"
                  name="direccion"
                  type="textarea"
                  value={newProveedor.direccion}
                  onChange={handleChange}
                  onBlur={handleInputBlur}
                  error={formErrors.direccion}
                  success={formSuccess.direccion}
                  warning={formWarnings.direccion}
                  style={{ gridColumn: '1 / -1' }}
                  required={true}
                  disabled={loading}
                  maxLength={200}
                  showCharCount={true}
                  placeholder="Ingresa la dirección completa con puntos de referencia..."
                  touched={touchedFields.direccion}
                  icon={<FaMapMarkerAlt />}
                />
                
              </div>

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
                  {loading ? "Guardando..." : (isEditing ? "Actualizar" : "Guardar")} Proveedor
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
      {showDetails && selectedProveedor && (
        <div style={modalOverlayStyle}>
          <div style={detailsModalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939" }}>Detalles del Proveedor</h2>
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
                <div style={detailValueStyle}>#{selectedProveedor.idProveedor}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Nombre del Proveedor</div>
                <div style={detailValueStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaBuilding color="#679750" />
                    {selectedProveedor.nombre}
                  </div>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Tipo de Documento</div>
                <div style={detailValueStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaIdCard color="#679750" />
                    {selectedProveedor.tipoDocumento}
                  </div>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Número de Documento</div>
                <div style={detailValueStyle}>{selectedProveedor.numeroDocumento}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Celular</div>
                <div style={detailValueStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaPhone color="#679750" />
                    {selectedProveedor.celular}
                  </div>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Correo Electrónico</div>
                <div style={detailValueStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaEnvelope color="#679750" />
                    {selectedProveedor.correo}
                  </div>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Departamento</div>
                <div style={detailValueStyle}>{selectedProveedor.departamento}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Ciudad</div>
                <div style={detailValueStyle}>{selectedProveedor.ciudad}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Barrio</div>
                <div style={detailValueStyle}>{selectedProveedor.barrio}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Dirección</div>
                <div style={detailValueStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaMapMarkerAlt color="#679750" />
                    {selectedProveedor.direccion}
                  </div>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Productos Asociados</div>
                <div style={detailValueStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaShoppingCart color="#679750" />
                    {contarProductosPorProveedor(selectedProveedor.idProveedor)} productos
                  </div>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Estado</div>
                <div style={{
                  ...detailValueStyle,
                  color: selectedProveedor.estado ? '#4caf50' : '#e57373',
                  fontWeight: 'bold'
                }}>
                  {selectedProveedor.estado ? '🟢 Activo' : '🔴 Inactivo'}
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
      {showDeleteConfirm && proveedorToDelete && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 500, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 12, color: "#2E5939" }}>Confirmar Eliminación</h3>
            <p style={{ marginBottom: 18, fontSize: '1rem', color: "#2E5939" }}>
              ¿Estás seguro de eliminar de forma permanente al proveedor "<strong>{proveedorToDelete.nombre}</strong>"? Esta acción no se puede deshacer.
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
                Si el proveedor está asociado a productos, la eliminación será rechazada por el servidor y se mostrará el motivo.
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
              🔄 Cargando proveedores...
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
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Proveedor</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Contacto</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Celular</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Ubicación</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Productos</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Estado</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProveedores.length === 0 && !loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <FaInfoCircle size={30} color="#679750" />
                      {proveedores.length === 0 ? "No hay proveedores registrados" : "No se encontraron resultados con los filtros aplicados"}
                      {activeFiltersCount > 0 && (
                        <div style={{ color: '#679750', fontSize: '14px', marginTop: '5px' }}>
                          Filtros activos: {activeFiltersCount}
                        </div>
                      )}
                      {proveedores.length === 0 && (
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
                          Agregar Primer Proveedor
                        </button>
                      )}
                      {proveedores.length > 0 && activeFiltersCount > 0 && (
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
                paginatedProveedores.map((proveedor) => {
                  const productosCount = contarProductosPorProveedor(proveedor.idProveedor);
                  
                  return (
                    <tr key={proveedor.idProveedor} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "15px", fontWeight: "500" }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <FaBuilding color="#679750" />
                          {proveedor.nombre}
                        </div>
                      </td>
                      <td style={{ padding: "15px" }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FaEnvelope color="#679750" size={12} />
                          {proveedor.correo}
                        </div>
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                          <FaPhone color="#679750" size={12} />
                          {proveedor.celular}
                        </div>
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                          <FaMapMarkerAlt color="#679750" size={12} />
                          {proveedor.ciudad}
                        </div>
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                          <span style={{ fontWeight: 'bold' }}>{productosCount}</span>
                          <span style={{ fontSize: '12px', color: '#679750' }}>
                            productos
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <button
                          onClick={() => toggleEstadoProveedor(proveedor)}
                          style={{
                            cursor: "pointer",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            border: "none",
                            backgroundColor: proveedor.estado ? "#4caf50" : "#e57373",
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
                          {proveedor.estado ? "Activo" : "Inactivo"}
                        </button>
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
                          <button
                            onClick={() => handleView(proveedor)}
                            style={btnAccion("#F7F4EA", "#2E5939")}
                            title="Ver Detalles"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleEdit(proveedor)}
                            style={btnAccion("#F7F4EA", "#2E5939")}
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteClick(proveedor); }}
                            style={btnAccion("#fbe9e7", "#e57373")}
                            title="Eliminar"
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

export default Admiprovee;