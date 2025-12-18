// src/components/Gestiservi.jsx
import { FaEye, FaEdit, FaTrash, FaTimes, FaExclamationTriangle, FaPlus, FaCheck, FaInfoCircle, FaSearch, FaImage, FaUpload, FaCamera, FaDollarSign, FaSlidersH, FaBox, FaBuilding, FaGift, FaClipboardList, FaMapMarkerAlt } from "react-icons/fa";
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { useCloudinary } from '../../../hooks/useCloudinary';

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

const imagePreviewContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
  gap: '10px',
  marginTop: '15px'
};

const imagePreviewStyle = {
  position: 'relative',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
};

const imageStyle = {
  width: '100%',
  height: '100px',
  objectFit: 'cover',
  display: 'block'
};

const imageRemoveButtonStyle = {
  position: 'absolute',
  top: '5px',
  right: '5px',
  background: 'rgba(229, 115, 115, 0.9)',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: '24px',
  height: '24px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px'
};

const imageGalleryStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gap: '15px',
  marginTop: '15px'
};

const galleryImageStyle = {
  width: '100%',
  height: '120px',
  objectFit: 'cover',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
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
// VALIDACIONES Y PATRONES
// ===============================================
const VALIDATION_PATTERNS = {
  nombreServicio: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-&]+$/,
  descripcion: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-_.,!?@#$%&*()+=:;"'{}[\]<>/\\|~`^]+$/,
};

