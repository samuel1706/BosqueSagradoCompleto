import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaCalendarAlt, FaHome, FaMapMarkerAlt, FaMoneyBillAlt, FaBox, 
  FaCreditCard, FaTimes, FaCheck, FaExclamationTriangle, FaUser,
  FaPhone, FaEnvelope, FaUsers, FaStar
} from "react-icons/fa";

// ===============================================
// ESTILOS
// ===============================================
const cardStyle = {
  backgroundColor: '#fff',
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  overflow: 'hidden',
  border: '1px solid rgba(103, 151, 80, 0.15)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  border: "1px solid #E8F0E8",
  borderRadius: 12,
  backgroundColor: "#F9FBFA",
  color: "#2E5939",
  boxSizing: 'border-box',
  boxShadow: "0 2px 6px rgba(46, 89, 57, 0.05)",
  fontSize: "15px",
  transition: "all 0.3s ease",
  fontFamily: 'inherit'
};

const inputFocusStyle = {
  outline: "none",
  borderColor: "#2E5939",
  boxShadow: "0 0 0 3px rgba(46, 89, 57, 0.15)",
  backgroundColor: "#FFFFFF"
};

const labelStyle = {
  display: "block",
  fontWeight: "600",
  marginBottom: 10,
  color: "#2E5939",
  fontSize: "14px",
  textTransform: "uppercase",
  letterSpacing: "0.5px"
};

const alertStyle = {
  position: 'fixed',
  top: 24,
  right: 24,
  padding: '18px 24px',
  borderRadius: '14px',
  boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
  zIndex: 10000,
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  fontWeight: '600',
  fontSize: '15px',
  minWidth: '340px',
  maxWidth: '500px',
  borderLeft: '6px solid',
  backdropFilter: 'blur(12px)',
  animation: 'slideInRight 0.4s ease-out'
};

const btnPrimaryStyle = {
  backgroundColor: "#2E5939",
  color: "white",
  padding: "16px 32px",
  border: "none",
  borderRadius: 12,
  cursor: "pointer",
  fontWeight: "700",
  boxShadow: "0 6px 20px rgba(46, 89, 57, 0.3)",
  transition: "all 0.3s ease",
  fontSize: "16px",
  minWidth: '180px',
  letterSpacing: '0.5px',
  textTransform: 'uppercase'
};

const btnSecondaryStyle = {
  backgroundColor: "#ffffff",
  color: "#2E5939",
  padding: "16px 32px",
  border: "2px solid #2E5939",
  borderRadius: 12,
  cursor: "pointer",
  fontWeight: "700",
  transition: "all 0.3s ease",
  minWidth: '140px',
  fontSize: "15px",
  letterSpacing: '0.5px'
};

// URLs de la API
const API_BASE_URL = "http://localhost:5272/api";
const API_RESERVAS = `${API_BASE_URL}/Reservas`;
const API_CABANAS = `${API_BASE_URL}/Cabanas`;
const API_SEDES = `${API_BASE_URL}/Sede`;
const API_PAQUETES = `${API_BASE_URL}/Paquetes`;
const API_ESTADOS = `${API_BASE_URL}/EstadosReserva`;
const API_METODOS_PAGO = `${API_BASE_URL}/metodopago`;

// Componente FormField reutilizable
const FormField = ({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  options = [], 
  required = false, 
  disabled = false,
  placeholder = "",
  style = {},
  icon
}) => {
  return (
    <div style={{ marginBottom: '20px', ...style }}>
      <label style={labelStyle}>
        {icon && <span style={{ marginRight: '10px', color: '#679750' }}>{icon}</span>}
        {label}
        {required && <span style={{ color: "#e57373", marginLeft: '6px' }}>*</span>}
      </label>
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          style={{
            ...inputStyle,
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232E5939' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 16px center',
            backgroundSize: '18px',
            cursor: disabled ? 'not-allowed' : 'pointer'
          }}
          onFocus={(e) => !disabled && Object.assign(e.target.style, inputFocusStyle)}
          onBlur={(e) => {
            e.target.style.outline = "none";
            e.target.style.borderColor = "#E8F0E8";
            e.target.style.boxShadow = "0 2px 6px rgba(46, 89, 57, 0.05)";
          }}
          required={required}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            ...inputStyle,
            minHeight: '100px',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
          onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
          onBlur={(e) => {
            e.target.style.outline = "none";
            e.target.style.borderColor = "#E8F0E8";
            e.target.style.boxShadow = "0 2px 6px rgba(46, 89, 57, 0.05)";
          }}
          required={required}
          disabled={disabled}
          rows="4"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
          onBlur={(e) => {
            e.target.style.outline = "none";
            e.target.style.borderColor = "#E8F0E8";
            e.target.style.boxShadow = "0 2px 6px rgba(46, 89, 57, 0.05)";
          }}
          required={required}
          disabled={disabled}
        />
      )}
    </div>
  );
};

