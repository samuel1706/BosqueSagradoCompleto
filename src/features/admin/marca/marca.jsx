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
// FUNCIONES DE VALIDACIÓN MEJORADAS PARA MARCAS
// ===============================================
const validateMarca = (nombre, marcasExistentes = [], idActual = null) => {
  // Validar que no esté vacío
  if (!nombre || nombre.trim().length === 0) {
    return { isValid: false, message: 'El nombre de la marca es obligatorio' };
  }

  // Validar longitud mínima y máxima
  if (nombre.trim().length < 2) {
    return { isValid: false, message: 'El nombre debe tener al menos 2 caracteres' };
  }

  if (nombre.trim().length > 50) {
    return { isValid: false, message: 'El nombre no puede exceder los 50 caracteres' };
  }

  // Validar formato (solo letras, números, espacios y caracteres especiales básicos)
  const marcaRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-_&.,()]{2,50}$/;
  if (!marcaRegex.test(nombre.trim())) {
    return { 
      isValid: false, 
      message: 'El nombre solo puede contener letras, números, espacios y los caracteres especiales: - _ & . , ( )' 
    };
  }

  // Validar que no exista otra marca con el mismo nombre (case insensitive)
  const marcaNormalizada = nombre.trim().toLowerCase();
  const existeMarca = marcasExistentes.some(marca => 
    marca.nombre.toLowerCase() === marcaNormalizada && 
    marca.idMarca !== idActual
  );

  if (existeMarca) {
    return { 
      isValid: false, 
      message: 'Ya existe una marca con este nombre' 
    };
  }

  // Validar palabras prohibidas o inapropiadas
  const palabrasProhibidas = ['admin', 'administrador', 'root', 'system', 'test', 'prueba'];
  if (palabrasProhibidas.includes(marcaNormalizada)) {
    return { 
      isValid: false, 
      message: 'Este nombre de marca no está permitido' 
    };
  }

  // Validar que no sea solo números
  const soloNumeros = /^\d+$/;
  if (soloNumeros.test(nombre.trim())) {
    return { 
      isValid: false, 
      message: 'El nombre no puede contener solo números' 
    };
  }

  return { isValid: true, message: '' };
};

// ===============================================
// DATOS DE CONFIGURACIÓN
// ===============================================
const API_MARCAS = "http://localhost:5255/api/MarcaProducto";
const API_PRODUCTOS = "http://localhost:5255/api/Productos";

const ITEMS_PER_PAGE = 5;

