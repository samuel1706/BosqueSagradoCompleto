import React, { useState, useMemo, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaTimes, FaSearch, FaPlus, FaExclamationTriangle, FaCheck, FaInfoCircle, FaDollarSign, FaUsers, FaCalendarDay, FaTag, FaConciergeBell, FaToggleOn, FaToggleOff } from "react-icons/fa";
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

const formFieldStyle = {
  marginBottom: 12,
};

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
// VALIDACIONES Y PATRONES PARA PAQUETES
// ===============================================
const VALIDATION_PATTERNS = {
  nombrePaquete: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-&]+$/,
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
const API_PAQUETES = "http://localhost:5204/api/Paquete";
const ITEMS_PER_PAGE = 5;

// ===============================================
// COMPONENTE FormField PARA PAQUETES
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
  maxLength,
  placeholder,
  showCharCount = false,
  min,
  max,
  step,
  icon
}) => {
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
      </div>
      {getValidationMessage()}
    </div>
  );
};

// ===============================================
// COMPONENTE PRINCIPAL Gestipaq MEJORADO
// ===============================================
const Gestipaq = () => {
  const [paquetes, setPaquetes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);
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

  // Estado inicial basado en la estructura de tu API
  const [newPackage, setNewPackage] = useState({
    idPaquete: 0,
    nombrePaquete: "",
    precioPaquete: "",
    personas: "2",
    dias: "1",
    descuento: "0",
    estado: true
  });

  // ===============================================
  // EFECTOS
  // ===============================================
  useEffect(() => {
    fetchPaquetes();
  }, []);

  // Validar formulario en tiempo real
  useEffect(() => {
    if (showForm) {
      validateField('nombrePaquete', newPackage.nombrePaquete);
      validateField('precioPaquete', newPackage.precioPaquete);
      validateField('personas', newPackage.personas);
      validateField('dias', newPackage.dias);
      validateField('descuento', newPackage.descuento);
      validateField('estado', newPackage.estado);
    }
  }, [newPackage, showForm]);

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
      success = value ? "Paquete activo" : "Paquete inactivo";
    }
    else if (trimmedValue) {
      success = "Campo válido.";
    }

    // Verificación de duplicados para nombre
    if (fieldName === 'nombrePaquete' && trimmedValue && !error) {
      const duplicate = paquetes.find(paquete => 
        paquete.nombrePaquete.toLowerCase() === trimmedValue.toLowerCase() && 
        (!isEditing || paquete.idPaquete !== newPackage.idPaquete)
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
    const nombreValid = validateField('nombrePaquete', newPackage.nombrePaquete);
    const precioValid = validateField('precioPaquete', newPackage.precioPaquete);
    const personasValid = validateField('personas', newPackage.personas);
    const diasValid = validateField('dias', newPackage.dias);
    const descuentoValid = validateField('descuento', newPackage.descuento);
    const estadoValid = validateField('estado', newPackage.estado);

    const isValid = nombreValid && precioValid && personasValid && diasValid && descuentoValid && estadoValid;
    
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
  const fetchPaquetes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_PAQUETES, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (Array.isArray(res.data)) {
        setPaquetes(res.data);
      } else {
        throw new Error("Formato de datos inválido");
      }
    } catch (error) {
      console.error("❌ Error al obtener paquetes:", error);
      handleApiError(error, "cargar los paquetes");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPackage = async (e) => {
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
      const packageData = {
        nombrePaquete: newPackage.nombrePaquete.trim(),
        precioPaquete: parseFloat(newPackage.precioPaquete),
        personas: parseInt(newPackage.personas),
        dias: parseInt(newPackage.dias),
        descuento: parseFloat(newPackage.descuento),
        estado: newPackage.estado
      };

      console.log("📤 Enviando datos:", packageData);

      if (isEditing) {
        // Para edición, incluir el idPaquete
        packageData.idPaquete = newPackage.idPaquete;
        await axios.put(`${API_PAQUETES}/${newPackage.idPaquete}`, packageData, {
          headers: { 'Content-Type': 'application/json' }
        });
        displayAlert("Paquete actualizado exitosamente.", "success");
      } else {
        await axios.post(API_PAQUETES, packageData, {
          headers: { 'Content-Type': 'application/json' }
        });
        displayAlert("Paquete agregado exitosamente.", "success");
      }
      
      await fetchPaquetes();
      closeForm();
    } catch (error) {
      console.error("❌ Error al guardar paquete:", error);
      handleApiError(error, isEditing ? "actualizar el paquete" : "agregar el paquete");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (packageToDelete) {
      setLoading(true);
      try {
        await axios.delete(`${API_PAQUETES}/${packageToDelete.idPaquete}`);
        displayAlert("Paquete eliminado exitosamente.", "success");
        await fetchPaquetes();
      } catch (error) {
        console.error("❌ Error al eliminar paquete:", error);
        
        if (error.response && error.response.status === 409) {
          displayAlert("No se puede eliminar el paquete porque está siendo utilizado en reservas.", "error");
        } else {
          handleApiError(error, "eliminar el paquete");
        }
      } finally {
        setLoading(false);
        setPackageToDelete(null);
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
    setNewPackage((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para cambiar el estado con el botón toggle
  const toggleEstado = () => {
    setNewPackage(prev => ({
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
    setNewPackage({
      idPaquete: 0,
      nombrePaquete: "",
      precioPaquete: "",
      personas: "2",
      dias: "1",
      descuento: "0",
      estado: true
    });
  };

  const closeDetailsModal = () => {
    setShowDetails(false);
    setSelectedPackage(null);
  };

  const cancelDelete = () => {
    setPackageToDelete(null);
    setShowDeleteConfirm(false);
  };

  const toggleEstadoPaquete = async (paquete) => {
    setLoading(true);
    try {
      const updatedPackage = { 
        ...paquete, 
        estado: !paquete.estado 
      };
      await axios.put(`${API_PAQUETES}/${paquete.idPaquete}`, updatedPackage, {
        headers: { 'Content-Type': 'application/json' }
      });
      displayAlert(`Paquete ${updatedPackage.estado ? 'activado' : 'desactivado'} exitosamente.`, "success");
      await fetchPaquetes();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      handleApiError(error, "cambiar el estado");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (paquete) => {
    setSelectedPackage(paquete);
    setShowDetails(true);
  };

  const handleEdit = (paquete) => {
    setNewPackage({
      ...paquete,
      precioPaquete: paquete.precioPaquete.toString(),
      personas: paquete.personas.toString(),
      dias: paquete.dias.toString(),
      descuento: paquete.descuento.toString(),
      estado: paquete.estado
    });
    setIsEditing(true);
    setShowForm(true);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
  };

  const handleDeleteClick = (paquete) => {
    setPackageToDelete(paquete);
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
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

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
              onClick={fetchPaquetes}
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
          <h2 style={{ margin: 0, color: "#2E5939" }}>Gestión de Paquetes</h2>
          <p style={{ margin: "5px 0 0 0", color: "#679750", fontSize: "14px" }}>
            {paquetes.length} paquetes registrados • 
            {paquetes.filter(p => p.estado).length} activos • 
            Valor total: {formatPrice(paquetes.reduce((sum, paquete) => sum + paquete.precioPaquete, 0))}
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setIsEditing(false);
            setFormErrors({});
            setFormSuccess({});
            setFormWarnings({});
            setNewPackage({
              idPaquete: 0,
              nombrePaquete: "",
              precioPaquete: "",
              personas: "2",
              dias: "1",
              descuento: "0",
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
          <FaPlus /> Agregar Paquete
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 500 }}>
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
        <div style={{ color: '#2E5939', fontSize: '14px', whiteSpace: 'nowrap' }}>
          {filteredPaquetes.length} resultados
        </div>
      </div>

      {/* Formulario de agregar/editar */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 600 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939", textAlign: 'center' }}>
                {isEditing ? "Editar Paquete" : "Nuevo Paquete"}
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
            
            <form onSubmit={handleAddPackage}>
              <div style={formContainerStyle}>
                <FormField
                  label="Nombre del Paquete"
                  name="nombrePaquete"
                  value={newPackage.nombrePaquete}
                  onChange={handleChange}
                  error={formErrors.nombrePaquete}
                  success={formSuccess.nombrePaquete}
                  warning={formWarnings.nombrePaquete}
                  style={{ gridColumn: '1 / -1' }}
                  required={true}
                  disabled={loading}
                  maxLength={VALIDATION_RULES.nombrePaquete.maxLength}
                  showCharCount={true}
                  placeholder="Ej: Paquete Romántico, Aventura Familiar, Relax Total..."
                />

                <FormField
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaDollarSign />
                      Precio Base (COP)
                    </div>
                  }
                  name="precioPaquete"
                  type="number"
                  value={newPackage.precioPaquete}
                  onChange={handleChange}
                  error={formErrors.precioPaquete}
                  success={formSuccess.precioPaquete}
                  warning={formWarnings.precioPaquete}
                  required={true}
                  disabled={loading}
                  min={VALIDATION_RULES.precioPaquete.min}
                  max={VALIDATION_RULES.precioPaquete.max}
                  step="1000"
                  placeholder="1000"
                  icon={<FaDollarSign />}
                />

                <FormField
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaUsers />
                      Número de Personas
                    </div>
                  }
                  name="personas"
                  type="number"
                  value={newPackage.personas}
                  onChange={handleChange}
                  error={formErrors.personas}
                  success={formSuccess.personas}
                  warning={formWarnings.personas}
                  required={true}
                  disabled={loading}
                  min={VALIDATION_RULES.personas.min}
                  max={VALIDATION_RULES.personas.max}
                  placeholder="2"
                  icon={<FaUsers />}
                />

                <FormField
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaCalendarDay />
                      Días de Duración
                    </div>
                  }
                  name="dias"
                  type="number"
                  value={newPackage.dias}
                  onChange={handleChange}
                  error={formErrors.dias}
                  success={formSuccess.dias}
                  warning={formWarnings.dias}
                  required={true}
                  disabled={loading}
                  min={VALIDATION_RULES.dias.min}
                  max={VALIDATION_RULES.dias.max}
                  placeholder="1"
                  icon={<FaCalendarDay />}
                />

                <FormField
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaTag />
                      Descuento (%)
                    </div>
                  }
                  name="descuento"
                  type="number"
                  value={newPackage.descuento}
                  onChange={handleChange}
                  error={formErrors.descuento}
                  success={formSuccess.descuento}
                  warning={formWarnings.descuento}
                  style={{ gridColumn: '1 / -1' }}
                  required={true}
                  disabled={loading}
                  min={VALIDATION_RULES.descuento.min}
                  max={VALIDATION_RULES.descuento.max}
                  step="0.1"
                  placeholder="0"
                  icon={<FaTag />}
                />

                {/* Botón Toggle para Estado - oculto en modo edición */}
                {!isEditing && (
                  <div style={{ gridColumn: '1 / -1', marginBottom: '15px' }}>
                    <label style={labelStyle}>
                      Estado del Paquete
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <button
                        type="button"
                        onClick={toggleEstado}
                        style={toggleButtonStyle(newPackage.estado)}
                        disabled={loading}
                      >
                        {newPackage.estado ? (
                          <>
                            <FaToggleOn size={20} />
                            <span>🟢 Activo</span>
                          </>
                        ) : (
                          <>
                            <FaToggleOff size={20} />
                            <span>🔴 Inactivo</span>
                          </>
                        )}
                      </button>
                      <span style={{ 
                        fontSize: '14px', 
                        color: newPackage.estado ? '#4caf50' : '#e57373',
                        fontWeight: '500'
                      }}>
                        {newPackage.estado 
                          ? 'El paquete está activo y disponible para reservas' 
                          : 'El paquete está inactivo y no disponible para reservas'
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

              {/* Resumen del paquete */}
              {newPackage.precioPaquete && (
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
                      {formatPrice(parseFloat(newPackage.precioPaquete))}
                    </div>
                    
                    {newPackage.descuento > 0 && (
                      <>
                        <div>Descuento ({newPackage.descuento}%):</div>
                        <div style={{ textAlign: 'right', color: '#e57373' }}>
                          -{formatPrice(parseFloat(newPackage.precioPaquete) * parseFloat(newPackage.descuento) / 100)}
                        </div>
                        
                        <div style={{ borderTop: '1px solid #ccc', paddingTop: '5px' }}>
                          <strong>Precio final:</strong>
                        </div>
                        <div style={{ textAlign: 'right', fontWeight: 'bold', color: '#2E5939', borderTop: '1px solid #ccc', paddingTop: '5px' }}>
                          {formatPrice(calcularPrecioConDescuento(parseFloat(newPackage.precioPaquete), parseFloat(newPackage.descuento)))}
                        </div>
                      </>
                    )}
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
                  {loading ? "Guardando..." : (isEditing ? "Actualizar" : "Guardar")} Paquete
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
      {showDetails && selectedPackage && (
        <div style={modalOverlayStyle}>
          <div style={{ ...detailsModalStyle, maxWidth: 600 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939" }}>Detalles del Paquete</h2>
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
                <div style={detailValueStyle}>#{selectedPackage.idPaquete}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Nombre del Paquete</div>
                <div style={detailValueStyle}>{selectedPackage.nombrePaquete}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Precio Base</div>
                <div style={detailValueStyle}>{formatPrice(selectedPackage.precioPaquete)}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Personas</div>
                <div style={detailValueStyle}>{selectedPackage.personas}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Días</div>
                <div style={detailValueStyle}>{selectedPackage.dias}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Descuento</div>
                <div style={detailValueStyle}>{selectedPackage.descuento}%</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Precio Final</div>
                <div style={{...detailValueStyle, fontWeight: 'bold', color: '#679750'}}>
                  {formatPrice(calcularPrecioConDescuento(selectedPackage.precioPaquete, selectedPackage.descuento))}
                </div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Estado</div>
                <div style={{
                  ...detailValueStyle,
                  color: selectedPackage.estado ? '#4caf50' : '#e57373',
                  fontWeight: 'bold'
                }}>
                  {selectedPackage.estado ? '🟢 Activo' : '🔴 Inactivo'}
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
      {showDeleteConfirm && packageToDelete && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 450, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 20, color: "#2E5939" }}>Confirmar Eliminación</h3>
            <p style={{ marginBottom: 30, fontSize: '1.1rem', color: "#2E5939" }}>
              ¿Estás seguro de eliminar el paquete "<strong>{packageToDelete.nombrePaquete}</strong>"?
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
                <strong style={{ color: '#856404' }}>Paquete a eliminar</strong>
              </div>
              <p style={{ color: '#856404', margin: 0, fontSize: '0.9rem' }}>
                Precio: {formatPrice(packageToDelete.precioPaquete)} | 
                Personas: {packageToDelete.personas} | 
                Días: {packageToDelete.dias} |
                Descuento: {packageToDelete.descuento}%
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
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Personas</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Días</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Descuento</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Estado</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPaquetes.length === 0 && !loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
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
                paginatedPaquetes.map((paquete) => (
                  <tr key={paquete.idPaquete} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "15px", fontWeight: "500" }}>{paquete.nombrePaquete}</td>
                    <td style={{ padding: "15px", textAlign: "right" }}>{formatPrice(paquete.precioPaquete)}</td>
                    <td style={{ padding: "15px", textAlign: "right", fontWeight: "bold", color: "#679750" }}>
                      {formatPrice(calcularPrecioConDescuento(paquete.precioPaquete, paquete.descuento))}
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>{paquete.personas}</td>
                    <td style={{ padding: "15px", textAlign: "center" }}>{paquete.dias}</td>
                    <td style={{ padding: "15px", textAlign: "center" }}>{paquete.descuento}%</td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <button
                        onClick={() => toggleEstadoPaquete(paquete)}
                        style={{
                          cursor: "pointer",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          border: "none",
                          backgroundColor: paquete.estado ? "#4caf50" : "#e57373",
                          color: "white",
                          fontWeight: "600",
                          fontSize: "12px",
                          minWidth: "80px"
                        }}
                      >
                        {paquete.estado ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
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
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(paquete)}
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
      {!loading && paquetes.length > 0 && (
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
            backgroundColor: '#E8F5E8',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center',
            border: '1px solid #679750'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2E5939' }}>
              {paquetes.filter(p => p.descuento > 0).length}
            </div>
            <div style={{ fontSize: '14px', color: '#679750' }}>
              Con Descuento
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
              {formatPrice(paquetes.reduce((sum, paquete) => sum + paquete.precioPaquete, 0))}
            </div>
            <div style={{ fontSize: '14px', color: '#679750' }}>
              Valor Total
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gestipaq;