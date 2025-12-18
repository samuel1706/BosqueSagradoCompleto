import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaSearch, 
  FaExclamationTriangle, 
  FaMapMarkerAlt, 
  FaEye, 
  FaFileInvoiceDollar, 
  FaTimes, 
  FaCalendarAlt, 
  FaHome, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaIdCard, 
  FaStar, 
  FaCheck, 
  FaClock, 
  FaCreditCard, 
  FaShieldAlt,
  FaSpinner,
  FaBox,
  FaUtensils
} from "react-icons/fa";
import { getUser, getUserIdForReservation } from "../../utils/auth";

// ===============================================
// ESTILOS MEJORADOS
// ===============================================
const cardStyle = {
  backgroundColor: '#fff',
  borderRadius: '16px',
  boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
  overflow: 'hidden',
  border: '1px solid rgba(103, 151, 80, 0.15)',
  transition: 'all 0.3s ease'
};

const inputStyle = {
  width: "100%",
  padding: "14px 18px",
  border: "2px solid #E8F0E8",
  borderRadius: "12px",
  backgroundColor: "#F9FBFA",
  color: "#2E5939",
  boxSizing: 'border-box',
  boxShadow: "0 3px 12px rgba(46, 89, 57, 0.06)",
  fontSize: "15px",
  transition: "all 0.3s ease",
  fontFamily: 'inherit'
};

const btnPrimary = {
  backgroundColor: "#2E5939",
  color: "#fff",
  border: "none",
  padding: "12px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "14px",
  transition: "all 0.3s ease",
  display: 'flex',
  alignItems: 'center',
  gap: "8px"
};

const btnOutline = {
  backgroundColor: "#fff",
  color: "#2E5939",
  border: "2px solid #2E5939",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "14px",
  transition: "all 0.3s ease",
  display: 'flex',
  alignItems: 'center',
  gap: "8px"
};

const btnSecondary = {
  backgroundColor: "#679750",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "14px",
  transition: "all 0.3s ease",
  display: 'flex',
  alignItems: 'center',
  gap: "8px"
};

// ===============================================
// CONFIG API COMPLETA
// ===============================================
const API_BASE = "https://www.bosquesagrado.somee.com/api";
const API_RESERVAS = `${API_BASE}/Reservas`;
const API_SEDES = `${API_BASE}/Sede`;
const API_CABANAS = `${API_BASE}/Cabanas`;
const API_PAQUETES = `${API_BASE}/Paquetes`;
const API_ESTADOS = `${API_BASE}/EstadosReserva`;
const API_METODOS_PAGO = `${API_BASE}/metodopago`;
const API_SERVICIOS_RESERVA = `${API_BASE}/ServiciosReserva`;
const API_SERVICIOS = `${API_BASE}/Servicio`;
const API_ABONOS = `${API_BASE}/Abonos`;
const API_USUARIOS = `${API_BASE}/Usuarios`; // Nueva URL para usuarios

// ===============================================
// HELPERS
// ===============================================
const safeParse = (raw) => { 
  try { 
    return JSON.parse(raw); 
  } catch { 
    return null; 
  } 
};

const formatDate = (d) => { 
  if (!d) return 'No especificada';
  try { 
    return new Date(d).toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }); 
  } catch { 
    return d; 
  } 
};

const formatCurrency = (amount) => {
  if (!amount) return '$0';
  try {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  } catch {
    return `$${amount.toLocaleString()}`;
  }
};

const extractUserIdFromLocal = () => {
  try {
    const userId = getUserIdForReservation();
    if (userId) return userId;

    const keys = ["user", "usuario", "authUser", "usuarioLogueado", "app_user", "auth", "persist:root"];
    for (const k of keys) {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      const obj = safeParse(raw);
      if (obj && (obj.idUsuario || obj.id || obj.userId)) 
        return Number(obj.idUsuario ?? obj.id ?? obj.userId);
      
      const m = raw.match(/"idUsuario"\s*:\s*(\d+)/) || raw.match(/"id"\s*:\s*(\d+)/);
      if (m) return Number(m[1]);
    }

    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      const obj = safeParse(raw);
      if (obj && (obj.idUsuario || obj.id || obj.userId)) 
        return Number(obj.idUsuario ?? obj.id ?? obj.userId);
    }
  } catch (error) {
    console.error("Error extrayendo userId:", error);
  }
  return null;
};