// Componente de tarjeta informativa
const InfoCard = ({ title, value, subtitle, icon, color = "#2E5939" }) => (
  <div style={{
    backgroundColor: '#F9FBFA',
    padding: '20px',
    borderRadius: '12px',
    border: `2px solid ${color}20`,
    textAlign: 'center',
    transition: 'transform 0.2s ease'
  }}>
    <div style={{ color, fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
    <div style={{ fontSize: '18px', fontWeight: '700', color, marginBottom: '4px' }}>
      {value}
    </div>
    <div style={{ fontSize: '14px', color: '#679750', fontWeight: '600' }}>{title}</div>
    {subtitle && <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{subtitle}</div>}
  </div>
);

// Componente principal del formulario
export default function ReservaForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [datosRelacionados, setDatosRelacionados] = useState({
    cabanas: [],
    sedes: [],
    paquetes: [],
    estados: [],
    metodosPago: []
  });

  // Estado del formulario
  const [formData, setFormData] = useState({
    // Información personal
    nombre: "",
    email: "",
    telefono: "",
    
    // Información de reserva
    idReserva: 0,
    fechaReserva: "",
    fechaEntrada: "",
    fechaRegistro: new Date().toISOString().split('T')[0],
    abono: 0,
    restante: 0,
    montoTotal: 0,
    idUsuario: 1, // Por defecto, puedes cambiar esto según tu lógica de usuarios
    idEstado: 2, // Estado pendiente por defecto
    idSede: "",
    idCabana: "",
    idMetodoPago: "",
    idPaquete: "",
    
    // Información adicional
    numeroPersonas: 1,
    observaciones: ""
  });

  // Cargar datos relacionados al montar el componente
  useEffect(() => {
    cargarDatosRelacionados();
  }, []);

  // Calcular montos cuando cambian los datos relevantes
  useEffect(() => {
    calcularMontos();
  }, [formData.idPaquete, formData.fechaEntrada, formData.fechaReserva, formData.numeroPersonas]);

  const cargarDatosRelacionados = async () => {
    try {
      setLoading(true);
      
      const configuracionPorDefecto = {
        estados: [
          { idEstado: 1, nombreEstado: 'Abonado' },
          { idEstado: 2, nombreEstado: 'Pendiente' },
          { idEstado: 3, nombreEstado: 'Cancelada' },
          { idEstado: 4, nombreEstado: 'Completada' }
        ],
        metodosPago: [
          { idMetodoPago: 1, nombreMetodoPago: "Transferencia" },
          { idMetodoPago: 2, nombreMetodoPago: "Efectivo" },
          { idMetodoPago: 3, nombreMetodoPago: "Tarjeta" }
        ]
      };

      const fetchConManejoError = async (url, defaultValue = []) => {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error('Error en la respuesta');
          const data = await response.json();
          return Array.isArray(data) ? data : (data?.$values || defaultValue);
        } catch (error) {
          console.warn(`⚠ No se pudieron cargar datos de ${url}:`, error.message);
          return defaultValue;
        }
      };

      const [cabanasData, sedesData, paquetesData, estadosData, metodosPagoData] = await Promise.all([
        fetchConManejoError(API_CABANAS),
        fetchConManejoError(API_SEDES),
        fetchConManejoError(API_PAQUETES),
        fetchConManejoError(API_ESTADOS, configuracionPorDefecto.estados),
        fetchConManejoError(API_METODOS_PAGO, configuracionPorDefecto.metodosPago)
      ]);

      setDatosRelacionados({
        cabanas: cabanasData,
        sedes: sedesData,
        paquetes: paquetesData,
        estados: estadosData,
        metodosPago: metodosPagoData
      });

      // Establecer valores por defecto
      if (sedesData.length > 0) {
        setFormData(prev => ({ ...prev, idSede: sedesData[0].idSede }));
      }
      if (metodosPagoData.length > 0) {
        setFormData(prev => ({ ...prev, idMetodoPago: metodosPagoData[0].idMetodoPago }));
      }

    } catch (error) {
      console.error("❌ Error al cargar datos relacionados:", error);
      displayAlert("❌ Error al cargar los datos del formulario", "error");
    } finally {
      setLoading(false);
    }
  };

  const calcularMontos = () => {
    const paqueteSeleccionado = datosRelacionados.paquetes.find(
      p => p.idPaquete === parseInt(formData.idPaquete)
    );
    
    const precioBase = paqueteSeleccionado ? parseFloat(paqueteSeleccionado.precioPaquete || 0) : 0;
    
    // Calcular días de estadía
    let diasEstadia = 1;
    if (formData.fechaEntrada && formData.fechaReserva) {
      const entrada = new Date(formData.fechaEntrada);
      const salida = new Date(formData.fechaReserva);
      const diffTime = Math.abs(salida - entrada);
      diasEstadia = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    }

    // Aplicar recargo por personas adicionales (más de 2)
    const recargoPersonas = formData.numeroPersonas > 2 ? (formData.numeroPersonas - 2) * 50000 : 0;
    
    const montoTotal = (precioBase * diasEstadia) + recargoPersonas;
    const abono = Math.round(montoTotal * 0.5);
    const restante = montoTotal - abono;

    setFormData(prev => ({
      ...prev,
      montoTotal: montoTotal,
      abono: abono,
      restante: restante
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    try {
      // Preparar datos para la API
      const reservaData = {
        idReserva: 0,
        fechaReserva: formData.fechaReserva,
        fechaEntrada: formData.fechaEntrada,
        fechaRegistro: new Date().toISOString().split('T')[0], // Fecha actual
        abono: parseFloat(formData.abono),
        restante: parseFloat(formData.restante),
        montoTotal: parseFloat(formData.montoTotal),
        idUsuario: parseInt(formData.idUsuario),
        idEstado: parseInt(formData.idEstado),
        idSede: parseInt(formData.idSede),
        idCabana: parseInt(formData.idCabana),
        idMetodoPago: parseInt(formData.idMetodoPago),
        idPaquete: formData.idPaquete ? parseInt(formData.idPaquete) : 0
      };

      console.log("📤 Enviando datos de reserva:", reservaData);

      const response = await fetch(API_RESERVAS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservaData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      
      console.log("✅ Reserva creada exitosamente:", result);
      displayAlert("✅ ¡Reserva creada exitosamente! Te redirigiremos en breve...", "success");
      
      // Redirigir después de 3 segundos
      setTimeout(() => {
        navigate("/cliente/reservas");
      }, 3000);

    } catch (error) {
      console.error("❌ Error al crear reserva:", error);
      displayAlert(`❌ Error al crear la reserva: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const validarFormulario = () => {
    // Validar información personal
    if (!formData.nombre.trim()) {
      displayAlert("❌ El nombre completo es obligatorio", "error");
      return false;
    }

    if (!formData.email.trim()) {
      displayAlert("❌ El email es obligatorio", "error");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      displayAlert("❌ El formato del email no es válido", "error");
      return false;
    }

    if (!formData.telefono.trim()) {
      displayAlert("❌ El teléfono es obligatorio", "error");
      return false;
    }

    // Validar información de reserva
    const camposRequeridos = [
      'fechaEntrada', 'fechaReserva', 'idSede', 'idCabana', 'idMetodoPago'
    ];

    for (const campo of camposRequeridos) {
      if (!formData[campo]) {
        const nombreCampo = campo.replace('id', '').replace(/([A-Z])/g, ' $1').trim();
        displayAlert(`❌ El campo ${nombreCampo} es obligatorio`, "error");
        return false;
      }
    }

    // Validar fechas
    const hoy = new Date().toISOString().split('T')[0];
    if (formData.fechaEntrada < hoy) {
      displayAlert("❌ La fecha de entrada no puede ser anterior a hoy", "error");
      return false;
    }

    if (formData.fechaReserva <= formData.fechaEntrada) {
      displayAlert("❌ La fecha de salida debe ser posterior a la fecha de entrada", "error");
      return false;
    }

    if (formData.montoTotal <= 0) {
      displayAlert("❌ Debe seleccionar un paquete para calcular el monto total", "error");
      return false;
    }

    if (formData.numeroPersonas < 1) {
      displayAlert("❌ El número de personas debe ser al menos 1", "error");
      return false;
    }

    if (formData.numeroPersonas > 6) {
      displayAlert("❌ El número máximo de personas es 6", "error");
      return false;
    }

    return true;
  };

  const displayAlert = (message, type = "info") => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage("");
    }, 5000);
  };

  const handleCancel = () => {
    if (window.confirm("¿Estás seguro de que quieres cancelar? Se perderán los datos no guardados.")) {
      navigate("/cliente/reservas");
    }
  };

  // Filtrar elementos activos
  const cabanasActivas = datosRelacionados.cabanas.filter(c => 
    c.estadoCabana === true || c.estadoCabana === 1 || c.estadoCabana?.toString().toLowerCase() === 'activo'
  );

  const sedesActivas = datosRelacionados.sedes.filter(s => 
    s.estadoSede === true || s.estadoSede === 1 || s.estadoSede?.toString().toLowerCase() === 'activo'
  );

  const paquetesActivos = datosRelacionados.paquetes.filter(p => 
    p.estadoPaquete === true || p.estadoPaquete === 1 || p.estadoPaquete?.toString().toLowerCase() === 'activo'
  );

  const calcularDiasEstadia = () => {
    if (formData.fechaEntrada && formData.fechaReserva) {
      const entrada = new Date(formData.fechaEntrada);
      const salida = new Date(formData.fechaReserva);
      const diffTime = Math.abs(salida - entrada);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    }
    return 1;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div style={{ 
      padding: "28px", 
      backgroundColor: "#f5f8f2", 
      minHeight: "100vh",
      width: "100%",
      boxSizing: "border-box",
      margin: 0,
      background: "linear-gradient(135deg, #f5f8f2 0%, #e8f0e8 100%)"
    }}>
      
      {/* Alerta */}
      {showAlert && (
        <div style={{
          ...alertStyle,
          backgroundColor: alertMessage.includes('❌') ? '#ffebee' : '#e8f5e8',
          color: alertMessage.includes('❌') ? '#c62828' : '#2E5939',
          borderLeftColor: alertMessage.includes('❌') ? '#e57373' : '#4caf50'
        }}>
          {alertMessage.includes('❌') ? 
            <FaExclamationTriangle style={{ color: '#e57373', fontSize: '20px' }} /> : 
            <FaCheck style={{ color: '#4caf50', fontSize: '20px' }} />
          }
          <span>{alertMessage}</span>
          <button
            onClick={() => setShowAlert(false)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'inherit', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              marginLeft: 'auto',
              opacity: 0.7
            }}
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: 32,
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h1 style={{ 
            margin: 0, 
            color: "#2E5939", 
            fontSize: "32px", 
            fontWeight: "800",
            background: "linear-gradient(135deg, #2E5939 0%, #679750 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "8px"
          }}>
            🌲 Reserva tu Aventura
          </h1>
          <p style={{ 
            margin: "8px 0 0 0", 
            color: "#679750", 
            fontSize: "16px",
            fontWeight: "500"
          }}>
            Vive una experiencia única en el Bosque Sagrado - Completa tus datos para crear la reserva
          </p>
        </div>
        <button
          onClick={handleCancel}
          style={{
            ...btnSecondaryStyle,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: "14px 28px"
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#2E5939";
            e.target.style.color = "white";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#ffffff";
            e.target.style.color = "#2E5939";
            e.target.style.transform = "translateY(0)";
          }}
        >
          <FaTimes /> Cancelar
        </button>
      </div>

      {/* Formulario */}
      <div style={cardStyle}>
        <div style={{ padding: "32px" }}>
          {loading && datosRelacionados.cabanas.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px" }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #2E5939',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px'
              }}></div>
              <div style={{ fontSize: '18px', marginBottom: '8px', color: "#2E5939", fontWeight: '600' }}>
                Cargando datos...
              </div>
              <div style={{ color: "#679750", fontSize: '14px' }}>
                Preparando tu experiencia en el bosque
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Sección de Información Personal */}
              <div style={{ 
                backgroundColor: '#FBFDF9', 
                padding: '28px', 
                borderRadius: '16px',
                marginBottom: '28px',
                border: '1px solid rgba(103, 151, 80, 0.15)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                <h3 style={{ 
                  color: '#2E5939', 
                  marginBottom: '24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  fontSize: '20px',
                  fontWeight: '700'
                }}>
                  <div style={{
                    backgroundColor: '#2E5939',
                    color: 'white',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}>
                    <FaUser />
                  </div>
                  Información Personal
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  <FormField
                    label="Nombre Completo"
                    name="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required={true}
                    placeholder="Ingresa tu nombre completo"
                    icon={<FaUser />}
                  />
                  <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required={true}
                    placeholder="tu@email.com"
                    icon={<FaEnvelope />}
                  />
                  <FormField
                    label="Teléfono"
                    name="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    required={true}
                    placeholder="+57 300 123 4567"
                    icon={<FaPhone />}
                  />
                </div>
              </div>

              {/* Sección de Fechas */}
              <div style={{ 
                backgroundColor: '#FBFDF9', 
                padding: '28px', 
                borderRadius: '16px',
                marginBottom: '28px',
                border: '1px solid rgba(103, 151, 80, 0.15)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                <h3 style={{ 
                  color: '#2E5939', 
                  marginBottom: '24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  fontSize: '20px',
                  fontWeight: '700'
                }}>
                  <div style={{
                    backgroundColor: '#2E5939',
                    color: 'white',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}>
                    <FaCalendarAlt />
                  </div>
                  Fechas de la Reserva
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  <FormField
                    label="Fecha de Entrada"
                    name="fechaEntrada"
                    type="date"
                    value={formData.fechaEntrada}
                    onChange={handleInputChange}
                    required={true}
                  />
                  <FormField
                    label="Fecha de Salida"
                    name="fechaReserva"
                    type="date"
                    value={formData.fechaReserva}
                    onChange={handleInputChange}
                    required={true}
                  />
                  <FormField
                    label="Número de Personas"
                    name="numeroPersonas"
                    type="number"
                    value={formData.numeroPersonas}
                    onChange={handleInputChange}
                    required={true}
                    min="1"
                    max="6"
                    icon={<FaUsers />}
                  />
                </div>
                {formData.fechaEntrada && formData.fechaReserva && (
                  <div style={{ 
                    marginTop: '20px', 
                    padding: '20px', 
                    backgroundColor: '#E8F5E8', 
                    borderRadius: '12px',
                    textAlign: 'center',
                    border: '2px solid #2E5939'
                  }}>
                    <strong style={{ color: '#2E5939', fontSize: '18px' }}>
                      🗓️ Estadía de {calcularDiasEstadia()} {calcularDiasEstadia() === 1 ? 'día' : 'días'}
                    </strong>
                  </div>
                )}
              </div>

              {/* Sección de Alojamiento */}
              <div style={{ 
                backgroundColor: '#FBFDF9', 
                padding: '28px', 
                borderRadius: '16px',
                marginBottom: '28px',
                border: '1px solid rgba(103, 151, 80, 0.15)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                <h3 style={{ 
                  color: '#2E5939', 
                  marginBottom: '24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  fontSize: '20px',
                  fontWeight: '700'
                }}>
                  <div style={{
                    backgroundColor: '#2E5939',
                    color: 'white',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}>
                    <FaHome />
                  </div>
                  Información del Alojamiento
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  <FormField
                    label="Sede"
                    name="idSede"
                    type="select"
                    value={formData.idSede}
                    onChange={handleInputChange}
                    options={sedesActivas.map(s => ({ value: s.idSede, label: s.nombreSede }))}
                    required={true}
                    icon={<FaMapMarkerAlt />}
                  />
                  <FormField
                    label="Cabaña"
                    name="idCabana"
                    type="select"
                    value={formData.idCabana}
                    onChange={handleInputChange}
                    options={cabanasActivas.map(c => ({ value: c.idCabana, label: `${c.nombre} - ${c.tipoCabana || 'Tipo no especificado'}` }))}
                    required={true}
                    icon={<FaHome />}
                  />
                  <FormField
                    label="Paquete"
                    name="idPaquete"
                    type="select"
                    value={formData.idPaquete}
                    onChange={handleInputChange}
                    options={[{ value: '', label: 'Seleccionar paquete' }, ...paquetesActivos.map(p => ({ value: p.idPaquete, label: `${p.nombrePaquete} - ${formatCurrency(p.precioPaquete || 0)}` }))]}
                    icon={<FaBox />}
                  />
                </div>
              </div>

              {/* Sección de Pago */}
              <div style={{ 
                backgroundColor: '#FBFDF9', 
                padding: '28px', 
                borderRadius: '16px',
                marginBottom: '28px',
                border: '1px solid rgba(103, 151, 80, 0.15)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                <h3 style={{ 
                  color: '#2E5939', 
                  marginBottom: '24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  fontSize: '20px',
                  fontWeight: '700'
                }}>
                  <div style={{
                    backgroundColor: '#2E5939',
                    color: 'white',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}>
                    <FaMoneyBillAlt />
                  </div>
                  Información de Pago
                </h3>
                
                {/* Tarjetas informativas */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                  <InfoCard
                    title="Monto Total"
                    value={formatCurrency(formData.montoTotal)}
                    icon={<FaMoneyBillAlt />}
                    color="#2E5939"
                  />
                  <InfoCard
                    title="Abono (50%)"
                    value={formatCurrency(formData.abono)}
                    icon={<FaCreditCard />}
                    color="#679750"
                  />
                  <InfoCard
                    title="Restante"
                    value={formatCurrency(formData.restante)}
                    icon={<FaStar />}
                    color="#FFA000"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  <FormField
                    label="Método de Pago"
                    name="idMetodoPago"
                    type="select"
                    value={formData.idMetodoPago}
                    onChange={handleInputChange}
                    options={datosRelacionados.metodosPago.map(m => ({ value: m.idMetodoPago, label: m.nombreMetodoPago }))}
                    required={true}
                    icon={<FaCreditCard />}
                  />
                </div>
                
                {/* Detalles del cálculo */}
                {formData.montoTotal > 0 && (
                  <div style={{ 
                    marginTop: '24px', 
                    padding: '20px', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '12px',
                    fontSize: '14px',
                    color: '#2E5939',
                    border: '1px solid #E8F0E8'
                  }}>
                    <div style={{ fontWeight: '700', marginBottom: '12px', fontSize: '15px' }}>📊 Detalles del cálculo:</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                      <div>• Días de estadía: <strong>{calcularDiasEstadia()}</strong></div>
                      <div>• Número de personas: <strong>{formData.numeroPersonas}</strong></div>
                      {formData.numeroPersonas > 2 && (
                        <div>• Recargo por personas adicionales: <strong>{formatCurrency((formData.numeroPersonas - 2) * 50000)}</strong></div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Observaciones */}
              <div style={{ 
                backgroundColor: '#FBFDF9', 
                padding: '28px', 
                borderRadius: '16px',
                marginBottom: '28px',
                border: '1px solid rgba(103, 151, 80, 0.15)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                <h3 style={{ 
                  color: '#2E5939', 
                  marginBottom: '20px',
                  fontSize: '20px',
                  fontWeight: '700'
                }}>
                  Observaciones Adicionales
                </h3>
                <FormField
                  label="Observaciones o comentarios especiales"
                  name="observaciones"
                  type="textarea"
                  value={formData.observaciones}
                  onChange={handleInputChange}
                  placeholder="Alergias alimenticias, necesidades especiales, celebración especial, preferencias dietarias, etc."
                />
              </div>

              {/* Botones de acción */}
              <div style={{ 
                display: "flex", 
                justifyContent: "flex-end", 
                gap: "20px", 
                marginTop: "40px",
                flexWrap: 'wrap',
                paddingTop: '28px',
                borderTop: '2px solid #f0f0f0'
              }}>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={btnSecondaryStyle}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#2E5939";
                    e.target.style.color = "white";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#ffffff";
                    e.target.style.color = "#2E5939";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...btnPrimaryStyle,
                    backgroundColor: loading ? "#ccc" : "#2E5939",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1
                  }}
                  onMouseOver={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = "#1e4629";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 8px 25px rgba(46, 89, 57, 0.4)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = "#2E5939";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 6px 20px rgba(46, 89, 57, 0.3)";
                    }
                  }}
                >
                  {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <div style={{
                        width: '18px',
                        height: '18px',
                        border: '2px solid transparent',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Procesando Reserva...
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <FaCheck />
                      Confirmar Reserva
                    </div>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Estilos CSS para animaciones */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
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

          /* Mejoras de hover para las tarjetas */
          .info-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          }

          /* Responsive */
          @media (max-width: 768px) {
            .form-section {
              padding: 20px !important;
            }
            
            .header-content {
              flex-direction: column;
              text-align: center;
            }
          }
        `}
      </style>
    </div>
  );
}