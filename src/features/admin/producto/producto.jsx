import React, { useState, useMemo, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaTimes, FaPlus, FaSearch, FaExclamationTriangle } from "react-icons/fa";
import axios from "axios";

// ===============================================
// ESTILOS (Actualizados para coincidir con Cabins)
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
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
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
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  boxSizing: 'border-box'
};

const inputErrorStyle = {
  ...inputStyle,
  border: "1px solid #e53935",
  backgroundColor: "#fef7f7"
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
  maxWidth: 600,
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
  color: "#679750",
  marginBottom: 5,
  fontSize: "14px"
};

const detailValueStyle = {
  fontSize: 16,
  color: "#2E5939",
  fontWeight: "500"
};

const errorStyle = {
  color: '#e53935',
  fontSize: '12px',
  marginTop: '4px',
  display: 'block',
  fontWeight: '500'
};

const warningStyle = {
  color: '#ff9800',
  fontSize: '12px',
  marginTop: '4px',
  display: 'block',
  fontWeight: '500'
};

// ===============================================
// FUNCIONES DE VALIDACIÓN MEJORADAS PARA PRODUCTOS
// ===============================================
const validateNombre = (nombre, productosExistentes = [], idActual = null) => {
  if (!nombre || nombre.trim().length === 0) {
    return { isValid: false, message: 'El nombre del producto es obligatorio' };
  }

  if (nombre.trim().length < 2) {
    return { isValid: false, message: 'El nombre debe tener al menos 2 caracteres' };
  }

  if (nombre.trim().length > 100) {
    return { isValid: false, message: 'El nombre no puede exceder los 100 caracteres' };
  }

  // Solo letras y espacios (sin números ni caracteres especiales)
  const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!nombreRegex.test(nombre.trim())) {
    return { 
      isValid: false, 
      message: 'El nombre solo puede contener letras y espacios. No se permiten números ni caracteres especiales.' 
    };
  }

  // Validar unicidad (case insensitive)
  const nombreNormalizado = nombre.trim().toLowerCase();
  const existeProducto = productosExistentes.some(prod => 
    prod.nombre.toLowerCase() === nombreNormalizado && 
    prod.idProducto !== idActual
  );

  if (existeProducto) {
    return { 
      isValid: false, 
      message: 'Ya existe un producto con este nombre' 
    };
  }

  return { isValid: true, message: '' };
};

const validatePrecio = (precio) => {
  if (!precio || precio.toString().trim().length === 0) {
    return { isValid: false, message: 'El precio es obligatorio' };
  }

  const precioNum = parseFloat(precio);
  if (isNaN(precioNum)) {
    return { isValid: false, message: 'El precio debe ser un número válido' };
  }

  if (precioNum <= 0) {
    return { isValid: false, message: 'El precio debe ser mayor a 0' };
  }

  if (precioNum > 1000000000) {
    return { isValid: false, message: 'El precio no puede exceder 1,000,000,000' };
  }

  // Validar que no tenga más de 2 decimales
  const decimalPart = precio.toString().split('.')[1];
  if (decimalPart && decimalPart.length > 2) {
    return { isValid: false, message: 'El precio no puede tener más de 2 decimales' };
  }

  return { isValid: true, message: '' };
};

const validateCantidad = (cantidad) => {
  if (!cantidad || cantidad.toString().trim().length === 0) {
    return { isValid: false, message: 'La cantidad es obligatoria' };
  }

  const cantidadNum = parseInt(cantidad);
  if (isNaN(cantidadNum)) {
    return { isValid: false, message: 'La cantidad debe ser un número entero válido' };
  }

  if (cantidadNum < 0) {
    return { isValid: false, message: 'La cantidad no puede ser negativa' };
  }

  if (cantidadNum > 1000000) {
    return { isValid: false, message: 'La cantidad no puede exceder 1,000,000 unidades' };
  }

  return { isValid: true, message: '' };
};

