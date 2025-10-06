import React, { useState, useMemo, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaTimes, FaPlus, FaExclamationTriangle } from "react-icons/fa";
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
// FUNCIONES DE VALIDACIÓN MEJORADAS
// ===============================================
const validateCategoria = (categoria, categoriasExistentes = [], idActual = null) => {
  // Validar que no esté vacío
  if (!categoria || categoria.trim().length === 0) {
    return { isValid: false, message: 'El nombre de la categoría es obligatorio' };
  }

  // Validar longitud mínima y máxima
  if (categoria.trim().length < 2) {
    return { isValid: false, message: 'El nombre debe tener al menos 2 caracteres' };
  }

  if (categoria.trim().length > 50) {
    return { isValid: false, message: 'El nombre no puede exceder los 50 caracteres' };
  }

  // Validar formato (solo letras, espacios y caracteres especiales básicos)
  const categoriaRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-_&.,()]{2,50}$/;
  if (!categoriaRegex.test(categoria.trim())) {
    return { 
      isValid: false, 
      message: 'El nombre solo puede contener letras, espacios y los caracteres especiales: - _ & . , ( )' 
    };
  }

  // Validar que no exista otra categoría con el mismo nombre (case insensitive)
  const categoriaNormalizada = categoria.trim().toLowerCase();
  const existeCategoria = categoriasExistentes.some(cat => 
    cat.categoria.toLowerCase() === categoriaNormalizada && 
    cat.idCategoria !== idActual
  );

  if (existeCategoria) {
    return { 
      isValid: false, 
      message: 'Ya existe una categoría con este nombre' 
    };
  }

  // Validar palabras prohibidas o inapropiadas
  const palabrasProhibidas = ['admin', 'administrador', 'root', 'system', 'test', 'prueba'];
  if (palabrasProhibidas.includes(categoriaNormalizada)) {
    return { 
      isValid: false, 
      message: 'Este nombre de categoría no está permitido' 
    };
  }

  return { isValid: true, message: '' };
};

const validateDescripcion = (descripcion) => {
  // Validar que no esté vacío
  if (!descripcion || descripcion.trim().length === 0) {
    return { isValid: false, message: 'La descripción es obligatoria' };
  }

  // Validar longitud mínima
  if (descripcion.trim().length < 10) {
    return { isValid: false, message: 'La descripción debe tener al menos 10 caracteres' };
  }

  // Validar longitud máxima
  if (descripcion.trim().length > 200) {
    return { isValid: false, message: 'La descripción no puede exceder los 200 caracteres' };
  }

  // Validar que no sea solo números o caracteres especiales
  const soloNumerosEspeciales = /^[\d\s\W]+$/;
  if (soloNumerosEspeciales.test(descripcion.trim())) {
    return { 
      isValid: false, 
      message: 'La descripción debe contener texto significativo' 
    };
  }

  // Validar palabras repetidas excesivamente
  const palabras = descripcion.trim().toLowerCase().split(/\s+/);
  const palabrasUnicas = new Set(palabras);
  if (palabrasUnicas.size < 3 && palabras.length > 5) {
    return { 
      isValid: false, 
      message: 'La descripción contiene demasiadas palabras repetidas' 
    };
  }

  return { isValid: true, message: '' };
};

const validateEstado = (estado) => {
  if (typeof estado !== 'boolean' && estado !== 'true' && estado !== 'false') {
    return { isValid: false, message: 'El estado debe ser un valor booleano válido' };
  }
  return { isValid: true, message: '' };
};

// ===============================================
// DATOS DE CONFIGURACIÓN
// ===============================================
const API_CATEGORIAS = "http://localhost:5255/api/CategoriaProductos";
const API_PRODUCTOS = "http://localhost:5255/api/Productos";

const ITEMS_PER_PAGE = 5;

