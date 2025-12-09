// src/components/AdminCompras.jsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  FaEye, FaEdit, FaTrash, FaPlus, FaMinus, FaFilePdf, FaTimes,
  FaSearch, FaExclamationTriangle, FaCheck, FaInfoCircle, FaBox,
  FaShoppingCart, FaDollarSign, FaUser, FaSync, FaToggleOn,
  FaToggleOff, FaFileAlt, FaSlidersH, FaBuilding, FaCalendarAlt,
  FaIdCard, FaPhone, FaEnvelope, FaMapMarkerAlt, FaListAlt
} from "react-icons/fa";
import { usePDF } from 'react-to-pdf';
import axios from "axios";

// ===============================================
// ESTILOS MEJORADOS (CONSISTENTES CON EL SISTEMA)
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
  overflow: "auto",
  padding: "20px 0",
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

// ESTILOS MEJORADOS PARA MODAL DE DETALLES
const detailsModalStyle = {
  backgroundColor: "#fff",
  padding: 0,
  borderRadius: 16,
  boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
  width: "90%",
  maxWidth: 850,
  color: "#2E5939",
  boxSizing: 'border-box',
  maxHeight: '90vh',
  overflow: 'hidden',
  border: "3px solid #679750",
  position: 'relative',
};

const detailItemStyle = {
  marginBottom: 18,
  paddingBottom: 18,
  borderBottom: "1px solid rgba(46, 89, 57, 0.15)",
  display: 'flex',
  alignItems: 'flex-start',
  gap: '15px'
};