const validateCategoria = (idCategoria, categorias) => {
  if (!idCategoria) {
    return { isValid: false, message: 'Debe seleccionar una categoría' };
  }

  const categoriaExiste = categorias.some(cat => cat.idCategoria === parseInt(idCategoria));
  if (!categoriaExiste) {
    return { isValid: false, message: 'La categoría seleccionada no es válida' };
  }

  return { isValid: true, message: '' };
};

const validateMarca = (idMarca, marcas) => {
  if (!idMarca) {
    return { isValid: false, message: 'Debe seleccionar una marca' };
  }

  const marcaExiste = marcas.some(marca => marca.idMarca === parseInt(idMarca));
  if (!marcaExiste) {
    return { isValid: false, message: 'La marca seleccionada no es válida' };
  }

  return { isValid: true, message: '' };
};

// ===============================================
// DATOS DE CONFIGURACIÓN
// ===============================================
const API_PRODUCTOS = "http://localhost:5255/api/Productos";
const API_CATEGORIAS = "http://localhost:5255/api/CategoriaProductos";
const API_MARCAS = "http://localhost:5255/api/MarcaProducto";

const ITEMS_PER_PAGE = 5;

// ===============================================
// COMPONENTE FormField
// ===============================================
const FormField = ({ label, name, type = "text", value, onChange, error, warning, options = [], style = {}, required = true, disabled = false, maxLength, min, max, step }) => {
  const finalOptions = useMemo(() => {
    if (type === "select") {
      const placeholderOption = { value: "", label: "Selecciona", disabled: required };
      return [placeholderOption, ...options];
    }
    return options;
  }, [options, type, required]);

  const handleFilteredInputChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (name === 'nombre') {
      // Solo letras, números, espacios y caracteres básicos
      filteredValue = value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-_&.,()]/g, "");
    } else if (name === 'precio') {
      // Solo números y punto decimal
      filteredValue = value.replace(/[^0-9.]/g, "");
      // Solo permitir un punto decimal
      const parts = filteredValue.split('.');
      if (parts.length > 2) {
        filteredValue = parts[0] + '.' + parts.slice(1).join('');
      }
    } else if (name === 'cantidad') {
      // Solo números
      filteredValue = value.replace(/[^0-9]/g, "");
    }
    
    if (maxLength && filteredValue.length > maxLength) {
      filteredValue = filteredValue.slice(0, maxLength);
    }
    
    onChange({ target: { name, value: filteredValue } });
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
          style={{
            ...inputStyle,
            ...(error ? inputErrorStyle : {})
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
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleFilteredInputChange}
          style={{
            ...inputStyle,
            ...(error ? inputErrorStyle : {})
          }}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          min={min}
          max={max}
          step={step}
          placeholder={type === 'number' ? '0' : ''}
        />
      )}
      {error && <span style={errorStyle}>{error}</span>}
      {warning && !error && <span style={warningStyle}>{warning}</span>}
      {maxLength && (
        <div style={{ 
          fontSize: '12px', 
          color: error ? '#e53935' : '#679750', 
          marginTop: '4px',
          textAlign: 'right'
        }}>
          {value?.length || 0}/{maxLength} caracteres
        </div>
      )}
    </div>
  );
};

