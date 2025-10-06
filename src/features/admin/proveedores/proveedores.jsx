import React, { useState, useMemo, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaTimes, FaSearch, FaPlus, FaExclamationTriangle } from "react-icons/fa";
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
// FUNCIONES DE VALIDACIÓN MEJORADAS PARA PROVEEDORES
// ===============================================
const validateNombre = (nombre, proveedoresExistentes = [], idActual = null) => {
  if (!nombre || nombre.trim().length === 0) {
    return { isValid: false, message: 'El nombre del proveedor es obligatorio' };
  }

  if (nombre.trim().length < 2) {
    return { isValid: false, message: 'El nombre debe tener al menos 2 caracteres' };
  }

  if (nombre.trim().length > 100) {
    return { isValid: false, message: 'El nombre no puede exceder los 100 caracteres' };
  }

  // Solo letras y espacios (sin caracteres especiales ni números)
  const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!nombreRegex.test(nombre.trim())) {
    return { 
      isValid: false, 
      message: 'El nombre solo puede contener letras y espacios. No se permiten números ni caracteres especiales.' 
    };
  }

  // Validar unicidad
  const nombreNormalizado = nombre.trim().toLowerCase();
  const existeProveedor = proveedoresExistentes.some(prov => 
    prov.nombre.toLowerCase() === nombreNormalizado && 
    prov.idProveedor !== idActual
  );

  if (existeProveedor) {
    return { 
      isValid: false, 
      message: 'Ya existe un proveedor con este nombre' 
    };
  }

  return { isValid: true, message: '' };
};

const validateCelular = (celular) => {
  if (!celular || celular.trim().length === 0) {
    return { isValid: false, message: 'El número de celular es obligatorio' };
  }

  // Solo números, exactamente 10 dígitos
  const celularRegex = /^\d{10}$/;
  if (!celularRegex.test(celular.trim())) {
    return { isValid: false, message: 'El celular debe tener exactamente 10 dígitos numéricos' };
  }

  // Validar que no empiece con 0 (opcional, dependiendo del país)
  if (celular.trim().startsWith('0')) {
    return { isValid: false, message: 'El celular no debe empezar con 0' };
  }

  return { isValid: true, message: '' };
};

const validateCorreo = (correo, proveedoresExistentes = [], idActual = null) => {
  if (!correo || correo.trim().length === 0) {
    return { isValid: false, message: 'El correo electrónico es obligatorio' };
  }

  // Validar formato de email
  const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!correoRegex.test(correo.trim())) {
    return { isValid: false, message: 'El formato del correo electrónico es inválido' };
  }

  // Validar longitud máxima
  if (correo.trim().length > 100) {
    return { isValid: false, message: 'El correo no puede exceder los 100 caracteres' };
  }

  // Validar unicidad
  const correoNormalizado = correo.trim().toLowerCase();
  const existeCorreo = proveedoresExistentes.some(prov => 
    prov.correo.toLowerCase() === correoNormalizado && 
    prov.idProveedor !== idActual
  );

  if (existeCorreo) {
    return { 
      isValid: false, 
      message: 'Ya existe un proveedor con este correo electrónico' 
    };
  }

  return { isValid: true, message: '' };
};

const validateNumeroDocumento = (numeroDocumento, tipoDocumento, proveedoresExistentes = [], idActual = null) => {
  if (!numeroDocumento || numeroDocumento.trim().length === 0) {
    return { isValid: false, message: 'El número de documento es obligatorio' };
  }

  // Solo números
  const soloNumerosRegex = /^\d+$/;
  if (!soloNumerosRegex.test(numeroDocumento.trim())) {
    return { isValid: false, message: 'El número de documento solo debe contener dígitos' };
  }

  // Validar longitud según tipo de documento
  let longitudMinima = 0;
  let longitudMaxima = 0;
  
  switch (tipoDocumento) {
    case 'Cedula':
      longitudMinima = 8;
      longitudMaxima = 10;
      break;
    case 'Pasaporte':
      longitudMinima = 6;
      longitudMaxima = 20;
      break;
    case 'CedulaExtranjeria':
      longitudMinima = 6;
      longitudMaxima = 15;
      break;
    default:
      longitudMinima = 6;
      longitudMaxima = 20;
  }

  if (numeroDocumento.trim().length < longitudMinima || numeroDocumento.trim().length > longitudMaxima) {
    return { 
      isValid: false, 
      message: `El número de documento debe tener entre ${longitudMinima} y ${longitudMaxima} dígitos para ${tipoDocumento}` 
    };
  }

  // Validar unicidad
  const existeDocumento = proveedoresExistentes.some(prov => 
    prov.numeroDocumento === numeroDocumento.trim() && 
    prov.idProveedor !== idActual
  );

  if (existeDocumento) {
    return { 
      isValid: false, 
      message: 'Ya existe un proveedor con este número de documento' 
    };
  }

  return { isValid: true, message: '' };
};