const detailLabelStyle = {
  fontWeight: "bold",
  color: "#2E5939",
  fontSize: "15px",
  minWidth: '150px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const detailValueStyle = {
  fontSize: 16,
  color: "#2E5939",
  fontWeight: "500",
  flex: 1
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
  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 40px',
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
  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 40px',
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

    if (name === 'cantidad') {
      filteredValue = value.replace(/[^0-9]/g, "");
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
            onChange={(name === 'cantidad') ? handleFilteredInputChange : onChange}
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
// COMPONENTE PRINCIPAL AdminCompras MEJORADO
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
  // EFECTOS PARA CONTROLAR EL SCROLL DEL BODY
  // ===============================================
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

  // Efecto para controlar el scroll del body cuando se abren modales
  useEffect(() => {
    if (showForm || showDetails || showDeleteConfirm || showPdfModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showForm, showDetails, showDeleteConfirm, showPdfModal]);

  useEffect(() => {
    fetchCompras();
    fetchProveedores();
    fetchProductos();
    fetchDetalleCompras();
  }, []);

  // Validar formulario en tiempo real solo para campos tocados
  useEffect(() => {
    if (showForm) {
      Object.keys(touchedFields).forEach(fieldName => {
        if (touchedFields[fieldName]) {
          validateField(fieldName, newCompra[fieldName]);
        }
      });
    }
  }, [newCompra, showForm, touchedFields]);

  // Calcular totales cuando cambian los productos
  useEffect(() => {
    calcularTotales();
  }, [productosCompra]);

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
        // Filtrar solo productos activos
        const productosActivos = res.data.filter(producto => producto.estado);
        setProductos(productosActivos);
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
    else if (trimmedValue && fieldName === 'cantidad') {
      const numericValue = parseInt(trimmedValue);
     
      if (isNaN(numericValue)) {
        error = rules.errorMessages.invalid;
      } else if (rules.min !== undefined && numericValue < rules.min) {
        error = rules.errorMessages.min;
      } else if (rules.max !== undefined && numericValue > rules.max) {
        error = rules.errorMessages.max;
      } else {
        success = "Cantidad válida.";
       
        // Advertencias específicas
        if (numericValue > 100) {
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
    // Marcar todos los campos como tocados al enviar el formulario
    const allFieldsTouched = {
      idProveedor: true,
      metodoPago: true
    };
    setTouchedFields(allFieldsTouched);

    const proveedorValid = validateField('idProveedor', newCompra.idProveedor);
    const metodoPagoValid = validateField('metodoPago', newCompra.metodoPago);

    // Validar productos
    if (productosCompra.length === 0) {
      displayAlert("Debe agregar al menos un producto a la compra.", "error");
      return false;
    }

    // Validar cantidades de productos
    for (const producto of productosCompra) {
      const cantidadValid = validateField('cantidad', producto.cantidad);
      if (!cantidadValid) {
        displayAlert("Por favor, corrige los errores en los productos antes de guardar.", "error");
        return false;
      }

      // Validar que la cantidad no exceda el stock disponible (solo para productos existentes)
      const productoInfo = productos.find(p => p.idProducto === parseInt(producto.idProducto));
      if (productoInfo && parseInt(producto.cantidad) > productoInfo.cantidad) {
        displayAlert(`La cantidad para ${productoInfo.nombre} excede el stock disponible (${productoInfo.cantidad} unidades).`, "error");
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

  // Función para marcar campo como tocado
  const markFieldAsTouched = (fieldName) => {
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
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
      // Calcular totales finales
      const { subtotal, iva, total } = calcularTotales();

      const compraData = {
        idProveedor: parseInt(newCompra.idProveedor),
        metodoPago: newCompra.metodoPago,
        estado: newCompra.estado,
        subtotal: subtotal,
        iva: iva,
        total: total
      };

      console.log("📤 Enviando datos de compra:", compraData);

      let compraId;

      if (isEditing) {
        // Actualizar compra existente
        await axios.put(`${API_COMPRAS}/${newCompra.idCompra}`, compraData, {
          headers: { 'Content-Type': 'application/json' }
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
          headers: { 'Content-Type': 'application/json' }
        });
        compraId = response.data.idCompra;
        displayAlert("Compra agregada exitosamente.", "success");
      }

      // Crear detalles de compra y actualizar stock de productos
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

        // Actualizar stock del producto
        const productoActual = productos.find(p => p.idProducto === parseInt(producto.idProducto));
        if (productoActual) {
          const nuevoStock = productoActual.cantidad + parseInt(producto.cantidad);
          await axios.put(`${API_PRODUCTOS}/${producto.idProducto}`, {
            ...productoActual,
            cantidad: nuevoStock
          }, {
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      await fetchCompras();
      await fetchProductos(); // Actualizar la lista de productos con los nuevos stocks
      await fetchDetalleCompras();
      closeForm();
    } catch (error) {
      console.error("❌ Error al guardar compra:", error);
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
        // Primero eliminar los detalles de compra
        try {
          const detallesAsociados = await fetchDetalleComprasByCompraId(compraToDelete.idCompra);
          for (const detalle of detallesAsociados) {
            await axios.delete(`${API_DETALLE_COMPRAS}/${detalle.idDetalleCompra}`);
          }
        } catch (error) {
          console.warn("No se pudieron eliminar los detalles de la compra:", error);
        }
       
        // Luego eliminar la compra
        await axios.delete(`${API_COMPRAS}/${compraToDelete.idCompra}`);
        displayAlert("Compra eliminada exitosamente.", "success");
       
        await fetchCompras();
        await fetchDetalleCompras();
       
        if (paginatedCompras.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("❌ Error al eliminar compra:", error);
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
    setTouchedFields({});
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
  // FUNCIONES DE GESTIÓN DE PRODUCTOS EN COMPRA - MEJORADAS PARA MÚLTIPLES PRODUCTOS
  // ===============================================
  const addProducto = () => {
    if (productos.length === 0) {
      displayAlert("No hay productos disponibles para agregar.", "warning");
      return;
    }
   
    // Encontrar productos que no estén ya en la lista
    const productosDisponibles = productos.filter(producto =>
      !productosCompra.some(pc => parseInt(pc.idProducto) === producto.idProducto)
    );
   
    if (productosDisponibles.length === 0) {
      displayAlert("Todos los productos disponibles ya han sido agregados a la compra.", "warning");
      return;
    }
   
    const primerProductoDisponible = productosDisponibles[0];
    const nuevoProducto = {
      idProducto: primerProductoDisponible.idProducto.toString(),
      cantidad: "1",
      precioUnitario: primerProductoDisponible.precio.toString(),
      subtotal: primerProductoDisponible.precio,
      stockDisponible: primerProductoDisponible.cantidad
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
   
    if (field === 'cantidad') {
      value = value.replace(/[^0-9]/g, "");
    }
   
    nuevosProductos[index][field] = value;
   
    if (field === 'idProducto') {
      // Cuando se cambia el producto, actualizar el precio unitario y stock disponible
      const productoSeleccionado = productos.find(p => p.idProducto === parseInt(value));
      if (productoSeleccionado) {
        nuevosProductos[index].precioUnitario = productoSeleccionado.precio.toString();
        nuevosProductos[index].stockDisponible = productoSeleccionado.cantidad;
        // Recalcular subtotal
        const cantidad = parseFloat(nuevosProductos[index].cantidad) || 0;
        nuevosProductos[index].subtotal = cantidad * productoSeleccionado.precio;
      }
    } else if (field === 'cantidad') {
      // Recalcular subtotal cuando cambia la cantidad
      const cantidad = parseFloat(value) || 0;
      const precioUnitario = parseFloat(nuevosProductos[index].precioUnitario) || 0;
      nuevosProductos[index].subtotal = cantidad * precioUnitario;
    }
   
    setProductosCompra(nuevosProductos);
  };

  // Función para obtener productos disponibles (excluyendo los ya seleccionados)
  const getProductosDisponibles = (currentIndex) => {
    return productos.filter(producto => {
      // Incluir el producto actualmente seleccionado en este índice
      const productoActual = productosCompra[currentIndex];
      if (productoActual && parseInt(productoActual.idProducto) === producto.idProducto) {
        return true;
      }
      // Excluir productos que ya están seleccionados en otros índices
      return !productosCompra.some((pc, index) =>
        index !== currentIndex && parseInt(pc.idProducto) === producto.idProducto
      );
    });
  };

  const calcularTotales = () => {
    const subtotal = productosCompra.reduce((sum, producto) => sum + (parseFloat(producto.subtotal) || 0), 0);
    const iva = subtotal * IVA_RATE;
    const total = subtotal + iva;
   
    return { subtotal, iva, total };
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
  // FUNCIONES DE FILTRADO Y PAGINACIÓN MEJORADAS
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
// COMPONENTE PDF TEMPLATE MEJORADO CON LOGO - SIN PRODUCTOS
// ===============================================
const PDFTemplate = ({ compra, proveedor, detallesCompra }) => {
  return (
    <div style={{
      padding: 40,
      fontFamily: 'Arial, sans-serif',
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#fff',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Encabezado con Logo - Diseño mejorado */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
        paddingBottom: 25,
        borderBottom: '3px solid #2E5939'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <img
            src="/images/Logo.png"
            alt="Logo Bosque Sagrado"
            style={{
              width: 100,
              height: 100,
              objectFit: 'contain'
            }}
          />
          <div>
            <h1 style={{
              color: '#2E5939',
              margin: 0,
              fontSize: 32,
              fontWeight: 'bold',
              letterSpacing: 1
            }}>
              BOSQUE SAGRADO
            </h1>
            <p style={{
              color: '#679750',
              margin: '5px 0 0 0',
              fontSize: 18,
              fontWeight: 600
            }}>
              Bosque Sagrado Glamping
            </p>
          </div>
        </div>
       
        <div style={{ textAlign: 'right' }}>
          <h2 style={{
            color: '#2E5939',
            margin: '0 0 15px 0',
            fontSize: 28,
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>
            FACTURA DE COMPRA
          </h2>
          <div style={{
            backgroundColor: '#F7F4EA',
            padding: '12px 20px',
            borderRadius: 8,
            display: 'inline-block'
          }}>
            <p style={{ margin: '8px 0', color: '#2E5939', fontSize: 16, fontWeight: 'bold' }}>
              <span style={{ color: '#679750' }}>N°:</span> {compra.idCompra}
            </p>
            <p style={{ margin: '8px 0', color: '#2E5939', fontSize: 16, fontWeight: 'bold' }}>
              <span style={{ color: '#679750' }}>Fecha:</span> {new Date().toLocaleDateString('es-CO')}
            </p>
          </div>
        </div>
      </div>
     
      {/* Contenedor principal de información */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 35
      }}>
        {/* Sección de información de empresa y proveedor */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 40,
          marginBottom: 10
        }}>
          {/* Información de Bosque Sagrado */}
          <div style={{
            backgroundColor: '#F7F4EA',
            padding: 25,
            borderRadius: 10,
            border: '2px solid #679750',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{
              color: '#2E5939',
              backgroundColor: '#E8F5E8',
              padding: '12px 20px',
              borderRadius: '6px',
              margin: '0 0 20px 0',
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              BOSQUE SAGRADO
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#2E5939',
                  borderRadius: '50%'
                }}></div>
                <p style={{ margin: 0, color: '#2E5939', fontSize: 16, flex: 1 }}>
                  <strong>NIT:</strong> 900.123.456-7
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#2E5939',
                  borderRadius: '50%'
                }}></div>
                <p style={{ margin: 0, color: '#2E5939', fontSize: 16, flex: 1 }}>
                  <strong>Dirección:</strong> Copacabana - Medellín
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#2E5939',
                  borderRadius: '50%'
                }}></div>
                <p style={{ margin: 0, color: '#2E5939', fontSize: 16, flex: 1 }}>
                  <strong>Teléfono:</strong> 310 2224383
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#2E5939',
                  borderRadius: '50%'
                }}></div>
                <p style={{ margin: 0, color: '#2E5939', fontSize: 16, flex: 1 }}>
                  <strong>Email:</strong> info@bosquesagrado.com
                </p>
              </div>
            </div>
          </div>
       
          {/* Información del Proveedor */}
          <div style={{
            backgroundColor: '#F7F4EA',
            padding: 25,
            borderRadius: 10,
            border: '2px solid #679750',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{
              color: '#2E5939',
              backgroundColor: '#E8F5E8',
              padding: '12px 20px',
              borderRadius: '6px',
              margin: '0 0 20px 0',
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              PROVEEDOR
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#2E5939',
                  borderRadius: '50%'
                }}></div>
                <p style={{ margin: 0, color: '#2E5939', fontSize: 16, flex: 1 }}>
                  <strong>Nombre:</strong> {proveedor.nombre}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#2E5939',
                  borderRadius: '50%'
                }}></div>
                <p style={{ margin: 0, color: '#2E5939', fontSize: 16, flex: 1 }}>
                  <strong>Contacto:</strong> {proveedor.celular}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#2E5939',
                  borderRadius: '50%'
                }}></div>
                <p style={{ margin: 0, color: '#2E5939', fontSize: 16, flex: 1 }}>
                  <strong>Email:</strong> {proveedor.correo}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#2E5939',
                  borderRadius: '50%'
                }}></div>
                <p style={{ margin: 0, color: '#2E5939', fontSize: 16, flex: 1 }}>
                  <strong>Documento:</strong> {proveedor.tipoDocumento} {proveedor.numeroDocumento}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#2E5939',
                  borderRadius: '50%'
                }}></div>
                <p style={{ margin: 0, color: '#2E5939', fontSize: 16, flex: 1 }}>
                  <strong>Dirección:</strong> {proveedor.direccion}, {proveedor.ciudad}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de información de la compra y totales */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr',
          gap: 40,
          flex: 1
        }}>
          {/* Información de la Compra */}
          <div style={{
            backgroundColor: '#F7F4EA',
            padding: 30,
            borderRadius: 10,
            border: '2px solid #679750',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{
              color: '#2E5939',
              marginBottom: 25,
              fontSize: 22,
              fontWeight: 'bold',
              textAlign: 'center',
              textTransform: 'uppercase'
            }}>
              Información de la Compra
            </h3>
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 20
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '15px 20px',
                borderRadius: 8,
                border: '1px solid rgba(46, 89, 57, 0.2)'
              }}>
                <p style={{
                  margin: 0,
                  color: '#2E5939',
                  fontSize: 16,
                  textAlign: 'center'
                }}>
                  <strong style={{ color: '#679750', display: 'block', marginBottom: 5 }}>Método de Pago</strong>
                  <span style={{ fontSize: 18, fontWeight: 'bold' }}>{compra.metodoPago}</span>
                </p>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: '15px 20px',
                borderRadius: 8,
                border: '1px solid rgba(46, 89, 57, 0.2)'
              }}>
                <p style={{
                  margin: 0,
                  color: '#2E5939',
                  fontSize: 16,
                  textAlign: 'center'
                }}>
                  <strong style={{ color: '#679750', display: 'block', marginBottom: 5 }}>Estado</strong>
                  <span style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: compra.estado ? '#4caf50' : '#e57373'
                  }}>
                    {compra.estado ? 'ACTIVO' : 'INACTIVO'}
                  </span>
                </p>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: '15px 20px',
                borderRadius: 8,
                border: '1px solid rgba(46, 89, 57, 0.2)'
              }}>
                <p style={{
                  margin: 0,
                  color: '#2E5939',
                  fontSize: 16,
                  textAlign: 'center'
                }}>
                  <strong style={{ color: '#679750', display: 'block', marginBottom: 5 }}>Fecha de Generación</strong>
                  <span style={{ fontSize: 18, fontWeight: 'bold' }}>
                    {new Date().toLocaleDateString('es-CO', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </p>
              </div>
            </div>
          </div>
         
          {/* Totales - Diseño destacado */}
          <div style={{
            backgroundColor: '#E8F5E8',
            padding: 35,
            borderRadius: 12,
            border: '3px solid #2E5939',
            boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <h3 style={{
              color: '#2E5939',
              marginBottom: 35,
              fontSize: 26,
              fontWeight: 'bold',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: 1
            }}>
              Resumen Financiero
            </h3>
           
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20
            }}>
              {/* Subtotal */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '18px 25px',
                backgroundColor: 'white',
                borderRadius: 8,
                border: '1px solid rgba(46, 89, 57, 0.3)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <span style={{
                  fontWeight: 'bold',
                  color: '#2E5939',
                  fontSize: 18
                }}>Subtotal:</span>
                <span style={{
                  textAlign: 'right',
                  color: '#2E5939',
                  fontSize: 20,
                  fontWeight: 'bold'
                }}>${compra.subtotal.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</span>
              </div>
             
              {/* IVA */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '18px 25px',
                backgroundColor: 'white',
                borderRadius: 8,
                border: '1px solid rgba(46, 89, 57, 0.3)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <span style={{
                  fontWeight: 'bold',
                  color: '#2E5939',
                  fontSize: 18
                }}>IVA (19%):</span>
                <span style={{
                  textAlign: 'right',
                  color: '#2E5939',
                  fontSize: 20,
                  fontWeight: 'bold'
                }}>${compra.iva.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</span>
              </div>
             
              {/* Total - Destacado */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '25px 30px',
                backgroundColor: '#2E5939',
                borderRadius: 10,
                marginTop: 10,
                boxShadow: '0 4px 15px rgba(46, 89, 57, 0.3)'
              }}>
                <span style={{
                  color: 'white',
                  fontSize: 22,
                  fontWeight: 'bold',
                  letterSpacing: 1
                }}>TOTAL:</span>
                <span style={{
                  textAlign: 'right',
                  color: 'white',
                  fontSize: 28,
                  fontWeight: 'bold',
                  letterSpacing: 1
                }}>${compra.total.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
     
      {/* Pie de página - Espaciado adecuado */}
      <div style={{
        marginTop: 50,
        paddingTop: 25,
        borderTop: '3px solid #2E5939',
        textAlign: 'center',
        color: '#679750'
      }}>
        <p style={{
          margin: '8px 0',
          fontWeight: 'bold',
          fontSize: 16,
          color: '#2E5939'
        }}>
          ¡Gracias por su compra!
        </p>
        <p style={{ margin: '8px 0', fontSize: 15, fontWeight: 600 }}>
          Bosque Sagrado Glamping
        </p>
<p style={{ margin: '8px 0', fontSize: 15 }}>
          Copacabana - Medellín
        </p>
        <p style={{ margin: '8px 0', fontSize: 15 }}>
          Tel: 310 2224383 | Email: info@bosquesagrado.com
        </p>
        <p style={{
          margin: '15px 0 0 0',
          fontSize: 12,
          color: '#2E5939',
          fontStyle: 'italic',
          opacity: 0.8
        }}>
          Este documento es una factura de compra generada electrónicamente
        </p>
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
                  <option value="activo">Activas</option>
                  <option value="inactivo">Inactivas</option>
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
                  <option value="Transferencia">Transferencia</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              {/* Filtro por proveedor */}
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

              {/* Filtro por fecha de creación */}
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

        {/* Información de resultados filtrados */}
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
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaBuilding />
                      Proveedor
                    </div>
                  }
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
                  touched={touchedFields.idProveedor}
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
                  onChange={handleChange}
                  onBlur={handleInputBlur}
                  error={formErrors.metodoPago}
                  success={formSuccess.metodoPago}
                  warning={formWarnings.metodoPago}
                  required={true}
                  options={metodoPagoOptions}
                  touched={touchedFields.metodoPago}
                />
              </div>

              {/* Sección de Productos - MODIFICADA PARA MÚLTIPLES PRODUCTOS */}
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
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '14px',
                      color: '#679750',
                      fontWeight: '500'
                    }}>
                      {productos.length - productosCompra.length} productos disponibles
                    </span>
                    <button
                      type="button"
                      onClick={addProducto}
                      disabled={productos.length === productosCompra.length}
                      style={{
                        backgroundColor: productos.length === productosCompra.length ? "#ccc" : "#679750",
                        color: "white",
                        padding: "10px 15px",
                        border: "none",
                        borderRadius: 8,
                        cursor: productos.length === productosCompra.length ? "not-allowed" : "pointer",
                        fontWeight: "600",
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        transition: "all 0.3s ease",
                      }}
                      onMouseOver={(e) => {
                        if (productos.length !== productosCompra.length) {
                          e.target.style.background = "linear-gradient(90deg, #67d630, #95d34e)";
                          e.target.style.transform = "translateY(-2px)";
                        }
                      }}
                      onMouseOut={(e) => {
                        if (productos.length !== productosCompra.length) {
                          e.target.style.background = "#679750";
                          e.target.style.transform = "translateY(0)";
                        }
                      }}
                    >
                      <FaPlus /> Agregar Producto
                    </button>
                  </div>
                </div>

                {productosCompra.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px', color: '#679750' }}>
                    <FaBox style={{ fontSize: '3em', marginBottom: '15px', opacity: 0.5 }} />
                    <p style={{ margin: 0, fontSize: '16px' }}>No hay productos agregados a la compra</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.7 }}>
                      Haz clic en "Agregar Producto" para comenzar
                    </p>
                  </div>
                ) : (
                  <>
                    <div style={productHeaderStyle}>
                      <span>Producto</span>
                      <span>Stock Disponible</span>
                      <span>Cantidad</span>
                      <span>Precio Unitario</span>
                      <span>Subtotal</span>
                      <span></span>
                    </div>
                    {productosCompra.map((producto, index) => {
                      const productosDisponibles = getProductosDisponibles(index);
                      const productoInfo = productos.find(p => p.idProducto === parseInt(producto.idProducto));
                      const stockDisponible = productoInfo ? productoInfo.cantidad : 0;
                      const cantidadSolicitada = parseInt(producto.cantidad) || 0;
                      const excedeStock = cantidadSolicitada > stockDisponible;
                     
                      return (
                        <div key={index} style={productItemStyle}>
                          <select
                            value={producto.idProducto}
                            onChange={(e) => handleProductoChange(index, 'idProducto', e.target.value)}
                            style={{
                              ...inputStyle,
                              border: excedeStock ? '1px solid #e57373' : inputStyle.border
                            }}
                          >
                            {productosDisponibles.map(prod => (
                              <option key={prod.idProducto} value={prod.idProducto}>
                                {prod.nombre} - ${prod.precio.toLocaleString('es-CO')}
                              </option>
                            ))}
                          </select>
                         
                          <div style={{
                            ...inputStyle,
                            backgroundColor: '#F7F4EA',
                            color: '#2E5939',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            height: '42px',
                            border: excedeStock ? '1px solid #e57373' : inputStyle.border,
                            justifyContent: 'center'
                          }}>
                            {stockDisponible} und
                          </div>
                         
                          <input
                            type="text"
                            value={producto.cantidad}
                            onChange={(e) => handleProductoChange(index, 'cantidad', e.target.value)}
                            style={{
                              ...inputStyle,
                              border: excedeStock ? '1px solid #e57373' : inputStyle.border,
                              textAlign: 'center'
                            }}
                            placeholder="Cantidad"
                          />
                         
                          <div style={{
                            ...inputStyle,
                            backgroundColor: '#F7F4EA',
                            color: '#2E5939',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            height: '42px',
                            justifyContent: 'center'
                          }}>
                            ${parseFloat(producto.precioUnitario || 0).toLocaleString('es-CO')}
                          </div>
                         
                          <div style={{
                            ...inputStyle,
                            backgroundColor: '#F7F4EA',
                            color: '#2E5939',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            height: '42px',
                            justifyContent: 'center'
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
                         
                          {excedeStock && (
                            <div style={{
                              gridColumn: '1 / -1',
                              backgroundColor: '#ffebee',
                              border: '1px solid #e57373',
                              borderRadius: '6px',
                              padding: '8px 12px',
                              marginTop: '5px',
                              fontSize: '12px',
                              color: '#c62828',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}>
                              <FaExclamationTriangle />
                              La cantidad solicitada excede el stock disponible ({stockDisponible} unidades)
                            </div>
                          )}
                        </div>
                      );
                    })}
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

      {/* Modal de detalles - MEJORADO */}
      {showDetails && selectedCompra && (
        <div style={modalOverlayStyle}>
          <div style={detailsModalStyle}>
            {/* Encabezado del modal con fondo decorativo */}
            <div style={{
              backgroundColor: '#2E5939',
              padding: '25px 30px',
              color: 'white',
              borderTopLeftRadius: '13px',
              borderTopRightRadius: '13px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{
                  margin: 0,
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}>
                  Detalles de la Compra
                </h2>
                <p style={{
                  margin: '5px 0 0 0',
                  opacity: 0.9,
                  fontSize: '16px'
                }}>
                  N° {selectedCompra.idCompra} • {new Date().toLocaleDateString('es-CO')}
                </p>
              </div>
              <button
                onClick={closeDetailsModal}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  color: "white",
                  fontSize: "22px",
                  cursor: "pointer",
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  zIndex: 1
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.3)";
                  e.target.style.transform = "rotate(90deg)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.2)";
                  e.target.style.transform = "rotate(0deg)";
                }}
              >
                <FaTimes />
              </button>
              <div style={{
                position: 'absolute',
                right: '-50px',
                top: '-50px',
                width: '200px',
                height: '200px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '50%'
              }}></div>
            </div>

            <div style={{ padding: '30px' }}>
              {/* Información principal en tarjetas */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: '30px'
              }}>
                <div style={{
                  backgroundColor: '#F7F4EA',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '1px solid #679750',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.08)'
                }}>
                  <h3 style={{
                    margin: '0 0 15px 0',
                    color: '#2E5939',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <FaBuilding /> Información del Proveedor
                  </h3>
                  <div style={detailItemStyle}>
                    <span style={detailLabelStyle}><FaUser /> Nombre:</span>
                    <span style={detailValueStyle}>{getProveedorNombre(selectedCompra.idProveedor)}</span>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#F7F4EA',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '1px solid #679750',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.08)'
                }}>
                  <h3 style={{
                    margin: '0 0 15px 0',
                    color: '#2E5939',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <FaDollarSign /> Información de Pago
                  </h3>
                  <div style={detailItemStyle}>
                    <span style={detailLabelStyle}><FaDollarSign /> Método:</span>
                    <span style={detailValueStyle}>{selectedCompra.metodoPago}</span>
                  </div>
                  <div style={detailItemStyle}>
                    <span style={detailLabelStyle}><FaToggleOn /> Estado:</span>
                    <span style={{
                      ...detailValueStyle,
                      color: selectedCompra.estado ? '#4caf50' : '#e57373',
                      fontWeight: 'bold',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {selectedCompra.estado ?
                        <><div style={{
                          width: '10px',
                          height: '10px',
                          backgroundColor: '#4caf50',
                          borderRadius: '50%',
                          display: 'inline-block'
                        }}></div> Activa</> :
                        <><div style={{
                          width: '10px',
                          height: '10px',
                          backgroundColor: '#e57373',
                          borderRadius: '50%',
                          display: 'inline-block'
                        }}></div> Inactiva</>
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Totales en tarjeta destacada */}
              <div style={{
                backgroundColor: '#E8F5E8',
                padding: '25px',
                borderRadius: '10px',
                border: '2px solid #679750',
                marginBottom: '30px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  color: '#2E5939',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <FaListAlt /> Resumen Financiero
                </h3>
               
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '15px'
                }}>
                  <div style={{
                    backgroundColor: 'white',
                    padding: '15px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: '1px solid rgba(46, 89, 57, 0.2)'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      color: '#679750',
                      marginBottom: '8px',
                      fontWeight: '600'
                    }}>
                      Subtotal
                    </div>
                    <div style={{
                      fontSize: '22px',
                      color: '#2E5939',
                      fontWeight: 'bold'
                    }}>
                      ${selectedCompra.subtotal.toLocaleString('es-CO')}
                    </div>
                  </div>
                 
                  <div style={{
                    backgroundColor: 'white',
                    padding: '15px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: '1px solid rgba(46, 89, 57, 0.2)'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      color: '#679750',
                      marginBottom: '8px',
                      fontWeight: '600'
                    }}>
                      IVA (19%)
                    </div>
                    <div style={{
                      fontSize: '22px',
                      color: '#2E5939',
                      fontWeight: 'bold'
                    }}>
                      ${selectedCompra.iva.toLocaleString('es-CO')}
                    </div>
                  </div>
                 
                  <div style={{
                    backgroundColor: '#2E5939',
                    padding: '15px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: '1px solid #2E5939',
                    boxShadow: '0 4px 8px rgba(46, 89, 57, 0.3)'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      color: 'white',
                      marginBottom: '8px',
                      fontWeight: '600',
                      opacity: 0.9
                    }}>
                      Total
                    </div>
                    <div style={{
                      fontSize: '24px',
                      color: 'white',
                      fontWeight: 'bold'
                    }}>
                      ${selectedCompra.total.toLocaleString('es-CO')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "15px",
                marginTop: "30px",
                paddingTop: '20px',
                borderTop: '1px solid rgba(46, 89, 57, 0.1)'
              }}>
                <button
                  onClick={() => handleOpenPdfModal(selectedCompra)}
                  style={{
                    backgroundColor: "#2E5939",
                    color: "#fff",
                    padding: "12px 25px",
                    border: "none",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontWeight: "600",
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: "all 0.3s ease",
                    fontSize: '15px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "linear-gradient(90deg, #67d630, #95d34e)";
                    e.target.style.transform = "translateY(-3px)";
                    e.target.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "#2E5939";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                  }}
                >
                  <FaFilePdf size={18} /> Exportar a PDF
                </button>
                <button
                  onClick={closeDetailsModal}
                  style={{
                    backgroundColor: "transparent",
                    color: "#2E5939",
                    padding: "12px 25px",
                    border: "2px solid #2E5939",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    fontSize: '15px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "rgba(46, 89, 57, 0.1)";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Cerrar
                </button>
              </div>
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