import React, { useState, useMemo, useEffect } from "react";
import { 
  FaEye, FaEdit, FaTrash, FaTimes, FaSearch, FaPlus, 
  FaExclamationTriangle, FaCheck, FaInfoCircle, FaPhone,
  FaEnvelope, FaMapMarkerAlt, FaIdCard, FaSync, FaBuilding
} from "react-icons/fa";
import axios from "axios";

// ===============================================
// ESTILOS MEJORADOS (COHERENTES CON EL DISEÑO ANTERIOR)
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
  maxWidth: 600,
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

const toggleButtonStyle = (active) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '10px 16px',
  borderRadius: '25px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '14px',
  transition: 'all 0.3s ease',
  backgroundColor: active ? '#4caf50' : '#e57373',
  color: 'white',
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  minWidth: '140px'
});

// ===============================================
// FUNCIONES DE VALIDACIÓN MEJORADAS PARA PROVEEDORES
// ===============================================
const validateNombre = (nombre, proveedoresExistentes = [], idActual = null) => {
  if (!nombre || nombre.trim().length === 0) {
    return { isValid: false, message: 'El nombre del proveedor es obligatorio' };
  }

  if (nombre.trim().length < 2) {
    return { isValid: false, message: 'El nombre debe tener al menos 2 caracteres' };
  }

  if (nombre.trim().length > 100) {
    return { isValid: false, message: 'El nombre no puede exceder los 100 caracteres' };
  }

  // Solo letras y espacios (sin caracteres especiales ni números)
  const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!nombreRegex.test(nombre.trim())) {
    return { 
      isValid: false, 
      message: 'El nombre solo puede contener letras y espacios. No se permiten números ni caracteres especiales.' 
    };
  }

  // Validar unicidad
  const nombreNormalizado = nombre.trim().toLowerCase();
  const existeProveedor = proveedoresExistentes.some(prov => 
    prov.nombre.toLowerCase() === nombreNormalizado && 
    prov.idProveedor !== idActual
  );

  if (existeProveedor) {
    return { 
      isValid: false, 
      message: 'Ya existe un proveedor con este nombre' 
    };
  }

  return { isValid: true, message: '' };
};

const validateCelular = (celular) => {
  if (!celular || celular.trim().length === 0) {
    return { isValid: false, message: 'El número de celular es obligatorio' };
  }

  // Solo números, exactamente 10 dígitos
  const celularRegex = /^\d{10}$/;
  if (!celularRegex.test(celular.trim())) {
    return { isValid: false, message: 'El celular debe tener exactamente 10 dígitos numéricos' };
  }

  // Validar que no empiece con 0 (opcional, dependiendo del país)
  if (celular.trim().startsWith('0')) {
    return { isValid: false, message: 'El celular no debe empezar con 0' };
  }

  return { isValid: true, message: '' };
};

const validateCorreo = (correo, proveedoresExistentes = [], idActual = null) => {
  if (!correo || correo.trim().length === 0) {
    return { isValid: false, message: 'El correo electrónico es obligatorio' };
  }

  // Validar formato de email
  const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!correoRegex.test(correo.trim())) {
    return { isValid: false, message: 'El formato del correo electrónico es inválido' };
  }

  // Validar longitud máxima
  if (correo.trim().length > 100) {
    return { isValid: false, message: 'El correo no puede exceder los 100 caracteres' };
  }

  // Validar unicidad
  const correoNormalizado = correo.trim().toLowerCase();
  const existeCorreo = proveedoresExistentes.some(prov => 
    prov.correo.toLowerCase() === correoNormalizado && 
    prov.idProveedor !== idActual
  );

  if (existeCorreo) {
    return { 
      isValid: false, 
      message: 'Ya existe un proveedor con este correo electrónico' 
    };
  }

  return { isValid: true, message: '' };
};