const validateTexto = (valor, campo, longitudMinima = 2, longitudMaxima = 50) => {
  if (!valor || valor.trim().length === 0) {
    return { isValid: false, message: `El ${campo} es obligatorio` };
  }

  if (valor.trim().length < longitudMinima) {
    return { isValid: false, message: `El ${campo} debe tener al menos ${longitudMinima} caracteres` };
  }

  if (valor.trim().length > longitudMaxima) {
    return { isValid: false, message: `El ${campo} no puede exceder los ${longitudMaxima} caracteres` };
  }

  // Validar que no contenga caracteres especiales peligrosos
  const textoRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-_&.,()#/°]+$/;
  if (!textoRegex.test(valor.trim())) {
    return { 
      isValid: false, 
      message: `El ${campo} contiene caracteres no permitidos` 
    };
  }

  return { isValid: true, message: '' };
};

// ===============================================
// DATOS DE CONFIGURACIÓN
// ===============================================
const API_PROVEEDORES = "http://localhost:5255/api/Proveedore";
const API_PRODUCTOS = "http://localhost:5255/api/Productos";

const ITEMS_PER_PAGE = 5;

// ===============================================
// COMPONENTE FormField
// ===============================================
const FormField = ({ label, name, type = "text", value, onChange, error, warning, options = [], style = {}, required = true, disabled = false, maxLength }) => {
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

    if (name === 'celular' || name === 'numeroDocumento') {
      filteredValue = value.replace(/[^0-9]/g, "");
    } else if (name === 'nombre' || name === 'departamento' || name === 'ciudad' || name === 'barrio') {
      // Solo letras, espacios y caracteres básicos
      filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-_&.,()]/g, "");
    }
    
    if (maxLength && filteredValue.length > maxLength) {
      filteredValue = filteredValue.slice(0, maxLength);
    }
    
    onChange({ target: { name, value: filteredValue } });
  };

  return (
    <div style={{ ...formFieldStyle, ...style }}>
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
      ) : type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={handleFilteredInputChange}
          style={{
            ...inputStyle,
            minHeight: "60px",
            resize: "vertical",
            ...(error ? inputErrorStyle : {})
          }}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
        ></textarea>
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
// COMPONENTE PRINCIPAL Admiprovee
// ===============================================
const Admiprovee = () => {
  const [proveedores, setProveedores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentProveedor, setCurrentProveedor] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [proveedorToDelete, setProveedorToDelete] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [warnings, setWarnings] = useState({});

  const [newProveedor, setNewProveedor] = useState({
    nombre: "",
    celular: "",
    correo: "",
    departamento: "",
    ciudad: "",
    barrio: "",
    direccion: "",
    tipoDocumento: "Cedula",
    numeroDocumento: "",
    estado: true
  });

  // ===============================================
  // EFECTOS
  // ===============================================
  useEffect(() => {
    fetchProveedores();
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
        const nombreValidation = validateNombre(value, proveedores, isEditing ? newProveedor.idProveedor : null);
        if (!nombreValidation.isValid) {
          newErrors.nombre = nombreValidation.message;
        }
        break;

      case 'celular':
        const celularValidation = validateCelular(value);
        if (!celularValidation.isValid) {
          newErrors.celular = celularValidation.message;
        }
        break;

      case 'correo':
        const correoValidation = validateCorreo(value, proveedores, isEditing ? newProveedor.idProveedor : null);
        if (!correoValidation.isValid) {
          newErrors.correo = correoValidation.message;
        }
        break;

      case 'numeroDocumento':
        const documentoValidation = validateNumeroDocumento(
          value, 
          newProveedor.tipoDocumento, 
          proveedores, 
          isEditing ? newProveedor.idProveedor : null
        );
        if (!documentoValidation.isValid) {
          newErrors.numeroDocumento = documentoValidation.message;
        }
        break;

      case 'departamento':
        const departamentoValidation = validateTexto(value, 'departamento', 2, 50);
        if (!departamentoValidation.isValid) {
          newErrors.departamento = departamentoValidation.message;
        }
        break;

      case 'ciudad':
        const ciudadValidation = validateTexto(value, 'ciudad', 2, 50);
        if (!ciudadValidation.isValid) {
          newErrors.ciudad = ciudadValidation.message;
        }
        break;

      case 'barrio':
        const barrioValidation = validateTexto(value, 'barrio', 2, 50);
        if (!barrioValidation.isValid) {
          newErrors.barrio = barrioValidation.message;
        }
        break;

      case 'direccion':
        const direccionValidation = validateTexto(value, 'dirección', 5, 200);
        if (!direccionValidation.isValid) {
          newErrors.direccion = direccionValidation.message;
        } else if (value.trim().length < 10) {
          newWarnings.direccion = 'Considera agregar más detalles para una mejor ubicación';
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
      newProveedor.nombre, 
      proveedores, 
      isEditing ? newProveedor.idProveedor : null
    );
    if (!nombreValidation.isValid) {
      newErrors.nombre = nombreValidation.message;
    }

    const celularValidation = validateCelular(newProveedor.celular);
    if (!celularValidation.isValid) {
      newErrors.celular = celularValidation.message;
    }

    const correoValidation = validateCorreo(
      newProveedor.correo, 
      proveedores, 
      isEditing ? newProveedor.idProveedor : null
    );
    if (!correoValidation.isValid) {
      newErrors.correo = correoValidation.message;
    }

    const documentoValidation = validateNumeroDocumento(
      newProveedor.numeroDocumento,
      newProveedor.tipoDocumento,
      proveedores,
      isEditing ? newProveedor.idProveedor : null
    );
    if (!documentoValidation.isValid) {
      newErrors.numeroDocumento = documentoValidation.message;
    }

    const departamentoValidation = validateTexto(newProveedor.departamento, 'departamento');
    if (!departamentoValidation.isValid) {
      newErrors.departamento = departamentoValidation.message;
    }

    const ciudadValidation = validateTexto(newProveedor.ciudad, 'ciudad');
    if (!ciudadValidation.isValid) {
      newErrors.ciudad = ciudadValidation.message;
    }

    const barrioValidation = validateTexto(newProveedor.barrio, 'barrio');
    if (!barrioValidation.isValid) {
      newErrors.barrio = barrioValidation.message;
    }

    const direccionValidation = validateTexto(newProveedor.direccion, 'dirección', 5, 200);
    if (!direccionValidation.isValid) {
      newErrors.direccion = direccionValidation.message;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ===============================================
  // FUNCIONES DE LA API MEJORADAS
  // ===============================================
  const fetchProveedores = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔍 Conectando a la API de proveedores:", API_PROVEEDORES);
      const res = await axios.get(API_PROVEEDORES, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log("✅ Datos de proveedores recibidos:", res.data);
      
      if (Array.isArray(res.data)) {
        setProveedores(res.data);
      } else {
        throw new Error("Formato de datos inválido");
      }
    } catch (error) {
      console.error("❌ Error al obtener proveedores:", error);
      handleApiError(error, "cargar los proveedores");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProveedor = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      displayAlert("Por favor, corrige los errores en el formulario", "error");
      return;
    }

    setLoading(true);
    try {
      const proveedorData = {
        ...newProveedor,
        estado: newProveedor.estado === "true" || newProveedor.estado === true
      };

      // Validación final antes de enviar
      const finalValidation = validateForm();
      if (!finalValidation) {
        displayAlert("Por favor, corrige los errores en el formulario", "error");
        setLoading(false);
        return;
      }

      if (isEditing) {
        await axios.put(`${API_PROVEEDORES}/${newProveedor.idProveedor}`, proveedorData, {
          headers: { 'Content-Type': 'application/json' }
        });
        displayAlert("Proveedor actualizado exitosamente.");
      } else {
        await axios.post(API_PROVEEDORES, proveedorData, {
          headers: { 'Content-Type': 'application/json' }
        });
        displayAlert("Proveedor agregado exitosamente.");
      }
      
      await fetchProveedores();
      closeForm();
    } catch (error) {
      console.error("Error al guardar proveedor:", error);
      
      // Manejar errores específicos de la API
      if (error.response && error.response.status === 409) {
        displayAlert("Ya existe un proveedor con estos datos (nombre, correo o documento)", "error");
      } else {
        handleApiError(error, isEditing ? "actualizar el proveedor" : "agregar el proveedor");
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (proveedorToDelete) {
      setLoading(true);
      try {
        // Verificar si el proveedor tiene productos asociados
        const hasProducts = await checkIfProveedorHasProducts(proveedorToDelete.idProveedor);
        if (hasProducts) {
          displayAlert("No se puede eliminar un proveedor que tiene productos asociados", "error");
          setLoading(false);
          return;
        }

        await axios.delete(`${API_PROVEEDORES}/${proveedorToDelete.idProveedor}`);
        displayAlert("Proveedor eliminado exitosamente.");
        await fetchProveedores();
      } catch (error) {
        console.error("Error al eliminar proveedor:", error);
        
        if (error.response && error.response.status === 409) {
          displayAlert("No se puede eliminar el proveedor porque tiene productos asociados", "error");
        } else {
          handleApiError(error, "eliminar el proveedor");
        }
      } finally {
        setLoading(false);
        setProveedorToDelete(null);
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
          errorMessage = "Conflicto: El proveedor ya existe o tiene productos asociados";
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setNewProveedor((prev) => ({
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
    setNewProveedor({
      nombre: "",
      celular: "",
      correo: "",
      departamento: "",
      ciudad: "",
      barrio: "",
      direccion: "",
      tipoDocumento: "Cedula",
      numeroDocumento: "",
      estado: true
    });
    clearErrors();
  };

  const closeDetailsModal = () => {
    setShowDetails(false);
    setCurrentProveedor(null);
  };

  const cancelDelete = () => {
    setProveedorToDelete(null);
    setShowDeleteConfirm(false);
  };

  const toggleEstado = async (proveedor) => {
    setLoading(true);
    try {
      const updatedProveedor = { ...proveedor, estado: !proveedor.estado };
      await axios.put(`${API_PROVEEDORES}/${proveedor.idProveedor}`, updatedProveedor);
      displayAlert(`Proveedor ${updatedProveedor.estado ? 'activado' : 'desactivado'} exitosamente.`);
      await fetchProveedores();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      handleApiError(error, "cambiar el estado");
    } finally {
      setLoading(false);
    }
  };

  // Función mejorada para verificar si un proveedor tiene productos asociados
  const checkIfProveedorHasProducts = async (proveedorId) => {
    try {
      // Buscar productos que pertenezcan a este proveedor
      const response = await axios.get(`${API_PRODUCTOS}/proveedor/${proveedorId}`, {
        timeout: 5000
      });
      
      return response.data && Array.isArray(response.data) && response.data.length > 0;
    } catch (error) {
      console.error("Error al verificar productos:", error);
      
      // Si no se puede verificar, asumir que podría tener productos por seguridad
      if (error.response && error.response.status === 404) {
        // Si el endpoint no existe, usar un enfoque alternativo
        return proveedores.find(prov => prov.idProveedor === proveedorId)?.productosCount > 0;
      }
      
      return true; // Por seguridad, asumir que tiene productos si hay error
    }
  };

  const handleView = (proveedor) => {
    setCurrentProveedor(proveedor);
    setShowDetails(true);
  };

  const handleEdit = (proveedor) => {
    setNewProveedor({
      ...proveedor,
      estado: proveedor.estado.toString()
    });
    setIsEditing(true);
    setShowForm(true);
    clearErrors();
  };

  const handleDeleteClick = (proveedor) => {
    // Validar si el proveedor tiene productos asociados antes de eliminar
    checkIfProveedorHasProducts(proveedor.idProveedor).then(hasProducts => {
      if (hasProducts) {
        displayAlert("No se puede eliminar un proveedor que tiene productos asociados", "error");
        return;
      }
      setProveedorToDelete(proveedor);
      setShowDeleteConfirm(true);
    });
  };

  // ===============================================
  // FUNCIONES DE FILTRADO Y PAGINACIÓN
  // ===============================================
  const filteredProveedores = useMemo(() => {
    return proveedores.filter(proveedor =>
      proveedor.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.ciudad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.numeroDocumento?.includes(searchTerm)
    );
  }, [proveedores, searchTerm]);

  const totalPages = Math.ceil(filteredProveedores.length / ITEMS_PER_PAGE);

  const paginatedProveedores = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProveedores.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProveedores, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Opciones para los selects
  const tipoDocumentoOptions = [
    { value: "Cedula", label: "Cédula" },
    { value: "Pasaporte", label: "Pasaporte" },
    { value: "CedulaExtranjeria", label: "Cédula de Extranjería" }
  ];

  const departamentoOptions = [
    { value: "Antioquia", label: "Antioquia" },
    { value: "Cundinamarca", label: "Cundinamarca" },
    { value: "Valle del Cauca", label: "Valle del Cauca" },
    { value: "Santander", label: "Santander" },
    { value: "Bolívar", label: "Bolívar" },
    { value: "Atlántico", label: "Atlántico" },
    { value: "Caldas", label: "Caldas" },
    { value: "Risaralda", label: "Risaralda" },
    { value: "Tolima", label: "Tolima" },
    { value: "Huila", label: "Huila" }
  ];

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
              onClick={fetchProveedores}
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
          <h2 style={{ margin: 0, color: "#2E5939" }}>Gestión de Proveedores</h2>
          <p style={{ margin: "5px 0 0 0", color: "#679750", fontSize: "14px" }}>
            {proveedores.length} proveedores registrados
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setIsEditing(false);
            setNewProveedor({
              nombre: "",
              celular: "",
              correo: "",
              departamento: "",
              ciudad: "",
              barrio: "",
              direccion: "",
              tipoDocumento: "Cedula",
              numeroDocumento: "",
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
          <FaPlus /> Agregar Proveedor
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 500 }}>
          <FaSearch style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#2E5939" }} />
          <input
            type="text"
            placeholder="Buscar por nombre, correo, ciudad o documento..."
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
          {filteredProveedores.length} resultados
        </div>
      </div>

      {/* Formulario de agregar/editar */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939", textAlign: 'center' }}>
                {isEditing ? "Editar Proveedor" : "Nuevo Proveedor"}
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
            
            <form onSubmit={handleAddProveedor} style={formContainerStyle}>
              <FormField
                label="Nombre del Proveedor"
                name="nombre"
                value={newProveedor.nombre}
                onChange={handleChange}
                error={errors.nombre}
                warning={warnings.nombre}
                style={{ gridColumn: '1 / -1' }}
                required={true}
                maxLength={100}
              />

              <FormField
                label="Tipo de Documento"
                name="tipoDocumento"
                type="select"
                value={newProveedor.tipoDocumento}
                onChange={handleChange}
                error={errors.tipoDocumento}
                options={tipoDocumentoOptions}
                required={true}
              />

              <FormField
                label="Número de Documento"
                name="numeroDocumento"
                value={newProveedor.numeroDocumento}
                onChange={handleChange}
                error={errors.numeroDocumento}
                warning={warnings.numeroDocumento}
                required={true}
                disabled={isEditing}
                maxLength={20}
              />

              <FormField
                label="Celular"
                name="celular"
                type="tel"
                value={newProveedor.celular}
                onChange={handleChange}
                error={errors.celular}
                warning={warnings.celular}
                required={true}
                maxLength={10}
              />

              <FormField
                label="Correo Electrónico"
                name="correo"
                type="email"
                value={newProveedor.correo}
                onChange={handleChange}
                error={errors.correo}
                warning={warnings.correo}
                style={{ gridColumn: '1 / -1' }}
                required={true}
                maxLength={100}
              />

              <FormField
                label="Departamento"
                name="departamento"
                type="select"
                value={newProveedor.departamento}
                onChange={handleChange}
                error={errors.departamento}
                warning={warnings.departamento}
                options={departamentoOptions}
                required={true}
              />

              <FormField
                label="Ciudad"
                name="ciudad"
                value={newProveedor.ciudad}
                onChange={handleChange}
                error={errors.ciudad}
                warning={warnings.ciudad}
                required={true}
                maxLength={50}
              />

              <FormField
                label="Barrio"
                name="barrio"
                value={newProveedor.barrio}
                onChange={handleChange}
                error={errors.barrio}
                warning={warnings.barrio}
                required={true}
                maxLength={50}
              />

              <FormField
                label="Dirección"
                name="direccion"
                type="textarea"
                value={newProveedor.direccion}
                onChange={handleChange}
                error={errors.direccion}
                warning={warnings.direccion}
                style={{ gridColumn: '1 / -1' }}
                required={true}
                maxLength={200}
              />

              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 20, gridColumn: '1 / -1' }}>
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
                  {loading ? "Guardando..." : (isEditing ? "Actualizar" : "Guardar")} Proveedor
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
      {showDetails && currentProveedor && (
        <div style={modalOverlayStyle}>
          <div style={detailsModalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939" }}>Detalles del Proveedor</h2>
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
                <div style={detailValueStyle}>#{currentProveedor.idProveedor}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Nombre</div>
                <div style={detailValueStyle}>{currentProveedor.nombre}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Tipo de Documento</div>
                <div style={detailValueStyle}>{currentProveedor.tipoDocumento}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Número de Documento</div>
                <div style={detailValueStyle}>{currentProveedor.numeroDocumento}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Celular</div>
                <div style={detailValueStyle}>{currentProveedor.celular}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Correo Electrónico</div>
                <div style={detailValueStyle}>{currentProveedor.correo}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Departamento</div>
                <div style={detailValueStyle}>{currentProveedor.departamento}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Ciudad</div>
                <div style={detailValueStyle}>{currentProveedor.ciudad}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Barrio</div>
                <div style={detailValueStyle}>{currentProveedor.barrio}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Dirección</div>
                <div style={detailValueStyle}>{currentProveedor.direccion}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Estado</div>
                <div style={{
                  ...detailValueStyle,
                  color: currentProveedor.estado ? '#4caf50' : '#e57373',
                  fontWeight: 'bold'
                }}>
                  {currentProveedor.estado ? '🟢 Activo' : '🔴 Inactivo'}
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
      {showDeleteConfirm && proveedorToDelete && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 450, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 20, color: "#2E5939" }}>Confirmar Eliminación</h3>
            <p style={{ marginBottom: 30, fontSize: '1.1rem', color: "#2E5939" }}>
              ¿Estás seguro de eliminar al proveedor "<strong>{proveedorToDelete.nombre}</strong>"?
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
              🔄 Cargando proveedores...
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
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Contacto</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Celular</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Ciudad</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Estado</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProveedores.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
                    {proveedores.length === 0 ? "No hay proveedores registrados" : "No se encontraron resultados"}
                  </td>
                </tr>
              ) : (
                paginatedProveedores.map((proveedor) => (
                  <tr key={proveedor.idProveedor} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "15px", fontWeight: "500" }}>{proveedor.nombre}</td>
                    <td style={{ padding: "15px" }}>{proveedor.correo}</td>
                    <td style={{ padding: "15px", textAlign: "center" }}>{proveedor.celular}</td>
                    <td style={{ padding: "15px", textAlign: "center" }}>{proveedor.ciudad}</td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <button
                        onClick={() => toggleEstado(proveedor)}
                        style={{
                          cursor: "pointer",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          border: "none",
                          backgroundColor: proveedor.estado ? "#4caf50" : "#e57373",
                          color: "white",
                          fontWeight: "600",
                          fontSize: "12px",
                          minWidth: "80px"
                        }}
                      >
                        {proveedor.estado ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <button
                        onClick={() => handleView(proveedor)}
                        style={btnAccion("#F7F4EA", "#2E5939")}
                        title="Ver Detalles"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(proveedor)}
                        style={btnAccion("#F7F4EA", "#2E5939")}
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(proveedor)}
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

export default Admiprovee;