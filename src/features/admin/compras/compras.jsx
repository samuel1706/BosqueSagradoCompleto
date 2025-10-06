// src/components/AdminCompras.jsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus, FaMinus, FaFilePdf, FaTimes, FaAsterisk, FaSearch, FaExclamationTriangle, FaBox } from "react-icons/fa";
import { usePDF } from 'react-to-pdf';
import axios from "axios";

// ===============================================
// ESTILOS ACTUALIZADOS (Coherentes con el sidebar)
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
  position: 'relative'
};

const requiredAsteriskStyle = {
  position: 'absolute',
  top: 0,
  right: -10,
  color: 'red',
  fontSize: '0.8em'
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

const addProductButtonStyle = {
  backgroundColor: "#2E5939",
  color: "#fff",
  padding: "15px 25px",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "16px",
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
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

const modalCloseBtnStyle = {
  position: 'absolute',
  top: 15,
  right: 15,
  backgroundColor: 'transparent',
  border: 'none',
  fontSize: '1.5em',
  color: '#2E5939',
  cursor: 'pointer',
};

const modalItemRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: 5,
  paddingBottom: 5,
  borderBottom: '1px dashed rgba(46, 89, 57, 0.3)'
};

const itemSubtotalDisplayStyle = {
  ...inputStyle,
  backgroundColor: '#F7F4EA',
  color: '#2E5939',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  height: '42px'
};

const alertStyle = {
  position: 'fixed',
  top: 20,
  right: 20,
  backgroundColor: '#2E5939',
  color: 'white',
  padding: '15px 20px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  zIndex: 10000,
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const deleteModalContentStyle = {
  backgroundColor: "#fff",
  padding: 30,
  borderRadius: 12,
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  width: "90%",
  maxWidth: 500,
  color: "#2E5939",
  textAlign: 'center',
  border: "2px solid #679750",
};

const pdfModalContentStyle = {
  backgroundColor: "#fff",
  padding: 30,
  borderRadius: 12,
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  width: "90%",
  maxWidth: 500,
  color: "#2E5939",
  textAlign: 'center',
  border: "2px solid #679750",
};

const readOnlyInputStyle = {
  ...inputStyle,
  backgroundColor: '#e9ecef',
  color: '#495057',
  cursor: 'not-allowed'
};

const compactItemRowStyle = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr 1fr 1fr 40px',
  gap: '10px',
  alignItems: 'center',
  marginBottom: '15px',
  padding: '15px',
  backgroundColor: 'rgba(46, 89, 57, 0.05)',
  borderRadius: '8px',
  border: '1px solid rgba(46, 89, 57, 0.1)'
};

const compactFormFieldStyle = {
  marginBottom: 0
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
  marginBottom: 5,
  fontSize: "14px"
};

const detailValueStyle = {
  fontSize: 16,
  color: "#2E5939",
  fontWeight: "500"
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
  fontSize: '12px'
};

// ===============================================
// DATOS DE CONFIGURACIÓN
// ===============================================

const API_COMPRAS = "http://localhost:5255/api/Compras";
const API_PROVEEDORES = "http://localhost:5255/api/Proveedore";
const API_PRODUCTOS = "http://localhost:5255/api/Productos";
const API_DETALLE_COMPRAS = "http://localhost:5255/api/DetalleCompras";

const IVA_RATE = 0.19;
const ITEMS_PER_PAGE = 5;

// ===============================================
// COMPONENTE FormField
// ===============================================
const FormField = ({ label, name, type = "text", value, onChange, error, options = [], style = {}, required = true, min = undefined, placeholder = "", step = undefined, disabled = false, readOnly = false }) => {
  const finalOptions = useMemo(() => {
    if (type === "select") {
      const placeholderOption = { value: "", label: placeholder || "Selecciona", disabled: required };
      return [placeholderOption, ...options];
    }
    return options;
  }, [options, type, required, placeholder]);

  const handleFilteredInputChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (name === 'cantidad' || name === 'precioUnitario') {
      filteredValue = value.replace(/[^0-9.]/g, "");
      const parts = filteredValue.split('.');
      if (parts.length > 2) {
        filteredValue = parts[0] + '.' + parts.slice(1).join('');
      }
    }
    onChange({ target: { name, value: filteredValue } });
  };

  return (
    <div style={{ ...formFieldStyle, ...style }}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={requiredAsteriskStyle}><FaAsterisk /></span>}
        </label>
      )}
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          style={{
            ...inputStyle,
            border: error ? "1px solid red" : "1px solid #ccc",
            ...(readOnly ? readOnlyInputStyle : {})
          }}
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
            ...inputStyle,
            minHeight: "60px",
            resize: "vertical",
            border: error ? "1px solid red" : "1px solid #ccc",
            ...(readOnly ? readOnlyInputStyle : {})
          }}
          required={required}
          placeholder={placeholder || label}
          disabled={disabled || readOnly}
        ></textarea>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={(name === 'cantidad' || name === 'precioUnitario') ? handleFilteredInputChange : onChange}
          style={{
            ...inputStyle,
            border: error ? "1px solid red" : "1px solid #ccc",
            ...(readOnly ? readOnlyInputStyle : {})
          }}
          required={required}
          min={min}
          step={step}
          placeholder={placeholder || label}
          disabled={disabled || readOnly}
          readOnly={readOnly}
        />
      )}
      {error && (
        <p style={{ color: "red", fontSize: "0.8rem", marginTop: "4px" }}>
          {error}
        </p>
      )}
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
    estado: true,
    subtotal: 0,
    iva: 0,
    total: 0
  });
  const [productosCompra, setProductosCompra] = useState([]);
  const [errors, setErrors] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [selectedDetalleCompras, setSelectedDetalleCompras] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [compraToDelete, setCompraToDelete] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProveedores, setLoadingProveedores] = useState(false);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [loadingDetalleCompras, setLoadingDetalleCompras] = useState(false);
  const [error, setError] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  
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

  // ===============================================
  // FUNCIONES DE LA API
  // ===============================================
  const fetchCompras = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔍 Conectando a la API de compras:", API_COMPRAS);
      const res = await axios.get(API_COMPRAS, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log("✅ Datos de compras recibidos:", res.data);
      
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
      console.log("🔍 Conectando a la API de proveedores:", API_PROVEEDORES);
      const res = await axios.get(API_PROVEEDORES, {
        timeout: 10000
      });
      
      console.log("✅ Datos de proveedores recibidos:", res.data);
      
      if (Array.isArray(res.data)) {
        setProveedores(res.data);
        // Establecer el primer proveedor como valor por defecto si no hay uno seleccionado
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
      console.log("🔍 Conectando a la API de productos:", API_PRODUCTOS);
      const res = await axios.get(API_PRODUCTOS, {
        timeout: 10000
      });
      
      console.log("✅ Datos de productos recibidos:", res.data);
      
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
    setLoadingDetalleCompras(true);
    try {
      console.log("🔍 Conectando a la API de detalle compras:", API_DETALLE_COMPRAS);
      const res = await axios.get(API_DETALLE_COMPRAS, {
        timeout: 10000
      });
      
      console.log("✅ Datos de detalle compras recibidos:", res.data);
      
      if (Array.isArray(res.data)) {
        setDetalleCompras(res.data);
      }
    } catch (error) {
      console.error("❌ Error al obtener detalle compras:", error);
      // No mostramos alerta para este error ya que puede que la tabla no exista
    } finally {
      setLoadingDetalleCompras(false);
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

  const handleAddCompra = async (e) => {
    e.preventDefault();
    if (validateForm()) {
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
          // Actualizar compra existente
          await axios.put(`${API_COMPRAS}/${newCompra.idCompra}`, compraData, {
            headers: { 'Content-Type': 'application/json' }
          });
          compraId = newCompra.idCompra;
          
          // Eliminar detalles existentes y agregar nuevos
          try {
            const detallesExistentes = detalleCompras.filter(dc => dc.idCompra === compraId);
            for (const detalle of detallesExistentes) {
              await axios.delete(`${API_DETALLE_COMPRAS}/${detalle.idDetalleCompra}`);
            }
            
            // Agregar nuevos detalles
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
          
          displayAlert("Compra actualizada exitosamente.");
        } else {
          // Crear nueva compra
          const response = await axios.post(API_COMPRAS, compraData, {
            headers: { 'Content-Type': 'application/json' }
          });
          compraId = response.data.idCompra;
          
          // Agregar detalles a la compra
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
          
          displayAlert("Compra agregada exitosamente.");
        }

        await fetchCompras();
        await fetchDetalleCompras();
        closeForm();
      } catch (error) {
        console.error("Error al guardar compra:", error);
        handleApiError(error, isEditing ? "actualizar la compra" : "agregar la compra");
      } finally {
        setLoading(false);
      }
    }
  };

  const confirmDelete = async () => {
    if (compraToDelete) {
      setLoading(true);
      try {
        // Primero eliminar los detalles asociados a la compra
        try {
          const detallesAsociados = detalleCompras.filter(dc => dc.idCompra === compraToDelete.idCompra);
          for (const detalle of detallesAsociados) {
            await axios.delete(`${API_DETALLE_COMPRAS}/${detalle.idDetalleCompra}`);
          }
        } catch (error) {
          console.warn("No se pudieron eliminar los detalles de la compra:", error);
        }
        
        // Luego eliminar la compra
        await axios.delete(`${API_COMPRAS}/${compraToDelete.idCompra}`);
        displayAlert("Compra eliminada exitosamente.");
        
        await fetchCompras();
        await fetchDetalleCompras();
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
  // FUNCIONES AUXILIARES
  // ===============================================
  const handleApiError = (error, operation) => {
    let errorMessage = `Error al ${operation}`;
    
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      errorMessage = "Error de conexión. Verifica que el servidor esté ejecutándose.";
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = "No se puede conectar al servidor en http://localhost:5255";
    } else if (error.response) {
      errorMessage = `Error ${error.response.status}: ${error.response.data?.message || 'Error del servidor'}`;
    } else if (error.request) {
      errorMessage = "No hay respuesta del servidor.";
    }
    
    setError(errorMessage);
    displayAlert(errorMessage);
  };

  const displayAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage("");
    }, 4000);
  };

  const validateForm = () => {
    if (!newCompra.idProveedor) {
      displayAlert("Debe seleccionar un proveedor.");
      return false;
    }
    if (productosCompra.length === 0) {
      displayAlert("Debe agregar al menos un producto a la compra.");
      return false;
    }
    if (!newCompra.metodoPago) {
      displayAlert("Debe seleccionar un método de pago.");
      return false;
    }
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setNewCompra((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setNewCompra({
      idProveedor: proveedores.length > 0 ? proveedores[0].idProveedor.toString() : "",
      metodoPago: "Transferencia",
      estado: true,
      subtotal: 0,
      iva: 0,
      total: 0
    });
    setProductosCompra([]);
    setErrors({});
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

  const toggleActive = async (compra) => {
    setLoading(true);
    try {
      const updatedCompra = { ...compra, estado: !compra.estado };
      await axios.put(`${API_COMPRAS}/${compra.idCompra}`, updatedCompra);
      displayAlert(`Compra ${updatedCompra.estado ? 'activada' : 'desactivada'} exitosamente.`);
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
    
    // Cargar detalles de la compra
    const detalles = await fetchDetalleComprasByCompraId(compra.idCompra);
    setProductosCompra(detalles.map(detalle => ({
      idProducto: detalle.idProducto.toString(),
      cantidad: detalle.cantidad.toString(),
      precioUnitario: (detalle.subtotal / detalle.cantidad).toFixed(2), // Calcular precio unitario
      subtotal: detalle.subtotal
    })));
    
    setIsEditing(true);
    setShowForm(true);
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
      displayAlert("PDF generado exitosamente");
    }
  };

  // ===============================================
  // FUNCIONES DE GESTIÓN DE PRODUCTOS EN COMPRA
  // ===============================================
  const addProducto = () => {
    if (productos.length === 0) {
      displayAlert("No hay productos disponibles para agregar.");
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
      // Filtrar solo números y punto decimal
      value = value.replace(/[^0-9.]/g, "");
      const parts = value.split('.');
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
      }
    }
    
    nuevosProductos[index][field] = value;
    
    // Recalcular subtotal si cambia cantidad o precio
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

  // ===============================================
  // FUNCIONES DE FILTRADO Y PAGINACIÓN
  // ===============================================
  const filteredCompras = useMemo(() => {
    return compras.filter(compra => {
      const proveedor = proveedores.find(p => p.idProveedor === compra.idProveedor);
      return proveedor?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             compra.metodoPago?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [compras, proveedores, searchTerm]);

  const totalPages = Math.ceil(filteredCompras.length / ITEMS_PER_PAGE);

  const paginatedCompras = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCompras.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCompras, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ===============================================
  // FUNCIONES PARA OBTENER NOMBRES (CORREGIDAS)
  // ===============================================
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
  // COMPONENTE PDF TEMPLATE (ACTUALIZADO)
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
      
      {/* Alerta */}
      {showAlert && (
        <div style={{
          ...alertStyle,
          backgroundColor: alertMessage.includes('Error') ? '#e57373' : '#2E5939'
        }}>
          {alertMessage.includes('Error') && <FaExclamationTriangle />}
          <span>{alertMessage}</span>
          <button 
            onClick={() => setShowAlert(false)}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
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
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, color: "#2E5939" }}>Gestión de Compras</h2>
          <p style={{ margin: "5px 0 0 0", color: "#679750", fontSize: "14px" }}>
            {compras.length} compras registradas | {proveedores.length} proveedores | {productos.length} productos
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setIsEditing(false);
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
          <FaPlus /> Agregar Compra
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Buscar por proveedor o método de pago..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            padding: "12px 15px",
            borderRadius: 10,
            border: "1px solid #ccc",
            width: "100%",
            maxWidth: 400,
            backgroundColor: "#F7F4EA",
            color: "#2E5939",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        />
        <div style={{ color: '#2E5939', fontSize: '14px', whiteSpace: 'nowrap' }}>
          {filteredCompras.length} resultados
        </div>
      </div>

      {/* Formulario de agregar/editar - ACTUALIZADO CON PRODUCTOS */}
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
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleAddCompra}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={labelStyle}>Proveedor *</label>
                  <select
                    name="idProveedor"
                    value={newCompra.idProveedor}
                    onChange={handleInputChange}
                    style={inputStyle}
                    required
                    disabled={loadingProveedores || proveedores.length === 0}
                  >
                    <option value="">Seleccionar proveedor</option>
                    {proveedores.map(proveedor => (
                      <option key={proveedor.idProveedor} value={proveedor.idProveedor}>
                        {proveedor.nombre} - {proveedor.celular}
                      </option>
                    ))}
                  </select>
                  {loadingProveedores && <small style={{color: '#679750'}}>Cargando proveedores...</small>}
                </div>

                <div>
                  <label style={labelStyle}>Método de Pago *</label>
                  <select
                    name="metodoPago"
                    value={newCompra.metodoPago}
                    onChange={handleInputChange}
                    style={inputStyle}
                    required
                  >
                    {metodoPagoOptions.map(metodo => (
                      <option key={metodo.value} value={metodo.value}>
                        {metodo.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sección de Productos */}
              <div style={productsSectionStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, color: "#2E5939" }}>Productos de la Compra</h3>
                  <button
                    type="button"
                    onClick={addProducto}
                    style={{
                      backgroundColor: "#679750",
                      color: "white",
                      padding: "8px 15px",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: "600",
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <FaPlus /> Agregar Producto
                  </button>
                </div>

                {productosCompra.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#679750' }}>
                    <FaBox style={{ fontSize: '2em', marginBottom: '10px' }} />
                    <p>No hay productos agregados a la compra</p>
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
                        <div style={itemSubtotalDisplayStyle}>
                          ${parseFloat(producto.subtotal || 0).toLocaleString('es-CO')}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeProducto(index)}
                          style={removeButtonStyle}
                          title="Eliminar producto"
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
                  <span style={{ ...totalValueStyle, fontSize: '1.2em', backgroundColor: '#679750', color: 'white' }}>
                    ${newCompra.total.toLocaleString('es-CO')}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 20 }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? "#ccc" : "#2E5939",
                    color: "#fff",
                    padding: "12px 25px",
                    border: "none",
                    borderRadius: 10,
                    cursor: loading ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    flex: 1,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                  }}
                >
                  {loading ? "Guardando..." : (isEditing ? "Actualizar" : "Guardar")} Compra
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={loading}
                  style={{
                    backgroundColor: "#ccc",
                    color: "#333",
                    padding: "12px 25px",
                    border: "none",
                    borderRadius: 10,
                    cursor: loading ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    flex: 1,
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de detalles (ACTUALIZADO CON DETALLES) */}
      {showDetails && selectedCompra && (
        <div style={modalOverlayStyle}>
          <div style={{...detailsModalStyle, maxWidth: '700px'}}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939" }}>Detalles de la Compra</h2>
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
                <div style={detailValueStyle}>#{selectedCompra.idCompra}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Proveedor</div>
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
                    <div style={detailItemStyle}>
                      <div style={detailLabelStyle}>Dirección Proveedor</div>
                      <div style={detailValueStyle}>{proveedorInfo.direccion}, {proveedorInfo.ciudad}</div>
                    </div>
                  </>
                );
              })()}
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Método de Pago</div>
                <div style={detailValueStyle}>{selectedCompra.metodoPago}</div>
              </div>

              {/* Productos de la compra */}
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Productos ({selectedDetalleCompras.length})</div>
                <div style={detailValueStyle}>
                  {selectedDetalleCompras.length > 0 ? (
                    <div style={{ marginTop: '10px' }}>
                      {selectedDetalleCompras.map((detalle, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px',
                          backgroundColor: 'rgba(46, 89, 57, 0.05)',
                          borderRadius: '6px',
                          marginBottom: '5px'
                        }}>
                          <span style={{ fontWeight: 'bold' }}>
                            {getProductoNombre(detalle.idProducto)}
                          </span>
                          <span style={{ fontSize: '14px' }}>
                            {detalle.cantidad} x ${(detalle.subtotal / detalle.cantidad).toLocaleString('es-CO')} = ${detalle.subtotal.toLocaleString('es-CO')}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    "No hay productos registrados"
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
                <div style={{...detailValueStyle, fontWeight: 'bold', color: '#679750'}}>
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
                  gap: '5px'
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
          <div style={pdfModalContentStyle}>
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
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Productos</th>
                <th style={{ padding: "15px", textAlign: "right", fontWeight: "bold" }}>Total</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Estado</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCompras.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
                    {compras.length === 0 ? "No hay compras registradas" : "No se encontraron resultados"}
                  </td>
                </tr>
              ) : (
                paginatedCompras.map((compra) => {
                  const productosCount = detalleCompras.filter(dc => dc.idCompra === compra.idCompra).length;
                  return (
                    <tr key={compra.idCompra} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "15px", fontWeight: "500" }}>{getProveedorNombre(compra.idProveedor)}</td>
                      <td style={{ padding: "15px" }}>{compra.metodoPago}</td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <span style={{
                          backgroundColor: productosCount > 0 ? '#2E5939' : '#ccc',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {productosCount} productos
                        </span>
                      </td>
                      <td style={{ padding: "15px", textAlign: "right", fontWeight: "bold" }}>${compra.total.toLocaleString('es-CO')}</td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <button
                          onClick={() => toggleActive(compra)}
                          style={{
                            cursor: "pointer",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            border: "none",
                            backgroundColor: compra.estado ? "#4caf50" : "#e57373",
                            color: "white",
                            fontWeight: "600",
                            fontSize: "12px",
                            minWidth: "80px"
                          }}
                        >
                          {compra.estado ? "Activa" : "Inactiva"}
                        </button>
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
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