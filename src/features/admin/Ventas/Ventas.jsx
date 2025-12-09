// src/components/Ventas.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  FaEye, FaEdit, FaTrash, FaTimes, FaSearch, FaPlus, FaExclamationTriangle,
  FaCheck, FaInfoCircle, FaDollarSign, FaCalendarAlt, FaCreditCard,
  FaReceipt, FaShoppingCart, FaFilter, FaSort, FaSortUp, FaSortDown,
  FaPrint, FaFileExport, FaChartBar, FaStore, FaUser, FaClipboardList,
  FaBox, FaConciergeBell, FaSlidersH, FaTrashAlt, FaPlusCircle
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
  maxWidth: 900,
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
  maxWidth: 900,
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
const API_PRODUCTOS = "http://localhost:5272/api/Productos";
const API_SERVICIOS = "http://localhost:5272/api/Servicios";
const API_DETALLE_VENTA = "http://localhost:5272/api/DetalleVenta";
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
    return date.toLocaleString('es-ES', {
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
  }).format(Number(price) || 0);
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
// FUNCIÓN PARA OBTENER ESTADÍSTICAS - AÑADIDA
// ===============================================
const getEstadisticas = (ventas, detallesVenta) => {
  if (!ventas || ventas.length === 0) {
    return {
      totalVentas: 0,
      ventasActivas: 0,
      ventasAnuladas: 0,
      ingresosTotales: 0,
      metodoMasUtilizado: "No disponible"
    };
  }

  // Contar ventas activas y anuladas
  const ventasActivas = ventas.filter(v => v.estado === true || v.estado === "true").length;
  const ventasAnuladas = ventas.length - ventasActivas;

  // Calcular ingresos totales (sumar todos los detalles de venta)
  let ingresosTotales = 0;
  if (detallesVenta && detallesVenta.length > 0) {
    ingresosTotales = detallesVenta.reduce((total, detalle) => {
      return total + (Number(detalle.valorTotal) || 0);
    }, 0);
  }

  // Método de pago más utilizado
  const metodoPagoCount = {};
  ventas.forEach(venta => {
    const metodo = venta.metodoPago || "Desconocido";
    metodoPagoCount[metodo] = (metodoPagoCount[metodo] || 0) + 1;
  });

  let metodoMasUtilizado = "No disponible";
  let maxCount = 0;
  Object.entries(metodoPagoCount).forEach(([metodo, count]) => {
    if (count > maxCount) {
      maxCount = count;
      metodoMasUtilizado = metodo;
    }
  });

  return {
    totalVentas: ventas.length,
    ventasActivas,
    ventasAnuladas,
    ingresosTotales,
    metodoMasUtilizado
  };
};