// ===============================================
// COMPONENTE PRINCIPAL Productos (CON VALIDACIONES MEJORADAS)
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
  const [errors, setErrors] = useState({});
  const [warnings, setWarnings] = useState({});

  const [newProducto, setNewProducto] = useState({
    nombre: "",
    idCategoria: "",
    idMarca: "",
    cantidad: 1,
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

  // ===============================================
  // FUNCIONES DE VALIDACIÓN MEJORADAS
  // ===============================================
  const clearErrors = () => {
    setErrors({});
    setWarnings({});
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    const newWarnings = { ...warnings };

    // Eliminar errores y advertencias previas del campo
    delete newErrors[name];
    delete newWarnings[name];

    switch (name) {
      case 'nombre':
        const nombreValidation = validateNombre(value, productos, isEditing ? newProducto.idProducto : null);
        if (!nombreValidation.isValid) {
          newErrors.nombre = nombreValidation.message;
        } else {
          // Advertencia para nombres muy similares
          const nombreNormalizado = value.trim().toLowerCase();
          const nombreSimilar = productos.find(prod => 
            prod.nombre.toLowerCase().includes(nombreNormalizado) && 
            prod.idProducto !== (isEditing ? newProducto.idProducto : null)
          );
          if (nombreSimilar) {
            newWarnings.nombre = `Advertencia: Existe un producto similar: "${nombreSimilar.nombre}"`;
          }
        }
        break;

      case 'precio':
        const precioValidation = validatePrecio(value);
        if (!precioValidation.isValid) {
          newErrors.precio = precioValidation.message;
        } else {
          const precioNum = parseFloat(value);
          if (precioNum < 100) {
            newWarnings.precio = 'El precio parece muy bajo para un producto';
          } else if (precioNum > 100000) {
            newWarnings.precio = 'El precio parece muy alto, verifica el valor';
          }
        }
        break;

      case 'cantidad':
        const cantidadValidation = validateCantidad(value);
        if (!cantidadValidation.isValid) {
          newErrors.cantidad = cantidadValidation.message;
        } else {
          const cantidadNum = parseInt(value);
          if (cantidadNum === 0) {
            newWarnings.cantidad = 'El producto quedará sin stock';
          } else if (cantidadNum > 1000) {
            newWarnings.cantidad = 'La cantidad parece muy alta, verifica el valor';
          }
        }
        break;

      case 'idCategoria':
        const categoriaValidation = validateCategoria(value, categorias);
        if (!categoriaValidation.isValid) {
          newErrors.idCategoria = categoriaValidation.message;
        }
        break;

      case 'idMarca':
        const marcaValidation = validateMarca(value, marcas);
        if (!marcaValidation.isValid) {
          newErrors.idMarca = marcaValidation.message;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    setWarnings(newWarnings);
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar todos los campos
    const nombreValidation = validateNombre(
      newProducto.nombre, 
      productos, 
      isEditing ? newProducto.idProducto : null
    );
    if (!nombreValidation.isValid) {
      newErrors.nombre = nombreValidation.message;
    }

    const precioValidation = validatePrecio(newProducto.precio);
    if (!precioValidation.isValid) {
      newErrors.precio = precioValidation.message;
    }

    const cantidadValidation = validateCantidad(newProducto.cantidad);
    if (!cantidadValidation.isValid) {
      newErrors.cantidad = cantidadValidation.message;
    }

    const categoriaValidation = validateCategoria(newProducto.idCategoria, categorias);
    if (!categoriaValidation.isValid) {
      newErrors.idCategoria = categoriaValidation.message;
    }

    const marcaValidation = validateMarca(newProducto.idMarca, marcas);
    if (!marcaValidation.isValid) {
      newErrors.idMarca = marcaValidation.message;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ===============================================
  // FUNCIONES DE LA API (MEJORADAS)
  // ===============================================
  const fetchProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔍 Conectando a la API de productos:", API_PRODUCTOS);
      const res = await axios.get(API_PRODUCTOS, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log("✅ Datos de productos recibidos:", res.data);
      
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
      console.log("🔍 Conectando a la API de categorías:", API_CATEGORIAS);
      const res = await axios.get(API_CATEGORIAS, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log("✅ Datos de categorías recibidos:", res.data);
      
      if (Array.isArray(res.data)) {
        setCategorias(res.data);
      }
    } catch (error) {
      console.error("❌ Error al obtener categorías:", error);
      handleApiError(error, "cargar las categorías");
    } finally {
      setLoadingCategorias(false);
    }
  };

  const fetchMarcas = async () => {
    setLoadingMarcas(true);
    try {
      console.log("🔍 Conectando a la API de marcas:", API_MARCAS);
      const res = await axios.get(API_MARCAS, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log("✅ Datos de marcas recibidos:", res.data);
      
      if (Array.isArray(res.data)) {
        setMarcas(res.data);
      }
    } catch (error) {
      console.error("❌ Error al obtener marcas:", error);
      handleApiError(error, "cargar las marcas");
    } finally {
      setLoadingMarcas(false);
    }
  };

  const handleAddProducto = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      displayAlert("Por favor, corrige los errores en el formulario", "error");
      return;
    }

    setLoading(true);
    try {
      // Preparar datos para el API
      const productoData = {
        nombre: newProducto.nombre.trim(),
        idCategoria: parseInt(newProducto.idCategoria),
        idMarca: parseInt(newProducto.idMarca),
        cantidad: parseInt(newProducto.cantidad),
        precio: parseFloat(newProducto.precio),
        imagen: newProducto.imagen,
        estado: newProducto.estado === "true" || newProducto.estado === true
      };

      console.log("📤 Enviando datos al servidor:", productoData);

      let response;
      if (isEditing) {
        // Para editar, incluir el ID en los datos
        const updateData = {
          idProducto: parseInt(newProducto.idProducto),
          ...productoData
        };
        console.log("🔄 Actualizando producto:", updateData);
        response = await axios.put(`${API_PRODUCTOS}/${newProducto.idProducto}`, updateData, {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        displayAlert("Producto actualizado exitosamente.");
      } else {
        // Para crear nuevo producto
        console.log("➕ Creando nuevo producto:", productoData);
        response = await axios.post(API_PRODUCTOS, productoData, {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        displayAlert("Producto agregado exitosamente.");
      }
      
      console.log("✅ Respuesta del servidor:", response.data);
      await fetchProductos();
      closeForm();
    } catch (error) {
      console.error("❌ Error al guardar producto:", error);
      
      if (error.response) {
        console.error("📋 Detalles del error:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        
        if (error.response.data && typeof error.response.data === 'object') {
          const serverMessage = error.response.data.title || error.response.data.message || JSON.stringify(error.response.data);
          displayAlert(`Error del servidor: ${serverMessage}`, "error");
        }
      }
      
      handleApiError(error, isEditing ? "actualizar el producto" : "agregar el producto");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (productoToDelete) {
      setLoading(true);
      try {
        await axios.delete(`${API_PRODUCTOS}/${productoToDelete.idProducto}`);
        displayAlert("Producto eliminado exitosamente.");
        await fetchProductos();
        
        // Ajustar la página si es necesario
        if (paginatedProductos.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        
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

  const toggleEstado = async (producto) => {
    setLoading(true);
    try {
      const updatedProducto = { 
        idProducto: producto.idProducto,
        nombre: producto.nombre,
        idCategoria: producto.idCategoria,
        idMarca: producto.idMarca,
        cantidad: producto.cantidad,
        precio: producto.precio,
        imagen: producto.imagen,
        estado: !producto.estado 
      };
      
      console.log("🔄 Cambiando estado del producto:", updatedProducto);
      
      await axios.put(`${API_PRODUCTOS}/${producto.idProducto}`, updatedProducto, {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      displayAlert(`Producto ${updatedProducto.estado ? 'activado' : 'desactivado'} exitosamente.`);
      await fetchProductos();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      handleApiError(error, "cambiar el estado del producto");
    } finally {
      setLoading(false);
    }
  };

  // ===============================================
  // FUNCIONES AUXILIARES MEJORADAS
  // ===============================================
  const handleApiError = (error, operation) => {
    let errorMessage = `Error al ${operation}`;
    
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      errorMessage = "Error de conexión. Verifica que el servidor esté ejecutándose.";
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = "No se puede conectar al servidor en http://localhost:5255";
    } else if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 400:
          errorMessage = "Datos inválidos enviados al servidor";
          break;
        case 404:
          errorMessage = "Recurso no encontrado";
          break;
        case 409:
          errorMessage = "Conflicto: El producto ya existe o tiene registros asociados";
          break;
        case 500:
          errorMessage = "Error interno del servidor";
          break;
        default:
          errorMessage = `Error ${status}: ${error.response.data?.message || 'Error del servidor'}`;
      }
    } else if (error.request) {
      errorMessage = "No hay respuesta del servidor.";
    } else if (error.message.includes('timeout')) {
      errorMessage = "Tiempo de espera agotado. El servidor no respondió a tiempo.";
    }
    
    setError(errorMessage);
    displayAlert(errorMessage, "error");
  };

  const displayAlert = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage("");
    }, 4000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setNewProducto((prev) => ({
      ...prev,
      [name]: value
    }));

    // Validar el campo en tiempo real después de un pequeño delay
    setTimeout(() => {
      validateField(name, value);
    }, 300);
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setNewProducto({
      nombre: "",
      idCategoria: "",
      idMarca: "",
      cantidad: 1,
      precio: "",
      imagen: "nada",
      estado: true
    });
    clearErrors();
  };

  const closeDetailsModal = () => {
    setShowDetails(false);
    setSelectedProducto(null);
  };

  const cancelDelete = () => {
    setProductoToDelete(null);
    setShowDeleteConfirm(false);
  };

  const handleView = (producto) => {
    setSelectedProducto(producto);
    setShowDetails(true);
  };

  const handleEdit = (producto) => {
    setNewProducto({
      idProducto: producto.idProducto,
      nombre: producto.nombre || "",
      idCategoria: producto.idCategoria ? producto.idCategoria.toString() : "",
      idMarca: producto.idMarca ? producto.idMarca.toString() : "",
      cantidad: producto.cantidad ? producto.cantidad.toString() : "1",
      precio: producto.precio ? producto.precio.toString() : "",
      imagen: producto.imagen || "nada",
      estado: producto.estado
    });
    setIsEditing(true);
    setShowForm(true);
    clearErrors();
  };

  const handleDeleteClick = (producto) => {
    setProductoToDelete(producto);
    setShowDeleteConfirm(true);
  };

  // ===============================================
  // FUNCIONES DE FILTRADO Y PAGINACIÓN
  // ===============================================
  const filteredProductos = useMemo(() => {
    return productos.filter(producto =>
      producto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCategoriaNombre(producto.idCategoria)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getMarcaNombre(producto.idMarca)?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [productos, searchTerm]);

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
  // RENDERIZADO
  // ===============================================
  return (
    <div style={{ position: "relative", padding: 20, marginLeft: 260, backgroundColor: "#f5f8f2", minHeight: "100vh" }}>
      
      {/* Alerta */}
      {showAlert && (
        <div style={{
          ...alertStyle,
          backgroundColor: alertType === "error" ? '#e53935' : '#2E5939'
        }}>
          {alertType === "error" && <FaExclamationTriangle />}
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
              onClick={fetchProductos}
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
          <h2 style={{ margin: 0, color: "#2E5939" }}>Gestión de Productos</h2>
          <p style={{ margin: "5px 0 0 0", color: "#679750", fontSize: "14px" }}>
            {productos.length} productos registrados | {categorias.length} categorías | {marcas.length} marcas
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setIsEditing(false);
            setNewProducto({
              nombre: "",
              idCategoria: categorias.length > 0 ? categorias[0].idCategoria.toString() : "",
              idMarca: marcas.length > 0 ? marcas[0].idMarca.toString() : "",
              cantidad: 1,
              precio: "",
              imagen: "nada",
              estado: true
            });
            clearErrors();
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

      {/* Barra de búsqueda */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 500 }}>
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
        <div style={{ color: '#2E5939', fontSize: '14px', whiteSpace: 'nowrap' }}>
          {filteredProductos.length} resultados
        </div>
      </div>

      {/* Formulario de agregar/editar */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
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
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleAddProducto} style={formContainerStyle}>
              <FormField
                label="Nombre del Producto"
                name="nombre"
                value={newProducto.nombre}
                onChange={handleInputChange}
                error={errors.nombre}
                warning={warnings.nombre}
                style={{ gridColumn: '1 / -1' }}
                required={true}
                maxLength={100}
              />
              
              <FormField
                label="Categoría"
                name="idCategoria"
                type="select"
                value={newProducto.idCategoria}
                onChange={handleInputChange}
                error={errors.idCategoria}
                warning={warnings.idCategoria}
                options={categorias.map(cat => ({ 
                  value: cat.idCategoria, 
                  label: cat.categoria 
                }))}
                required={true}
                disabled={loadingCategorias || loading}
              />
              
              <FormField
                label="Marca"
                name="idMarca"
                type="select"
                value={newProducto.idMarca}
                onChange={handleInputChange}
                error={errors.idMarca}
                warning={warnings.idMarca}
                options={marcas.map(marca => ({ 
                  value: marca.idMarca, 
                  label: marca.nombre 
                }))}
                required={true}
                disabled={loadingMarcas || loading}
              />
              
              <FormField
                label="Cantidad"
                name="cantidad"
                type="number"
                value={newProducto.cantidad}
                onChange={handleInputChange}
                error={errors.cantidad}
                warning={warnings.cantidad}
                required={true}
                min="0"
                max="1000000"
              />
              
              <FormField
                label="Precio"
                name="precio"
                type="number"
                value={newProducto.precio}
                onChange={handleInputChange}
                error={errors.precio}
                warning={warnings.precio}
                required={true}
                min="0"
                max="1000000000"
                step="0.01"
              />

              <div style={{ display: "flex", justifyContent: "space-between", gridColumn: '1 / -1', marginTop: 20 }}>
                <button
                  type="submit"
                  disabled={loading || Object.keys(errors).length > 0}
                  style={{
                    backgroundColor: (loading || Object.keys(errors).length > 0) ? "#ccc" : "#2E5939",
                    color: "#fff",
                    padding: "12px 25px",
                    border: "none",
                    borderRadius: 10,
                    cursor: (loading || Object.keys(errors).length > 0) ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    if (!loading && Object.keys(errors).length === 0) {
                      e.target.style.background = "linear-gradient(90deg, #67d630, #95d34e)";
                      e.target.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loading && Object.keys(errors).length === 0) {
                      e.target.style.background = "#2E5939";
                      e.target.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {loading ? "Guardando..." : (isEditing ? "Actualizar" : "Guardar")} Producto
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
                <div style={detailValueStyle}>{selectedProducto.nombre}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Categoría</div>
                <div style={detailValueStyle}>{getCategoriaNombre(selectedProducto.idCategoria)}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Marca</div>
                <div style={detailValueStyle}>{getMarcaNombre(selectedProducto.idMarca)}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Cantidad</div>
                <div style={detailValueStyle}>{selectedProducto.cantidad}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Precio</div>
                <div style={detailValueStyle}>${selectedProducto.precio?.toLocaleString('es-CO') || '0'}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Imagen</div>
                <div style={detailValueStyle}>{selectedProducto.imagen || "No disponible"}</div>
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
            <p style={{ marginBottom: 20, color: '#e57373', fontSize: '0.9rem' }}>
              ⚠️ Nota: Si el producto tiene registros asociados, no podrá ser eliminado.
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
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Estado</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProductos.length === 0 && !loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
                    {productos.length === 0 ? "No hay productos registrados" : "No se encontraron resultados"}
                  </td>
                </tr>
              ) : (
                paginatedProductos.map((producto) => (
                  <tr key={producto.idProducto} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "15px", fontWeight: "500" }}>{producto.nombre}</td>
                    <td style={{ padding: "15px" }}>{getCategoriaNombre(producto.idCategoria)}</td>
                    <td style={{ padding: "15px" }}>{getMarcaNombre(producto.idMarca)}</td>
                    <td style={{ padding: "15px", textAlign: "center" }}>{producto.cantidad}</td>
                    <td style={{ padding: "15px", textAlign: "right", fontWeight: "bold" }}>
                      ${producto.precio?.toLocaleString('es-CO') || '0'}
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <button
                        onClick={() => toggleEstado(producto)}
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
                          minWidth: "80px"
                        }}
                        title={producto.estado ? "Activo" : "Inactivo"}
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
                          onClick={() => handleDeleteClick(producto)}
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