// ===============================================
// COMPONENTE MODAL DE DETALLES MEJORADO - CON DATOS REALES COMPLETOS
// ===============================================
const DetalleReservaModal = ({ reserva, isOpen, onClose }) => {
  const [detallesCompletos, setDetallesCompletos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar detalles completos cuando se abre el modal
  useEffect(() => {
    if (isOpen && reserva) {
      cargarDetallesCompletos(reserva.id);
    } else {
      setDetallesCompletos(null);
      setError(null);
    }
  }, [isOpen, reserva]);

  const cargarDetallesCompletos = async (reservaId) => {
    if (!reservaId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`📥 Cargando detalles completos para reserva ${reservaId}`);
      
      // Obtener datos de la reserva específica
      const reservaResponse = await fetch(`${API_RESERVAS}/${reservaId}`);
      if (!reservaResponse.ok) throw new Error('Error al cargar reserva');
      const reservaData = await reservaResponse.json();
      
      // Obtener servicios de la reserva con detalles completos
      let serviciosData = [];
      try {
        const serviciosResponse = await fetch(`${API_SERVICIOS_RESERVA}/reserva/${reservaId}`);
        if (serviciosResponse.ok) {
          serviciosData = await serviciosResponse.json();
          // Obtener detalles completos de cada servicio
          for (let servicio of serviciosData) {
            try {
              const servicioDetalleResponse = await fetch(`${API_SERVICIOS}/${servicio.idServicio}`);
              if (servicioDetalleResponse.ok) {
                const servicioDetalle = await servicioDetalleResponse.json();
                servicio.detalle = servicioDetalle;
              }
            } catch (error) {
              console.warn('No se pudo cargar detalle del servicio:', error);
            }
          }
        }
      } catch (error) {
        console.warn('No se pudieron cargar los servicios:', error);
      }
      
      // Obtener abonos de la reserva
      let abonosData = [];
      try {
        const abonosResponse = await fetch(`${API_ABONOS}/reserva/${reservaId}`);
        if (abonosResponse.ok) {
          abonosData = await abonosResponse.json();
        }
      } catch (error) {
        console.warn('No se pudieron cargar los abonos:', error);
      }
      
      // Obtener información adicional de sedes, cabañas, etc.
      const infoAdicional = await cargarInformacionAdicional(reservaData);
      
      // Obtener información del usuario si está disponible
      let usuarioData = null;
      if (reservaData.idUsuario) {
        try {
          const usuarioResponse = await fetch(`${API_USUARIOS}/${reservaData.idUsuario}`);
          if (usuarioResponse.ok) {
            usuarioData = await usuarioResponse.json();
          }
        } catch (error) {
          console.warn('No se pudo cargar información del usuario:', error);
        }
      }
      
      setDetallesCompletos({
        ...reservaData,
        servicios: serviciosData,
        abonos: abonosData,
        infoAdicional,
        usuario: usuarioData
      });
      
    } catch (error) {
      console.error('Error cargando detalles:', error);
      setError('No se pudieron cargar los detalles completos de la reserva');
    } finally {
      setLoading(false);
    }
  };

  const cargarInformacionAdicional = async (reservaData) => {
    const resultados = {
      sede: null,
      cabana: null,
      paquete: null,
      estado: null,
      metodoPago: null
    };

    try {
      // Cargar sede
      if (reservaData.idSede) {
        try {
          const response = await fetch(`${API_SEDES}/${reservaData.idSede}`);
          if (response.ok) resultados.sede = await response.json();
        } catch (error) {
          console.warn('Error cargando sede:', error);
        }
      }

      // Cargar cabaña
      if (reservaData.idCabana) {
        try {
          const response = await fetch(`${API_CABANAS}/${reservaData.idCabana}`);
          if (response.ok) resultados.cabana = await response.json();
        } catch (error) {
          console.warn('Error cargando cabaña:', error);
        }
      }

      // Cargar paquete
      if (reservaData.idPaquete) {
        try {
          const response = await fetch(`${API_PAQUETES}/${reservaData.idPaquete}`);
          if (response.ok) resultados.paquete = await response.json();
        } catch (error) {
          console.warn('Error cargando paquete:', error);
        }
      }

      // Cargar estado
      if (reservaData.idEstado) {
        try {
          const response = await fetch(`${API_ESTADOS}/${reservaData.idEstado}`);
          if (response.ok) resultados.estado = await response.json();
        } catch (error) {
          console.warn('Error cargando estado:', error);
        }
      }

      // Cargar método de pago
      if (reservaData.idMetodoPago) {
        try {
          const response = await fetch(`${API_METODOS_PAGO}/${reservaData.idMetodoPago}`);
          if (response.ok) resultados.metodoPago = await response.json();
        } catch (error) {
          console.warn('Error cargando método de pago:', error);
        }
      }

    } catch (error) {
      console.error('Error cargando información adicional:', error);
    }

    return resultados;
  };

  if (!isOpen || !reserva) return null;

  const {
    id,
    cliente,
    sede,
    cabaña,
    fechaEntrada,
    fechaSalida,
    montoTotal,
    abono,
    restante
  } = reserva;

  // Calcular días de estadía (usar detalles de la API si están disponibles)
  const calcularDias = () => {
    // Preferir fechas desde detallesCompletos si existen, sino usar las props de reserva
    const fe = detallesCompletos?.fechaEntrada ?? fechaEntrada;
    const fs = detallesCompletos?.fechaSalida ?? fechaSalida;
    if (!fe || !fs) return 0;
    try {
      const entrada = new Date(fe);
      const salida = new Date(fs);
      const diff = salida.getTime() - entrada.getTime();
      return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    } catch {
      return 0;
    }
  };

  const diasEstadia = calcularDias();

  return (
    <div 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        zIndex: 20000,
        padding: '16px',
        animation: 'fadeIn 0.3s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        style={{ 
          width: '95%',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflow: 'auto',
          background: 'white', 
          borderRadius: '20px', 
          padding: '28px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
          border: '1px solid rgba(103, 151, 80, 0.2)',
          animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del Modal */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "24px",
          paddingBottom: "20px",
          borderBottom: "2px solid #E8F0E8"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              backgroundColor: '#2E5939',
              color: 'white',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              boxShadow: '0 6px 18px rgba(46, 89, 57, 0.25)'
            }}>
              <FaFileInvoiceDollar />
            </div>
            <div>
              <h3 style={{ 
                margin: 0, 
                color: "#2E5939", 
                fontSize: "24px",
                fontWeight: "800" 
              }}>
                Detalle de Reserva #{id}
              </h3>
              <p style={{ 
                margin: "4px 0 0 0", 
                color: "#679750", 
                fontSize: "14px" 
              }}>
                {loading ? "Cargando información..." : "Información completa de tu experiencia"}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ 
              background: "transparent", 
              border: "none", 
              cursor: "pointer",
              color: "#2E5939",
              fontSize: "20px",
              padding: "8px",
              borderRadius: "50%",
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#f5f5f5";
              e.target.style.transform = "rotate(90deg)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.transform = "rotate(0deg)";
            }}
          >
            <FaTimes />
          </button>
        </div>

        {loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <FaSpinner style={{ 
              fontSize: '32px', 
              color: '#2E5939',
              animation: 'spin 1s linear infinite'
            }} />
            <div style={{ color: '#2E5939', fontWeight: '600' }}>
              Cargando detalles de la reserva...
            </div>
          </div>
        )}

        {error && (
          <div style={{
            padding: '16px',
            backgroundColor: '#ffebee',
            borderRadius: '10px',
            border: '2px solid #e57373',
            color: '#c62828',
            fontSize: "14px",
            fontWeight: '600',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: "10px"
          }}>
            <FaExclamationTriangle />
            {error}
          </div>
        )}

        {detallesCompletos && !loading && (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 350px", 
            gap: "28px",
            alignItems: "start"
          }}>
            {/* Columna Izquierda - Información Principal */}
            <div>
              {/* Información de Fechas y Estadía */}
              <div style={{
                backgroundColor: '#F9FBFA',
                padding: "20px",
                borderRadius: "14px",
                border: '2px solid #E8F0E8',
                marginBottom: "20px"
              }}>
                <h4 style={{ 
                  margin: "0 0 16px 0", 
                  color: "#2E5939",
                  fontSize: "18px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <FaCalendarAlt />
                  Fechas de la Estadía
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: "12px"
                }}>
                  <div>
                    <div style={{ color: '#679750', fontSize: "13px", fontWeight: "600" }}>Fecha de registro</div>
                    <div style={{ color: '#2E5939', fontSize: "15px", fontWeight: "700" }}>
                      {formatDate(detallesCompletos.fechaRegistro ?? detallesCompletos.fechaCreacion ?? detallesCompletos.fecha ?? 'No especificada')}
                    </div>
                  </div>

                  <div>
                    <div style={{ color: '#679750', fontSize: "13px", fontWeight: "600" }}>Check-in (Entrada)</div>
                    <div style={{ color: '#2E5939', fontSize: "15px", fontWeight: "700" }}>
                      {formatDate(detallesCompletos.fechaEntrada ?? detallesCompletos.fechaIngreso ?? 'No especificada')}
                    </div>
                  </div>

                  <div>
                    <div style={{ color: '#679750', fontSize: "13px", fontWeight: "600" }}>Fecha de salida</div>
                    <div style={{ color: '#2E5939', fontSize: "15px", fontWeight: "700" }}>
                      {formatDate(detallesCompletos.fechaReserva ?? detallesCompletos.fechaCreacion ?? 'No especificada')}
                    </div>
                  </div>
                    {/* Mostrar duración sólo si es mayor que 0 */}
                  {diasEstadia > 0 && (
                    <div>
                      <div style={{ color: '#679750', fontSize: "13px", fontWeight: "600" }}>Duración</div>
                      <div style={{ color: '#2E5939', fontSize: "15px", fontWeight: "700" }}>
                        {diasEstadia} {diasEstadia === 1 ? 'noche' : 'noches'}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Información del Alojamiento (mejorada: muestra paquete y servicios desde la API) */}
              <div style={{
                backgroundColor: '#F9FBFA',
                padding: "20px",
                borderRadius: "14px",
                border: '2px solid #E8F0E8',
                marginBottom: "20px"
              }}>
                <h4 style={{ 
                  margin: "0 0 16px 0", 
                  color: "#2E5939",
                  fontSize: "18px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <FaHome />
                  Alojamiento
                </h4>

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: "14px"
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: "10px",
                    backgroundColor: '#2E5939',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: "20px",
                    flexShrink: 0
                  }}>
                    {detallesCompletos.infoAdicional?.paquete ? <FaBox /> : <FaHome />}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontWeight: "700",
                      color: '#2E5939',
                      fontSize: "16px",
                      marginBottom: "4px"
                    }}>
                      {detallesCompletos.infoAdicional?.paquete?.nombrePaquete ||
                       detallesCompletos.infoAdicional?.cabana?.nombre ||
                       detallesCompletos.infoAdicional?.cabana?.nombreCabana ||
                       detallesCompletos.raw?.nombreCabana ||
                       detallesCompletos.raw?.cabaña ||
                       cabaña ||
                       'Alojamiento'}
                    </div>

                    <div style={{
                      color: '#679750',
                      fontSize: "14px",
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}>
                      <FaMapMarkerAlt />
                      {detallesCompletos.infoAdicional?.sede?.nombreSede || sede || detallesCompletos.raw?.sede || 'Sede'}
                    </div>

                    <div style={{
                      color: '#2E5939',
                      fontSize: "13px",
                      lineHeight: "1.4",
                      marginBottom: "8px"
                    }}>
                      {detallesCompletos.infoAdicional?.paquete?.descripcion ||
                       detallesCompletos.infoAdicional?.cabana?.descripcion ||
                       "Disfruta de una experiencia única en medio de la naturaleza con todas las comodidades."}
                    </div>

                    {/* Paquete contratado (si existe) */}
                    {detallesCompletos.infoAdicional?.paquete && (
                      <div style={{
                        marginTop: "8px",
                        padding: "12px",
                        borderRadius: "10px",
                        backgroundColor: "#F0FFF4",
                        border: "1px solid rgba(103,151,80,0.08)"
                      }}>
                        <div style={{ fontWeight: 700, color: "#2E5939", marginBottom: "6px" }}>
                          Paquete contratado
                        </div>
                        <div style={{ color: "#2E5939", fontSize: "13px", marginBottom: "6px" }}>
                          {detallesCompletos.infoAdicional.paquete.nombrePaquete} — {detallesCompletos.infoAdicional.paquete.precio ? formatCurrency(detallesCompletos.infoAdicional.paquete.precio) : ''}
                        </div>
                        {detallesCompletos.infoAdicional.paquete.descripcion && (
                          <div style={{ color: "#679750", fontSize: "13px", marginBottom: "6px" }}>
                            {detallesCompletos.infoAdicional.paquete.descripcion}
                          </div>
                        )}

                        {/* Si el paquete incluye servicios, listarlos */}
                        {(detallesCompletos.infoAdicional.paquete.servicios ||
                          detallesCompletos.infoAdicional.paquete.serviciosIncluidos ||
                          detallesCompletos.infoAdicional.paquete.items) ? (
                          <div style={{ marginTop: "8px" }}>
                            <div style={{ fontSize: "13px", color: "#2E5939", fontWeight: 600, marginBottom: "6px" }}>Servicios incluidos en el paquete</div>
                            <ul style={{ margin: 0, paddingLeft: "18px", color: "#679750", fontSize: "13px" }}>
                              {(detallesCompletos.infoAdicional.paquete.servicios || detallesCompletos.infoAdicional.paquete.serviciosIncluidos || detallesCompletos.infoAdicional.paquete.items).map((s, i) => (
                                <li key={i}>{s.nombre || s.nombreServicio || s}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Servicios seleccionados (traídos desde ServiciosReserva -> Servicio) */}
              {(detallesCompletos.servicios && detallesCompletos.servicios.length > 0) ? (
                <div style={{
                  backgroundColor: '#FFF3E0',
                  padding: "20px",
                  borderRadius: "14px",
                  border: '2px solid #FFA000',
                  marginBottom: "20px"
                }}>
                  <h4 style={{ 
                    margin: "0 0 16px 0", 
                    color: "#FFA000",
                    fontSize: "18px",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}>
                    <FaUtensils />
                    Servicios seleccionados
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: "10px" }}>
                    {detallesCompletos.servicios.map((servicio, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: "12px",
                        backgroundColor: 'white',
                        borderRadius: "8px",
                        border: '1px solid #FFA000'
                      }}>
                        <div>
                          <div style={{ color: '#2E5939', fontWeight: "600", fontSize: "14px" }}>
                            {servicio.detalle?.nombreServicio || servicio.nombreServicio || servicio.detalle?.nombre || servicio.nombre || `Servicio ${index + 1}`}
                          </div>
                          { (servicio.detalle?.descripcion || servicio.descripcion) && (
                            <div style={{ color: '#679750', fontSize: "12px" }}>
                              {servicio.detalle?.descripcion || servicio.descripcion}
                            </div>
                          )}
                          <div style={{ color: '#679750', fontSize: "12px", marginTop: "4px" }}>
                            Cantidad: {servicio.cantidad ?? servicio.cantidadSeleccionada ?? 1}
                          </div>
                        </div>
                        <div style={{ color: '#FFA000', fontWeight: "800", fontSize: "14px" }}>
                          {formatCurrency(servicio.precio ?? servicio.detalle?.precio ?? 0)}
                        </div>
                      </div>
                    ))}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: "12px",
                      backgroundColor: '#2E5939',
                      borderRadius: "8px",
                      color: 'white',
                      fontWeight: "800"
                    }}>
                      <span>Total servicios:</span>
                      <span>
                        {formatCurrency(detallesCompletos.servicios.reduce((total, servicio) => total + (Number(servicio.precio ?? servicio.detalle?.precio ?? 0) * (Number(servicio.cantidad ?? 1))), 0))}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Información del Cliente */}
              <div style={{
                backgroundColor: '#F9FBFA',
                padding: "20px",
                borderRadius: "14px",
                border: '2px solid #E8F0E8',
                marginBottom: "20px"
              }}>
                <h4 style={{ 
                  margin: "0 0 16px 0", 
                  color: "#2E5939",
                  fontSize: "18px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <FaUser />
                  Información del Cliente
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: "12px"
                }}>
                  <div>
                    <div style={{ color: '#679750', fontSize: "13px", fontWeight: "600" }}>Nombre completo</div>
                    <div style={{ color: '#2E5939', fontSize: "15px", fontWeight: "600" }}>
                      {detallesCompletos.usuario?.nombre || detallesCompletos.usuario?.nombreCliente || cliente}
                    </div>
                  </div>
                  {(detallesCompletos.usuario?.correo || detallesCompletos.usuario?.email) && (
                    <div>
                      <div style={{ color: '#679750', fontSize: "13px", fontWeight: "600" }}>Email</div>
                      <div style={{ color: '#2E5939', fontSize: "15px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                        <FaEnvelope />
                        {detallesCompletos.usuario?.correo || detallesCompletos.usuario?.email}
                      </div>
                    </div>
                  )}
                  {(detallesCompletos.usuario?.celular || detallesCompletos.usuario?.telefono) && (
                    <div>
                      <div style={{ color: '#679750', fontSize: "13px", fontWeight: "600" }}>Teléfono</div>
                      <div style={{ color: '#2E5939', fontSize: "15px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                        <FaPhone />
                        {detallesCompletos.usuario?.celular || detallesCompletos.usuario?.telefono}
                      </div>
                    </div>
                  )}
                  {(detallesCompletos.usuario?.numeroDocumento || detallesCompletos.usuario?.documento) && (
                    <div>
                      <div style={{ color: '#679750', fontSize: "13px", fontWeight: "600" }}>Documento</div>
                      <div style={{ color: '#2E5939', fontSize: "15px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                        <FaIdCard />
                        {detallesCompletos.usuario?.tipoDocumento || 'CC'} {detallesCompletos.usuario?.numeroDocumento || detallesCompletos.usuario?.documento}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Observaciones */}
              {detallesCompletos.observaciones && (
                <div style={{
                  backgroundColor: '#E8F5E8',
                  padding: "20px",
                  borderRadius: "14px",
                  border: '2px solid #2E5939',
                  marginBottom: "20px"
                }}>
                  <h4 style={{ 
                    margin: "0 0 12px 0", 
                    color: "#2E5939",
                    fontSize: "16px",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <FaStar />
                    Observaciones Especiales
                  </h4>
                  <div style={{ 
                    color: "#2E5939", 
                    fontSize: "14px",
                    lineHeight: "1.5",
                    fontStyle: "italic"
                  }}>
                    {detallesCompletos.observaciones}
                  </div>
                </div>
              )}
            </div>

            {/* Columna Derecha - Resumen y Estado */}
            <div>
              {/* Resumen de Pagos */}
              <div style={{
                backgroundColor: '#FBFDF9',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 8px 25px rgba(46, 89, 57, 0.12)',
                border: '1px solid rgba(103, 151, 80, 0.15)',
                marginBottom: '20px'
              }}>
                <h4 style={{ 
                  margin: '0 0 20px 0',
                  color: '#2E5939',
                  fontSize: "18px",
                  fontWeight: "800",
                  textAlign: 'center'
                }}>
                  Resumen de Pagos
                </h4>

                <div style={{ marginBottom: "16px" }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: "12px",
                    paddingBottom: "12px",
                    borderBottom: '1px solid #E8F0E8'
                  }}>
                    <span style={{ color: '#2E5939', fontSize: "14px" }}>Monto Total</span>
                    <span style={{ color: '#2E5939', fontWeight: "800", fontSize: "16px" }}>
                      {formatCurrency(detallesCompletos.montoTotal || 0)}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: "12px",
                    paddingBottom: "12px",
                    borderBottom: '1px solid #E8F0E8'
                  }}>
                    <span style={{ color: '#4CAF50', fontSize: "14px" }}>Abono Inicial</span>
                    <span style={{ color: '#4CAF50', fontWeight: "800", fontSize: "16px" }}>
                      {formatCurrency(detallesCompletos.abono || 0)}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: "16px",
                    paddingBottom: "16px",
                    borderBottom: '2px solid #E8F0E8'
                  }}>
                    <span style={{ color: '#FFA000', fontSize: "14px" }}>Saldo Restante</span>
                    <span style={{ color: '#FFA000', fontWeight: "800", fontSize: "16px" }}>
                      {formatCurrency(detallesCompletos.restante || 0)}
                    </span>
                  </div>

                  {/* Estado del Pago */}
                  <div style={{
                    padding: "12px",
                    backgroundColor: (detallesCompletos.abono >= detallesCompletos.montoTotal) ? '#E8F5E8' : '#FFF3E0',
                    borderRadius: "10px",
                    border: `2px solid ${(detallesCompletos.abono >= detallesCompletos.montoTotal) ? '#4CAF50' : '#FFA000'}`,
                    textAlign: 'center'
                  }}>
                    <div style={{
                      color: (detallesCompletos.abono >= detallesCompletos.montoTotal) ? '#4CAF50' : '#FFA000',
                      fontWeight: "800",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px"
                    }}>
                      {(detallesCompletos.abono >= detallesCompletos.montoTotal) ? <FaCheck /> : <FaClock />}
                      {(detallesCompletos.abono >= detallesCompletos.montoTotal) ? 'PAGADO COMPLETAMENTE' : 'PENDIENTE DE PAGO'}
                    </div>
                    {(detallesCompletos.abono < detallesCompletos.montoTotal) && (
                      <div style={{
                        color: '#2E5939',
                        fontSize: "12px",
                        marginTop: "4px"
                      }}>
                        Faltan {formatCurrency(detallesCompletos.restante || 0)} por pagar
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Información de Estado */}
              <div style={{
                backgroundColor: '#F9FBFA',
                borderRadius: '14px',
                padding: '20px',
                border: '2px solid #E8F0E8',
                marginBottom: '20px'
              }}>
                <h5 style={{ 
                  margin: "0 0 12px 0", 
                  color: "#2E5939",
                  fontSize: "16px",
                  fontWeight: "700"
                }}>
                  Estado de la Reserva
                </h5>
                
                <div style={{
                  marginBottom: "12px"
                }}>
                  <span style={{ 
                    color: '#2E5939', 
                    fontWeight: "600",
                    fontSize: "14px"
                  }}>
                    {/* Mostrar estado desde la info adicional si existe; si no, texto según abono */}
                    {detallesCompletos.infoAdicional?.estado?.nombreEstado ?? (detallesCompletos.abono > 0 ? 'Confirmada' : 'Pendiente')}
                  </span>
                </div>

                {detallesCompletos.infoAdicional.metodoPago && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: "8px",
                    marginBottom: "8px"
                  }}>
                    <FaCreditCard style={{ color: '#679750', fontSize: "14px" }} />
                    <span style={{ color: '#679750', fontSize: "13px" }}>
                      Método: {detallesCompletos.infoAdicional.metodoPago.nombreMetodoPago}
                    </span>
                  </div>
                )}

                {detallesCompletos.infoAdicional.estado && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: "8px"
                  }}>
                    <FaShieldAlt style={{ color: '#679750', fontSize: "14px" }} />
                    <span style={{ color: '#679750', fontSize: "13px" }}>
                      Estado: {detallesCompletos.infoAdicional.estado.nombreEstado}
                    </span>
                  </div>
                )}
              </div>

              {/* Historial de Abonos */}
              {detallesCompletos.abonos && detallesCompletos.abonos.length > 0 && (
                <div style={{
                  backgroundColor: '#F9FBFA',
                  borderRadius: '14px',
                  padding: '20px',
                  border: '2px solid #E8F0E8',
                  marginBottom: '20px'
                }}>
                  <h5 style={{ 
                    margin: "0 0 12px 0", 
                    color: "#2E5939",
                    fontSize: "16px",
                    fontWeight: "700"
                  }}>
                    Historial de Abonos
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: "8px" }}>
                    {detallesCompletos.abonos.map((abono, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: "8px",
                        backgroundColor: 'white',
                        borderRadius: "6px",
                        border: '1px solid #E8F0E8'
                      }}>
                        <div>
                          <div style={{ color: '#2E5939', fontSize: "12px", fontWeight: "600" }}>
                            {formatDate(abono.fechaAbono)}
                          </div>
                          <div style={{ color: '#679750', fontSize: "11px" }}>
                            {abono.idMetodoPago === 1 ? 'Transferencia' : 
                             abono.idMetodoPago === 2 ? 'Efectivo' : 
                             abono.idMetodoPago === 3 ? 'Tarjeta' : 'Método de pago'}
                          </div>
                        </div>
                        <div style={{ color: '#4CAF50', fontWeight: "800", fontSize: "14px" }}>
                          {formatCurrency(abono.montoAbono)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: "10px"
              }}>
                <button 
                  style={btnPrimary}
                  onClick={() => {
                    navigator.clipboard?.writeText(id.toString());
                    // Aquí podrías agregar una notificación de éxito
                  }}
                >
                  <FaFileInvoiceDollar />
                  Copiar ID de Reserva
                </button>
                
                <button 
                  style={btnSecondary}
                  onClick={() => {
                    window.print();
                  }}
                >
                  <FaFileInvoiceDollar />
                  Imprimir Comprobante
                </button>
                
                <button 
                  style={btnOutline}
                  onClick={onClose}
                >
                  <FaTimes />
                  Cerrar Detalle
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes scaleIn {
            from { 
              opacity: 0;
              transform: scale(0.8);
            }
            to { 
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

// ===============================================
// COMPONENTE PRINCIPAL MISRESERVAS - CORREGIDO
// ===============================================
export default function MisReservas() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);

  useEffect(() => {
    const u = getUser();
    const idFromUtil = u ? Number(u.idUsuario ?? u.id ?? u.userId) || null : null;
    const idFromFunction = getUserIdForReservation();
    const idFromLocal = extractUserIdFromLocal();
    
    const finalUserId = idFromFunction || idFromUtil || idFromLocal;
    
    console.log("🔍 Obteniendo userId:", {
      idFromFunction,
      idFromUtil,
      idFromLocal,
      finalUserId
    });
    
    setUserId(finalUserId);
  }, []);

  useEffect(() => {
    if (userId == null) {
      setLoading(false);
      setErrorMessage("No se detectó usuario autenticado. Inicia sesión para ver tus reservas.");
      setReservas([]);
      return;
    }
    fetchReservasForUser(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchJson = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return await res.json();
  };

  const fetchReservasForUser = async (uid) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const attempts = [
        `${API_RESERVAS}/usuario/${uid}`,
        `${API_RESERVAS}?userId=${uid}`,
        API_RESERVAS
      ];
      let data = null;
      let lastErr = null;
      
      for (const url of attempts) {
        try {
          const resp = await fetch(url);
          if (!resp.ok) { 
            lastErr = `${resp.status} ${url}`; 
            continue; 
          }
          data = await resp.json();
          console.debug("[MisReservas] respuesta desde", url, data);
          break;
        } catch (e) { 
          lastErr = e.message; 
          console.warn(e); 
        }
      }
      
      if (!data) throw new Error("No hay datos. " + (lastErr || ""));
      
      const arr = Array.isArray(data) ? data : (data?.$values || data?.reservas || []);
      const filtered = Array.isArray(arr) ? arr.filter(r => 
        Number(r.idUsuario ?? r.usuarioId ?? r.userId ?? (r.usuario && r.usuario.id) ?? 0) === Number(uid)
      ) : [];
      
      if (!filtered.length) {
        setReservas([]);
        setErrorMessage("No tienes reservas registradas.");
        setLoading(false);
        return;
      }
      
      const sedeIds = [...new Set(filtered.map(r => Number(r.idSede ?? r.sedeId ?? 0)).filter(Boolean))];
      const cabanaIds = [...new Set(filtered.map(r => Number(r.idCabana ?? r.cabanaId ?? 0)).filter(Boolean))];
      
      const sedeMap = {};
      const cabanaMap = {};
      
      await Promise.all([
        ...sedeIds.map(async id => { 
          try { 
            const j = await fetchJson(`${API_SEDES}/${id}`); 
            sedeMap[id] = j.nombreSede ?? j.nombre ?? `Sede ${id}`; 
          } catch { 
            sedeMap[id] = `Sede ${id}`; 
          } 
        }),
        ...cabanaIds.map(async id => { 
          try { 
            const j = await fetchJson(`${API_CABANAS}/${id}`); 
            cabanaMap[id] = j.nombreCabana ?? j.nombre ?? `Cabaña ${id}`; 
          } catch { 
            cabanaMap[id] = `Cabaña ${id}`; 
          } 
        })
      ]);
      
      // CORRECCIÓN DEL ERROR: Agregar paréntesis alrededor de la expresión con OR
      const normalized = filtered.map(r => {
        const id = r.idReserva ?? r.id ?? 0;
        // LÍNEA CORREGIDA - agregar paréntesis
        const cliente = r.nombreCliente ?? ((`${r.nombre ?? ''} ${r.apellido ?? ''}`.trim() || r.cliente || ''));
        const idSede = Number(r.idSede ?? r.sedeId ?? 0);
        const idCab = Number(r.idCabana ?? r.cabanaId ?? 0);
        const sedeName = r.nombreSede ?? r.sede ?? sedeMap[idSede] ?? (idSede ? `Sede ${idSede}` : 'Sede');
        const cabanaName = r.nombreCabana ?? r.cabana ?? cabanaMap[idCab] ?? (idCab ? `Cabaña ${idCab}` : 'Cabaña');
        const fechaEntrada = r.fechaEntrada ?? r.fechaReserva ?? r.fecha ?? '';
        const fechaSalida = r.fechaSalida ?? '';
        const montoTotal = Number(r.montoTotal ?? r.total ?? 0);
        const abono = Number(r.abono ?? 0);
        const restante = Number(r.restante ?? (montoTotal - abono));
        
        return { 
          raw: r, 
          id, 
          cliente, 
          sede: sedeName, 
          cabaña: cabanaName, 
          fechaEntrada, 
          fechaSalida, 
          montoTotal, 
          abono, 
          restante 
        };
      });
      
      setReservas(normalized);
    } catch (error) {
      console.error("Error fetching reservas:", error);
      setErrorMessage("No fue posible cargar tus reservas. Revisa consola.");
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (res) => {
    setSelectedReserva(res);
    setDetailOpen(true);
  };

  const closeDetail = () => { 
    setDetailOpen(false); 
    setSelectedReserva(null); 
  };

  const filtered = reservas.filter(r => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return String(r.id).includes(q) || 
           (r.cliente || "").toLowerCase().includes(q) || 
           (r.sede || "").toLowerCase().includes(q) || 
           (r.cabaña || "").toLowerCase().includes(q) || 
           (r.fechaEntrada || "").toLowerCase().includes(q);
  });

  return (
    <div style={{ 
      padding: 24, 
      backgroundColor: "#f5f8f2", 
      minHeight: "100vh", 
      boxSizing: 'border-box',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      
      {/* Modal de Detalles */}
      <DetalleReservaModal 
        reserva={selectedReserva}
        isOpen={detailOpen}
        onClose={closeDetail}
      />

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
            fontSize: "36px", 
            fontWeight: "900",
            background: "linear-gradient(135deg, #2E5939 0%, #679750 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "8px"
          }}>
            📋 Mis Reservas
          </h1>
          <p style={{ 
            margin: "8px 0 0 0", 
            color: "#679750",
            fontSize: "16px",
            fontWeight: "500"
          }}>
            Gestiona y revisa todas tus experiencias en Bosque Sagrado
          </p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button 
            style={btnOutline} 
            onClick={() => navigate("/cliente/reserva")}
          >
            + Nueva Reserva
          </button>
          <button 
            style={btnOutline} 
            onClick={() => navigate("/")}
          >
            ← Volver al Inicio
          </button>
        </div>
      </div>

      {/* Barra de Búsqueda */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '28px', 
        alignItems: 'center', 
        padding: '24px', 
        ...cardStyle 
      }}>
        <div style={{ 
          position: "relative", 
          flex: "1 1 400px", 
          minWidth: "300px" 
        }}>
          <FaSearch style={{ 
            position: "absolute", 
            left: 18, 
            top: "50%", 
            transform: "translateY(-50%)", 
            color: "#2E5939",
            fontSize: "16px"
          }} />
          <input 
            type="text" 
            placeholder="Buscar por cliente, sede, cabaña, fecha o ID..." 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            style={{ 
              ...inputStyle, 
              padding: "16px 16px 16px 50px",
              fontSize: "15px"
            }} 
          />
        </div>
        <div style={{ 
          color: '#2E5939', 
          fontSize: '15px', 
          fontWeight: '700',
          backgroundColor: '#E8F0E8',
          padding: '10px 16px',
          borderRadius: '10px',
          minWidth: '140px',
          textAlign: 'center'
        }}>
          {filtered.length} {filtered.length === 1 ? 'reserva' : 'reservas'}
        </div>
      </div>

      {/* Lista de Reservas */}
      <div style={cardStyle}>
        {loading ? (
          <div style={{ 
            textAlign: "center", 
            padding: "80px", 
            color: "#2E5939" 
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #2E5939',
              borderRadius: '50%',
              animation: 'spin 1.2s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <div style={{ fontSize: "18px", fontWeight: "700" }}>
              Cargando tus reservas...
            </div>
            <div style={{ color: "#679750", marginTop: "8px" }}>
              Preparando la información de tus experiencias
            </div>
          </div>
        ) : errorMessage ? (
          <div style={{ 
            textAlign: "center", 
            padding: "60px", 
            color: "#b00020",
            fontSize: "16px"
          }}>
            <FaExclamationTriangle size={48} style={{ marginBottom: "16px" }} />
            <div style={{ fontWeight: "600" }}>{errorMessage}</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "80px", 
            color: "#2E5939" 
          }}>
            <FaExclamationTriangle size={48} color="#679750" style={{ marginBottom: "20px" }} />
            <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
              No se encontraron reservas
            </div>
            <div style={{ color: '#679750', marginBottom: '24px' }}>
              {query ? 'Prueba con otros términos de búsqueda' : 'No tienes reservas registradas'}
            </div>
            <button 
              style={btnPrimary}
              onClick={() => navigate("/cliente/reserva")}
            >
              + Crear Mi Primera Reserva
            </button>
          </div>
        ) : (
          <div style={{ padding: "20px" }}>
            {filtered.map((res) => (
              <div 
                key={res.id} 
                style={{ 
                  padding: "24px", 
                  borderRadius: "14px", 
                  border: "2px solid rgba(46, 89, 57, 0.08)", 
                  marginBottom: "16px", 
                  backgroundColor: "#fff", 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 20,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onClick={() => openDetail(res)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
                  e.currentTarget.style.borderColor = '#2E5939';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(46, 89, 57, 0.08)';
                }}
              >
                {/* Icono de reserva */}
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  backgroundColor: '#2E5939',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px',
                  flexShrink: 0
                }}>
                  <FaFileInvoiceDollar />
                </div>

                {/* Información principal */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    color: "#2E5939", 
                    margin: "0 0 8px 0",
                    fontSize: "18px",
                    fontWeight: "800"
                  }}>
                    #{res.id} — {res.cliente}
                  </h3>
                  <div style={{ 
                    color: "#679750", 
                    fontWeight: 600,
                    fontSize: "15px",
                    marginBottom: "6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <FaMapMarkerAlt />
                    {res.sede} · {res.cabaña}
                  </div>
                  <div style={{ 
                    color: "#666", 
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <FaCalendarAlt />
                    {formatDate(res.fechaEntrada)} 
                    {res.fechaSalida && ` — ${formatDate(res.fechaSalida)}`}
                  </div>
                </div>

                {/* Monto y acciones */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontWeight: 800, 
                    color: "#2E5939", 
                    fontSize: "18px",
                    marginBottom: "12px"
                  }}>
                    {formatCurrency(res.montoTotal)}
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    gap: 12, 
                    justifyContent: 'flex-end' 
                  }}>
                    <button 
                      title="Ver detalle completo"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetail(res);
                      }}
                      style={{ 
                        ...btnPrimary, 
                        padding: "10px 16px",
                        fontSize: "13px"
                      }}
                    >
                      <FaEye /> 
                      Ver Detalle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @media (max-width: 768px) {
            .main-container {
              padding: 16px !important;
            }
            
            .header-content {
              flex-direction: column;
              text-align: center;
              gap: 16px;
            }
            
            .search-container {
              flex-direction: column;
              gap: 16px;
            }
            
            .reserva-card {
              flex-direction: column;
              text-align: center;
              gap: 16px;
            }
            
            .reserva-actions {
              justify-content: center !important;
            }
          }
        `}
      </style>
    </div>
  );
}