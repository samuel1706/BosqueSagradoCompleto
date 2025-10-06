import React, { useState, useMemo, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaTimes, FaSearch, FaPlus, FaExclamationTriangle, FaCheck, FaInfoCircle, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";

// ===============================================
// ESTILOS ACTUALIZADOS
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

const formFieldStyle = {
  marginBottom: 12,
};

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

// ===============================================
// CONFIGURACIÓN DE API
// ===============================================
const API_SEDES = "http://localhost:5255/api/Sede";
const ITEMS_PER_PAGE = 5;

// ===============================================
// VALIDACIONES Y PATRONES
// ===============================================
const VALIDATION_PATTERNS = {
  // Solo letras y espacios, sin números ni caracteres especiales
  nombreSede: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  ubicacionSede: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-_#.,°()/\\&@+:;'"!?¿¡]+$/,
  celular: /^3[0-9]{9}$/
};

const VALIDATION_RULES = {
  nombreSede: {
    minLength: 2,
    maxLength: 100,
    required: true,
    pattern: VALIDATION_PATTERNS.nombreSede,
    errorMessages: {
      required: "El nombre de la sede es requerido.",
      minLength: "El nombre debe tener al menos 2 caracteres.",
      maxLength: "El nombre no puede exceder los 100 caracteres.",
      pattern: "El nombre contiene caracteres no permitidos. Solo se permiten letras, números, espacios y los caracteres: - _ & ( ) # . ,"
    }
  },
  ubicacionSede: {
    minLength: 10,
    maxLength: 200,
    required: true,
    pattern: VALIDATION_PATTERNS.ubicacionSede,
    errorMessages: {
      required: "La ubicación es requerida.",
      minLength: "La ubicación debe tener al menos 10 caracteres para ser específica.",
      maxLength: "La ubicación no puede exceder los 200 caracteres.",
      pattern: "La ubicación contiene caracteres no válidos. Use solo letras, números, espacios y caracteres de dirección comunes."
    }
  },
  celular: {
    exactLength: 10,
    required: true,
    pattern: VALIDATION_PATTERNS.celular,
    errorMessages: {
      required: "El número de celular es requerido.",
      exactLength: "El celular debe tener exactamente 10 dígitos.",
      pattern: "El celular debe comenzar con 3 y contener solo números."
    }
  }
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
  showCharCount = false
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

    if (name === 'celular') {
      filteredValue = value.replace(/[^0-9]/g, "").slice(0, 10);
    } else if (name === 'nombreSede') {
      // Solo letras y espacios
      filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    } else if (name === 'ubicacionSede') {
      if (value === "" || VALIDATION_PATTERNS.ubicacionSede.test(value)) {
        filteredValue = value;
      } else {
        return;
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
    <div style={{ ...formFieldStyle, ...style }}>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: "red" }}>*</span>}:
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
// COMPONENTE PRINCIPAL Admisede CON VALIDACIONES MEJORADAS
// ===============================================
const Admisede = () => {
  const [sedes, setSedes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedSede, setSelectedSede] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sedeToDelete, setSedeToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState({});
  const [formWarnings, setFormWarnings] = useState({});

  const [newSede, setNewSede] = useState({
    nombreSede: "",
    ubicacionSede: "",
    celular: "",
  });

  // ===============================================
  // EFECTOS
  // ===============================================
  useEffect(() => {
    fetchSedes();
  }, []);

  // Validar formulario en tiempo real
  useEffect(() => {
    if (showForm) {
      validateField('nombreSede', newSede.nombreSede);
      validateField('ubicacionSede', newSede.ubicacionSede);
      validateField('celular', newSede.celular);
    }
  }, [newSede, showForm]);

  // ===============================================
  // FUNCIONES DE VALIDACIÓN MEJORADAS
  // ===============================================
  const validateField = (fieldName, value) => {
    const rules = VALIDATION_RULES[fieldName];
    if (!rules) return true;

    let error = "";
    let success = "";
    let warning = "";

    const trimmedValue = value ? value.trim() : "";

    // Validación de campo requerido
    if (rules.required && !trimmedValue) {
      error = rules.errorMessages.required;
    }
    // Validación de longitud mínima
    else if (trimmedValue && rules.minLength && trimmedValue.length < rules.minLength) {
      error = rules.errorMessages.minLength;
    }
    // Validación de longitud máxima
    else if (trimmedValue && rules.maxLength && trimmedValue.length > rules.maxLength) {
      error = rules.errorMessages.maxLength;
    }
    // Validación de longitud exacta (para celular)
    else if (trimmedValue && rules.exactLength && trimmedValue.length !== rules.exactLength) {
      error = rules.errorMessages.exactLength;
    }
    // Validación de patrón
    else if (trimmedValue && rules.pattern && !rules.pattern.test(trimmedValue)) {
      error = rules.errorMessages.pattern;
    }
    // Validación extra para ubicación: debe tener palabra clave y número
    else if (
      fieldName === 'ubicacionSede' &&
      (
        !/(calle|avenida|av|cra|carrera|diag|trans|cl|ak|ac|mg|manzana|mz|barrio|urb|urbanización|edificio|torre|apartamento|apto|bloque|blq|sector|set|ciudad|municipio|departamento|pais)/i.test(trimmedValue) ||
        !/\d/.test(trimmedValue)
      )
    ) {
      error = "La ubicación debe contener al menos una palabra clave de dirección (ej: calle, avenida, carrera, barrio) y un número.";
    }
    // Validaciones de advertencia
    else if (trimmedValue) {
      success = `${fieldName === 'nombreSede' ? 'Nombre' : fieldName === 'ubicacionSede' ? 'Ubicación' : 'Celular'} válido.`;
      
      if (fieldName === 'nombreSede' && trimmedValue.length > 50) {
        warning = "El nombre es bastante largo. Considere abreviar si es posible.";
      } else if (fieldName === 'ubicacionSede' && trimmedValue.length < 20) {
        warning = "La ubicación es muy breve. Sea más específico para mejor ubicación.";
      } else if (fieldName === 'ubicacionSede') {
        // Validaciones específicas para ubicación
        if (!/(calle|avenida|av|cra|carrera|diag|trans|cl|ak|ac|mg|manzana|mz|barrio|urb|urbanización|edificio|torre|apartamento|apto|bloque|blq|sector|set|ciudad|municipio|departamento|pais)/i.test(trimmedValue)) {
          warning = "Considere incluir términos como 'calle', 'avenida', 'carrera', 'barrio', etc.";
        }
        
        if (!/\d/.test(trimmedValue)) {
          warning = "Es recomendable incluir números en la dirección para mayor precisión.";
        }
      }
    }

    // Verificación de duplicados (solo si no estamos editando la misma sede)
    if (trimmedValue && !error) {
      const duplicate = sedes.find(sede => {
        if (fieldName === 'nombreSede') {
          return sede.nombreSede.toLowerCase() === trimmedValue.toLowerCase() && 
                 (!isEditing || sede.idSede !== newSede.idSede);
        } else if (fieldName === 'celular') {
          return sede.celular === trimmedValue && 
                 (!isEditing || sede.idSede !== newSede.idSede);
        }
        return false;
      });
      
      if (duplicate) {
        error = fieldName === 'nombreSede' 
          ? "Ya existe una sede con este nombre." 
          : "Ya existe una sede con este número de celular.";
      }
    }

    setFormErrors(prev => ({ ...prev, [fieldName]: error }));
    setFormSuccess(prev => ({ ...prev, [fieldName]: success }));
    setFormWarnings(prev => ({ ...prev, [fieldName]: warning }));

    return !error;
  };

  const validateForm = (sede) => {
    const nombreValid = validateField('nombreSede', sede.nombreSede);
    const ubicacionValid = validateField('ubicacionSede', sede.ubicacionSede);
    const celularValid = validateField('celular', sede.celular);

    const isValid = nombreValid && ubicacionValid && celularValid;
    
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
  // FUNCIONES DE LA API
  // ===============================================
  const fetchSedes = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔍 Conectando a la API de sedes:", API_SEDES);
      const res = await axios.get(API_SEDES, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log("✅ Datos de sedes recibidos:", res.data);
      
      if (Array.isArray(res.data)) {
        setSedes(res.data);
      } else {
        throw new Error("Formato de datos inválido");
      }
    } catch (error) {
      console.error("❌ Error al obtener sedes:", error);
      handleApiError(error, "cargar las sedes");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSede = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) {
      displayAlert("⏳ Ya se está procesando una solicitud. Por favor espere.");
      return;
    }

    // Validación más estricta
    if (!validateForm(newSede)) {
      return;
    }

    setIsSubmitting(true);
    setLoading(true);
    
    try {
      // Preparar datos para el API
      const sedeData = {
        nombreSede: newSede.nombreSede.trim(),
        ubicacionSede: newSede.ubicacionSede.trim(),
        celular: newSede.celular.trim()
      };

      console.log("📤 Enviando datos al servidor:", sedeData);

      let response;
      if (isEditing) {
        // Para editar, incluir el ID en los datos
        const updateData = {
          idSede: parseInt(newSede.idSede),
          ...sedeData
        };
        console.log("🔄 Actualizando sede:", updateData);
        response = await axios.put(`${API_SEDES}/${newSede.idSede}`, updateData, {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        displayAlert("✅ Sede actualizada exitosamente.");
      } else {
        // Para crear nueva sede
        console.log("➕ Creando nueva sede:", sedeData);
        response = await axios.post(API_SEDES, sedeData, {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        displayAlert("✅ Sede agregada exitosamente.");
      }
      
      console.log("✅ Respuesta del servidor:", response.data);
      await fetchSedes();
      closeForm();
    } catch (error) {
      console.error("❌ Error al guardar sede:", error);
      
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
        handleApiError(error, isEditing ? "actualizar la sede" : "agregar la sede");
      }
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (sedeToDelete) {
      setLoading(true);
      try {
        await axios.delete(`${API_SEDES}/${sedeToDelete.idSede}`);
        displayAlert("✅ Sede eliminada exitosamente.");
        await fetchSedes();
        
        // Ajustar la página si es necesario
        if (paginatedSedes.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("Error al eliminar sede:", error);
        
        // Manejo específico para error 409 (Conflict)
        if (error.response && error.response.status === 409) {
          displayAlert("❌ No se puede eliminar la sede porque tiene registros asociados (usuarios, reservas, etc.).");
        } else {
          handleApiError(error, "eliminar la sede");
        }
      } finally {
        setLoading(false);
        setSedeToDelete(null);
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
      errorMessage = "❌ Error de conexión. Verifica que el servidor esté ejecutándose.";
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = "❌ No se puede conectar al servidor en http://localhost:5255";
    } else if (error.response) {
      if (error.response.status === 400) {
        errorMessage = `❌ Error de validación (400): ${error.response.data?.title || error.response.data?.message || 'Datos inválidos enviados al servidor'}`;
      } else if (error.response.status === 404) {
        errorMessage = "❌ Recurso no encontrado (404).";
      } else if (error.response.status === 409) {
        errorMessage = "❌ Conflicto: La sede tiene registros asociados.";
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

  // Filtrado de sedes basado en el término de búsqueda
  const filteredSedes = useMemo(() => {
    if (!searchTerm.trim()) return sedes;
    
    return sedes.filter((sede) =>
      sede.nombreSede?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sede.ubicacionSede?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sede.celular?.includes(searchTerm)
    );
  }, [sedes, searchTerm]);

  const totalPages = Math.ceil(filteredSedes.length / ITEMS_PER_PAGE);

  const paginatedSedes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSedes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSedes, currentPage]);

  const handleView = (sede) => {
    setSelectedSede(sede);
    setShowDetails(true);
  };

  const handleEdit = (sede) => {
    setNewSede({
      idSede: sede.idSede,
      nombreSede: sede.nombreSede || "",
      ubicacionSede: sede.ubicacionSede || "",
      celular: sede.celular || ""
    });
    setIsEditing(true);
    setShowForm(true);
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
  };

  const handleDeleteClick = (sede) => {
    setSedeToDelete(sede);
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setSedeToDelete(null);
    setShowDeleteConfirm(false);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSede((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setNewSede({
      nombreSede: "",
      ubicacionSede: "",
      celular: "",
    });
    setFormErrors({});
    setFormSuccess({});
    setFormWarnings({});
    setIsSubmitting(false);
  };

  const closeDetailsModal = () => {
    setShowDetails(false);
    setSelectedSede(null);
  };

  // Función para limpiar búsqueda
  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Función para obtener ejemplos de ubicación válidos
  const getLocationExamples = () => {
    return [
      "Calle 123 #45-67, Barrio El Poblado, Medellín",
      "Avenida Caracas #23-45, Bogotá D.C.",
      "Carrera 80 #25-30, Local 205, Centro Comercial Santafé",
      "Diagonal 85 #44-21, Conjunto Residencial Los Almendros"
    ];
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
              onClick={fetchSedes}
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
          <h2 style={{ margin: 0, color: "#2E5939" }}>Gestión de Sedes</h2>
          <p style={{ margin: "5px 0 0 0", color: "#679750", fontSize: "14px" }}>
            {sedes.length} sedes registradas • {filteredSedes.length} filtradas
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setIsEditing(false);
            setFormErrors({});
            setFormSuccess({});
            setFormWarnings({});
            setNewSede({
              nombreSede: "",
              ubicacionSede: "",
              celular: "",
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
          <FaPlus /> Agregar Sede
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 500 }}>
          <FaSearch style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#2E5939" }} />
          <input
            type="text"
            placeholder="Buscar por nombre, ubicación o celular de sede..."
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
          {filteredSedes.length} {filteredSedes.length === 1 ? 'resultado' : 'resultados'}
        </div>
      </div>

      {/* Formulario de agregar/editar */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939", textAlign: 'center' }}>
                {isEditing ? "Editar Sede" : "Agregar Nueva Sede"}
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
            
            <form onSubmit={handleAddSede} style={formContainerStyle}>
              <FormField
                label="Nombre de la Sede"
                name="nombreSede"
                value={newSede.nombreSede}
                onChange={handleChange}
                error={formErrors.nombreSede}
                success={formSuccess.nombreSede}
                warning={formWarnings.nombreSede}
                style={{ gridColumn: '1 / -1' }}
                required={true}
                disabled={loading}
                maxLength={VALIDATION_RULES.nombreSede.maxLength}
                showCharCount={true}
                placeholder="Ej: Sede Principal, Sede Norte, Centro Comercial Gran Plaza"
              />
              
              <div style={{ gridColumn: '1 / -1' }}>
                <FormField
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaMapMarkerAlt />
                      Ubicación
                    </div>
                  }
                  name="ubicacionSede"
                  type="textarea"
                  value={newSede.ubicacionSede}
                  onChange={handleChange}
                  error={formErrors.ubicacionSede}
                  success={formSuccess.ubicacionSede}
                  warning={formWarnings.ubicacionSede}
                  required={true}
                  disabled={loading}
                  maxLength={VALIDATION_RULES.ubicacionSede.maxLength}
                  showCharCount={true}
                  placeholder="Ej: Calle 123 #45-67, Barrio El Poblado, Medellín, Antioquia"
                />
                
                {/* Ejemplos de ubicación válida */}
                {!newSede.ubicacionSede && (
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    padding: '12px',
                    marginTop: '8px',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ fontWeight: '600', color: '#2E5939', marginBottom: '8px' }}>
                      📍 Ejemplos de ubicación válida:
                    </div>
                    {getLocationExamples().map((example, index) => (
                      <div key={index} style={{ 
                        color: '#679750', 
                        marginBottom: '4px',
                        fontSize: '0.8rem',
                        fontStyle: 'italic'
                      }}>
                        • {example}
                      </div>
                    ))}
                    <div style={{ 
                      color: '#ff9800', 
                      marginTop: '8px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      💡 Incluya términos como "calle", "avenida", "carrera", números y barrio/ciudad.
                    </div>
                  </div>
                )}
              </div>
              
              <FormField
                label="Celular de Contacto"
                name="celular"
                type="tel"
                value={newSede.celular}
                onChange={handleChange}
                error={formErrors.celular}
                success={formSuccess.celular}
                warning={formWarnings.celular}
                style={{ gridColumn: '1 / -1' }}
                required={true}
                disabled={loading}
                maxLength={VALIDATION_RULES.celular.exactLength}
                placeholder="10 dígitos, comenzando con 3 (Ej: 3123456789)"
              />

              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                marginTop: 20, 
                gridColumn: '1 / -1',
                gap: '10px'
              }}>
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
                  {loading ? "Guardando..." : (isEditing ? "Actualizar" : "Guardar")} Sede
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
      {showDetails && selectedSede && (
        <div style={modalOverlayStyle}>
          <div style={detailsModalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939", textAlign: 'center' }}>Detalles de la Sede</h2>
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
                <div style={detailValueStyle}>#{selectedSede.idSede}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Nombre</div>
                <div style={detailValueStyle}>{selectedSede.nombreSede}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Ubicación</div>
                <div style={detailValueStyle}>{selectedSede.ubicacionSede}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Celular</div>
                <div style={detailValueStyle}>{selectedSede.celular}</div>
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
      {showDeleteConfirm && sedeToDelete && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 450, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 20, color: "#2E5939" }}>Confirmar Eliminación</h3>
            <p style={{ marginBottom: 30, fontSize: '1.1rem', color: "#2E5939" }}>
              ¿Estás seguro de eliminar la sede "<strong>{sedeToDelete.nombreSede}</strong>"?
            </p>
            <p style={{ marginBottom: 20, color: '#e57373', fontSize: '0.9rem' }}>
              ⚠️ Nota: Si la sede tiene usuarios o reservas asociadas, no podrá ser eliminada.
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
              🔄 Cargando sedes...
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
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Nombre</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Ubicación</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Celular</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSedes.length === 0 && !loading ? (
                <tr>
                  <td colSpan={4} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
                    {sedes.length === 0 ? "No hay sedes registradas" : "No se encontraron resultados"}
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
                paginatedSedes.map((sede) => (
                  <tr key={sede.idSede} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "15px", fontWeight: "500" }}>{sede.nombreSede}</td>
                    <td style={{ padding: "15px" }}>
                      {sede.ubicacionSede?.length > 50 
                        ? `${sede.ubicacionSede.substring(0, 50)}...` 
                        : sede.ubicacionSede}
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>{sede.celular}</td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                        <button
                          onClick={() => handleView(sede)}
                          style={btnAccion("#F7F4EA", "#2E5939")}
                          title="Ver Detalles"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(sede)}
                          style={btnAccion("#F7F4EA", "#2E5939")}
                          title="Editar Sede"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(sede)}
                          style={btnAccion("#fbe9e7", "#e57373")}
                          title="Eliminar Sede"
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

export default Admisede;