const validateNumeroDocumento = (numeroDocumento, tipoDocumento, proveedoresExistentes = [], idActual = null) => {
  if (!numeroDocumento || numeroDocumento.trim().length === 0) {
    return { isValid: false, message: 'El número de documento es obligatorio' };
  }

  // Solo números
  const soloNumerosRegex = /^\d+$/;
  if (!soloNumerosRegex.test(numeroDocumento.trim())) {
    return { isValid: false, message: 'El número de documento solo debe contener dígitos' };
  }

  // Validar longitud según tipo de documento
  let longitudMinima = 0;
  let longitudMaxima = 0;
  
  switch (tipoDocumento) {
    case 'Cedula':
      longitudMinima = 8;
      longitudMaxima = 10;
      break;
    case 'Pasaporte':
      longitudMinima = 6;
      longitudMaxima = 20;
      break;
    case 'CedulaExtranjeria':
      longitudMinima = 6;
      longitudMaxima = 15;
      break;
    default:
      longitudMinima = 6;
      longitudMaxima = 20;
  }

  if (numeroDocumento.trim().length < longitudMinima || numeroDocumento.trim().length > longitudMaxima) {
    return { 
      isValid: false, 
      message: `El número de documento debe tener entre ${longitudMinima} y ${longitudMaxima} dígitos para ${tipoDocumento}` 
    };
  }

  // Validar unicidad
  const existeDocumento = proveedoresExistentes.some(prov => 
    prov.numeroDocumento === numeroDocumento.trim() && 
    prov.idProveedor !== idActual
  );

  if (existeDocumento) {
    return { 
      isValid: false, 
      message: 'Ya existe un proveedor con este número de documento' 
    };
  }

  return { isValid: true, message: '' };
};

const validateTexto = (valor, campo, longitudMinima = 2, longitudMaxima = 50) => {
  if (!valor || valor.trim().length === 0) {
    return { isValid: false, message: `El ${campo} es obligatorio` };
  }

  if (valor.trim().length < longitudMinima) {
    return { isValid: false, message: `El ${campo} debe tener al menos ${longitudMinima} caracteres` };
  }

  if (valor.trim().length > longitudMaxima) {
    return { isValid: false, message: `El ${campo} no puede exceder los ${longitudMaxima} caracteres` };
  }

  // Validar que no contenga caracteres especiales peligrosos
  const textoRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-_&.,()#/°]+$/;
  if (!textoRegex.test(valor.trim())) {
    return { 
      isValid: false, 
      message: `El ${campo} contiene caracteres no permitidos` 
    };
  }

  return { isValid: true, message: '' };
};

