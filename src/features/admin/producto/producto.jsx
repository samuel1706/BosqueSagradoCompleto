import React, { useState, useMemo, useEffect } from "react";
import {
  FaEye, FaEdit, FaTrash, FaTimes, FaSearch, FaPlus,
  FaExclamationTriangle, FaCheck, FaInfoCircle, FaBox,
  FaTag, FaDollarSign, FaHashtag, FaToggleOn, FaToggleOff,
  FaShoppingCart, FaSlidersH
} from "react-icons/fa";
import axios from "axios";

// ===============================================
// ESTILOS MEJORADOS (CONSISTENTES CON LOS OTROS MÓDULOS)
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

const formContainerStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '15px 20px',
  marginBottom: '20px'
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
// VALIDACIONES Y PATRONES PARA PRODUCTOS
// ===============================================
const VALIDATION_PATTERNS = {
  nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-_&.,()0-9]+$/,
};

const VALIDATION_RULES = {
  nombre: {
    minLength: 2,
    maxLength: 100,
    required: true,
    pattern: VALIDATION_PATTERNS.nombre,
    errorMessages: {
      required: "El nombre del producto es obligatorio.",
      minLength: "El nombre debe tener al menos 2 caracteres.",
      maxLength: "El nombre no puede exceder los 100 caracteres.",
      pattern: "El nombre contiene caracteres no permitidos. Solo se permiten letras, números, espacios y los caracteres: - _ & . , ( )"
    }
  },
  precio: {
    required: true,
    min: 0,
    max: 1000000000,
    errorMessages: {
      required: "El precio es obligatorio.",
      min: "El precio debe ser mayor a 0.",
      max: "El precio no puede exceder 1,000,000,000.",
      invalid: "El precio debe ser un número válido con máximo 2 decimales."
    }
  },
  cantidad: {
    required: true,
    min: 0,
    max: 1000000,
    errorMessages: {
      required: "La cantidad es obligatoria.",
      min: "La cantidad no puede ser negativa.",
      max: "La cantidad no puede exceder 1,000,000 unidades.",
      invalid: "La cantidad debe ser un número entero válido."
    }
  },
  idCategoria: {
    required: true,
    errorMessages: {
      required: "Debe seleccionar una categoría."
    }
  },
  idMarca: {
    required: true,
    errorMessages: {
      required: "Debe seleccionar una marca."
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
const API_PRODUCTOS = "http://localhost:5272/api/Productos";
const API_CATEGORIAS = "http://localhost:5272/api/CategoriaProductos";
const API_MARCAS = "http://localhost:5272/api/MarcaProducto";
const ITEMS_PER_PAGE = 5;

// ===============================================
// COMPONENTE FormField PARA PRODUCTOS
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
  icon,
  touched = false
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

    if (name === 'nombre') {
      filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-_&.,()0-9]/g, "");
    } else if (name === 'precio') {
      filteredValue = value.replace(/[^0-9.]/g, "");
      const parts = filteredValue.split('.');
      if (parts.length > 2) {
        filteredValue = parts[0] + '.' + parts.slice(1).join('');
      }
      if (parts.length === 2 && parts[1].length > 2) {
        filteredValue = parts[0] + '.' + parts[1].substring(0, 2);
      }
    } else if (name === 'cantidad') {
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
      borderLeft: `4px solid ${borderColor}`,
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
        <div>
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
            <select
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              style={{
                ...getInputStyle(),
                paddingLeft: icon ? '40px' : '12px',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%232E5939' d='M2 0L0 2h4zm0 5L0 3h4z'/></svg>")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '12px'
              }}
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
          </div>
          {getValidationMessage()}
        </div>
      ) : (
        <div>
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
          </div>
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
          {getValidationMessage()}
        </div>
      )}
    </div>
  );
};