// ===============================================
// COMPONENTE PRINCIPAL Marca
// ===============================================
const Marca = () => {
  const [marcas, setMarcas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMarca, setSelectedMarca] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [marcaToDelete, setMarcaToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [warnings, setWarnings] = useState({});

  const [newMarca, setNewMarca] = useState({
    nombre: ""
  });

  // ===============================================
  // EFECTOS
  // ===============================================
  useEffect(() => {
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
        const marcaValidation = validateMarca(value, marcas, isEditing ? newMarca.idMarca : null);
        if (!marcaValidation.isValid) {
          newErrors.nombre = marcaValidation.message;
        } else {
          // Advertencia para nombres muy similares
          const marcaNormalizada = value.trim().toLowerCase();
          const marcaSimilar = marcas.find(marca => 
            marca.nombre.toLowerCase().includes(marcaNormalizada) && 
            marca.idMarca !== (isEditing ? newMarca.idMarca : null)
          );
          if (marcaSimilar) {
            newWarnings.nombre = `Advertencia: Existe una marca similar: "${marcaSimilar.nombre}"`;
          }
          
          // Advertencia para nombres muy genéricos
          const nombresGenericos = ['marca', 'producto', 'genérico', 'general', 'varios'];
          if (nombresGenericos.includes(marcaNormalizada)) {
            newWarnings.nombre = 'Considera usar un nombre más específico para la marca';
          }
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

    // Validar nombre de marca
    const marcaValidation = validateMarca(
      newMarca.nombre, 
      marcas, 
      isEditing ? newMarca.idMarca : null
    );
    if (!marcaValidation.isValid) {
      newErrors.nombre = marcaValidation.message;
    }

    setErrors(newErrors);

    // Si no hay errores, el formulario es válido
    return Object.keys(newErrors).length === 0;
  };

  // ===============================================
  // FUNCIONES DE LA API MEJORADAS
  // ===============================================
  const fetchMarcas = async () => {
    setLoading(true);
    setError(null);
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
      } else {
        throw new Error("Formato de datos inválido");
      }
    } catch (error) {
      console.error("❌ Error al obtener marcas:", error);
      handleApiError(error, "cargar las marcas");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMarca = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      displayAlert("Por favor, corrige los errores en el formulario", "error");
      return;
    }

    setLoading(true);
    try {
      // Validación adicional antes de enviar
      const finalMarcaValidation = validateMarca(
        newMarca.nombre, 
        marcas, 
        isEditing ? newMarca.idMarca : null
      );
      
      if (!finalMarcaValidation.isValid) {
        displayAlert(finalMarcaValidation.message, "error");
        setLoading(false);
        return;
      }

      if (isEditing) {
        await axios.put(`${API_MARCAS}/${newMarca.idMarca}`, newMarca, {
          headers: { 'Content-Type': 'application/json' }
        });
        displayAlert("Marca actualizada exitosamente.");
      } else {
        await axios.post(API_MARCAS, newMarca, {
          headers: { 'Content-Type': 'application/json' }
        });
        displayAlert("Marca agregada exitosamente.");
      }
      
      await fetchMarcas();
      closeForm();
    } catch (error) {
      console.error("Error al guardar marca:", error);
      
      // Manejar errores específicos de la API
      if (error.response && error.response.status === 409) {
        displayAlert("Ya existe una marca con este nombre", "error");
      } else {
        handleApiError(error, isEditing ? "actualizar la marca" : "agregar la marca");
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (marcaToDelete) {
      setLoading(true);
      try {
        // Verificar si la marca tiene productos asociados
        const hasProducts = await checkIfMarcaHasProducts(marcaToDelete.idMarca);
        if (hasProducts) {
          displayAlert("No se puede eliminar una marca que tiene productos asociados", "error");
          setLoading(false);
          return;
        }

        await axios.delete(`${API_MARCAS}/${marcaToDelete.idMarca}`);
        displayAlert("Marca eliminada exitosamente.");
        await fetchMarcas();
      } catch (error) {
        console.error("Error al eliminar marca:", error);
        
        if (error.response && error.response.status === 409) {
          displayAlert("No se puede eliminar la marca porque tiene productos asociados", "error");
        } else {
          handleApiError(error, "eliminar la marca");
        }
      } finally {
        setLoading(false);
        setMarcaToDelete(null);
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
          errorMessage = "Conflicto: La marca ya existe o tiene productos asociados";
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
    
    setNewMarca((prev) => ({
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
    setNewMarca({
      nombre: ""
    });
    clearErrors();
  };

  const closeDetailsModal = () => {
    setShowDetails(false);
    setSelectedMarca(null);
  };

  const cancelDelete = () => {
    setMarcaToDelete(null);
    setShowDeleteConfirm(false);
  };

  // Función mejorada para verificar si una marca tiene productos asociados
  const checkIfMarcaHasProducts = async (marcaId) => {
    try {
      // Buscar productos que pertenezcan a esta marca
      const response = await axios.get(`${API_PRODUCTOS}/marca/${marcaId}`, {
        timeout: 5000
      });
      
      return response.data && Array.isArray(response.data) && response.data.length > 0;
    } catch (error) {
      console.error("Error al verificar productos:", error);
      
      // Si no se puede verificar, asumir que podría tener productos por seguridad
      if (error.response && error.response.status === 404) {
        // Si el endpoint no existe, usar un enfoque alternativo
        return marcas.find(marca => marca.idMarca === marcaId)?.productosCount > 0;
      }
      
      return true; // Por seguridad, asumir que tiene productos si hay error
    }
  };

  const handleView = (marca) => {
    setSelectedMarca(marca);
    setShowDetails(true);
  };

  const handleEdit = (marca) => {
    setNewMarca({
      ...marca
    });
    setIsEditing(true);
    setShowForm(true);
    clearErrors();
  };

  const handleDeleteClick = (marca) => {
    // Validar si la marca tiene productos asociados antes de eliminar
    checkIfMarcaHasProducts(marca.idMarca).then(hasProducts => {
      if (hasProducts) {
        displayAlert("No se puede eliminar una marca que tiene productos asociados", "error");
        return;
      }
      setMarcaToDelete(marca);
      setShowDeleteConfirm(true);
    });
  };

  // ===============================================
  // FUNCIONES DE FILTRADO Y PAGINACIÓN
  // ===============================================
  const filteredMarcas = useMemo(() => {
    return marcas.filter(marca =>
      marca.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [marcas, searchTerm]);

  const totalPages = Math.ceil(filteredMarcas.length / ITEMS_PER_PAGE);

  const paginatedMarcas = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMarcas.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMarcas, currentPage]);

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
              onClick={fetchMarcas}
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
          <h2 style={{ margin: 0, color: "#2E5939" }}>Gestión de Marcas</h2>
          <p style={{ margin: "5px 0 0 0", color: "#679750", fontSize: "14px" }}>
            {marcas.length} marcas registradas
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setIsEditing(false);
            setNewMarca({
              nombre: ""
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
          <FaPlus /> Agregar Marca
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Buscar por nombre de marca..."
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
          {filteredMarcas.length} resultados
        </div>
      </div>

      {/* Formulario de agregar/editar */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939" }}>
                {isEditing ? "Editar Marca" : "Nueva Marca"}
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
            
            <form onSubmit={handleAddMarca} style={formContainerStyle}>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Nombre de la Marca *</label>
                <input
                  type="text"
                  name="nombre"
                  value={newMarca.nombre}
                  onChange={handleInputChange}
                  style={errors.nombre ? inputErrorStyle : inputStyle}
                  placeholder="Ej: Dove, Coca-Cola, Samsung, etc."
                  required
                  maxLength={50}
                />
                {errors.nombre && <span style={errorStyle}>{errors.nombre}</span>}
                {warnings.nombre && <span style={warningStyle}>{warnings.nombre}</span>}
                <div style={{ 
                  fontSize: '12px', 
                  color: errors.nombre ? '#e53935' : '#679750', 
                  marginTop: '4px' 
                }}>
                  {newMarca.nombre.length}/50 caracteres
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
                  {loading ? "Guardando..." : (isEditing ? "Actualizar" : "Guardar")} Marca
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
      {showDetails && selectedMarca && (
        <div style={modalOverlayStyle}>
          <div style={detailsModalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939" }}>Detalles de la Marca</h2>
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
                <div style={detailValueStyle}>#{selectedMarca.idMarca}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Nombre</div>
                <div style={detailValueStyle}>{selectedMarca.nombre}</div>
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
      {showDeleteConfirm && marcaToDelete && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 450, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 20, color: "#2E5939" }}>Confirmar Eliminación</h3>
            <p style={{ marginBottom: 30, fontSize: '1.1rem', color: "#2E5939" }}>
              ¿Estás seguro de eliminar la marca "<strong>{marcaToDelete.nombre}</strong>"?
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
              🔄 Cargando marcas...
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
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>ID</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Nombre</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMarcas.length === 0 && !loading ? (
                <tr>
                  <td colSpan={3} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
                    {marcas.length === 0 ? "No hay marcas registradas" : "No se encontraron resultados"}
                  </td>
                </tr>
              ) : (
                paginatedMarcas.map((marca) => (
                  <tr key={marca.idMarca} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "15px", fontWeight: "500" }}>#{marca.idMarca}</td>
                    <td style={{ padding: "15px" }}>{marca.nombre}</td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <button
                        onClick={() => handleView(marca)}
                        style={btnAccion("#F7F4EA", "#2E5939")}
                        title="Ver Detalles"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(marca)}
                        style={btnAccion("#F7F4EA", "#2E5939")}
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(marca)}
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

export default Marca;