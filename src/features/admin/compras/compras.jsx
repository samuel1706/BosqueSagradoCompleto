import React, { useState, useMemo, useRef, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus, FaMinus, FaFilePdf, FaTimes, FaAsterisk, FaSearch, FaExclamationTriangle, FaCheck, FaInfoCircle, FaBox, FaShoppingCart, FaDollarSign, FaHome, FaUser, FaSync, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { usePDF } from 'react-to-pdf';
import axios from "axios";

// ===============================================
// ESTILOS MEJORADOS (CONSISTENTES CON COMODIDADES)
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

const yellowBlockedInputStyle = {
  ...inputStyle,
  backgroundColor: "#fffde7",
  color: "#bfa100",
  cursor: "not-allowed",
  border: "1.5px solid #ffe082"
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

const formFieldStyle = {
  marginBottom: 15,
};

const productsSectionStyle = {
  gridColumn: '1 / -1',
  marginTop: '20px',
  padding: '20px',
  backgroundColor: 'rgba(46, 89, 57, 0.05)',
  borderRadius: '10px',
  border: '1px solid rgba(46, 89, 57, 0.1)'
};

const productItemStyle = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr 1fr 1fr 40px',
  gap: '10px',
  alignItems: 'center',
  marginBottom: '15px',
  padding: '15px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  border: '1px solid rgba(46, 89, 57, 0.2)',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const productHeaderStyle = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr 1fr 1fr 40px',
  gap: '10px',
  alignItems: 'center',
  marginBottom: '10px',
  padding: '10px 15px',
  backgroundColor: 'rgba(46, 89, 57, 0.1)',
  borderRadius: '6px',
  fontWeight: 'bold',
  color: '#2E5939',
  fontSize: '14px'
};

const removeButtonStyle = {
  backgroundColor: '#e57373',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: '30px',
  height: '30px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  transition: "all 0.3s ease",
};

const productChipStyle = {
  backgroundColor: '#2E5939',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '11px',
  margin: '2px',
  display: 'inline-block'
};

const totalSummaryStyle = {
  gridColumn: '1 / -1',
  marginTop: 20,
  paddingTop: 15,
  borderTop: '1px solid #679750',
  textAlign: 'right',
  color: '#2E5939'
};

const totalLineStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginBottom: 8,
  gap: 15
};

const totalLabelStyle = {
  fontWeight: 'bold',
  fontSize: '1.1em',
  width: '120px',
  textAlign: 'right',
  color: '#2E5939'
};

const totalValueStyle = {
  fontSize: '1.1em',
  minWidth: '150px',
  textAlign: 'right',
  padding: '5px 10px',
  backgroundColor: '#F7F4EA',
  borderRadius: 6,
  color: '#2E5939',
  fontWeight: 'bold'
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
// VALIDACIONES Y PATRONES
// ===============================================
const VALIDATION_RULES = {
  idProveedor: {
    required: true,
    errorMessages: {
      required: "El proveedor es obligatorio."
    }
  },
  metodoPago: {
    required: true,
    errorMessages: {
      required: "El método de pago es obligatorio."
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
  precioUnitario: {
    min: 0,
    max: 10000000,
    required: true,
    errorMessages: {
      required: "El precio unitario es obligatorio.",
      min: "El precio mínimo es $0.",
      max: "El precio máximo es $10,000,000.",
      invalid: "El precio debe ser un valor numérico válido."
    }
  }
};

// ===============================================
// CONFIGURACIÓN DE API
// ===============================================
const API_COMPRAS = "http://localhost:5204/api/Compras";
const API_PROVEEDORES = "http://localhost:5204/api/Proveedore";
const API_PRODUCTOS = "http://localhost:5204/api/Productos";
const API_DETALLE_COMPRAS = "http://localhost:5204/api/DetalleCompras";
const IVA_RATE = 0.19;
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
  style = {}, 
  required = true, 
  disabled = false,
  options = [],
  placeholder,
  min,
  max,
  step,
  readOnly = false,
  icon
}) => {
  const handleFilteredInputChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (name === 'cantidad' || name === 'precioUnitario') {
      filteredValue = value.replace(/[^0-9.]/g, "");
      const parts = filteredValue.split('.');
      if (parts.length > 2) {
        filteredValue = parts[0] + '.' + parts.slice(1).join('');
      }
      if (parts.length === 2 && parts[1].length > 2) {
        filteredValue = parts[0] + '.' + parts[1].substring(0, 2);
      }
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

  const finalOptions = useMemo(() => {
    if (type === "select") {
      const placeholderOption = { value: "", label: placeholder || "Selecciona", disabled: required };
      return [placeholderOption, ...options];
    }
    return options;
  }, [options, type, required, placeholder]);

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
            disabled={disabled || readOnly}
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
            onChange={onChange}
            style={{
              ...getInputStyle(),
              minHeight: "80px",
              resize: "vertical",
              fontFamily: "inherit"
            }}
            required={required}
            disabled={disabled || readOnly}
            placeholder={placeholder}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={(name === 'cantidad' || name === 'precioUnitario') ? handleFilteredInputChange : onChange}
            style={readOnly ? yellowBlockedInputStyle : getInputStyle()}
            required={required}
            disabled={disabled || readOnly}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            readOnly={readOnly}
          />
        )}
      </div>
      {getValidationMessage()}
    </div>
  );
};