const VALIDATION_RULES = {
  nombreServicio: {
    minLength: 2,
    maxLength: 100,
    required: true,
    pattern: VALIDATION_PATTERNS.nombreServicio,
    errorMessages: {
      required: "El nombre del servicio es obligatorio.",
      minLength: "El nombre debe tener al menos 2 caracteres.",
      maxLength: "El nombre no puede exceder los 100 caracteres.",
      pattern: "El nombre contiene caracteres no permitidos. Solo se permiten letras, espacios, guiones y el símbolo &."
    }
  },
  descripcion: {
    minLength: 10,
    maxLength: 500,
    required: false,
    pattern: VALIDATION_PATTERNS.descripcion,
    errorMessages: {
      minLength: "La descripción debe tener al menos 10 caracteres.",
      maxLength: "La descripción no puede exceder los 500 caracteres.",
      pattern: "La descripción contiene caracteres no válidos."
    }
  },
  precioServicio: {
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
const API_SERVICIOS = "https://www.bosquesagrado.somee.com/api/Servicio";
const API_PRODUCTOS_POR_SERVICIO = "https://www.bosquesagrado.somee.com/api/ProductoPorServicio";
const API_SEDES_POR_SERVICIO = "https://www.bosquesagrado.somee.com/api/SedesPorServicio";
const API_SERVICIOS_POR_PAQUETE = "https://www.bosquesagrado.somee.com/api/ServicioPorPaquete";
const API_SERVICIOS_RESERVA = "https://www.bosquesagrado.somee.com/api/ServiciosReserva";
const API_PRODUCTOS = "https://www.bosquesagrado.somee.com/api/Productos";
const API_SEDES = "https://www.bosquesagrado.somee.com/api/Sede";
const API_PAQUETES = "https://www.bosquesagrado.somee.com/api/Paquetes";
const API_RESERVAS = "https://www.bosquesagrado.somee.com/api/Reservas";
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
  icon,
  textarea = false,
  rows = 4
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

    if (name === 'nombreServicio') {
      filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-&]/g, "");
    } else if (name === 'descripcion') {
      if (value === "" || VALIDATION_PATTERNS.descripcion.test(value)) {
        filteredValue = value;
      } else {
        return;
      }
    } else if (name === 'precioServicio') {
      filteredValue = value.replace(/[^0-9.]/g, "");
      const parts = filteredValue.split('.');
      if (parts.length > 2) {
        filteredValue = parts[0] + '.' + parts.slice(1).join('');
      }
      if (parts.length === 2 && parts[1].length > 2) {
        filteredValue = parts[0] + '.' + parts[1].substring(0, 2);
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
        {required && <span style={{ color: "red" }}></span>}
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
      ) : textarea ? (
        <div>
          <textarea
            name={name}
            value={value}
            onChange={handleFilteredInputChange}
            onBlur={onBlur}
            style={{
              ...getInputStyle(),
              minHeight: `${rows * 20}px`,
              resize: 'vertical',
              fontFamily: 'inherit',
              paddingLeft: '12px'
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
// COMPONENTE PARA SELECTOR MÚLTIPLE DE SEDES
// ===============================================
const SelectorSedes = ({ 
  titulo, 
  sedes, 
  sedesSeleccionadas, 
  onToggleSede, 
  icon,
  tipo = "multiple"
}) => {
  const isSelected = (sede) => {
    return sedesSeleccionadas.some(sel => sel && sede && sel.idSede === sede.idSede);
  };

  const handleSedeClick = (sede) => {
    if (tipo === "single") {
      // Para selección única, reemplazar cualquier selección existente
      if (isSelected(sede)) {
        // Si ya está seleccionado, deseleccionarlo
        onToggleSede(sede, { action: "deselect" });
      } else {
        // Seleccionar solo este (reemplaza cualquier otro)
        onToggleSede(sede, { action: "selectSingle" });
      }
    } else {
      // Para selección múltiple, toggle normal
      if (isSelected(sede)) {
        onToggleSede(sede, { action: "deselect" });
      } else {
        onToggleSede(sede, { action: "select" });
      }
    }
  };

  return (
    <div style={selectorMultipleStyle}>
      <label style={labelStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon}
          {titulo}
          <span style={{ color: '#679750', fontSize: '0.8rem', marginLeft: '8px' }}>
            ({tipo === "single" ? "Selecciona solo una sede" : "Selecciona una o varias sedes"})
          </span>
        </div>
      </label>
      
      <div style={selectorListStyle}>
        {sedes.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#679750', padding: '10px' }}>
            No hay sedes disponibles
          </div>
        ) : (
          sedes.map(sede => {
            const selected = isSelected(sede);
            return (
              <div 
                key={sede.idSede}
                style={selected ? selectorItemSelectedStyle : selectorItemStyle}
                onClick={() => handleSedeClick(sede)}
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
                  readOnly
                  style={{ cursor: 'pointer' }}
                  name={tipo === "single" ? "sede-unica" : undefined}
                />
                <span style={{ flex: 1 }}>
                  {sede.nombreSede || sede.nombre || `Sede ${sede.idSede}`}
                  {sede.ubicacionSede && (
                    <span style={{ color: '#679750', fontSize: '0.8rem', marginLeft: '8px' }}>
                      ({sede.ubicacionSede})
                    </span>
                  )}
                </span>
                {sede.estado !== undefined && (
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    backgroundColor: sede.estado ? '#4caf50' : '#e57373',
                    color: 'white'
                  }}>
                    {sede.estado ? 'Activa' : 'Inactiva'}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
      
      {sedesSeleccionadas.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ fontSize: '0.8rem', color: '#2E5939', marginBottom: '5px' }}>
            {tipo === "single" ? 'Sede seleccionada:' : 'Sedes seleccionadas:'} {sedesSeleccionadas.length}
          </div>
          {tipo === "multiple" && (
            <div style={{ fontSize: '0.7rem', color: '#679750' }}>
              {sedesSeleccionadas.map(sede => sede.nombreSede || sede.nombre || `Sede ${sede.idSede}`).join(', ')}
            </div>
          )}
          {tipo === "single" && sedesSeleccionadas.length > 0 && (
            <div style={{ fontSize: '0.7rem', color: '#679750' }}>
              {sedesSeleccionadas[0].nombreSede || sedesSeleccionadas[0].nombre || `Sede ${sedesSeleccionadas[0].idSede}`}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ===============================================
// COMPONENTE PRINCIPAL Gestiservi MEJORADO CON ASOCIACIÓN DE SEDES
// ===============================================
const Gestiservi = () => {
  const [servicios, setServicios] = useState([]);
  const [productosPorServicio, setProductosPorServicio] = useState([]);
  const [sedesPorServicio, setSedesPorServicio] = useState([]);
  const [serviciosPorPaquete, setServiciosPorPaquete] = useState([]);
  const [serviciosReserva, setServiciosReserva] = useState([]);
  const [productos, setProductos] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedServicio, setSelectedServicio] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [servicioToDelete, setServicioToDelete] = useState(null);
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
  const [uploadingImage, setUploadingImage] = useState(false);

  // Estados para selección de sedes - NUEVO
  const [sedesSeleccionadas, setSedesSeleccionadas] = useState([]);

  // Estados para filtros
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    estado: "all",
    precioMin: "",
    precioMax: "",
    relacionesMin: "",
    relacionesMax: ""
  });

  // Hook de Cloudinary
  const { uploadImage, uploading: cloudinaryUploading, deleteImage: deleteCloudinaryImage } = useCloudinary();

  // Estado para manejar la imagen del servicio
  const [imagenServicio, setImagenServicio] = useState({
    file: null,
    preview: null,
    isNew: false,
    publicId: null,
    isCloudinary: false
  });

  // Estado inicial basado en la estructura de tu API
  const [newServicio, setNewServicio] = useState({
    idServicio: 0,
    nombreServicio: "",
    precioServicio: "",
    imagen: "",
    descripcion: "",
    estado: true
  });

  // ===============================================
  // EFECTOS
  // ===============================================
  useEffect(() => {
    fetchAllData();
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
          validateField(fieldName, newServicio[fieldName]);
        }
      });
    }
  }, [newServicio, showForm, touchedFields]);

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
    else if (trimmedValue && fieldName === 'precioServicio') {
      const numericValue = parseFloat(trimmedValue);
      
      if (isNaN(numericValue)) {
        error = rules.errorMessages.invalid;
      } else if (rules.min !== undefined && numericValue < rules.min) {
        error = rules.errorMessages.min;
      } else if (rules.max !== undefined && numericValue > rules.max) {
        error = rules.errorMessages.max;
      } else {
        success = "Precio válido.";
        
        // Advertencias específicas
        if (numericValue > 1000000) {
          warning = "El precio es bastante alto. Verifique que sea correcto.";
        }
      }
    }
    else if (fieldName === 'estado') {
      success = value ? "Servicio activo" : "Servicio inactivo";
    }
    else if (trimmedValue) {
      success = `${fieldName === 'nombreServicio' ? 'Nombre' : fieldName === 'descripcion' ? 'Descripción' : 'Campo'} válido.`;
      
      if (fieldName === 'nombreServicio' && trimmedValue.length > 50) {
        warning = "El nombre es bastante largo. Considere un nombre más corto si es posible.";
      } else if (fieldName === 'descripcion' && trimmedValue.length > 300) {
        warning = "La descripción es muy larga. Considere ser más conciso.";
      } else if (fieldName === 'descripcion' && trimmedValue.length < 20 && trimmedValue.length > 0) {
        warning = "La descripción es muy breve. Sea más descriptivo.";
      }
    }

    // Verificación de duplicados para nombre
    if (fieldName === 'nombreServicio' && trimmedValue && !error) {
      const duplicate = servicios.find(servicio => 
        servicio.nombreServicio.toLowerCase() === trimmedValue.toLowerCase() && 
        (!isEditing || servicio.idServicio !== newServicio.idServicio)
      );
      if (duplicate) {
        error = "Ya existe un servicio con este nombre.";
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
      nombreServicio: true,
      precioServicio: true,
      estado: true,
      descripcion: true
    };
    setTouchedFields(allFieldsTouched);

    const nombreValid = validateField('nombreServicio', newServicio.nombreServicio);
    const precioValid = validateField('precioServicio', newServicio.precioServicio);
    const estadoValid = validateField('estado', newServicio.estado);

    // La descripción es opcional según la API
    const descripcionValid = !newServicio.descripcion || validateField('descripcion', newServicio.descripcion);

    const isValid = nombreValid && precioValid && estadoValid && descripcionValid;
    
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
  // FUNCIONES PARA MANEJO DE SEDES - NUEVAS
  // ===============================================
  const toggleSede = (sede, opts = { action: "toggle" }) => {
    const { action } = opts;
    
    setSedesSeleccionadas(prev => {
      if (action === "selectSingle") {
        return [sede];
      } else if (action === "deselect") {
        return prev.filter(s => s.idSede !== sede.idSede);
      } else if (action === "select") {
        // Para selección múltiple, agregar si no existe
        const exists = prev.some(s => s.idSede === sede.idSede);
        if (exists) return prev;
        return [...prev, sede];
      } else { // toggle por defecto
        const exists = prev.some(s => s.idSede === sede.idSede);
        if (exists) return prev.filter(s => s.idSede !== sede.idSede);
        return [...prev, sede];
      }
    });
  };

  // Función para guardar relaciones con sedes - NUEVA
  const guardarRelacionesSedes = async (idServicio) => {
    try {
      // Eliminar relaciones existentes si estamos editando
      if (isEditing) {
        const relacionesExistentes = sedesPorServicio.filter(sp => sp.idServicio === parseInt(idServicio));
        for (const relacion of relacionesExistentes) {
          await axios.delete(`${API_SEDES_POR_SERVICIO}/${relacion.idSedesServicio}`);
        }
      }

      // Crear nuevas relaciones
      for (const sede of sedesSeleccionadas) {
        await axios.post(API_SEDES_POR_SERVICIO, {
          idSedesServicio: 0,
          idServicio: parseInt(idServicio),
          idSede: sede.idSede
        });
      }
    } catch (error) {
      console.error("❌ Error al guardar relaciones sedes-servicio:", error);
      throw error;
    }
  };

  // ===============================================
  // FUNCIONES PARA MANEJO DE IMÁGENES CON CLOUDINARY
  // ===============================================
  const handleImageUpload = async (e) => {
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

    setUploadingImage(true);

    try {
      // Subir imagen a Cloudinary
      const uploadResult = await uploadImage(file);
      
      if (uploadResult.success) {
        // Crear objeto de imagen para previsualización
        const nuevaImagen = {
          file,
          preview: uploadResult.url,
          isNew: true,
          publicId: uploadResult.publicId,
          isCloudinary: true
        };

        setImagenServicio(nuevaImagen);
        
        // Actualizar el campo de imagen en el formulario con la URL de Cloudinary
        setNewServicio(prev => ({
          ...prev,
          imagen: uploadResult.url
        }));

        displayAlert("Imagen subida exitosamente", "success");
      } else {
        displayAlert("Error al subir la imagen. Inténtalo de nuevo.", "error");
      }
    } catch (error) {
      console.error("Error en la subida de imagen:", error);
      displayAlert("Error al subir la imagen", "error");
    } finally {
      setUploadingImage(false);
      e.target.value = ''; // Reset input
    }
  };

  const removeImage = async () => {
    // Si la imagen es nueva y de Cloudinary, eliminarla de Cloudinary
    if (imagenServicio.isNew && imagenServicio.isCloudinary && imagenServicio.publicId) {
      try {
        await deleteCloudinaryImage(imagenServicio.publicId);
      } catch (error) {
        console.error("Error al eliminar imagen de Cloudinary:", error);
      }
    }

    setImagenServicio({
      file: null,
      preview: null,
      isNew: false,
      publicId: null,
      isCloudinary: false
    });

    setNewServicio(prev => ({
      ...prev,
      imagen: ""
    }));
  };

  // ===============================================
  // FUNCIONES DE FILTRADO MEJORADAS
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
      precioMin: "",
      precioMax: "",
      relacionesMin: "",
      relacionesMax: ""
    });
    setCurrentPage(1);
  };

  // Contador de filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.estado !== "all") count++;
    if (filters.precioMin) count++;
    if (filters.precioMax) count++;
    if (filters.relacionesMin) count++;
    if (filters.relacionesMax) count++;
    return count;
  }, [filters]);

  // ===============================================
  // FUNCIONES DE LA API CON MANEJO MEJORADO DE ERRORES
  // ===============================================
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchServicios(),
        fetchProductosPorServicio(),
        fetchSedesPorServicio(),
        fetchServiciosPorPaquete(),
        fetchServiciosReserva(),
        fetchProductos(),
        fetchSedes(),
        fetchPaquetes(),
        fetchReservas()
      ]);
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
      handleApiError(error, "cargar los datos");
    } finally {
      setLoading(false);
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
        throw new Error("Formato de datos inválido");
      }
    } catch (error) {
      console.error("❌ Error al obtener servicios:", error);
      throw error;
    }
  };

  const fetchProductosPorServicio = async () => {
    try {
      const res = await axios.get(API_PRODUCTOS_POR_SERVICIO, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (Array.isArray(res.data)) {
        setProductosPorServicio(res.data);
      }
    } catch (error) {
      console.error("❌ Error al obtener productos por servicio:", error);
    }
  };

  const fetchSedesPorServicio = async () => {
    try {
      const res = await axios.get(API_SEDES_POR_SERVICIO, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (Array.isArray(res.data)) {
        setSedesPorServicio(res.data);
      }
    } catch (error) {
      console.error("❌ Error al obtener sedes por servicio:", error);
    }
  };

  const fetchServiciosPorPaquete = async () => {
    try {
      const res = await axios.get(API_SERVICIOS_POR_PAQUETE, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (Array.isArray(res.data)) {
        setServiciosPorPaquete(res.data);
      }
    } catch (error) {
      console.error("❌ Error al obtener servicios por paquete:", error);
    }
  };

  const fetchServiciosReserva = async () => {
    try {
      const res = await axios.get(API_SERVICIOS_RESERVA, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (Array.isArray(res.data)) {
        setServiciosReserva(res.data);
      }
    } catch (error) {
      console.error("❌ Error al obtener servicios reserva:", error);
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

  const fetchSedes = async () => {
    try {
      const res = await axios.get(API_SEDES, { timeout: 10000 });
      if (Array.isArray(res.data)) {
        setSedes(res.data);
      }
    } catch (error) {
      console.error("Error al obtener sedes:", error);
    }
  };

  const fetchPaquetes = async () => {
    try {
      const res = await axios.get(API_PAQUETES, { timeout: 10000 });
      if (Array.isArray(res.data)) {
        setPaquetes(res.data);
      }
    } catch (error) {
      console.error("Error al obtener paquetes:", error);
    }
  };

  const fetchReservas = async () => {
    try {
      const res = await axios.get(API_RESERVAS, { timeout: 10000 });
      if (Array.isArray(res.data)) {
        setReservas(res.data);
      }
    } catch (error) {
      console.error("Error al obtener reservas:", error);
    }
  };

  const handleAddServicio = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) {
      displayAlert("Ya se está procesando una solicitud. Por favor espere.", "warning");
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Validar que haya al menos una sede seleccionada - NUEVO
    if (sedesSeleccionadas.length === 0) {
      displayAlert("Debe seleccionar al menos una sede para el servicio.", "error");
      return;
    }

    setIsSubmitting(true);
    setLoading(true);
    
    try {
      // Preparar datos según la estructura de tu API
      const servicioData = {
        nombreServicio: newServicio.nombreServicio.trim(),
        precioServicio: parseFloat(newServicio.precioServicio),
        imagen: newServicio.imagen?.trim() || null, // La API permite null
        descripcion: newServicio.descripcion?.trim() || null, // La API permite null
        estado: newServicio.estado === "true" || newServicio.estado === true
      };

      console.log("📤 Enviando datos:", servicioData);

      let idServicioCreado;

      if (isEditing) {
        // Para edición, incluir el idServicio
        servicioData.idServicio = newServicio.idServicio;
        await axios.put(`${API_SERVICIOS}/${newServicio.idServicio}`, servicioData, {
          headers: { 'Content-Type': 'application/json' }
        });
        idServicioCreado = newServicio.idServicio;
        displayAlert("Servicio actualizado exitosamente.", "success");
      } else {
        const response = await axios.post(API_SERVICIOS, servicioData, {
          headers: { 'Content-Type': 'application/json' }
        });
        idServicioCreado = response.data.idServicio;
        displayAlert("Servicio agregado exitosamente.", "success");
      }

      // Guardar relaciones con sedes - NUEVO
      await guardarRelacionesSedes(idServicioCreado);
      
      await fetchAllData();
      closeForm();
    } catch (error) {
      console.error("❌ Error al guardar servicio:", error);
      handleApiError(error, isEditing ? "actualizar el servicio" : "agregar el servicio");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (servicioToDelete) {
      setLoading(true);
      try {
        // Verificar si el servicio tiene relaciones antes de eliminar
        const hasRelations = await checkIfServicioHasRelations(servicioToDelete.idServicio);
        if (hasRelations) {
          displayAlert("No se puede eliminar el servicio porque tiene productos, sedes, paquetes o reservas asociadas.", "error");
          setLoading(false);
          return;
        }

        // Si el servicio tiene imagen en Cloudinary, eliminarla
        if (servicioToDelete.imagen && servicioToDelete.imagen.includes('cloudinary')) {
          try {
            // Extraer public_id de la URL de Cloudinary (esto es un ejemplo, ajusta según tu estructura)
            const urlParts = servicioToDelete.imagen.split('/');
            const publicIdWithExtension = urlParts[urlParts.length - 1];
            const publicId = publicIdWithExtension.split('.')[0];
            
            await deleteCloudinaryImage(publicId);
          } catch (cloudinaryError) {
            console.error("Error al eliminar imagen de Cloudinary:", cloudinaryError);
            // Continuar con la eliminación del servicio aunque falle la eliminación de la imagen
          }
        }

        await axios.delete(`${API_SERVICIOS}/${servicioToDelete.idServicio}`);
        displayAlert("Servicio eliminado exitosamente.", "success");
        await fetchAllData();
        
        if (paginatedServicios.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("❌ Error al eliminar servicio:", error);
        
        if (error.response && error.response.status === 409) {
          displayAlert("No se puede eliminar el servicio porque está siendo utilizado en reservas.", "error");
        } else {
          handleApiError(error, "eliminar el servicio");
        }
      } finally {
        setLoading(false);
        setServicioToDelete(null);
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
        errorMessage = "Conflicto: El servicio está siendo utilizado y no puede ser eliminado.";
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

  // Función para verificar si un servicio tiene relaciones
  const checkIfServicioHasRelations = async (servicioId) => {
    try {
      const productosAsociados = productosPorServicio.filter(
        rel => rel.idServicio === servicioId
      );
      const sedesAsociadas = sedesPorServicio.filter(
        rel => rel.idServicio === servicioId
      );
      const paquetesAsociados = serviciosPorPaquete.filter(
        rel => rel.idServicio === servicioId
      );
      const reservasAsociadas = serviciosReserva.filter(
        rel => rel.idServicio === servicioId
      );

      return productosAsociados.length > 0 || 
             sedesAsociadas.length > 0 || 
             paquetesAsociados.length > 0 || 
             reservasAsociadas.length > 0;
    } catch (error) {
      console.error("Error al verificar relaciones:", error);
      return true; // Por seguridad, asumir que tiene relaciones si hay error
    }
  };

  // Funciones para contar relaciones
  const contarProductosPorServicio = (servicioId) => {
    return productosPorServicio.filter(rel => rel.idServicio === servicioId).length;
  };

  const contarSedesPorServicio = (servicioId) => {
    return sedesPorServicio.filter(rel => rel.idServicio === servicioId).length;
  };

  const contarPaquetesPorServicio = (servicioId) => {
    return serviciosPorPaquete.filter(rel => rel.idServicio === servicioId).length;
  };

  const contarReservasPorServicio = (servicioId) => {
    return serviciosReserva.filter(rel => rel.idServicio === servicioId).length;
  };

  // Funciones para obtener datos detallados de relaciones
  const getProductosDelServicio = (servicioId) => {
    const relaciones = productosPorServicio.filter(rel => rel.idServicio === servicioId);
    return relaciones.map(rel => {
      const producto = productos.find(p => p.idProducto === rel.idProducto);
      return {
        id: rel.idProducto,
        nombre: producto ? producto.nombre : `Producto ${rel.idProducto}`,
        cantidad: rel.cantidad || 1
      };
    });
  };

  const getSedesDelServicio = (servicioId) => {
    const relaciones = sedesPorServicio.filter(rel => rel.idServicio === servicioId);
    return relaciones.map(rel => {
      const sede = sedes.find(s => s.idSede === rel.idSede);
      return {
        id: rel.idSede,
        nombre: sede ? sede.nombreSede || sede.nombre : `Sede ${rel.idSede}`,
        direccion: sede ? sede.ubicacionSede || sede.direccion : 'Dirección no disponible'
      };
    });
  };

  const getPaquetesDelServicio = (servicioId) => {
    const relaciones = serviciosPorPaquete.filter(rel => rel.idServicio === servicioId);
    return relaciones.map(rel => {
      const paquete = paquetes.find(p => p.idPaquete === rel.idPaquete);
      return {
        id: rel.idPaquete,
        nombre: paquete ? paquete.nombrePaquete || paquete.nombre : `Paquete ${rel.idPaquete}`,
        descripcion: paquete ? paquete.descripcion : 'Descripción no disponible'
      };
    });
  };

  const getReservasDelServicio = (servicioId) => {
    const relaciones = serviciosReserva.filter(rel => rel.idServicio === servicioId);
    return relaciones.map(rel => {
      const reserva = reservas.find(r => r.idReserva === rel.idReserva);
      return {
        id: rel.idReserva,
        fecha: reserva ? reserva.fechaReserva : 'Fecha no disponible',
        estado: reserva ? (reserva.estado ? 'Activa' : 'Cancelada') : 'Estado no disponible'
      };
    });
  };

  // Función para obtener todas las relaciones de un servicio
  const getTodasLasRelacionesDelServicio = (servicioId) => {
    const productos = getProductosDelServicio(servicioId);
    const sedes = getSedesDelServicio(servicioId);
    const paquetes = getPaquetesDelServicio(servicioId);
    const reservas = getReservasDelServicio(servicioId);

    return {
      productos,
      sedes,
      paquetes,
      reservas,
      total: productos.length + sedes.length + paquetes.length + reservas.length
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewServicio((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Nueva función para manejar el blur (cuando el campo pierde el foco)
  const handleInputBlur = (e) => {
    const { name } = e.target;
    markFieldAsTouched(name);
    validateField(name, newServicio[name]);
  };

  const toggleEstado = async (servicio) => {
    setLoading(true);
    try {
      const updatedServicio = { 
        ...servicio, 
        estado: !servicio.estado 
      };
      await axios.put(`${API_SERVICIOS}/${servicio.idServicio}`, updatedServicio, {
        headers: { 'Content-Type': 'application/json' }
      });
      displayAlert(`Servicio ${updatedServicio.estado ? 'activado' : 'desactivado'} exitosamente.`, "success");
      await fetchServicios();
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
    setImagenServicio({
      file: null,
      preview: null,
      isNew: false,
      publicId: null,
      isCloudinary: false
    });
    setSedesSeleccionadas([]); // NUEVO: Limpiar sedes seleccionadas
    setNewServicio({
      idServicio: 0,
      nombreServicio: "",
      precioServicio: "",
      imagen: "",
      descripcion: "",
      estado: true
    });
  };

  const closeDetailsModal = () => {
    setShowDetails(false);
    setSelectedServicio(null);
  };

  const cancelDelete = () => {
    setServicioToDelete(null);
    setShowDeleteConfirm(false);
  };

  const handleView = (servicio) => {
    setSelectedServicio(servicio);
    setShowDetails(true);
  };

  const handleEdit = async (servicio) => {
    console.log("Editando servicio:", servicio);
    
    setNewServicio({
      ...servicio,
      precioServicio: servicio.precioServicio.toString(),
      imagen: servicio.imagen || "", // Manejar null
      descripcion: servicio.descripcion || "", // Manejar null
      estado: servicio.estado
    });

    // Cargar imagen existente si hay una
    if (servicio.imagen) {
      setImagenServicio({
        preview: servicio.imagen,
        isNew: false,
        isCloudinary: servicio.imagen.includes('cloudinary'),
        publicId: null // No tenemos el publicId para imágenes existentes
      });
    }

    // Cargar sedes asociadas - NUEVO
    const sedesAsociadas = getSedesDelServicio(servicio.idServicio);
    // Convertir las sedes asociadas al formato de sedes disponibles
    const sedesCompletas = sedesAsociadas.map(sedeAsociada => {
      const sedeCompleta = sedes.find(s => s.idSede === sedeAsociada.id);
      return sedeCompleta || sedeAsociada;
    });
    setSedesSeleccionadas(sedesCompletas);

    setIsEditing(true);
    setShowForm(true);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
    setTouchedFields({});
  };

  const handleDeleteClick = (servicio) => {
    // Validar si el servicio tiene relaciones antes de eliminar
    const hasRelations = 
      contarProductosPorServicio(servicio.idServicio) > 0 ||
      contarSedesPorServicio(servicio.idServicio) > 0 ||
      contarPaquetesPorServicio(servicio.idServicio) > 0 ||
      contarReservasPorServicio(servicio.idServicio) > 0;

    if (hasRelations) {
      displayAlert("No se puede eliminar un servicio que tiene productos, sedes, paquetes o reservas asociadas", "error");
      return;
    }
    setServicioToDelete(servicio);
    setShowDeleteConfirm(true);
  };

  // ===============================================
  // FUNCIONES DE FILTRADO Y PAGINACIÓN MEJORADAS
  // ===============================================
  const filteredServicios = useMemo(() => {
    let filtered = servicios.filter(servicio => {
      // Búsqueda general
      const matchesSearch = 
        servicio.nombreServicio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (servicio.descripcion && servicio.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      // Filtro por estado
      if (filters.estado !== "all") {
        const estadoFilter = filters.estado === "activo";
        if (servicio.estado !== estadoFilter) return false;
      }

      // Filtro por precio
      if (filters.precioMin && servicio.precioServicio < parseFloat(filters.precioMin)) return false;
      if (filters.precioMax && servicio.precioServicio > parseFloat(filters.precioMax)) return false;

      // Filtro por número de relaciones
      const relaciones = getTodasLasRelacionesDelServicio(servicio.idServicio);
      if (filters.relacionesMin && relaciones.total < parseInt(filters.relacionesMin)) return false;
      if (filters.relacionesMax && relaciones.total > parseInt(filters.relacionesMax)) return false;

      return true;
    });

    return filtered;
  }, [servicios, searchTerm, filters]);

  const totalPages = Math.ceil(filteredServicios.length / ITEMS_PER_PAGE);

  const paginatedServicios = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredServicios.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredServicios, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ===============================================
  // FUNCIONES PARA FORMATEAR DATOS
  // ===============================================
  const formatDescripcion = (descripcion) => {
    if (!descripcion) return "Sin descripción";
    return descripcion.length > 80 ? `${descripcion.substring(0, 80)}...` : descripcion;
  };

  // ===============================================
  // COMPONENTES PARA DETALLES DE RELACIONES
  // ===============================================
  const RelacionesSection = ({ servicioId }) => {
    const relaciones = getTodasLasRelacionesDelServicio(servicioId);

    if (relaciones.total === 0) {
      return (
        <div style={detailItemStyle}>
          <div style={detailLabelStyle}>Relaciones del Servicio</div>
          <div style={{
            backgroundColor: '#F7F4EA',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#679750'
          }}>
            Este servicio no tiene relaciones asociadas.
          </div>
        </div>
      );
    }

    return (
      <div style={detailItemStyle}>
        <div style={detailLabelStyle}>Relaciones del Servicio</div>
        
        {/* Resumen de relaciones */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '10px', 
          marginBottom: '20px' 
        }}>
          <div style={{ 
            backgroundColor: '#E8F5E8',
            padding: '12px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #679750'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '5px' }}>
              <FaBox color="#679750" />
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Productos</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2E5939' }}>
              {relaciones.productos.length}
            </div>
          </div>

          <div style={{ 
            backgroundColor: '#E8F5E8',
            padding: '12px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #679750'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '5px' }}>
              <FaBuilding color="#679750" />
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Sedes</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2E5939' }}>
              {relaciones.sedes.length}
            </div>
          </div>

          <div style={{ 
            backgroundColor: '#E8F5E8',
            padding: '12px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #679750'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '5px' }}>
              <FaGift color="#679750" />
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Paquetes</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2E5939' }}>
              {relaciones.paquetes.length}
            </div>
          </div>

          <div style={{ 
            backgroundColor: '#E8F5E8',
            padding: '12px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #679750'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '5px' }}>
              <FaClipboardList color="#679750" />
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Reservas</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2E5939' }}>
              {relaciones.reservas.length}
            </div>
          </div>
        </div>

        {/* Detalles de cada tipo de relación */}
        <div style={{ display: 'grid', gap: '15px' }}>
          {/* Productos */}
          {relaciones.productos.length > 0 && (
            <div style={{
              backgroundColor: '#F7F4EA',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #E8F5E8'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <FaBox color="#2E5939" />
                <h4 style={{ margin: 0, color: '#2E5939' }}>Productos Asociados</h4>
              </div>
              <div style={{ display: 'grid', gap: '8px' }}>
                {relaciones.productos.map((producto, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px',
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    border: '1px solid #E8F5E8'
                  }}>
                    <span style={{ fontWeight: '500' }}>{producto.nombre}</span>
                    <span style={{ 
                      backgroundColor: '#679750', 
                      color: 'white', 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      Cant: {producto.cantidad}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sedes */}
          {relaciones.sedes.length > 0 && (
            <div style={{
              backgroundColor: '#F7F4EA',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #E8F5E8'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <FaBuilding color="#2E5939" />
                <h4 style={{ margin: 0, color: '#2E5939' }}>Sedes Disponibles</h4>
              </div>
              <div style={{ display: 'grid', gap: '8px' }}>
                {relaciones.sedes.map((sede, index) => (
                  <div key={index} style={{
                    padding: '8px',
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    border: '1px solid #E8F5E8'
                  }}>
                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>{sede.nombre}</div>
                    <div style={{ fontSize: '12px', color: '#679750' }}>{sede.direccion}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Paquetes */}
          {relaciones.paquetes.length > 0 && (
            <div style={{
              backgroundColor: '#F7F4EA',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #E8F5E8'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <FaGift color="#2E5939" />
                <h4 style={{ margin: 0, color: '#2E5939' }}>Paquetes Incluidos</h4>
              </div>
              <div style={{ display: 'grid', gap: '8px' }}>
                {relaciones.paquetes.map((paquete, index) => (
                  <div key={index} style={{
                    padding: '8px',
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    border: '1px solid #E8F5E8'
                  }}>
                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>{paquete.nombre}</div>
                    <div style={{ fontSize: '12px', color: '#679750' }}>
                      {paquete.descripcion || 'Sin descripción adicional'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reservas */}
          {relaciones.reservas.length > 0 && (
            <div style={{
              backgroundColor: '#F7F4EA',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #E8F5E8'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <FaClipboardList color="#2E5939" />
                <h4 style={{ margin: 0, color: '#2E5939' }}>Reservas Activas</h4>
              </div>
              <div style={{ display: 'grid', gap: '8px' }}>
                {relaciones.reservas.map((reserva, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px',
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    border: '1px solid #E8F5E8'
                  }}>
                    <div>
                      <div style={{ fontWeight: '500' }}>Reserva #{reserva.id}</div>
                      <div style={{ fontSize: '12px', color: '#679750' }}>{reserva.fecha}</div>
                    </div>
                    <span style={{
                      backgroundColor: reserva.estado === 'Activa' ? '#4caf50' : '#e57373',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}>
                      {reserva.estado}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Información importante sobre relaciones */}
        {relaciones.total > 0 && (
          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            padding: '12px',
            marginTop: '15px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
              <FaInfoCircle style={{ color: '#856404' }} />
              <strong style={{ color: '#856404', fontSize: '14px' }}>Información Importante</strong>
            </div>
            <p style={{ color: '#856404', margin: 0, fontSize: '13px', lineHeight: '1.4' }}>
              ⚠️ Este servicio tiene relaciones asociadas. No se puede eliminar mientras tenga productos, sedes, paquetes o reservas vinculadas.
            </p>
          </div>
        )}
      </div>
    );
  };

  // ===============================================
  // COMPONENTE PARA MOSTRAR RELACIONES EN EL LISTADO
  // ===============================================
  const RelacionesBadge = ({ servicioId }) => {
    const relaciones = getTodasLasRelacionesDelServicio(servicioId);
    
    if (relaciones.total === 0) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontWeight: 'bold', color: '#666' }}>0</span>
          <span style={{ fontSize: '12px', color: '#679750' }}>
            relaciones
          </span>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
        <span style={{ fontWeight: 'bold' }}>{relaciones.total}</span>
        <span style={{ fontSize: '12px', color: '#679750' }}>
          relaciones
        </span>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {relaciones.productos.length > 0 && (
            <span style={{ 
              backgroundColor: '#4caf50',
              color: 'white',
              padding: '1px 4px',
              borderRadius: '8px',
              fontSize: '9px',
              fontWeight: 'bold'
            }}>
              P: {relaciones.productos.length}
            </span>
          )}
          {relaciones.sedes.length > 0 && (
            <span style={{ 
              backgroundColor: '#2196f3',
              color: 'white',
              padding: '1px 4px',
              borderRadius: '8px',
              fontSize: '9px',
              fontWeight: 'bold'
            }}>
              S: {relaciones.sedes.length}
            </span>
          )}
          {relaciones.paquetes.length > 0 && (
            <span style={{ 
              backgroundColor: '#ff9800',
              color: 'white',
              padding: '1px 4px',
              borderRadius: '8px',
              fontSize: '9px',
              fontWeight: 'bold'
            }}>
              Paq: {relaciones.paquetes.length}
            </span>
          )}
          {relaciones.reservas.length > 0 && (
            <span style={{ 
              backgroundColor: '#e91e63',
              color: 'white',
              padding: '1px 4px',
              borderRadius: '8px',
              fontSize: '9px',
              fontWeight: 'bold'
            }}>
              R: {relaciones.reservas.length}
            </span>
          )}
        </div>
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
          <h2 style={{ margin: 0, color: "#2E5939" }}>Gestión de Servicios</h2>
          <p style={{ margin: "5px 0 0 0", color: "#679750", fontSize: "14px" }}>
            {servicios.length} servicios registrados • {servicios.filter(s => s.estado).length} activos
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
            setImagenServicio({
              file: null,
              preview: null,
              isNew: false,
              publicId: null,
              isCloudinary: false
            });
            setSedesSeleccionadas([]); // NUEVO: Limpiar sedes seleccionadas
            setNewServicio({
              idServicio: 0,
              nombreServicio: "",
              precioServicio: "",
              imagen: "",
              descripcion: "",
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
          <FaPlus /> Agregar Servicio
        </button>
      </div>

      {/* Tarjetas de Estadísticas */}
      {!loading && servicios.length > 0 && (
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
              {servicios.length}
            </div>
            <div style={{ fontSize: '16px', color: '#679750', fontWeight: '600' }}>
              Total Servicios
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
              {servicios.filter(s => s.estado).length}
            </div>
            <div style={{ fontSize: '16px', color: '#4caf50', fontWeight: '600' }}>
              Servicios Activos
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
              {servicios.filter(s => !s.estado).length}
            </div>
            <div style={{ fontSize: '16px', color: '#e57373', fontWeight: '600' }}>
              Servicios Inactivos
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
              {filteredServicios.length}
            </div>
            <div style={{ fontSize: '16px', color: '#2196f3', fontWeight: '600' }}>
              Resultados Filtrados
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

              {/* Filtro por precio */}
              <div>
                <label style={labelStyle}>Precio Mínimo (COP)</label>
                <input
                  type="number"
                  name="precioMin"
                  value={filters.precioMin}
                  onChange={handleFilterChange}
                  style={inputStyle}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label style={labelStyle}>Precio Máximo (COP)</label>
                <input
                  type="number"
                  name="precioMax"
                  value={filters.precioMax}
                  onChange={handleFilterChange}
                  style={inputStyle}
                  placeholder="10000000"
                  min="0"
                />
              </div>

              {/* Filtro por número de relaciones */}
              <div>
                <label style={labelStyle}>Relaciones Mínimo</label>
                <input
                  type="number"
                  name="relacionesMin"
                  value={filters.relacionesMin}
                  onChange={handleFilterChange}
                  style={inputStyle}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label style={labelStyle}>Relaciones Máximo</label>
                <input
                  type="number"
                  name="relacionesMax"
                  value={filters.relacionesMax}
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
        {filteredServicios.length !== servicios.length && (
          <div style={{
            marginTop: '10px',
            padding: '8px 12px',
            backgroundColor: '#E8F5E8',
            borderRadius: '6px',
            color: '#2E5939',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Mostrando {filteredServicios.length} de {servicios.length} servicios
            {activeFiltersCount > 0 && ` (filtros aplicados: ${activeFiltersCount})`}
          </div>
        )}
      </div>

      {/* Formulario de agregar/editar */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={{...modalContentStyle, maxWidth: 700}}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939", textAlign: 'center' }}>
                {isEditing ? "Editar Servicio" : "Agregar Nuevo Servicio"}
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
            
            <form onSubmit={handleAddServicio}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px 20px', marginBottom: '20px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <FormField
                    label="Nombre del Servicio"
                    name="nombreServicio"
                    value={newServicio.nombreServicio}
                    onChange={handleChange}
                    onBlur={handleInputBlur}
                    error={formErrors.nombreServicio}
                    success={formSuccess.nombreServicio}
                    warning={formWarnings.nombreServicio}
                    required={true}
                    disabled={loading}
                    maxLength={VALIDATION_RULES.nombreServicio.maxLength}
                    showCharCount={true}
                    placeholder="Ej: Masaje Relajante, Spa Completo, Caminata Ecológica..."
                    touched={touchedFields.nombreServicio}
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
                    name="precioServicio"
                    type="number"
                    value={newServicio.precioServicio}
                    onChange={handleChange}
                    onBlur={handleInputBlur}
                    error={formErrors.precioServicio}
                    success={formSuccess.precioServicio}
                    warning={formWarnings.precioServicio}
                    required={true}
                    disabled={loading}
                    min={VALIDATION_RULES.precioServicio.min}
                    max={VALIDATION_RULES.precioServicio.max}
                    step="100"
                    placeholder="1000"
                    touched={touchedFields.precioServicio}
                    icon={<FaDollarSign />}
                  />
                </div>

                {/* Selector de Sede para asociar servicio - NUEVO */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <SelectorSedes
                    titulo="Sedes Disponibles"
                    sedes={sedes.filter(s => s.estado)}
                    sedesSeleccionadas={sedesSeleccionadas}
                    onToggleSede={toggleSede}
                    icon={<FaMapMarkerAlt />}
                    tipo="multiple"
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaImage />
                      Imagen del Servicio
                      <span style={{ color: '#679750', fontSize: '0.8rem', marginLeft: '8px' }}>
                        (Opcional - Se subirá a Cloudinary)
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
                          {uploadingImage ? "Subiendo imagen..." : "Haz clic o arrastra una imagen aquí"}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#679750' }}>
                          Formatos: JPEG, PNG, GIF, WebP (Máx. 5MB)
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Previsualización de imagen */}
                  {(imagenServicio.preview || newServicio.imagen) && (
                    <div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '10px'
                      }}>
                        <span style={{ fontWeight: '600', color: '#2E5939' }}>
                          Vista previa {imagenServicio.isNew && "(Nueva imagen)"}
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
                      <div style={imagePreviewContainerStyle}>
                        <div style={imagePreviewStyle}>
                          <img 
                            src={imagenServicio.preview || newServicio.imagen} 
                            alt="Preview del servicio"
                            style={imageStyle}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/150x100/679750/FFFFFF?text=Imagen+No+Disponible';
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <FormField
                    label="Descripción"
                    name="descripcion"
                    value={newServicio.descripcion}
                    onChange={handleChange}
                    onBlur={handleInputBlur}
                    error={formErrors.descripcion}
                    success={formSuccess.descripcion}
                    warning={formWarnings.descripcion}
                    required={false}
                    disabled={loading}
                    maxLength={VALIDATION_RULES.descripcion.maxLength}
                    showCharCount={true}
                    placeholder="Descripción detallada del servicio (opcional)..."
                    touched={touchedFields.descripcion}
                    textarea={true}
                    rows={4}
                  />
                </div>
              </div>

              {/* Resumen del servicio - NUEVO */}
              {sedesSeleccionadas.length > 0 && (
                <div style={{
                  backgroundColor: '#E8F5E8',
                  border: '1px solid #679750',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '20px'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#2E5939' }}>Resumen del Servicio</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                    <div>Precio:</div>
                    <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      {formatPrice(parseFloat(newServicio.precioServicio || 0))}
                    </div>
                    
                    <div>Sedes seleccionadas:</div>
                    <div style={{ textAlign: 'right' }}>{sedesSeleccionadas.length}</div>

                    <div>Estado:</div>
                    <div style={{ textAlign: 'right' }}>
                      {newServicio.estado ? 'Activo' : 'Inactivo'}
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <button
                  type="submit"
                  disabled={loading || isSubmitting || uploadingImage || cloudinaryUploading}
                  style={{
                    backgroundColor: (loading || isSubmitting || uploadingImage || cloudinaryUploading) ? "#ccc" : "#2E5939",
                    color: "#fff",
                    padding: "12px 25px",
                    border: "none",
                    borderRadius: 10,
                    cursor: (loading || isSubmitting || uploadingImage || cloudinaryUploading) ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                    transition: "all 0.3s ease",
                    flex: 1
                  }}
                  onMouseOver={(e) => {
                    if (!loading && !isSubmitting && !uploadingImage && !cloudinaryUploading) {
                      e.target.style.background = "linear-gradient(90deg, #67d630, #95d34e)";
                      e.target.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loading && !isSubmitting && !uploadingImage && !cloudinaryUploading) {
                      e.target.style.background = "#2E5939";
                      e.target.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {uploadingImage || cloudinaryUploading ? "Subiendo imagen..." : 
                   loading ? "Guardando..." : 
                   (isEditing ? "Actualizar Servicio" : "Guardar Servicio")}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={loading || isSubmitting || uploadingImage || cloudinaryUploading}
                  style={{
                    backgroundColor: "#ccc",
                    color: "#333",
                    padding: "12px 25px",
                    border: "none",
                    borderRadius: 10,
                    cursor: (loading || isSubmitting || uploadingImage || cloudinaryUploading) ? "not-allowed" : "pointer",
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
      {showDetails && selectedServicio && (
        <div style={modalOverlayStyle}>
          <div style={detailsModalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939", textAlign: 'center' }}>Detalles del Servicio</h2>
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
                <div style={detailValueStyle}>#{selectedServicio.idServicio}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Nombre</div>
                <div style={detailValueStyle}>{selectedServicio.nombreServicio}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Precio</div>
                <div style={{...detailValueStyle, fontWeight: 'bold', color: '#679750'}}>
                  {formatPrice(selectedServicio.precioServicio)}
                </div>
              </div>

              {/* Imagen del servicio */}
              {selectedServicio.imagen && (
                <div style={detailItemStyle}>
                  <div style={detailLabelStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaImage />
                      Imagen del Servicio
                    </div>
                  </div>
                  <div style={detailValueStyle}>
                    <div style={imagePreviewStyle}>
                      <img 
                        src={selectedServicio.imagen} 
                        alt={selectedServicio.nombreServicio}
                        style={{
                          ...galleryImageStyle,
                          width: '100%',
                          maxWidth: '300px'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200/679750/FFFFFF?text=Imagen+No+Disponible';
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Descripción</div>
                <div style={{ 
                  backgroundColor: "#F7F4EA", 
                  padding: 15,
                  borderRadius: 8,
                  fontSize: 15,
                  color: '#2E5939',
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  lineHeight: '1.5',
                  minHeight: '60px'
                }}>
                  {selectedServicio.descripcion || "Sin descripción"}
                </div>
              </div>

              {/* Sección de relaciones */}
              <RelacionesSection servicioId={selectedServicio.idServicio} />

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Estado</div>
                <div style={{
                  ...detailValueStyle,
                  color: selectedServicio.estado ? '#4caf50' : '#e57373',
                  fontWeight: 'bold'
                }}>
                  {selectedServicio.estado ? '🟢 Activo' : '🔴 Inactivo'}
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
      {showDeleteConfirm && servicioToDelete && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 450, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 20, color: "#2E5939" }}>Confirmar Eliminación</h3>
            <p style={{ marginBottom: 30, fontSize: '1.1rem', color: "#2E5939" }}>
              ¿Estás seguro de eliminar el servicio "<strong>{servicioToDelete.nombreServicio}</strong>"?
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
                <strong style={{ color: '#856404' }}>Servicio a eliminar</strong>
              </div>
              <p style={{ color: '#856404', margin: 0, fontSize: '0.9rem' }}>
                Precio: {formatPrice(servicioToDelete.precioServicio)} | 
                Estado: {servicioToDelete.estado ? 'Activo' : 'Inactivo'} |
                Productos: {contarProductosPorServicio(servicioToDelete.idServicio)} |
                Sedes: {contarSedesPorServicio(servicioToDelete.idServicio)} |
                Paquetes: {contarPaquetesPorServicio(servicioToDelete.idServicio)} |
                Reservas: {contarReservasPorServicio(servicioToDelete.idServicio)}
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
              🔄 Cargando servicios...
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
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Servicio</th>
                <th style={{ padding: "15px", textAlign: "right", fontWeight: "bold" }}>Precio</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Relaciones</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Estado</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedServicios.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <FaInfoCircle size={30} color="#679750" />
                      {servicios.length === 0 ? "No hay servicios registrados" : "No se encontraron resultados con los filtros aplicados"}
                      {activeFiltersCount > 0 && (
                        <div style={{ color: '#679750', fontSize: '14px', marginTop: '5px' }}>
                          Filtros activos: {activeFiltersCount}
                        </div>
                      )}
                      {servicios.length === 0 && (
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
                          Agregar Primer Servicio
                        </button>
                      )}
                      {servicios.length > 0 && activeFiltersCount > 0 && (
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
                paginatedServicios.map((servicio) => {
                  const relaciones = getTodasLasRelacionesDelServicio(servicio.idServicio);
                  
                  return (
                    <tr key={servicio.idServicio} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "15px", fontWeight: "500" }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          {servicio.imagen && (
                            <div style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              flexShrink: 0
                            }}>
                              <img 
                                src={servicio.imagen} 
                                alt={servicio.nombreServicio}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/50x50/679750/FFFFFF?text=S';
                                }}
                              />
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: "600", marginBottom: "5px" }}>
                              {servicio.nombreServicio}
                            </div>
                            <div style={{ fontSize: "13px", color: "#679750", lineHeight: "1.3" }}>
                              {formatDescripcion(servicio.descripcion)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "15px", textAlign: "right", fontWeight: "bold" }}>
                        {formatPrice(servicio.precioServicio)}
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <RelacionesBadge servicioId={servicio.idServicio} />
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <button
                          onClick={() => toggleEstado(servicio)}
                          disabled={loading}
                          style={{
                            cursor: loading ? "not-allowed" : "pointer",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            border: "none",
                            backgroundColor: servicio.estado ? "#4caf50" : "#e57373",
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
                          {servicio.estado ? "Activo" : "Inactivo"}
                        </button>
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                          <button
                            onClick={() => handleView(servicio)}
                            style={btnAccion("#F7F4EA", "#2E5939")}
                            title="Ver Detalles"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleEdit(servicio)}
                            style={btnAccion("#F7F4EA", "#2E5939")}
                            title="Editar Servicio"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteClick(servicio); }}
                            style={{
                              ...btnAccion("#fbe9e7", "#e57373"),
                              opacity: relaciones.total > 0 ? 0.5 : 1,
                              cursor: relaciones.total > 0 ? "not-allowed" : "pointer"
                            }}
                            title={relaciones.total > 0 ? "No se puede eliminar - Tiene relaciones asociadas" : "Eliminar Servicio"}
                            disabled={relaciones.total > 0}
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
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: '10px' }}>
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

export default Gestiservi;