// ===============================================
// COMPONENTE PRINCIPAL CategoriaProducto
// ===============================================
const CategoriaProducto = () => {
  const [categorias, setCategorias] = useState([]);
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
  const [errors, setErrors] = useState({});
  const [warnings, setWarnings] = useState({});

  const [newCategoria, setNewCategoria] = useState({
    categoria: "",
    descripcion: "",
    estado: true
  });

  // ===============================================
  // EFECTOS
  // ===============================================
  useEffect(() => {
    fetchCategorias();
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
      case 'categoria':
        const categoriaValidation = validateCategoria(value, categorias, isEditing ? newCategoria.idCategoria : null);
        if (!categoriaValidation.isValid) {
          newErrors.categoria = categoriaValidation.message;
        } else {
          // Advertencia para nombres muy similares
          const categoriaNormalizada = value.trim().toLowerCase();
          const categoriaSimilar = categorias.find(cat => 
            cat.categoria.toLowerCase().includes(categoriaNormalizada) && 
            cat.idCategoria !== (isEditing ? newCategoria.idCategoria : null)
          );
          if (categoriaSimilar) {
            newWarnings.categoria = `Advertencia: Existe una categoría similar: "${categoriaSimilar.categoria}"`;
          }
        }
        break;

      case 'descripcion':
        const descripcionValidation = validateDescripcion(value);
        if (!descripcionValidation.isValid) {
          newErrors.descripcion = descripcionValidation.message;
        } else {
          // Advertencia para descripciones muy cortas
          if (value.trim().length < 15) {
            newWarnings.descripcion = 'Considera agregar más detalles para una mejor descripción';
          }
        }
        break;

      case 'estado':
        const estadoValidation = validateEstado(value);
        if (!estadoValidation.isValid) {
          newErrors.estado = estadoValidation.message;
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

    // Validar nombre de categoría
    const categoriaValidation = validateCategoria(
      newCategoria.categoria, 
      categorias, 
      isEditing ? newCategoria.idCategoria : null
    );
    if (!categoriaValidation.isValid) {
      newErrors.categoria = categoriaValidation.message;
    }

    // Validar descripción
    const descripcionValidation = validateDescripcion(newCategoria.descripcion);
    if (!descripcionValidation.isValid) {
      newErrors.descripcion = descripcionValidation.message;
    }

    // Validar estado
    const estadoValidation = validateEstado(newCategoria.estado);
    if (!estadoValidation.isValid) {
      newErrors.estado = estadoValidation.message;
    }

    setErrors(newErrors);

    // Si no hay errores, el formulario es válido
    return Object.keys(newErrors).length === 0;
  };

  // ===============================================
  // FUNCIONES DE LA API MEJORADAS
  // ===============================================
  const fetchCategorias = async () => {
    setLoading(true);
    setError(null);
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

  const handleAddCategoria = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      displayAlert("Por favor, corrige los errores en el formulario", "error");
      return;
    }

    setLoading(true);
    try {
      const categoriaData = {
        ...newCategoria,
        estado: newCategoria.estado === "true" || newCategoria.estado === true
      };

      // Validación adicional antes de enviar
      const finalCategoriaValidation = validateCategoria(
        categoriaData.categoria, 
        categorias, 
        isEditing ? categoriaData.idCategoria : null
      );
      
      if (!finalCategoriaValidation.isValid) {
        displayAlert(finalCategoriaValidation.message, "error");
        setLoading(false);
        return;
      }

      if (isEditing) {
        await axios.put(`${API_CATEGORIAS}/${newCategoria.idCategoria}`, categoriaData, {
          headers: { 'Content-Type': 'application/json' }
        });
        displayAlert("Categoría actualizada exitosamente.");
      } else {
        await axios.post(API_CATEGORIAS, categoriaData, {
          headers: { 'Content-Type': 'application/json' }
        });
        displayAlert("Categoría agregada exitosamente.");
      }
      
      await fetchCategorias();
      closeForm();
    } catch (error) {
      console.error("Error al guardar categoría:", error);
      
      // Manejar errores específicos de la API
      if (error.response && error.response.status === 409) {
        displayAlert("Ya existe una categoría con este nombre", "error");
      } else {
        handleApiError(error, isEditing ? "actualizar la categoría" : "agregar la categoría");
      }
    } finally {
      setLoading(false);
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
        displayAlert("Categoría eliminada exitosamente.");
        await fetchCategorias();
      } catch (error) {
        console.error("Error al eliminar categoría:", error);
        
        if (error.response && error.response.status === 409) {
          displayAlert("No se puede eliminar la categoría porque tiene productos asociados", "error");
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
          errorMessage = "Conflicto: La categoría ya existe o tiene productos asociados";
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
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;
    
    setNewCategoria((prev) => ({
      ...prev,
      [name]: finalValue
    }));

    // Validar el campo en tiempo real después de un pequeño delay
    setTimeout(() => {
      validateField(name, finalValue);
    }, 300);
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setNewCategoria({
      categoria: "",
      descripcion: "",
      estado: true
    });
    clearErrors();
  };

  const closeDetailsModal = () => {
    setShowDetails(false);
    setSelectedCategoria(null);
  };

  const cancelDelete = () => {
    setCategoriaToDelete(null);
    setShowDeleteConfirm(false);
  };

  const toggleEstado = async (categoria) => {
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
      const updatedCategoria = { ...categoria, estado: !categoria.estado };
      await axios.put(`${API_CATEGORIAS}/${categoria.idCategoria}`, updatedCategoria);
      displayAlert(`Categoría ${updatedCategoria.estado ? 'activada' : 'desactivada'} exitosamente.`);
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
      // Buscar productos que pertenezcan a esta categoría
      const response = await axios.get(`${API_PRODUCTOS}/categoria/${categoriaId}`, {
        timeout: 5000
      });
      
      return response.data && Array.isArray(response.data) && response.data.length > 0;
    } catch (error) {
      console.error("Error al verificar productos:", error);
      
      // Si no se puede verificar, asumir que podría tener productos por seguridad
      if (error.response && error.response.status === 404) {
        // Si el endpoint no existe, usar un enfoque alternativo
        return categorias.find(cat => cat.idCategoria === categoriaId)?.productosCount > 0;
      }
      
      return true; // Por seguridad, asumir que tiene productos si hay error
    }
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
    clearErrors();
  };

  const handleDeleteClick = (categoria) => {
    // Validar si la categoría tiene productos asociados antes de eliminar
    checkIfCategoriaHasProducts(categoria.idCategoria).then(hasProducts => {
      if (hasProducts) {
        displayAlert("No se puede eliminar una categoría que tiene productos asociados", "error");
        return;
      }
      setCategoriaToDelete(categoria);
      setShowDeleteConfirm(true);
    });
  };

  // ===============================================
  // FUNCIONES DE FILTRADO Y PAGINACIÓN
  // ===============================================
  const filteredCategorias = useMemo(() => {
    return categorias.filter(categoria =>
      categoria.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoria.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categorias, searchTerm]);

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
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, color: "#2E5939" }}>Gestión de Categorías de Producto</h2>
          <p style={{ margin: "5px 0 0 0", color: "#679750", fontSize: "14px" }}>
            {categorias.length} categorías registradas
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setIsEditing(false);
            setNewCategoria({
              categoria: "",
              descripcion: "",
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
          <FaPlus /> Agregar Categoría
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
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
          {filteredCategorias.length} resultados
        </div>
      </div>

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
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleAddCategoria} style={formContainerStyle}>
              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>Nombre de la Categoría *</label>
                <input
                  type="text"
                  name="categoria"
                  value={newCategoria.categoria}
                  onChange={handleInputChange}
                  style={errors.categoria ? inputErrorStyle : inputStyle}
                  placeholder="Ej: Aseo, Bebidas, Alimentos..."
                  required
                  maxLength={50}
                />
                {errors.categoria && <span style={errorStyle}>{errors.categoria}</span>}
                {warnings.categoria && <span style={warningStyle}>{warnings.categoria}</span>}
                <div style={{ 
                  fontSize: '12px', 
                  color: errors.categoria ? '#e53935' : '#679750', 
                  marginTop: '4px' 
                }}>
                  {newCategoria.categoria.length}/50 caracteres
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>Descripción *</label>
                <textarea
                  name="descripcion"
                  value={newCategoria.descripcion}
                  onChange={handleInputChange}
                  style={{ 
                    ...(errors.descripcion ? inputErrorStyle : inputStyle), 
                    minHeight: '80px', 
                    resize: 'vertical' 
                  }}
                  placeholder="Descripción detallada de la categoría (mínimo 10 caracteres, máximo 200)"
                  required
                  maxLength={200}
                />
                {errors.descripcion && <span style={errorStyle}>{errors.descripcion}</span>}
                {warnings.descripcion && <span style={warningStyle}>{warnings.descripcion}</span>}
                <div style={{ 
                  fontSize: '12px', 
                  color: errors.descripcion ? '#e53935' : '#679750', 
                  marginTop: '4px' 
                }}>
                  {newCategoria.descripcion.length}/200 caracteres
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
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
                    flex: 1,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                  }}
                >
                  {loading ? "Guardando..." : (isEditing ? "Actualizar" : "Guardar")} Categoría
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
                <div style={detailLabelStyle}>Nombre</div>
                <div style={detailValueStyle}>{selectedCategoria.categoria}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Descripción</div>
                <div style={detailValueStyle}>{selectedCategoria.descripcion}</div>
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
          <div style={{ ...modalContentStyle, maxWidth: 450, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 20, color: "#2E5939" }}>Confirmar Eliminación</h3>
            <p style={{ marginBottom: 30, fontSize: '1.1rem', color: "#2E5939" }}>
              ¿Estás seguro de eliminar la categoría "<strong>{categoriaToDelete.categoria}</strong>"?
            </p>
            <p style={{ marginBottom: 20, fontSize: '0.9rem', color: '#e53935', fontStyle: 'italic' }}>
              ⚠️ Esta acción no se puede deshacer
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
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Estado</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategorias.length === 0 && !loading ? (
                <tr>
                  <td colSpan={4} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
                    {categorias.length === 0 ? "No hay categorías registradas" : "No se encontraron resultados"}
                  </td>
                </tr>
              ) : (
                paginatedCategorias.map((categoria) => (
                  <tr key={categoria.idCategoria} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "15px", fontWeight: "500" }}>{categoria.categoria}</td>
                    <td style={{ padding: "15px" }}>{categoria.descripcion}</td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <button
                        onClick={() => toggleEstado(categoria)}
                        style={{
                          cursor: "pointer",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          border: "none",
                          backgroundColor: categoria.estado ? "#4caf50" : "#e57373",
                          color: "white",
                          fontWeight: "600",
                          fontSize: "12px",
                          minWidth: "80px"
                        }}
                      >
                        {categoria.estado ? "Activa" : "Inactiva"}
                      </button>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
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
                        onClick={() => handleDeleteClick(categoria)}
                        style={btnAccion("#fbe9e7", "#e57373")}
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
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

export default CategoriaProducto;