// ===============================================
// COMPONENTE PRINCIPAL Productos
// ===============================================
const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productoToDelete, setProductoToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [loading, setLoading] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const [loadingMarcas, setLoadingMarcas] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState({});
  const [formWarnings, setFormWarnings] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  // Estados para filtros
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    estado: "all",
    categoria: "all",
    marca: "all",
    stock: "all",
    precio: "all"
  });

  // Estado inicial basado en la estructura de tu API
  const [newProducto, setNewProducto] = useState({
    idProducto: 0,
    nombre: "",
    idCategoria: "",
    idMarca: "",
    cantidad: "1",
    precio: "",
    imagen: "nada",
    estado: true
  });

  // ===============================================
  // EFECTOS
  // ===============================================
  useEffect(() => {
    fetchProductos();
    fetchCategorias();
    fetchMarcas();
  }, []);

  // Validar formulario en tiempo real solo para campos tocados
  useEffect(() => {
    if (showForm) {
      Object.keys(touchedFields).forEach(fieldName => {
        if (touchedFields[fieldName]) {
          validateField(fieldName, newProducto[fieldName]);
        }
      });
    }
  }, [newProducto, showForm, touchedFields]);

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
  // FUNCIONES DE LA API CON MANEJO MEJORADO DE ERRORES
  // ===============================================
  const fetchProductos = async () => {
    setLoading(true);
    setError(null);
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
        throw new Error("Formato de datos inválido");
      }
    } catch (error) {
      console.error("❌ Error al obtener productos:", error);
      handleApiError(error, "cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    setLoadingCategorias(true);
    try {
      const res = await axios.get(API_CATEGORIAS, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
     
      if (Array.isArray(res.data)) {
        setCategorias(res.data);
      }
    } catch (error) {
      console.error("❌ Error al obtener categorías:", error);
    } finally {
      setLoadingCategorias(false);
    }
  };

  const fetchMarcas = async () => {
    setLoadingMarcas(true);
    try {
      const res = await axios.get(API_MARCAS, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
     
      if (Array.isArray(res.data)) {
        setMarcas(res.data);
      }
    } catch (error) {
      console.error("❌ Error al obtener marcas:", error);
    } finally {
      setLoadingMarcas(false);
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
    else if (trimmedValue && (fieldName === 'precio' || fieldName === 'cantidad')) {
      const numericValue = fieldName === 'precio' ? parseFloat(trimmedValue) : parseInt(trimmedValue);
     
      if (isNaN(numericValue)) {
        error = rules.errorMessages.invalid;
      } else if (rules.min !== undefined && numericValue < rules.min) {
        error = rules.errorMessages.min;
      } else if (rules.max !== undefined && numericValue > rules.max) {
        error = rules.errorMessages.max;
      } else {
        success = `${fieldName === 'precio' ? 'Precio' : 'Cantidad'} válido.`;
       
        // Advertencias específicas
        if (fieldName === 'precio') {
          if (numericValue < 100) {
            warning = "El precio parece muy bajo para un producto.";
          } else if (numericValue > 100000) {
            warning = "El precio parece muy alto. Verifique el valor.";
          }
        } else if (fieldName === 'cantidad') {
          if (numericValue === 0) {
            warning = "El producto quedará sin stock.";
          } else if (numericValue > 1000) {
            warning = "La cantidad parece muy alta. Verifique el valor.";
          }
        }
      }
    }
    else if (fieldName === 'idCategoria' && !trimmedValue) {
      error = rules.errorMessages.required;
    }
    else if (fieldName === 'idMarca' && !trimmedValue) {
      error = rules.errorMessages.required;
    }
    else if (fieldName === 'estado') {
      success = value ? "Producto activo" : "Producto inactivo";
    }
    else if (trimmedValue) {
      success = "Campo válido.";
    }

    // Verificación de duplicados para nombre
    if (fieldName === 'nombre' && trimmedValue && !error) {
      const duplicate = productos.find(prod =>
        prod.nombre.toLowerCase() === trimmedValue.toLowerCase() &&
        (!isEditing || prod.idProducto !== newProducto.idProducto)
      );
      if (duplicate) {
        error = "Ya existe un producto con este nombre.";
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
      nombre: true,
      precio: true,
      cantidad: true,
      idCategoria: true,
      idMarca: true,
      estado: true
    };
    setTouchedFields(allFieldsTouched);

    const nombreValid = validateField('nombre', newProducto.nombre);
    const precioValid = validateField('precio', newProducto.precio);
    const cantidadValid = validateField('cantidad', newProducto.cantidad);
    const categoriaValid = validateField('idCategoria', newProducto.idCategoria);
    const marcaValid = validateField('idMarca', newProducto.idMarca);
    const estadoValid = validateField('estado', newProducto.estado);

    const isValid = nombreValid && precioValid && cantidadValid && categoriaValid && marcaValid && estadoValid;
   
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

  const handleAddProducto = async (e) => {
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
      const productoData = {
        nombre: newProducto.nombre.trim(),
        idCategoria: parseInt(newProducto.idCategoria),
        idMarca: parseInt(newProducto.idMarca),
        cantidad: parseInt(newProducto.cantidad),
        precio: parseFloat(newProducto.precio),
        imagen: newProducto.imagen,
        estado: newProducto.estado
      };

      console.log("📤 Enviando datos:", productoData);

      if (isEditing) {
        // Para edición, incluir el idProducto
        productoData.idProducto = newProducto.idProducto;
        await axios.put(`${API_PRODUCTOS}/${newProducto.idProducto}`, productoData, {
          headers: { 'Content-Type': 'application/json' }
        });
        displayAlert("Producto actualizado exitosamente.", "success");
      } else {
        await axios.post(API_PRODUCTOS, productoData, {
          headers: { 'Content-Type': 'application/json' }
        });
        displayAlert("Producto agregado exitosamente.", "success");
      }
     
      await fetchProductos();
      closeForm();
    } catch (error) {
      console.error("❌ Error al guardar producto:", error);
      handleApiError(error, isEditing ? "actualizar el producto" : "agregar el producto");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
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
        errorMessage = "Conflicto: El producto está siendo utilizado y no puede ser eliminado.";
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
    setNewProducto((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInputBlur = (e) => {
    const { name } = e.target;
    markFieldAsTouched(name);
    validateField(name, newProducto[name]);
  };

  const toggleEstado = () => {
    setNewProducto(prev => ({
      ...prev,
      estado: !prev.estado
    }));
    markFieldAsTouched('estado');
    validateField('estado', !newProducto.estado);
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
    setTouchedFields({});
    setNewProducto({
      idProducto: 0,
      nombre: "",
      idCategoria: "",
      idMarca: "",
      cantidad: "1",
      precio: "",
      imagen: "nada",
      estado: true
    });
  };

  const closeDetailsModal = () => {
    setShowDetails(false);
    setSelectedProducto(null);
  };

  const cancelDelete = () => {
    setProductoToDelete(null);
    setShowDeleteConfirm(false);
  };

  const toggleEstadoProducto = async (producto) => {
    setLoading(true);
    try {
      const updatedProducto = {
        ...producto,
        estado: !producto.estado
      };
      await axios.put(`${API_PRODUCTOS}/${producto.idProducto}`, updatedProducto, {
        headers: { 'Content-Type': 'application/json' }
      });
      displayAlert(`Producto ${updatedProducto.estado ? 'activado' : 'desactivado'} exitosamente.`, "success");
      await fetchProductos();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      handleApiError(error, "cambiar el estado");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (producto) => {
    setSelectedProducto(producto);
    setShowDetails(true);
  };

  const handleEdit = async (producto) => {
    setNewProducto({
      ...producto,
      cantidad: producto.cantidad.toString(),
      precio: producto.precio.toString(),
      estado: producto.estado
    });
   
    setIsEditing(true);
    setShowForm(true);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
    setTouchedFields({});
  };

  const handleDeleteClick = (producto) => {
    setProductoToDelete(producto);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (productoToDelete) {
      setLoading(true);
      try {
        await axios.delete(`${API_PRODUCTOS}/${productoToDelete.idProducto}`);
        displayAlert("Producto eliminado exitosamente.", "success");
        await fetchProductos();
       
        // Ajustar la página si es necesario
        if (paginatedProductos.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("❌ Error al eliminar producto:", error);
       
        if (error.response && error.response.status === 409) {
          displayAlert("No se puede eliminar el producto porque tiene registros asociados.", "error");
        } else {
          handleApiError(error, "eliminar el producto");
        }
      } finally {
        setLoading(false);
        setProductoToDelete(null);
        setShowDeleteConfirm(false);
      }
    }
  };

  // ===============================================
  // FUNCIONES DE FILTRADO Y PAGINACIÓN
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
      categoria: "all",
      marca: "all",
      stock: "all",
      precio: "all"
    });
    setCurrentPage(1);
  };

  // Contador de filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.estado !== "all") count++;
    if (filters.categoria !== "all") count++;
    if (filters.marca !== "all") count++;
    if (filters.stock !== "all") count++;
    if (filters.precio !== "all") count++;
    return count;
  }, [filters]);

  const filteredProductos = useMemo(() => {
    let filtered = productos.filter(producto => {
      // Búsqueda general
      const matchesSearch =
        producto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCategoriaNombre(producto.idCategoria)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getMarcaNombre(producto.idMarca)?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Filtro por estado
      if (filters.estado !== "all") {
        const estadoFilter = filters.estado === "activo";
        if (producto.estado !== estadoFilter) return false;
      }

      // Filtro por categoría
      if (filters.categoria !== "all") {
        if (producto.idCategoria !== parseInt(filters.categoria)) return false;
      }

      // Filtro por marca
      if (filters.marca !== "all") {
        if (producto.idMarca !== parseInt(filters.marca)) return false;
      }

      // Filtro por stock
      if (filters.stock !== "all") {
        if (filters.stock === "con" && producto.cantidad === 0) return false;
        if (filters.stock === "sin" && producto.cantidad > 0) return false;
        if (filters.stock === "bajo" && producto.cantidad >= 10) return false;
        if (filters.stock === "agotado" && producto.cantidad > 0) return false;
      }

      // Filtro por precio
      if (filters.precio !== "all") {
        if (filters.precio === "bajo" && producto.precio >= 50000) return false;
        if (filters.precio === "medio" && (producto.precio < 50000 || producto.precio >= 200000)) return false;
        if (filters.precio === "alto" && producto.precio < 200000) return false;
      }

      return true;
    });

    return filtered;
  }, [productos, searchTerm, filters]);

  const totalPages = Math.ceil(filteredProductos.length / ITEMS_PER_PAGE);

  const paginatedProductos = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProductos.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProductos, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ===============================================
  // FUNCIONES PARA OBTENER NOMBRES
  // ===============================================
  const getCategoriaNombre = (idCategoria) => {
    if (!idCategoria) return "Sin categoría";
    const categoria = categorias.find(c => c.idCategoria === idCategoria);
    return categoria ? categoria.categoria : `Categoría ${idCategoria}`;
  };

  const getMarcaNombre = (idMarca) => {
    if (!idMarca) return "Sin marca";
    const marca = marcas.find(m => m.idMarca === idMarca);
    return marca ? marca.nombre : `Marca ${idMarca}`;
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
              onClick={fetchProductos}
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
          <h2 style={{ margin: 0, color: "#2E5939" }}>Gestión de Productos</h2>
          <p style={{ margin: "5px 0 0 0", color: "#679750", fontSize: "14px" }}>
            {productos.length} productos registrados • {productos.filter(p => p.estado).length} activos
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
            setNewProducto({
              idProducto: 0,
              nombre: "",
              idCategoria: categorias.length > 0 ? categorias[0].idCategoria.toString() : "",
              idMarca: marcas.length > 0 ? marcas[0].idMarca.toString() : "",
              cantidad: "1",
              precio: "",
              imagen: "nada",
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
          <FaPlus /> Agregar Producto
        </button>
      </div>

      {/* Estadísticas - MEJORADO */}
      {!loading && productos.length > 0 && (
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
              {productos.length}
            </div>
            <div style={{ fontSize: '16px', color: '#679750', fontWeight: '600' }}>
              Total Productos
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
              {productos.filter(p => p.estado).length}
            </div>
            <div style={{ fontSize: '16px', color: '#4caf50', fontWeight: '600' }}>
              Productos Activos
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
              {productos.filter(p => !p.estado).length}
            </div>
            <div style={{ fontSize: '16px', color: '#e57373', fontWeight: '600' }}>
              Productos Inactivos
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
              {filteredProductos.length}
            </div>
            <div style={{ fontSize: '16px', color: '#2196f3', fontWeight: '600' }}>
              Resultados Filtrados
            </div>
          </div>
        </div>
      )}

      {/* Barra de búsqueda y filtros - MEJORADO */}
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
              placeholder="Buscar por nombre, categoría o marca..."
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
                  <option value="activo">Productos activos</option>
                  <option value="inactivo">Productos inactivos</option>
                </select>
              </div>

              {/* Filtro por categoría */}
              <div>
                <label style={labelStyle}>Categoría</label>
                <select
                  name="categoria"
                  value={filters.categoria}
                  onChange={handleFilterChange}
                  style={{
                    ...inputStyle,
                    width: '100%'
                  }}
                >
                  <option value="all">Todas las categorías</option>
                  {categorias.map(cat => (
                    <option key={cat.idCategoria} value={cat.idCategoria}>
                      {cat.categoria}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por marca */}
              <div>
                <label style={labelStyle}>Marca</label>
                <select
                  name="marca"
                  value={filters.marca}
                  onChange={handleFilterChange}
                  style={{
                    ...inputStyle,
                    width: '100%'
                  }}
                >
                  <option value="all">Todas las marcas</option>
                  {marcas.map(marca => (
                    <option key={marca.idMarca} value={marca.idMarca}>
                      {marca.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por stock */}
              <div>
                <label style={labelStyle}>Stock</label>
                <select
                  name="stock"
                  value={filters.stock}
                  onChange={handleFilterChange}
                  style={{
                    ...inputStyle,
                    width: '100%'
                  }}
                >
                  <option value="all">Todo el stock</option>
                  <option value="con">Con stock</option>
                  <option value="sin">Sin stock</option>
                  <option value="bajo">Stock bajo (menos de 10)</option>
                  <option value="agotado">Agotados</option>
                </select>
              </div>

              {/* Filtro por precio */}
              <div>
                <label style={labelStyle}>Precio</label>
                <select
                  name="precio"
                  value={filters.precio}
                  onChange={handleFilterChange}
                  style={{
                    ...inputStyle,
                    width: '100%'
                  }}
                >
                  <option value="all">Todos los precios</option>
                  <option value="bajo">Bajo (menos de $50,000)</option>
                  <option value="medio">Medio ($50,000 - $200,000)</option>
                  <option value="alto">Alto (más de $200,000)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Información de resultados filtrados */}
        {filteredProductos.length !== productos.length && (
          <div style={{
            marginTop: '10px',
            padding: '8px 12px',
            backgroundColor: '#E8F5E8',
            borderRadius: '6px',
            color: '#2E5939',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Mostrando {filteredProductos.length} de {productos.length} productos
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
                {isEditing ? "Editar Producto" : "Agregar Nuevo Producto"}
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
           
            <form onSubmit={handleAddProducto}>
              <div style={formContainerStyle}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <FormField
                    label="Nombre del Producto"
                    name="nombre"
                    value={newProducto.nombre}
                    onChange={handleChange}
                    onBlur={handleInputBlur}
                    error={formErrors.nombre}
                    success={formSuccess.nombre}
                    warning={formWarnings.nombre}
                    required={true}
                    disabled={loading}
                    maxLength={VALIDATION_RULES.nombre.maxLength}
                    showCharCount={true}
                    placeholder="Ej: Arroz, Leche, Jabón, Detergente..."
                    icon={<FaBox />}
                    touched={touchedFields.nombre}
                  />
                </div>

                <FormField
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaTag />
                      Categoría
                    </div>
                  }
                  name="idCategoria"
                  type="select"
                  value={newProducto.idCategoria}
                  onChange={handleChange}
                  onBlur={handleInputBlur}
                  error={formErrors.idCategoria}
                  success={formSuccess.idCategoria}
                  warning={formWarnings.idCategoria}
                  required={true}
                  disabled={loadingCategorias || loading}
                  options={categorias.map(cat => ({
                    value: cat.idCategoria,
                    label: cat.categoria
                  }))}
                  icon={<FaTag />}
                  touched={touchedFields.idCategoria}
                />

                <FormField
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaShoppingCart />
                      Marca
                    </div>
                  }
                  name="idMarca"
                  type="select"
                  value={newProducto.idMarca}
                  onChange={handleChange}
                  onBlur={handleInputBlur}
                  error={formErrors.idMarca}
                  success={formSuccess.idMarca}
                  warning={formWarnings.idMarca}
                  required={true}
                  disabled={loadingMarcas || loading}
                  options={marcas.map(marca => ({
                    value: marca.idMarca,
                    label: marca.nombre
                  }))}
                  icon={<FaShoppingCart />}
                  touched={touchedFields.idMarca}
                />

                <FormField
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaHashtag />
                      Cantidad
                    </div>
                  }
                  name="cantidad"
                  type="number"
                  value={newProducto.cantidad}
                  onChange={handleChange}
                  onBlur={handleInputBlur}
                  error={formErrors.cantidad}
                  success={formSuccess.cantidad}
                  warning={formWarnings.cantidad}
                  required={true}
                  disabled={loading}
                  min={VALIDATION_RULES.cantidad.min}
                  max={VALIDATION_RULES.cantidad.max}
                  placeholder="1"
                  icon={<FaHashtag />}
                  touched={touchedFields.cantidad}
                />

                <FormField
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaDollarSign />
                      Precio (COP)
                    </div>
                  }
                  name="precio"
                  type="number"
                  value={newProducto.precio}
                  onChange={handleChange}
                  onBlur={handleInputBlur}
                  error={formErrors.precio}
                  success={formSuccess.precio}
                  warning={formWarnings.precio}
                  required={true}
                  disabled={loading}
                  min={VALIDATION_RULES.precio.min}
                  max={VALIDATION_RULES.precio.max}
                  step="0.01"
                  placeholder="1000"
                  icon={<FaDollarSign />}
                  touched={touchedFields.precio}
                />

                {/* Botón Toggle para Estado */}
                <div style={{ gridColumn: '1 / -1', marginBottom: '15px' }}>
                  <label style={labelStyle}>
                    Estado del Producto
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button
                      type="button"
                      onClick={toggleEstado}
                      style={toggleButtonStyle(newProducto.estado)}
                      disabled={loading}
                    >
                      {newProducto.estado ? (
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
                      color: newProducto.estado ? '#4caf50' : '#e57373',
                      fontWeight: '500'
                    }}>
                      {newProducto.estado
                        ? 'El producto está activo y disponible para ventas'
                        : 'El producto está inactivo y no disponible para ventas'
                      }
                    </span>
                  </div>
                  {touchedFields.estado && formErrors.estado && (
                    <div style={errorValidationStyle}>
                      <FaExclamationTriangle size={12} />
                      {formErrors.estado}
                    </div>
                  )}
                  {touchedFields.estado && formSuccess.estado && (
                    <div style={successValidationStyle}>
                      <FaCheck size={12} />
                      {formSuccess.estado}
                    </div>
                  )}
                </div>
              </div>

              {/* Resumen del producto */}
              {newProducto.precio && newProducto.cantidad && (
                <div style={{
                  backgroundColor: '#E8F5E8',
                  border: '1px solid #679750',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '20px'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#2E5939' }}>Resumen del Producto</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                    <div>Precio unitario:</div>
                    <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      {formatPrice(parseFloat(newProducto.precio))}
                    </div>
                   
                    <div>Cantidad:</div>
                    <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      {newProducto.cantidad} unidades
                    </div>
                   
                    <div style={{ borderTop: '1px solid #ccc', paddingTop: '5px' }}>
                      <strong>Valor total:</strong>
                    </div>
                    <div style={{ textAlign: 'right', fontWeight: 'bold', color: '#2E5939', borderTop: '1px solid #ccc', paddingTop: '5px' }}>
                      {formatPrice(parseFloat(newProducto.precio) * parseInt(newProducto.cantidad))}
                    </div>
                  </div>
                </div>
              )}

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
                  {loading ? "Guardando..." : (isEditing ? "Actualizar Producto" : "Guardar Producto")}
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
      {showDetails && selectedProducto && (
        <div style={modalOverlayStyle}>
          <div style={detailsModalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939", textAlign: 'center' }}>Detalles del Producto</h2>
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
                <div style={detailValueStyle}>#{selectedProducto.idProducto}</div>
              </div>
             
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Nombre</div>
                <div style={detailValueStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaBox color="#679750" />
                    {selectedProducto.nombre}
                  </div>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Categoría</div>
                <div style={detailValueStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaTag color="#679750" />
                    {getCategoriaNombre(selectedProducto.idCategoria)}
                  </div>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Marca</div>
                <div style={detailValueStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaShoppingCart color="#679750" />
                    {getMarcaNombre(selectedProducto.idMarca)}
                  </div>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Cantidad</div>
                <div style={detailValueStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaHashtag color="#679750" />
                    {selectedProducto.cantidad} unidades
                  </div>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Precio Unitario</div>
                <div style={{ ...detailValueStyle, fontWeight: 'bold' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaDollarSign color="#679750" />
                    {formatPrice(selectedProducto.precio)}
                  </div>
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Valor Total</div>
                <div style={{ ...detailValueStyle, fontWeight: 'bold', color: '#679750' }}>
                  {formatPrice(selectedProducto.precio * selectedProducto.cantidad)}
                </div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Estado</div>
                <div style={{
                  ...detailValueStyle,
                  color: selectedProducto.estado ? '#4caf50' : '#e57373',
                  fontWeight: 'bold'
                }}>
                  {selectedProducto.estado ? '🟢 Activo' : '🔴 Inactivo'}
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
      {showDeleteConfirm && productoToDelete && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 450, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 20, color: "#2E5939" }}>Confirmar Eliminación</h3>
            <p style={{ marginBottom: 30, fontSize: '1.1rem', color: "#2E5939" }}>
              ¿Estás seguro de eliminar el producto "<strong>{productoToDelete.nombre}</strong>"?
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
                <strong style={{ color: '#856404' }}>Producto a eliminar</strong>
              </div>
              <p style={{ color: '#856404', margin: 0, fontSize: '0.9rem' }}>
                Precio: {formatPrice(productoToDelete.precio)} |
                Cantidad: {productoToDelete.cantidad} |
                Estado: {productoToDelete.estado ? 'Activo' : 'Inactivo'} |
                Categoría: {getCategoriaNombre(productoToDelete.idCategoria)} |
                Marca: {getMarcaNombre(productoToDelete.idMarca)}
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
              🔄 Cargando productos...
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
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Producto</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Categoría</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Marca</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Cantidad</th>
                <th style={{ padding: "15px", textAlign: "right", fontWeight: "bold" }}>Precio</th>
                <th style={{ padding: "15px", textAlign: "right", fontWeight: "bold" }}>Valor Total</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Estado</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProductos.length === 0 && !loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <FaBox size={30} color="#679750" />
                      {productos.length === 0 ? "No hay productos registrados" : "No se encontraron resultados con los filtros aplicados"}
                      {activeFiltersCount > 0 && (
                        <div style={{ color: '#679750', fontSize: '14px', marginTop: '5px' }}>
                          Filtros activos: {activeFiltersCount}
                        </div>
                      )}
                      {productos.length === 0 && (
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
                          Agregar Primer Producto
                        </button>
                      )}
                      {productos.length > 0 && activeFiltersCount > 0 && (
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
                paginatedProductos.map((producto) => (
                  <tr key={producto.idProducto} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "15px", fontWeight: "500" }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          backgroundColor: '#E8F5E8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#679750',
                          fontWeight: 'bold',
                          fontSize: '14px'
                        }}>
                          <FaBox />
                        </div>
                        <div>
                          <div style={{ fontWeight: "600", marginBottom: "5px" }}>
                            {producto.nombre}
                          </div>
                          <div style={{ fontSize: "13px", color: "#679750" }}>
                            ID: #{producto.idProducto}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "15px" }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaTag color="#679750" size={14} />
                        {getCategoriaNombre(producto.idCategoria)}
                      </div>
                    </td>
                    <td style={{ padding: "15px" }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaShoppingCart color="#679750" size={14} />
                        {getMarcaNombre(producto.idMarca)}
                      </div>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>
                      {producto.cantidad}
                    </td>
                    <td style={{ padding: "15px", textAlign: "right" }}>
                      {formatPrice(producto.precio)}
                    </td>
                    <td style={{ padding: "15px", textAlign: "right", fontWeight: "bold", color: "#679750" }}>
                      {formatPrice(producto.precio * producto.cantidad)}
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <button
                        onClick={() => toggleEstadoProducto(producto)}
                        disabled={loading}
                        style={{
                          cursor: loading ? "not-allowed" : "pointer",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          border: "none",
                          backgroundColor: producto.estado ? "#4caf50" : "#e57373",
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
                        {producto.estado ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                        <button
                          onClick={() => handleView(producto)}
                          style={btnAccion("#F7F4EA", "#2E5939")}
                          title="Ver Detalles"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(producto)}
                          style={btnAccion("#F7F4EA", "#2E5939")}
                          title="Editar Producto"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteClick(producto); }}
                          style={btnAccion("#fbe9e7", "#e57373")}
                          title="Eliminar Producto"
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

export default Productos;