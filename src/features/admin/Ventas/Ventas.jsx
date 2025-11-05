import React, { useState, useMemo, useEffect } from "react";
import { 
  FaEye, FaEdit, FaTrash, FaTimes, FaSearch, FaPlus, FaExclamationTriangle, 
  FaCheck, FaInfoCircle, FaDollarSign, FaCalendarAlt, FaCreditCard, 
  FaReceipt, FaShoppingCart, FaFilter, FaSort, FaSortUp, FaSortDown,
  FaPrint, FaFileExport, FaChartBar, FaStore, FaUser, FaClipboardList
} from "react-icons/fa";
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
  maxWidth: 800,
  color: "#2E5939",
  boxSizing: 'border-box',
  maxHeight: '90vh',
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
  metodoPago: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-&]+$/
};

const VALIDATION_RULES = {
  fechaVenta: {
    required: true,
    errorMessages: {
      required: "La fecha de venta es obligatoria."
    }
  },
  idReserva: {
    required: true,
    min: 1,
    errorMessages: {
      required: "El ID de reserva es obligatorio.",
      min: "El ID de reserva debe ser mayor a 0."
    }
  },
  metodoPago: {
    minLength: 2,
    maxLength: 50,
    required: true,
    pattern: VALIDATION_PATTERNS.metodoPago,
    errorMessages: {
      required: "El método de pago es obligatorio.",
      minLength: "El método de pago debe tener al menos 2 caracteres.",
      maxLength: "El método de pago no puede exceder los 50 caracteres.",
      pattern: "El método de pago contiene caracteres no permitidos. Solo se permiten letras, espacios, guiones y el símbolo &."
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
const API_VENTAS = "http://localhost:5272/api/Ventas";
const API_RESERVAS = "http://localhost:5272/api/Reservas";
const ITEMS_PER_PAGE = 10;

// Métodos de pago predefinidos
const METODOS_PAGO = [
  "Efectivo",
  "Tarjeta Crédito",
  "Tarjeta Débito",
  "Transferencia Bancaria",
  "PayPal",
  "Pago Móvil"
];

// ===============================================
// FUNCIONES PARA FORMATEAR FECHAS Y DATOS
// ===============================================
const formatDate = (dateString) => {
  if (!dateString) return "Fecha no disponible";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

    if (name === 'metodoPago') {
      filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-&]/g, "");
    } else if (name === 'idReserva') {
      filteredValue = value.replace(/[^0-9]/g, "");
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
      ) : type === "textarea" ? (
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
// COMPONENTE PRINCIPAL Ventas
// ===============================================
const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [ventaToDelete, setVentaToDelete] = useState(null);
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

  // Estados para filtros
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroMetodoPago, setFiltroMetodoPago] = useState("todos");
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
  const [filtroFechaFin, setFiltroFechaFin] = useState("");
  const [ordenarPor, setOrdenarPor] = useState("fecha");
  const [ordenDireccion, setOrdenDireccion] = useState("desc");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Estado inicial basado en la estructura de la API
  const [newVenta, setNewVenta] = useState({
    idVenta: 0,
    fechaVenta: new Date().toISOString().slice(0, 16), // Formato para datetime-local
    idReserva: "",
    metodoPago: "",
    estado: true
  });

  // ===============================================
  // EFECTOS
  // ===============================================
  useEffect(() => {
    fetchAllData();
  }, []);

  // Validar formulario en tiempo real solo para campos tocados
  useEffect(() => {
    if (showForm) {
      Object.keys(touchedFields).forEach(fieldName => {
        if (touchedFields[fieldName]) {
          validateField(fieldName, newVenta[fieldName]);
        }
      });
    }
  }, [newVenta, showForm, touchedFields]);

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
    else if (trimmedValue && fieldName === 'idReserva') {
      const numericValue = parseInt(trimmedValue);
      if (isNaN(numericValue)) {
        error = "El ID de reserva debe ser un número válido.";
      } else if (rules.min !== undefined && numericValue < rules.min) {
        error = rules.errorMessages.min;
      } else {
        // Verificar si la reserva existe
        const reservaExiste = reservas.find(r => r.idReserva === numericValue);
        if (!reservaExiste) {
          warning = "La reserva especificada no existe en el sistema.";
        } else {
          success = "Reserva válida.";
        }
      }
    }
    else if (fieldName === 'estado') {
      success = value ? "Venta activa" : "Venta anulada";
    }
    else if (trimmedValue && fieldName === 'fechaVenta') {
      const fecha = new Date(trimmedValue);
      const ahora = new Date();
      
      if (fecha > ahora) {
        warning = "La fecha de venta es futura. Verifique que sea correcta.";
      }
      success = "Fecha válida.";
    }
    else if (trimmedValue) {
      success = `${fieldName === 'metodoPago' ? 'Método de pago' : 'Campo'} válido.`;
    }

    setFormErrors(prev => ({ ...prev, [fieldName]: error }));
    setFormSuccess(prev => ({ ...prev, [fieldName]: success }));
    setFormWarnings(prev => ({ ...prev, [fieldName]: warning }));

    return !error;
  };

  const validateForm = () => {
    // Marcar todos los campos como tocados al enviar el formulario
    const allFieldsTouched = {
      fechaVenta: true,
      idReserva: true,
      metodoPago: true,
      estado: true
    };
    setTouchedFields(allFieldsTouched);

    const fechaValid = validateField('fechaVenta', newVenta.fechaVenta);
    const reservaValid = validateField('idReserva', newVenta.idReserva);
    const metodoPagoValid = validateField('metodoPago', newVenta.metodoPago);
    const estadoValid = validateField('estado', newVenta.estado);

    const isValid = fechaValid && reservaValid && metodoPagoValid && estadoValid;
    
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
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchVentas(),
        fetchReservas()
      ]);
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
      handleApiError(error, "cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const fetchVentas = async () => {
    try {
      const res = await axios.get(API_VENTAS, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (Array.isArray(res.data)) {
        setVentas(res.data);
      } else {
        throw new Error("Formato de datos inválido");
      }
    } catch (error) {
      console.error("❌ Error al obtener ventas:", error);
      throw error;
    }
  };

  const fetchReservas = async () => {
    try {
      const res = await axios.get(API_RESERVAS, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (Array.isArray(res.data)) {
        setReservas(res.data);
      }
    } catch (error) {
      console.error("❌ Error al obtener reservas:", error);
    }
  };

  const handleAddVenta = async (e) => {
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
      // Preparar datos según la estructura de la API
      const ventaData = {
        fechaVenta: newVenta.fechaVenta,
        idReserva: parseInt(newVenta.idReserva),
        metodoPago: newVenta.metodoPago.trim(),
        estado: newVenta.estado === "true" || newVenta.estado === true
      };

      console.log("📤 Enviando datos:", ventaData);

      if (isEditing) {
        // Para edición, incluir el idVenta
        ventaData.idVenta = newVenta.idVenta;
        await axios.put(`${API_VENTAS}/${newVenta.idVenta}`, ventaData, {
          headers: { 'Content-Type': 'application/json' }
        });
        displayAlert("Venta actualizada exitosamente.", "success");
      } else {
        await axios.post(API_VENTAS, ventaData, {
          headers: { 'Content-Type': 'application/json' }
        });
        displayAlert("Venta registrada exitosamente.", "success");
      }
      
      await fetchAllData();
      closeForm();
    } catch (error) {
      console.error("❌ Error al guardar venta:", error);
      handleApiError(error, isEditing ? "actualizar la venta" : "registrar la venta");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (ventaToDelete) {
      setLoading(true);
      try {
        await axios.delete(`${API_VENTAS}/${ventaToDelete.idVenta}`);
        displayAlert("Venta eliminada exitosamente.", "success");
        await fetchVentas();
        
        if (paginatedVentas.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("❌ Error al eliminar venta:", error);
        handleApiError(error, "eliminar la venta");
      } finally {
        setLoading(false);
        setVentaToDelete(null);
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
      errorMessage = "No se puede conectar al servidor en http://localhost:5272";
    } else if (error.response) {
      if (error.response.status === 400) {
        errorMessage = `Error de validación: ${error.response.data?.title || error.response.data?.message || 'Datos inválidos'}`;
      } else if (error.response.status === 404) {
        errorMessage = "Recurso no encontrado.";
      } else if (error.response.status === 409) {
        errorMessage = "Conflicto: La venta no puede ser procesada.";
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

  // Función para obtener información de la reserva
  const getReservaInfo = (idReserva) => {
    const reserva = reservas.find(r => r.idReserva === idReserva);
    if (!reserva) {
      return {
        existe: false,
        info: "Reserva no encontrada"
      };
    }
    
    return {
      existe: true,
      info: `Reserva #${reserva.idReserva}`,
      fechaReserva: reserva.fechaReserva,
      estado: reserva.estado ? 'Activa' : 'Cancelada'
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVenta((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Nueva función para manejar el blur (cuando el campo pierde el foco)
  const handleInputBlur = (e) => {
    const { name } = e.target;
    markFieldAsTouched(name);
    validateField(name, newVenta[name]);
  };

  const toggleEstado = async (venta) => {
    setLoading(true);
    try {
      const updatedVenta = { 
        ...venta, 
        estado: !venta.estado 
      };
      await axios.put(`${API_VENTAS}/${venta.idVenta}`, updatedVenta, {
        headers: { 'Content-Type': 'application/json' }
      });
      displayAlert(`Venta ${updatedVenta.estado ? 'activada' : 'anulada'} exitosamente.`, "success");
      await fetchVentas();
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
    setNewVenta({
      idVenta: 0,
      fechaVenta: new Date().toISOString().slice(0, 16),
      idReserva: "",
      metodoPago: "",
      estado: true
    });
  };

  const closeDetailsModal = () => {
    setShowDetails(false);
    setSelectedVenta(null);
  };

  const cancelDelete = () => {
    setVentaToDelete(null);
    setShowDeleteConfirm(false);
  };

  const handleView = (venta) => {
    setSelectedVenta(venta);
    setShowDetails(true);
  };

  const handleEdit = (venta) => {
    setNewVenta({
      ...venta,
      fechaVenta: venta.fechaVenta ? venta.fechaVenta.slice(0, 16) : new Date().toISOString().slice(0, 16),
      idReserva: venta.idReserva.toString(),
      metodoPago: venta.metodoPago || "",
      estado: venta.estado ? "true" : "false"
    });

    setIsEditing(true);
    setShowForm(true);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
    setTouchedFields({});
  };

  const handleDeleteClick = (venta) => {
    setVentaToDelete(venta);
    setShowDeleteConfirm(true);
  };

  // ===============================================
  // FUNCIONES DE FILTRADO Y ORDENAMIENTO MEJORADAS
  // ===============================================
  const filteredVentas = useMemo(() => {
    let filtered = ventas.filter(venta =>
      venta.idVenta.toString().includes(searchTerm.toLowerCase()) ||
      venta.idReserva.toString().includes(searchTerm.toLowerCase()) ||
      venta.metodoPago?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Aplicar filtro por estado
    if (filtroEstado !== "todos") {
      const estadoFiltro = filtroEstado === "activas";
      filtered = filtered.filter(venta => venta.estado === estadoFiltro);
    }

    // Aplicar filtro por método de pago
    if (filtroMetodoPago !== "todos") {
      filtered = filtered.filter(venta => venta.metodoPago === filtroMetodoPago);
    }

    // Aplicar filtro por fecha de inicio
    if (filtroFechaInicio) {
      const fechaInicio = new Date(filtroFechaInicio);
      filtered = filtered.filter(venta => {
        const fechaVenta = new Date(venta.fechaVenta);
        return fechaVenta >= fechaInicio;
      });
    }

    // Aplicar filtro por fecha de fin
    if (filtroFechaFin) {
      const fechaFin = new Date(filtroFechaFin);
      fechaFin.setHours(23, 59, 59, 999); // Incluir todo el día
      filtered = filtered.filter(venta => {
        const fechaVenta = new Date(venta.fechaVenta);
        return fechaVenta <= fechaFin;
      });
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (ordenarPor) {
        case "id":
          aValue = a.idVenta;
          bValue = b.idVenta;
          break;
        case "fecha":
          aValue = new Date(a.fechaVenta);
          bValue = new Date(b.fechaVenta);
          break;
        case "reserva":
          aValue = a.idReserva;
          bValue = b.idReserva;
          break;
        case "metodo":
          aValue = a.metodoPago.toLowerCase();
          bValue = b.metodoPago.toLowerCase();
          break;
        case "estado":
          aValue = a.estado;
          bValue = b.estado;
          break;
        default:
          aValue = new Date(a.fechaVenta);
          bValue = new Date(b.fechaVenta);
      }

      if (ordenDireccion === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [ventas, searchTerm, filtroEstado, filtroMetodoPago, filtroFechaInicio, filtroFechaFin, ordenarPor, ordenDireccion]);

  const totalPages = Math.ceil(filteredVentas.length / ITEMS_PER_PAGE);

  const paginatedVentas = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredVentas.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredVentas, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Función para cambiar ordenamiento
  const handleSort = (campo) => {
    if (ordenarPor === campo) {
      setOrdenDireccion(ordenDireccion === "asc" ? "desc" : "asc");
    } else {
      setOrdenarPor(campo);
      setOrdenDireccion("asc");
    }
  };

  // Función para obtener ícono de ordenamiento
  const getSortIcon = (campo) => {
    if (ordenarPor !== campo) return <FaSort />;
    return ordenDireccion === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setFiltroEstado("todos");
    setFiltroMetodoPago("todos");
    setFiltroFechaInicio("");
    setFiltroFechaFin("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Función para obtener estadísticas
  const getEstadisticas = () => {
    const totalVentas = ventas.length;
    const ventasActivas = ventas.filter(v => v.estado).length;
    const ventasAnuladas = ventas.filter(v => !v.estado).length;
    
    // Métodos de pago más utilizados
    const metodosPagoCount = {};
    ventas.forEach(venta => {
      if (venta.metodoPago) {
        metodosPagoCount[venta.metodoPago] = (metodosPagoCount[venta.metodoPago] || 0) + 1;
      }
    });
    
    const metodoMasUtilizado = Object.keys(metodosPagoCount).length > 0 
      ? Object.keys(metodosPagoCount).reduce((a, b) => metodosPagoCount[a] > metodosPagoCount[b] ? a : b)
      : "N/A";

    return {
      totalVentas,
      ventasActivas,
      ventasAnuladas,
      metodoMasUtilizado
    };
  };

  // ===============================================
  // COMPONENTES PARA DETALLES
  // ===============================================
  const DetallesVenta = ({ venta }) => {
    const reservaInfo = getReservaInfo(venta.idReserva);
    
    return (
      <div>
        <div style={detailItemStyle}>
          <div style={detailLabelStyle}>ID Venta</div>
          <div style={detailValueStyle}>#{venta.idVenta}</div>
        </div>
        
        <div style={detailItemStyle}>
          <div style={detailLabelStyle}>Fecha de Venta</div>
          <div style={detailValueStyle}>{formatDate(venta.fechaVenta)}</div>
        </div>

        <div style={detailItemStyle}>
          <div style={detailLabelStyle}>Reserva Asociada</div>
          <div style={detailValueStyle}>
            <div style={{ 
              backgroundColor: reservaInfo.existe ? '#E8F5E8' : '#fff3cd',
              padding: '10px',
              borderRadius: '8px',
              border: `1px solid ${reservaInfo.existe ? '#679750' : '#ffeaa7'}`
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                {reservaInfo.info}
              </div>
              {reservaInfo.existe && (
                <div style={{ fontSize: '14px', color: '#679750' }}>
                  Fecha reserva: {formatDate(reservaInfo.fechaReserva)}<br />
                  Estado: {reservaInfo.estado}
                </div>
              )}
              {!reservaInfo.existe && (
                <div style={{ fontSize: '14px', color: '#856404' }}>
                  ⚠️ Esta reserva no existe en el sistema
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={detailItemStyle}>
          <div style={detailLabelStyle}>Método de Pago</div>
          <div style={detailValueStyle}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              backgroundColor: '#F7F4EA',
              padding: '10px',
              borderRadius: '8px'
            }}>
              <FaCreditCard color="#2E5939" />
              <span style={{ fontWeight: 'bold' }}>{venta.metodoPago}</span>
            </div>
          </div>
        </div>

        <div style={detailItemStyle}>
          <div style={detailLabelStyle}>Estado</div>
          <div style={{
            ...detailValueStyle,
            color: venta.estado ? '#4caf50' : '#e57373',
            fontWeight: 'bold'
          }}>
            {venta.estado ? '🟢 Activa' : '🔴 Anulada'}
          </div>
        </div>

        {/* Información adicional */}
        <div style={detailItemStyle}>
          <div style={detailLabelStyle}>Información Adicional</div>
          <div style={{
            backgroundColor: '#F7F4EA',
            padding: '15px',
            borderRadius: '8px',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            <div style={{ marginBottom: '8px' }}>
              <strong>ID de la venta:</strong> {venta.idVenta}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>ID de la reserva:</strong> {venta.idReserva}
            </div>
            <div>
              <strong>Fecha de registro:</strong> {formatDate(venta.fechaVenta)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ===============================================
  // COMPONENTE DE FILTROS
  // ===============================================
  const FiltrosSection = () => (
    <div style={{
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '20px',
      border: '1px solid #E8F5E8'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h3 style={{ margin: 0, color: '#2E5939', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaFilter />
          Filtros y Ordenamiento
        </h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={limpiarFiltros}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Limpiar Filtros
          </button>
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            style={{
              backgroundColor: '#2E5939',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            {mostrarFiltros ? 'Ocultar' : 'Mostrar'} Filtros
          </button>
        </div>
      </div>

      {mostrarFiltros && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          padding: '15px',
          backgroundColor: '#F7F4EA',
          borderRadius: '8px'
        }}>
          {/* Filtro por estado */}
          <div>
            <label style={{ ...labelStyle, fontSize: '14px' }}>Estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              style={inputStyle}
            >
              <option value="todos">Todos los estados</option>
              <option value="activas">Solo activas</option>
              <option value="anuladas">Solo anuladas</option>
            </select>
          </div>

          {/* Filtro por método de pago */}
          <div>
            <label style={{ ...labelStyle, fontSize: '14px' }}>Método de Pago</label>
            <select
              value={filtroMetodoPago}
              onChange={(e) => setFiltroMetodoPago(e.target.value)}
              style={inputStyle}
            >
              <option value="todos">Todos los métodos</option>
              {METODOS_PAGO.map(metodo => (
                <option key={metodo} value={metodo}>{metodo}</option>
              ))}
            </select>
          </div>

          {/* Filtro por fecha de inicio */}
          <div>
            <label style={{ ...labelStyle, fontSize: '14px' }}>Fecha Inicio</label>
            <input
              type="date"
              value={filtroFechaInicio}
              onChange={(e) => setFiltroFechaInicio(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Filtro por fecha de fin */}
          <div>
            <label style={{ ...labelStyle, fontSize: '14px' }}>Fecha Fin</label>
            <input
              type="date"
              value={filtroFechaFin}
              onChange={(e) => setFiltroFechaFin(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Ordenamiento */}
          <div>
            <label style={{ ...labelStyle, fontSize: '14px' }}>Ordenar por</label>
            <select
              value={ordenarPor}
              onChange={(e) => setOrdenarPor(e.target.value)}
              style={inputStyle}
            >
              <option value="fecha">Fecha</option>
              <option value="id">ID Venta</option>
              <option value="reserva">ID Reserva</option>
              <option value="metodo">Método Pago</option>
              <option value="estado">Estado</option>
            </select>
          </div>

          {/* Dirección del ordenamiento */}
          <div>
            <label style={{ ...labelStyle, fontSize: '14px' }}>Dirección</label>
            <select
              value={ordenDireccion}
              onChange={(e) => setOrdenDireccion(e.target.value)}
              style={inputStyle}
            >
              <option value="desc">Más reciente primero</option>
              <option value="asc">Más antiguo primero</option>
            </select>
          </div>
        </div>
      )}

      {/* Resumen de filtros aplicados */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginTop: '15px',
        alignItems: 'center'
      }}>
        <span style={{ fontWeight: 'bold', color: '#2E5939' }}>Filtros activos:</span>
        
        {filtroEstado !== "todos" && (
          <span style={{
            backgroundColor: '#E8F5E8',
            color: '#2E5939',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            border: '1px solid #679750'
          }}>
            Estado: {filtroEstado === "activas" ? "Activas" : "Anuladas"}
          </span>
        )}
        
        {filtroMetodoPago !== "todos" && (
          <span style={{
            backgroundColor: '#E8F5E8',
            color: '#2E5939',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            border: '1px solid #679750'
          }}>
            Método: {filtroMetodoPago}
          </span>
        )}
        
        {filtroFechaInicio && (
          <span style={{
            backgroundColor: '#E8F5E8',
            color: '#2E5939',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            border: '1px solid #679750'
          }}>
            Desde: {new Date(filtroFechaInicio).toLocaleDateString('es-ES')}
          </span>
        )}
        
        {filtroFechaFin && (
          <span style={{
            backgroundColor: '#E8F5E8',
            color: '#2E5939',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            border: '1px solid #679750'
          }}>
            Hasta: {new Date(filtroFechaFin).toLocaleDateString('es-ES')}
          </span>
        )}

        {filtroEstado === "todos" && filtroMetodoPago === "todos" && !filtroFechaInicio && !filtroFechaFin && (
          <span style={{ color: '#679750', fontStyle: 'italic' }}>
            No hay filtros activos
          </span>
        )}
      </div>
    </div>
  );

  // ===============================================
  // RENDERIZADO
  // ===============================================
  const estadisticas = getEstadisticas();

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
              onClick={fetchAllData}
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
          <h2 style={{ margin: 0, color: "#2E5939" }}>Gestión de Ventas</h2>
          <p style={{ margin: "5px 0 0 0", color: "#679750", fontSize: "14px" }}>
            {ventas.length} ventas registradas • {estadisticas.ventasActivas} activas
            {filteredVentas.length !== ventas.length && ` • ${filteredVentas.length} filtradas`}
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
            setNewVenta({
              idVenta: 0,
              fechaVenta: new Date().toISOString().slice(0, 16),
              idReserva: "",
              metodoPago: "",
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
          <FaPlus /> Nueva Venta
        </button>
      </div>

      {/* Tarjetas de Estadísticas */}
      {!loading && ventas.length > 0 && (
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
              {estadisticas.totalVentas}
            </div>
            <div style={{ fontSize: '14px', color: '#679750' }}>
              Total Ventas
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
              {estadisticas.ventasActivas}
            </div>
            <div style={{ fontSize: '14px', color: '#679750' }}>
              Ventas Activas
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
              {estadisticas.ventasAnuladas}
            </div>
            <div style={{ fontSize: '14px', color: '#ff9800' }}>
              Ventas Anuladas
            </div>
          </div>

          <div style={{
            backgroundColor: '#E8F5E8',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center',
            border: '1px solid #679750'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2E5939', marginBottom: '5px' }}>
              {estadisticas.metodoMasUtilizado}
            </div>
            <div style={{ fontSize: '14px', color: '#679750' }}>
              Método Más Usado
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
              {reservas.length}
            </div>
            <div style={{ fontSize: '14px', color: '#679750' }}>
              Reservas Disponibles
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
            placeholder="Buscar por ID venta, ID reserva o método de pago..."
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

      {/* Sección de Filtros */}
      <FiltrosSection />

      {/* Formulario de agregar/editar */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939", textAlign: 'center' }}>
                {isEditing ? "Editar Venta" : "Registrar Nueva Venta"}
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
            
            <form onSubmit={handleAddVenta}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px 20px', marginBottom: '20px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <FormField
                    label={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaCalendarAlt />
                        Fecha de Venta
                      </div>
                    }
                    name="fechaVenta"
                    type="datetime-local"
                    value={newVenta.fechaVenta}
                    onChange={handleChange}
                    onBlur={handleInputBlur}
                    error={formErrors.fechaVenta}
                    success={formSuccess.fechaVenta}
                    warning={formWarnings.fechaVenta}
                    required={true}
                    disabled={loading}
                    touched={touchedFields.fechaVenta}
                  />
                </div>

                <div>
                  <FormField
                    label={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaClipboardList />
                        ID Reserva
                      </div>
                    }
                    name="idReserva"
                    type="number"
                    value={newVenta.idReserva}
                    onChange={handleChange}
                    onBlur={handleInputBlur}
                    error={formErrors.idReserva}
                    success={formSuccess.idReserva}
                    warning={formWarnings.idReserva}
                    required={true}
                    disabled={loading}
                    min="1"
                    placeholder="123"
                    touched={touchedFields.idReserva}
                    icon={<FaClipboardList />}
                  />
                </div>

                <div>
                  <FormField
                    label="Estado"
                    name="estado"
                    type="select"
                    value={newVenta.estado}
                    onChange={handleChange}
                    onBlur={handleInputBlur}
                    error={formErrors.estado}
                    success={formSuccess.estado}
                    warning={formWarnings.estado}
                    required={true}
                    disabled={loading}
                    options={[
                      { value: "true", label: "Activa" },
                      { value: "false", label: "Anulada" }
                    ]}
                    touched={touchedFields.estado}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <FormField
                    label={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaCreditCard />
                        Método de Pago
                      </div>
                    }
                    name="metodoPago"
                    type="select"
                    value={newVenta.metodoPago}
                    onChange={handleChange}
                    onBlur={handleInputBlur}
                    error={formErrors.metodoPago}
                    success={formSuccess.metodoPago}
                    warning={formWarnings.metodoPago}
                    required={true}
                    disabled={loading}
                    options={METODOS_PAGO.map(metodo => ({
                      value: metodo,
                      label: metodo
                    }))}
                    placeholder="Seleccionar método de pago"
                    touched={touchedFields.metodoPago}
                  />
                </div>
              </div>

              {/* Información de ayuda */}
              <div style={{
                backgroundColor: '#F7F4EA',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid #E8F5E8'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <FaInfoCircle color="#2E5939" />
                  <strong style={{ color: '#2E5939' }}>Información importante</strong>
                </div>
                <ul style={{ color: '#2E5939', margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: '1.5' }}>
                  <li>Verifique que el ID de reserva exista en el sistema</li>
                  <li>La fecha de venta no puede ser futura</li>
                  <li>Una venta anulada no se puede reactivar automáticamente</li>
                </ul>
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
                  {loading ? "Guardando..." : (isEditing ? "Actualizar Venta" : "Registrar Venta")}
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
      {showDetails && selectedVenta && (
        <div style={modalOverlayStyle}>
          <div style={detailsModalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939", textAlign: 'center' }}>Detalles de la Venta</h2>
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
            
            <DetallesVenta venta={selectedVenta} />

            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 20 }}>
              <button
                onClick={() => {
                  closeDetailsModal();
                  handleEdit(selectedVenta);
                }}
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
                <FaEdit />
                Editar Venta
              </button>
              <button
                onClick={closeDetailsModal}
                style={{
                  backgroundColor: "#6c757d",
                  color: "#fff",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontWeight: "600",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteConfirm && ventaToDelete && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 450, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 20, color: "#2E5939" }}>Confirmar Eliminación</h3>
            <p style={{ marginBottom: 30, fontSize: '1.1rem', color: "#2E5939" }}>
              ¿Estás seguro de eliminar la venta "<strong>#{ventaToDelete.idVenta}</strong>"?
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
                <strong style={{ color: '#856404' }}>Venta a eliminar</strong>
              </div>
              <p style={{ color: '#856404', margin: 0, fontSize: '0.9rem' }}>
                Fecha: {formatDate(ventaToDelete.fechaVenta)}<br />
                Reserva: #{ventaToDelete.idReserva}<br />
                Método: {ventaToDelete.metodoPago}<br />
                Estado: {ventaToDelete.estado ? 'Activa' : 'Anulada'}
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
              🔄 Cargando ventas...
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
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold", cursor: 'pointer' }} onClick={() => handleSort('id')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    ID Venta
                    {getSortIcon('id')}
                  </div>
                </th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold", cursor: 'pointer' }} onClick={() => handleSort('fecha')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Fecha
                    {getSortIcon('fecha')}
                  </div>
                </th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold", cursor: 'pointer' }} onClick={() => handleSort('reserva')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                    ID Reserva
                    {getSortIcon('reserva')}
                  </div>
                </th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold", cursor: 'pointer' }} onClick={() => handleSort('metodo')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                    Método Pago
                    {getSortIcon('metodo')}
                  </div>
                </th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold", cursor: 'pointer' }} onClick={() => handleSort('estado')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                    Estado
                    {getSortIcon('estado')}
                  </div>
                </th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVentas.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <FaInfoCircle size={30} color="#679750" />
                      {ventas.length === 0 ? "No hay ventas registradas" : "No se encontraron resultados con los filtros aplicados"}
                      {ventas.length === 0 && (
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
                          Registrar Primera Venta
                        </button>
                      )}
                      {ventas.length > 0 && (
                        <button
                          onClick={limpiarFiltros}
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
                paginatedVentas.map((venta) => (
                  <tr key={venta.idVenta} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "15px", fontWeight: "600" }}>
                      #{venta.idVenta}
                    </td>
                    <td style={{ padding: "15px" }}>
                      {formatDate(venta.fechaVenta)}
                    </td>
                    <td style={{ padding: "15px", textAlign: "center", fontWeight: "500" }}>
                      #{venta.idReserva}
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        justifyContent: 'center'
                      }}>
                        <FaCreditCard color="#2E5939" />
                        {venta.metodoPago}
                      </div>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <button
                        onClick={() => toggleEstado(venta)}
                        disabled={loading}
                        style={{
                          cursor: loading ? "not-allowed" : "pointer",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          border: "none",
                          backgroundColor: venta.estado ? "#4caf50" : "#e57373",
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
                        {venta.estado ? "Activa" : "Anulada"}
                      </button>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                        <button
                          onClick={() => handleView(venta)}
                          style={btnAccion("#F7F4EA", "#2E5939")}
                          title="Ver Detalles"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(venta)}
                          style={btnAccion("#F7F4EA", "#2E5939")}
                          title="Editar Venta"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteClick(venta); }}
                          style={btnAccion("#fbe9e7", "#e57373")}
                          title="Eliminar Venta"
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
            Página {currentPage} de {totalPages} • {filteredVentas.length} ventas
          </div>
        </div>
      )}
    </div>
  );
};

export default Ventas;