// ===============================================
// COMPONENTE PRINCIPAL Ventas
// ===============================================
const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [detallesVenta, setDetallesVenta] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [servicios, setServicios] = useState([]);
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

  // Estados para filtros - MEJORADO COMO EN TIPO CABAÑA
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    estado: "all",
    metodoPago: "all",
    fechaDesde: "",
    fechaHasta: ""
  });

  const [ordenarPor, setOrdenarPor] = useState("fecha");
  const [ordenDireccion, setOrdenDireccion] = useState("desc");

  // Estado inicial basado en la estructura de la API
  const [newVenta, setNewVenta] = useState({
    idVenta: 0,
    fechaVenta: new Date().toISOString().slice(0, 16), // Formato para datetime-local
    idReserva: "",
    metodoPago: METODOS_PAGO[0],
    estado: true
  });

  // detalles temporales en el formulario (productos/servicios agregados)
  const [detallesTemp, setDetallesTemp] = useState([]);
  const [selectedItemType, setSelectedItemType] = useState("producto"); // 'producto' o 'servicio'
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // ===============================================
  // FUNCIONES DE FILTRADO, ORDENAMIENTO Y PAGINACIÓN
  // ===============================================

  // Función para manejar el ordenamiento
  const handleSort = (field) => {
    if (ordenarPor === field) {
      setOrdenDireccion(ordenDireccion === "asc" ? "desc" : "asc");
    } else {
      setOrdenarPor(field);
      setOrdenDireccion("desc");
    }
  };

  // Función para obtener el ícono de ordenamiento
  const getSortIcon = (field) => {
    if (ordenarPor !== field) return <FaSort />;
    return ordenDireccion === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  // Función para navegar a una página específica
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  // Filtrado y ordenamiento de ventas
  const filteredVentas = useMemo(() => {
    let filtered = [...ventas];

    // Aplicar filtro de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(venta =>
        String(venta.idVenta).toLowerCase().includes(term) ||
        String(venta.idReserva).toLowerCase().includes(term) ||
        String(venta.metodoPago).toLowerCase().includes(term)
      );
    }

    // Aplicar filtros avanzados
    if (filters.estado !== "all") {
      const estadoFiltro = filters.estado === "activo";
      filtered = filtered.filter(venta =>
        venta.estado === estadoFiltro || venta.estado === String(estadoFiltro)
      );
    }

    if (filters.metodoPago !== "all") {
      filtered = filtered.filter(venta =>
        venta.metodoPago === filters.metodoPago
      );
    }

    if (filters.fechaDesde) {
      const fechaDesde = new Date(filters.fechaDesde);
      filtered = filtered.filter(venta => {
        const fechaVenta = new Date(venta.fechaVenta);
        return fechaVenta >= fechaDesde;
      });
    }

    if (filters.fechaHasta) {
      const fechaHasta = new Date(filters.fechaHasta);
      fechaHasta.setHours(23, 59, 59, 999);
      filtered = filtered.filter(venta => {
        const fechaVenta = new Date(venta.fechaVenta);
        return fechaVenta <= fechaHasta;
      });
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (ordenarPor) {
        case "id":
          aValue = Number(a.idVenta);
          bValue = Number(b.idVenta);
          break;
        case "fecha":
          aValue = new Date(a.fechaVenta);
          bValue = new Date(b.fechaVenta);
          break;
        case "reserva":
          aValue = Number(a.idReserva);
          bValue = Number(b.idReserva);
          break;
        case "metodo":
          aValue = a.metodoPago?.toLowerCase() || "";
          bValue = b.metodoPago?.toLowerCase() || "";
          break;
        case "estado":
          aValue = a.estado ? 1 : 0;
          bValue = b.estado ? 1 : 0;
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
  }, [ventas, searchTerm, filters, ordenarPor, ordenDireccion]);

  // Paginación
  const totalPages = useMemo(() => {
    return Math.ceil(filteredVentas.length / ITEMS_PER_PAGE);
  }, [filteredVentas]);

  const paginatedVentas = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredVentas.slice(startIndex, endIndex);
  }, [filteredVentas, currentPage]);

  // Obtener estadísticas
  const estadisticas = useMemo(() => {
    return getEstadisticas(ventas, detallesVenta);
  }, [ventas, detallesVenta]);

  // ===============================================
  // EFECTOS
  // ===============================================
  useEffect(() => {
    fetchAllData();
  }, []);

  // Establecer metodoPago por defecto si cambia METODOS_PAGO (por si luego usas API)
  useEffect(() => {
    if (!newVenta.metodoPago && METODOS_PAGO.length > 0) {
      setNewVenta(prev => ({ ...prev, metodoPago: METODOS_PAGO[0] }));
    }
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

  // recalcular totales cuando cambian detalles o reserva/venta
  const totalDetallesTemp = useMemo(() => {
    return detallesTemp.reduce((s, d) => s + (Number(d.valorTotal || 0) || 0), 0);
  }, [detallesTemp]);

  const reservaMonto = useMemo(() => {
    const r = reservas.find(x => Number(x.idReserva) === Number(newVenta.idReserva));
    return r ? (Number(r.montoTotal) || 0) : 0;
  }, [newVenta.idReserva, reservas]);

  const totalVentaCalculado = useMemo(() => {
    return Number(reservaMonto || 0) + Number(totalDetallesTemp || 0);
  }, [reservaMonto, totalDetallesTemp]);

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
        const reservaExiste = reservas.find(r => Number(r.idReserva) === numericValue);
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
  // FUNCIONES DE FILTRADO MEJORADAS - IGUAL QUE EN TIPO CABAÑA
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
      metodoPago: "all",
      fechaDesde: "",
      fechaHasta: ""
    });
    setCurrentPage(1);
  };

  // Contador de filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.estado !== "all") count++;
    if (filters.metodoPago !== "all") count++;
    if (filters.fechaDesde) count++;
    if (filters.fechaHasta) count++;
    return count;
  }, [filters]);

  // ===============================================
  // FUNCIONES DE LA API
  // ===============================================
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchVentas(),
        fetchDetallesVenta(),
        fetchReservas(),
        fetchProductos(),
        fetchServicios()
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

  const fetchDetallesVenta = async () => {
    try {
      const res = await axios.get(API_DETALLE_VENTA, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
     
      if (Array.isArray(res.data)) {
        setDetallesVenta(res.data);
      }
    } catch (error) {
      console.error("❌ Error al obtener detalles de venta:", error);
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

  const fetchProductos = async () => {
    try {
      const res = await axios.get(API_PRODUCTOS, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
     
      if (Array.isArray(res.data)) {
        setProductos(res.data);
      } else {
        // si la API devuelve objeto con $values
        setProductos(Array.isArray(res.data?.$values) ? res.data.$values : []);
      }
    } catch (error) {
      console.error("❌ Error al obtener productos:", error);
    }
  };

  const fetchServicios = async () => {
    try {
      const res = await axios.get(API_SERVICIOS, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
     
      if (Array.isArray(res.data)) {
        setServicios(res.data);
      } else {
        setServicios(Array.isArray(res.data?.$values) ? res.data.$values : []);
      }
    } catch (error) {
      console.error("❌ Error al obtener servicios:", error);
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
    const reserva = reservas.find(r => Number(r.idReserva) === Number(idReserva));
    if (!reserva) {
      return {
        existe: false,
        info: "Reserva no encontrada"
      };
    }
   
    return {
      existe: true,
      info: `Reserva #${reserva.idReserva}`,
      fechaReserva: reserva.fechaReserva || reserva.fechaSalida || reserva.fechaFin || null,
      estado: (reserva.idEstado ? (Number(reserva.idEstado) === 3 ? 'Cancelada' : 'Activa') : (reserva.estado ? 'Activa' : 'Cancelada')),
      montoTotal: Number(reserva.montoTotal) || 0
    };
  };

  // Función para obtener detalles de una venta
  const getDetallesVenta = (idVenta) => {
    return detallesVenta.filter(detalle => Number(detalle.idVenta) === Number(idVenta));
  };

  // Función para obtener información de producto/servicio (CORREGIDA)
  const getItemInfo = (idProducto, idServicio) => {
    const pid = Number(idProducto || 0);
    const sid = Number(idServicio || 0);

    if (pid > 0) {
      const producto = productos.find(p => Number(p.idProducto) === pid);
      return {
        tipo: 'producto',
        nombre: producto?.nombreProducto || producto?.nombre || 'Producto no encontrado',
        precio: Number(producto?.precio) || Number(producto?.valorUnitario) || 0,
        referencia: producto
      };
    } else if (sid > 0) {
      const servicio = servicios.find(s => Number(s.idServicio) === sid);
      return {
        tipo: 'servicio',
        nombre: servicio?.nombreServicio || servicio?.nombre || 'Servicio no encontrado',
        precio: Number(servicio?.precio) || Number(servicio?.valorUnitario) || 0,
        referencia: servicio
      };
    }
    return { tipo: 'desconocido', nombre: 'Item no especificado', precio: 0, referencia: null };
  };

  // Calcular total de una venta (desde detalles guardados)
  const calcularTotalVenta = (idVenta) => {
    const detalles = getDetallesVenta(idVenta);
    return detalles.reduce((total, detalle) => total + (Number(detalle.valorTotal || detalle.valorUnitario * detalle.cantidad) || 0), 0);
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
      metodoPago: METODOS_PAGO[0],
      estado: true
    });
    setDetallesTemp([]);
    setSelectedItemId("");
    setSelectedItemType("producto");
    setSelectedQuantity(1);
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

  // cuando se edita, cargar detallesTemp desde detallesVenta
  const handleEdit = (venta) => {
    setNewVenta({
      ...venta,
      fechaVenta: venta.fechaVenta ? venta.fechaVenta.slice(0, 16) : new Date().toISOString().slice(0, 16),
      idReserva: venta.idReserva ? String(venta.idReserva) : "",
      metodoPago: venta.metodoPago || METODOS_PAGO[0],
      estado: venta.estado ? true : false
    });

    // cargar detalles asociados al abrir el modal
    const detalles = getDetallesVenta(venta.idVenta).map(d => ({
      ...d,
      cantidad: Number(d.cantidad) || 1,
      valorUnitario: Number(d.valorUnitario) || 0,
      valorTotal: Number(d.valorTotal) || (Number(d.valorUnitario || 0) * Number(d.cantidad || 1))
    }));

    setDetallesTemp(detalles);
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

  // Añadir detalle temporal (producto/servicio) en el formulario
  const addDetalleTemp = () => {
    const qty = Number(selectedQuantity) || 1;
    if (!selectedItemId) {
      displayAlert("Selecciona un producto o servicio para agregar.", "warning");
      return;
    }
    const pid = selectedItemType === "producto" ? Number(selectedItemId) : 0;
    const sid = selectedItemType === "servicio" ? Number(selectedItemId) : 0;

    const info = getItemInfo(pid, sid);
    const unit = Number(info.precio || 0);
    const total = unit * qty;

    const newDetalle = {
      idDetalleVenta: 0, // 0 indica nuevo hasta que backend asigne id
      idVenta: newVenta.idVenta || 0,
      idProducto: pid,
      idServicio: sid,
      cantidad: qty,
      valorUnitario: unit,
      valorTotal: total
    };

    setDetallesTemp(prev => [...prev, newDetalle]);
    setSelectedItemId("");
    setSelectedQuantity(1);
  };

  const removeDetalleTemp = (index) => {
    setDetallesTemp(prev => prev.filter((_, i) => i !== index));
  };

  const updateDetalleCantidad = (index, qty) => {
    setDetallesTemp(prev => prev.map((d, i) => {
      if (i !== index) return d;
      const nuevaCantidad = Number(qty) || 1;
      return {
        ...d,
        cantidad: nuevaCantidad,
        valorTotal: Number(d.valorUnitario || 0) * nuevaCantidad
      };
    }));
  };

  // Guarda venta y detalles (POST/PUT según corresponda) - CORREGIDA
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
        metodoPago: (newVenta.metodoPago || "").toString().trim(),
        estado: newVenta.estado === "true" || newVenta.estado === true
      };

      console.log("📤 Enviando datos de venta:", ventaData);

      let ventaId = newVenta.idVenta || 0;
      let res;

      if (isEditing) {
        // Para edición, incluir el idVenta
        ventaData.idVenta = newVenta.idVenta;
        await axios.put(`${API_VENTAS}/${newVenta.idVenta}`, ventaData, {
          headers: { 'Content-Type': 'application/json' }
        });
        ventaId = newVenta.idVenta;
        displayAlert("Venta actualizada exitosamente.", "success");
      } else {
        res = await axios.post(API_VENTAS, ventaData, {
          headers: { 'Content-Type': 'application/json' }
        });
        // obtener idVenta de la respuesta
        ventaId = res.data?.idVenta || res.data?.id || res.data;
        console.log("✅ Venta creada con ID:", ventaId);
        displayAlert("Venta registrada exitosamente.", "success");
      }

      // Guardar/actualizar detalles - MEJORADO Y CON VALIDACIONES
      if (detallesTemp.length > 0) {
        console.log(`📤 Guardando ${detallesTemp.length} detalles para venta ID: ${ventaId}`);

        // Obtener ids existentes (cuando editamos) para poder eliminar los removidos
        const existentes = isEditing ? getDetallesVenta(ventaId).map(d => Number(d.idDetalleVenta)).filter(Boolean) : [];

        const procesadosIds = [];

        for (const detalle of detallesTemp) {
          // Normalizar y validar ids de producto/servicio
          const pid = detalle.idProducto && Number(detalle.idProducto) > 0 ? Number(detalle.idProducto) : null;
          const sid = detalle.idServicio && Number(detalle.idServicio) > 0 ? Number(detalle.idServicio) : null;

          if (!pid && !sid) {
            console.warn("Detalle inválido (ni producto ni servicio):", detalle);
            displayAlert("Detalle inválido: cada detalle debe asociarse a un producto o servicio.", "error");
            continue;
          }

          // Verificar que el producto/servicio exista en memoria antes de enviar (evita 400/FK)
          if (pid && !productos.find(p => Number(p.idProducto) === pid && (p.idProducto || p.id))) {
            displayAlert(`Producto con id ${pid} no existe. No se guardó ese detalle.`, "error");
            continue;
          }
          if (sid && !servicios.find(s => Number(s.idServicio) === sid && (s.idServicio || s.id))) {
            displayAlert(`Servicio con id ${sid} no existe. No se guardó ese detalle.`, "error");
            continue;
          }

          const payload = {
            idVenta: Number(ventaId),
            cantidad: Number(detalle.cantidad) || 1,
            valorUnitario: Number(detalle.valorUnitario) || 0,
            valorTotal: Number(detalle.valorTotal) || (Number(detalle.valorUnitario || 0) * Number(detalle.cantidad || 1)),
            // enviar null cuando no aplica (evita conflicto FK con 0)
            idProducto: pid,
            idServicio: sid
          };

          try {
            if (detalle.idDetalleVenta && Number(detalle.idDetalleVenta) > 0) {
              // actualizar detalle existente
              const idDet = Number(detalle.idDetalleVenta);
              await axios.put(`${API_DETALLE_VENTA}/${idDet}`, payload, { headers: { 'Content-Type': 'application/json' } });
              procesadosIds.push(idDet);
              console.log(`✅ Detalle actualizado: ${idDet}`);
            } else {
              // crear nuevo detalle
              const resp = await axios.post(API_DETALLE_VENTA, payload, { headers: { 'Content-Type': 'application/json' } });
              // intentar obtener id devuelto por el backend (si aplica)
              const nuevoId = resp.data?.idDetalleVenta || resp.data?.id || resp.data;
              if (nuevoId) procesadosIds.push(Number(nuevoId));
              console.log("✅ Nuevo detalle creado", resp.data);
            }
          } catch (err) {
            console.error("❌ Error al guardar detalle:", err);
            if (err.response) {
              console.error("Detalles del error del servidor:", err.response.data);
              const serverMsg = typeof err.response.data === "string" ? err.response.data : (err.response.data?.message || err.response.data?.title || JSON.stringify(err.response.data));
              displayAlert(`Error al guardar detalle: ${serverMsg}`, "error");
            } else {
              displayAlert("Error al guardar detalle (sin respuesta del servidor).", "error");
            }
          }
        }

        // Si estamos editando, eliminar detalles que existían y ya no están en detallesTemp
        if (isEditing && existentes.length > 0) {
          const aEliminar = existentes.filter(id => !procesadosIds.includes(id));
          for (const idEliminar of aEliminar) {
            try {
              await axios.delete(`${API_DETALLE_VENTA}/${idEliminar}`);
              console.log(`🗑️ Detalle eliminado: ${idEliminar}`);
            } catch (err) {
              console.error(`❌ Error al eliminar detalle ${idEliminar}:`, err);
            }
          }
        }
      } else {
        console.log("ℹ️ No hay detalles para guardar");
      }

      // Recargar todos los datos
      await fetchAllData();
      closeForm();
    } catch (error) {
      console.error("❌ Error al guardar venta:", error);
      // Mostrar más detalles del error
      if (error.response) {
        console.error("Error del servidor:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
       
        let errorMessage = "Error del servidor";
        if (error.response.data) {
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data.title) {
            errorMessage = error.response.data.title;
          }
        }
       
        displayAlert(`Error: ${errorMessage}`, "error");
      } else if (error.request) {
        displayAlert("No se recibió respuesta del servidor. Verifica que esté en ejecución.", "error");
      } else {
        displayAlert(`Error: ${error.message}`, "error");
      }
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
  // COMPONENTES PARA DETALLES
  // ===============================================
  const DetallesVenta = ({ venta }) => {
    const reservaInfo = getReservaInfo(venta.idReserva);
    const detalles = getDetallesVenta(venta.idVenta);
    const totalVenta = calcularTotalVenta(venta.idVenta);
   
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

        {/* Detalles de la venta */}
        {detalles.length > 0 && (
          <div style={detailItemStyle}>
            <div style={detailLabelStyle}>Detalles de la Venta</div>
            <div style={{
              backgroundColor: '#F7F4EA',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #E8F5E8'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #679750' }}>
                    <th style={{ padding: '8px', textAlign: 'left', color: '#2E5939' }}>Item</th>
                    <th style={{ padding: '8px', textAlign: 'center', color: '#2E5939' }}>Tipo</th>
                    <th style={{ padding: '8px', textAlign: 'center', color: '#2E5939' }}>Cantidad</th>
                    <th style={{ padding: '8px', textAlign: 'right', color: '#2E5939' }}>Valor Unitario</th>
                    <th style={{ padding: '8px', textAlign: 'right', color: '#2E5939' }}>Valor Total</th>
                  </tr>
                </thead>
                <tbody>
                  {detalles.map((detalle) => {
                    const itemInfo = getItemInfo(detalle.idProducto, detalle.idServicio);
                    return (
                      <tr key={detalle.idDetalleVenta || `${detalle.idVenta}-${detalle.idProducto}-${detalle.idServicio}`} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '8px' }}>{itemInfo.nombre}</td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>
                          <span style={{
                            backgroundColor: itemInfo.tipo === 'producto' ? '#4caf50' : '#2196f3',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px'
                          }}>
                            {itemInfo.tipo === 'producto' ? 'Producto' : 'Servicio'}
                          </span>
                        </td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>{detalle.cantidad}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>{formatPrice(detalle.valorUnitario || itemInfo.precio)}</td>
                        <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>
                          {formatPrice(detalle.valorTotal || (detalle.valorUnitario || itemInfo.precio) * detalle.cantidad)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: '2px solid #679750' }}>
                    <td colSpan="4" style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>
                      Total Venta:
                    </td>
                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold', color: '#2E5939' }}>
                      {formatPrice(totalVenta)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {detalles.length === 0 && (
          <div style={detailItemStyle}>
            <div style={detailLabelStyle}>Detalles de la Venta</div>
            <div style={{
              backgroundColor: '#fff3cd',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #ffeaa7',
              textAlign: 'center',
              color: '#856404'
            }}>
              <FaInfoCircle style={{ marginRight: '8px' }} />
              No hay detalles registrados para esta venta
            </div>
          </div>
        )}
      </div>
    );
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
            setDetallesTemp([]);
            setNewVenta({
              idVenta: 0,
              fechaVenta: new Date().toISOString().slice(0, 16),
              idReserva: "",
              metodoPago: METODOS_PAGO[0],
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
        >
          <FaPlus /> Nueva Venta
        </button>
      </div>

      {/* Tarjetas de Estadísticas */}
      {!loading && ventas.length > 0 && (
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
              {estadisticas.totalVentas}
            </div>
            <div style={{ fontSize: '16px', color: '#679750', fontWeight: '600' }}>
              Total Ventas
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
              {estadisticas.ventasActivas}
            </div>
            <div style={{ fontSize: '16px', color: '#4caf50', fontWeight: '600' }}>
              Ventas Activas
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
              {estadisticas.ventasAnuladas}
            </div>
            <div style={{ fontSize: '16px', color: '#e57373', fontWeight: '600' }}>
              Ventas Anuladas
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
              {formatPrice(estadisticas.ingresosTotales)}
            </div>
            <div style={{ fontSize: '16px', color: '#2196f3', fontWeight: '600' }}>
              Ingresos Totales
            </div>
          </div>

          <div style={{
            backgroundColor: '#E8F5E8',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '2px solid #9C27B0',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease'
          }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2E5939', marginBottom: '8px' }}>
              {estadisticas.metodoMasUtilizado}
            </div>
            <div style={{ fontSize: '16px', color: '#9C27B0', fontWeight: '600' }}>
              Método Más Usado
            </div>
          </div>
        </div>
      )}

      {/* Barra de búsqueda y filtros - MEJORADO COMO EN TIPO CABAÑA */}
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
          <div style={{ position: "relative", flex: 1, maxWidth: 720, minWidth: 0 }}>
            <FaSearch style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#2E5939",
              zIndex: 2,
              pointerEvents: "none"
            }} />
            <input
              type="text"
              placeholder="Buscar por ID venta, ID reserva o método de pago..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: "12px 12px 12px 44px",
                borderRadius: 10,
                border: "1px solid #ccc",
                width: "100%",
                minWidth: 0,
                backgroundColor: "#F7F4EA",
                color: "#2E5939",
                boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                boxSizing: "border-box"
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
                  <option value="inactivo">Anuladas</option>
                </select>
              </div>

              {/* Filtro por método de pago */}
              <div>
                <label style={labelStyle}>Método de Pago</label>
                <select
                  name="metodoPago"
                  value={filters.metodoPago}
                  onChange={handleFilterChange}
                  style={{
                    ...inputStyle,
                    width: '100%'
                  }}
                >
                  <option value="all">Todos los métodos</option>
                  {METODOS_PAGO.map(metodo => (
                    <option key={metodo} value={metodo}>{metodo}</option>
                  ))}
                </select>
              </div>

              {/* Filtro por fecha de inicio */}
              <div>
                <label style={labelStyle}>Fecha Desde</label>
                <input
                  type="date"
                  name="fechaDesde"
                  value={filters.fechaDesde}
                  onChange={handleFilterChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Fecha Hasta</label>
                <input
                  type="date"
                  name="fechaHasta"
                  value={filters.fechaHasta}
                  onChange={handleFilterChange}
                  style={inputStyle}
                />
              </div>

              {/* Ordenamiento */}
              <div>
                <label style={labelStyle}>Ordenar por</label>
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
                <label style={labelStyle}>Dirección</label>
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
          </div>
        )}

        {/* Información de resultados filtrados */}
        {filteredVentas.length !== ventas.length && (
          <div style={{
            marginTop: '10px',
            padding: '8px 12px',
            backgroundColor: '#E8F5E8',
            borderRadius: '6px',
            color: '#2E5939',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Mostrando {filteredVentas.length} de {ventas.length} ventas
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

                {/* Sección: Reserva monto y totales */}
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: '#679750' }}>Monto reserva (si existe)</div>
                    <div style={{ fontWeight: 800, fontSize: 18 }}>{formatPrice(reservaMonto)}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: '#679750' }}>Total detalles</div>
                    <div style={{ fontWeight: 800, fontSize: 18 }}>{formatPrice(totalDetallesTemp)}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: '#679750' }}>Total Venta</div>
                    <div style={{ fontWeight: 900, fontSize: 20, color: '#2E5939' }}>{formatPrice(totalVentaCalculado)}</div>
                  </div>
                </div>
              </div>

              {/* Sección agregar productos/servicios - MEJORADA */}
              <div style={{ marginBottom: 18, padding: 12, borderRadius: 8, backgroundColor: '#FBFDF9', border: '1px solid rgba(103,151,80,0.08)' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <label style={{ fontWeight: 700, color: '#2E5939' }}>Tipo</label>
                    <select value={selectedItemType} onChange={(e) => { setSelectedItemType(e.target.value); setSelectedItemId(""); }} style={{ ...inputStyle, width: 160 }}>
                      <option value="producto">Producto</option>
                      <option value="servicio">Servicio</option>
                    </select>
                  </div>

                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Artículo</label>
                    <select value={selectedItemId} onChange={(e) => setSelectedItemId(e.target.value)} style={{ ...inputStyle, width: '100%' }}>
                      <option value="">Seleccionar</option>
                      {selectedItemType === "producto" && productos.map(p => {
                        const nombre = p.nombreProducto || p.nombre || "Producto sin nombre";
                        const precio = p.precio || p.valorUnitario || 0;
                        return (
                          <option key={p.idProducto || p.id} value={p.idProducto || p.id}>
                            {nombre} — {formatPrice(precio)}
                          </option>
                        );
                      })}
                      {selectedItemType === "servicio" && servicios.map(s => {
                        const nombre = s.nombreServicio || s.nombre || "Servicio sin nombre";
                        const precio = s.precio || s.valorUnitario || 0;
                        return (
                          <option key={s.idServicio || s.id} value={s.idServicio || s.id}>
                            {nombre} — {formatPrice(precio)}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div style={{ width: 120 }}>
                    <label style={labelStyle}>Cantidad</label>
                    <input type="number" min="1" value={selectedQuantity} onChange={(e) => setSelectedQuantity(e.target.value)} style={inputStyle} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button type="button" onClick={addDetalleTemp} style={{
                      backgroundColor: "#2E5939",
                      color: "#fff",
                      padding: "10px 14px",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}>
                      <FaPlusCircle /> Agregar
                    </button>
                  </div>
                </div>
              </div>

              {/* Lista de detalles temporales */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Detalles agregados</div>
                {detallesTemp.length === 0 ? (
                  <div style={{ padding: 12, borderRadius: 8, backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', color: '#856404' }}>
                    No hay productos o servicios agregados.
                  </div>
                ) : (
                  <div style={{ borderRadius: 8, border: '1px solid #E8F5E8', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead style={{ backgroundColor: '#F7F4EA' }}>
                        <tr>
                          <th style={{ padding: 10, textAlign: 'left' }}>Item</th>
                          <th style={{ padding: 10, textAlign: 'center' }}>Tipo</th>
                          <th style={{ padding: 10, textAlign: 'center' }}>Cantidad</th>
                          <th style={{ padding: 10, textAlign: 'right' }}>Valor Unitario</th>
                          <th style={{ padding: 10, textAlign: 'right' }}>Valor Total</th>
                          <th style={{ padding: 10, textAlign: 'center' }}>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detallesTemp.map((d, idx) => {
                          const info = getItemInfo(d.idProducto, d.idServicio);
                          return (
                            <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                              <td style={{ padding: 10 }}>{info.nombre}</td>
                              <td style={{ padding: 10, textAlign: 'center' }}>{info.tipo === 'producto' ? 'Producto' : 'Servicio'}</td>
                              <td style={{ padding: 10, textAlign: 'center' }}>
                                <input type="number" min="1" value={d.cantidad} onChange={(e) => updateDetalleCantidad(idx, e.target.value)} style={{ width: 80, padding: 6, borderRadius: 6, border: '1px solid #ccc' }} />
                              </td>
                              <td style={{ padding: 10, textAlign: 'right' }}>{formatPrice(d.valorUnitario)}</td>
                              <td style={{ padding: 10, textAlign: 'right', fontWeight: 700 }}>{formatPrice(d.valorTotal)}</td>
                              <td style={{ padding: 10, textAlign: 'center' }}>
                                <button type="button" onClick={() => removeDetalleTemp(idx)} style={{ background: 'none', border: 'none', color: '#e57373', cursor: 'pointer' }}>
                                  <FaTrashAlt />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
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

            <div style={{ display: "flex", justifyContent: "center", gap: '10px', marginTop: 20 }}>
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
              >
                Cancelar
              </button>
            </div>
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
                    {activeFiltersCount > 0 && (
                      <div style={{ color: '#679750', fontSize: '14px', marginTop: '5px' }}>
                        Filtros activos: {activeFiltersCount}
                      </div>
                    )}
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
                    {ventas.length > 0 && activeFiltersCount > 0 && (
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
              paginatedVentas.map((venta) => (
                <tr key={venta.idVenta} style={{
                  borderBottom: "1px solid #eee",
                  backgroundColor: venta.estado ? '#fff' : '#f9f9f9'
                }}>
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

      {/* Indicador de carga */}
      {loading && ventas.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#2E5939' }}>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>Cargando datos...</div>
          <div style={{ width: '100%', height: '4px', backgroundColor: '#E8F5E8', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              width: '60%',
              height: '100%',
              backgroundColor: '#2E5939',
              animation: 'loading 1.5s infinite ease-in-out'
            }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ventas;  