import React, { useState, useMemo, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaTimes, FaSync, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";

// ===============================================
// ESTILOS MEJORADOS
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

const inputErrorStyle = {
  ...inputStyle,
  border: "2px solid #e74c3c",
  backgroundColor: "#fdf2f2",
};

const errorTextStyle = {
  color: "#e74c3c",
  fontSize: "14px",
  marginTop: "4px",
  display: "block",
  fontWeight: "500",
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

const loadingStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '40px',
  color: '#2E5939',
  fontSize: '18px',
  gap: '10px'
};

const passwordStrengthStyle = {
  marginTop: '5px',
  fontSize: '14px',
  fontWeight: '500',
};

const strengthBarStyle = {
  height: '4px',
  borderRadius: '2px',
  marginTop: '5px',
  transition: 'all 0.3s ease',
};

// ===============================================
// CONSTANTES DE LA API
// ===============================================
const API_BASE_URL = "http://localhost:5255/api";
const ITEMS_PER_PAGE = 5;

// ===============================================
// COMPONENTE PRINCIPAL Users
// ===============================================
const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");

  // Estado inicial corregido - idRol como string vacío
  const [newUser, setNewUser] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    idRol: "",
    estado: true,
    contrasena: "",
    confirmPassword: ""
  });

  // Función para mostrar alertas mejoradas
  const displayAlert = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage("");
    }, 4000);
  };

  // Función para obtener el icono según el tipo de alerta
  const getAlertIcon = (type) => {
    switch (type) {
      case "success":
        return <FaCheckCircle style={alertIconStyle} />;
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

  // Función para obtener el estilo de alerta según el tipo
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

  // Función para validar email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para evaluar fortaleza de contraseña
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "", color: "#e74c3c" };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    const strengthMap = {
      0: { text: "Muy débil", color: "#e74c3c" },
      1: { text: "Débil", color: "#e74c3c" },
      2: { text: "Regular", color: "#f39c12" },
      3: { text: "Buena", color: "#f1c40f" },
      4: { text: "Fuerte", color: "#2ecc71" },
      5: { text: "Muy fuerte", color: "#27ae60" }
    };

    return { strength, ...strengthMap[strength] };
  };

  // Función para validar el formulario
  const validateForm = () => {
    const errors = {};
    const passwordStrength = getPasswordStrength(newUser.contrasena);

    // Validación de nombre
    if (!newUser.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio";
    } else if (newUser.nombre.trim().length < 2) {
      errors.nombre = "El nombre debe tener al menos 2 caracteres";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(newUser.nombre)) {
      errors.nombre = "El nombre solo puede contener letras y espacios";
    }

    // Validación de apellido
    if (!newUser.apellido.trim()) {
      errors.apellido = "El apellido es obligatorio";
    } else if (newUser.apellido.trim().length < 2) {
      errors.apellido = "El apellido debe tener al menos 2 caracteres";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(newUser.apellido)) {
      errors.apellido = "El apellido solo puede contener letras y espacios";
    }

    // Validación de correo
    if (!newUser.correo.trim()) {
      errors.correo = "El correo electrónico es obligatorio";
    } else if (!validateEmail(newUser.correo)) {
      errors.correo = "El formato del correo electrónico no es válido";
    } else {
      // Verificar si el correo ya existe (excepto en edición)
      const existingUser = users.find(user => 
        user.correo.toLowerCase() === newUser.correo.toLowerCase() && 
        (!isEditing || user.id !== newUser.id)
      );
      if (existingUser) {
        errors.correo = "Este correo electrónico ya está registrado";
      }
    }

    // Validación de rol
    if (!newUser.idRol) {
      errors.idRol = "Debe seleccionar un rol";
    }

    // Validación de contraseña
    if (!isEditing || newUser.contrasena) {
      if (!newUser.contrasena) {
        errors.contrasena = "La contraseña es obligatoria";
      } else if (newUser.contrasena.length < 8) {
        errors.contrasena = "La contraseña debe tener al menos 8 caracteres";
      } else if (passwordStrength.strength < 3) {
        errors.contrasena = "La contraseña es muy débil. Incluye mayúsculas, minúsculas, números y símbolos";
      }

      // Validación de confirmación de contraseña
      if (!newUser.confirmPassword) {
        errors.confirmPassword = "Debe confirmar la contraseña";
      } else if (newUser.contrasena !== newUser.confirmPassword) {
        errors.confirmPassword = "Las contraseñas no coinciden";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Función para obtener roles desde la API
  const fetchRoles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Rol`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setRoles(data);
      return data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      displayAlert("Error al cargar los roles", "error");
      return [];
    }
  };

  // Función para obtener el nombre del rol por ID
  const getRoleName = (idRol) => {
    const role = roles.find(r => r.idRol === idRol);
    return role ? role.nombreRol : "Desconocido";
  };

  // Función para obtener usuarios desde la API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/Usuarios`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      // Mapear los datos de la API al formato esperado por el componente
      const mappedUsers = data.map(user => ({
        id: user.idUsuario,
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        idRol: user.idRol,
        rol: getRoleName(user.idRol),
        active: user.estado,
        contrasena: user.contrasena
      }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      displayAlert("Error al cargar los usuarios", "error");
    } finally {
      setLoading(false);
    }
  };

  // Cargar roles y usuarios al montar el componente
  useEffect(() => {
    const loadData = async () => {
      await fetchRoles();
      await fetchUsers();
    };
    loadData();
  }, []);

  // Actualizar los nombres de rol cuando los roles cambien
  useEffect(() => {
    if (roles.length > 0 && users.length > 0) {
      const updatedUsers = users.map(user => ({
        ...user,
        rol: getRoleName(user.idRol)
      }));
      setUsers(updatedUsers);
    }
  }, [roles]);

  // Función para crear un nuevo usuario
  const createUser = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: userData.nombre.trim(),
          apellido: userData.apellido.trim(),
          correo: userData.correo.trim(),
          contrasena: btoa(userData.contrasena),
          idRol: parseInt(userData.idRol),
          estado: true,
          codigoVerificacion: "000000"
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        const textResponse = await response.text();
        console.log("Respuesta del servidor (crear):", textResponse);
        return { 
          success: true, 
          message: "Usuario creado exitosamente" 
        };
      }
    } catch (error) {
      console.error("Error en createUser:", error);
      throw error;
    }
  };

  // Función para actualizar un usuario
  const updateUser = async (id, userData) => {
    try {
      const currentUser = users.find(u => u.id === id);
      const updateData = {
        idUsuario: parseInt(id),
        nombre: userData.nombre.trim(),
        apellido: userData.apellido.trim(),
        correo: userData.correo.trim(),
        idRol: parseInt(userData.idRol),
        estado: userData.estado,
        codigoVerificacion: "000000"
      };

      if (userData.contrasena && userData.contrasena.trim() !== "") {
        updateData.contrasena = btoa(userData.contrasena);
      } else {
        updateData.contrasena = currentUser.contrasena;
      }

      console.log("Enviando datos de actualización:", updateData);

      const response = await fetch(`${API_BASE_URL}/Usuarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        const textResponse = await response.text();
        console.log("Respuesta del servidor (actualizar):", textResponse);
        return { 
          success: true, 
          message: "Usuario actualizado exitosamente" 
        };
      }
    } catch (error) {
      console.error("Error en updateUser:", error);
      throw error;
    }
  };

  // Función para eliminar un usuario
  const deleteUser = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Usuarios/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        await response.json();
      } else {
        await response.text();
      }

      return true;
    } catch (error) {
      console.error("Error en deleteUser:", error);
      throw error;
    }
  };

  // Filtrado de usuarios basado en el término de búsqueda
  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      `${user.nombre} ${user.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const toggleActive = async (id) => {
    try {
      const user = users.find(u => u.id === id);
      const updatedUser = await updateUser(id, {
        ...user,
        estado: !user.active,
        contrasena: ""
      });

      if (updatedUser) {
        setUsers(prev => prev.map(user => 
          user.id === id ? { ...user, active: !user.active } : user
        ));
        displayAlert(`Usuario ${!user.active ? 'activado' : 'desactivado'} exitosamente`);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      displayAlert("Error al cambiar el estado del usuario", "error");
    }
  };

  const handleView = (id) => {
    const userToView = users.find((user) => user.id === id);
    setSelectedUser(userToView);
    setShowDetails(true);
  };

  const handleEdit = (id) => {
    const userToEdit = users.find((user) => user.id === id);
    setNewUser({
      id: userToEdit.id,
      nombre: userToEdit.nombre,
      apellido: userToEdit.apellido,
      correo: userToEdit.correo,
      idRol: userToEdit.idRol.toString(),
      estado: userToEdit.active,
      contrasena: "",
      confirmPassword: ""
    });
    setIsEditing(true);
    setShowForm(true);
    setFormErrors({});
  };

  const handleDeleteClick = (id) => {
    const user = users.find((user) => user.id === id);
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        const success = await deleteUser(userToDelete.id);
        if (success) {
          setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id));
          displayAlert("Usuario eliminado exitosamente.");
          if (paginatedUsers.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        displayAlert("Error al eliminar el usuario", "error");
      } finally {
        setUserToDelete(null);
        setShowDeleteConfirm(false);
      }
    }
  };

  const cancelDelete = () => {
    setUserToDelete(null);
    setShowDeleteConfirm(false);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (name === "nombre") {
      // Solo letras y espacios
      filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    } else if (name === "apellido") {
      // Solo letras y espacios
      filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    } else if (name === "correo") {
      // No filtrar, solo validar formato en validateForm
      filteredValue = value;
    } else if (name === "idRol") {
      filteredValue = value;
    } else if (name === "estado") {
      filteredValue = value === "true";
    } else if (name === "contrasena" || name === "confirmPassword") {
      filteredValue = value;
    }

    setNewUser((prev) => ({
      ...prev,
      [name]: filteredValue,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      displayAlert("Por favor, corrige los errores en el formulario", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        const updatedUser = await updateUser(newUser.id, newUser);
        console.log("Usuario actualizado:", updatedUser);
        if (updatedUser) {
          await fetchUsers();
          displayAlert("Usuario actualizado exitosamente.");
        }
      } else {
        const createdUser = await createUser(newUser);
        console.log("Usuario creado:", createdUser);
        if (createdUser) {
          await fetchUsers();
          displayAlert("Usuario agregado exitosamente.");
        }
      }
      setShowForm(false);
      setIsEditing(false);
      setFormErrors({});
      setNewUser({
        nombre: "",
        apellido: "",
        correo: "",
        idRol: "",
        estado: true,
        contrasena: "",
        confirmPassword: ""
      });
    } catch (error) {
      console.error("Error saving user:", error);
      let errorMessage = "Error al guardar el usuario. Verifique la conexión o los datos.";
      if (error.message.includes("Microsoft") || error.message.includes("SQL")) {
        errorMessage = "Error del servidor. Verifique que los datos sean correctos.";
      } else if (error.message.includes("Error 500")) {
        errorMessage = "Error interno del servidor. Contacte al administrador.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      displayAlert(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setFormErrors({});
    setNewUser({
      nombre: "",
      apellido: "",
      correo: "",
      idRol: "",
      estado: true,
      contrasena: "",
      confirmPassword: ""
    });
  };

  const closeDetailsModal = () => {
    setShowDetails(false);
    setSelectedUser(null);
  };

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
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      input:focus, select:focus {
        outline: none;
        border-color: #2E5939 !important;
        box-shadow: 0 0 0 2px rgba(46, 89, 57, 0.2) !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const passwordStrength = getPasswordStrength(newUser.contrasena);

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

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, color: "#2E5939" }}>Listado de Usuarios</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={fetchUsers}
            style={{
              backgroundColor: "#679750",
              color: "white",
              padding: "8px 12px",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: "600",
              boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
            title="Recargar usuarios"
          >
            <FaSync />
          </button>
          <button
            onClick={() => {
              setShowForm(true);
              setIsEditing(false);
              setNewUser({
                nombre: "",
                apellido: "",
                correo: "",
                idRol: "",
                estado: true,
                contrasena: "",
                confirmPassword: ""
              });
              setFormErrors({});
            }}
            style={{
              backgroundColor: "#2E5939",
              color: "white",
              padding: "10px 16px",
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
            + Agregar Usuario
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={loadingStyle}>
          <FaSync style={{ animation: 'spin 1s linear infinite' }} />
          Cargando usuarios...
        </div>
      )}

      {/* Formulario de agregar/editar */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939", textAlign: 'center' }}>
                {isEditing ? "Editar Usuario" : "Agregar Nuevo Usuario"}
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
            
            <form onSubmit={handleAddUser} style={formContainerStyle}>
              <div>
                <label style={labelStyle}>Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  value={newUser.nombre}
                  onChange={handleInputChange}
                  style={formErrors.nombre ? inputErrorStyle : inputStyle}
                  required
                  maxLength="50"
                />
                {formErrors.nombre && <span style={errorTextStyle}>{formErrors.nombre}</span>}
              </div>
              
              <div>
                <label style={labelStyle}>Apellido:</label>
                <input
                  type="text"
                  name="apellido"
                  value={newUser.apellido}
                  onChange={handleInputChange}
                  style={formErrors.apellido ? inputErrorStyle : inputStyle}
                  required
                  maxLength="50"
                />
                {formErrors.apellido && <span style={errorTextStyle}>{formErrors.apellido}</span>}
              </div>
              
              <div>
                <label style={labelStyle}>Correo electrónico:</label>
                <input
                  type="email"
                  name="correo"
                  value={newUser.correo}
                  onChange={handleInputChange}
                  style={formErrors.correo ? inputErrorStyle : inputStyle}
                  required
                  maxLength="100"
                />
                {formErrors.correo && <span style={errorTextStyle}>{formErrors.correo}</span>}
              </div>

              <div>
                <label style={labelStyle}>Rol:</label>
                <select
                  name="idRol"
                  value={newUser.idRol}
                  onChange={handleInputChange}
                  style={formErrors.idRol ? { ...inputErrorStyle, paddingRight: 40 } : { ...inputStyle, paddingRight: 40 }}
                  required
                >
                  <option value="">Seleccionar rol</option>
                  {roles.filter(role => role.estado).map(role => (
                    <option key={role.idRol} value={role.idRol}>
                      {role.nombreRol}
                    </option>
                  ))}
                </select>
                {formErrors.idRol && <span style={errorTextStyle}>{formErrors.idRol}</span>}
              </div>

              {!isEditing && (
                <>
                  <div>
                    <label style={labelStyle}>Contraseña:</label>
                    <input
                      type="password"
                      name="contrasena"
                      value={newUser.contrasena}
                      onChange={handleInputChange}
                      style={formErrors.contrasena ? inputErrorStyle : inputStyle}
                      required={!isEditing}
                      minLength="8"
                    />
                    {formErrors.contrasena && <span style={errorTextStyle}>{formErrors.contrasena}</span>}
                    {newUser.contrasena && (
                      <div style={passwordStrengthStyle}>
                        <div>Fortaleza: {passwordStrength.text}</div>
                        <div style={{
                          ...strengthBarStyle,
                          width: `${(passwordStrength.strength / 5) * 100}%`,
                          backgroundColor: passwordStrength.color
                        }}></div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={labelStyle}>Confirmar Contraseña:</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={newUser.confirmPassword}
                      onChange={handleInputChange}
                      style={formErrors.confirmPassword ? inputErrorStyle : inputStyle}
                      required={!isEditing}
                    />
                    {formErrors.confirmPassword && <span style={errorTextStyle}>{formErrors.confirmPassword}</span>}
                  </div>
                </>
              )}

              {isEditing && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Nueva Contraseña (opcional):</label>
                  <input
                    type="password"
                    name="contrasena"
                    value={newUser.contrasena}
                    onChange={handleInputChange}
                    style={inputStyle}
                    placeholder="Dejar vacío para mantener la contraseña actual"
                    minLength="8"
                  />
                  {newUser.contrasena && (
                    <div style={passwordStrengthStyle}>
                      <div>Fortaleza: {passwordStrength.text}</div>
                      <div style={{
                        ...strengthBarStyle,
                        width: `${(passwordStrength.strength / 5) * 100}%`,
                        backgroundColor: passwordStrength.color
                      }}></div>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", gridColumn: '1 / -1', gap: 10 }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: isSubmitting ? "#95a5a6" : "#2E5939",
                    color: "#fff",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: 10,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    if (!isSubmitting) {
                      e.target.style.background = "linear-gradient(90deg, #67d630, #95d34e)";
                      e.target.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isSubmitting) {
                      e.target.style.background = "#2E5939";
                      e.target.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {isSubmitting ? "Guardando..." : (isEditing ? "Actualizar" : "Guardar")} Usuario
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: isSubmitting ? "#bdc3c7" : "#ccc",
                    color: "#333",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: 10,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
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
      {showDetails && selectedUser && (
        <div style={modalOverlayStyle}>
          <div style={detailsModalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939", textAlign: 'center' }}>Detalles del Usuario</h2>
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
                <div style={detailValueStyle}>{selectedUser.id}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Nombre Completo</div>
                <div style={detailValueStyle}>{`${selectedUser.nombre} ${selectedUser.apellido}`}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Correo Electrónico</div>
                <div style={detailValueStyle}>{selectedUser.correo}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Rol</div>
                <div style={detailValueStyle}>{selectedUser.rol}</div>
              </div>
              
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Estado</div>
                <div style={detailValueStyle}>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      backgroundColor: selectedUser.active ? "#4caf50" : "#e57373",
                      color: "white",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    {selectedUser.active ? "Activo" : "Inactivo"}
                  </span>
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
      {showDeleteConfirm && userToDelete && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 450, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 20, color: "#2E5939" }}>Confirmar Eliminación</h3>
            <p style={{ marginBottom: 30, fontSize: '1.1rem', color: "#2E5939" }}>
              ¿Estás seguro de que quieres eliminar al usuario "{userToDelete.nombre} {userToDelete.apellido}"?
            </p>
            <div style={{ display: "flex", justifyContent: "space-around", gap: 15 }}>
              <button
                onClick={confirmDelete}
                style={{
                  backgroundColor: "#e57373",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontWeight: "600",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                }}
              >
                Sí, Eliminar
              </button>
              <button
                onClick={cancelDelete}
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
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "#2E5939";
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barra de búsqueda */}
      {!loading && (
        <>
          <input
            type="text"
            placeholder="Buscar por nombre o apellido..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: "10px 15px",
              marginBottom: 20,
              borderRadius: 10,
              border: "1px solid #ccc",
              width: "100%",
              maxWidth: 400,
              backgroundColor: "#F7F4EA",
              color: "#2E5939",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />

          {/* Tabla de usuarios */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              backgroundColor: "#fff",
              color: "#2E5939",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#679750", color: "#fff" }}>
                <th style={{ padding: 12, textAlign: "left", fontWeight: "bold" }}>Nombre</th>
                <th style={{ padding: 12, textAlign: "left", fontWeight: "bold" }}>Apellido</th>
                <th style={{ padding: 12, textAlign: "left", fontWeight: "bold" }}>Correo</th>
                <th style={{ padding: 12, textAlign: "center", fontWeight: "bold" }}>Rol</th>
                <th style={{ padding: 12, textAlign: "center", fontWeight: "bold" }}>Estado</th>
                <th style={{ padding: 12, textAlign: "center", fontWeight: "bold" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 20, textAlign: "center", color: "#2E5939" }}>
                    {users.length === 0 ? "No hay usuarios registrados" : "No se encontraron usuarios."}
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: 12, color: "#2E5939" }}>{user.nombre}</td>
                    <td style={{ padding: 12, color: "#2E5939" }}>{user.apellido}</td>
                    <td style={{ padding: 12, color: "#2E5939" }}>{user.correo}</td>
                    <td style={{ padding: 12, textAlign: "center", color: "#2E5939" }}>
                      {getRoleName(user.idRol)}
                    </td>
                    <td style={{ padding: 12, textAlign: "center" }}>
                      <button
                        onClick={() => toggleActive(user.id)}
                        style={{
                          cursor: "pointer",
                          padding: "8px 12px",
                          borderRadius: 8,
                          border: "none",
                          backgroundColor: user.active ? "#4caf50" : "#e57373",
                          color: "white",
                          fontWeight: "600",
                          fontSize: "14px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                        title={user.active ? "Activo" : "Inactivo"}
                      >
                        {user.active ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td style={{ padding: 12, textAlign: "center" }}>
                      <button
                        onClick={() => handleView(user.id)}
                        style={btnAccion("#F7F4EA", "#2E5939")}
                        title="Ver Detalles"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(user.id)}
                        style={btnAccion("#F7F4EA", "#2E5939")}
                        title="Editar Usuario"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user.id)}
                        style={btnAccion("#fbe9e7", "#e57373")}
                        title="Eliminar Usuario"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

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
        </>
      )}
    </div>
  );
};

export default Users;