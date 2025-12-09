import { FaEye, FaEdit, FaTrash, FaTimes, FaExclamationTriangle, FaPlus, FaMoneyBillAlt, FaFilePdf, FaCalendarAlt, FaUser, FaMapMarkerAlt, FaHome, FaBox, FaCreditCard, FaSearch, FaSync, FaCheck, FaReceipt, FaInfoCircle, FaUsers, FaDollarSign, FaSlidersH, FaList, FaMoneyBillWave } from "react-icons/fa";
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

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

const inputDisabledStyle = {
  ...inputStyle,
  backgroundColor: "#f8f9fa",
  color: "#6c757d",
  cursor: "not-allowed",
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

// MODIFICADO: Se agregó overflow: 'hidden' al body cuando el modal está abierto
const modalOverlayStyle = (isOpen) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  display: isOpen ? "flex" : "none",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
  overflow: 'auto', // Permitir scroll solo dentro del modal si es necesario
});

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
  overflowY: 'auto', // Scroll solo dentro del modal si el contenido es muy largo
  position: 'relative',
  border: "2px solid #679750",
  margin: '20px 0', // Espacio para que no toque los bordes de la ventana
};

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
  margin: '20px 0',
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

const cardStyle = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  overflow: 'hidden',
  border: '1px solid rgba(103, 151, 80, 0.1)'
};

const statCardStyle = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  border: '1px solid rgba(103, 151, 80, 0.1)',
  textAlign: 'center'
};

// ===============================================
// VALIDACIONES Y PATRONES
// ===============================================
const VALIDATION_RULES = {
  fechaEntrada: {
    required: true,
    errorMessages: {
      required: "La fecha de entrada es obligatoria.",
      invalid: "La fecha de entrada no puede ser anterior a hoy."
    }
  },
  fechaReserva: {
    required: true,
    errorMessages: {
      required: "La fecha de salida es obligatoria.",
      invalid: "La fecha de salida debe ser posterior a la fecha de entrada."
    }
  },
  idUsuario: {
    required: true,
    errorMessages: {
      required: "Debe seleccionar un usuario."
    }
  },
  idSede: {
    required: true,
    errorMessages: {
      required: "Debe seleccionar una sede."
    }
  },
  idCabana: {
    required: true,
    errorMessages: {
      required: "Debe seleccionar una cabaña."
    }
  }
};

// ===============================================
// DATOS DE CONFIGURACIÓN
// ===============================================
const API_BASE_URL = "http://localhost:5272/api";
const API_RESERVAS = `${API_BASE_URL}/Reservas`;
const API_CABANAS = `${API_BASE_URL}/Cabanas`;
const API_SEDES = `${API_BASE_URL}/Sede`;
const API_PAQUETES = `${API_BASE_URL}/Paquetes`;
const API_ESTADOS = `${API_BASE_URL}/EstadosReserva`;
const API_USUARIOS = `${API_BASE_URL}/Usuarios`;
const API_METODOS_PAGO = `${API_BASE_URL}/metodopago`;
const API_SERVICIOS = `${API_BASE_URL}/Servicios`;
const API_SERVICIOS_RESERVA = `${API_BASE_URL}/ServiciosReserva`;
const API_ABONOS = `${API_BASE_URL}/Abonos`;
const API_VENTAS = `${API_BASE_URL}/Ventas`;
const API_SEDES_POR_SERVICIO = `${API_BASE_URL}/SedesPorServicio`;
const API_SEDE_POR_PAQUETE = `${API_BASE_URL}/SedePorPaquete`;

const ITEMS_PER_PAGE = 5;

// ===============================================
// COMPONENTE FormField
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
  placeholder,
  touched = false,
  icon
}) => {
  const finalOptions = useMemo(() => {
    if (type === "select") {
      const placeholderOption = {
        value: "",
        label: placeholder || "Seleccionar",
        disabled: required
      };
      return [placeholderOption, ...options];
    }
    return options;
  }, [options, type, required, placeholder]);

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
      ...(disabled && inputDisabledStyle)
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
        {icon && <span style={{ marginRight: '8px' }}>{icon}</span>}
        {label}
        {required && <span style={{ color: "red" }}>*</span>}
      </label>
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
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
          {finalOptions.map((option, index) => (
            <option
              key={option.value || `placeholder-${name}-${index}`}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          style={getInputStyle()}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
        />
      )}
      {getValidationMessage()}
    </div>
  );
};

