import React, { useState, useMemo, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaTimes, FaPlus, FaSearch, FaExclamationTriangle, FaCheck, FaInfoCircle } from "react-icons/fa";
import axios from "axios";

// ===============================================
// ESTILOS
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
  boxSizing: 'border-box',
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
  marginBottom: 5
};

const detailValueStyle = {
  fontSize: 16,
  color: "#2E5939"
};

const listItemStyle = {
  marginBottom: 8,
  fontSize: 16,
  display: 'flex',
  alignItems: 'center',
  gap: '5px'
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
  options = [], 
  style = {}, 
  required = true, 
  disabled = false,
  maxLength,
  placeholder,
  showCharCount = false,
  rows = 3
}) => {
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

    if (name === 'nombreRol') {
      // Solo letras y espacios, sin números ni caracteres especiales
      filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
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
            onChange={onChange}
            style={{
              ...getInputStyle(),
              minHeight: `${rows * 20}px`,
              resize: "vertical",
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
        <div>
          <input
            type={type}
            name={name}
            value={value}
            onChange={name === 'nombreRol' ? handleFilteredInputChange : onChange}
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
// CONFIGURACIÓN DE API
// ===============================================
const API_ROLES = "http://localhost:5255/api/Rol";

const ITEMS_PER_PAGE = 5;

// ===============================================
// COMPONENTE PRINCIPAL Rol CON VALIDACIONES MEJORADAS
// ===============================================
const Rol = () => {
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRol, setSelectedRol] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [rolToDelete, setRolToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState({});
  const [formWarnings, setFormWarnings] = useState({});

  const [newRol, setNewRol] = useState({
    nombreRol: "",
    descripcion: "",
    estado: true,
  });

  // ===============================================
  // EFECTOS
  // ===============================================
  useEffect(() => {
    fetchRoles();
  }, []);

  // Validar formulario en tiempo real
  useEffect(() => {
    if (showForm) {
      validateField('nombreRol', newRol.nombreRol);
      validateField('descripcion', newRol.descripcion);
    }
  }, [newRol, showForm]);

  // ===============================================
  // FUNCIONES DE VALIDACIÓN MEJORADAS
  // ===============================================
  const validateField = (fieldName, value) => {
    let error = "";
    let success = "";
    let warning = "";

    switch (fieldName) {
      case 'nombreRol':
        if (!value || !value.trim()) {
          error = "El nombre del rol es requerido.";
        } else if (value.trim().length < 2) {
          error = "El nombre debe tener al menos 2 caracteres.";
        } else if (value.trim().length > 50) {
          error = "El nombre no puede exceder los 50 caracteres.";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          error = "El nombre solo puede contener letras y espacios. No se permiten números ni caracteres especiales.";
        } else if (value.trim().length > 30) {
          warning = "El nombre es bastante largo. Considere abreviar si es posible.";
        } else {
          success = "Nombre válido.";
        }
        
        // Verificar duplicados (solo si no estamos editando el mismo rol)
        if (value.trim() && !error) {
          const duplicate = roles.find(rol => 
            rol.nombreRol.toLowerCase() === value.trim().toLowerCase() && 
            (!isEditing || rol.idRol !== newRol.idRol)
          );
          if (duplicate) {
            error = "Ya existe un rol con este nombre.";
          }
        }
        break;

      case 'descripcion':
        if (!value || !value.trim()) {
          error = "La descripción es requerida.";
        } else if (value.trim().length < 10) {
          error = "La descripción debe tener al menos 10 caracteres.";
        } else if (value.trim().length > 200) {
          error = "La descripción no puede exceder los 200 caracteres.";
        } else if (value.trim().length < 20) {
          warning = "La descripción es muy breve. Sea más específico sobre las funciones del rol.";
        } else {
          success = "Descripción válida.";
        }
        break;

      default:
        break;
    }

    setFormErrors(prev => ({ ...prev, [fieldName]: error }));
    setFormSuccess(prev => ({ ...prev, [fieldName]: success }));
    setFormWarnings(prev => ({ ...prev, [fieldName]: warning }));

    return !error;
  };

  const validateForm = (rol = newRol) => {
    const nombreValid = validateField('nombreRol', rol.nombreRol);
    const descripcionValid = validateField('descripcion', rol.descripcion);

    const isValid = nombreValid && descripcionValid;
    
    if (!isValid) {
      displayAlert("❌ Por favor, corrige los errores en el formulario antes de guardar.");
      // Scroll al primer error
      setTimeout(() => {
        const firstErrorField = document.querySelector('[style*="border-color: #e57373"]');
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }

    return isValid;
  };

  // ===============================================
  // FUNCIONES DE LA API (CON VALIDACIONES MEJORADAS)
  // ===============================================
  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔍 Conectando a la API de roles:", API_ROLES);
      const res = await axios.get(API_ROLES, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log("✅ Datos de roles recibidos:", res.data);
      
      if (Array.isArray(res.data)) {
        setRoles(res.data);
      } else {
        throw new Error("Formato de datos inválido");
      }
    } catch (error) {
      console.error("❌ Error al obtener roles:", error);
      handleApiError(error, "cargar los roles");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRol = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) {
      displayAlert("⏳ Ya se está procesando una solicitud. Por favor espere.");
      return;
    }

    // Validación más estricta
    if (!validateForm(newRol)) {
      return;
    }

    setIsSubmitting(true);
    setLoading(true);
    
    try {
      // Preparar datos para el API - estructura más robusta
      const rolData = {
        nombreRol: newRol.nombreRol.trim(),
        descripcion: newRol.descripcion.trim(),
        estado: Boolean(newRol.estado)
      };

      console.log("📤 Enviando datos al servidor:", rolData);

      let response;
      if (isEditing) {
        // Para editar, incluir el ID en los datos
        const updateData = {
          idRol: parseInt(newRol.idRol),
          ...rolData
        };
        console.log("🔄 Actualizando rol:", updateData);
        response = await axios.put(`${API_ROLES}/${newRol.idRol}`, updateData, {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        displayAlert("✅ Rol actualizado exitosamente.");
      } else {
        // Para crear nuevo rol
        console.log("➕ Creando nuevo rol:", rolData);
        response = await axios.post(API_ROLES, rolData, {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        displayAlert("✅ Rol agregado exitosamente.");
      }
      
      console.log("✅ Respuesta del servidor:", response.data);
      await fetchRoles();
      closeForm();
    } catch (error) {
      console.error("❌ Error al guardar rol:", error);
      
      // Log detallado del error
      if (error.response) {
        console.error("📋 Detalles del error:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        
        // Mostrar mensaje específico del servidor si está disponible
        if (error.response.data) {
          let serverMessage = "Error del servidor";
          if (typeof error.response.data === 'string') {
            serverMessage = error.response.data;
          } else if (error.response.data.title) {
            serverMessage = error.response.data.title;
          } else if (error.response.data.message) {
            serverMessage = error.response.data.message;
          } else if (typeof error.response.data === 'object') {
            serverMessage = JSON.stringify(error.response.data);
          }
          
          if (error.response.status === 400) {
            displayAlert(`❌ Error de validación: ${serverMessage}`);
          } else if (error.response.status === 409) {
            displayAlert(`❌ Conflicto: ${serverMessage}`);
          } else {
            displayAlert(`❌ Error del servidor: ${serverMessage}`);
          }
        }
      } else {
        handleApiError(error, isEditing ? "actualizar el rol" : "agregar el rol");
      }
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (rolToDelete) {
      setLoading(true);
      try {
        await axios.delete(`${API_ROLES}/${rolToDelete.idRol}`);
        displayAlert("✅ Rol eliminado exitosamente.");
        await fetchRoles();
        
        // Ajustar la página si es necesario
        if (paginatedRoles.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("❌ Error al eliminar rol:", error);
        
        // Manejo específico para error 409 (Conflict)
        if (error.response && error.response.status === 409) {
          displayAlert("❌ No se puede eliminar el rol porque tiene usuarios asociados.");
        } else {
          handleApiError(error, "eliminar el rol");
        }
      } finally {
        setLoading(false);
        setRolToDelete(null);
        setShowDeleteConfirm(false);
      }
    }
  };

  const toggleEstado = async (rol) => {
    setLoading(true);
    try {
      const updatedRol = { 
        idRol: rol.idRol,
        nombreRol: rol.nombreRol,
        descripcion: rol.descripcion,
        estado: !rol.estado 
      };
      
      console.log("🔄 Cambiando estado del rol:", updatedRol);
      
      await axios.put(`${API_ROLES}/${rol.idRol}`, updatedRol, {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      displayAlert(`✅ Rol ${updatedRol.estado ? 'activado' : 'desactivado'} exitosamente.`);
      await fetchRoles();
    } catch (error) {
      console.error("❌ Error al cambiar estado:", error);
      handleApiError(error, "cambiar el estado del rol");
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
      errorMessage = "❌ Error de conexión. Verifica que el servidor esté ejecutándose.";
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = "❌ No se puede conectar al servidor en http://localhost:5255";
    } else if (error.response) {
      if (error.response.status === 400) {
        errorMessage = `❌ Error de validación (400): ${error.response.data?.title || error.response.data?.message || 'Datos inválidos enviados al servidor'}`;
      } else if (error.response.status === 404) {
        errorMessage = "❌ Recurso no encontrado (404).";
      } else if (error.response.status === 409) {
        errorMessage = "❌ Conflicto: El rol tiene usuarios asociados.";
      } else if (error.response.status === 500) {
        errorMessage = "❌ Error interno del servidor (500).";
      } else {
        errorMessage = `❌ Error ${error.response.status}: ${error.response.data?.message || 'Error del servidor'}`;
      }
    } else if (error.request) {
      errorMessage = "❌ No hay respuesta del servidor.";
    } else {
      errorMessage = `❌ Error inesperado: ${error.message}`;
    }
    
    setError(errorMessage);
    if (!error.response || (error.response.status !== 400 && error.response.status !== 409)) {
      displayAlert(errorMessage);
    }
  };

  const displayAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage("");
    }, 5000);
  };

  // Filtrado de roles basado en el término de búsqueda
  const filteredRoles = useMemo(() => {
    if (!searchTerm.trim()) return roles;
    
    return roles.filter((rol) =>
      rol.nombreRol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rol.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [roles, searchTerm]);

  const totalPages = Math.ceil(filteredRoles.length / ITEMS_PER_PAGE);

  const paginatedRoles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRoles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRoles, currentPage]);

  const handleView = (rol) => {
    setSelectedRol(rol);
    setShowDetails(true);
  };

  const handleEdit = (rol) => {
    setNewRol({
      idRol: rol.idRol,
      nombreRol: rol.nombreRol || "",
      descripcion: rol.descripcion || "",
      estado: Boolean(rol.estado)
    });
    setIsEditing(true);
    setShowForm(true);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
  };

  const handleDeleteClick = (rol) => {
    setRolToDelete(rol);
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setRolToDelete(null);
    setShowDeleteConfirm(false);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    let processedValue = value;
    
    // Manejar diferentes tipos de inputs
    if (type === 'select-one') {
      processedValue = value === 'true';
    }
    
    setNewRol((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setNewRol({
      nombreRol: "",
      descripcion: "",
      estado: true,
    });
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
    setIsSubmitting(false);
  };

  const closeDetailsModal = () => {
    setShowDetails(false);
    setSelectedRol(null);
  };

  // Función para limpiar búsqueda
  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div style={{ position: "relative", padding: 20, marginLeft: 260, backgroundColor: "#f5f8f2", minHeight: "100vh" }}>
      
      {/* Alerta */}
      {showAlert && (
        <div style={{
          ...alertStyle,
          backgroundColor: alertMessage.includes('❌') ? '#e57373' : 
                         alertMessage.includes('⚠️') ? '#ff9800' : '#2E5939'
        }}>
          {alertMessage.includes('❌') && <FaExclamationTriangle />}
          {alertMessage.includes('✅') && <FaCheck />}
          {alertMessage.includes('⚠️') && <FaInfoCircle />}
          <span>{alertMessage}</span>
          <button 
            onClick={() => setShowAlert(false)}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginLeft: '10px' }}
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
              onClick={fetchRoles}
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
          <h2 style={{ color: "#2E5939", margin: 0 }}>Gestión de Roles</h2>
          <p style={{ margin: "5px 0 0 0", color: "#679750", fontSize: "14px" }}>
            {roles.length} roles registrados • {filteredRoles.length} filtrados
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setIsEditing(false);
            setFormErrors({});
            setFormSuccess({});
            setFormWarnings({});
            setNewRol({
              nombreRol: "",
              descripcion: "",
              estado: true,
            });
          }}
          style={{
            backgroundColor: "#2E5939",
            color: "#fff",
            border: "none",
            padding: "12px 20px",
            borderRadius: 10,
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
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
          <FaPlus /> Agregar Rol
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 500 }}>
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
          {searchTerm && (
            <button
              onClick={clearSearch}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#2E5939",
                cursor: "pointer"
              }}
            >
              <FaTimes />
            </button>
          )}
        </div>
        <div style={{ color: '#2E5939', fontSize: '14px', whiteSpace: 'nowrap' }}>
          {filteredRoles.length} {filteredRoles.length === 1 ? 'resultado' : 'resultados'}
        </div>
      </div>

      {/* Formulario de agregar/editar CON VALIDACIONES MEJORADAS */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ color: "#2E5939", textAlign: 'center', margin: 0 }}>
                {isEditing ? "Editar Rol" : "Agregar Nuevo Rol"}
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
            
            <form onSubmit={handleAddRol} style={formContainerStyle}>
              <FormField
                label="Nombre del Rol"
                name="nombreRol"
                value={newRol.nombreRol}
                onChange={handleInputChange}
                error={formErrors.nombreRol}
                success={formSuccess.nombreRol}
                warning={formWarnings.nombreRol}
                style={{ gridColumn: '1 / -1' }}
                required={true}
                disabled={loading}
                maxLength={50}
                showCharCount={true}
                placeholder="Ej: Administrador, Empleado, Cliente..."
              />
              
              <FormField
                label="Descripción"
                name="descripcion"
                type="textarea"
                value={newRol.descripcion}
                onChange={handleInputChange}
                error={formErrors.descripcion}
                success={formSuccess.descripcion}
                warning={formWarnings.descripcion}
                style={{ gridColumn: '1 / -1' }}
                required={true}
                disabled={loading}
                maxLength={200}
                showCharCount={true}
                rows={4}
                placeholder="Descripción de los permisos y funciones del rol..."
              />

              <div style={{ display: "flex", justifyContent: "space-between", gridColumn: '1 / -1', marginTop: 20, gap: '10px' }}>
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
                  {loading ? "Guardando..." : (isEditing ? "Actualizar" : "Guardar")} Rol
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
      {showDetails && selectedRol && (
        <div style={modalOverlayStyle}>
          <div style={detailsModalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ color: "#2E5939", textAlign: 'center', margin: 0 }}>Detalles del Rol</h2>
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
                <div style={detailValueStyle}>#{selectedRol.idRol}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Nombre del Rol</div>
                <div style={detailValueStyle}>{selectedRol.nombreRol}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Estado</div>
                <div style={detailValueStyle}>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      backgroundColor: selectedRol.estado ? "#d4edda" : "#f8d7da",
                      color: selectedRol.estado ? "#155724" : "#721c24",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    {selectedRol.estado ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Descripción</div>
                <div style={{ 
                  backgroundColor: "#F7F4EA", 
                  padding: 15,
                  borderRadius: 8,
                  fontSize: 15,
                  color: '#2E5939',
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}>
                  {selectedRol.descripcion || "No hay descripción disponible"}
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
      {showDeleteConfirm && rolToDelete && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 450, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 20, color: "#2E5939" }}>Confirmar Eliminación</h3>
            <p style={{ marginBottom: 30, fontSize: '1.1rem', color: "#2E5939" }}>
              ¿Estás seguro de eliminar el rol "<strong>{rolToDelete.nombreRol}</strong>"?
            </p>
            <p style={{ marginBottom: 20, color: '#e57373', fontSize: '0.9rem' }}>
              ⚠️ Nota: Si el rol tiene usuarios asociados, no podrá ser eliminado.
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
              🔄 Cargando roles...
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
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Rol</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Descripción</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Estado</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRoles.length === 0 && !loading ? (
                <tr>
                  <td colSpan={4} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
                    {roles.length === 0 ? "No hay roles registrados" : "No se encontraron resultados"}
                    {searchTerm && (
                      <div style={{ marginTop: '10px' }}>
                        <button
                          onClick={clearSearch}
                          style={{
                            backgroundColor: '#2E5939',
                            color: 'white',
                            padding: '5px 10px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                          }}
                        >
                          Limpiar búsqueda
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedRoles.map((rol) => (
                  <tr key={rol.idRol} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "15px", fontWeight: "500" }}>{rol.nombreRol}</td>
                    <td style={{ padding: "15px" }}>
                      {rol.descripcion?.length > 50 
                        ? `${rol.descripcion.substring(0, 50)}...` 
                        : rol.descripcion}
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <button
                        onClick={() => toggleEstado(rol)}
                        disabled={loading}
                        style={{
                          cursor: loading ? "not-allowed" : "pointer",
                          padding: "6px 12px",
                          borderRadius: 6,
                          border: "none",
                          backgroundColor: rol.estado ? "#4caf50" : "#e57373",
                          color: "white",
                          fontWeight: "600",
                          fontSize: "14px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          minWidth: "80px"
                        }}
                        title={rol.estado ? "Activo" : "Inactivo"}
                      >
                        {rol.estado ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                        <button
                          onClick={() => handleView(rol)}
                          style={btnAccion("#F7F4EA", "#2E5939")}
                          title="Ver Detalles"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(rol)}
                          style={btnAccion("#F7F4EA", "#2E5939")}
                          title="Editar Rol"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(rol)}
                          style={btnAccion("#fbe9e7", "#e57373")}
                          title="Eliminar Rol"
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

export default Rol;