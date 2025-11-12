// src/components/AdminCompras.jsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  FaEye, FaEdit, FaTrash, FaPlus, FaMinus, FaFilePdf, FaTimes, 
  FaSearch, FaExclamationTriangle, FaCheck, FaInfoCircle, FaBox, 
  FaShoppingCart, FaDollarSign, FaUser, FaSync, FaToggleOn, 
  FaToggleOff, FaFileAlt, FaSlidersH
} from "react-icons/fa";
import { usePDF } from 'react-to-pdf';
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
  maxWidth: 700,
  color: "#2E5939",
  boxSizing: 'border-box',
  maxHeight: '80vh',
  overflowY: 'auto',
  border: "2px solid #679750",
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

// ===============================================
// VALIDACIONES
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
const API_COMPRAS = "http://localhost:5272/api/Compras";
const API_PROVEEDORES = "http://localhost:5272/api/Proveedore";
const API_PRODUCTOS = "http://localhost:5272/api/Productos";
const API_DETALLE_COMPRAS = "http://localhost:5272/api/DetalleCompras";
const IVA_RATE = 0.19;
const ITEMS_PER_PAGE = 10;

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
      const placeholderOption = { value: "", label: placeholder || "Seleccionar", disabled: required };
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
            onBlur={onBlur}
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
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={(name === 'cantidad' || name === 'precioUnitario') ? handleFilteredInputChange : onChange}
            onBlur={onBlur}
            style={getInputStyle()}
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
// COMPONENTE PRINCIPAL AdminCompras
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
    estado: true
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
  const [error, setError] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  
  // Estados para filtros
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    estado: "all",
    metodoPago: "all",
    proveedor: "all",
    fechaDesde: "",
    fechaHasta: ""
  });

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

  useEffect(() => {
    if (showForm) {
      Object.keys(touchedFields).forEach(fieldName => {
        if (touchedFields[fieldName]) {
          validateField(fieldName, newCompra[fieldName]);
        }
      });
    }
  }, [newCompra, showForm, touchedFields]);

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
        return <FaCheck style={{ fontSize: '20px', flexShrink: 0 }} />;
      case "error":
        return <FaExclamationTriangle style={{ fontSize: '20px', flexShrink: 0 }} />;
      case "warning":
        return <FaExclamationTriangle style={{ fontSize: '20px', flexShrink: 0 }} />;
      default:
        return <FaInfoCircle style={{ fontSize: '20px', flexShrink: 0 }} />;
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
    try {
      const res = await axios.get(API_PROVEEDORES, {
        timeout: 10000
      });
      
      if (Array.isArray(res.data)) {
        setProveedores(res.data);
      }
    } catch (error) {
      console.error("❌ Error al obtener proveedores:", error);
      handleApiError(error, "cargar los proveedores");
    }
  };

  const fetchProductos = async () => {
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
    const allFieldsTouched = {
      idProveedor: true,
      metodoPago: true
    };
    setTouchedFields(allFieldsTouched);

    const proveedorValid = validateField('idProveedor', newCompra.idProveedor);
    const metodoPagoValid = validateField('metodoPago', newCompra.metodoPago);

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

  const markFieldAsTouched = (fieldName) => {
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
  };

  // ===============================================
  // FUNCIONES PRINCIPALES
  // ===============================================
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
      const { subtotal, iva, total } = calcularTotales();

      const compraData = {
        idCompra: isEditing ? parseInt(newCompra.idCompra) : 0,
        idProveedor: parseInt(newCompra.idProveedor),
        metodoPago: newCompra.metodoPago,
        estado: newCompra.estado,
        subtotal: subtotal,
        iva: iva,
        total: total,
        fechaCompra: isEditing ? newCompra.fechaCompra : new Date().toISOString()
      };

      console.log("📤 Enviando datos de compra:", compraData);

      let compraId;

      if (isEditing) {
        // Actualizar compra existente
        const response = await axios.put(`${API_COMPRAS}/${newCompra.idCompra}`, compraData, {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        compraId = newCompra.idCompra;
        
        // Eliminar detalles existentes y crear nuevos
        try {
          const detallesExistentes = await fetchDetalleComprasByCompraId(compraId);
          for (const detalle of detallesExistentes) {
            await axios.delete(`${API_DETALLE_COMPRAS}/${detalle.idDetalleCompra}`);
          }
        } catch (error) {
          console.warn("No se pudieron eliminar los detalles existentes:", error);
        }
        
        displayAlert("Compra actualizada exitosamente.", "success");
      } else {
        // Crear nueva compra
        const response = await axios.post(API_COMPRAS, compraData, {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        compraId = response.data.idCompra;
        displayAlert("Compra agregada exitosamente.", "success");
      }

      // Crear detalles de compra
      for (const producto of productosCompra) {
        const subtotalProducto = parseFloat(producto.subtotal);
        const ivaProducto = subtotalProducto * IVA_RATE;
        const totalProducto = subtotalProducto + ivaProducto;
        
        const detalleData = {
          idCompra: compraId,
          idProducto: parseInt(producto.idProducto),
          cantidad: parseInt(producto.cantidad),
          subtotal: subtotalProducto,
          iva: ivaProducto,
          total: totalProducto
        };

        console.log("📤 Enviando detalle:", detalleData);

        await axios.post(API_DETALLE_COMPRAS, detalleData, {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      await fetchCompras();
      await fetchDetalleCompras();
      closeForm();
    } catch (error) {
      console.error("❌ Error al guardar compra:", error);
      
      // Mostrar más detalles del error
      let errorMessage = "Error al guardar la compra";
      
      if (error.response) {
        // El servidor respondió con un código de error
        console.log("📋 Detalles del error:", error.response.data);
        errorMessage = error.response.data || `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        errorMessage = "No se recibió respuesta del servidor";
      } else {
        // Algo pasó al configurar la petición
        errorMessage = error.message;
      }
      
      displayAlert(errorMessage, "error");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  // ===============================================
  // FUNCION AUXILIAR PARA ELIMINAR COMPRA
  // ===============================================
  const confirmDelete = async () => {
    if (!compraToDelete) return;
    
    setLoading(true);
    try {
      await axios.delete(`${API_COMPRAS}/${compraToDelete.idCompra}`, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      displayAlert("Compra eliminada exitosamente.", "success");
      await fetchCompras();
      await fetchDetalleCompras();
    } catch (error) {
      console.error("❌ Error al eliminar compra:", error);
      handleApiError(error, "eliminar la compra");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setCompraToDelete(null);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCompra((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInputBlur = (e) => {
    const { name } = e.target;
    markFieldAsTouched(name);
    validateField(name, newCompra[name]);
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
    setTouchedFields({});
    setNewCompra({
      idProveedor: proveedores.length > 0 ? proveedores[0].idProveedor.toString() : "",
      metodoPago: "Transferencia",
      estado: true
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
    setLoading(true);
    try {
      const detalles = await fetchDetalleComprasByCompraId(compra.idCompra);
      
      setNewCompra({
        ...compra,
        idProveedor: compra.idProveedor.toString()
      });
      
      // Mapear correctamente los productos para edición
      const productosEdit = detalles.map(detalle => {
        const productoInfo = productos.find(p => p.idProducto === detalle.idProducto);
        return {
          idProducto: detalle.idProducto.toString(),
          cantidad: detalle.cantidad.toString(),
          precioUnitario: (detalle.subtotal / detalle.cantidad).toFixed(2),
          subtotal: detalle.subtotal,
          nombre: productoInfo ? productoInfo.nombre : `Producto ${detalle.idProducto}`
        };
      });
      
      setProductosCompra(productosEdit);
      setIsEditing(true);
      setShowForm(true);
      setFormErrors({});
      setFormSuccess({});
      setFormWarnings({});
      setTouchedFields({});
    } catch (error) {
      console.error("Error al cargar datos para editar:", error);
      displayAlert("Error al cargar los datos de la compra", "error");
    } finally {
      setLoading(false);
    }
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
  // FUNCIONES DE GESTIÓN DE PRODUCTOS
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
  };

  const calcularTotales = () => {
    const subtotal = productosCompra.reduce((sum, producto) => sum + (parseFloat(producto.subtotal) || 0), 0);
    const iva = subtotal * IVA_RATE;
    const total = subtotal + iva;
    
    return { subtotal, iva, total };
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
      estado: "all",
      metodoPago: "all",
      proveedor: "all",
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
    if (filters.proveedor !== "all") count++;
    if (filters.fechaDesde) count++;
    if (filters.fechaHasta) count++;
    return count;
  }, [filters]);

  // ===============================================
  // FUNCIONES PARA OBTENER NOMBRES Y DETALLES
  // ===============================================
  const getProductoNombre = (idProducto) => {
    const producto = productos.find(p => p.idProducto === idProducto);
    return producto ? producto.nombre : `Producto ${idProducto}`;
  };

  const getProductosDeCompra = (idCompra) => {
    const detalles = detalleCompras.filter(dc => dc.idCompra === idCompra);
    return detalles.map(detalle => {
      const producto = productos.find(p => p.idProducto === detalle.idProducto);
      return {
        nombre: producto ? producto.nombre : `Producto ${detalle.idProducto}`,
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
      // Búsqueda general
      const proveedor = proveedores.find(p => p.idProveedor === compra.idProveedor);
      const productosCompra = getNombresProductosCompra(compra.idCompra);
      
      const matchesSearch = 
        proveedor?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        compra.metodoPago?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        productosCompra.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Filtro por estado
      if (filters.estado !== "all") {
        const estadoFilter = filters.estado === "activo";
        if (compra.estado !== estadoFilter) return false;
      }

      // Filtro por método de pago
      if (filters.metodoPago !== "all" && compra.metodoPago !== filters.metodoPago) {
        return false;
      }

      // Filtro por proveedor
      if (filters.proveedor !== "all" && compra.idProveedor !== parseInt(filters.proveedor)) {
        return false;
      }

      return true;
    });
  }, [compras, proveedores, searchTerm, detalleCompras, productos, filters]);

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
          <p><strong>Nombre:</strong> {proveedor.nombre}</p>
          <p><strong>Contacto:</strong> {proveedor.celular}</p>
          <p><strong>Email:</strong> {proveedor.correo}</p>
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

  // Calcular totales para mostrar en el formulario
  const { subtotal, iva, total } = calcularTotales();

  // ===============================================
  // RENDERIZADO
  // ===============================================
  return (
    <div style={{ position: "relative", padding: 20, marginLeft: 260, backgroundColor: "#f5f8f2", minHeight: "100vh" }}>
      
      {/* Alerta */}
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
            {compras.length} compras registradas • {compras.filter(c => c.estado).length} activas
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
            setNewCompra({
              idProveedor: proveedores.length > 0 ? proveedores[0].idProveedor.toString() : "",
              metodoPago: "Transferencia",
              estado: true
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

      {/* Estadísticas */}
      {!loading && compras.length > 0 && (
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
              {compras.length}
            </div>
            <div style={{ fontSize: '16px', color: '#679750', fontWeight: '600' }}>
              Total Compras
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
              {compras.filter(c => c.estado).length}
            </div>
            <div style={{ fontSize: '16px', color: '#4caf50', fontWeight: '600' }}>
              Compras Activas
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
              {compras.filter(c => !c.estado).length}
            </div>
            <div style={{ fontSize: '16px', color: '#e57373', fontWeight: '600' }}>
              Compras Inactivas
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
              ${compras.reduce((sum, compra) => sum + compra.total, 0).toLocaleString('es-CO')}
            </div>
            <div style={{ fontSize: '16px', color: '#2196f3', fontWeight: '600' }}>
              Valor Total
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
                  <option value="inactivo">Inactivas</option>
                </select>
              </div>

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
                  <option value="Transferencia">Transferencia</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Proveedor</label>
                <select
                  name="proveedor"
                  value={filters.proveedor}
                  onChange={handleFilterChange}
                  style={{
                    ...inputStyle,
                    width: '100%'
                  }}
                >
                  <option value="all">Todos los proveedores</option>
                  {proveedores.map(proveedor => (
                    <option key={proveedor.idProveedor} value={proveedor.idProveedor}>
                      {proveedor.nombre}
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
            </div>
          </div>
        )}

        {filteredCompras.length !== compras.length && (
          <div style={{
            marginTop: '10px',
            padding: '8px 12px',
            backgroundColor: '#E8F5E8',
            borderRadius: '6px',
            color: '#2E5939',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Mostrando {filteredCompras.length} de {compras.length} compras
            {activeFiltersCount > 0 && ` (filtros aplicados: ${activeFiltersCount})`}
          </div>
        )}
      </div>

      {/* Formulario de agregar/editar */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={{...modalContentStyle, maxWidth: '900px'}}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939" }}>
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
                disabled={isSubmitting}
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleAddCompra}>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px 20px',
                padding: '0 10px'
              }}>
                <FormField
                  label="Proveedor"
                  name="idProveedor"
                  type="select"
                  value={newCompra.idProveedor}
                  onChange={handleChange}
                  onBlur={handleInputBlur}
                  error={formErrors.idProveedor}
                  success={formSuccess.idProveedor}
                  warning={formWarnings.idProveedor}
                  required={true}
                  disabled={loading || proveedores.length === 0}
                  options={proveedores.map(proveedor => ({
                    value: proveedor.idProveedor,
                    label: `${proveedor.nombre} - ${proveedor.celular}`
                  }))}
                  placeholder="Seleccionar proveedor"
                  icon={<FaUser />}
                />

                <FormField
                  label="Método de Pago"
                  name="metodoPago"
                  type="select"
                  value={newCompra.metodoPago}
                  onChange={handleChange}
                  onBlur={handleInputBlur}
                  error={formErrors.metodoPago}
                  success={formSuccess.metodoPago}
                  warning={formWarnings.metodoPago}
                  required={true}
                  options={metodoPagoOptions}
                  icon={<FaDollarSign />}
                />
              </div>

              {/* Sección de Productos */}
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
                          style={inputStyle}
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
                          style={inputStyle}
                          placeholder="Cantidad"
                        />
                        <input
                          type="text"
                          value={producto.precioUnitario}
                          onChange={(e) => handleProductoChange(index, 'precioUnitario', e.target.value)}
                          style={inputStyle}
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
                  <span style={totalValueStyle}>${subtotal.toLocaleString('es-CO')}</span>
                </div>
                <div style={totalLineStyle}>
                  <span style={totalLabelStyle}>IVA (19%):</span>
                  <span style={totalValueStyle}>${iva.toLocaleString('es-CO')}</span>
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
                    ${total.toLocaleString('es-CO')}
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
              <h2 style={{ margin: 0, color: "#2E5939" }}>Detalles de la Compra #{selectedCompra.idCompra}</h2>
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
              <div style={{ marginBottom: 15, paddingBottom: 15, borderBottom: "1px solid rgba(46, 89, 57, 0.1)" }}>
                <div style={{ fontWeight: "bold", color: "#2E5939", marginBottom: 5, fontSize: "14px" }}>Proveedor</div>
                <div style={{ fontSize: 16, color: "#2E5939", fontWeight: "500" }}>{getProveedorNombre(selectedCompra.idProveedor)}</div>
              </div>
              
              <div style={{ marginBottom: 15, paddingBottom: 15, borderBottom: "1px solid rgba(46, 89, 57, 0.1)" }}>
                <div style={{ fontWeight: "bold", color: "#2E5939", marginBottom: 5, fontSize: "14px" }}>Método de Pago</div>
                <div style={{ fontSize: 16, color: "#2E5939", fontWeight: "500" }}>{selectedCompra.metodoPago}</div>
              </div>

              {/* Productos de la compra */}
              <div style={{ marginBottom: 15, paddingBottom: 15, borderBottom: "1px solid rgba(46, 89, 57, 0.1)" }}>
                <div style={{ fontWeight: "bold", color: "#2E5939", marginBottom: 5, fontSize: "14px" }}>Productos ({selectedDetalleCompras.length})</div>
                <div style={{ fontSize: 16, color: "#2E5939", fontWeight: "500" }}>
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

              <div style={{ marginBottom: 15, paddingBottom: 15, borderBottom: "1px solid rgba(46, 89, 57, 0.1)" }}>
                <div style={{ fontWeight: "bold", color: "#2E5939", marginBottom: 5, fontSize: "14px" }}>Subtotal</div>
                <div style={{ fontSize: 16, color: "#2E5939", fontWeight: "500" }}>${selectedCompra.subtotal.toLocaleString('es-CO')}</div>
              </div>

              <div style={{ marginBottom: 15, paddingBottom: 15, borderBottom: "1px solid rgba(46, 89, 57, 0.1)" }}>
                <div style={{ fontWeight: "bold", color: "#2E5939", marginBottom: 5, fontSize: "14px" }}>IVA (19%)</div>
                <div style={{ fontSize: 16, color: "#2E5939", fontWeight: "500" }}>${selectedCompra.iva.toLocaleString('es-CO')}</div>
              </div>

              <div style={{ marginBottom: 15, paddingBottom: 15, borderBottom: "1px solid rgba(46, 89, 57, 0.1)" }}>
                <div style={{ fontWeight: "bold", color: "#2E5939", marginBottom: 5, fontSize: "14px" }}>Total</div>
                <div style={{ fontSize: 18, color: "#679750", fontWeight: "bold" }}>${selectedCompra.total.toLocaleString('es-CO')}</div>
              </div>

              <div style={{ marginBottom: 15, paddingBottom: 15, borderBottom: "1px solid rgba(46, 89, 57, 0.1)" }}>
                <div style={{ fontWeight: "bold", color: "#2E5939", marginBottom: 5, fontSize: "14px" }}>Estado</div>
                <div style={{
                  fontSize: 16,
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
          <div style={{ ...modalContentStyle, maxWidth: 500, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 12, color: "#2E5939" }}>Confirmar Eliminación</h3>
            <p style={{ marginBottom: 18, fontSize: '1rem', color: "#2E5939" }}>
              ¿Estás seguro de eliminar de forma permanente la compra del proveedor "<strong>{getProveedorNombre(compraToDelete.idProveedor)}</strong>"? Esta acción no se puede deshacer.
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
                Se eliminarán todos los productos asociados a esta compra.
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
                      <FaInfoCircle size={30} color="#679750" />
                      {compras.length === 0 ? "No hay compras registradas" : "No se encontraron resultados con los filtros aplicados"}
                      {activeFiltersCount > 0 && (
                        <div style={{ color: '#679750', fontSize: '14px', marginTop: '5px' }}>
                          Filtros activos: {activeFiltersCount}
                        </div>
                      )}
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
                      {compras.length > 0 && activeFiltersCount > 0 && (
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
                paginatedCompras.map((compra) => {
                  const nombresProductos = getNombresProductosCompra(compra.idCompra);
                  
                  return (
                    <tr key={compra.idCompra} style={{ 
                      borderBottom: "1px solid #eee",
                      backgroundColor: compra.estado ? '#fff' : '#f9f9f9'
                    }}>
                      <td style={{ padding: "15px", fontWeight: "500" }}>
                        {getProveedorNombre(compra.idProveedor)}
                      </td>
                      <td style={{ padding: "15px" }}>{compra.metodoPago}</td>
                      <td style={{ padding: "15px" }}>
                        <div style={{ maxWidth: '300px' }}>
                          <div style={{ marginBottom: '5px', fontWeight: '500' }}>
                            {nombresProductos}
                          </div>
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
                          {compra.estado ? "Activa" : "Inactiva"}
                        </button>
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
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
                            style={btnAccion("#F7F4EA", "#2E5939")}
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
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 10, alignItems: "center" }}>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ccc",
              backgroundColor: currentPage === 1 ? "#e0e0e0" : "#F7F4EA",
              color: "#2E5939",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
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
                    style={{
                      cursor: "pointer",
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "1px solid #2E5939",
                      backgroundColor: currentPage === i ? "#2E5939" : "#F7F4EA",
                      color: currentPage === i ? "white" : "#2E5939",
                      fontWeight: "600",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
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
            style={{
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ccc",
              backgroundColor: currentPage === totalPages ? "#e0e0e0" : "#F7F4EA",
              color: "#2E5939",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
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