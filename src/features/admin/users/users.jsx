// src/components/Users.jsx
import { FaEye, FaEdit, FaTrash, FaTimes, FaExclamationTriangle, FaPlus, FaCheck, FaInfoCircle, FaSearch, FaUser, FaUserShield, FaPhone, FaEnvelope, FaIdCard, FaCalendar, FaLock, FaSync, FaFilter, FaSlidersH } from "react-icons/fa";
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

const inputSuccessStyle = {
  ...inputStyle,
  border: "2px solid #4caf50",
  backgroundColor: "#f1f8e9",
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
  overflowY: "auto",
  padding: "20px 0",
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: 24,
  borderRadius: 12,
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  width: "92%",
  maxWidth: 900,
  color: "#2E5939",
  boxSizing: 'border-box',
  border: "2px solid #679750",
  margin: "auto",
};

const sectionStyle = {
  marginBottom: 18,
  padding: 12,
  borderRadius: 8,
  backgroundColor: "#FBFDF9",
  border: "1px solid rgba(103,151,80,0.08)"
};

const sectionHeaderStyle = {
  margin: "0 0 8px 0",
  fontSize: 16,
  color: "#2E5939",
  fontWeight: 700
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
  border: "2px solid #679750",
  margin: "20px auto",
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

const passwordStrengthStyle = {
  marginTop: '5px',
  fontSize: '14px',
  fontWeight: '500',
};

const strengthBarStyle = {
  height: '4px',
  borderRadius: '2px',
  marginTop: '5px',
  transition: 'all 0.3s ease',
};

// ===============================================
// VALIDACIONES Y PATRONES
// ===============================================
const VALIDATION_PATTERNS = {
  nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  apellido: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  celular: /^[0-9]{10}$/,
  numeroDocumento: /^[0-9]{6,12}$/
};

const VALIDATION_RULES = {
  tipoDocumento: {
    required: true,
    errorMessages: {
      required: "El tipo de documento es obligatorio."
    }
  },
  numeroDocumento: {
    minLength: 6,
    maxLength: 12,
    required: true,
    pattern: VALIDATION_PATTERNS.numeroDocumento,
    errorMessages: {
      required: "El número de documento es obligatorio.",
      minLength: "El documento debe tener al menos 6 dígitos.",
      maxLength: "El documento no puede exceder los 12 dígitos.",
      pattern: "El documento solo puede contener números."
    }
  },
  nombre: {
    minLength: 2,
    maxLength: 50,
    required: true,
    pattern: VALIDATION_PATTERNS.nombre,
    errorMessages: {
      required: "El nombre es obligatorio.",
      minLength: "El nombre debe tener al menos 2 caracteres.",
      maxLength: "El nombre no puede exceder los 50 caracteres.",
      pattern: "El nombre solo puede contener letras y espacios."
    }
  },
  apellido: {
    minLength: 2,
    maxLength: 50,
    required: true,
    pattern: VALIDATION_PATTERNS.apellido,
    errorMessages: {
      required: "El apellido es obligatorio.",
      minLength: "El apellido debe tener al menos 2 caracteres.",
      maxLength: "El apellido no puede exceder los 50 caracteres.",
      pattern: "El apellido solo puede contener letras y espacios."
    }
  },
  celular: {
    required: true,
    pattern: VALIDATION_PATTERNS.celular,
    errorMessages: {
      required: "El número celular es obligatorio.",
      pattern: "El celular debe tener exactamente 10 dígitos."
    }
  },
  fechaNacimiento: {
    required: true,
    errorMessages: {
      required: "La fecha de nacimiento es obligatoria.",
      age: "Debe ser mayor de 18 años."
    }
  },
  correo: {
    required: true,
    pattern: VALIDATION_PATTERNS.correo,
    errorMessages: {
      required: "El correo electrónico es obligatorio.",
      pattern: "El formato del correo electrónico no es válido."
    }
  },
  idRol: {
    required: true,
    errorMessages: {
      required: "Debe seleccionar un rol."
    }
  },
  contrasena: {
    minLength: 8,
    required: false,
    errorMessages: {
      required: "La contraseña es obligatoria.",
      minLength: "La contraseña debe tener al menos 8 caracteres.",
      strength: "La contraseña es muy débil. Incluye mayúsculas, minúsculas, números y símbolos."
    }
  },
  confirmPassword: {
    required: false,
    errorMessages: {
      required: "Debe confirmar la contraseña.",
      mismatch: "Las contraseñas no coinciden."
    }
  }
};

// ===============================================
// DATOS DE CONFIGURACIÓN
// ===============================================
const API_USUARIOS = "https://www.bosquesagrado.somee.com/api/Usuarios";
const API_ROLES = "https://www.bosquesagrado.somee.com/api/Rol";

const ITEMS_PER_PAGE = 10;

// Opciones de tipo de documento
const TIPO_DOCUMENTO_OPTIONS = [
  { value: "Cédula de Ciudadanía", label: "Cédula de Ciudadanía" },
  { value: "Cédula de Extranjería", label: "Cédula de Extranjería" },
  { value: "Tarjeta de Identidad", label: "Tarjeta de Identidad" },
  { value: "Pasaporte", label: "Pasaporte" },
  { value: "NIT", label: "NIT" }
];

// ===============================================
// COMPONENTE FormField PARA USUARIOS
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
  showValidation = true,
  ...props
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

    if (name === 'nombre' || name === 'apellido') {
      filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    } else if (name === 'numeroDocumento' || name === 'celular') {
      filteredValue = value.replace(/[^0-9]/g, "");
    } else {
      filteredValue = value;
    }
    
    onChange({ target: { name, value: filteredValue } });
  };

  const getInputStyle = () => {
    if (error && showValidation) {
      return inputErrorStyle;
    } else if (success && showValidation) {
      return inputSuccessStyle;
    }
    return inputStyle;
  };

  const getValidationMessage = () => {
    if (!showValidation) return null;
    
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
    <div style={{ marginBottom: '12px', ...style }}>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: "red" }}>*</span>}
      </label>
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          style={{
            ...getInputStyle(),
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232E5939' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            backgroundSize: '16px'
          }}
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
            {...props}
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
// COMPONENTE PRINCIPAL Users MEJORADO
// ===============================================
const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState({});
  const [formWarnings, setFormWarnings] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState("all");
  const [showValidation, setShowValidation] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    estado: "all",
    tipoDocumento: "all",
    fechaDesde: "",
    fechaHasta: "",
    edadMin: "",
    edadMax: ""
  });

  const [newUser, setNewUser] = useState({
    tipoDocumento: "Cédula de Ciudadanía",
    numeroDocumento: "",
    nombre: "",
    apellido: "",
    celular: "",
    fechaNacimiento: "",
    correo: "",
    idRol: "",
    estado: true,
    contrasena: "",
    confirmPassword: ""
  });

  // ===============================================
  // EFECTOS
  // ===============================================
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // Validar formulario en tiempo real solo cuando showValidation es true
  useEffect(() => {
    if (showForm && showValidation) {
      validateField('tipoDocumento', newUser.tipoDocumento);
      validateField('numeroDocumento', newUser.numeroDocumento);
      validateField('nombre', newUser.nombre);
      validateField('apellido', newUser.apellido);
      validateField('celular', newUser.celular);
      validateField('fechaNacimiento', newUser.fechaNacimiento);
      validateField('correo', newUser.correo);
      validateField('idRol', newUser.idRol);
      
      if (newUser.contrasena || newUser.confirmPassword) {
        validateField('contrasena', newUser.contrasena);
        validateField('confirmPassword', newUser.confirmPassword);
      }
    }
  }, [newUser, showForm, isEditing, showValidation]);

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
      
      /* Prevenir scroll del body cuando hay modal abierto */
      body.modal-open {
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Efecto para controlar el scroll del body cuando se abre/cierra el modal
  useEffect(() => {
    if (showForm || showDetails || showDeleteConfirm) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showForm, showDetails, showDeleteConfirm]);

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
  const calculateAge = (fechaNacimiento) => {
    const today = new Date();
    const birthDate = new Date(fechaNacimiento);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "", color: "#e74c3c" };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    const strengthMap = {
      0: { text: "Muy débil", color: "#e74c3c" },
      1: { text: "Débil", color: "#e74c3c" },
      2: { text: "Regular", color: "#f39c12" },
      3: { text: "Buena", color: "#f1c40f" },
      4: { text: "Fuerte", color: "#2ecc71" },
      5: { text: "Muy fuerte", color: "#27ae60" }
    };

    return { strength, ...strengthMap[strength] };
  };

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
    else if (fieldName === 'fechaNacimiento' && trimmedValue) {
      const age = calculateAge(trimmedValue);
      if (age < 18) {
        error = rules.errorMessages.age;
      } else {
        success = `Edad válida: ${age} años`;
        
        if (age > 60) {
          warning = "El usuario es mayor de 60 años.";
        }
      }
    }
    else if (fieldName === 'contrasena' && trimmedValue) {
      const passwordStrength = getPasswordStrength(trimmedValue);
      if (trimmedValue.length < 8) {
        error = rules.errorMessages.minLength;
      } else if (passwordStrength.strength < 3) {
        error = rules.errorMessages.strength;
      } else {
        success = `Contraseña ${passwordStrength.text.toLowerCase()}`;
      }
    }
    else if (fieldName === 'confirmPassword' && trimmedValue) {
      if (trimmedValue !== newUser.contrasena) {
        error = rules.errorMessages.mismatch;
      } else if (newUser.contrasena) {
        success = "Las contraseñas coinciden";
      }
    }
    else if (trimmedValue) {
      success = "Campo válido";
    }

    if ((fieldName === 'numeroDocumento' || fieldName === 'correo') && trimmedValue && !error) {
      const duplicate = users.find(user => {
        if (fieldName === 'numeroDocumento') {
          return user.numeroDocumento === trimmedValue && 
                 (!isEditing || user.idUsuario !== newUser.idUsuario);
        } else if (fieldName === 'correo') {
          return user.correo.toLowerCase() === trimmedValue.toLowerCase() && 
                 (!isEditing || user.idUsuario !== newUser.idUsuario);
        }
        return false;
      });
      
      if (duplicate) {
        error = fieldName === 'numeroDocumento' 
          ? "Ya existe un usuario con este número de documento." 
          : "Ya existe un usuario con este correo electrónico.";
      }
    }

    setFormErrors(prev => ({ ...prev, [fieldName]: error }));
    setFormSuccess(prev => ({ ...prev, [fieldName]: success }));
    setFormWarnings(prev => ({ ...prev, [fieldName]: warning }));

    return !error;
  };

  const validateForm = () => {
    const fieldsToValidate = [
      'tipoDocumento', 'numeroDocumento', 'nombre', 'apellido', 
      'celular', 'fechaNacimiento', 'correo', 'idRol'
    ];

    if (!isEditing || newUser.contrasena || newUser.confirmPassword) {
      fieldsToValidate.push('contrasena', 'confirmPassword');
    }

    let isValid = true;
    fieldsToValidate.forEach(field => {
      if (!validateField(field, newUser[field])) {
        isValid = false;
      }
    });

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
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_USUARIOS, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        throw new Error("Formato de datos inválido");
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      handleApiError(error, "cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    setLoadingRoles(true);
    try {
      const res = await axios.get(API_ROLES, { timeout: 10000 });
      
      if (Array.isArray(res.data)) {
        setRoles(res.data);
      }
    } catch (error) {
      console.error("Error al obtener roles:", error);
      handleApiError(error, "cargar los roles");
    } finally {
      setLoadingRoles(false);
    }
  };

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
        errorMessage = "Conflicto: El usuario tiene datos asociados y no puede ser eliminado.";
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

  // ===============================================
  // FUNCIONES CRUD MEJORADAS
  // ===============================================
  const handleAddUser = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) {
      displayAlert("Ya se está procesando una solicitud. Por favor espere.", "warning");
      return;
    }

    setShowValidation(true);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setLoading(true);
    
    try {
      const userData = {
        tipoDocumento: newUser.tipoDocumento,
        numeroDocumento: newUser.numeroDocumento,
        nombre: newUser.nombre,
        apellido: newUser.apellido,
        celular: newUser.celular,
        fechaNacimiento: newUser.fechaNacimiento,
        correo: newUser.correo,
        idRol: parseInt(newUser.idRol),
        estado: newUser.estado
      };

      if (isEditing) {
        if (!newUser.contrasena) {
          userData.contrasena = currentPassword;
        } else {
          userData.contrasena = newUser.contrasena;
        }
      } else {
        if (!newUser.contrasena) {
          displayAlert("La contraseña es obligatoria para crear un nuevo usuario.", "error");
          return;
        }
        userData.contrasena = newUser.contrasena;
      }

      console.log("Enviando datos de usuario:", userData);

      if (isEditing) {
        userData.idUsuario = parseInt(newUser.idUsuario);
        
        await axios.put(`${API_USUARIOS}/${newUser.idUsuario}`, userData, {
          headers: { 'Content-Type': 'application/json' }
        });
        displayAlert("Usuario actualizado exitosamente.", "success");
      } else {
        await axios.post(API_USUARIOS, userData, {
          headers: { 'Content-Type': 'application/json' }
        });
        displayAlert("Usuario agregado exitosamente.", "success");
      }
      
      await fetchUsers();
      closeForm();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      handleApiError(error, isEditing ? "actualizar el usuario" : "agregar el usuario");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      setLoading(true);
      try {
        await axios.delete(`${API_USUARIOS}/${userToDelete.idUsuario}`);
        displayAlert("Usuario eliminado exitosamente.", "success");
        await fetchUsers();
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        
        if (error.response && error.response.status === 409) {
          displayAlert("No se puede eliminar el usuario porque tiene datos asociados.", "error");
        } else {
          handleApiError(error, "eliminar el usuario");
        }
      } finally {
        setLoading(false);
        setUserToDelete(null);
        setShowDeleteConfirm(false);
      }
    }
  };

  // ===============================================
  // FUNCIONES AUXILIARES MEJORADAS
  // ===============================================
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (!showValidation && value.trim() !== '') {
      setShowValidation(true);
    }
  };

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
      tipoDocumento: "all",
      fechaDesde: "",
      fechaHasta: "",
      edadMin: "",
      edadMax: ""
    });
    setCurrentPage(1);
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
    setShowValidation(false);
    setCurrentPassword("");
    setNewUser({
      tipoDocumento: "Cédula de Ciudadanía",
      numeroDocumento: "",
      nombre: "",
      apellido: "",
      celular: "",
      fechaNacimiento: "",
      correo: "",
      idRol: "",
      estado: true,
      contrasena: "",
      confirmPassword: ""
    });
  };

  const closeDetailsModal = () => {
    setShowDetails(false);
    setCurrentUser(null);
  };

  const cancelDelete = () => {
    setUserToDelete(null);
    setShowDeleteConfirm(false);
  };

  const toggleActive = async (user) => {
    setLoading(true);
    try {
      const userDetails = await axios.get(`${API_USUARIOS}/${user.idUsuario}`);
      const currentPassword = userDetails.data.contrasena;
      
      const updatedUser = {
        idUsuario: user.idUsuario,
        tipoDocumento: user.tipoDocumento,
        numeroDocumento: user.numeroDocumento,
        nombre: user.nombre,
        apellido: user.apellido,
        celular: user.celular,
        fechaNacimiento: user.fechaNacimiento,
        correo: user.correo,
        idRol: user.idRol,
        estado: !user.estado,
        contrasena: currentPassword
      };
      
      await axios.put(`${API_USUARIOS}/${user.idUsuario}`, updatedUser, {
        headers: { 'Content-Type': 'application/json' }
      });
      displayAlert(`Usuario ${updatedUser.estado ? 'activado' : 'desactivado'} exitosamente.`, "success");
      await fetchUsers();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      handleApiError(error, "cambiar el estado");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (user) => {
    setCurrentUser(user);
    setShowDetails(true);
  };

  const handleEdit = async (user) => {
    console.log("Editando usuario:", user);
    
    try {
      const userDetails = await axios.get(`${API_USUARIOS}/${user.idUsuario}`);
      const usuarioCompleto = userDetails.data;
      
      const formattedDate = usuarioCompleto.fechaNacimiento 
        ? usuarioCompleto.fechaNacimiento.split('T')[0] 
        : "";
      
      setCurrentPassword(usuarioCompleto.contrasena || "currentpassword123");
      
      setNewUser({
        idUsuario: usuarioCompleto.idUsuario,
        tipoDocumento: usuarioCompleto.tipoDocumento || "Cédula de Ciudadanía",
        numeroDocumento: usuarioCompleto.numeroDocumento || "",
        nombre: usuarioCompleto.nombre || "",
        apellido: usuarioCompleto.apellido || "",
        celular: usuarioCompleto.celular || "",
        fechaNacimiento: formattedDate,
        correo: usuarioCompleto.correo || "",
        idRol: usuarioCompleto.idRol ? usuarioCompleto.idRol.toString() : "",
        estado: usuarioCompleto.estado !== undefined ? usuarioCompleto.estado : true,
        contrasena: "",
        confirmPassword: ""
      });
      
      setIsEditing(true);
      setShowForm(true);
      setFormErrors({});
      setFormSuccess({});
      setFormWarnings({});
      setShowValidation(false);
    } catch (error) {
      console.error("Error al cargar detalles del usuario:", error);
      displayAlert("Error al cargar los datos del usuario para editar.", "error");
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  // ===============================================
  // FUNCIONES DE FILTRADO Y PAGINACIÓN MEJORADAS
  // ===============================================
  const filteredUsers = useMemo(() => {
    let filtered = users.filter(user => {
      // Búsqueda general
      const matchesSearch = 
        user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.numeroDocumento?.includes(searchTerm) ||
        getRoleName(user.idRol)?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Filtro por rol
      if (selectedRole !== "all" && user.idRol !== parseInt(selectedRole)) {
        return false;
      }

      // Filtro por estado
      if (filters.estado !== "all") {
        const estadoFilter = filters.estado === "activo";
        if (user.estado !== estadoFilter) return false;
      }

      // Filtro por tipo de documento
      if (filters.tipoDocumento !== "all" && user.tipoDocumento !== filters.tipoDocumento) {
        return false;
      }

      // Filtro por fecha de nacimiento
      if (filters.fechaDesde || filters.fechaHasta) {
        const userFecha = new Date(user.fechaNacimiento);
        
        if (filters.fechaDesde) {
          const fechaDesde = new Date(filters.fechaDesde);
          if (userFecha < fechaDesde) return false;
        }
        
        if (filters.fechaHasta) {
          const fechaHasta = new Date(filters.fechaHasta);
          if (userFecha > fechaHasta) return false;
        }
      }

      // Filtro por edad
      if (filters.edadMin || filters.edadMax) {
        const edad = calculateAge(user.fechaNacimiento);
        
        if (filters.edadMin && edad < parseInt(filters.edadMin)) return false;
        if (filters.edadMax && edad > parseInt(filters.edadMax)) return false;
      }

      return true;
    });

    return filtered;
  }, [users, searchTerm, selectedRole, filters]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ===============================================
  // FUNCIONES PARA OBTENER NOMBRES Y DATOS
  // ===============================================
  const getRoleName = (idRol) => {
    const role = roles.find(r => r.idRol === idRol);
    return role ? role.nombreRol : `Rol ${idRol}`;
  };

  const getDocumentTypeName = (tipoDocumento) => {
    const tipo = TIPO_DOCUMENTO_OPTIONS.find(t => t.value === tipoDocumento);
    return tipo ? tipo.label : tipoDocumento;
  };

  const passwordStrength = getPasswordStrength(newUser.contrasena);

  // ===============================================
  // CÁLCULO DE ESTADÍSTICAS
  // ===============================================
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.estado).length;
    const inactiveUsers = users.filter(u => !u.estado).length;
    
    const roleStats = roles.map(role => {
      const count = users.filter(user => user.idRol === role.idRol).length;
      return {
        idRol: role.idRol,
        nombreRol: role.nombreRol,
        count: count,
        percentage: totalUsers > 0 ? ((count / totalUsers) * 100).toFixed(1) : 0
      };
    }).sort((a, b) => b.count - a.count);

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      roleStats,
      totalRoles: roles.length
    };
  }, [users, roles]);

  // Contador de filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedRole !== "all") count++;
    if (filters.estado !== "all") count++;
    if (filters.tipoDocumento !== "all") count++;
    if (filters.fechaDesde) count++;
    if (filters.fechaHasta) count++;
    if (filters.edadMin) count++;
    if (filters.edadMax) count++;
    return count;
  }, [selectedRole, filters]);

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
              onClick={fetchUsers}
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
          <h2 style={{ margin: 0, color: "#2E5939" }}>Gestión de Usuarios</h2>
          <p style={{ margin: "5px 0 0 0", color: "#679750", fontSize: "14px" }}>
            {users.length} usuarios registrados | {roles.length} roles disponibles
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
              setShowValidation(false);
              setCurrentPassword("");
              setNewUser({
                tipoDocumento: "Cédula de Ciudadanía",
                numeroDocumento: "",
                nombre: "",
                apellido: "",
                celular: "",
                fechaNacimiento: "",
                correo: "",
                idRol: "",
                estado: true,
                contrasena: "",
                confirmPassword: ""
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
            <FaPlus /> Agregar Usuario
          </button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      {!loading && users.length > 0 && (
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
              {stats.totalUsers}
            </div>
            <div style={{ fontSize: '16px', color: '#679750', fontWeight: '600' }}>
              Total Usuarios
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
              {stats.activeUsers}
            </div>
            <div style={{ fontSize: '16px', color: '#4caf50', fontWeight: '600' }}>
              Usuarios Activos
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
              {stats.inactiveUsers}
            </div>
            <div style={{ fontSize: '16px', color: '#e57373', fontWeight: '600' }}>
              Usuarios Inactivos
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
              {stats.totalRoles}
            </div>
            <div style={{ fontSize: '16px', color: '#2196f3', fontWeight: '600' }}>
              Roles Disponibles
            </div>
          </div>
        </div>
      )}

      {/* Barra de búsqueda y filtros */}
      <div style={{ 
        marginBottom: '20px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {/* Búsqueda principal */}
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
              placeholder="Buscar por nombre, apellido, correo, documento o rol..."
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

          {/* Botón para mostrar/ocultar filtros avanzados */}
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

              {/* Filtro por tipo de documento */}
              <div>
                <label style={labelStyle}>Tipo de Documento</label>
                <select
                  name="tipoDocumento"
                  value={filters.tipoDocumento}
                  onChange={handleFilterChange}
                  style={{
                    ...inputStyle,
                    width: '100%'
                  }}
                >
                  <option value="all">Todos los tipos</option>
                  {TIPO_DOCUMENTO_OPTIONS.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por fecha de nacimiento */}
              <div>
                <label style={labelStyle}>Fecha Nacimiento Desde</label>
                <input
                  type="date"
                  name="fechaDesde"
                  value={filters.fechaDesde}
                  onChange={handleFilterChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Fecha Nacimiento Hasta</label>
                <input
                  type="date"
                  name="fechaHasta"
                  value={filters.fechaHasta}
                  onChange={handleFilterChange}
                  style={inputStyle}
                />
              </div>

              {/* Filtro por edad */}
              <div>
                <label style={labelStyle}>Edad Mínima</label>
                <input
                  type="number"
                  name="edadMin"
                  value={filters.edadMin}
                  onChange={handleFilterChange}
                  placeholder="Ej: 18"
                  min="18"
                  max="100"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Edad Máxima</label>
                <input
                  type="number"
                  name="edadMax"
                  value={filters.edadMax}
                  onChange={handleFilterChange}
                  placeholder="Ej: 65"
                  min="18"
                  max="100"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        )}

        {/* Información de resultados filtrados */}
        {filteredUsers.length !== users.length && (
          <div style={{
            marginTop: '10px',
            padding: '8px 12px',
            backgroundColor: '#E8F5E8',
            borderRadius: '6px',
            color: '#2E5939',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Mostrando {filteredUsers.length} de {users.length} usuarios
            {activeFiltersCount > 0 && ` (filtros aplicados: ${activeFiltersCount})`}
          </div>
        )}
      </div>

      {/* Formulario de agregar/editar - SIN SCROLL INTERNO */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h2 style={{ margin: 0, color: "#2E5939" }}>
                {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
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
            
            <form onSubmit={handleAddUser}>
              {/* Sección: Datos personales */}
              <div style={sectionStyle}>
                <h4 style={sectionHeaderStyle}>Datos personales</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <FormField
                    label="Tipo de Documento"
                    name="tipoDocumento"
                    type="select"
                    value={newUser.tipoDocumento}
                    onChange={handleInputChange}
                    error={formErrors.tipoDocumento}
                    success={formSuccess.tipoDocumento}
                    warning={formWarnings.tipoDocumento}
                    options={TIPO_DOCUMENTO_OPTIONS}
                    required={true}
                    disabled={loading}
                    showValidation={showValidation}
                  />
                  
                  <FormField
                    label="Número de Documento"
                    name="numeroDocumento"
                    value={newUser.numeroDocumento}
                    onChange={handleInputChange}
                    error={formErrors.numeroDocumento}
                    success={formSuccess.numeroDocumento}
                    warning={formWarnings.numeroDocumento}
                    required={true}
                    disabled={loading}
                    maxLength={12}
                    placeholder="Solo números"
                    showCharCount={true}
                    showValidation={showValidation}
                  />
                  
                  <FormField
                    label="Nombre"
                    name="nombre"
                    value={newUser.nombre}
                    onChange={handleInputChange}
                    error={formErrors.nombre}
                    success={formSuccess.nombre}
                    warning={formWarnings.nombre}
                    required={true}
                    disabled={loading}
                    maxLength={50}
                    showCharCount={true}
                    placeholder="Ej: María, Carlos"
                    style={{ gridColumn: '1 / 2' }}
                    showValidation={showValidation}
                  />
                  
                  <FormField
                    label="Apellido"
                    name="apellido"
                    value={newUser.apellido}
                    onChange={handleInputChange}
                    error={formErrors.apellido}
                    success={formSuccess.apellido}
                    warning={formWarnings.apellido}
                    required={true}
                    disabled={loading}
                    maxLength={50}
                    showCharCount={true}
                    placeholder="Ej: González, Rodríguez"
                    style={{ gridColumn: '2 / 3' }}
                    showValidation={showValidation}
                  />
                </div>
              </div>

              {/* Sección: Contacto y rol */}
              <div style={sectionStyle}>
                <h4 style={sectionHeaderStyle}>Contacto y rol</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <FormField
                    label="Número Celular"
                    name="celular"
                    value={newUser.celular}
                    onChange={handleInputChange}
                    error={formErrors.celular}
                    success={formSuccess.celular}
                    warning={formWarnings.celular}
                    required={true}
                    disabled={loading}
                    maxLength={10}
                    placeholder="10 dígitos"
                    showValidation={showValidation}
                  />

                  <FormField
                    label="Fecha de Nacimiento"
                    name="fechaNacimiento"
                    type="date"
                    value={newUser.fechaNacimiento}
                    onChange={handleInputChange}
                    error={formErrors.fechaNacimiento}
                    success={formSuccess.fechaNacimiento}
                    warning={formWarnings.fechaNacimiento}
                    required={true}
                    disabled={loading}
                    showValidation={showValidation}
                  />

                  <FormField
                    label="Correo Electrónico"
                    name="correo"
                    type="email"
                    value={newUser.correo}
                    onChange={handleInputChange}
                    error={formErrors.correo}
                    success={formSuccess.correo}
                    warning={formWarnings.correo}
                    required={true}
                    disabled={loading}
                    maxLength={100}
                    placeholder="usuario@ejemplo.com"
                    style={{ gridColumn: '1 / 2' }}
                    showValidation={showValidation}
                  />

                  <FormField
                    label="Rol"
                    name="idRol"
                    type="select"
                    value={newUser.idRol}
                    onChange={handleInputChange}
                    error={formErrors.idRol}
                    success={formSuccess.idRol}
                    warning={formWarnings.idRol}
                    options={roles.filter(role => role.estado).map(role => ({ 
                      value: role.idRol.toString(), 
                      label: role.nombreRol 
                    }))}
                    required={true}
                    disabled={loadingRoles || roles.length === 0}
                    style={{ gridColumn: '2 / 3' }}
                    showValidation={showValidation}
                  />
                </div>
              </div>

              {/* Sección: Acceso (contraseñas) - MEJORADA */}
              <div style={sectionStyle}>
                <h4 style={sectionHeaderStyle}>Acceso</h4>

                {isEditing ? (
                  // Vista para edición - Contraseñas opcionales
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignItems: 'start' }}>
                    <div>
                      <FormField
                        label="Nueva Contraseña (opcional)"
                        name="contrasena"
                        type="password"
                        value={newUser.contrasena}
                        onChange={handleInputChange}
                        error={formErrors.contrasena}
                        success={formSuccess.contrasena}
                        warning={formWarnings.contrasena}
                        required={false}
                        disabled={loading}
                        minLength="8"
                        placeholder="Dejar vacío para mantener contraseña actual"
                        showValidation={showValidation}
                      />
                      {newUser.contrasena && (
                        <div style={passwordStrengthStyle}>
                          <div>Fortaleza: {passwordStrength.text}</div>
                          <div style={{
                            ...strengthBarStyle,
                            width: `${(passwordStrength.strength / 5) * 100}%`,
                            backgroundColor: passwordStrength.color
                          }}></div>
                        </div>
                      )}
                    </div>

                    <div>
                      <FormField
                        label="Confirmar Nueva Contraseña"
                        name="confirmPassword"
                        type="password"
                        value={newUser.confirmPassword}
                        onChange={handleInputChange}
                        error={formErrors.confirmPassword}
                        success={formSuccess.confirmPassword}
                        warning={formWarnings.confirmPassword}
                        required={false}
                        disabled={loading}
                        placeholder="Solo si cambias contraseña"
                        showValidation={showValidation}
                      />

                      <div style={{
                        backgroundColor: '#e8f5e8',
                        border: '1px solid #679750',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        marginTop: '8px',
                        color: '#2E5939',
                        fontSize: '13px'
                      }}>
                        <FaInfoCircle style={{ marginRight: 8, color: '#679750' }} /> 
                        {newUser.contrasena ? 
                          "Se cambiará la contraseña al guardar" : 
                          "La contraseña actual se mantendrá"
                        }
                      </div>
                    </div>
                  </div>
                ) : (
                  // Vista para creación - Contraseñas obligatorias
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignItems: 'start' }}>
                    <div>
                      <FormField
                        label="Contraseña"
                        name="contrasena"
                        type="password"
                        value={newUser.contrasena}
                        onChange={handleInputChange}
                        error={formErrors.contrasena}
                        success={formSuccess.contrasena}
                        warning={formWarnings.contrasena}
                        required={true}
                        disabled={loading}
                        minLength="8"
                        placeholder="Mínimo 8 caracteres"
                        showValidation={showValidation}
                      />
                      {newUser.contrasena && (
                        <div style={passwordStrengthStyle}>
                          <div>Fortaleza: {passwordStrength.text}</div>
                          <div style={{
                            ...strengthBarStyle,
                            width: `${(passwordStrength.strength / 5) * 100}%`,
                            backgroundColor: passwordStrength.color
                          }}></div>
                        </div>
                      )}
                    </div>

                    <div>
                      <FormField
                        label="Confirmar Contraseña"
                        name="confirmPassword"
                        type="password"
                        value={newUser.confirmPassword}
                        onChange={handleInputChange}
                        error={formErrors.confirmPassword}
                        success={formSuccess.confirmPassword}
                        warning={formWarnings.confirmPassword}
                        required={true}
                        disabled={loading}
                        placeholder="Repetir contraseña"
                        showValidation={showValidation}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Estado: solo visible al editar */}
              {isEditing && (
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="estado"
                      checked={newUser.estado}
                      onChange={handleInputChange}
                      disabled={loading}
                      style={{ width: '18px', height: '18px' }}
                    />
                    Usuario Activo
                  </label>
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
                  {loading ? "Guardando..." : 
                   (isEditing ? "Actualizar Usuario" : "Guardar Usuario")}
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

      {/* Modal de detalles - SIN SCROLL INTERNO */}
      {showDetails && currentUser && (
        <div style={modalOverlayStyle}>
          <div style={{ ...detailsModalStyle }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939" }}>Detalles del Usuario</h2>
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
                <div style={detailValueStyle}>#{currentUser.idUsuario}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Tipo de Documento</div>
                <div style={detailValueStyle}>{getDocumentTypeName(currentUser.tipoDocumento)}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Número de Documento</div>
                <div style={detailValueStyle}>{currentUser.numeroDocumento}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Nombre Completo</div>
                <div style={detailValueStyle}>{currentUser.nombre} {currentUser.apellido}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Celular</div>
                <div style={detailValueStyle}>{currentUser.celular}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Fecha de Nacimiento</div>
                <div style={detailValueStyle}>
                  {new Date(currentUser.fechaNacimiento).toLocaleDateString('es-ES')} 
                  <span style={{ 
                    marginLeft: '10px', 
                    backgroundColor: '#E8F5E8',
                    color: '#2E5939',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {calculateAge(currentUser.fechaNacimiento)} años
                  </span>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Correo Electrónico</div>
                <div style={detailValueStyle}>{currentUser.correo}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Rol</div>
                <div style={detailValueStyle}>
                  <span style={{ 
                    backgroundColor: '#E8F5E8',
                    color: '#2E5939',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {getRoleName(currentUser.idRol)}
                  </span>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Estado</div>
                <div style={{
                  ...detailValueStyle,
                  color: currentUser.estado ? '#4caf50' : '#e57373',
                  fontWeight: 'bold'
                }}>
                  {currentUser.estado ? '🟢 Activo' : '🔴 Inactivo'}
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
      {showDeleteConfirm && userToDelete && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 450, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 20, color: "#2E5939" }}>Confirmar Eliminación</h3>
            <p style={{ marginBottom: 30, fontSize: '1.1rem', color: "#2E5939" }}>
              ¿Estás seguro de eliminar al usuario "<strong>{userToDelete.nombre} {userToDelete.apellido}</strong>"?
            </p>
            
            {/* Advertencia */}
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
                Esta acción eliminará permanentemente al usuario y todos sus datos asociados.
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
              🔄 Cargando usuarios...
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
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Documento</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Nombre</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Apellido</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Correo</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Celular</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Rol</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Estado</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 && !loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <FaInfoCircle size={30} color="#679750" />
                      {users.length === 0 ? "No hay usuarios registrados" : "No se encontraron resultados con los filtros aplicados"}
                      {activeFiltersCount > 0 && (
                        <div style={{ color: '#679750', fontSize: '14px', marginTop: '5px' }}>
                          Filtros activos: {activeFiltersCount}
                        </div>
                      )}
                      {users.length === 0 && (
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
                          Agregar Primer Usuario
                        </button>
                      )}
                      {users.length > 0 && activeFiltersCount > 0 && (
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
                            marginTop: '10px'
                          }}
                        >
                          Limpiar Filtros
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.idUsuario} style={{ 
                    borderBottom: "1px solid #eee",
                    backgroundColor: user.estado ? '#fff' : '#f9f9f9'
                  }}>
                    <td style={{ padding: "15px" }}>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>
                        {getDocumentTypeName(user.tipoDocumento)}
                      </div>
                      <div style={{ fontWeight: "500" }}>{user.numeroDocumento}</div>
                    </td>
                    <td style={{ padding: "15px", fontWeight: "500" }}>{user.nombre}</td>
                    <td style={{ padding: "15px", fontWeight: "500" }}>{user.apellido}</td>
                    <td style={{ padding: "15px" }}>{user.correo}</td>
                    <td style={{ padding: "15px", textAlign: "center" }}>{user.celular}</td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <span style={{ 
                        backgroundColor: '#E8F5E8',
                        color: '#2E5939',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {getRoleName(user.idRol)}
                      </span>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <button
                        onClick={() => toggleActive(user)}
                        disabled={loading}
                        style={{
                          cursor: loading ? "not-allowed" : "pointer",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          border: "none",
                          backgroundColor: user.estado ? "#4caf50" : "#e57373",
                          color: "white",
                          fontWeight: "600",
                          fontSize: "12px",
                          minWidth: "80px",
                          opacity: loading ? 0.6 : 1
                        }}
                      >
                        {user.estado ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <button
                        onClick={() => handleView(user)}
                        style={btnAccion("#F7F4EA", "#2E5939")}
                        title="Ver Detalles"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        style={btnAccion("#F7F4EA", "#2E5939")}
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
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

export default Users;