// ===============================================
// DATOS DE CONFIGURACIÓN
// ===============================================
const API_PROVEEDORES = "http://localhost:5204/api/Proveedore";
const API_PRODUCTOS = "http://localhost:5204/api/Productos";

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
  options = [], 
  style = {}, 
  required = true, 
  disabled = false,
  maxLength,
  placeholder,
  showCharCount = false,
  icon
}) => {
  const finalOptions = useMemo(() => {
    if (type === "select") {
      const placeholderOption = { value: "", label: "Selecciona", disabled: required };
      return [placeholderOption, ...options];
    }
    return options;
  }, [options, type, required]);

  const handleFilteredInputChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (name === 'celular' || name === 'numeroDocumento') {
      filteredValue = value.replace(/[^0-9]/g, "");
    } else if (name === 'nombre' || name === 'departamento' || name === 'ciudad' || name === 'barrio') {
      // Solo letras, espacios y caracteres básicos
      filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-_&.,()]/g, "");
    }
    
    if (maxLength && filteredValue.length > maxLength) {
      filteredValue = filteredValue.slice(0, maxLength);
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
      paddingLeft: icon ? '40px' : '12px'
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
            color: value.length > maxLength * 0.8 ? "#ff9800" : "#679750",
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
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentProveedor, setCurrentProveedor] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [proveedorToDelete, setProveedorToDelete] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState({});
  const [formWarnings, setFormWarnings] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    estado: true
  });

  // ===============================================
  // EFECTOS
  // ===============================================
  useEffect(() => {
    fetchProveedores();
  }, []);

  // Validar formulario en tiempo real
  useEffect(() => {
    if (showForm) {
      validateField('nombre', newProveedor.nombre);
      validateField('celular', newProveedor.celular);
      validateField('correo', newProveedor.correo);
      validateField('numeroDocumento', newProveedor.numeroDocumento);
      validateField('departamento', newProveedor.departamento);
      validateField('ciudad', newProveedor.ciudad);
      validateField('barrio', newProveedor.barrio);
      validateField('direccion', newProveedor.direccion);
    }
  }, [newProveedor, showForm]);

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
  // FUNCIONES DE VALIDACIÓN MEJORADAS
  // ===============================================
  const validateField = (fieldName, value) => {
    let error = "";
    let success = "";
    let warning = "";

    const trimmedValue = value ? value.toString().trim() : "";

    switch (fieldName) {
      case 'nombre':
        const nombreValidation = validateNombre(trimmedValue, proveedores, isEditing ? newProveedor.idProveedor : null);
        if (!nombreValidation.isValid) {
          error = nombreValidation.message;
        } else if (trimmedValue) {
          success = "Nombre válido.";
        }
        break;

      case 'celular':
        const celularValidation = validateCelular(trimmedValue);
        if (!celularValidation.isValid) {
          error = celularValidation.message;
        } else if (trimmedValue) {
          success = "Celular válido.";
        }
        break;

      case 'correo':
        const correoValidation = validateCorreo(trimmedValue, proveedores, isEditing ? newProveedor.idProveedor : null);
        if (!correoValidation.isValid) {
          error = correoValidation.message;
        } else if (trimmedValue) {
          success = "Correo válido.";
        }
        break;

      case 'numeroDocumento':
        const documentoValidation = validateNumeroDocumento(
          trimmedValue, 
          newProveedor.tipoDocumento, 
          proveedores, 
          isEditing ? newProveedor.idProveedor : null
        );
        if (!documentoValidation.isValid) {
          error = documentoValidation.message;
        } else if (trimmedValue) {
          success = "Documento válido.";
        }
        break;

      case 'departamento':
        const departamentoValidation = validateTexto(trimmedValue, 'departamento');
        if (!departamentoValidation.isValid) {
          error = departamentoValidation.message;
        } else if (trimmedValue) {
          success = "Departamento válido.";
        }
        break;

      case 'ciudad':
        const ciudadValidation = validateTexto(trimmedValue, 'ciudad');
        if (!ciudadValidation.isValid) {
          error = ciudadValidation.message;
        } else if (trimmedValue) {
          success = "Ciudad válida.";
        }
        break;

      case 'barrio':
        const barrioValidation = validateTexto(trimmedValue, 'barrio');
        if (!barrioValidation.isValid) {
          error = barrioValidation.message;
        } else if (trimmedValue) {
          success = "Barrio válido.";
        }
        break;

      case 'direccion':
        const direccionValidation = validateTexto(trimmedValue, 'dirección', 5, 200);
        if (!direccionValidation.isValid) {
          error = direccionValidation.message;
        } else if (trimmedValue) {
          success = "Dirección válida.";
          if (trimmedValue.length < 15) {
            warning = 'Considera agregar más detalles para una mejor ubicación';
          }
        }
        break;

      case 'estado':
        success = value ? "Proveedor activo" : "Proveedor inactivo";
        break;

      default:
        break;
    }

    setFormErrors(prev => ({ ...prev, [fieldName]: error }));
    setFormSuccess(prev => ({ ...prev, [fieldName]: success }));
    setFormWarnings(prev => ({ ...prev, [fieldName]: warning }));

    return !error;
  };

  const validateForm = () => {
    const nombreValid = validateField('nombre', newProveedor.nombre);
    const celularValid = validateField('celular', newProveedor.celular);
    const correoValid = validateField('correo', newProveedor.correo);
    const documentoValid = validateField('numeroDocumento', newProveedor.numeroDocumento);
    const departamentoValid = validateField('departamento', newProveedor.departamento);
    const ciudadValid = validateField('ciudad', newProveedor.ciudad);
    const barrioValid = validateField('barrio', newProveedor.barrio);
    const direccionValid = validateField('direccion', newProveedor.direccion);

    const isValid = nombreValid && celularValid && correoValid && documentoValid && 
                   departamentoValid && ciudadValid && barrioValid && direccionValid;
    
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
  // FUNCIONES DE LA API MEJORADAS
  // ===============================================
  const fetchProveedores = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔍 Conectando a la API de proveedores:", API_PROVEEDORES);
      const res = await axios.get(API_PROVEEDORES, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log("✅ Datos de proveedores recibidos:", res.data);
      
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
        ...newProveedor,
        estado: newProveedor.estado === "true" || newProveedor.estado === true
      };

      console.log("📤 Enviando datos:", proveedorData);

      if (isEditing) {
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
      
      // Manejar errores específicos de la API
      if (error.response && error.response.status === 409) {
        displayAlert("Ya existe un proveedor con estos datos (nombre, correo o documento)", "error");
      } else {
        handleApiError(error, isEditing ? "actualizar el proveedor" : "agregar el proveedor");
      }
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
          displayAlert("No se puede eliminar el proveedor porque tiene productos asociados", "error");
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
      errorMessage = "No se puede conectar al servidor en http://localhost:5204";
    } else if (error.response) {
      if (error.response.status === 400) {
        errorMessage = `Error de validación: ${error.response.data?.title || error.response.data?.message || 'Datos inválidos'}`;
      } else if (error.response.status === 404) {
        errorMessage = "Recurso no encontrado.";
      } else if (error.response.status === 409) {
        errorMessage = "Conflicto: El proveedor ya existe o tiene productos asociados.";
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

  // Función para cambiar el estado con el botón toggle
  const toggleEstado = () => {
    setNewProveedor(prev => ({
      ...prev,
      estado: !prev.estado
    }));
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
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
      estado: true
    });
  };

  const closeDetailsModal = () => {
    setShowDetails(false);
    setCurrentProveedor(null);
  };

  const cancelDelete = () => {
    setProveedorToDelete(null);
    setShowDeleteConfirm(false);
  };

  const toggleEstadoProveedor = async (proveedor) => {
    setLoading(true);
    try {
      const updatedProveedor = { ...proveedor, estado: !proveedor.estado };
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
      // Buscar productos que pertenezcan a este proveedor
      const response = await axios.get(`${API_PRODUCTOS}/proveedor/${proveedorId}`, {
        timeout: 5000
      });
      
      return response.data && Array.isArray(response.data) && response.data.length > 0;
    } catch (error) {
      console.error("Error al verificar productos:", error);
      
      // Si no se puede verificar, asumir que podría tener productos por seguridad
      if (error.response && error.response.status === 404) {
        // Si el endpoint no existe, usar un enfoque alternativo
        return proveedores.find(prov => prov.idProveedor === proveedorId)?.productosCount > 0;
      }
      
      return true; // Por seguridad, asumir que tiene productos si hay error
    }
  };

  const handleView = (proveedor) => {
    setCurrentProveedor(proveedor);
    setShowDetails(true);
  };

  const handleEdit = (proveedor) => {
    setNewProveedor({
      ...proveedor,
      estado: proveedor.estado
    });
    setIsEditing(true);
    setShowForm(true);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
  };

  const handleDeleteClick = (proveedor) => {
    // Validar si el proveedor tiene productos asociados antes de eliminar
    checkIfProveedorHasProducts(proveedor.idProveedor).then(hasProducts => {
      if (hasProducts) {
        displayAlert("No se puede eliminar un proveedor que tiene productos asociados", "error");
        return;
      }
      setProveedorToDelete(proveedor);
      setShowDeleteConfirm(true);
    });
  };

  // ===============================================
  // FUNCIONES DE FILTRADO Y PAGINACIÓN
  // ===============================================
  const filteredProveedores = useMemo(() => {
    return proveedores.filter(proveedor =>
      proveedor.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.ciudad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.numeroDocumento?.includes(searchTerm)
    );
  }, [proveedores, searchTerm]);

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
            {proveedores.length} proveedores registrados • 
            {proveedores.filter(p => p.estado).length} activos
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={fetchProveedores}
            style={{
              backgroundColor: "#679750",
              color: "white",
              padding: "10px 12px",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: "600",
              boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
            title="Recargar proveedores"
          >
            <FaSync />
          </button>
          <button
            onClick={() => {
              setShowForm(true);
              setIsEditing(false);
              setFormErrors({});
              setFormSuccess({});
              setFormWarnings({});
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
            <FaPlus /> Nuevo Proveedor
          </button>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 500 }}>
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
        <div style={{ color: '#2E5939', fontSize: '14px', whiteSpace: 'nowrap' }}>
          {filteredProveedores.length} resultados
        </div>
      </div>

      {/* Formulario de agregar/editar */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 700 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939", textAlign: 'center' }}>
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
                  error={formErrors.nombre}
                  success={formSuccess.nombre}
                  warning={formWarnings.nombre}
                  style={{ gridColumn: '1 / -1' }}
                  required={true}
                  disabled={loading}
                  maxLength={100}
                  showCharCount={true}
                  placeholder="Ingresa el nombre completo del proveedor..."
                  icon={<FaBuilding />}
                />

                <FormField
                  label="Tipo de Documento"
                  name="tipoDocumento"
                  type="select"
                  value={newProveedor.tipoDocumento}
                  onChange={handleChange}
                  error={formErrors.tipoDocumento}
                  success={formSuccess.tipoDocumento}
                  options={tipoDocumentoOptions}
                  required={true}
                  disabled={loading}
                  icon={<FaIdCard />}
                />

                <FormField
                  label="Número de Documento"
                  name="numeroDocumento"
                  value={newProveedor.numeroDocumento}
                  onChange={handleChange}
                  error={formErrors.numeroDocumento}
                  success={formSuccess.numeroDocumento}
                  warning={formWarnings.numeroDocumento}
                  required={true}
                  disabled={loading || isEditing}
                  maxLength={20}
                  placeholder="Solo números"
                  icon={<FaIdCard />}
                />

                <FormField
                  label="Celular"
                  name="celular"
                  type="tel"
                  value={newProveedor.celular}
                  onChange={handleChange}
                  error={formErrors.celular}
                  success={formSuccess.celular}
                  warning={formWarnings.celular}
                  required={true}
                  disabled={loading}
                  maxLength={10}
                  placeholder="10 dígitos"
                  icon={<FaPhone />}
                />

                <FormField
                  label="Correo Electrónico"
                  name="correo"
                  type="email"
                  value={newProveedor.correo}
                  onChange={handleChange}
                  error={formErrors.correo}
                  success={formSuccess.correo}
                  warning={formWarnings.correo}
                  style={{ gridColumn: '1 / -1' }}
                  required={true}
                  disabled={loading}
                  maxLength={100}
                  placeholder="ejemplo@correo.com"
                  icon={<FaEnvelope />}
                />

                <FormField
                  label="Departamento"
                  name="departamento"
                  type="select"
                  value={newProveedor.departamento}
                  onChange={handleChange}
                  error={formErrors.departamento}
                  success={formSuccess.departamento}
                  warning={formWarnings.departamento}
                  options={departamentoOptions}
                  required={true}
                  disabled={loading}
                  icon={<FaMapMarkerAlt />}
                />

                <FormField
                  label="Ciudad"
                  name="ciudad"
                  value={newProveedor.ciudad}
                  onChange={handleChange}
                  error={formErrors.ciudad}
                  success={formSuccess.ciudad}
                  warning={formWarnings.ciudad}
                  required={true}
                  disabled={loading}
                  maxLength={50}
                  placeholder="Nombre de la ciudad"
                  icon={<FaMapMarkerAlt />}
                />

                <FormField
                  label="Barrio"
                  name="barrio"
                  value={newProveedor.barrio}
                  onChange={handleChange}
                  error={formErrors.barrio}
                  success={formSuccess.barrio}
                  warning={formWarnings.barrio}
                  required={true}
                  disabled={loading}
                  maxLength={50}
                  placeholder="Nombre del barrio"
                  icon={<FaMapMarkerAlt />}
                />

                <FormField
                  label="Dirección Completa"
                  name="direccion"
                  type="textarea"
                  value={newProveedor.direccion}
                  onChange={handleChange}
                  error={formErrors.direccion}
                  success={formSuccess.direccion}
                  warning={formWarnings.direccion}
                  style={{ gridColumn: '1 / -1' }}
                  required={true}
                  disabled={loading}
                  maxLength={200}
                  showCharCount={true}
                  placeholder="Ingresa la dirección completa con puntos de referencia..."
                  icon={<FaMapMarkerAlt />}
                />

                {/* Botón Toggle para Estado - oculto en modo edición */}
                {!isEditing && (
                  <div style={{ gridColumn: '1 / -1', marginBottom: '15px' }}>
                    <label style={labelStyle}>
                      Estado del Proveedor
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <button
                        type="button"
                        onClick={toggleEstado}
                        style={toggleButtonStyle(newProveedor.estado)}
                        disabled={loading}
                      >
                        {newProveedor.estado ? (
                          <>
                            <FaCheck size={16} />
                            <span>🟢 Activo</span>
                          </>
                        ) : (
                          <>
                            <FaTimes size={16} />
                            <span>🔴 Inactivo</span>
                          </>
                        )}
                      </button>
                      <span style={{ 
                        fontSize: '14px', 
                        color: newProveedor.estado ? '#4caf50' : '#e57373',
                        fontWeight: '500'
                      }}>
                        {newProveedor.estado 
                          ? 'El proveedor está activo y disponible para operaciones' 
                          : 'El proveedor está inactivo y no disponible para operaciones'
                        }
                      </span>
                    </div>
                    {formErrors.estado && (
                      <div style={errorValidationStyle}>
                        <FaExclamationTriangle size={12} />
                        {formErrors.estado}
                      </div>
                    )}
                    {formSuccess.estado && (
                      <div style={successValidationStyle}>
                        <FaCheck size={12} />
                        {formSuccess.estado}
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Resumen del proveedor */}
              {(newProveedor.nombre || newProveedor.celular || newProveedor.correo) && (
                <div style={{
                  backgroundColor: '#E8F5E8',
                  border: '1px solid #679750',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '20px'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#2E5939' }}>Resumen del Proveedor</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                    {newProveedor.nombre && (
                      <>
                        <div>Nombre:</div>
                        <div style={{ textAlign: 'right', fontWeight: 'bold' }}>{newProveedor.nombre}</div>
                      </>
                    )}
                    {newProveedor.celular && (
                      <>
                        <div>Celular:</div>
                        <div style={{ textAlign: 'right', fontWeight: 'bold' }}>{newProveedor.celular}</div>
                      </>
                    )}
                    {newProveedor.correo && (
                      <>
                        <div>Correo:</div>
                        <div style={{ textAlign: 'right', fontWeight: 'bold' }}>{newProveedor.correo}</div>
                      </>
                    )}
                    
                    <div style={{ borderTop: '1px solid #ccc', paddingTop: '5px' }}>
                      <strong>Estado:</strong>
                    </div>
                    <div style={{ 
                      textAlign: 'right', 
                      fontWeight: 'bold', 
                      color: newProveedor.estado ? '#4caf50' : '#e57373', 
                      borderTop: '1px solid #ccc', 
                      paddingTop: '5px' 
                    }}>
                      {newProveedor.estado ? '🟢 Activo' : '🔴 Inactivo'}
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 20 }}>
                <button
                  type="submit"
                  disabled={loading || isSubmitting || Object.keys(formErrors).length > 0}
                  style={{
                    backgroundColor: (loading || isSubmitting || Object.keys(formErrors).length > 0) ? "#ccc" : "#2E5939",
                    color: "#fff",
                    padding: "12px 25px",
                    border: "none",
                    borderRadius: 10,
                    cursor: (loading || isSubmitting || Object.keys(formErrors).length > 0) ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    flex: 1,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    if (!loading && !isSubmitting && Object.keys(formErrors).length === 0) {
                      e.target.style.background = "linear-gradient(90deg, #67d630, #95d34e)";
                      e.target.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loading && !isSubmitting && Object.keys(formErrors).length === 0) {
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
      {showDetails && currentProveedor && (
        <div style={modalOverlayStyle}>
          <div style={{ ...detailsModalStyle, maxWidth: 600 }}>
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
                <div style={detailValueStyle}>#{currentProveedor.idProveedor}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Nombre del Proveedor</div>
                <div style={detailValueStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaBuilding color="#679750" />
                    {currentProveedor.nombre}
                  </div>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Tipo de Documento</div>
                <div style={detailValueStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaIdCard color="#679750" />
                    {currentProveedor.tipoDocumento}
                  </div>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Número de Documento</div>
                <div style={detailValueStyle}>{currentProveedor.numeroDocumento}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Celular</div>
                <div style={detailValueStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaPhone color="#679750" />
                    {currentProveedor.celular}
                  </div>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Correo Electrónico</div>
                <div style={detailValueStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaEnvelope color="#679750" />
                    {currentProveedor.correo}
                  </div>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Departamento</div>
                <div style={detailValueStyle}>{currentProveedor.departamento}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Ciudad</div>
                <div style={detailValueStyle}>{currentProveedor.ciudad}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Barrio</div>
                <div style={detailValueStyle}>{currentProveedor.barrio}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Dirección</div>
                <div style={detailValueStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaMapMarkerAlt color="#679750" />
                    {currentProveedor.direccion}
                  </div>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Estado</div>
                <div style={{
                  ...detailValueStyle,
                  color: currentProveedor.estado ? '#4caf50' : '#e57373',
                  fontWeight: 'bold'
                }}>
                  {currentProveedor.estado ? '🟢 Activo' : '🔴 Inactivo'}
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
          <div style={{ ...modalContentStyle, maxWidth: 450, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 20, color: "#2E5939" }}>Confirmar Eliminación</h3>
            <p style={{ marginBottom: 30, fontSize: '1.1rem', color: "#2E5939" }}>
              ¿Estás seguro de eliminar al proveedor "<strong>{proveedorToDelete.nombre}</strong>"?
            </p>
            
            {/* Advertencia sobre valor */}
            <div style={{ 
              backgroundColor: '#fff3cd', 
              border: '1px solid #ffeaa7',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <FaInfoCircle style={{ color: '#856404' }} />
                <strong style={{ color: '#856404' }}>Proveedor a eliminar</strong>
              </div>
              <p style={{ color: '#856404', margin: 0, fontSize: '0.9rem' }}>
                Documento: {proveedorToDelete.tipoDocumento} {proveedorToDelete.numeroDocumento} | 
                Estado: {proveedorToDelete.estado ? 'Activo' : 'Inactivo'}
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
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Ciudad</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Estado</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProveedores.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <FaInfoCircle size={30} color="#679750" />
                      {proveedores.length === 0 ? "No hay proveedores registrados" : "No se encontraron resultados"}
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
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProveedores.map((proveedor) => (
                  <tr key={proveedor.idProveedor} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "15px", fontWeight: "500" }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                          minWidth: "80px"
                        }}
                      >
                        {proveedor.estado ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
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
                        onClick={() => handleDeleteClick(proveedor)}
                        style={btnAccion("#fbe9e7", "#e57373")}
                        title="Eliminar"
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

      {/* Estadísticas */}
      {!loading && proveedores.length > 0 && (
        <div style={{
          marginTop: '20px',
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
              {proveedores.length}
            </div>
            <div style={{ fontSize: '14px', color: '#679750' }}>
              Total Proveedores
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
              {proveedores.filter(p => p.estado).length}
            </div>
            <div style={{ fontSize: '14px', color: '#679750' }}>
              Proveedores Activos
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
              {proveedores.filter(p => p.tipoDocumento === 'Cedula').length}
            </div>
            <div style={{ fontSize: '14px', color: '#679750' }}>
              Con Cédula
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
              {new Set(proveedores.map(p => p.ciudad)).size}
            </div>
            <div style={{ fontSize: '14px', color: '#679750' }}>
              Ciudades
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admiprovee;