// ===============================================
// COMPONENTE PRINCIPAL GestionReserva
// ===============================================
const GestionReserva = () => {
  const [reservas, setReservas] = useState([]);
  const [cabinas, setCabinas] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [serviciosReserva, setServiciosReserva] = useState([]);
  const [abonos, setAbonos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [sedesPorServicio, setSedesPorServicio] = useState([]);
  const [sedePorPaquete, setSedePorPaquete] = useState([]);

  const [cabanasBySede, setCabanasBySede] = useState([]);
  const [paquetesBySede, setPaquetesBySede] = useState([]);
  const [serviciosBySede, setServiciosBySede] = useState([]);

  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    pendientes: 0,
    abonadas: 0,
    totalIngresos: 0
  });

  const [showAbonosModal, setShowAbonosModal] = useState(false);
  const [abonosReserva, setAbonosReserva] = useState([]);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

  const calcularEstadisticas = (reservasList = []) => {
    const total = reservasList.length;
    const pendientes = reservasList.filter(r => Number(r.idEstado) === 2).length;
    const abonadas = reservasList.filter(r => Number(r.idEstado) === 1).length;
    const totalIngresos = reservasList.reduce((acc, r) => acc + (Number(r.montoTotal) || 0), 0);
    return { total, pendientes, abonadas, totalIngresos };
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentReserva, setCurrentReserva] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reservaToDelete, setReservaToDelete] = useState(null);
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

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sede: '',
    estado: '',
    fechaDesde: '',
    fechaHasta: '',
    montoMin: '',
    montoMax: ''
  });

  const [newReserva, setNewReserva] = useState({
    idReserva: 0,
    fechaReserva: "",
    fechaEntrada: "",
    fechaRegistro: "",
    abono: 0,
    restante: 0,
    montoTotal: 0,
    idUsuario: "",
    idEstado: "2",
    idSede: "",
    idCabana: "",
    idMetodoPago: "",
    idPaquete: "",
    serviciosSeleccionados: []
  });

  // ===============================================
  // EFECTOS
  // ===============================================
  useEffect(() => {
    fetchReservas();
    fetchDatosRelacionados();
  }, []);

  useEffect(() => {
    if (showForm) {
      Object.keys(touchedFields).forEach(fieldName => {
        if (touchedFields[fieldName]) {
          validateField(fieldName, newReserva[fieldName]);
        }
      });
    }
  }, [newReserva, showForm, touchedFields]);

  useEffect(() => {
    if (showForm) {
      calcularMontos();
    }
  }, [newReserva.idCabana, newReserva.idPaquete, newReserva.serviciosSeleccionados]);

  useEffect(() => {
    const nuevasEstadisticas = calcularEstadisticas(reservas);
    setEstadisticas(nuevasEstadisticas);
  }, [reservas]);

  // Efecto para bloquear el scroll del body cuando hay modales abiertos
  useEffect(() => {
    const isModalOpen = showForm || showDetails || showDeleteConfirm || showAbonosModal;
    
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0'; // Para evitar el desplazamiento del contenido
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
    };
  }, [showForm, showDetails, showDeleteConfirm, showAbonosModal]);

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
     
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
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
  // FUNCIONES DE ALERTAS
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
  const fetchReservas = async () => {
    setLoading(true);
    setError(null);
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
        setEstadisticas(calcularEstadisticas(res.data));
      } else if (res.data && Array.isArray(res.data.$values)) {
        setReservas(res.data.$values);
        setEstadisticas(calcularEstadisticas(res.data.$values));
      } else {
        throw new Error("Formato de datos inválido");
      }
    } catch (error) {
      console.error("Error al obtener reservas:", error);
      handleApiError(error, "cargar las reservas");
    } finally {
      setLoading(false);
    }
  };

  const fetchDatosRelacionados = async () => {
    try {
      const configuracionPorDefecto = {
        estados: [
          { idEstado: 1, nombreEstado: 'Abonado' },
          { idEstado: 2, nombreEstado: 'Pendiente' },
          { idEstado: 3, nombreEstado: 'Cancelada' },
          { idEstado: 4, nombreEstado: 'Completada' }
        ],
        metodosPago: [
          { idMetodoPago: 1, nombreMetodoPago: "Transferencia" }
        ]
      };

      const fetchConManejoError = async (url, defaultValue = []) => {
        try {
          const response = await axios.get(url, { timeout: 8000 });
          if (Array.isArray(response.data)) {
            return response.data;
          } else if (response.data && Array.isArray(response.data.$values)) {
            return response.data.$values;
          } else {
            return defaultValue;
          }
        } catch (error) {
          console.warn(`No se pudieron cargar datos de ${url}:`, error.message);
          return defaultValue;
        }
      };

      const [
        cabinasData,
        sedesData,
        paquetesData,
        usuariosData,
        metodosPagoData,
        serviciosData,
        estadosData,
        abonosData,
        ventasData,
        serviciosReservaData,
        sedesPorServicioData,
        sedePorPaqueteData
      ] = await Promise.all([
        fetchConManejoError(API_CABANAS),
        fetchConManejoError(API_SEDES),
        fetchConManejoError(API_PAQUETES),
        fetchConManejoError(API_USUARIOS),
        fetchConManejoError(API_METODOS_PAGO, configuracionPorDefecto.metodosPago),
        fetchConManejoError(API_SERVICIOS),
        fetchConManejoError(API_ESTADOS, configuracionPorDefecto.estados),
        fetchConManejoError(API_ABONOS),
        fetchConManejoError(API_VENTAS),
        fetchConManejoError(API_SERVICIOS_RESERVA),
        fetchConManejoError(API_SEDES_POR_SERVICIO),
        fetchConManejoError(API_SEDE_POR_PAQUETE)
      ]);

      setCabinas(cabinasData);
      setSedes(sedesData);
      setPaquetes(paquetesData);
      setUsuarios(usuariosData);
      setMetodosPago(metodosPagoData);
      setServicios(serviciosData);
      setEstados(estadosData);
      setAbonos(abonosData);
      setVentas(ventasData);
      setServiciosReserva(serviciosReservaData);
      setSedesPorServicio(sedesPorServicioData);
      setSedePorPaquete(sedePorPaqueteData);

    } catch (error) {
      console.error("Error crítico al cargar datos relacionados:", error);
      setEstados(configuracionPorDefecto.estados);
      setMetodosPago(configuracionPorDefecto.metodosPago);
    }
  };

  // ===============================================
  // FUNCIONES PARA MANEJAR ABONOS
  // ===============================================
  const handleViewAbonos = async (reserva) => {
    setLoading(true);
    try {
      const response = await axios.get(API_ABONOS);
      let abonosData = [];
     
      if (Array.isArray(response.data)) {
        abonosData = response.data.filter(abono => abono.idReserva === reserva.idReserva);
      } else if (response.data && Array.isArray(response.data.$values)) {
        abonosData = response.data.$values.filter(abono => abono.idReserva === reserva.idReserva);
      }
     
      setAbonosReserva(abonosData);
      setReservaSeleccionada(reserva);
      setShowAbonosModal(true);
     
    } catch (error) {
      console.error("Error al obtener abonos:", error);
      displayAlert("Error al cargar los abonos", "error");
    } finally {
      setLoading(false);
    }
  };

  const closeAbonosModal = () => {
    setShowAbonosModal(false);
    setAbonosReserva([]);
    setReservaSeleccionada(null);
  };

  // ===============================================
  // FUNCIONES DE FILTRADO
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
      sede: '',
      estado: '',
      fechaDesde: '',
      fechaHasta: '',
      montoMin: '',
      montoMax: ''
    });
    setCurrentPage(1);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.sede) count++;
    if (filters.estado) count++;
    if (filters.fechaDesde) count++;
    if (filters.fechaHasta) count++;
    if (filters.montoMin) count++;
    if (filters.montoMax) count++;
    return count;
  }, [filters]);

  // ===============================================
  // FUNCIONES DE VALIDACIÓN
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
    else if (fieldName === 'fechaEntrada' && trimmedValue) {
      const hoy = new Date().toISOString().split('T')[0];
      if (trimmedValue < hoy) {
        error = rules.errorMessages.invalid;
      } else {
        success = "Fecha válida.";
      }
    }
    else if (fieldName === 'fechaReserva' && trimmedValue && newReserva.fechaEntrada) {
      if (trimmedValue <= newReserva.fechaEntrada) {
        error = rules.errorMessages.invalid;
      } else {
        success = "Fecha válida.";
      }
    }
    else if (trimmedValue) {
      success = `${fieldName === 'idUsuario' ? 'Usuario' : fieldName === 'idSede' ? 'Sede' : 'Cabaña'} válido.`;
    }

    setFormErrors(prev => ({ ...prev, [fieldName]: error }));
    setFormSuccess(prev => ({ ...prev, [fieldName]: success }));
    setFormWarnings(prev => ({ ...prev, [fieldName]: warning }));

    return !error;
  };

  const validateForm = () => {
    const allFieldsTouched = {
      fechaEntrada: true,
      fechaReserva: true,
      idUsuario: true,
      idSede: true,
      idCabana: true
    };
    setTouchedFields(allFieldsTouched);

    const fechaEntradaValid = validateField('fechaEntrada', newReserva.fechaEntrada);
    const fechaReservaValid = validateField('fechaReserva', newReserva.fechaReserva);
    const usuarioValid = validateField('idUsuario', newReserva.idUsuario);
    const sedeValid = validateField('idSede', newReserva.idSede);
    const cabanaValid = validateField('idCabana', newReserva.idCabana);

    const isValid = fechaEntradaValid && fechaReservaValid && usuarioValid && sedeValid && cabanaValid;
   
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

  const markFieldAsTouched = (fieldName) => {
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
  };

  // ===============================================
  // FUNCIONES PRINCIPALES
  // ===============================================
  const calcularMontos = () => {
    let total = 0;

    // Precio de la cabaña
    if (newReserva.idCabana) {
      const cabinaSeleccionada = cabinas.find(c => c.idCabana === parseInt(newReserva.idCabana));
      if (cabinaSeleccionada && cabinaSeleccionada.precio) {
        total += parseFloat(cabinaSeleccionada.precio);
      }
    }

    // Precio del paquete (opcional)
    if (newReserva.idPaquete) {
      const paqueteSeleccionado = paquetes.find(p => p.idPaquete === parseInt(newReserva.idPaquete));
      if (paqueteSeleccionado && paqueteSeleccionado.precioPaquete) {
        total += parseFloat(paqueteSeleccionado.precioPaquete);
      }
    }

    // Precio de servicios (opcionales)
    if (newReserva.serviciosSeleccionados.length > 0) {
      newReserva.serviciosSeleccionados.forEach(servicioId => {
        const servicio = servicios.find(s => s.idServicio === parseInt(servicioId));
        if (servicio && servicio.precioServicio) {
          total += parseFloat(servicio.precioServicio);
        }
      });
    }

    const abono = Math.round(total * 0.5);
    const restante = total - abono;

    setNewReserva(prev => ({
      ...prev,
      montoTotal: total,
      abono: abono,
      restante: restante
    }));
  };

  const inicializarNuevaReserva = () => {
    const fechaActual = new Date().toISOString().split('T')[0];
    const fechaEntrada = new Date();
    fechaEntrada.setDate(fechaEntrada.getDate() + 1);
    const fechaEntradaStr = fechaEntrada.toISOString().split('T')[0];

    const fechaSalida = new Date();
    fechaSalida.setDate(fechaSalida.getDate() + 2);
    const fechaSalidaStr = fechaSalida.toISOString().split('T')[0];

    setNewReserva({
      idReserva: 0,
      fechaReserva: fechaSalidaStr,
      fechaEntrada: fechaEntradaStr,
      fechaRegistro: fechaActual,
      abono: 0,
      restante: 0,
      montoTotal: 0,
      idUsuario: "",
      idEstado: "2",
      idSede: "",
      idCabana: "",
      idMetodoPago: metodosPago.length > 0 ? metodosPago[0].idMetodoPago.toString() : "",
      idPaquete: "",
      serviciosSeleccionados: []
    });
   
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
    setTouchedFields({});
   
    setCabanasBySede([]);
    setPaquetesBySede([]);
    setServiciosBySede([]);
  };

  const fetchRecursosParaSede = async (idSede) => {
    if (!idSede) {
      setCabanasBySede([]);
      setPaquetesBySede([]);
      setServiciosBySede([]);
      return;
    }
    const id = parseInt(idSede);
   
    // Filtrar cabañas locales por sede
    const cabinasLocal = cabinas.filter(c => {
      const cabinaSedeId = parseInt(c.idSede || c.sedeId || 0);
      return cabinaSedeId === id;
    });
   
    // Filtrar paquetes por sede usando la relación sedePorPaquete
    const paquetesDeSede = sedePorPaquete
      .filter(sp => parseInt(sp.idSede || sp.sedeId || 0) === id)
      .map(sp => paquetes.find(p => p.idPaquete === parseInt(sp.idPaquete || sp.paqueteId || 0)))
      .filter(Boolean);
   
    // Filtrar servicios por sede usando sedesPorServicio
    const serviciosDeSede = sedesPorServicio
      .filter(ss => parseInt(ss.idSede || ss.sedeId || 0) === id)
      .map(ss => servicios.find(s => s.idServicio === parseInt(ss.idServicio || ss.servicioId || 0)))
      .filter(Boolean);

    setCabanasBySede(cabinasLocal);
    setPaquetesBySede(paquetesDeSede);
    setServiciosBySede(serviciosDeSede);

    // CONSULTAS ADICIONALES SI NO HAY DATOS LOCALES
    try {
      if (cabinasLocal.length === 0) {
        const r = await axios.get(`${API_CABANAS}?idSede=${id}`, { timeout: 8000 });
        if (Array.isArray(r.data)) setCabanasBySede(r.data);
      }
    } catch (e) {}

    try {
      if (paquetesDeSede.length === 0) {
        const r = await axios.get(`${API_SEDE_POR_PAQUETE}?idSede=${id}`, { timeout: 8000 });
        if (Array.isArray(r.data)) {
          const paquetesIds = r.data.map(sp => sp.idPaquete || sp.paqueteId);
          const paquetesFiltrados = paquetes.filter(p => paquetesIds.includes(p.idPaquete));
          setPaquetesBySede(paquetesFiltrados);
        }
      }
    } catch (e) {}

    try {
      if (serviciosDeSede.length === 0) {
        const r = await axios.get(`${API_SEDES_POR_SERVICIO}?idSede=${id}`, { timeout: 8000 });
        if (Array.isArray(r.data)) {
          const serviciosIds = r.data.map(ss => ss.idServicio || ss.servicioId);
          const serviciosFiltrados = servicios.filter(s => serviciosIds.includes(s.idServicio));
          setServiciosBySede(serviciosFiltrados);
        }
      }
    } catch (e) {}
  };

  const handleSedeSelect = async (e) => {
    const { value } = e.target;
    setNewReserva(prev => ({
      ...prev,
      idSede: value,
      idCabana: "",
      idPaquete: "",
      serviciosSeleccionados: []
    }));
    markFieldAsTouched('idSede');
    await fetchRecursosParaSede(value);
  };

  // Comprueba solapamiento de fechas
  const isDateOverlap = (startA, endA, startB, endB) => {
    if (!startA || !endA || !startB || !endB) return false;
    const aStart = new Date(startA);
    const aEnd = new Date(endA);
    const bStart = new Date(startB);
    const bEnd = new Date(endB);
    if (isNaN(aStart) || isNaN(aEnd) || isNaN(bStart) || isNaN(bEnd)) return false;
    // Solapamiento (inclusive): true si los intervalos se cruzan
    return aStart <= bEnd && bStart <= aEnd;
  };

  // Verifica disponibilidad de una cabaña en las fechas dadas.
  // excludeReservaId: permite ignorar la propia reserva al editar.
  const checkAvailability = (idCabana, fechaEntrada, fechaSalida, excludeReservaId = null) => {
    if (!idCabana || !fechaEntrada || !fechaSalida) return false;
    return reservas.some(r => {
      // ignorar la propia reserva al editar
      if (excludeReservaId && Number(r.idReserva) === Number(excludeReservaId)) return false;
      // debe ser la misma cabaña
      if (!r.idCabana || Number(r.idCabana) !== Number(idCabana)) return false;
      // ignorar reservas canceladas (idEstado === 3)
      if (Number(r.idEstado) === 3) return false;
      const rEntrada = r.fechaEntrada;
      const rSalida = r.fechaReserva || r.fechaSalida || "";
      return isDateOverlap(fechaEntrada, fechaSalida, rEntrada, rSalida);
    });
  };

  const handleAddReserva = async (e) => {
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
      // Verificar disponibilidad ANTES de crear/actualizar
      const entrada = newReserva.fechaEntrada;
      const salida = newReserva.fechaReserva;
      const cabanaId = newReserva.idCabana;
      const excludeId = isEditing ? newReserva.idReserva : null;
      if (checkAvailability(cabanaId, entrada, salida, excludeId)) {
        displayAlert("Conflicto: la cabaña seleccionada ya está reservada en las fechas indicadas.", "error");
        setLoading(false);
        setIsSubmitting(false);
        return;
      }
      // Verifica si el usuario ya tiene una reserva activa en las mismas fechas
      const reservaConflicto = reservas.find(r =>
        r.idUsuario === newReserva.idUsuario &&
        r.idEstado !== 3 && // Excluir reservas canceladas
        isDateOverlap(entrada, salida, r.fechaEntrada, r.fechaReserva)
      );
      if (reservaConflicto) {
        displayAlert("El usuario ya tiene una reserva activa en las fechas seleccionadas.", "error");
        setLoading(false);
        setIsSubmitting(false);
        return;
      }

      const reservaData = {
        idReserva: isEditing ? parseInt(newReserva.idReserva) : 0,
        fechaReserva: newReserva.fechaReserva,
        fechaEntrada: newReserva.fechaEntrada,
        fechaRegistro: isEditing ? newReserva.fechaRegistro : new Date().toISOString().split('T')[0],
        abono: parseFloat(newReserva.abono) || 0,
        restante: parseFloat(newReserva.restante) || 0,
        montoTotal: parseFloat(newReserva.montoTotal) || 0,
        idUsuario: parseInt(newReserva.idUsuario),
        // al crear forzamos Pendiente (2); al editar respetamos el valor existente
        idEstado: isEditing ? parseInt(newReserva.idEstado) : 2,
        idSede: parseInt(newReserva.idSede),
        idCabana: parseInt(newReserva.idCabana),
        idMetodoPago: parseInt(newReserva.idMetodoPago),
        idPaquete: newReserva.idPaquete ? parseInt(newReserva.idPaquete) : 0
      };

      let reservaId;
      let response;

      if (isEditing) {
        response = await axios.put(`${API_RESERVAS}/${newReserva.idReserva}`, reservaData, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        reservaId = newReserva.idReserva;
       
        await manejarServiciosReserva(reservaId);
       
        displayAlert("Reserva actualizada exitosamente.", "success");
      } else {
        response = await axios.post(API_RESERVAS, reservaData, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
       
        reservaId = response.data.idReserva || response.data;
       
        if (!reservaId) {
          const ultimasReservas = await axios.get(API_RESERVAS);
          if (ultimasReservas.data && ultimasReservas.data.length > 0) {
            const ultimaReserva = ultimasReservas.data[ultimasReservas.data.length - 1];
            reservaId = ultimaReserva.idReserva;
          }
        }
       
        if (!reservaId) {
          throw new Error("No se pudo obtener el ID de la reserva creada");
        }
       
        await manejarServiciosReserva(reservaId);
        await crearAbonoInicial(reservaId);
        await crearVenta(reservaId);
       
        displayAlert("Reserva agregada exitosamente.", "success");
      }
     
      await fetchReservas();
      await fetchDatosRelacionados();
     
      closeForm();
    } catch (error) {
      console.error("Error al guardar reserva:", error);
     
      if (error.response) {
        const errorMessage = error.response.data?.mensaje || error.response.data?.message || error.response.data?.title || error.response.data;
        displayAlert(errorMessage || `Error al ${isEditing ? "actualizar" : "crear"} la reserva`, "error");
      } else {
        handleApiError(error, isEditing ? "actualizar la reserva" : "agregar la reserva");
      }
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const manejarServiciosReserva = async (idReserva) => {
    try {
      if (!newReserva.serviciosSeleccionados || newReserva.serviciosSeleccionados.length === 0) {
        return;
      }

      if (isEditing) {
        const serviciosExistentes = serviciosReserva.filter(sr => sr.idReserva === parseInt(idReserva));
        for (const servicio of serviciosExistentes) {
          await axios.delete(`${API_SERVICIOS_RESERVA}/${servicio.idServicioReserva}`);
        }
      }

      for (const idServicio of newReserva.serviciosSeleccionados) {
        const servicioData = {
          idServicioReserva: 0,
          idServicio: parseInt(idServicio),
          idReserva: parseInt(idReserva)
        };
        await axios.post(API_SERVICIOS_RESERVA, servicioData, {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (error) {
      console.error("Error al manejar servicios de reserva:", error);
    }
  };

  const crearAbonoInicial = async (idReserva) => {
    try {
      const monto = parseFloat(newReserva.abono) || 0;
      if (monto <= 0) return;

      const metodoSeleccionado = metodosPago.find(m => String(m.idMetodoPago) === String(newReserva.idMetodoPago))
        || (metodosPago.length ? metodosPago[0] : null);

      const abonoData = {
        idReserva: parseInt(idReserva),
        montoAbono: monto,
        ...(metodoSeleccionado ? { idMetodoPago: parseInt(metodoSeleccionado.idMetodoPago) } : {})
      };

      await axios.post(API_ABONOS, abonoData, {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error("Error al crear abono inicial:", error);
    }
  };

  const crearVenta = async (idReserva) => {
    try {
      const ventaData = {
        idVenta: 0,
        fechaVenta: new Date().toISOString().split('T')[0],
        idReserva: parseInt(idReserva),
        metodoPago: getMetodoPagoNombre(newReserva.idMetodoPago),
        estado: true
      };

      await axios.post(API_VENTAS, ventaData, {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error("Error al crear venta:", error);
    }
  };

  const confirmDelete = async () => {
    if (reservaToDelete) {
      setLoading(true);
      try {
        const serviciosReservaEliminar = serviciosReserva.filter(sr => sr.idReserva === reservaToDelete.idReserva);
        for (const servicio of serviciosReservaEliminar) {
          await axios.delete(`${API_SERVICIOS_RESERVA}/${servicio.idServicioReserva}`);
        }

        const abonosEliminar = abonos.filter(a => a.idReserva === reservaToDelete.idReserva);
        for (const abono of abonosEliminar) {
          await axios.delete(`${API_ABONOS}/${abono.idAbono}`);
        }

        const ventaEliminar = ventas.find(v => v.idReserva === reservaToDelete.idReserva);
        if (ventaEliminar) {
          await axios.delete(`${API_VENTAS}/${ventaEliminar.idVenta}`);
        }

        await axios.delete(`${API_RESERVAS}/${reservaToDelete.idReserva}`);
        displayAlert("Reserva eliminada exitosamente.", "success");
        await fetchReservas();
        await fetchDatosRelacionados();
       
        if (paginatedReservas.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("Error al eliminar reserva:", error);
        handleApiError(error, "eliminar la reserva");
      } finally {
        setLoading(false);
        setReservaToDelete(null);
        setShowDeleteConfirm(false);
      }
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
      errorMessage = "No se puede conectar al servidor en http://localhost:5272";
    } else if (error.response) {
      if (error.response.status === 400) {
        errorMessage = `Error de validación: ${error.response.data?.title || error.response.data?.message || 'Datos inválidos'}`;
      } else if (error.response.status === 404) {
        errorMessage = "Recurso no encontrado.";
      } else if (error.response.status === 409) {
        errorMessage = "Conflicto: La reserva tiene datos asociados y no puede ser eliminada.";
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
   
    if ((name === 'fechaRegistro' || name === 'idEstado') && !isEditing) {
      return;
    }
   
    setNewReserva((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInputBlur = (e) => {
    const { name } = e.target;
    markFieldAsTouched(name);
    validateField(name, newReserva[name]);
  };

  const handleServicioChange = (servicioId) => {
    setNewReserva(prev => {
      const serviciosActuales = [...prev.serviciosSeleccionados];
      const index = serviciosActuales.indexOf(servicioId);
     
      if (index > -1) {
        serviciosActuales.splice(index, 1);
      } else {
        serviciosActuales.push(servicioId);
      }
     
      return { ...prev, serviciosSeleccionados: serviciosActuales };
    });
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
    setTouchedFields({});
    setNewReserva({
      idReserva: 0,
      fechaReserva: "",
      fechaEntrada: "",
      fechaRegistro: "",
      abono: 0,
      restante: 0,
      montoTotal: 0,
      idUsuario: "",
      idEstado: "2",
      idSede: "",
      idCabana: "",
      idMetodoPago: "",
      idPaquete: "",
      serviciosSeleccionados: []
    });
    setCabanasBySede([]);
    setPaquetesBySede([]);
    setServiciosBySede([]);
  };

  const closeDetailsModal = () => {
    setShowDetails(false);
    setCurrentReserva(null);
  };

  const cancelDelete = () => {
    setReservaToDelete(null);
    setShowDeleteConfirm(false);
  };

  const handleView = (reserva) => {
    const serviciosReservaFiltrados = serviciosReserva.filter(sr => sr.idReserva === reserva.idReserva);
    const serviciosIds = serviciosReservaFiltrados.map(sr => sr.idServicio);
   
    const abonosReserva = abonos.filter(a => a.idReserva === reserva.idReserva);
    const ventaReserva = ventas.find(v => v.idReserva === reserva.idReserva);

    setCurrentReserva({
      ...reserva,
      serviciosSeleccionados: serviciosIds,
      abonos: abonosReserva,
      venta: ventaReserva
    });
    setShowDetails(true);
  };

  const handleEdit = async (reserva) => {
    const serviciosReservaFiltrados = serviciosReserva.filter(sr => sr.idReserva === reserva.idReserva);
    const serviciosIds = serviciosReservaFiltrados.map(sr => sr.idServicio.toString());

    setNewReserva({
      idReserva: reserva.idReserva,
      fechaReserva: formatDateForInput(reserva.fechaReserva),
      fechaEntrada: formatDateForInput(reserva.fechaEntrada),
      fechaRegistro: formatDateForInput(reserva.fechaRegistro),
      abono: reserva.abono || 0,
      restante: reserva.restante || 0,
      montoTotal: reserva.montoTotal || 0,
      idUsuario: reserva.idUsuario?.toString() || "",
      idEstado: reserva.idEstado?.toString() || "2",
      idSede: reserva.idSede?.toString() || "",
      idCabana: reserva.idCabana?.toString() || "",
      idMetodoPago: reserva.idMetodoPago?.toString() || "",
      idPaquete: reserva.idPaquete?.toString() || "",
      serviciosSeleccionados: serviciosIds
    });
    setIsEditing(true);
    setShowForm(true);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
    setTouchedFields({});
   
    if (reserva.idSede) {
      await fetchRecursosParaSede(reserva.idSede.toString());
    }
  };

  const handleDeleteClick = (reserva) => {
    setReservaToDelete(reserva);
    setShowDeleteConfirm(true);
  };

  // ===============================================
  // FUNCIONES DE FILTRADO Y PAGINACIÓN
  // ===============================================
  const filteredReservas = useMemo(() => {
    let filtered = reservas;

    if (searchTerm) {
      filtered = filtered.filter(reserva =>
        getUsuarioNombre(reserva.idUsuario)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCabinaNombre(reserva.idCabana)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getSedeNombre(reserva.idSede)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getEstadoNombre(reserva.idEstado)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reserva.idReserva?.toString().includes(searchTerm)
      );
    }

    if (filters.sede) {
      filtered = filtered.filter(reserva => reserva.idSede === parseInt(filters.sede));
    }

    if (filters.estado) {
      filtered = filtered.filter(reserva => reserva.idEstado === parseInt(filters.estado));
    }

    if (filters.fechaDesde) {
      filtered = filtered.filter(reserva => reserva.fechaEntrada >= filters.fechaDesde);
    }

    if (filters.fechaHasta) {
      filtered = filtered.filter(reserva => reserva.fechaEntrada <= filters.fechaHasta);
    }

    if (filters.montoMin) {
      filtered = filtered.filter(reserva => reserva.montoTotal >= parseFloat(filters.montoMin));
    }

    if (filters.montoMax) {
      filtered = filtered.filter(reserva => reserva.montoTotal <= parseFloat(filters.montoMax));
    }

    return filtered;
  }, [reservas, searchTerm, filters]);

  const totalPages = Math.ceil(filteredReservas.length / ITEMS_PER_PAGE);

  const paginatedReservas = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReservas.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredReservas, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ===============================================
  // FUNCIONES PARA OBTENER NOMBRES Y DATOS
  // ===============================================
  const getSedeNombre = (idSede) => {
    const sede = sedes.find(s => s.idSede === idSede);
    return sede ? sede.nombreSede : `Sede ${idSede}`;
  };

  const getCabinaNombre = (idCabana) => {
    const cabina = cabinas.find(c => c.idCabana === idCabana);
    return cabina ? cabina.nombre : `Cabaña ${idCabana}`;
  };

  const getPaqueteNombre = (idPaquete) => {
    if (!idPaquete || idPaquete === 0) return 'No aplica';
    const paquete = paquetes.find(p => p.idPaquete === idPaquete);
    return paquete ? paquete.nombrePaquete : `Paquete ${idPaquete}`;
  };

  const getEstadoNombre = (idEstado) => {
    const estado = estados.find(e => e.idEstado === idEstado);
    return estado ? estado.nombreEstado : `Estado ${idEstado}`;
  };

  const getUsuarioNombre = (idUsuario) => {
    const usuario = usuarios.find(u => u.idUsuario === idUsuario);
    return usuario ? `${usuario.nombre} ${usuario.apellido || ''}` : `Usuario ${idUsuario}`;
  };

  const getMetodoPagoNombre = (idMetodoPago) => {
    const metodo = metodosPago.find(m => m.idMetodoPago === idMetodoPago);
    return metodo ? metodo.nombreMetodoPago : `Método ${idMetodoPago}`;
  };

  const getServicioNombre = (idServicio) => {
    const servicio = servicios.find(s => s.idServicio === idServicio);
    return servicio ? servicio.nombreServicio : `Servicio ${idServicio}`;
  };

  const getEstadoColor = (idEstado) => {
    const estado = getEstadoNombre(idEstado).toLowerCase();
    if (estado.includes('abonado') || estado.includes('completada')) return '#4caf50';
    if (estado.includes('pendiente')) return '#ff9800';
    if (estado.includes('cancelada')) return '#f44336';
    return '#757575';
  };

  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(precio || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  // ===============================================
  // MODAL DE ABONOS
  // ===============================================
  const renderAbonosModal = () => {
    if (!showAbonosModal || !reservaSeleccionada) return null;

    const totalAbonado = abonosReserva.reduce((total, abono) => total + (abono.montoAbono || 0), 0);
    const porcentajeAbonado = reservaSeleccionada.montoTotal > 0
      ? Math.round((totalAbonado / reservaSeleccionada.montoTotal) * 100)
      : 0;

    return (
      <div style={modalOverlayStyle(showAbonosModal)}>
        <div style={{
          ...modalContentStyle,
          maxWidth: 600,
          padding: '25px'
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20
          }}>
            <h2 style={{ margin: 0, color: "#2E5939", textAlign: 'center' }}>
              <FaMoneyBillWave style={{ marginRight: '10px' }} />
              Abonos de la Reserva #{reservaSeleccionada.idReserva}
            </h2>
            <button
              onClick={closeAbonosModal}
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

          {/* Información de la reserva */}
          <div style={{
            backgroundColor: '#F7F4EA',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #679750'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: '600', color: '#2E5939' }}>Usuario:</span>
              <span>{getUsuarioNombre(reservaSeleccionada.idUsuario)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: '600', color: '#2E5939' }}>Cabaña:</span>
              <span>{getCabinaNombre(reservaSeleccionada.idCabana)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: '600', color: '#2E5939' }}>Monto Total:</span>
              <span style={{ fontWeight: 'bold', color: '#2E5939' }}>{formatPrecio(reservaSeleccionada.montoTotal)}</span>
            </div>
          </div>

          {/* Resumen de abonos */}
          <div style={{
            backgroundColor: '#E8F5E8',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '25px',
            border: '2px solid #4caf50',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2E5939', marginBottom: '10px' }}>
              Resumen de Abonos
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#679750', marginBottom: '5px' }}>Total Abonado</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2E5939' }}>
                  {formatPrecio(totalAbonado)}
                </div>
              </div>
              <div style={{ height: '40px', width: '1px', backgroundColor: '#679750' }}></div>
              <div>
                <div style={{ fontSize: '14px', color: '#679750', marginBottom: '5px' }}>Porcentaje</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2E5939' }}>
                  {porcentajeAbonado}%
                </div>
              </div>
              <div style={{ height: '40px', width: '1px', backgroundColor: '#679750' }}></div>
              <div>
                <div style={{ fontSize: '14px', color: '#679750', marginBottom: '5px' }}>Pendiente</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: reservaSeleccionada.montoTotal - totalAbonado > 0 ? '#e74c3c' : '#2E5939' }}>
                  {formatPrecio(reservaSeleccionada.montoTotal - totalAbonado)}
                </div>
              </div>
            </div>
          </div>

          {/* Lista de abonos */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#2E5939', marginBottom: '15px', borderBottom: '2px solid #679750', paddingBottom: '8px' }}>
              Detalle de Abonos ({abonosReserva.length})
            </h3>
           
            {abonosReserva.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '30px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                color: '#6c757d',
                fontStyle: 'italic'
              }}>
                No se han registrado abonos para esta reserva
              </div>
            ) : (
              <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                borderRadius: '8px',
                border: '1px solid #eee'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  backgroundColor: '#fff'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#679750', color: '#fff' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Fecha</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Monto</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Método</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Verificación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {abonosReserva.map((abono, index) => (
                      <tr key={index} style={{
                        borderBottom: '1px solid #eee',
                        backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa'
                      }}>
                        <td style={{ padding: '12px', color: '#2E5939' }}>
                          {formatDate(abono.fechaAbono)}
                        </td>
                        <td style={{ padding: '12px', fontWeight: '600', color: '#2E5939' }}>
                          {formatPrecio(abono.montoAbono)}
                        </td>
                        <td style={{ padding: '12px', color: '#2E5939' }}>
                          {getMetodoPagoNombre(abono.idMetodoPago)}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            color: abono.verificacion === 'Aprobado' ? '#4caf50' :
                                  abono.verificacion === 'Pendiente' ? '#ff9800' : '#e74c3c',
                            fontWeight: 'bold',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            backgroundColor: 'rgba(46, 89, 57, 0.1)',
                            fontSize: '12px'
                          }}>
                            {abono.verificacion || 'Pendiente'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Botón de cierre */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={closeAbonosModal}
              style={{
                backgroundColor: "#2E5939",
                color: "#fff",
                padding: "12px 30px",
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
    );
  };

  // ===============================================
  // FUNCIÓN PARA GENERAR PDF
  // ===============================================
  const handleDownloadPDF = (reserva) => {
    const serviciosReservaFiltrados = serviciosReserva.filter(sr => sr.idReserva === reserva.idReserva);
    const serviciosDetalle = serviciosReservaFiltrados.map(sr => {
      const servicio = servicios.find(s => s.idServicio === sr.idServicio);
      return {
        nombre: servicio ? servicio.nombreServicio : `Servicio ${sr.idServicio}`,
        precio: servicio ? servicio.precioServicio : 0
      };
    });

    const abonosReserva = abonos.filter(a => a.idReserva === reserva.idReserva);

    const doc = new jsPDF();
    // ENCABEZADO MEJORADO
    doc.setFillColor(46, 89, 57);
    doc.rect(0, 0, 210, 40, 'F');
 
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text("🏕", 20, 25);
    doc.text("GLAMPING LUXURY", 35, 25);
 
    doc.setFontSize(12);
    doc.setTextColor(200, 200, 200);
    doc.text("Vereda El Descanso, Villeta - Cundinamarca", 35, 32);
 
    doc.setFontSize(20);
    doc.setTextColor(46, 89, 57);
    doc.text("COMPROBANTE DE RESERVA", 105, 55, { align: "center" });
 
    doc.setDrawColor(103, 151, 80);
    doc.setLineWidth(1);
    doc.line(20, 60, 190, 60);
 
    let y = 70;

    // INFORMACIÓN PRINCIPAL EN DOS COLUMNAS
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(46, 89, 57);
    doc.text("INFORMACIÓN DE LA RESERVA", 20, y);
    y += 10;
 
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
 
    doc.text(`ID Reserva: #${reserva.idReserva}`, 20, y);
    doc.text(`Estado: ${getEstadoNombre(reserva.idEstado)}`, 20, y + 6);
    doc.text(`Usuario: ${getUsuarioNombre(reserva.idUsuario)}`, 20, y + 12);
    doc.text(`Cabaña: ${getCabinaNombre(reserva.idCabana)}`, 20, y + 18);
    doc.text(`Sede: ${getSedeNombre(reserva.idSede)}`, 20, y + 24);
 
    doc.text(`Fecha Entrada: ${formatDate(reserva.fechaEntrada)}`, 110, y);
    doc.text(`Fecha Salida: ${formatDate(reserva.fechaReserva)}`, 110, y + 6);
    doc.text(`Fecha Registro: ${formatDate(reserva.fechaRegistro)}`, 110, y + 12);
    doc.text(`Paquete: ${getPaqueteNombre(reserva.idPaquete)}`, 110, y + 18);
    doc.text(`Método de Pago: ${getMetodoPagoNombre(reserva.idMetodoPago)}`, 110, y + 24);
 
    y += 35;

    // DETALLES DE PAGO CON DISEÑO MEJORADO
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(46, 89, 57);
    doc.text("DETALLES DE PAGO", 20, y);
    y += 8;
 
    doc.setFillColor(247, 244, 234);
    doc.roundedRect(20, y, 170, 25, 3, 3, 'F');
 
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(46, 89, 57);
 
    doc.text("Monto Total:", 30, y + 8);
    doc.text("Abono (50%):", 30, y + 16);
    doc.text("Restante:", 30, y + 24);
 
    doc.setTextColor(0, 0, 0);
    doc.text(formatPrecio(reserva.montoTotal), 120, y + 8);
    doc.text(formatPrecio(reserva.abono), 120, y + 16);
    doc.text(formatPrecio(reserva.restante), 120, y + 24);
 
    y += 35;

    // SERVICIOS EXTRAS CON DISEÑO MEJORADO
    if (serviciosDetalle.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(46, 89, 57);
      doc.text("SERVICIOS EXTRAS ADICIONALES", 20, y);
      y += 8;
   
      const serviciosTable = serviciosDetalle.map(servicio => [
        servicio.nombre,
        formatPrecio(servicio.precio)
      ]);
   
      const totalServicios = serviciosDetalle.reduce((total, serv) => total + (serv.precio || 0), 0);
      serviciosTable.push(['TOTAL SERVICIOS', formatPrecio(totalServicios)]);
   
      doc.autoTable({
        startY: y,
        head: [['Servicio', 'Precio']],
        body: serviciosTable,
        theme: 'grid',
        headStyles: {
          fillColor: [46, 89, 57],
          textColor: 255,
          fontStyle: 'bold'
        },
        bodyStyles: {
          textColor: [0, 0, 0]
        },
        alternateRowStyles: {
          fillColor: [247, 244, 234]
        },
        styles: {
          fontSize: 10,
          cellPadding: 3
        },
        margin: { left: 20, right: 20 }
      });
   
      y = doc.lastAutoTable.finalY + 10;
    }

    // HISTORIAL DE ABONOS
    if (abonosReserva.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(46, 89, 57);
      doc.text("HISTORIAL DE ABONOS", 20, y);
      y += 8;
   
      const abonosTable = abonosReserva.map(abono => [
        formatDate(abono.fechaAbono),
        formatPrecio(abono.montoAbono),
        getMetodoPagoNombre(abono.idMetodoPago),
        abono.verificacion
      ]);
   
      const totalAbonado = abonosReserva.reduce((total, abono) => total + (abono.montoAbono || 0), 0);
      abonosTable.push(['TOTAL ABONADO', formatPrecio(totalAbonado), '', '']);
   
      doc.autoTable({
        startY: y,
        head: [['Fecha', 'Monto', 'Método', 'Verificación']],
        body: abonosTable,
        theme: 'grid',
        headStyles: {
          fillColor: [46, 89, 57],
          textColor: 255,
          fontStyle: 'bold'
        },
        bodyStyles: {
          textColor: [0, 0, 0]
        },
        alternateRowStyles: {
          fillColor: [247, 244, 234]
        },
        styles: {
          fontSize: 9,
          cellPadding: 3
        },
        margin: { left: 20, right: 20 }
      });
   
      y = doc.lastAutoTable.finalY + 10;
    }

    // PIE DE PÁGINA MEJORADO
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
 
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    y += 10;
 
    doc.text("Glamping Luxury - Experiencias Únicas en la Naturaleza", 105, y, { align: "center" });
    y += 5;
    doc.text("📍 Vereda El Descanso, Villeta, Cundinamarca", 105, y, { align: "center" });
    y += 5;
    doc.text("📞 Tel: 310 123 4567 | ✉ Email: info@glampingluxury.com", 105, y, { align: "center" });
    y += 5;
    doc.text("🌐 www.glampingluxury.com", 105, y, { align: "center" });
    y += 10;
 
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Este documento es un comprobante de reserva generado automáticamente.", 105, y, { align: "center" });
    y += 4;
    doc.text("Para consultas o modificaciones contacte con nuestro equipo de soporte.", 105, y, { align: "center" });
    y += 4;
    doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}`, 105, y, { align: "center" });

    doc.save(`Reserva_${reserva.idReserva}_GlampingLuxury.pdf`);
    displayAlert("PDF generado exitosamente.", "success");
  };

  // ===============================================
  // RENDERIZADO DEL FORMULARIO MEJORADO
  // ===============================================
  const renderFormularioReserva = () => (
    <div style={modalOverlayStyle(showForm)}>
      <div style={{...modalContentStyle, maxWidth: 800}}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, color: "#2E5939", textAlign: 'center' }}>
            {isEditing ? "Editar Reserva" : "Nueva Reserva"}
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
       
        <form onSubmit={handleAddReserva}>
          {/* Sección 1: Información Básica */}
          <div style={{
            backgroundColor: '#F7F4EA',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '20px',
            border: '1px solid #679750'
          }}>
            <h3 style={{ color: '#2E5939', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaInfoCircle /> Información de la Reserva
            </h3>
           
            {/* 1. Usuario (Cliente) */}
            <FormField
              label="Usuario (Cliente)"
              name="idUsuario"
              type="select"
              value={newReserva.idUsuario}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              error={formErrors.idUsuario}
              success={formSuccess.idUsuario}
              warning={formWarnings.idUsuario}
              options={usuarios.map(usuario => ({
                value: usuario.idUsuario.toString(),
                label: `${usuario.nombre} ${usuario.apellido || ''} - ${usuario.email || 'Sin email'}`
              }))}
              required={true}
              disabled={loading || usuarios.length === 0}
              placeholder="Selecciona un usuario"
              touched={touchedFields.idUsuario}
              icon={<FaUser />}
            />

            {/* 2. Estado */}
            <FormField
              label="Estado"
              name="idEstado"
              type="select"
              value={newReserva.idEstado}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              error={formErrors.idEstado}
              success={formSuccess.idEstado}
              warning={formWarnings.idEstado}
              options={estados.map(estado => ({
                value: estado.idEstado.toString(),
                label: estado.nombreEstado
              }))}
              required={true}
              disabled={loading || !isEditing}
              placeholder="Selecciona un estado"
              touched={touchedFields.idEstado}
            />
            <div style={{ fontSize: '12px', color: '#679750', marginTop: '-10px', marginBottom: '15px' }}>
              Nota: El estado predeterminado es "Pendiente" (ID 2)
            </div>

            {/* 3. Sede */}
            <FormField
              label="Sede"
              name="idSede"
              type="select"
              value={newReserva.idSede}
              onChange={handleSedeSelect}
              onBlur={handleInputBlur}
              error={formErrors.idSede}
              success={formSuccess.idSede}
              warning={formWarnings.idSede}
              options={sedes.map(sede => ({
                value: sede.idSede.toString(),
                label: sede.nombreSede
              }))}
              required={true}
              disabled={loading || sedes.length === 0}
              placeholder="Selecciona una sede"
              touched={touchedFields.idSede}
              icon={<FaMapMarkerAlt />}
            />

            {/* 4. Cabañas disponibles en la sede seleccionada */}
            <FormField
              label="Cabaña"
              name="idCabana"
              type="select"
              value={newReserva.idCabana}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              error={formErrors.idCabana}
              success={formSuccess.idCabana}
              warning={formWarnings.idCabana}
              options={(cabanasBySede.length > 0 ? cabanasBySede : []).map(cabina => ({
                value: cabina.idCabana.toString(),
                label: `${cabina.nombre} - ${formatPrecio(cabina.precio || 0)}`
              }))}
              required={true}
              disabled={loading || !newReserva.idSede || cabanasBySede.length === 0}
              placeholder={newReserva.idSede ? "Selecciona una cabaña" : "Primero selecciona una sede"}
              touched={touchedFields.idCabana}
              icon={<FaHome />}
            />
            {newReserva.idSede && cabanasBySede.length === 0 && (
              <div style={warningValidationStyle}>
                <FaInfoCircle size={12} />
                No hay cabañas disponibles para esta sede
              </div>
            )}

            {/* 5. Paquetes disponibles en la sede seleccionada (Opcional) */}
            <div style={{ marginBottom: '15px' }}>
              <label style={labelStyle}>
                <FaBox style={{ marginRight: '8px' }} />
                Paquete (Opcional)
              </label>
              <select
                name="idPaquete"
                value={newReserva.idPaquete}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                style={{
                  ...inputStyle,
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232E5939' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '16px'
                }}
                disabled={loading || !newReserva.idSede}
              >
                <option value="">Sin paquete - $0.00</option>
                {paquetesBySede.map(paquete => (
                  <option key={paquete.idPaquete} value={paquete.idPaquete.toString()}>
                    {paquete.nombrePaquete} - {formatPrecio(paquete.precioPaquete)}
                  </option>
                ))}
              </select>
              {!newReserva.idSede ? (
                <div style={warningValidationStyle}>
                  <FaInfoCircle size={12} />
                  Primero selecciona una sede para ver los paquetes disponibles
                </div>
              ) : paquetesBySede.length === 0 && (
                <div style={warningValidationStyle}>
                  <FaInfoCircle size={12} />
                  No hay paquetes disponibles para esta sede
                </div>
              )}
            </div>

            {/* 6. Servicios extras disponibles en la sede (Opcionales) */}
            <div style={{ marginTop: '15px' }}>
              <label style={labelStyle}>
                Servicios Extras (Opcionales)
              </label>
              <div style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: '#fff',
                maxHeight: '200px',
                overflowY: 'auto',
                opacity: newReserva.idSede ? 1 : 0.6
              }}>
                {!newReserva.idSede ? (
                  <div style={{ textAlign: 'center', color: '#666', padding: '20px', fontStyle: 'italic' }}>
                    Selecciona primero una sede para ver los servicios disponibles
                  </div>
                ) : serviciosBySede.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#666', padding: '20px', fontStyle: 'italic' }}>
                    No hay servicios disponibles para esta sede
                  </div>
                ) : (
                  serviciosBySede.map(servicio => (
                    <div key={servicio.idServicio} style={{
                      marginBottom: '10px',
                      padding: '8px',
                      borderRadius: '6px',
                      backgroundColor: newReserva.serviciosSeleccionados.includes(servicio.idServicio.toString()) ? '#E8F5E8' : 'transparent',
                      border: `1px solid ${newReserva.serviciosSeleccionados.includes(servicio.idServicio.toString()) ? '#679750' : '#eee'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => handleServicioChange(servicio.idServicio.toString())}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        width: '100%'
                      }}>
                        <input
                          type="checkbox"
                          checked={newReserva.serviciosSeleccionados.includes(servicio.idServicio.toString())}
                          onChange={() => handleServicioChange(servicio.idServicio.toString())}
                          style={{ margin: 0 }}
                          disabled={!newReserva.idSede}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ color: '#2E5939', fontWeight: '600', fontSize: '14px' }}>
                            {servicio.nombreServicio}
                          </div>
                          <div style={{
                            color: '#679750',
                            fontSize: '13px',
                            marginTop: '2px'
                          }}>
                            {formatPrecio(servicio.precioServicio)}
                          </div>
                          {servicio.descripcion && (
                            <div style={{
                              color: '#666',
                              fontSize: '12px',
                              marginTop: '4px',
                              fontStyle: 'italic'
                            }}>
                              {servicio.descripcion}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {newReserva.serviciosSeleccionados.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <div style={successValidationStyle}>
                    <FaCheck size={12} />
                    {newReserva.serviciosSeleccionados.length} servicio(s) seleccionado(s)
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sección 2: Fechas */}
          <div style={{
            backgroundColor: '#F7F4EA',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '20px',
            border: '1px solid #679750'
          }}>
            <h3 style={{ color: '#2E5939', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaCalendarAlt /> Fechas de la Reserva
            </h3>
           
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px 20px' }}>
              {/* 7. Fecha de Entrada */}
              <FormField
                label="Fecha de Entrada"
                name="fechaEntrada"
                type="date"
                value={newReserva.fechaEntrada}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                error={formErrors.fechaEntrada}
                success={formSuccess.fechaEntrada}
                warning={formWarnings.fechaEntrada}
                required={true}
                disabled={loading}
                touched={touchedFields.fechaEntrada}
                icon={<FaCalendarAlt />}
              />

              {/* 8. Fecha de Salida */}
              <FormField
                label="Fecha de Salida"
                name="fechaReserva"
                type="date"
                value={newReserva.fechaReserva}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                error={formErrors.fechaReserva}
                success={formSuccess.fechaReserva}
                warning={formWarnings.fechaReserva}
                required={true}
                disabled={loading}
                touched={touchedFields.fechaReserva}
                icon={<FaCalendarAlt />}
              />
            </div>

            {/* 9. Fecha de Registro (Automática) */}
            <div style={{ marginTop: '15px' }}>
              <FormField
                label="Fecha de Registro"
                name="fechaRegistro"
                type="date"
                value={newReserva.fechaRegistro}
                onChange={handleInputChange}
                required={true}
                disabled={true}
                touched={touchedFields.fechaRegistro}
              />
              <div style={{ fontSize: '12px', color: '#679750', marginTop: '4px' }}>
                Esta fecha se establece automáticamente al día de hoy y no se puede modificar
              </div>
            </div>
          </div>

          {/* Sección 3: Información de Pago */}
          <div style={{
            backgroundColor: '#F7F4EA',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '20px',
            border: '1px solid #679750'
          }}>
            <h3 style={{ color: '#2E5939', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaCreditCard /> Información de Pago
            </h3>
           
            {/* 10. Método de Pago */}
            <div style={{ marginBottom: '15px' }}>
              <FormField
                label="Método de Pago"
                name="idMetodoPago"
                type="select"
                value={newReserva.idMetodoPago}
                onChange={handleInputChange}
                options={metodosPago.map(metodo => ({
                  value: metodo.idMetodoPago.toString(),
                  label: metodo.nombreMetodoPago
                }))}
                required={true}
                disabled={true}
                placeholder="Método de pago"
                icon={<FaCreditCard />}
              />
              <div style={{ fontSize: '12px', color: '#679750', marginTop: '4px' }}>
                Actualmente solo disponible: Transferencia
              </div>
            </div>

            {/* Botón para calcular montos */}
            <div style={{ marginBottom: '15px' }}>
              <button
                type="button"
                onClick={calcularMontos}
                disabled={loading || !newReserva.idCabana}
                style={{
                  backgroundColor: !newReserva.idCabana ? "#ccc" : "#679750",
                  color: "white",
                  padding: "12px 20px",
                  border: "none",
                  borderRadius: 8,
                  cursor: loading || !newReserva.idCabana ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  width: '100%',
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                  transition: "all 0.3s ease",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  if (!loading && newReserva.idCabana) {
                    e.target.style.backgroundColor = "#2E5939";
                    e.target.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading && newReserva.idCabana) {
                    e.target.style.backgroundColor = "#679750";
                    e.target.style.transform = "translateY(0)";
                  }
                }}
              >
                <FaSync /> Calcular Montos
              </button>
              <div style={{ fontSize: '12px', color: '#679750', marginTop: '4px', textAlign: 'center' }}>
                Haz clic para calcular el total basado en la cabaña, paquete y servicios seleccionados
              </div>
            </div>

            {/* Campos de montos calculados */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px 20px' }}>
              {/* 11. Monto Total */}
              <FormField
                label="Monto Total"
                name="montoTotal"
                type="number"
                value={newReserva.montoTotal}
                onChange={handleInputChange}
                required={true}
                disabled={true}
                icon={<FaMoneyBillAlt />}
              />

              {/* 12. Abono (50%) */}
              <FormField
                label="Abono (50%)"
                name="abono"
                type="number"
                value={newReserva.abono}
                onChange={handleInputChange}
                required={true}
                disabled={true}
                icon={<FaMoneyBillAlt />}
              />

              {/* 13. Restante */}
              <FormField
                label="Restante"
                name="restante"
                type="number"
                value={newReserva.restante}
                onChange={handleInputChange}
                required={true}
                disabled={true}
                icon={<FaMoneyBillAlt />}
              />
            </div>

            {/* Resumen de precios detallado */}
            {(newReserva.idCabana || newReserva.idPaquete || newReserva.serviciosSeleccionados.length > 0) && (
              <div style={{
                marginTop: '15px',
                padding: '15px',
                backgroundColor: '#E8F5E8',
                borderRadius: '8px',
                border: '1px solid #679750'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#2E5939', fontSize: '14px' }}>Desglose de Precios:</h4>
                <div style={{ fontSize: '13px', color: '#2E5939' }}>
                  {newReserva.idCabana && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span>Cabaña:</span>
                      <span>{formatPrecio(cabinas.find(c => c.idCabana === parseInt(newReserva.idCabana))?.precio || 0)}</span>
                    </div>
                  )}
                  {newReserva.idPaquete && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span>Paquete:</span>
                      <span>{formatPrecio(paquetes.find(p => p.idPaquete === parseInt(newReserva.idPaquete))?.precioPaquete || 0)}</span>
                    </div>
                  )}
                  {newReserva.serviciosSeleccionados.map(servicioId => {
                    const servicio = servicios.find(s => s.idServicio === parseInt(servicioId));
                    return servicio ? (
                      <div key={servicioId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span>{servicio.nombreServicio}:</span>
                        <span>{formatPrecio(servicio.precioServicio)}</span>
                      </div>
                    ) : null;
                  })}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #679750', fontWeight: 'bold' }}>
                    <span>Total:</span>
                    <span>{formatPrecio(newReserva.montoTotal)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botones de acción */}
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
               (isEditing ? "Actualizar Reserva" : "Crear Reserva")}
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
  );

  // ===============================================
  // RENDERIZADO PRINCIPAL
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
              onClick={fetchReservas}
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
          <h2 style={{ margin: 0, color: "#2E5939" }}>Gestión de Reservas</h2>
          <p style={{ margin: "5px 0 0 0", color: "#679750", fontSize: "14px" }}>
            {reservas.length} reservas registradas • {estadisticas.pendientes} pendientes
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={() => {
              setShowForm(true);
              setIsEditing(false);
              inicializarNuevaReserva();
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
            <FaPlus /> Nueva Reserva
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      {!loading && reservas.length > 0 && (
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
              {estadisticas.total}
            </div>
            <div style={{ fontSize: '16px', color: '#679750', fontWeight: '600' }}>
              Total Reservas
            </div>
          </div>
         
          <div style={{
            backgroundColor: '#E8F5E8',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '2px solid #ff9800',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease'
          }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2E5939', marginBottom: '8px' }}>
              {estadisticas.pendientes}
            </div>
            <div style={{ fontSize: '16px', color: '#ff9800', fontWeight: '600' }}>
              Pendientes
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
              {estadisticas.abonadas}
            </div>
            <div style={{ fontSize: '16px', color: '#4caf50', fontWeight: '600' }}>
              Abonadas
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
              {formatPrecio(estadisticas.totalIngresos)}
            </div>
            <div style={{ fontSize: '16px', color: '#2196f3', fontWeight: '600' }}>
              Ingresos Totales
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
              placeholder="Buscar por usuario, cabaña, sede, estado o ID..."
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

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
                marginLeft: "50px"
              }}
            >
              <FaSlidersH />
              Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                style={{
                  backgroundColor: "transparent",
                  color: "#e57373",
                  padding: "10px 15px",
                  border: "1px solid #e57373",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: '14px',
                }}
              >
                Limpiar Filtros
              </button>
            )}
          </div>
        </div>

        {showFilters && (
          <div style={{
            padding: '15px',
            backgroundColor: '#FBFDF9',
            borderRadius: '8px',
            border: '1px solid rgba(103,151,80,0.2)',
            animation: 'slideDown 0.3s ease-out',
            marginTop: '15px'
          }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#2E5939', fontSize: '16px' }}>
              Filtros Avanzados
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px'
            }}>
              <div>
                <label style={labelStyle}>Sede</label>
                <select
                  name="sede"
                  value={filters.sede}
                  onChange={handleFilterChange}
                  style={{
                    ...inputStyle,
                    width: '100%'
                  }}
                >
                  <option value="">Todas las sedes</option>
                  {sedes.map(sede => (
                    <option key={sede.idSede} value={sede.idSede}>
                      {sede.nombreSede}
                    </option>
                  ))}
                </select>
              </div>

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
                  <option value="">Todos los estados</option>
                  {estados.map(estado => (
                    <option key={estado.idEstado} value={estado.idEstado}>
                      {estado.nombreEstado}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Fecha Desde</label>
                <input
                  type="date"
                  name="fechaDesde"
                  value={filters.fechaDesde}
                  onChange={handleFilterChange}
                  style={{
                    ...inputStyle,
                    width: '100%'
                  }}
                />
              </div>

              <div>
                <label style={labelStyle}>Fecha Hasta</label>
                <input
                  type="date"
                  name="fechaHasta"
                  value={filters.fechaHasta}
                  onChange={handleFilterChange}
                  style={{
                    ...inputStyle,
                    width: '100%'
                  }}
                />
              </div>

              <div>
                <label style={labelStyle}>Monto Mínimo</label>
                <div style={{ position: 'relative' }}>
                  <FaDollarSign style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#2E5939",
                    fontSize: '14px'
                  }} />
                  <input
                    type="number"
                    name="montoMin"
                    placeholder="0.00"
                    value={filters.montoMin}
                    onChange={handleFilterChange}
                    style={{
                      ...inputStyle,
                      paddingLeft: '30px'
                    }}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Monto Máximo</label>
                <div style={{ position: 'relative' }}>
                  <FaDollarSign style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#2E5939",
                    fontSize: '14px'
                  }} />
                  <input
                    type="number"
                    name="montoMax"
                    placeholder="100000.00"
                    value={filters.montoMax}
                    onChange={handleFilterChange}
                    style={{
                      ...inputStyle,
                      paddingLeft: '30px'
                    }}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {filteredReservas.length !== reservas.length && (
          <div style={{
            marginTop: '10px',
            padding: '8px 12px',
            backgroundColor: '#E8F5E8',
            borderRadius: '6px',
            color: '#2E5939',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Mostrando {filteredReservas.length} de {reservas.length} reservas
            {activeFiltersCount > 0 && ` (filtros aplicados: ${activeFiltersCount})`}
          </div>
        )}
      </div>

      {/* Formulario de agregar/editar */}
      {renderFormularioReserva()}

      {/* Modal de detalles */}
      {showDetails && currentReserva && (
        <div style={modalOverlayStyle(showDetails)}>
          <div style={detailsModalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939", textAlign: 'center' }}>Detalles de la Reserva #{currentReserva.idReserva}</h2>
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
                <div style={detailLabelStyle}>ID Reserva</div>
                <div style={detailValueStyle}>#{currentReserva.idReserva}</div>
              </div>
             
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Usuario</div>
                <div style={detailValueStyle}>{getUsuarioNombre(currentReserva.idUsuario)}</div>
              </div>
             
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Cabaña</div>
                <div style={detailValueStyle}>{getCabinaNombre(currentReserva.idCabana)}</div>
              </div>
             
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Sede</div>
                <div style={detailValueStyle}>{getSedeNombre(currentReserva.idSede)}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Fechas</div>
                <div style={detailValueStyle}>
                  <div><strong>Entrada:</strong> {formatDate(currentReserva.fechaEntrada)}</div>
                  <div><strong>Salida:</strong> {formatDate(currentReserva.fechaReserva)}</div>
                  <div><strong>Registro:</strong> {formatDate(currentReserva.fechaRegistro)}</div>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Información de Pago</div>
                <div style={detailValueStyle}>
                  <div><strong>Monto Total:</strong> {formatPrecio(currentReserva.montoTotal)}</div>
                  <div><strong>Abono:</strong> {formatPrecio(currentReserva.abono)}</div>
                  <div><strong>Restante:</strong> {formatPrecio(currentReserva.restante)}</div>
                  <div><strong>Método de Pago:</strong> {getMetodoPagoNombre(currentReserva.idMetodoPago)}</div>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Detalles Adicionales</div>
                <div style={detailValueStyle}>
                  <div><strong>Paquete:</strong> {getPaqueteNombre(currentReserva.idPaquete)}</div>
                  <div><strong>Estado:</strong>
                    <span style={{
                      color: getEstadoColor(currentReserva.idEstado),
                      fontWeight: 'bold',
                      marginLeft: '8px',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(46, 89, 57, 0.1)',
                      fontSize: '14px'
                    }}>
                      {getEstadoNombre(currentReserva.idEstado)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Servicios Extras */}
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Servicios Extras</div>
                <div style={detailValueStyle}>
                  {currentReserva.serviciosSeleccionados && currentReserva.serviciosSeleccionados.length > 0 ? (
                    <div>
                      {currentReserva.serviciosSeleccionados.map((servicioId, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px',
                          backgroundColor: '#f0f8ff',
                          borderRadius: '8px',
                          border: '1px solid rgba(0, 123, 255, 0.1)',
                          marginBottom: '8px'
                        }}>
                          <div>
                            <div style={{ fontWeight: '500' }}>{getServicioNombre(servicioId)}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              Precio: {formatPrecio(servicios.find(s => s.idServicio === servicioId)?.precioServicio || 0)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: '#999', fontStyle: 'italic' }}>No se seleccionaron servicios extras</span>
                  )}
                </div>
              </div>

              {/* Historial de Abonos */}
              {currentReserva.abonos && currentReserva.abonos.length > 0 && (
                <div style={detailItemStyle}>
                  <div style={detailLabelStyle}>Historial de Abonos</div>
                  <div style={detailValueStyle}>
                    <div style={{
                      display: 'grid',
                      gap: '8px'
                    }}>
                      {currentReserva.abonos.map((abono, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px',
                          backgroundColor: '#f0f8ff',
                          borderRadius: '8px',
                          border: '1px solid rgba(0, 123, 255, 0.1)'
                        }}>
                          <div>
                            <div style={{ fontWeight: '500' }}>{formatDate(abono.fechaAbono)}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              {getMetodoPagoNombre(abono.idMetodoPago)} - {abono.verificacion}
                            </div>
                          </div>
                          <span style={{
                            color: '#007bff',
                            fontWeight: 'bold',
                            fontSize: '14px'
                          }}>
                            {formatPrecio(abono.montoAbono)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#E8F5E8',
                      borderRadius: '8px',
                      border: '1px solid #679750',
                      textAlign: 'center',
                      marginTop: '12px'
                    }}>
                      <strong style={{ color: '#2E5939', fontSize: '15px' }}>
                        Total abonado: {formatPrecio(
                          currentReserva.abonos.reduce((total, abono) => total + (abono.montoAbono || 0), 0)
                        )}
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 20 }}>
              <button
                onClick={() => handleDownloadPDF(currentReserva)}
                style={{
                  backgroundColor: "#e57373",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontWeight: "600",
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#d32f2f";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#e57373";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                <FaFilePdf /> Descargar PDF
              </button>
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
      {showDeleteConfirm && reservaToDelete && (
        <div style={modalOverlayStyle(showDeleteConfirm)}>
          <div style={{ ...modalContentStyle, maxWidth: 450, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 20, color: "#2E5939" }}>Confirmar Eliminación</h3>
            <p style={{ marginBottom: 30, fontSize: '1.1rem', color: "#2E5939" }}>
              ¿Estás seguro de eliminar la reserva del usuario "<strong>{getUsuarioNombre(reservaToDelete.idUsuario)}</strong>"?
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
                <strong style={{ color: '#856404' }}>Importante</strong>
              </div>
              <p style={{ color: '#856404', margin: 0, fontSize: '0.9rem' }}>
                Esta acción eliminará permanentemente la reserva y todos los datos asociados (servicios, abonos, ventas).
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

      {/* Modal de Abonos */}
      {renderAbonosModal()}

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
              🔄 Cargando reservas...
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
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Usuario</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Cabaña</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Sede</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Fechas</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Monto</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Estado</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReservas.length === 0 && !loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <FaInfoCircle size={30} color="#679750" />
                      {reservas.length === 0 ? "No hay reservas registradas" : "No se encontraron resultados"}
                      {reservas.length === 0 && (
                        <button
                          onClick={() => {
                            setShowForm(true);
                            setIsEditing(false);
                            inicializarNuevaReserva();
                          }}
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
                          Crear Primera Reserva
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedReservas.map((reserva) => (
                  <tr key={reserva.idReserva} style={{
                    borderBottom: "1px solid #eee",
                  }}>
                    <td style={{ padding: "15px", fontWeight: "500" }}>
                      {getUsuarioNombre(reserva.idUsuario)}
                    </td>
                    <td style={{ padding: "15px" }}>{getCabinaNombre(reserva.idCabana)}</td>
                    <td style={{ padding: "15px" }}>{getSedeNombre(reserva.idSede)}</td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ fontSize: "14px", fontWeight: "500" }}>
                          {formatDate(reserva.fechaEntrada)}
                        </div>
                        <div style={{ fontSize: "12px", color: "#679750" }}>
                          Salida: {formatDate(reserva.fechaReserva)}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center", fontWeight: "600", color: "#2E5939" }}>
                      {formatPrecio(reserva.montoTotal)}
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <span style={{
                        color: getEstadoColor(reserva.idEstado),
                        fontWeight: 'bold',
                        display: 'inline-block',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        backgroundColor: 'rgba(46, 89, 57, 0.1)',
                        fontSize: "12px"
                      }}>
                        {getEstadoNombre(reserva.idEstado)}
                      </span>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                        <button
                          onClick={() => handleView(reserva)}
                          style={btnAccion("#F7F4EA", "#2E5939")}
                          title="Ver Detalles"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleViewAbonos(reserva)}
                          style={btnAccion("#F7F4EA", "#4caf50")}
                          title="Ver Abonos"
                        >
                          <FaMoneyBillWave />
                        </button>
                        <button
                          onClick={() => handleEdit(reserva)}
                          style={btnAccion("#F7F4EA", "#2E5939")}
                          title="Editar Reserva"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(reserva)}
                          style={btnAccion("#fce4ec", "#c2185b")}
                          title="Descargar PDF"
                        >
                          <FaFilePdf />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(reserva)}
                          style={btnAccion("#fbe9e7", "#e57373")}
                          title="Eliminar Reserva"
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

export default GestionReserva;