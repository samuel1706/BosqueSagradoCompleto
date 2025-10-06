import React, { useState, useMemo, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaTimes, FaSearch, FaPlus, FaExclamationTriangle, FaCheck, FaInfoCircle, FaDollarSign, FaBox } from "react-icons/fa";
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
  // Patrón para nombre de comodidad: debe contener al menos una letra
  nombreComodidades: /^(?=.*[a-zA-ZáéíóúÁÉÍÓÚñÑ])[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-_&()]+$/,
  
  // Patrón para descripción: permite más caracteres para descripciones detalladas
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
      pattern: "El nombre contiene caracteres no permitidos o no tiene letras. Solo se permiten letras, números, espacios y los caracteres: - _ & ( )",
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
    min: 1,
    max: 1000,
    required: true,
    errorMessages: {
      required: "La cantidad es obligatoria.",
      min: "La cantidad mínima es 1.",
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
const API_COMODIDADES = "http://localhost:5255/api/Comodidades";
const ITEMS_PER_PAGE = 5;

// ===============================================
// COMPONENTE FormField PARA COMODIDADES
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
  step
}) => {
  const handleFilteredInputChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (name === 'nombreComodidades') {
      // Aplicar patrón de validación para nombre
      if (value === "" || VALIDATION_PATTERNS.nombreComodidades.test(value)) {
        filteredValue = value;
      } else {
        return;
      }
    } else if (name === 'descripcion') {
      // Aplicar patrón de validación para descripción
      if (value === "" || VALIDATION_PATTERNS.descripcion.test(value)) {
        filteredValue = value;
      } else {
        return;
      }
    } else if (name === 'cantidad') {
      // Solo números enteros positivos
      filteredValue = value.replace(/[^0-9]/g, "");
      if (filteredValue && parseInt(filteredValue) > (max || 1000)) {
        filteredValue = max || "1000";
      }
    } else if (name === 'precio') {
      // Solo números y punto decimal
      filteredValue = value.replace(/[^0-9.]/g, "");
      // Permitir solo un punto decimal
      const parts = filteredValue.split('.');
      if (parts.length > 2) {
        filteredValue = parts[0] + '.' + parts.slice(1).join('');
      }
      // Limitar a 2 decimales
      if (parts.length === 2 && parts[1].length > 2) {
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
      {type === "textarea" ? (
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
// COMPONENTE PRINCIPAL Furniture (Comodidades) CON VALIDACIONES MEJORADAS
// ===============================================
const Furniture = () => {
  const [comodidades, setComodidades] = useState([]);
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

  const [newItem, setNewItem] = useState({
    nombreComodidades: "",
    descripcion: "",
    fechaRegistro: new Date().toISOString().split('T')[0],
    cantidad: 1,
    precio: 0
  });

  // ===============================================
  // EFECTOS
  // ===============================================
  useEffect(() => {
    fetchComodidades();
  }, []);

  // Validar formulario en tiempo real
  useEffect(() => {
    if (showForm) {
      validateField('nombreComodidades', newItem.nombreComodidades);
      validateField('descripcion', newItem.descripcion);
      validateField('fechaRegistro', newItem.fechaRegistro);
      validateField('cantidad', newItem.cantidad);
      validateField('precio', newItem.precio);
    }
  }, [newItem, showForm]);

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

    // Validación de campo requerido
    if (rules.required && !trimmedValue) {
      error = rules.errorMessages.required;
    }
    // Validación de longitud mínima
    else if (trimmedValue && rules.minLength && trimmedValue.length < rules.minLength) {
      error = rules.errorMessages.minLength;
    }
    // Validación de longitud máxima
    else if (trimmedValue && rules.maxLength && trimmedValue.length > rules.maxLength) {
      error = rules.errorMessages.maxLength;
    }
    // Validación de patrón
    else if (trimmedValue && rules.pattern && !rules.pattern.test(trimmedValue)) {
      error = rules.errorMessages.pattern;
    }
    // Validación extra: no solo números
    else if (fieldName === 'nombreComodidades' && /^\d+$/.test(trimmedValue)) {
      error = rules.errorMessages.onlyNumbers;
    }
    // Validaciones numéricas
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
    // Validaciones de éxito y advertencia para otros campos
    else if (trimmedValue) {
      success = `${fieldName === 'nombreComodidades' ? 'Nombre' : fieldName === 'descripcion' ? 'Descripción' : 'Fecha'} válido.`;
      
      if (fieldName === 'nombreComodidades' && trimmedValue.length > 50) {
        warning = "El nombre es bastante largo. Considere un nombre más corto si es posible.";
      } else if (fieldName === 'descripcion' && trimmedValue.length > 300) {
        warning = "La descripción es muy larga. Considere ser más conciso.";
      }
    }

    // Verificación de duplicados para nombre (solo si no estamos editando la misma comodidad)
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
    const nombreValid = validateField('nombreComodidades', newItem.nombreComodidades);
    const descripcionValid = validateField('descripcion', newItem.descripcion);
    const fechaValid = validateField('fechaRegistro', newItem.fechaRegistro);
    const cantidadValid = validateField('cantidad', newItem.cantidad);
    const precioValid = validateField('precio', newItem.precio);

    const isValid = nombreValid && descripcionValid && fechaValid && cantidadValid && precioValid;
    
    if (!isValid) {
      displayAlert("Por favor, corrige los errores en el formulario antes de guardar.", "error");
      // Scroll al primer error
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
      // Preparar los datos para enviar al servidor
      const comodidadData = {
        nombreComodidades: newItem.nombreComodidades.trim(),
        descripcion: newItem.descripcion.trim(),
        fechaRegistro: newItem.fechaRegistro || new Date().toISOString().split('T')[0],
        cantidad: parseInt(newItem.cantidad),
        precio: parseFloat(newItem.precio)
      };

      console.log("📤 Enviando datos al servidor:", comodidadData);

      if (isEditing) {
        // Para editar, incluir el ID en los datos
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
        // Para crear nuevo
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
      setLoading(true);
      try {
        await axios.delete(`${API_COMODIDADES}/${itemToDelete.idComodidades}`);
        displayAlert("Comodidad eliminada exitosamente.", "success");
        await fetchComodidades();
        
        // Ajustar la página si es necesario
        if (paginatedItems.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("❌ Error al eliminar comodidad:", error);
        
        // Manejo específico para error de integridad referencial
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
  // FUNCIONES AUXILIARES MEJORADAS
  // ===============================================
  const handleApiError = (error, operation) => {
    let errorMessage = `Error al ${operation}`;
    let alertType = "error";
    
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      errorMessage = "Error de conexión. Verifica que el servidor esté ejecutándose.";
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = "No se puede conectar al servidor en http://localhost:5255";
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

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
    setNewItem({
      nombreComodidades: "",
      descripcion: "",
      fechaRegistro: new Date().toISOString().split('T')[0],
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
      // Formatear la fecha correctamente para el input date
      let fechaRegistro = "";
      if (item.fechaRegistro) {
        if (item.fechaRegistro.includes('T')) {
          fechaRegistro = item.fechaRegistro.split('T')[0];
        } else {
          fechaRegistro = item.fechaRegistro;
        }
      } else {
        fechaRegistro = new Date().toISOString().split('T')[0];
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
    } catch (error) {
      console.error("❌ Error al cargar datos para edición:", error);
      displayAlert("Error al cargar los datos para edición", "error");
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  // ===============================================
  // FUNCIONES DE FILTRADO Y PAGINACIÓN
  // ===============================================
  const filteredItems = useMemo(() => {
    return comodidades.filter((item) =>
      item.nombreComodidades?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [comodidades, searchTerm]);

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
            {comodidades.length} comodidades registradas • Valor total: {formatPrice(comodidades.reduce((sum, item) => sum + (item.precio * item.cantidad), 0))}
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setIsEditing(false);
            setFormErrors({});
            setFormSuccess({});
            setFormWarnings({});
            setNewItem({
              nombreComodidades: "",
              descripcion: "",
              fechaRegistro: new Date().toISOString().split('T')[0],
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

      {/* Barra de búsqueda */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 500 }}>
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
        <div style={{ color: '#2E5939', fontSize: '14px', whiteSpace: 'nowrap' }}>
          {filteredItems.length} resultados
        </div>
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
                    error={formErrors.nombreComodidades}
                    success={formSuccess.nombreComodidades}
                    warning={formWarnings.nombreComodidades}
                    required={true}
                    disabled={loading}
                    maxLength={VALIDATION_RULES.nombreComodidades.maxLength}
                    showCharCount={true}
                    placeholder="Ej: TV, WiFi, Aire Acondicionado..."
                  />
                </div>
                
                <div>
                  <FormField
                    label="Fecha de Registro"
                    name="fechaRegistro"
                    type="date"
                    value={newItem.fechaRegistro}
                    onChange={handleInputChange}
                    error={formErrors.fechaRegistro}
                    success={formSuccess.fechaRegistro}
                    warning={formWarnings.fechaRegistro}
                    required={true}
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <FormField
                    label="Cantidad"
                    name="cantidad"
                    type="number"
                    value={newItem.cantidad}
                    onChange={handleInputChange}
                    error={formErrors.cantidad}
                    success={formSuccess.cantidad}
                    warning={formWarnings.cantidad}
                    required={true}
                    disabled={loading}
                    min={VALIDATION_RULES.cantidad.min}
                    max={VALIDATION_RULES.cantidad.max}
                    step="1"
                  />
                </div>

                <div>
                  <FormField
                    label={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaDollarSign />
                        Precio (COP)
                      </div>
                    }
                    name="precio"
                    type="number"
                    value={newItem.precio}
                    onChange={handleInputChange}
                    error={formErrors.precio}
                    success={formSuccess.precio}
                    warning={formWarnings.precio}
                    required={true}
                    disabled={loading}
                    min={VALIDATION_RULES.precio.min}
                    max={VALIDATION_RULES.precio.max}
                    step="0.01"
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <FormField
                    label="Descripción"
                    name="descripcion"
                    type="textarea"
                    value={newItem.descripcion}
                    onChange={handleInputChange}
                    error={formErrors.descripcion}
                    success={formSuccess.descripcion}
                    warning={formWarnings.descripcion}
                    required={false}
                    disabled={loading}
                    maxLength={VALIDATION_RULES.descripcion.maxLength}
                    showCharCount={true}
                    placeholder="Descripción detallada de la comodidad..."
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

      {/* Resto del código (Modal de detalles, Modal de Confirmación de Eliminación, Tabla, Paginación) se mantiene similar */}
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
                <div style={detailLabelStyle}>Cantidad</div>
                <div style={detailValueStyle}>{currentItem.cantidad}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Precio Unitario</div>
                <div style={detailValueStyle}>{formatPrice(currentItem.precio)}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Valor Total</div>
                <div style={{...detailValueStyle, fontWeight: 'bold', color: '#2E5939'}}>
                  {formatPrice(currentItem.precio * currentItem.cantidad)}
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
                <strong style={{ color: '#856404' }}>Valor a eliminar</strong>
              </div>
              <p style={{ color: '#856404', margin: 0, fontSize: '0.9rem' }}>
                Esta comodidad tiene un valor total de {formatPrice(itemToDelete.precio * itemToDelete.cantidad)}
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
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Cantidad</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Precio Unitario</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Valor Total</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
                    {comodidades.length === 0 ? "No hay comodidades registradas" : "No se encontraron resultados"}
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr key={item.idComodidades} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "15px", fontWeight: "500" }}>{item.nombreComodidades}</td>
                    <td style={{ padding: "15px", textAlign: "center" }}>{formatDate(item.fechaRegistro)}</td>
                    <td style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>{item.cantidad}</td>
                    <td style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>{formatPrice(item.precio)}</td>
                    <td style={{ padding: "15px", textAlign: "center", fontWeight: "bold", color: '#2E5939' }}>
                      {formatPrice(item.precio * item.cantidad)}
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
                          title="Editar Comodidad"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          style={btnAccion("#fbe9e7", "#e57373")}
                          title="Eliminar Comodidad"
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

export default Furniture;