// ===============================================
// COMPONENTE PRINCIPAL AdminCompras CON ESTILO MEJORADO
// ===============================================
const AdminCompras = () => {
  const [compras, setCompras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [detalleCompras, setDetalleCompras] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newCompra, setNewCompra] = useState({
    idProveedor: "",
    metodoPago: "Transferencia",
    estado: true,
    subtotal: 0,
    iva: 0,
    total: 0
  });
  const [productosCompra, setProductosCompra] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState({});
  const [formWarnings, setFormWarnings] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [selectedDetalleCompras, setSelectedDetalleCompras] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [compraToDelete, setCompraToDelete] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [loading, setLoading] = useState(false);
  const [loadingProveedores, setLoadingProveedores] = useState(false);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [error, setError] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const pdfRef = useRef();
  const { toPDF, targetRef } = usePDF({filename: `compra_${selectedCompra?.idCompra || 'nueva'}.pdf`});

  // ===============================================
  // EFECTOS
  // ===============================================
  useEffect(() => {
    fetchCompras();
    fetchProveedores();
    fetchProductos();
    fetchDetalleCompras();
  }, []);

  // Validar formulario en tiempo real
  useEffect(() => {
    if (showForm) {
      validateField('idProveedor', newCompra.idProveedor);
      validateField('metodoPago', newCompra.metodoPago);
    }
  }, [newCompra, showForm]);

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
  // FUNCIONES DE LA API
  // ===============================================
  const fetchCompras = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_COMPRAS, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (Array.isArray(res.data)) {
        setCompras(res.data);
      } else {
        throw new Error("Formato de datos inválido");
      }
    } catch (error) {
      console.error("❌ Error al obtener compras:", error);
      handleApiError(error, "cargar las compras");
    } finally {
      setLoading(false);
    }
  };

  const fetchProveedores = async () => {
    setLoadingProveedores(true);
    try {
      const res = await axios.get(API_PROVEEDORES, {
        timeout: 10000
      });
      
      if (Array.isArray(res.data)) {
        setProveedores(res.data);
        if (res.data.length > 0 && !newCompra.idProveedor) {
          setNewCompra(prev => ({ ...prev, idProveedor: res.data[0].idProveedor.toString() }));
        }
      }
    } catch (error) {
      console.error("❌ Error al obtener proveedores:", error);
      handleApiError(error, "cargar los proveedores");
    } finally {
      setLoadingProveedores(false);
    }
  };

  const fetchProductos = async () => {
    setLoadingProductos(true);
    try {
      const res = await axios.get(API_PRODUCTOS, {
        timeout: 10000
      });
      
      if (Array.isArray(res.data)) {
        setProductos(res.data);
      }
    } catch (error) {
      console.error("❌ Error al obtener productos:", error);
      handleApiError(error, "cargar los productos");
    } finally {
      setLoadingProductos(false);
    }
  };

  const fetchDetalleCompras = async () => {
    try {
      const res = await axios.get(API_DETALLE_COMPRAS, {
        timeout: 10000
      });
      
      if (Array.isArray(res.data)) {
        setDetalleCompras(res.data);
      }
    } catch (error) {
      console.error("❌ Error al obtener detalle compras:", error);
    }
  };

  const fetchDetalleComprasByCompraId = async (idCompra) => {
    try {
      const res = await axios.get(`${API_DETALLE_COMPRAS}/compra/${idCompra}`, {
        timeout: 10000
      });
      return Array.isArray(res.data) ? res.data : [];
    } catch (error) {
      console.error("❌ Error al obtener detalle de la compra:", error);
      return [];
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
    else if (trimmedValue && (fieldName === 'cantidad' || fieldName === 'precioUnitario')) {
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
        if (fieldName === 'precioUnitario' && numericValue > 1000000) {
          warning = "El precio es bastante alto. Verifique que sea correcto.";
        } else if (fieldName === 'cantidad' && numericValue > 100) {
          warning = "La cantidad es alta. Verifique que sea necesaria.";
        }
      }
    }
    else if (trimmedValue) {
      success = "Campo válido.";
    }

    setFormErrors(prev => ({ ...prev, [fieldName]: error }));
    setFormSuccess(prev => ({ ...prev, [fieldName]: success }));
    setFormWarnings(prev => ({ ...prev, [fieldName]: warning }));

    return !error;
  };

  const validateForm = () => {
    const proveedorValid = validateField('idProveedor', newCompra.idProveedor);
    const metodoPagoValid = validateField('metodoPago', newCompra.metodoPago);

    // Validar productos
    if (productosCompra.length === 0) {
      displayAlert("Debe agregar al menos un producto a la compra.", "error");
      return false;
    }

    for (const producto of productosCompra) {
      const cantidadValid = validateField('cantidad', producto.cantidad);
      const precioValid = validateField('precioUnitario', producto.precioUnitario);
      if (!cantidadValid || !precioValid) {
        displayAlert("Por favor, corrige los errores en los productos antes de guardar.", "error");
        return false;
      }
    }

    const isValid = proveedorValid && metodoPagoValid;
    
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

  const handleAddCompra = async (e) => {
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
      const compraData = {
        ...newCompra,
        idProveedor: parseInt(newCompra.idProveedor),
        subtotal: parseFloat(newCompra.subtotal),
        iva: parseFloat(newCompra.iva),
        total: parseFloat(newCompra.total)
      };

      let compraId;

      if (isEditing) {
        await axios.put(`${API_COMPRAS}/${newCompra.idCompra}`, compraData, {
          headers: { 'Content-Type': 'application/json' }
        });
        compraId = newCompra.idCompra;
        
        try {
          const detallesExistentes = detalleCompras.filter(dc => dc.idCompra === compraId);
          for (const detalle of detallesExistentes) {
            await axios.delete(`${API_DETALLE_COMPRAS}/${detalle.idDetalleCompra}`);
          }
          
          for (const producto of productosCompra) {
            const subtotal = parseFloat(producto.subtotal);
            const iva = subtotal * IVA_RATE;
            const total = subtotal + iva;
            
            const detalleData = {
              idCompra: compraId,
              idProducto: parseInt(producto.idProducto),
              cantidad: parseInt(producto.cantidad),
              subtotal: subtotal,
              iva: iva,
              total: total
            };
            await axios.post(API_DETALLE_COMPRAS, detalleData, {
              headers: { 'Content-Type': 'application/json' }
            });
          }
        } catch (error) {
          console.warn("No se pudo actualizar los detalles de la compra:", error);
        }
        
        displayAlert("Compra actualizada exitosamente.", "success");
      } else {
        const response = await axios.post(API_COMPRAS, compraData, {
          headers: { 'Content-Type': 'application/json' }
        });
        compraId = response.data.idCompra;
        
        try {
          for (const producto of productosCompra) {
            const subtotal = parseFloat(producto.subtotal);
            const iva = subtotal * IVA_RATE;
            const total = subtotal + iva;
            
            const detalleData = {
              idCompra: compraId,
              idProducto: parseInt(producto.idProducto),
              cantidad: parseInt(producto.cantidad),
              subtotal: subtotal,
              iva: iva,
              total: total
            };
            await axios.post(API_DETALLE_COMPRAS, detalleData, {
              headers: { 'Content-Type': 'application/json' }
            });
          }
        } catch (error) {
          console.warn("No se pudieron agregar los detalles a la compra:", error);
        }
        
        displayAlert("Compra agregada exitosamente.", "success");
      }

      await fetchCompras();
      await fetchDetalleCompras();
      closeForm();
    } catch (error) {
      console.error("Error al guardar compra:", error);
      handleApiError(error, isEditing ? "actualizar la compra" : "agregar la compra");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (compraToDelete) {
      setLoading(true);
      try {
        try {
          const detallesAsociados = detalleCompras.filter(dc => dc.idCompra === compraToDelete.idCompra);
          for (const detalle of detallesAsociados) {
            await axios.delete(`${API_DETALLE_COMPRAS}/${detalle.idDetalleCompra}`);
          }
        } catch (error) {
          console.warn("No se pudieron eliminar los detalles de la compra:", error);
        }
        
        await axios.delete(`${API_COMPRAS}/${compraToDelete.idCompra}`);
        displayAlert("Compra eliminada exitosamente.", "success");
        
        await fetchCompras();
        await fetchDetalleCompras();
        
        if (paginatedCompras.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("Error al eliminar compra:", error);
        handleApiError(error, "eliminar la compra");
      } finally {
        setLoading(false);
        setCompraToDelete(null);
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
        errorMessage = "Conflicto: La compra está siendo utilizada y no puede ser eliminada.";
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
    setNewCompra((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Función para cambiar el estado con el botón toggle
  const toggleEstado = () => {
    setNewCompra(prev => ({
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
    setNewCompra({
      idProveedor: proveedores.length > 0 ? proveedores[0].idProveedor.toString() : "",
      metodoPago: "Transferencia",
      estado: true,
      subtotal: 0,
      iva: 0,
      total: 0
    });
    setProductosCompra([]);
  };

  const closeDetailsModal = () => {
    setShowDetails(false);
    setSelectedCompra(null);
    setSelectedDetalleCompras([]);
  };

  const cancelDelete = () => {
    setCompraToDelete(null);
    setShowDeleteConfirm(false);
  };

  // FUNCIÓN CORREGIDA PARA CAMBIAR ESTADO
  const toggleEstadoCompra = async (compra) => {
    setLoading(true);
    try {
      const updatedCompra = { 
        ...compra, 
        estado: !compra.estado 
      };
      await axios.put(`${API_COMPRAS}/${compra.idCompra}`, updatedCompra, {
        headers: { 'Content-Type': 'application/json' }
      });
      displayAlert(`Compra ${updatedCompra.estado ? 'activada' : 'desactivada'} exitosamente.`, "success");
      await fetchCompras();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      handleApiError(error, "cambiar el estado");
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (compra) => {
    setSelectedCompra(compra);
    const detalles = await fetchDetalleComprasByCompraId(compra.idCompra);
    setSelectedDetalleCompras(detalles);
    setShowDetails(true);
  };

  const handleEdit = async (compra) => {
    setNewCompra({
      ...compra,
      idProveedor: compra.idProveedor.toString()
    });
    
    const detalles = await fetchDetalleComprasByCompraId(compra.idCompra);
    setProductosCompra(detalles.map(detalle => ({
      idProducto: detalle.idProducto.toString(),
      cantidad: detalle.cantidad.toString(),
      precioUnitario: (detalle.subtotal / detalle.cantidad).toFixed(2),
      subtotal: detalle.subtotal
    })));
    
    setIsEditing(true);
    setShowForm(true);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
  };

  const handleDeleteClick = (compra) => {
    setCompraToDelete(compra);
    setShowDeleteConfirm(true);
  };

  const handleOpenPdfModal = (compra) => {
    setSelectedCompra(compra);
    setShowPdfModal(true);
  };

  const handleClosePdfModal = () => {
    setShowPdfModal(false);
    setSelectedCompra(null);
  };

  const handleConfirmExportPdf = () => {
    if (selectedCompra) {
      toPDF();
      handleClosePdfModal();
      displayAlert("PDF generado exitosamente", "success");
    }
  };

  // ===============================================
  // FUNCIONES DE GESTIÓN DE PRODUCTOS EN COMPRA
  // ===============================================
  const addProducto = () => {
    if (productos.length === 0) {
      displayAlert("No hay productos disponibles para agregar.", "warning");
      return;
    }
    
    const nuevoProducto = {
      idProducto: productos[0].idProducto.toString(),
      cantidad: "1",
      precioUnitario: "0",
      subtotal: 0
    };
    
    setProductosCompra([...productosCompra, nuevoProducto]);
  };

  const removeProducto = (index) => {
    const nuevosProductos = [...productosCompra];
    nuevosProductos.splice(index, 1);
    setProductosCompra(nuevosProductos);
    calcularTotales(nuevosProductos);
  };

  const handleProductoChange = (index, field, value) => {
    const nuevosProductos = [...productosCompra];
    
    if (field === 'cantidad' || field === 'precioUnitario') {
      value = value.replace(/[^0-9.]/g, "");
      const parts = value.split('.');
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
      }
    }
    
    nuevosProductos[index][field] = value;
    
    if (field === 'cantidad' || field === 'precioUnitario') {
      const cantidad = parseFloat(nuevosProductos[index].cantidad) || 0;
      const precioUnitario = parseFloat(nuevosProductos[index].precioUnitario) || 0;
      nuevosProductos[index].subtotal = cantidad * precioUnitario;
    }
    
    setProductosCompra(nuevosProductos);
    calcularTotales(nuevosProductos);
  };

  const calcularTotales = (productosArray = productosCompra) => {
    const subtotal = productosArray.reduce((sum, producto) => sum + (parseFloat(producto.subtotal) || 0), 0);
    const iva = subtotal * IVA_RATE;
    const total = subtotal + iva;
    
    setNewCompra(prev => ({
      ...prev,
      subtotal: subtotal,
      iva: iva,
      total: total
    }));
  };

  // ===============================================
  // FUNCIONES PARA OBTENER NOMBRES Y DETALLES
  // ===============================================
  const getProductoNombre = (idProducto) => {
    const producto = productos.find(p => p.idProducto === idProducto);
    return producto ? producto.nombre : `Producto ${idProducto}`;
  };

  const getProductoInfo = (idProducto) => {
    const producto = productos.find(p => p.idProducto === idProducto);
    return producto || {
      nombre: `Producto ${idProducto}`,
      descripcion: "N/A",
      precio: 0,
      stock: 0,
      categoria: "N/A"
    };
  };

  const getProductosDeCompra = (idCompra) => {
    const detalles = detalleCompras.filter(dc => dc.idCompra === idCompra);
    return detalles.map(detalle => {
      const producto = getProductoInfo(detalle.idProducto);
      return {
        ...producto,
        cantidad: detalle.cantidad,
        precioUnitario: detalle.subtotal / detalle.cantidad,
        subtotal: detalle.subtotal
      };
    });
  };

  const getNombresProductosCompra = (idCompra) => {
    const productosCompra = getProductosDeCompra(idCompra);
    if (productosCompra.length === 0) return "Sin productos";
    
    const productosMostrar = productosCompra.slice(0, 2);
    const nombres = productosMostrar.map(p => p.nombre);
    
    let resultado = nombres.join(', ');
    if (productosCompra.length > 2) {
      resultado += ` +${productosCompra.length - 2} más`;
    }
    
    return resultado;
  };

  const getProveedorNombre = (idProveedor) => {
    const proveedor = proveedores.find(p => p.idProveedor === idProveedor);
    return proveedor ? proveedor.nombre : `Proveedor ${idProveedor}`;
  };

  const getProveedorInfo = (idProveedor) => {
    const proveedor = proveedores.find(p => p.idProveedor === idProveedor);
    return proveedor || {
      nombre: `Proveedor ${idProveedor}`,
      celular: "N/A",
      correo: "N/A",
      departamento: "N/A",
      ciudad: "N/A",
      direccion: "N/A",
      tipoDocumento: "N/A",
      numeroDocumento: "N/A"
    };
  };

  const metodoPagoOptions = [
    { value: "Transferencia", label: "Transferencia" },
    { value: "Efectivo", label: "Efectivo" },
    { value: "Tarjeta", label: "Tarjeta" },
    { value: "Cheque", label: "Cheque" }
  ];

  // ===============================================
  // FUNCIONES DE FILTRADO Y PAGINACIÓN
  // ===============================================
  const filteredCompras = useMemo(() => {
    return compras.filter(compra => {
      const proveedor = proveedores.find(p => p.idProveedor === compra.idProveedor);
      const productosCompra = getNombresProductosCompra(compra.idCompra);
      
      return proveedor?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             compra.metodoPago?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             productosCompra.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [compras, proveedores, searchTerm, detalleCompras, productos]);

  const totalPages = Math.ceil(filteredCompras.length / ITEMS_PER_PAGE);

  const paginatedCompras = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCompras.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCompras, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ===============================================
  // COMPONENTE PDF TEMPLATE
  // ===============================================
  const PDFTemplate = ({ compra, proveedor, detallesCompra }) => {
    return (
      <div style={{ padding: 20, fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', color: '#2E5939', marginBottom: '30px' }}>Factura de Compra #{compra.idCompra}</h1>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <div>
            <h3 style={{ color: '#2E5939', marginBottom: '10px' }}>Glamping Luxury</h3>
            <p>NIT: 900.123.456-7</p>
            <p>Dirección: Vereda El Descanso, Villeta</p>
            <p>Teléfono: 310 123 4567</p>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <h3 style={{ color: '#2E5939', marginBottom: '10px' }}>Datos de la Compra</h3>
            <p><strong>Método de Pago:</strong> {compra.metodoPago}</p>
            <p><strong>Estado:</strong> {compra.estado ? 'Activa' : 'Inactiva'}</p>
          </div>
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#2E5939', marginBottom: '10px' }}>Proveedor</h3>
          <p><strong>Nombre:</strong> {proveedor.nombre || 'Desconocido'}</p>
          <p><strong>Contacto:</strong> {proveedor.celular || 'N/A'}</p>
          <p><strong>Email:</strong> {proveedor.correo || 'N/A'}</p>
          <p><strong>Documento:</strong> {proveedor.tipoDocumento} {proveedor.numeroDocumento}</p>
          <p><strong>Dirección:</strong> {proveedor.direccion}, {proveedor.ciudad}, {proveedor.departamento}</p>
        </div>
        
        <h3 style={{ color: '#2E5939', marginBottom: '10px' }}>Detalle de la Compra</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F7F4EA', color: '#2E5939' }}>
              <th style={{ padding: '10px', border: '1px solid #679750', textAlign: 'left' }}>Producto</th>
              <th style={{ padding: '10px', border: '1px solid #679750', textAlign: 'center' }}>Cantidad</th>
              <th style={{ padding: '10px', border: '1px solid #679750', textAlign: 'right' }}>Precio Unitario</th>
              <th style={{ padding: '10px', border: '1px solid #679750', textAlign: 'right' }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {detallesCompra.map((detalle, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px', border: '1px solid #679750' }}>
                  {getProductoNombre(detalle.idProducto)}
                </td>
                <td style={{ padding: '10px', border: '1px solid #679750', textAlign: 'center' }}>
                  {detalle.cantidad}
                </td>
                <td style={{ padding: '10px', border: '1px solid #679750', textAlign: 'right' }}>
                  ${(detalle.subtotal / detalle.cantidad).toLocaleString('es-CO')}
                </td>
                <td style={{ padding: '10px', border: '1px solid #679750', textAlign: 'right' }}>
                  ${detalle.subtotal.toLocaleString('es-CO')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ display: 'inline-block', width: '150px', fontWeight: 'bold' }}>Subtotal:</span>
            <span style={{ display: 'inline-block', width: '150px', textAlign: 'right' }}>${compra.subtotal.toLocaleString('es-CO')}</span>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ display: 'inline-block', width: '150px', fontWeight: 'bold' }}>IVA (19%):</span>
            <span style={{ display: 'inline-block', width: '150px', textAlign: 'right' }}>${compra.iva.toLocaleString('es-CO')}</span>
          </div>
          <div style={{ marginBottom: '10px', fontSize: '1.2em', fontWeight: 'bold' }}>
            <span style={{ display: 'inline-block', width: '150px' }}>Total:</span>
            <span style={{ display: 'inline-block', width: '150px', textAlign: 'right' }}>${compra.total.toLocaleString('es-CO')}</span>
          </div>
        </div>
        
        <div style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #2E5939', textAlign: 'center' }}>
          <p>Gracias por su compra</p>
          <p>Glamping Luxury - Vereda El Descanso, Villeta</p>
          <p>Tel: 310 123 4567 | Email: info@glampingluxury.com</p>
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
              onClick={fetchCompras}
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
          <h2 style={{ margin: 0, color: "#2E5939" }}>Gestión de Compras</h2>
          <p style={{ margin: "5px 0 0 0", color: "#679750", fontSize: "14px" }}>
            {compras.length} compras registradas • {proveedores.length} proveedores • {productos.length} productos
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={fetchCompras}
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
            title="Recargar compras"
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
              setNewCompra({
                idProveedor: proveedores.length > 0 ? proveedores[0].idProveedor.toString() : "",
                metodoPago: "Transferencia",
                estado: true,
                subtotal: 0,
                iva: 0,
                total: 0
              });
              setProductosCompra([]);
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
            <FaPlus /> Nueva Compra
          </button>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 500 }}>
          <FaSearch style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#2E5939" }} />
          <input
            type="text"
            placeholder="Buscar por proveedor, producto o método de pago..."
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
          {filteredCompras.length} resultados
        </div>
      </div>

      {/* Formulario de agregar/editar - MEJORADO Y ORGANIZADO */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={{...modalContentStyle, maxWidth: '900px'}}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939", textAlign: 'center' }}>
                {isEditing ? "Editar Compra" : "Nueva Compra"}
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
            
            <form onSubmit={handleAddCompra}>
              {/* Sección de Información Básica */}
              <div style={{ 
                backgroundColor: 'rgba(46, 89, 57, 0.05)', 
                padding: '20px', 
                borderRadius: '10px',
                marginBottom: '20px',
                border: '1px solid rgba(46, 89, 57, 0.1)'
              }}>
                <h3 style={{ margin: '0 0 15px 0', color: "#2E5939", display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaInfoCircle />
                  Información Básica
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px 20px' }}>
                  <FormField
                    label={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaUser />
                        Proveedor
                      </div>
                    }
                    name="idProveedor"
                    type="select"
                    value={newCompra.idProveedor}
                    onChange={handleInputChange}
                    error={formErrors.idProveedor}
                    success={formSuccess.idProveedor}
                    warning={formWarnings.idProveedor}
                    required={true}
                    disabled={loadingProveedores || proveedores.length === 0}
                    options={proveedores.map(proveedor => ({
                      value: proveedor.idProveedor,
                      label: `${proveedor.nombre} - ${proveedor.celular}`
                    }))}
                    placeholder="Seleccionar proveedor"
                    icon={<FaUser />}
                  />

                  <FormField
                    label={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaDollarSign />
                        Método de Pago
                      </div>
                    }
                    name="metodoPago"
                    type="select"
                    value={newCompra.metodoPago}
                    onChange={handleInputChange}
                    error={formErrors.metodoPago}
                    success={formSuccess.metodoPago}
                    warning={formWarnings.metodoPago}
                    required={true}
                    options={metodoPagoOptions}
                    icon={<FaDollarSign />}
                  />

                  {/* Botón Toggle para Estado */}
                  <div style={{ gridColumn: '1 / -1', marginBottom: '15px' }}>
                    <label style={labelStyle}>
                      Estado de la Compra
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <button
                        type="button"
                        onClick={toggleEstado}
                        style={toggleButtonStyle(newCompra.estado)}
                        disabled={loading}
                      >
                        {newCompra.estado ? (
                          <>
                            <FaToggleOn size={20} />
                            <span>🟢 Activa</span>
                          </>
                        ) : (
                          <>
                            <FaToggleOff size={20} />
                            <span>🔴 Inactiva</span>
                          </>
                        )}
                      </button>
                      <span style={{ 
                        fontSize: '14px', 
                        color: newCompra.estado ? '#4caf50' : '#e57373',
                        fontWeight: '500'
                      }}>
                        {newCompra.estado 
                          ? 'La compra está activa y disponible en el sistema' 
                          : 'La compra está inactiva y no disponible en el sistema'
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
                </div>
              </div>

              {/* Sección de Productos - MEJORADA */}
              <div style={productsSectionStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, color: "#2E5939" }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaBox />
                      Productos de la Compra
                      <span style={{ 
                        backgroundColor: '#2E5939', 
                        color: 'white', 
                        borderRadius: '50%', 
                        width: '24px', 
                        height: '24px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '12px'
                      }}>
                        {productosCompra.length}
                      </span>
                    </div>
                  </h3>
                  <button
                    type="button"
                    onClick={addProducto}
                    style={{
                      backgroundColor: "#679750",
                      color: "white",
                      padding: "10px 15px",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: "600",
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = "linear-gradient(90deg, #67d630, #95d34e)";
                      e.target.style.transform = "translateY(-2px)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = "#679750";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    <FaPlus /> Agregar Producto
                  </button>
                </div>

                {productosCompra.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px', color: '#679750' }}>
                    <FaBox style={{ fontSize: '3em', marginBottom: '15px', opacity: 0.5 }} />
                    <p style={{ margin: 0, fontSize: '16px' }}>No hay productos agregados a la compra</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.7 }}>Haz clic en "Agregar Producto" para comenzar</p>
                  </div>
                ) : (
                  <>
                    <div style={productHeaderStyle}>
                      <span>Producto</span>
                      <span>Cantidad</span>
                      <span>Precio Unitario</span>
                      <span>Subtotal</span>
                      <span></span>
                    </div>
                    {productosCompra.map((producto, index) => (
                      <div key={index} style={productItemStyle}>
                        <select
                          value={producto.idProducto}
                          onChange={(e) => handleProductoChange(index, 'idProducto', e.target.value)}
                          style={{
                            ...inputStyle,
                            border: formErrors[`producto_${index}_id`] ? "1px solid #e57373" : "1px solid #ccc"
                          }}
                        >
                          {productos.map(prod => (
                            <option key={prod.idProducto} value={prod.idProducto}>
                              {prod.nombre} - ${prod.precio?.toLocaleString('es-CO') || '0'}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={producto.cantidad}
                          onChange={(e) => handleProductoChange(index, 'cantidad', e.target.value)}
                          style={{
                            ...inputStyle,
                            border: formErrors[`producto_${index}_cantidad`] ? "1px solid #e57373" : "1px solid #ccc"
                          }}
                          placeholder="Cantidad"
                        />
                        <input
                          type="text"
                          value={producto.precioUnitario}
                          onChange={(e) => handleProductoChange(index, 'precioUnitario', e.target.value)}
                          style={{
                            ...inputStyle,
                            border: formErrors[`producto_${index}_precio`] ? "1px solid #e57373" : "1px solid #ccc"
                          }}
                          placeholder="Precio"
                        />
                        <div style={{
                          ...inputStyle,
                          backgroundColor: '#F7F4EA',
                          color: '#2E5939',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          height: '42px'
                        }}>
                          ${parseFloat(producto.subtotal || 0).toLocaleString('es-CO')}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeProducto(index)}
                          style={removeButtonStyle}
                          title="Eliminar producto"
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#c62828';
                            e.target.style.transform = 'scale(1.1)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#e57373';
                            e.target.style.transform = 'scale(1)';
                          }}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Resumen de totales */}
              <div style={totalSummaryStyle}>
                <div style={totalLineStyle}>
                  <span style={totalLabelStyle}>Subtotal:</span>
                  <span style={totalValueStyle}>${newCompra.subtotal.toLocaleString('es-CO')}</span>
                </div>
                <div style={totalLineStyle}>
                  <span style={totalLabelStyle}>IVA (19%):</span>
                  <span style={totalValueStyle}>${newCompra.iva.toLocaleString('es-CO')}</span>
                </div>
                <div style={totalLineStyle}>
                  <span style={{ ...totalLabelStyle, fontSize: '1.2em' }}>Total:</span>
                  <span style={{ 
                    ...totalValueStyle, 
                    fontSize: '1.2em', 
                    backgroundColor: '#679750', 
                    color: 'white',
                    border: '2px solid #2E5939'
                  }}>
                    ${newCompra.total.toLocaleString('es-CO')}
                  </span>
                </div>
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
                  {loading ? "Guardando..." : (isEditing ? "Actualizar Compra" : "Guardar Compra")}
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
      {showDetails && selectedCompra && (
        <div style={modalOverlayStyle}>
          <div style={{...detailsModalStyle, maxWidth: '700px'}}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939", textAlign: 'center' }}>Detalles de la Compra #{selectedCompra.idCompra}</h2>
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
                <div style={detailLabelStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaUser />
                    Proveedor
                  </div>
                </div>
                <div style={detailValueStyle}>{getProveedorNombre(selectedCompra.idProveedor)}</div>
              </div>
              
              {/* Información detallada del proveedor */}
              {(() => {
                const proveedorInfo = getProveedorInfo(selectedCompra.idProveedor);
                return (
                  <>
                    <div style={detailItemStyle}>
                      <div style={detailLabelStyle}>Contacto Proveedor</div>
                      <div style={detailValueStyle}>{proveedorInfo.celular}</div>
                    </div>
                    <div style={detailItemStyle}>
                      <div style={detailLabelStyle}>Email Proveedor</div>
                      <div style={detailValueStyle}>{proveedorInfo.correo}</div>
                    </div>
                  </>
                );
              })()}
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Método de Pago</div>
                <div style={detailValueStyle}>{selectedCompra.metodoPago}</div>
              </div>

              {/* Productos de la compra - MEJORADO */}
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaBox />
                    Productos ({selectedDetalleCompras.length})
                  </div>
                </div>
                <div style={detailValueStyle}>
                  {selectedDetalleCompras.length > 0 ? (
                    <div style={{ marginTop: '10px' }}>
                      {selectedDetalleCompras.map((detalle, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px',
                          backgroundColor: 'rgba(46, 89, 57, 0.05)',
                          borderRadius: '8px',
                          marginBottom: '8px',
                          border: '1px solid rgba(46, 89, 57, 0.1)'
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                              {getProductoNombre(detalle.idProducto)}
                            </div>
                            <div style={{ fontSize: '14px', color: '#679750' }}>
                              Cantidad: {detalle.cantidad} | 
                              Precio unitario: ${(detalle.subtotal / detalle.cantidad).toLocaleString('es-CO')}
                            </div>
                          </div>
                          <div style={{ fontWeight: 'bold', color: '#2E5939' }}>
                            ${detalle.subtotal.toLocaleString('es-CO')}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: '#e57373', fontStyle: 'italic' }}>
                      No hay productos registrados para esta compra
                    </div>
                  )}
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Subtotal</div>
                <div style={detailValueStyle}>${selectedCompra.subtotal.toLocaleString('es-CO')}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>IVA (19%)</div>
                <div style={detailValueStyle}>${selectedCompra.iva.toLocaleString('es-CO')}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Total</div>
                <div style={{...detailValueStyle, fontWeight: 'bold', color: '#679750', fontSize: '1.2em'}}>
                  ${selectedCompra.total.toLocaleString('es-CO')}
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Estado</div>
                <div style={{
                  ...detailValueStyle,
                  color: selectedCompra.estado ? '#4caf50' : '#e57373',
                  fontWeight: 'bold'
                }}>
                  {selectedCompra.estado ? '🟢 Activa' : '🔴 Inactiva'}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: 20 }}>
              <button
                onClick={() => handleOpenPdfModal(selectedCompra)}
                style={{
                  backgroundColor: "#2E5939",
                  color: "#fff",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontWeight: "600",
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
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
                <FaFilePdf /> Exportar PDF
              </button>
              <button
                onClick={closeDetailsModal}
                style={{
                  backgroundColor: "#ccc",
                  color: "#333",
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
      {showDeleteConfirm && compraToDelete && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 450, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 20, color: "#2E5939" }}>Confirmar Eliminación</h3>
            <p style={{ marginBottom: 30, fontSize: '1.1rem', color: "#2E5939" }}>
              ¿Estás seguro de eliminar la compra del proveedor "<strong>{getProveedorNombre(compraToDelete.idProveedor)}</strong>"?
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
                <strong style={{ color: '#856404' }}>Información</strong>
              </div>
              <p style={{ color: '#856404', margin: 0, fontSize: '0.9rem' }}>
                Total: ${compraToDelete.total.toLocaleString('es-CO')} | Productos: {getProductosDeCompra(compraToDelete.idCompra).length}
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

      {/* Modal de PDF */}
      {showPdfModal && selectedCompra && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 500, textAlign: 'center' }}>
            <h2 style={{ marginBottom: 20, color: "#2E5939" }}>Exportar a PDF</h2>
            <p style={{ marginBottom: 30, color: "#2E5939" }}>
              ¿Estás seguro que deseas exportar la compra #{selectedCompra.idCompra} a PDF?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <button
                onClick={handleConfirmExportPdf}
                style={{
                  backgroundColor: "#2E5939",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontWeight: "600",
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
                Exportar
              </button>
              <button
                onClick={handleClosePdfModal}
                style={{
                  backgroundColor: "#ccc",
                  color: "#333",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
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
              🔄 Cargando compras...
            </div>
          </div>
        )}

        {/* Tabla - ACTUALIZADA CON NOMBRES DE PRODUCTOS */}
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
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Método Pago</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Productos</th>
                <th style={{ padding: "15px", textAlign: "right", fontWeight: "bold" }}>Total</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Estado</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCompras.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <FaBox size={30} color="#679750" />
                      {compras.length === 0 ? "No hay compras registradas" : "No se encontraron resultados"}
                      {compras.length === 0 && (
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
                          Agregar Primera Compra
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCompras.map((compra) => {
                  const productosCompra = getProductosDeCompra(compra.idCompra);
                  const nombresProductos = getNombresProductosCompra(compra.idCompra);
                  
                  return (
                    <tr key={compra.idCompra} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "15px", fontWeight: "500" }}>
                        {getProveedorNombre(compra.idProveedor)}
                      </td>
                      <td style={{ padding: "15px" }}>{compra.metodoPago}</td>
                      <td style={{ padding: "15px" }}>
                        <div style={{ maxWidth: '300px' }}>
                          <div style={{ marginBottom: '5px', fontWeight: '500' }}>
                            {nombresProductos}
                          </div>
                          {productosCompra.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {productosCompra.slice(0, 3).map((producto, index) => (
                                <span key={index} style={productChipStyle}>
                                  {producto.cantidad}x {producto.nombre}
                                </span>
                              ))}
                              {productosCompra.length > 3 && (
                                <span style={productChipStyle}>
                                  +{productosCompra.length - 3} más
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "15px", textAlign: "right", fontWeight: "bold" }}>
                        ${compra.total.toLocaleString('es-CO')}
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <button
                          onClick={() => toggleEstadoCompra(compra)}
                          style={{
                            cursor: "pointer",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            border: "none",
                            backgroundColor: compra.estado ? "#4caf50" : "#e57373",
                            color: "white",
                            fontWeight: "600",
                            fontSize: "12px",
                            minWidth: "80px",
                            transition: "all 0.3s ease",
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = "scale(1.05)";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = "scale(1)";
                          }}
                        >
                          {compra.estado ? "Activa" : "Inactiva"}
                        </button>
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                          <button
                            onClick={() => handleView(compra)}
                            style={btnAccion("#F7F4EA", "#2E5939")}
                            title="Ver Detalles"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleEdit(compra)}
                            style={btnAccion("#F7F4EA", "#2E5939")}
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(compra)}
                            style={btnAccion("#fbe9e7", "#e57373")}
                            title="Eliminar"
                          >
                            <FaTrash />
                          </button>
                          <button
                            onClick={() => handleOpenPdfModal(compra)}
                            style={btnAccion("#cfe2f3", "#2E5939")}
                            title="Exportar PDF"
                          >
                            <FaFilePdf />
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

      {/* Estadísticas */}
      {!loading && compras.length > 0 && (
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
              {compras.length}
            </div>
            <div style={{ fontSize: '14px', color: '#679750' }}>
              Total Compras
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
              {compras.filter(c => c.estado).length}
            </div>
            <div style={{ fontSize: '14px', color: '#679750' }}>
              Compras Activas
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
              {productos.length}
            </div>
            <div style={{ fontSize: '14px', color: '#679750' }}>
              Productos
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
              ${compras.reduce((sum, compra) => sum + compra.total, 0).toLocaleString('es-CO')}
            </div>
            <div style={{ fontSize: '14px', color: '#679750' }}>
              Valor Total Compras
            </div>
          </div>
        </div>
      )}

      {/* Componente oculto para el PDF */}
      <div style={{ position: 'absolute', left: '-9999px' }}>
        <div ref={targetRef}>
          {selectedCompra && (
            <PDFTemplate 
              compra={selectedCompra} 
              proveedor={getProveedorInfo(selectedCompra.idProveedor)}
              detallesCompra={selectedDetalleCompras}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCompras;