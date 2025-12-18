// src/components/CategoriaProducto.jsx
import React, { useState, useMemo, useEffect } from "react";
import { 
  FaEye, FaEdit, FaTrash, FaTimes, FaSearch, FaPlus, 
  FaExclamationTriangle, FaCheck, FaInfoCircle, FaTag,
  FaToggleOn, FaToggleOff, FaSync, FaSlidersH
} from "react-icons/fa";
import axios from "axios";

// ===============================================
// ESTILOS MEJORADOS (CONSISTENTES CON TIPO CABAÑA)
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
  gridTemplateColumns: '1fr',
  gap: '15px',
  padding: '0 10px'
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
  maxWidth: 500,
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

const detailsModalStyle = {
  backgroundColor: "#fff",
  padding: 30,
  borderRadius: 12,
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  width: "90%",
  maxWidth: 500,
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
  categoria: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-_&.,()]+$/,
};

const VALIDATION_RULES = {
  categoria: {
    minLength: 2,
    maxLength: 50,
    required: true,
    pattern: VALIDATION_PATTERNS.categoria,
    errorMessages: {
      required: "El nombre de la categoría es obligatorio.",
      minLength: "El nombre debe tener al menos 2 caracteres.",
      maxLength: "El nombre no puede exceder los 50 caracteres.",
      pattern: "El nombre contiene caracteres no permitidos. Solo se permiten letras, espacios y los caracteres: - _ & . , ( )"
    }
  },
  descripcion: {
    minLength: 10,
    maxLength: 200,
    required: true,
    errorMessages: {
      required: "La descripción es obligatoria.",
      minLength: "La descripción debe tener al menos 10 caracteres.",
      maxLength: "La descripción no puede exceder los 200 caracteres.",
      invalid: "La descripción debe contener texto significativo."
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
const API_CATEGORIAS = "https://www.bosquesagrado.somee.com/api/CategoriaProductos";
const API_PRODUCTOS = "https://www.bosquesagrado.somee.com/api/Productos";
const ITEMS_PER_PAGE = 10;

// ===============================================
// COMPONENTE FormField PARA CATEGORÍAS
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
  options = [],
  style = {}, 
  required = true, 
  disabled = false,
  maxLength,
  placeholder,
  showCharCount = false,
  touched = false
}) => {
  const finalOptions = useMemo(() => {
    if (type === "select") {
      const placeholderOption = { value: "", label: "Seleccionar", disabled: required };
      return [placeholderOption, ...options];
    }
    return options;
  }, [options, type, required]);

  const handleFilteredInputChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (name === 'categoria') {
      filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-_&.,()]/g, "");
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
// COMPONENTE PRINCIPAL CategoriaProducto MEJORADO CON FILTROS
// ===============================================
const CategoriaProducto = () => {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState(null);
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

  // Estados para filtros - MEJORADO COMO EN SERVICIOS Y TEMPORADAS
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    estado: "all",
    productos: "all",
    tipoProductos: "all"
  });

  const [newCategoria, setNewCategoria] = useState({
    categoria: "",
    descripcion: "",
    estado: "true"
  });

  // ===============================================
  // EFECTOS
  // ===============================================
  useEffect(() => {
    fetchCategorias();
    fetchProductos();
  }, []);

  // Validar formulario en tiempo real solo para campos tocados
  useEffect(() => {
    if (showForm) {
      Object.keys(touchedFields).forEach(fieldName => {
        if (touchedFields[fieldName]) {
          validateField(fieldName, newCategoria[fieldName]);
        }
      });
    }
  }, [newCategoria, showForm, touchedFields]);

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
  // FUNCIONES DE FILTRADO MEJORADAS - IGUAL QUE EN SERVICIOS Y TEMPORADAS
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
      productos: "all",
      tipoProductos: "all"
    });
    setCurrentPage(1);
  };

  // Contador de filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.estado !== "all") count++;
    if (filters.productos !== "all") count++;
    if (filters.tipoProductos !== "all") count++;
    return count;
  }, [filters]);

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
    else if (fieldName === 'estado') {
      success = value === "true" ? "Categoría activa" : "Categoría inactiva";
    }
    else if (trimmedValue) {
      success = `${fieldName === 'categoria' ? 'Nombre' : 'Descripción'} válido.`;
      
      if (fieldName === 'categoria' && trimmedValue.length > 30) {
        warning = "El nombre es bastante largo. Considere un nombre más corto si es posible.";
      } else if (fieldName === 'descripcion' && trimmedValue.length > 150) {
        warning = "La descripción es muy larga. Considere ser más conciso.";
      } else if (fieldName === 'descripcion' && trimmedValue.length < 15) {
        warning = "La descripción es muy breve. Sea más descriptivo.";
      }
    }

    if (fieldName === 'categoria' && trimmedValue && !error) {
      const duplicate = categorias.find(cat => 
        cat.categoria.toLowerCase() === trimmedValue.toLowerCase() && 
        (!isEditing || cat.idCategoria !== newCategoria.idCategoria)
      );
      if (duplicate) {
        error = "Ya existe una categoría con este nombre.";
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
      categoria: true,
      descripcion: true,
      estado: true
    };
    setTouchedFields(allFieldsTouched);

    const categoriaValid = validateField('categoria', newCategoria.categoria);
    const descripcionValid = validateField('descripcion', newCategoria.descripcion);
    const estadoValid = validateField('estado', newCategoria.estado);

    const isValid = categoriaValid && descripcionValid && estadoValid;
    
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
  const fetchCategorias = async () => {
    setLoading(true);
    setError(null);
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
      } else {
        throw new Error("Formato de datos inválido");
      }
    } catch (error) {
      console.error("❌ Error al obtener categorías:", error);
      handleApiError(error, "cargar las categorías");
    } finally {
      setLoading(false);
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

  const handleAddCategoria = async (e) => {
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
      const categoriaData = {
        categoria: newCategoria.categoria.trim(),
        descripcion: newCategoria.descripcion.trim(),
        estado: newCategoria.estado === "true"
      };

      console.log("📤 Enviando datos:", categoriaData);

      if (isEditing) {
        categoriaData.idCategoria = newCategoria.idCategoria;
        await axios.put(`${API_CATEGORIAS}/${newCategoria.idCategoria}`, categoriaData, {
          headers: { 'Content-Type': 'application/json' }
        });
        displayAlert("Categoría actualizada exitosamente.", "success");
      } else {
        await axios.post(API_CATEGORIAS, categoriaData, {
          headers: { 'Content-Type': 'application/json' }
        });
        displayAlert("Categoría agregada exitosamente.", "success");
      }
      
      await fetchCategorias();
      closeForm();
    } catch (error) {
      console.error("❌ Error al guardar categoría:", error);
      handleApiError(error, isEditing ? "actualizar la categoría" : "agregar la categoría");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (categoriaToDelete) {
      setLoading(true);
      try {
        // Verificar si la categoría tiene productos asociados
        const hasProducts = await checkIfCategoriaHasProducts(categoriaToDelete.idCategoria);
        if (hasProducts) {
          displayAlert("No se puede eliminar una categoría que tiene productos asociados", "error");
          setLoading(false);
          return;
        }

        await axios.delete(`${API_CATEGORIAS}/${categoriaToDelete.idCategoria}`);
        displayAlert("Categoría eliminada exitosamente.", "success");
        await fetchCategorias();
      } catch (error) {
        console.error("❌ Error al eliminar categoría:", error);
        
        if (error.response && error.response.status === 409) {
          displayAlert("No se puede eliminar la categoría porque tiene productos asociados.", "error");
        } else {
          handleApiError(error, "eliminar la categoría");
        }
      } finally {
        setLoading(false);
        setCategoriaToDelete(null);
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
        errorMessage = "Conflicto: La categoría está siendo utilizada y no puede ser eliminada.";
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
    setNewCategoria((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Nueva función para manejar el blur (cuando el campo pierde el foco)
  const handleInputBlur = (e) => {
    const { name } = e.target;
    markFieldAsTouched(name);
    validateField(name, newCategoria[name]);
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
    setTouchedFields({});
    setNewCategoria({
      categoria: "",
      descripcion: "",
      estado: "true"
    });
  };

  const closeDetailsModal = () => {
    setShowDetails(false);
    setSelectedCategoria(null);
  };

  const cancelDelete = () => {
    setCategoriaToDelete(null);
    setShowDeleteConfirm(false);
  };

  const toggleEstadoCategoria = async (categoria) => {
    // Validar si la categoría tiene productos asociados antes de desactivar
    if (categoria.estado) {
      const hasProducts = await checkIfCategoriaHasProducts(categoria.idCategoria);
      if (hasProducts) {
        displayAlert("No se puede desactivar una categoría que tiene productos asociados", "error");
        return;
      }
    }

    setLoading(true);
    try {
      const updatedCategoria = { 
        ...categoria, 
        estado: !categoria.estado 
      };
      await axios.put(`${API_CATEGORIAS}/${categoria.idCategoria}`, updatedCategoria, {
        headers: { 'Content-Type': 'application/json' }
      });
      displayAlert(`Categoría ${updatedCategoria.estado ? 'activada' : 'desactivada'} exitosamente.`, "success");
      await fetchCategorias();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      handleApiError(error, "cambiar el estado");
    } finally {
      setLoading(false);
    }
  };

  // Función mejorada para verificar si una categoría tiene productos asociados
  const checkIfCategoriaHasProducts = async (categoriaId) => {
    try {
      const productosEnCategoria = productos.filter(producto => 
        producto.idCategoria === categoriaId
      );
      return productosEnCategoria.length > 0;
    } catch (error) {
      console.error("Error al verificar productos:", error);
      return true; // Por seguridad, asumir que tiene productos si hay error
    }
  };

  // Función para contar productos por categoría
  const contarProductosPorCategoria = (categoriaId) => {
    return productos.filter(producto => producto.idCategoria === categoriaId).length;
  };

  const handleView = (categoria) => {
    setSelectedCategoria(categoria);
    setShowDetails(true);
  };

  const handleEdit = (categoria) => {
    setNewCategoria({
      ...categoria,
      estado: categoria.estado.toString()
    });
    setIsEditing(true);
    setShowForm(true);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
    setTouchedFields({});
  };

  const handleDeleteClick = (categoria) => {
    // Validar si la categoría tiene productos asociados antes de eliminar
    const hasProducts = contarProductosPorCategoria(categoria.idCategoria) > 0;
    if (hasProducts) {
      displayAlert("No se puede eliminar una categoría que tiene productos asociados", "error");
      return;
    }
    setCategoriaToDelete(categoria);
    setShowDeleteConfirm(true);
  };

  // ===============================================
  // FUNCIONES DE FILTRADO Y PAGINACIÓN MEJORADAS
  // ===============================================
  const filteredCategorias = useMemo(() => {
    let filtered = categorias.filter(categoria => {
      // Búsqueda general
      const matchesSearch = 
        categoria.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        categoria.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Filtro por estado
      if (filters.estado !== "all") {
        const estadoFilter = filters.estado === "activo";
        if (categoria.estado !== estadoFilter) return false;
      }

      // Filtro por productos
      const productosCount = contarProductosPorCategoria(categoria.idCategoria);
      if (filters.productos !== "all") {
        if (filters.productos === "con" && productosCount === 0) return false;
        if (filters.productos === "sin" && productosCount > 0) return false;
      }

      // Filtro por tipo de productos
      if (filters.tipoProductos !== "all") {
        if (filters.tipoProductos === "pocos" && productosCount >= 5) return false;
        if (filters.tipoProductos === "muchos" && productosCount < 5) return false;
      }

      return true;
    });

    return filtered;
  }, [categorias, searchTerm, filters]);

  const totalPages = Math.ceil(filteredCategorias.length / ITEMS_PER_PAGE);

  const paginatedCategorias = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCategorias.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCategorias, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
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
              onClick={fetchCategorias}
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
          <h2 style={{ margin: 0, color: "#2E5939" }}>Gestión de Categorías de Producto</h2>
          <p style={{ margin: "5px 0 0 0", color: "#679750", fontSize: "14px" }}>
            {categorias.length} categorías registradas • {categorias.filter(c => c.estado).length} activas
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={() => {
              setShowForm(true);
              setIsEditing(false);
              setFormErrors({});
              setFormSuccess({});
              setFormWarnings({});
              setTouchedFields({});
              setNewCategoria({
                categoria: "",
                descripcion: "",
                estado: "true"
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
            <FaPlus /> Nueva Categoría
          </button>
        </div>
      </div>

      {/* Estadísticas - MEJORADO COMO EN SERVICIOS */}
      {!loading && categorias.length > 0 && (
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
              {categorias.length}
            </div>
            <div style={{ fontSize: '16px', color: '#679750', fontWeight: '600' }}>
              Total Categorías
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
              {categorias.filter(c => c.estado).length}
            </div>
            <div style={{ fontSize: '16px', color: '#4caf50', fontWeight: '600' }}>
              Categorías Activas
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
              {categorias.filter(c => !c.estado).length}
            </div>
            <div style={{ fontSize: '16px', color: '#e57373', fontWeight: '600' }}>
              Categorías Inactivas
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
              {filteredCategorias.length}
            </div>
            <div style={{ fontSize: '16px', color: '#2196f3', fontWeight: '600' }}>
              Resultados Filtrados
            </div>
          </div>
        </div>
      )}

      {/* Barra de búsqueda y filtros - MEJORADO COMO EN SERVICIOS Y TEMPORADAS */}
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
                  <option value="activo">Categorías activas</option>
                  <option value="inactivo">Categorías inactivas</option>
                </select>
              </div>

              {/* Filtro por productos */}
              <div>
                <label style={labelStyle}>Productos</label>
                <select
                  name="productos"
                  value={filters.productos}
                  onChange={handleFilterChange}
                  style={{
                    ...inputStyle,
                    width: '100%'
                  }}
                >
                  <option value="all">Todas las categorías</option>
                  <option value="con">Con productos</option>
                  <option value="sin">Sin productos</option>
                </select>
              </div>

              {/* Filtro por tipo de productos */}
              <div>
                <label style={labelStyle}>Cantidad de Productos</label>
                <select
                  name="tipoProductos"
                  value={filters.tipoProductos}
                  onChange={handleFilterChange}
                  style={{
                    ...inputStyle,
                    width: '100%'
                  }}
                >
                  <option value="all">Cualquier cantidad</option>
                  <option value="pocos">Pocos productos (1-4)</option>
                  <option value="muchos">Muchos productos (5+)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Información de resultados filtrados */}
        {filteredCategorias.length !== categorias.length && (
          <div style={{
            marginTop: '10px',
            padding: '8px 12px',
            backgroundColor: '#E8F5E8',
            borderRadius: '6px',
            color: '#2E5939',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Mostrando {filteredCategorias.length} de {categorias.length} categorías
            {activeFiltersCount > 0 && ` (filtros aplicados: ${activeFiltersCount})`}
          </div>
        )}
      </div>

      {/* Resto del código permanece igual (Formulario, Modal de detalles, Modal de confirmación, Tabla, Paginación) */}
      {/* ... */}

      {/* Formulario de agregar/editar */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939" }}>
                {isEditing ? "Editar Categoría" : "Nueva Categoría"}
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
            
            <form onSubmit={handleAddCategoria} style={formContainerStyle}>
              <FormField
                label="Nombre de la Categoría"
                name="categoria"
                value={newCategoria.categoria}
                onChange={handleChange}
                onBlur={handleInputBlur}
                error={formErrors.categoria}
                success={formSuccess.categoria}
                warning={formWarnings.categoria}
                required={true}
                disabled={loading}
                maxLength={VALIDATION_RULES.categoria.maxLength}
                showCharCount={true}
                placeholder="Ej: Aseo, Bebidas, Alimentos, Limpieza..."
                touched={touchedFields.categoria}
              />

              <FormField
                label="Descripción"
                name="descripcion"
                type="textarea"
                value={newCategoria.descripcion}
                onChange={handleChange}
                onBlur={handleInputBlur}
                error={formErrors.descripcion}
                success={formSuccess.descripcion}
                warning={formWarnings.descripcion}
                required={true}
                disabled={loading}
                maxLength={VALIDATION_RULES.descripcion.maxLength}
                showCharCount={true}
                placeholder="Descripción detallada de la categoría y su propósito..."
                touched={touchedFields.descripcion}
              />

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
                  {loading ? "Guardando..." : (isEditing ? "Actualizar" : "Guardar")} Categoría
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
      )}

      {/* Modal de detalles */}
      {showDetails && selectedCategoria && (
        <div style={modalOverlayStyle}>
          <div style={detailsModalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939" }}>Detalles de la Categoría</h2>
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
                <div style={detailValueStyle}>#{selectedCategoria.idCategoria}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Nombre de la Categoría</div>
                <div style={detailValueStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaTag color="#679750" />
                    {selectedCategoria.categoria}
                  </div>
                </div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Descripción</div>
                <div style={detailValueStyle}>{selectedCategoria.descripcion}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Productos Asociados</div>
                <div style={detailValueStyle}>
                  <span style={{ 
                    backgroundColor: '#E8F5E8',
                    color: '#2E5939',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {contarProductosPorCategoria(selectedCategoria.idCategoria)} productos
                  </span>
                </div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Estado</div>
                <div style={{
                  ...detailValueStyle,
                  color: selectedCategoria.estado ? '#4caf50' : '#e57373',
                  fontWeight: 'bold'
                }}>
                  {selectedCategoria.estado ? '🟢 Activa' : '🔴 Inactiva'}
                </div>
              </div>

              {/* Información sobre productos */}
              {contarProductosPorCategoria(selectedCategoria.idCategoria) > 0 && (
                <div style={detailItemStyle}>
                  <div style={detailLabelStyle}>Información Importante</div>
                  <div style={{
                    ...detailValueStyle,
                    color: '#ff9800',
                    fontSize: '14px',
                    backgroundColor: '#fff3cd',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ffeaa7'
                  }}>
                    ⚠️ Esta categoría tiene productos asociados. No se puede eliminar ni desactivar mientras tenga productos.
                  </div>
                </div>
              )}
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
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteConfirm && categoriaToDelete && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 500, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 12, color: "#2E5939" }}>Confirmar Eliminación</h3>
            <p style={{ marginBottom: 18, fontSize: '1rem', color: "#2E5939" }}>
              ¿Estás seguro de eliminar de forma permanente la categoría "<strong>{categoriaToDelete.categoria}</strong>"? Esta acción no se puede deshacer.
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
                Si la categoría está asociada a productos, la eliminación será rechazada por el servidor y se mostrará el motivo.
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
              🔄 Cargando categorías...
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
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Categoría</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Descripción</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Productos</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Estado</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategorias.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <FaInfoCircle size={30} color="#679750" />
                      {categorias.length === 0 ? "No hay categorías registradas" : "No se encontraron resultados con los filtros aplicados"}
                      {activeFiltersCount > 0 && (
                        <div style={{ color: '#679750', fontSize: '14px', marginTop: '5px' }}>
                          Filtros activos: {activeFiltersCount}
                        </div>
                      )}
                      {categorias.length === 0 && (
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
                          Agregar Primera Categoría
                        </button>
                      )}
                      {categorias.length > 0 && activeFiltersCount > 0 && (
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
                paginatedCategorias.map((categoria) => {
                  const productosCount = contarProductosPorCategoria(categoria.idCategoria);
                  return (
                    <tr key={categoria.idCategoria} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "15px", fontWeight: "500" }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <FaTag color="#679750" />
                          {categoria.categoria}
                        </div>
                      </td>
                      <td style={{ padding: "15px" }}>
                        {categoria.descripcion?.length > 100 
                          ? `${categoria.descripcion.substring(0, 100)}...` 
                          : categoria.descripcion}
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <span style={{ 
                          backgroundColor: productosCount > 0 ? '#E8F5E8' : '#F7F4EA',
                          color: productosCount > 0 ? '#2E5939' : '#666',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {productosCount} productos
                        </span>
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <button
                          onClick={() => toggleEstadoCategoria(categoria)}
                          disabled={productosCount > 0 && categoria.estado}
                          style={{
                            cursor: productosCount > 0 && categoria.estado ? "not-allowed" : "pointer",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            border: "none",
                            backgroundColor: categoria.estado ? "#4caf50" : "#e57373",
                            color: "white",
                            fontWeight: "600",
                            fontSize: "12px",
                            minWidth: "80px",
                            opacity: productosCount > 0 && categoria.estado ? 0.6 : 1,
                            transition: "all 0.3s ease",
                          }}
                          onMouseOver={(e) => {
                            if (!loading && !(productosCount > 0 && categoria.estado)) {
                              e.target.style.transform = "scale(1.05)";
                            }
                          }}
                          onMouseOut={(e) => {
                            if (!loading && !(productosCount > 0 && categoria.estado)) {
                              e.target.style.transform = "scale(1)";
                            }
                          }}
                          title={productosCount > 0 && categoria.estado ? "No se puede desactivar - Tiene productos asociados" : ""}
                        >
                          {categoria.estado ? "Activa" : "Inactiva"}
                        </button>
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
                          <button
                            onClick={() => handleView(categoria)}
                            style={btnAccion("#F7F4EA", "#2E5939")}
                            title="Ver Detalles"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleEdit(categoria)}
                            style={btnAccion("#F7F4EA", "#2E5939")}
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteClick(categoria); }}
                            style={{
                              ...btnAccion("#fbe9e7", "#e57373"),
                              opacity: productosCount > 0 ? 0.5 : 1,
                              cursor: productosCount > 0 ? "not-allowed" : "pointer"
                            }}
                            title={productosCount > 0 ? "No se puede eliminar - Tiene productos asociados" : "Eliminar"}
                            disabled={productosCount > 0}
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
    </div>
  );
};

export default CategoriaProducto;