
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaCalendarAlt, FaHome, FaMapMarkerAlt, FaMoneyBillAlt, FaBox,
  FaCreditCard, FaTimes, FaCheck, FaExclamationTriangle, FaUser,
  FaPhone, FaEnvelope, FaUsers, FaStar, FaArrowRight, FaArrowLeft,
  FaClock, FaShieldAlt, FaSmile, FaMountain, FaUmbrellaBeach, FaLeaf,
  FaHeart, FaCouch, FaUtensils, FaWifi, FaCar, FaSnowflake,
  FaFire, FaShower, FaTree, FaSun, FaMoon, FaPlus, FaMinus,
  FaIdCard, FaUpload, FaImage, FaFileInvoiceDollar, FaReceipt,
  FaInfoCircle, FaChair, FaBed, FaBath, FaWineGlassAlt
} from "react-icons/fa";
import { getUserForReservation, isAuthenticated, getUserInfo } from "../../utils/auth";

// ===============================================
// CONFIGURACIÓN DE CLOUDINARY - USANDO TU CLOUD NAME
// ===============================================
const CLOUDINARY_CONFIG = {
  cloudName: 'dou17w0m0', // Tu cloud name de Cloudinary
  defaultFolder: 'cabanas',
  defaultTransformation: 'w_400,h_300,c_fill,q_auto,f_auto'
};

// Función para construir URLs de Cloudinary optimizadas
const getCloudinaryImageUrl = (imagePath, options = {}) => {
  const { cloudName, defaultTransformation } = CLOUDINARY_CONFIG;
  const { width = 400, height = 300, crop = 'fill', quality = 'auto' } = options;
  
  // Si no hay imagen, retornar null
  if (!imagePath || imagePath.trim() === '') {
    return null;
  }
  
  // Si ya es una URL completa (http o https)
  if (imagePath.startsWith('http')) {
    // Si ya es una URL de Cloudinary, optimizarla
    if (imagePath.includes('res.cloudinary.com')) {
      // Asegurarse de que tenga las transformaciones correctas
      const urlParts = imagePath.split('/upload/');
      if (urlParts.length === 2) {
        return `${urlParts[0]}/upload/${defaultTransformation}/${urlParts[1]}`;
      }
    }
    return imagePath;
  }
  
  // Si es solo un nombre de archivo sin extensión o path
  const hasExtension = /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(imagePath);
  
  // Si incluye una ruta completa de Cloudinary (con version)
  if (imagePath.startsWith('v')) {
    // Eliminar cualquier prefijo "v1/" duplicado
    let cleanPath = imagePath.replace(/^v1\//, '').replace(/^\//, '');
    return `https://res.cloudinary.com/${cloudName}/image/upload/${defaultTransformation}/${cleanPath}`;
  }
  
  // Si es solo un nombre de archivo
  if (!hasExtension && !imagePath.includes('/')) {
    // Intentar con extensiones comunes
    const possibleExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    for (const ext of possibleExtensions) {
      const testPath = `v1/${CLOUDINARY_CONFIG.defaultFolder}/${imagePath}${ext}`;
      // En una implementación real, aquí verificarías si existe
      return `https://res.cloudinary.com/${cloudName}/image/upload/${defaultTransformation}/${testPath}`;
    }
  }
  
  // Por defecto, usar la imagen de fallback
  return null;
};

// Imagen de fallback
const FALLBACK_IMAGE = "https://res.cloudinary.com/dou17w0m0/image/upload/w_400,h_300,c_fill,q_auto/v1/cabanas/default_cabin.jpg";

// ===============================================
// ESTILOS PREMIUM - OPTIMIZADOS
// ===============================================
const cardStyle = {
  backgroundColor: '#fff',  
  borderRadius: '20px',
  boxShadow: '0 15px 40px rgba(46, 89, 57, 0.12)',
  overflow: 'hidden',
  border: '1px solid rgba(103, 151, 80, 0.15)',
  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  width: '100%'
};

const inputStyle = {
  width: "100%",
  padding: "16px 18px",
  border: "2px solid #E8F0E8",
  borderRadius: "14px",
  backgroundColor: "#F9FBFA",
  color: "#2E5939",
  boxSizing: 'border-box',
  boxShadow: "0 3px 12px rgba(46, 89, 57, 0.06)",
  fontSize: "15px",
  transition: "all 0.3s ease",
  fontFamily: 'inherit',
  fontWeight: '500',
  maxWidth: '100%'
};

const inputFocusStyle = {
  outline: "none",
  borderColor: "#2E5939",
  boxShadow: "0 0 0 3px rgba(46, 89, 57, 0.12)",
  backgroundColor: "#FFFFFF",
  transform: "translateY(-1px)"
};

const labelStyle = {
  display: "block",
  fontWeight: "700",
  marginBottom: "10px",
  color: "#2E5939",
  fontSize: "14px",
  letterSpacing: "0.3px"
};

const alertStyle = {
  position: 'fixed',
  top: "20px",
  right: "20px",
  padding: '16px 20px',
  borderRadius: '14px',
  boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
  zIndex: 10000,
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontWeight: '600',
  fontSize: '14px',
  minWidth: '300px',
  maxWidth: '450px',
  borderLeft: '5px solid',
  backdropFilter: 'blur(10px)',
  animation: 'slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  maxWidth: 'calc(100vw - 40px)'
};

const btnPrimaryStyle = {
  backgroundColor: "#2E5939",
  color: "white",
  padding: "16px 32px",
  border: "none",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "700",
  boxShadow: "0 8px 25px rgba(46, 89, 57, 0.3)",
  transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  fontSize: "15px",
  minWidth: '160px',
  letterSpacing: '0.3px',
  textTransform: 'uppercase',
  width: 'auto'
};

const btnSecondaryStyle = {
  backgroundColor: "#ffffff",
  color: "#2E5939",
  padding: "16px 28px",
  border: "2px solid #2E5939",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "700",
  transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  minWidth: '140px',
  fontSize: "14px",
  letterSpacing: '0.3px',
  width: 'auto'
};

// ===============================================
// URLs DE LA API
// ===============================================
const API_BASE_URL = "https://www.bosquesagrado.somee.com/api";
const API_URLS = {
  RESERVAS: `${API_BASE_URL}/Reservas`,
  SEDES: `${API_BASE_URL}/Sede`,
  CABANAS: `${API_BASE_URL}/Cabanas`,
  PAQUETES: `${API_BASE_URL}/Paquetes`,
  ESTADOS: `${API_BASE_URL}/EstadosReserva`,
  METODOS_PAGO: `${API_BASE_URL}/metodopago`,
  SEDE_POR_PAQUETE: `${API_BASE_URL}/SedePorPaquete`,
  CABANA_POR_SEDE: `${API_BASE_URL}/CabanaPorSede`,
  SERVICIOS: `${API_BASE_URL}/Servicio`,
  SERVICIOS_RESERVA: `${API_BASE_URL}/ServiciosReserva`,
  SERVICIO_POR_PAQUETE: `${API_BASE_URL}/ServicioPorPaquete`,
  SEDES_POR_SERVICIO: `${API_BASE_URL}/SedesPorServicio`,
  USUARIOS: `${API_BASE_URL}/Usuarios`,
  ABONOS: `${API_BASE_URL}/Abonos`,
  IMG_CABANA: `${API_BASE_URL}/ImgCabana`, // NUEVO: Para obtener imágenes de cabañas
  IMG_PAQUETE: `${API_BASE_URL}/ImgPaquete` // NUEVO: Para obtener imágenes de paquetes
};

// ===============================================
// Modal para abono - MEJORADO Y MÁS COMPACTO
// ===============================================
const AbonoModal = ({ isOpen, onClose, onSubmit, defaultMonto = 0, metodosPago = [], defaultMetodo = null }) => {
  const [monto, setMonto] = useState(defaultMonto || 0);
  const [metodo, setMetodo] = useState(defaultMetodo ?? (metodosPago[0]?.idMetodoPago ?? 0));
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
   
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    setMonto(defaultMonto || 0);
    setMetodo(defaultMetodo ?? (metodosPago[0]?.idMetodoPago ?? 0));
    setFile(null);
    setPreview(null);
    setError("");
  }, [isOpen, defaultMonto, defaultMetodo, metodosPago]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
   
    if (!f.type.startsWith('image/')) {
      setError("❌ Solo se permiten archivos de imagen (JPG, PNG, etc.)");
      return;
    }
   
    if (f.size > 5 * 1024 * 1024) {
      setError("❌ El archivo es demasiado grande. Máximo 5MB.");
      return;
    }
   
    setFile(f);
    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(f);
  };

  const readFileAsBase64 = (f) => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(',')[1]);
    r.onerror = rej;
    r.readAsDataURL(f);
  });

  const handleSubmit = async () => {
    setError("");
    if (!monto || monto <= 0) {
      setError("❌ El monto del abono no es válido.");
      return;
    }
    if (!file) {
      setError("❌ Adjunta la imagen del comprobante.");
      return;
    }
    setSubmitting(true);
    try {
      const base64 = await readFileAsBase64(file);
      await onSubmit({
        montoAbono: Number(monto),
        idMetodoPago: Number(metodo),
        verificacionBase64: base64
      });
    } catch (err) {
      console.error("Error subida comprobante:", err);
      setError("❌ No se pudo procesar el comprobante.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;
 
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 20000,
      padding: "16px",
      animation: 'fadeIn 0.3s ease-out',
      overflow: 'auto'
    }}>
      <div style={{
        width: "95%",
        maxWidth: "900px",
        maxHeight: "90vh",
        overflow: "auto",
        background: "white",
        borderRadius: "20px",
        padding: "28px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
        border: "1px solid rgba(103, 151, 80, 0.2)",
        animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }}>
        {/* Header del Modal */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          paddingBottom: "18px",
          borderBottom: "2px solid #E8F0E8",
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: 'wrap' }}>
            <div style={{
              backgroundColor: '#2E5939',
              color: 'white',
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              boxShadow: '0 6px 18px rgba(46, 89, 57, 0.25)',
              flexShrink: 0
            }}>
              <FaFileInvoiceDollar />
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{
                margin: 0,
                color: "#2E5939",
                fontSize: "22px",
                fontWeight: "800",
                wordBreak: 'break-word'
              }}>
                Realizar Abono Inicial
              </h3>
              <p style={{
                margin: "4px 0 0 0",
                color: "#679750",
                fontSize: "13px",
                wordBreak: 'break-word'
              }}>
                Completa tu reserva con el depósito del 50%
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
              fontSize: "18px",
              padding: "6px",
              borderRadius: "50%",
              transition: "all 0.3s ease",
              flexShrink: 0
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

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "24px",
          alignItems: "start"
        }}>
          {/* Columna Izquierda - Formulario */}
          <div style={{ width: '100%', minWidth: 0 }}>
            <div style={{
              padding: "18px",
              backgroundColor: "#F9FBFA",
              borderRadius: "14px",
              border: "2px solid #E8F0E8",
              marginBottom: "18px",
              overflow: 'hidden'
            }}>
              <h4 style={{
                margin: "0 0 10px 0",
                color: "#2E5939",
                fontSize: "15px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: 'wrap'
              }}>
                <FaCreditCard /> Información Bancaria
              </h4>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                gap: "10px",
                color: "#2E5939",
                fontSize: "13px",
                wordBreak: 'break-word'
              }}>
                <div style={{ minWidth: 0 }}>
                  <strong>Banco:</strong> Bancolombia
                </div>
                <div style={{ minWidth: 0 }}>
                  <strong>Cuenta:</strong> 123-456789-00
                </div>
                <div style={{ minWidth: 0 }}>
                  <strong>Tipo:</strong> Ahorros
                </div>
                <div style={{ minWidth: 0 }}>
                  <strong>Titular:</strong> Bosque Sagrado S.A.S
                </div>
              </div>
              <div style={{
                marginTop: "10px",
                padding: "10px",
                backgroundColor: "#FFF3E0",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#FFA000",
                fontWeight: "600",
                border: "1px solid #FFA000",
                wordBreak: 'break-word'
              }}>
                💡 <strong>Importante:</strong> Usa el concepto "Reserva EcoGlamping" en la transferencia
              </div>
            </div>

            {/* Campos del formulario */}
            <div style={{ marginBottom: "18px", width: '100%' }}>
              <label style={labelStyle}>
                <FaMoneyBillAlt style={{ marginRight: "8px" }} />
                Monto a Abonar (50% del total) - <span style={{ color: "#FFA000" }}>NO MODIFICABLE</span>
              </label>
              <input
                type="number"
                value={monto}
                readOnly
                style={{
                  ...inputStyle,
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#2E5939",
                  width: '100%',
                  backgroundColor: '#f5f5f5',
                  cursor: 'not-allowed',
                  borderColor: '#E8F0E8'
                }}
              />
              <div style={{
                marginTop: "6px",
                fontSize: "12px",
                color: "#679750",
                fontStyle: "italic",
                wordBreak: 'break-word'
              }}>
                Este monto es el 50% del total calculado automáticamente
              </div>
            </div>

            <div style={{ marginBottom: "18px", width: '100%' }}>
              <label style={labelStyle}>
                <FaCreditCard style={{ marginRight: "8px" }} />
                Método de Pago
              </label>
              <select
                value={metodo}
                onChange={(e) => setMetodo(e.target.value)}
                style={{
                  ...inputStyle,
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232E5939' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px center',
                  backgroundSize: '16px',
                  width: '100%'
                }}
              >
                {metodosPago.map(m => (
                  <option key={m.idMetodoPago} value={m.idMetodoPago}>
                    {m.nombreMetodoPago}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "18px", width: '100%' }}>
              <label style={labelStyle}>
                <FaUpload style={{ marginRight: "8px" }} />
                Comprobante de Pago
              </label>
              <div style={{
                border: '2px dashed #E8F0E8',
                borderRadius: '14px',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: '#F9FBFA',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{
                    display: 'none'
                  }}
                  id="comprobante-file"
                  accept="image/*"
                />
                <label
                  htmlFor="comprobante-file"
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: "10px",
                    width: '100%'
                  }}
                >
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#E8F5E8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2E5939',
                    fontSize: '20px',
                    flexShrink: 0
                  }}>
                    <FaUpload />
                  </div>
                  <div style={{ width: '100%', minWidth: 0 }}>
                    <div style={{
                      color: '#2E5939',
                      fontWeight: '700',
                      marginBottom: '4px',
                      fontSize: "14px",
                      wordBreak: "break-word"
                    }}>
                      {file ? 'Comprobante seleccionado' : 'Haz clic para subir comprobante'}
                    </div>
                    <div style={{
                      color: '#679750',
                      fontSize: "12px",
                      wordBreak: 'break-word'
                    }}>
                      {file ? file.name : 'Formatos: JPG, PNG (Máx. 5MB)'}
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {error && (
              <div style={{
                padding: '14px',
                backgroundColor: '#ffebee',
                borderRadius: '10px',
                border: '2px solid #e57373',
                color: '#c62828',
                fontSize: "13px",
                fontWeight: '600',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: "8px",
                width: '100%',
                wordBreak: 'break-word'
              }}>
                <FaExclamationTriangle />
                {error}
              </div>
            )}

            {/* Botones de acción */}
            <div style={{
              display: "flex",
              gap: "14px",
              marginTop: "20px",
              flexWrap: 'wrap'
            }}>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  ...btnPrimaryStyle,
                  flex: 1,
                  backgroundColor: submitting ? "#ccc" : "#2E5939",
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: "10px",
                  minWidth: 'auto'
                }}
              >
                {submitting ? (
                  <>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <FaReceipt />
                    Confirmar Abono
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                style={{
                  ...btnSecondaryStyle,
                  display: 'flex',
                  alignItems: 'center',
                  gap: "10px",
                  justifyContent: 'center',
                  minWidth: 'auto'
                }}
              >
                <FaTimes />
                Cancelar
              </button>
            </div>
          </div>

          {/* Columna Derecha - Vista Previa */}
          <div style={{ width: '100%', minWidth: 0 }}>
            <div style={{
              backgroundColor: '#FBFDF9',
              borderRadius: '14px',
              padding: '18px',
              border: '2px solid #E8F0E8',
              height: '100%',
              boxSizing: 'border-box'
            }}>
              <h4 style={{
                margin: "0 0 14px 0",
                color: "#2E5939",
                fontSize: "16px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: 'wrap'
              }}>
                <FaImage /> Vista Previa del Comprobante
              </h4>
             
              {preview ? (
                <div style={{ width: '100%' }}>
                  <img
                    src={preview}
                    alt="Vista previa del comprobante"
                    style={{
                      width: "100%",
                      maxWidth: '100%',
                      height: 'auto',
                      maxHeight: '200px',
                      objectFit: 'contain',
                      borderRadius: "10px",
                      border: "2px solid #E8F0E8",
                      marginBottom: "14px",
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{
                    padding: "10px",
                    backgroundColor: "#E8F5E8",
                    borderRadius: "8px",
                    border: "2px solid #2E5939",
                    width: '100%',
                    boxSizing: 'border-box'
                  }}>
                    <div style={{
                      color: "#2E5939",
                      fontSize: "13px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexWrap: 'wrap'
                    }}>
                      <FaCheck />
                      Comprobante listo para enviar
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  display: "flex",
                  height: "180px",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px dashed #E8F0E8",
                  borderRadius: "10px",
                  color: "#679750",
                  backgroundColor: "#F9FBFA",
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  <div style={{ textAlign: "center", width: '100%' }}>
                    <FaImage size={40} style={{ marginBottom: "10px", opacity: 0.5 }} />
                    <div style={{ fontSize: "13px", fontWeight: "600", wordBreak: 'break-word' }}>
                      Vista previa disponible
                    </div>
                    <div style={{ fontSize: "11px", marginTop: "4px", wordBreak: 'break-word' }}>
                      Selecciona un comprobante
                    </div>
                  </div>
                </div>
              )}
             
              {/* Información adicional */}
              <div style={{
                marginTop: "18px",
                padding: "14px",
                backgroundColor: "#FFF3E0",
                borderRadius: "10px",
                border: "2px solid #FFA000",
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <h5 style={{
                  color: "#FFA000",
                  margin: "0 0 6px 0",
                  fontSize: "13px",
                  fontWeight: "700",
                  wordBreak: 'break-word'
                }}>
                  📋 Información Importante
                </h5>
                <ul style={{
                  color: "#2E5939",
                  fontSize: "11px",
                  lineHeight: "1.4",
                  margin: 0,
                  paddingLeft: "14px",
                  wordBreak: "break-word"
                }}>
                  <li>Tu reserva se confirmará tras verificar el comprobante</li>
                  <li>Proceso de verificación: 24-48 horas</li>
                  <li>Recibirás confirmación por email</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===============================================
// COMPONENTE DE RECIBO/RESUMEN - MÁS COMPACTO
// ===============================================
const ResumenReserva = ({ formData, calcularDiasEstadia, formatCurrency, datosRelacionados, serviciosSeleccionados = [] }) => {
  const cabanaSeleccionada = datosRelacionados.cabanas.find(c => c.idCabana === parseInt(formData.idCabana));
  const paqueteSeleccionado = datosRelacionados.paquetes.find(p => p.idPaquete === parseInt(formData.idPaquete));
  const sedeSeleccionada = datosRelacionados.sedes.find(s => s.idSede === parseInt(formData.idSede));
 
  const diasAsociados = paqueteSeleccionado && paqueteSeleccionado.dias ? parseInt(paqueteSeleccionado.dias) : calcularDiasEstadia();
  const personasAsociadas = paqueteSeleccionado && paqueteSeleccionado.personas ? paqueteSeleccionado.personas : (cabanaSeleccionada ? cabanaSeleccionada.capacidad : 1);

  // Usar montoAlojamiento (base) y calcular subtotal/imapuestos localmente para mostrar desglose preciso
  const montoAlojamiento = Number(formData.montoAlojamiento || 0);
 
  // CORRECCIÓN: Calcular totalServiciosSeleccionados aquí mismo
  const totalServiciosSeleccionados = serviciosSeleccionados.reduce((total, servicio) =>
    total + (Number(servicio.precioServicio || 0) * diasAsociados), 0
  );

  const subtotalGeneral = montoAlojamiento + totalServiciosSeleccionados;
  const impuestos = Math.round(subtotalGeneral * 0.19);
  const totalGeneralConImpuestos = Math.round(subtotalGeneral + impuestos);
 
  const abonoInicial = Math.round(totalGeneralConImpuestos * 0.5);
  const saldoRestante = totalGeneralConImpuestos - abonoInicial;

  // Obtener imagen de la cabaña o paquete
  const imagenPrincipal = cabanaSeleccionada ? 
    (cabanaSeleccionada.imagenes && cabanaSeleccionada.imagenes.length > 0 ? 
      getCloudinaryImageUrl(cabanaSeleccionada.imagenes[0]) : FALLBACK_IMAGE) :
    (paqueteSeleccionado && paqueteSeleccionado.imagen ? 
      getCloudinaryImageUrl(paqueteSeleccionado.imagen) : FALLBACK_IMAGE);

  return (
    <div style={{
      position: 'sticky',
      top: '20px',
      backgroundColor: '#fff',
      borderRadius: '18px',
      padding: '24px',
      boxShadow: '0 15px 40px rgba(46, 89, 57, 0.12)',
      border: '1px solid rgba(103, 151, 80, 0.15)',
      height: 'fit-content',
      minWidth: '340px',
      maxWidth: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Header del recibo */}
      <div style={{
        textAlign: 'center',
        marginBottom: '20px',
        paddingBottom: '18px',
        borderBottom: '2px solid #E8F0E8',
        width: '100%'
      }}>
        <h3 style={{
          margin: '0 0 6px 0',
          color: '#2E5939',
          fontSize: "18px",
          fontWeight: "800",
          wordBreak: 'break-word'
        }}>
          Resumen de tu Reserva
        </h3>
        <p style={{
          margin: 0,
          color: '#679750',
          fontSize: "13px",
          fontWeight: "500",
          wordBreak: 'break-word'
        }}>
          Detalles y costos de tu experiencia
        </p>
      </div>

      {/* Imagen del alojamiento */}
      {(cabanaSeleccionada || paqueteSeleccionado) && imagenPrincipal && (
        <div style={{
          width: '100%',
          height: '180px',
          borderRadius: '14px',
          marginBottom: '18px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <img
            src={imagenPrincipal}
            alt={cabanaSeleccionada ? cabanaSeleccionada.nombre : paqueteSeleccionado.nombrePaquete}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            onError={(e) => {
              e.target.src = FALLBACK_IMAGE;
            }}
          />
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(46, 89, 57, 0.9)',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '700'
          }}>
            {personasAsociadas} persona{personasAsociadas !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Información de duración y personas */}
      {(paqueteSeleccionado || (formData.fechaEntrada && formData.fechaSalida)) && (
        <div style={{
          backgroundColor: '#F9FBFA',
          padding: "14px",
          borderRadius: "10px",
          marginBottom: "18px",
          border: '1px solid #E8F0E8',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: "6px",
            flexWrap: 'wrap',
            gap: '5px'
          }}>
            <span style={{ color: '#2E5939', fontWeight: "600", fontSize: "13px", wordBreak: 'break-word' }}>
              {formData.fechaEntrada && formData.fechaSalida ? `${formData.fechaEntrada} → ${formData.fechaSalida}` : (paqueteSeleccionado ? `Paquete: ${paqueteSeleccionado.nombrePaquete}` : 'Fechas por seleccionar')}
            </span>
            <span style={{
              backgroundColor: '#2E5939',
              color: 'white',
              padding: "3px 10px",
              borderRadius: '18px',
              fontSize: "11px",
              fontWeight: "700",
              flexShrink: 0
            }}>
              {diasAsociados} noche{diasAsociados !== 1 ? 's' : ''}
            </span>
          </div>
          <div style={{ color: '#679750', fontSize: "12px", fontWeight: "500", wordBreak: 'break-word' }}>
            {personasAsociadas} huésped{personasAsociadas !== 1 ? 'es' : ''}
          </div>
        </div>
      )}

      {/* Alojamiento seleccionado */}
      {(cabanaSeleccionada || paqueteSeleccionado) && (
        <div style={{ marginBottom: "18px", width: '100%' }}>
          <h4 style={{
            margin: '0 0 10px 0',
            color: '#2E5939',
            fontSize: "15px",
            fontWeight: "700",
            wordBreak: 'break-word'
          }}>
            {cabanaSeleccionada ? 'Cabaña' : 'Paquete'}
          </h4>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: "10px",
            padding: "14px",
            backgroundColor: '#F9FBFA',
            borderRadius: "10px",
            border: '1px solid #E8F0E8',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <div style={{
              width: '45px',
              height: '45px',
              borderRadius: "8px",
              backgroundColor: '#2E5939',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: "18px",
              flexShrink: 0
            }}>
              {cabanaSeleccionada ? <FaHome /> : <FaStar />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontWeight: "700",
                color: '#2E5939',
                fontSize: "14px",
                marginBottom: "3px",
                wordBreak: 'break-word'
              }}>
                {cabanaSeleccionada ? cabanaSeleccionada.nombre : paqueteSeleccionado.nombrePaquete}
              </div>
              <div style={{
                color: '#679750',
                fontSize: "12px",
                lineHeight: "1.4",
                wordBreak: 'break-word'
              }}>
                {cabanaSeleccionada ?
                  (cabanaSeleccionada.descripcion || "Cabaña premium en la naturaleza") :
                  (paqueteSeleccionado.descripcion || "Paquete de experiencia completa")
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ubicación */}
      {sedeSeleccionada && (
        <div style={{ marginBottom: "18px", width: '100%' }}>
          <h4 style={{
            margin: '0 0 10px 0',
            color: '#2E5939',
            fontSize: "15px",
            fontWeight: "700",
            wordBreak: 'break-word'
          }}>
            Ubicación
          </h4>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: "10px",
            padding: "14px",
            backgroundColor: '#F9FBFA',
            borderRadius: "10px",
            border: '1px solid #E8F0E8',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <FaMapMarkerAlt style={{ color: '#2E5939', fontSize: "16px", flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: "600", color: '#2E5939', fontSize: "13px", wordBreak: 'break-word' }}>
                {sedeSeleccionada.nombreSede}
              </div>
              <div style={{ color: '#679750', fontSize: "12px", wordBreak: 'break-word' }}>
                {sedeSeleccionada.ubicacionSede}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desglose de costos */}
      <div style={{ marginBottom: "20px", width: '100%' }}>
        <h4 style={{
          margin: '0 0 14px 0',
          color: '#2E5939',
          fontSize: "15px",
          fontWeight: "700",
          wordBreak: 'break-word'
        }}>
          Desglose de Costos
        </h4>

        {/* Subtotal alojamiento */}
        {montoAlojamiento > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: "10px",
            paddingBottom: "10px",
            borderBottom: '1px solid #E8F0E8',
            width: '100%'
          }}>
            <span style={{ color: '#2E5939', fontSize: "13px", wordBreak: 'break-word' }}>Subtotal alojamiento</span>
            <span style={{ color: '#2E5939', fontWeight: "700", fontSize: "13px", flexShrink: 0 }}>
              {formatCurrency(montoAlojamiento)}
            </span>
          </div>
        )}

        {/* Servicios extras */}
        {serviciosSeleccionados.length > 0 && (
          <div style={{ marginBottom: "10px", width: '100%' }}>
            {serviciosSeleccionados.map((servicio, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: "6px",
                width: '100%'
              }}>
                <span style={{ color: '#679750', fontSize: "12px", wordBreak: 'break-word' }}>
                  + {servicio.nombreServicio}
                </span>
                <span style={{ color: '#679750', fontWeight: "600", fontSize: "12px", flexShrink: 0 }}>
                  {formatCurrency(servicio.precioServicio * diasAsociados)}
                </span>
              </div>
            ))}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: "10px",
              paddingBottom: "10px",
              borderBottom: '1px solid #E8F0E8',
              width: '100%'
            }}>
              <span style={{ color: '#2E5939', fontSize: "13px", wordBreak: 'break-word' }}>Total servicios</span>
              <span style={{ color: '#2E5939', fontWeight: "700", fontSize: "13px", flexShrink: 0 }}>
                +{formatCurrency(totalServiciosSeleccionados)}
              </span>
            </div>
          </div>
        )}

        {/* Total antes de impuestos */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: "10px",
          paddingBottom: "10px",
          borderBottom: '1px solid #E8F0E8',
          width: '100%'
        }}>
          <span style={{ color: '#2E5939', fontSize: "13px", fontWeight: "600", wordBreak: 'break-word' }}>Subtotal</span>
          <span style={{ color: '#2E5939', fontWeight: "700", fontSize: "13px", flexShrink: 0 }}>
            {formatCurrency(subtotalGeneral)}
          </span>
        </div>

        {/* Impuestos y tasas */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: "14px",
          paddingBottom: "14px",
          borderBottom: '2px solid #E8F0E8',
          width: '100%'
        }}>
          <span style={{ color: '#2E5939', fontSize: "13px", wordBreak: 'break-word' }}>Impuestos y tasas (19%)</span>
          <span style={{ color: '#2E5939', fontWeight: "700", fontSize: "13px", flexShrink: 0 }}>
            {formatCurrency(impuestos)}
          </span>
        </div>

        {/* Total general */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: "18px",
          padding: "14px",
          backgroundColor: '#2E5939',
          borderRadius: "10px",
          color: 'white',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <span style={{ fontWeight: "700", fontSize: "15px", wordBreak: 'break-word' }}>TOTAL</span>
          <span style={{ fontWeight: "900", fontSize: "18px", flexShrink: 0 }}>
            {formatCurrency(totalGeneralConImpuestos)}
          </span>
        </div>

        {/* Información de pago */}
        <div style={{
          padding: "14px",
          backgroundColor: '#FFF3E0',
          borderRadius: "10px",
          border: '2px solid #FFA000',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: "6px",
            flexWrap: 'wrap',
            gap: '5px'
          }}>
            <span style={{ color: '#FFA000', fontWeight: "600", fontSize: "13px", wordBreak: 'break-word' }}>
              Depósito inicial (50%)
            </span>
            <span style={{ color: '#FFA000', fontWeight: "800", fontSize: "14px", flexShrink: 0 }}>
              {formatCurrency(abonoInicial)}
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: "6px",
            flexWrap: 'wrap',
            gap: '5px'
          }}>
            <span style={{ color: '#FFA000', fontWeight: "600", fontSize: "13px", wordBreak: 'break-word' }}>
              Saldo restante
            </span>
            <span style={{ color: '#FFA000', fontWeight: "800", fontSize: "14px", flexShrink: 0 }}>
              {formatCurrency(saldoRestante)}
            </span>
          </div>
          <div style={{
            marginTop: "6px",
            padding: "6px",
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: "6px",
            textAlign: 'center',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <span style={{ color: '#FFA000', fontSize: "11px", fontWeight: "600", wordBreak: 'break-word' }}>
              💳 Abono requerido para confirmar reserva
            </span>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div style={{
        padding: "14px",
        backgroundColor: '#E8F5E8',
        borderRadius: "10px",
        border: '2px solid #2E5939',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: "8px",
          marginBottom: "6px",
          flexWrap: 'wrap'
        }}>
          <FaShieldAlt style={{ color: '#2E5939' }} />
          <span style={{ color: '#2E5939', fontWeight: "700", fontSize: "13px", wordBreak: 'break-word' }}>
            Reserva Protegida
          </span>
        </div>
        <p style={{
          margin: 0,
          color: '#679750',
          fontSize: "11px",
          lineHeight: "1.4",
          wordBreak: 'break-word'
        }}>
          Tu reserva está 100% protegida. Cancelación gratuita hasta 48 horas antes del check-in.
        </p>
      </div>
    </div>
  );
};

// ===============================================
// COMPONENTES INTERACTIVOS (OPTIMIZADOS)
// ===============================================

// Componente de progreso con pasos - MÁS COMPACTO
const StepIndicator = ({ currentStep, totalSteps, steps }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    position: 'relative',
    padding: '0 20px',
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden'
  }}>
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '0',
      right: '0',
      height: '4px',
      backgroundColor: '#E8F0E8',
      transform: 'translateY(-50%)',
      zIndex: 1,
      borderRadius: '2px'
    }}></div>
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '0',
      height: '4px',
      backgroundColor: '#2E5939',
      transform: 'translateY(-50%)',
      zIndex: 2,
      width: `${(currentStep / (totalSteps - 1)) * 100}%`,
      transition: 'width 0.4s ease',
      borderRadius: '2px'
    }}></div>
   
    {steps.map((step, index) => (
      <div key={index} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 3,
        position: 'relative'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: index <= currentStep ? '#2E5939' : '#E8F0E8',
          color: index <= currentStep ? 'white' : '#679750',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: "700",
          fontSize: "18px",
          boxShadow: index <= currentStep ? '0 8px 20px rgba(46, 89, 57, 0.25)' : '0 3px 12px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          border: index === currentStep ? '3px solid #2E5939' : 'none'
        }}>
          {index < currentStep ? <FaCheck /> : step.icon}
        </div>
        <span style={{
          marginTop: "10px",
          fontSize: "13px",
          fontWeight: "700",
          color: index <= currentStep ? '#2E5939' : '#679750',
          textAlign: 'center',
          wordBreak: 'break-word'
        }}>
          {step.label}
        </span>
      </div>
    ))}
  </div>
);

// Componente de tarjeta de selección premium - MODIFICADO PARA MOSTRAR IMÁGENES DE CLOUDINARY
const SelectionCard = ({
  title,
  description,
  price,
  imageUrl, // CAMBIADO: Ahora recibe imageUrl en lugar de image
  isSelected,
  onSelect,
  features = [],
  popular = false,
  capacity = 2,
  disabled = false,
  type = "cabin" // "cabin" o "package"
}) => {
  const [imageError, setImageError] = useState(false);
  
  // Usar imagen de fallback si hay error
  const finalImageUrl = imageError || !imageUrl ? FALLBACK_IMAGE : imageUrl;

  return (
    <div
      onClick={disabled ? null : onSelect}
      style={{
        border: isSelected ? '3px solid #2E5939' : '2px solid #E8F0E8',
        borderRadius: '18px',
        padding: '24px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        backgroundColor: disabled ? '#f5f5f5' : (isSelected ? '#F9FBFA' : 'white'),
        position: 'relative',
        transform: isSelected ? 'translateY(-6px) scale(1.02)' : 'translateY(0)',
        boxShadow: isSelected ? '0 20px 40px rgba(46, 89, 57, 0.15)' : '0 6px 25px rgba(0,0,0,0.08)',
        opacity: disabled ? 0.6 : 1,
        width: '100%',
        boxSizing: 'border-box',
        maxWidth: '100%'
      }}
      onMouseEnter={(e) => {
        if (!isSelected && !disabled) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected && !disabled) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 6px 25px rgba(0,0,0,0.08)';
        }
      }}
    >
      {popular && (
        <div style={{
          position: 'absolute',
          top: '-10px',
          right: '18px',
          backgroundColor: '#FFA000',
          color: 'white',
          padding: "6px 16px",
          borderRadius: '20px',
          fontSize: "11px",
          fontWeight: "800",
          textTransform: 'uppercase',
          boxShadow: '0 3px 12px rgba(255, 160, 0, 0.25)',
          zIndex: 2,
          maxWidth: 'calc(100% - 36px)',
          wordBreak: 'break-word'
        }}>
          ⭐ Más Popular
        </div>
      )}
     
      {disabled && (
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '18px',
          backgroundColor: '#f44336',
          color: 'white',
          padding: "6px 14px",
          borderRadius: '20px',
          fontSize: "11px",
          fontWeight: "800",
          textTransform: 'uppercase',
          boxShadow: '0 3px 12px rgba(244, 67, 54, 0.25)',
          zIndex: 2,
          maxWidth: 'calc(100% - 36px)',
          wordBreak: 'break-word'
        }}>
          No Disponible
        </div>
      )}
     
      {/* Contenedor de imagen optimizado */}
      <div style={{
        width: '100%',
        height: '120px',
        borderRadius: "14px",
        marginBottom: "18px",
        background: disabled ? 'linear-gradient(135deg, #cccccc 0%, #999999 100%)' : '#E8F0E8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {!disabled && finalImageUrl ? (
          <img
            src={finalImageUrl}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: disabled ? '#999' : '#2E5939',
            fontSize: "48px"
          }}>
            {type === 'cabin' ? <FaHome /> : <FaStar />}
          </div>
        )}
        <div style={{
          position: 'absolute',
          bottom: "10px",
          right: "10px",
          backgroundColor: 'rgba(46, 89, 57, 0.8)',
          padding: "4px 10px",
          borderRadius: '18px',
          fontSize: "11px",
          fontWeight: "700",
          color: 'white',
          backdropFilter: 'blur(4px)',
          maxWidth: 'calc(100% - 20px)',
          wordBreak: 'break-word'
        }}>
          {capacity} persona{capacity !== 1 ? 's' : ''}
        </div>
      </div>
     
      <h4 style={{
        margin: '0 0 10px 0',
        color: disabled ? '#999' : '#2E5939',
        fontSize: "18px",
        fontWeight: "800",
        wordBreak: 'break-word'
      }}>
        {title}
      </h4>
     
      <p style={{
        margin: '0 0 18px 0',
        color: disabled ? '#bbb' : '#679750',
        fontSize: "14px",
        lineHeight: "1.5",
        wordBreak: 'break-word'
      }}>
        {description}
      </p>
     
      {features.length > 0 && (
        <div style={{ marginBottom: "18px", width: '100%' }}>
          {features.map((feature, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: "8px",
              marginBottom: "6px",
              fontSize: "13px",
              color: disabled ? '#bbb' : '#2E5939',
              fontWeight: "500",
              wordBreak: 'break-word'
            }}>
              <FaCheck style={{ color: disabled ? '#bbb' : '#4CAF50', fontSize: "12px", flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{feature}</span>
            </div>
          ))}
        </div>
      )}
     
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      }}>
        <span style={{
          fontSize: "22px",
          fontWeight: "900",
          color: disabled ? '#999' : '#2E5939',
          wordBreak: 'break-word'
        }}>
          {price}
        </span>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          border: `2px solid ${disabled ? '#ccc' : '#2E5939'}`,
          backgroundColor: isSelected ? '#2E5939' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          flexShrink: 0
        }}>
          {isSelected && <FaCheck style={{ color: 'white', fontSize: "12px" }} />}
        </div>
      </div>
    </div>
  );
};

// Componente de servicio extra - MÁS COMPACTO
const ServicioExtraCard = ({
  servicio,
  isSelected,
  onToggle,
  diasEstadia = 1
}) => {
  const precioTotal = servicio.precioServicio * diasEstadia;
  const imagenUrl = servicio.imagen ? getCloudinaryImageUrl(servicio.imagen, { width: 400, height: 200 }) : null;

  return (
    <div
      onClick={() => onToggle(servicio)}
      style={{
        border: isSelected ? '3px solid #2E5939' : '2px solid #E8F0E8',
        borderRadius: "14px",
        padding: "18px",
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backgroundColor: isSelected ? '#F9FBFA' : 'white',
        display: 'flex',
        alignItems: 'center',
        gap: "14px",
        width: '100%',
        boxSizing: 'border-box',
        maxWidth: '100%'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 3px 12px rgba(0,0,0,0.04)';
        }
      }}
    >
      <div style={{
        width: '22px',
        height: '22px',
        borderRadius: "5px",
        border: '2px solid #2E5939',
        backgroundColor: isSelected ? '#2E5939' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {isSelected && <FaCheck style={{ color: 'white', fontSize: "11px" }} />}
      </div>
     
      {imagenUrl && (
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '8px',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          <img
            src={imagenUrl}
            alt={servicio.nombreServicio}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
     
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: "6px",
          flexWrap: 'wrap',
          gap: '5px'
        }}>
          <h5 style={{
            margin: 0,
            color: '#2E5939',
            fontSize: "15px",
            fontWeight: "700",
            wordBreak: 'break-word'
          }}>
            {servicio.nombreServicio}
          </h5>
          <span style={{
            color: '#2E5939',
            fontWeight: "800",
            fontSize: "15px",
            flexShrink: 0
          }}>
            ${servicio.precioServicio.toLocaleString()} / noche
          </span>
        </div>
        <p style={{
          margin: 0,
          color: '#679750',
          fontSize: "13px",
          lineHeight: "1.4",
          wordBreak: 'break-word'
        }}>
          {servicio.descripcion}
        </p>
        {diasEstadia > 1 && (
          <div style={{
            marginTop: "6px",
            fontSize: "12px",
            color: '#FFA000',
            fontWeight: "600",
            wordBreak: 'break-word'
          }}>
            Total por {diasEstadia} noches: ${precioTotal.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

// Diálogo de cancelación premium - MÁS COMPACTO
const AlertDialog = ({
  isOpen,
  title = "¿Estás seguro de que quieres cancelar?",
  message = "Se perderán los datos no guardados.",
  onConfirm,
  onCancel,
  confirmText = "Sí, cancelar",
  cancelText = "Continuar"
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
   
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10001,
      padding: "16px",
      animation: 'fadeIn 0.3s ease-out',
      overflow: 'hidden'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: "20px",
        padding: "32px",
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
        maxWidth: '440px',
        width: '100%',
        border: '1px solid #e0e0e0',
        animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        textAlign: 'center',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          backgroundColor: '#fff3cd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '3px solid #ffc107',
          margin: '0 auto 18px'
        }}>
          <FaExclamationTriangle style={{
            color: '#856404',
            fontSize: "28px"
          }} />
        </div>

        <h3 style={{
          margin: '0 0 14px 0',
          color: '#2E5939',
          fontSize: "20px",
          fontWeight: "800",
          wordBreak: 'break-word'
        }}>
          {title}
        </h3>

        <p style={{
          margin: '0 0 28px 0',
          color: '#666',
          fontSize: "15px",
          lineHeight: "1.5",
          wordBreak: 'break-word'
        }}>
          {message}
        </p>

        <div style={{
          display: 'flex',
          gap: "14px",
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: "14px 28px",
              border: '2px solid #2E5939',
              backgroundColor: 'white',
              color: '#2E5939',
              borderRadius: "10px",
              cursor: 'pointer',
              fontWeight: "700",
              fontSize: "14px",
              minWidth: '120px',
              transition: 'all 0.3s ease',
              width: '100%',
              maxWidth: '200px'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#f8f9fa';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "14px 28px",
              border: 'none',
              backgroundColor: '#2E5939',
              color: 'white',
              borderRadius: "10px",
              cursor: 'pointer',
              fontWeight: "700",
              fontSize: "14px",
              minWidth: '120px',
              transition: 'all 0.3s ease',
              boxShadow: '0 5px 18px rgba(46, 89, 57, 0.25)',
              width: '100%',
              maxWidth: '200px'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#1e4629';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 7px 22px rgba(46, 89, 57, 0.35)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#2E5939';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 5px 18px rgba(46, 89, 57, 0.25)';
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente FormField mejorado - MÁS COMPACTO
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
  icon,
  validation = null,
  inputProps = {}
}) => {
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState("");

  const handleChange = (e) => {
    const { value } = e.target;
    onChange(e);
   
    if (validation) {
      const result = validation(value);
      setIsValid(result.isValid);
      setValidationMessage(result.message);
    }
  };

  return (
    <div style={{ marginBottom: '20px', ...style, width: '100%' }}>
      <label style={labelStyle}>
        {icon && <span style={{ marginRight: "10px", color: '#679750' }}>{icon}</span>}
        {label}
        {required && <span style={{ color: "#e57373", marginLeft: '4px' }}>*</span>}
      </label>
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={handleChange}
          style={{
            ...inputStyle,
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232E5939' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 16px center',
            backgroundSize: "16px",
            cursor: disabled ? 'not-allowed' : 'pointer',
            borderColor: !isValid ? '#e57373' : '#E8F0E8',
            width: '100%'
          }}
          onFocus={(e) => !disabled && Object.assign(e.target.style, { ...inputFocusStyle, borderColor: !isValid ? '#e57373' : '#2E5939' })}
          onBlur={(e) => {
            e.target.style.outline = "none";
            e.target.style.borderColor = !isValid ? '#e57373' : "#E8F0E8";
            e.target.style.boxShadow = "0 3px 12px rgba(46, 89, 57, 0.06)";
            e.target.style.transform = "translateY(0)";
          }}
          required={required}
          disabled={disabled}
          {...inputProps}
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
          onChange={handleChange}
          placeholder={placeholder}
          style={{
            ...inputStyle,
            minHeight: '100px',
            resize: 'vertical',
            fontFamily: 'inherit',
            borderColor: !isValid ? '#e57373' : '#E8F0E8',
            width: '100%'
          }}
          onFocus={(e) => Object.assign(e.target.style, { ...inputFocusStyle, borderColor: !isValid ? '#e57373' : '#2E5939' })}
          onBlur={(e) => {
            e.target.style.outline = "none";
            e.target.style.borderColor = !isValid ? '#e57373' : "#E8F0E8";
            e.target.style.boxShadow = "0 3px 12px rgba(46, 89, 57, 0.06)";
            e.target.style.transform = "translateY(0)";
          }}
          required={required}
          disabled={disabled}
          rows="3"
          {...inputProps}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          style={{
            ...inputStyle,
            borderColor: !isValid ? '#e57373' : '#E8F0E8',
            width: '100%'
          }}
          onFocus={(e) => Object.assign(e.target.style, { ...inputFocusStyle, borderColor: !isValid ? '#e57373' : '#2E5939' })}
          onBlur={(e) => {
            e.target.style.outline = "none";
            e.target.style.borderColor = !isValid ? '#e57373' : "#E8F0E8";
            e.target.style.boxShadow = "0 3px 12px rgba(46, 89, 57, 0.06)";
            e.target.style.transform = "translateY(0)";
          }}
          required={required}
          disabled={disabled}
          {...inputProps}
        />
      )}
      {!isValid && validationMessage && (
        <div style={{
          color: '#e57373',
          fontSize: "12px",
          marginTop: "6px",
          fontWeight: "600",
          display: 'flex',
          alignItems: 'center',
          gap: "4px",
          wordBreak: 'break-word'
        }}>
          <FaExclamationTriangle size={11} />
          {validationMessage}
        </div>
      )}
    </div>
  );
};

// ===============================================
// COMPONENTE PRINCIPAL DEL FORMULARIO - CORREGIDO
// ===============================================
export default function ReservaForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
 
  // Estado para datos de la API
  const [apiData, setApiData] = useState({
    sedes: [],
    cabanas: [],
    paquetes: [],
    estados: [],
    metodosPago: [],
    sedePaquetes: [],
    cabanaSedes: [],
    servicios: [],
    sedesPorServicio: [],
    imagenesCabanas: [], // NUEVO: Imágenes de cabañas
    imagenesPaquetes: [] // NUEVO: Imágenes de paquetes
  });

  // Estado del formulario - INICIALIZADO DINÁMICAMENTE
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    tipoDocumento: "",
    numeroDocumento: "",
    email: "",
    telefono: "",
    idReserva: 0,
    fechaReserva: new Date().toISOString().split('T')[0],
    fechaSalida: "",
    fechaEntrada: "",
    fechaRegistro: new Date().toISOString().split('T')[0],
    abono: 0,
    restante: 0,
    montoTotal: 0,
    idUsuario: null,
    idEstado: 1,
    idSede: "",
    idCabana: "",
    idMetodoPago: "",
    idPaquete: "",
    observaciones: ""
  });

  // Datos filtrados
  const [filteredData, setFilteredData] = useState({
    cabanas: [],
    paquetes: [],
    servicios: []
  });

  // Estados nuevos para abonos
  const [showAbonoModal, setShowAbonoModal] = useState(false);
  const [createdReservaId, setCreatedReservaId] = useState(null);
  const [abonoDefaultMonto, setAbonoDefaultMonto] = useState(0);

  useEffect(() => {
    if (showAbonoModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
   
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showAbonoModal]);

  // Definir los pasos del formulario
  const steps = [
    { label: "Tus Datos", icon: <FaUser /> },
    { label: "Alojamiento", icon: <FaHome /> },
    { label: "Extras", icon: <FaPlus /> },
    { label: "Fechas", icon: <FaCalendarAlt /> },
    { label: "Confirmación", icon: <FaCheck /> }
  ];

  // Cargar datos del usuario y datos relacionados al montar el componente
  useEffect(() => {
    if (!isAuthenticated()) {
      displayAlert("❌ Debes iniciar sesión para realizar una reserva", "error");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    const usuarioData = getUserForReservation();
    const usuarioInfo = getUserInfo();

    if (usuarioData) {
      setUsuarioLogueado(usuarioInfo);
     
      setFormData(prev => ({
        ...prev,
        idUsuario: usuarioInfo?.id || null,
        nombre: usuarioData.nombre || "",
        apellido: usuarioData.apellido || "",
        tipoDocumento: usuarioData.tipoDocumento || "",
        numeroDocumento: usuarioData.numeroDocumento || "",
        email: usuarioData.email || "",
        telefono: usuarioData.celular || ""
      }));
    } else {
      displayAlert("❌ No se pudieron cargar tus datos. Por favor, inicia sesión nuevamente.", "error");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    if (location.state?.cabana) {
      const { cabana, usuario } = location.state;
      setFormData(prev => ({
        ...prev,
        idSede: cabana.sede === "Copacabana" ? "1" : "2",
        idCabana: cabana.id.toString()
      }));
    }

    cargarDatosRelacionados();
  }, [location, navigate]);

  // Filtrar datos cuando cambia la sede seleccionada
  useEffect(() => {
    filtrarDatosPorSede();
  }, [formData.idSede, apiData]);

  // Calcular montos cuando cambian los datos relevantes
  useEffect(() => {
    calcularMontos();
  }, [formData.idPaquete, formData.fechaEntrada, formData.fechaSalida, formData.idCabana, serviciosSeleccionados]);

  useEffect(() => {
    const paquete = apiData.paquetes.find(p => p.idPaquete === parseInt(formData.idPaquete));
    if (paquete && paquete.dias) {
      if (formData.fechaEntrada) {
        const nuevaSalida = addDays(formData.fechaEntrada, paquete.dias);
        setFormData(prev => ({
          ...prev,
          fechaSalida: nuevaSalida
        }));
      }
    }
  }, [formData.idPaquete, formData.fechaEntrada, apiData.paquetes]);

  // Función para cargar todos los datos de la API - MODIFICADA PARA IMÁGENES
  const cargarDatosRelacionados = async () => {
    try {
      setLoading(true);
     
      const configuracionPorDefecto = {
        estados: [
          { idEstado: 1, nombreEstado: 'Abonado' }
        ],
        metodosPago: [
          { idMetodoPago: 1, nombreMetodoPago: "Transferencia Bancaria" },
          { idMetodoPago: 2, nombreMetodoPago: "Efectivo" },
          { idMetodoPago: 3, nombreMetodoPago: "Tarjeta de Crédito" }
        ],
        servicios: [
          { idServicio: 1, nombreServicio: "Desayuno Premium", descripcion: "Desayuno buffet con productos locales y orgánicos", precioServicio: 25000 },
          { idServicio: 2, nombreServicio: "Cena Romántica", descripcion: "Cena a la luz de las velas con menú gourmet", precioServicio: 50000 },
          { idServicio: 3, nombreServicio: "Tour Guiado", descripcion: "Recorrido por senderos naturales con guía especializado", precioServicio: 40000 },
          { idServicio: 4, nombreServicio: "Spa Relajante", descripcion: "Sesión de masajes y tratamientos de bienestar", precioServicio: 60000 }
        ]
      };

      const fetchConManejoError = async (url, defaultValue = []) => {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error('Error en la respuesta');
          const data = await response.json();
          console.log(`📥 Datos cargados de ${url}:`, data);
          return Array.isArray(data) ? data : (data?.$values || defaultValue);
        } catch (error) {
          console.warn(`⚠ No se pudieron cargar datos de ${url}:`, error.message);
          return defaultValue;
        }
      };

      const [
        sedesData,
        cabanasData,
        paquetesData,
        estadosData,
        metodosPagoData,
        sedePaquetesData,
        cabanaSedesData,
        serviciosData,
        sedesPorServicioData,
        imagenesCabanasData,
        imagenesPaquetesData
      ] = await Promise.all([
        fetchConManejoError(API_URLS.SEDES),
        fetchConManejoError(API_URLS.CABANAS),
        fetchConManejoError(API_URLS.PAQUETES),
        fetchConManejoError(API_URLS.ESTADOS, configuracionPorDefecto.estados),
        fetchConManejoError(API_URLS.METODOS_PAGO, configuracionPorDefecto.metodosPago),
        fetchConManejoError(API_URLS.SEDE_POR_PAQUETE),
        fetchConManejoError(API_URLS.CABANA_POR_SEDE),
        fetchConManejoError(API_URLS.SERVICIOS, configuracionPorDefecto.servicios),
        fetchConManejoError(API_URLS.SEDES_POR_SERVICIO, []),
        fetchConManejoError(API_URLS.IMG_CABANA, []),
        fetchConManejoError(API_URLS.IMG_PAQUETE, [])
      ]);

      // Procesar cabañas con imágenes
      const cabanasConImagenes = cabanasData.map(cabana => {
        // Buscar imágenes de esta cabaña
        const imagenesCabana = imagenesCabanasData
          .filter(img => img.idCabana === cabana.idCabana)
          .map(img => getCloudinaryImageUrl(img.rutaImagen));
        
        return {
          idCabana: cabana.idCabana,
          nombre: cabana.nombre || `Cabaña ${cabana.idCabana}`,
          descripcion: cabana.descripcion || "Disfruta de una experiencia única en la naturaleza",
          precio: cabana.precio || 150000,
          capacidad: cabana.capacidad || 2,
          habitaciones: cabana.habitaciones || 1,
          banios: cabana.banios || cabana.banos || 1,
          area: cabana.area || 40,
          imagenes: imagenesCabana.length > 0 ? imagenesCabana : [FALLBACK_IMAGE],
          idSede: cabana.idSede,
          idTipoCabana: cabana.idTipoCabana,
          estado: cabana.estado || true,
          ...cabana
        };
      });

      // Procesar paquetes con imágenes
      const paquetesConImagenes = paquetesData.map(paquete => {
        // Buscar imágenes de este paquete
        const imagenPaquete = imagenesPaquetesData
          .find(img => img.idPaquete === paquete.idPaquete);
        
        return {
          idPaquete: paquete.idPaquete,
          nombrePaquete: paquete.nombrePaquete || `Paquete ${paquete.idPaquete}`,
          descripcion: paquete.descripcion || "Paquete de experiencia completa",
          precioPaquete: paquete.precioPaquete || 0,
          dias: paquete.dias || 1,
          personas: paquete.personas || 2,
          descuento: paquete.descuento || 0,
          imagen: imagenPaquete ? getCloudinaryImageUrl(imagenPaquete.rutaImagen) : FALLBACK_IMAGE,
          estado: paquete.estado || true,
          ...paquete
        };
      });

      const serviciosConDatos = serviciosData.map(servicio => ({
        idServicio: Number(servicio.idServicio ?? servicio.id ?? 0),
        nombreServicio: servicio.nombreServicio || servicio.nombre || `Servicio ${servicio.idServicio ?? servicio.id ?? 0}`,
        precioServicio: Number(servicio.precioServicio ?? servicio.precio ?? 0),
        descripcion: servicio.descripcion ?? "Servicio adicional para tu estadía",
        imagen: servicio.imagen ? getCloudinaryImageUrl(servicio.imagen, { width: 400, height: 200 }) : null,
        estado: servicio.estado !== undefined ? Boolean(servicio.estado) : true,
        ...servicio
      }));
 
      const sedesPorServicioConDatos = (sedesPorServicioData || []).map(rel => ({
        idSedesServicio: Number(rel.idSedesServicio ?? rel.id ?? 0),
        idServicio: Number(rel.idServicio ?? rel.servicioId ?? rel.idservicio ?? 0),
        idSede: Number(rel.idSede ?? rel.sedeId ?? rel.idsede ?? 0),
        ...rel
      }));
 
      setApiData({
        sedes: sedesData,
        cabanas: cabanasConImagenes,
        paquetes: paquetesConImagenes,
        estados: estadosData,
        metodosPago: metodosPagoData,
        sedePaquetes: sedePaquetesData,
        cabanaSedes: cabanaSedesData,
        servicios: serviciosConDatos,
        sedesPorServicio: sedesPorServicioConDatos,
        imagenesCabanas: imagenesCabanasData,
        imagenesPaquetes: imagenesPaquetesData
      });

      console.log("📊 Datos de la API cargados:", {
        sedes: sedesData.length,
        cabanas: cabanasConImagenes.length,
        paquetes: paquetesConImagenes.length,
        estados: estadosData.length,
        cabanaSedes: cabanaSedesData.length,
        sedePaquetes: sedePaquetesData.length,
        imagenesCabanas: imagenesCabanasData.length,
        imagenesPaquetes: imagenesPaquetesData.length
      });

      if (sedesData.length > 0) {
        const copacabana = sedesData.find(s => s.nombreSede?.toLowerCase().includes('copacabana'));
        setFormData(prev => ({
          ...prev,
          idSede: copacabana ? copacabana.idSede : sedesData[0].idSede
        }));
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

  // Función para filtrar cabañas, paquetes y servicios por sede seleccionada
  const filtrarDatosPorSede = () => {
    if (!formData.idSede) {
      setFilteredData({
        cabanas: [],
        paquetes: [],
        servicios: []
      });
      return;
    }

    const sedeId = Number(formData.idSede);
    console.log(`🔍 Filtrando datos para sede ID: ${sedeId}`);

    let cabanasFiltradas = [];
    try {
      const hasCabanaSedes = Array.isArray(apiData.cabanaSedes) && apiData.cabanaSedes.length > 0;

      if (hasCabanaSedes) {
        cabanasFiltradas = apiData.cabanaSedes
          .map(cs => {
            if (!cs) return null;
            const csSedeId = Number(cs.idSede ?? cs.sedeId ?? cs.idsede);
            const csCabanaId = Number(cs.idCabana ?? cs.cabanaId ?? cs.idcabana);
            if (csSedeId === sedeId && csCabanaId) {
              return apiData.cabanas.find(c => Number(c.idCabana) === csCabanaId) || null;
            }
            return null;
          })
          .filter(Boolean);
      } else {
        cabanasFiltradas = apiData.cabanas.filter(c => {
          const cSedeId = Number(c.idSede ?? c.sedeId ?? c.idsede ?? 0);
          return cSedeId === sedeId;
        });
      }
    } catch (error) {
      console.error("❌ Error al filtrar cabañas:", error);
      cabanasFiltradas = [];
    }

    const paquetesFiltrados = (apiData.sedePaquetes || [])
      .map(sp => {
        if (!sp) return null;
        const spSedeId = Number(sp.idSede ?? sp.sedeId ?? sp.idsede);
        const paqueteId = Number(sp.idPaquete ?? sp.paqueteId ?? sp.idpaquete);
        if (spSedeId === sedeId && paqueteId) {
          return apiData.paquetes.find(p => Number(p.idPaquete) === paqueteId) || null;
        }
        return null;
      })
      .filter(Boolean);

    const serviciosFiltrados = apiData.servicios.filter(servicio => {
      if (!Array.isArray(apiData.sedesPorServicio) || apiData.sedesPorServicio.length === 0) {
        return servicio.estado !== false;
      }
      const disponibleEnSede = apiData.sedesPorServicio.some(sss => {
        if (!sss) return false;
        const sssSedeId = Number(sss.idSede ?? sss.sedeId ?? sss.idsede);
        const sssServicioId = Number(sss.idServicio ?? sss.servicioId ?? sss.idservicio);
        return sssSedeId === sedeId && sssServicioId === Number(servicio.idServicio);
      });
      return disponibleEnSede && servicio.estado !== false;
    });

    console.log("🔍 Resultados del filtrado:", {
      cabanasFiltradas: cabanasFiltradas.length,
      paquetesFiltrados: paquetesFiltrados.length,
      serviciosFiltrados: serviciosFiltrados.length
    });

    setFilteredData({
      cabanas: cabanasFiltradas,
      paquetes: paquetesFiltrados,
      servicios: serviciosFiltrados
    });

    if (formData.idCabana && !cabanasFiltradas.find(c => Number(c.idCabana) === Number(formData.idCabana))) {
      setFormData(prev => ({ ...prev, idCabana: "" }));
    }
    if (formData.idPaquete && !paquetesFiltrados.find(p => Number(p.idPaquete) === Number(formData.idPaquete))) {
      setFormData(prev => ({ ...prev, idPaquete: "" }));
    }
  };

  const calcularMontos = () => {
    const paqueteSeleccionado = apiData.paquetes.find(
      p => p.idPaquete === parseInt(formData.idPaquete)
    );
   
    const cabanaSeleccionada = apiData.cabanas.find(
      c => c.idCabana === parseInt(formData.idCabana)
    );
   
    let precioBasePorNoche = 0;
    if (paqueteSeleccionado) {
      precioBasePorNoche = Number(paqueteSeleccionado.precioPaquete || 0);
    } else if (cabanaSeleccionada) {
      precioBasePorNoche = Number(cabanaSeleccionada.precio || 0);
    }

    let diasEstadia = 1;
    if (paqueteSeleccionado && paqueteSeleccionado.dias) {
      diasEstadia = parseInt(paqueteSeleccionado.dias) || 1;
    } else if (formData.fechaEntrada && formData.fechaSalida) {
      const entrada = new Date(formData.fechaEntrada);
      const salida = new Date(formData.fechaSalida);
      const diffTime = Math.max(0, salida - entrada);
      diasEstadia = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    const totalServicios = serviciosSeleccionados.reduce((total, servicio) =>
      total + (Number(servicio.precioServicio || 0) * diasEstadia), 0
    );

    const montoAlojamiento = Math.round(precioBasePorNoche * diasEstadia);
    const subtotalGeneral = montoAlojamiento + Math.round(totalServicios);
    const impuestos = Math.round(subtotalGeneral * 0.19);
    const totalConImpuestos = Math.round(subtotalGeneral + impuestos);
    const abonoCalc = Math.round(totalConImpuestos * 0.5);
    const restanteCalc = totalConImpuestos - abonoCalc;

    setFormData(prev => ({
      ...prev,
      montoAlojamiento: montoAlojamiento,
      montoTotal: totalConImpuestos,
      abono: abonoCalc,
      restante: restanteCalc
    }));
   
    setAbonoDefaultMonto(abonoCalc);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'fechaEntrada') {
      setFormData(prev => {
        const nuevaFechaEntrada = value;
        let nuevaFechaSalida = prev.fechaSalida;
        if (nuevaFechaSalida && nuevaFechaEntrada >= nuevaFechaSalida) {
          nuevaFechaSalida = "";
        }
        const paquete = apiData.paquetes.find(p => p.idPaquete === parseInt(prev.idPaquete));
        if (paquete && paquete.dias && nuevaFechaEntrada) {
          nuevaFechaSalida = addDays(nuevaFechaEntrada, paquete.dias);
        }
        return {
          ...prev,
          fechaEntrada: nuevaFechaEntrada,
          fechaSalida: nuevaFechaSalida,
          fechaReserva: nuevaFechaSalida || prev.fechaReserva
        };
      });
    } else if (name === 'fechaSalida') {
      setFormData(prev => ({
        ...prev,
        fechaSalida: value,
        fechaReserva: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
     
      if (name === 'idPaquete' && value && prev.fechaEntrada) {
        const paquete = apiData.paquetes.find(p => p.idPaquete === parseInt(value));
        if (paquete && paquete.dias) {
          newData.fechaSalida = addDays(prev.fechaEntrada, paquete.dias);
          newData.fechaReserva = newData.fechaSalida;
        }
      }
     
      return newData;
    });
  };

  const toggleServicioExtra = (servicio) => {
    setServiciosSeleccionados(prev => {
      const yaSeleccionado = prev.find(s => s.idServicio === servicio.idServicio);
      if (yaSeleccionado) {
        return prev.filter(s => s.idServicio !== servicio.idServicio);
      } else {
        return [...prev, servicio];
      }
    });
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.idUsuario) {
      displayAlert("❌ No se pudo identificar al usuario. Por favor, inicia sesión nuevamente.", "error");
      return;
    }

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    try {
      // Verificar disponibilidad de la cabaña en las fechas seleccionadas
      const cabanaSeleccionadaId = formData.idCabana ? String(formData.idCabana) : null;
      const fechaEntradaToCheck = formData.fechaEntrada;
      const fechaSalidaToCheck = formData.fechaSalida || formData.fechaReserva || "";
      if (cabanaSeleccionadaId && fechaEntradaToCheck && fechaSalidaToCheck) {
        const conflict = await hasConflictWithExisting(cabanaSeleccionadaId, fechaEntradaToCheck, fechaSalidaToCheck);
        if (conflict) {
          displayAlert("❌ La cabaña seleccionada ya tiene una reserva en las mismas fechas. Elige otras fechas o una cabaña distinta.", "error");
          setLoading(false);
          return;
        }
      }

      const fechaSalidaToSend = formData.fechaSalida || formData.fechaReserva || "";
      const fechaRegistroToSend = formData.fechaRegistro && formData.fechaRegistro !== ""
        ? formData.fechaRegistro
        : new Date().toISOString().split('T')[0];
 
      const reservaData = {
        idReserva: 0,
        fechaReserva: formatDateForAPI(fechaSalidaToSend),
        fechaEntrada: formatDateForAPI(formData.fechaEntrada),
        fechaSalida: formatDateForAPI(formData.fechaSalida || fechaSalidaToSend),
        fechaRegistro: formatDateForAPI(fechaRegistroToSend),
        abono: parseFloat(formData.abono) || 0,
        restante: parseFloat(formData.restante) || 0,
        montoTotal: parseFloat(formData.montoTotal) || 0,
        idUsuario: formData.idUsuario,
        idEstado: 1,
        idSede: parseInt(formData.idSede) || 0,
        idCabana: formData.idCabana ? parseInt(formData.idCabana) : null,
        idMetodoPago: parseInt(formData.idMetodoPago) || 0,
        idPaquete: formData.idPaquete ? parseInt(formData.idPaquete) : null,
        observaciones: formData.observaciones || ""
      };

      console.log("📤 Enviando datos de reserva:", reservaData);

      const response = await fetch(API_URLS.RESERVAS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(reservaData)
      });

      if (!response.ok) {
        let errorText = await response.text();
        try { errorText = JSON.parse(errorText); } catch {}
        console.error("❌ Error del servidor:", errorText);
        throw new Error(`Error ${response.status}: ${JSON.stringify(errorText)}`);
      }

      const result = await response.json();
      const reservaId = result.idReserva ?? result.id ?? 0;
      console.log("✅ Reserva creada:", result);

      if (serviciosSeleccionados.length > 0) {
        await guardarServiciosReserva(reservaId);
      }

      setCreatedReservaId(reservaId);
      setAbonoDefaultMonto(formData.abono);
      setShowAbonoModal(true);
      displayAlert("✅ Reserva creada. Por favor realiza el abono para confirmar la reserva.", "success");

    } catch (error) {
      console.error("❌ Error al crear reserva:", error);
      displayAlert(`❌ Error al crear la reserva: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const crearAbonoEnAPI = async ({ montoAbono, idMetodoPago, verificacionBase64 }) => {
    if (!createdReservaId) {
      displayAlert("❌ ID de reserva no encontrado.", "error");
      return;
    }
    setLoading(true);
    try {
      const abonoPayload = {
        idAbono: 0,
        idReserva: Number(createdReservaId),
        fechaAbono: new Date().toISOString().split('T')[0],
        montoAbono: Number(montoAbono),
        idMetodoPago: Number(idMetodoPago),
        verificacion: verificacionBase64 || ""
      };

      console.log("📤 Enviando abono:", abonoPayload);

      const res = await fetch(API_URLS.ABONOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(abonoPayload)
      });

      if (!res.ok) {
        let err = await res.text();
        try { err = JSON.parse(err); } catch {}
        console.error("❌ Error al guardar abono:", err);
        throw new Error(typeof err === 'object' ? JSON.stringify(err) : String(err));
      }

      const data = await res.json();
      console.log("✅ Abono guardado:", data);
      setShowAbonoModal(false);
      displayAlert("✅ ¡Abono registrado exitosamente! Tu reserva está confirmada.", "success");
      setTimeout(() => navigate("/cliente/mis-reservas"), 2000);
    } catch (error) {
      console.error("❌ Error creando abono:", error);
      displayAlert("❌ No se pudo guardar el abono. Intenta nuevamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  const preventEnterSubmit = (e) => {
    if (e.key === 'Enter' && e.target && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
    }
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (currentStep < steps.length - 1) {
      nextStep();
      return;
    }
    handleSubmit(e);
  };
 
  const guardarServiciosReserva = async (idReserva) => {
    try {
      const paqueteSeleccionado = apiData.paquetes.find(p => p.idPaquete === parseInt(formData.idPaquete));
      const diasParaServicios = paqueteSeleccionado && paqueteSeleccionado.dias ? Number(paqueteSeleccionado.dias) : calcularDiasEstadia();
 
      for (const servicio of serviciosSeleccionados) {
        const servicioReservaData = {
          idServicioReserva: 0,
          idReserva: idReserva,
          idServicio: Number(servicio.idServicio),
          precio: Number(servicio.precioServicio),
          cantidad: diasParaServicios
        };
 
        const response = await fetch(API_URLS.SERVICIOS_RESERVA, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(servicioReservaData)
        });
 
        if (!response.ok) {
          console.warn(`⚠ No se pudo guardar el servicio ${servicio.nombreServicio}`);
        }
      }
      console.log("✅ Servicios extras guardados correctamente");
    } catch (error) {
      console.error("❌ Error al guardar servicios extras:", error);
    }
  };

  const validarFormulario = () => {
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

    const camposRequeridos = [
      'fechaEntrada', 'fechaSalida', 'idSede', 'idMetodoPago'
    ];

    for (const campo of camposRequeridos) {
      if (!formData[campo]) {
        const nombreCampo = campo.replace('id', '').replace(/([A-Z])/g, ' $1').trim();
        displayAlert(`❌ El campo ${nombreCampo} es obligatorio`, "error");
        return false;
      }
    }

    if (!formData.idCabana && !formData.idPaquete) {
      displayAlert("❌ Debes seleccionar al menos una cabaña o un paquete", "error");
      return false;
    }

    const hoy = new Date().toISOString().split('T')[0];
    if (formData.fechaEntrada < hoy) {
      displayAlert("❌ La fecha de entrada no puede ser anterior a hoy", "error");
      return false;
    }

    if (formData.fechaSalida <= formData.fechaEntrada) {
      displayAlert("❌ La fecha de salida debe ser posterior a la fecha de entrada", "error");
      return false;
    }

    if (formData.montoTotal <= 0) {
      displayAlert("❌ Debe seleccionar al menos una cabaña o paquete para calcular el monto total", "error");
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
    setShowCancelDialog(true);
  };

  const handleCancelConfirm = () => {
    setShowCancelDialog(false);
    navigate("/cliente/mis-reservas");
  };

  const handleCancelCancel = () => {
    setShowCancelDialog(false);
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const calcularDiasEstadia = () => {
    if (formData.fechaEntrada && formData.fechaSalida) {
      const entrada = new Date(formData.fechaEntrada);
      const salida = new Date(formData.fechaSalida);
     
      if (salida <= entrada) return 1;
     
      const diffTime = Math.abs(salida - entrada);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    }
    return 1;
  };

  const addDays = (dateStr, days) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    d.setDate(d.getDate() + Number(days));
    return d.toISOString().split('T')[0];
  };

  // Comprueba solapamiento de dos intervalos de fechas (formato YYYY-MM-DD)
  const isDateOverlap = (startA, endA, startB, endB) => {
    if (!startA || !endA || !startB || !endB) return false;
    const aStart = new Date(startA);
    const aEnd = new Date(endA);
    const bStart = new Date(startB);
    const bEnd = new Date(endB);
    if (isNaN(aStart) || isNaN(aEnd) || isNaN(bStart) || isNaN(bEnd)) return false;
    // Inclusivo: si un intervalo empieza el mismo día que otro termina, se considera conflicto
    return aStart <= bEnd && bStart <= aEnd;
  };

  // Obtener todas las reservas existentes desde la API (fallback a array vacío)
  const fetchReservasExistentes = async () => {
    try {
      const res = await fetch(API_URLS.RESERVAS);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : (data?.$values || []);
    } catch (err) {
      console.warn("No se pudieron cargar reservas para verificación:", err);
      return [];
    }
  };

  // Devuelve true si existe conflicto (misma cabaña y solapamiento de fechas)
  const hasConflictWithExisting = async (idCabana, fechaEntrada, fechaSalida) => {
    if (!idCabana || !fechaEntrada || !fechaSalida) return false;
    try {
      const reservasExistentes = await fetchReservasExistentes();
      return reservasExistentes.some(r => {
        // normalizar campos de reserva (puede variar según backend)
        const rCabana = r.idCabana ?? r.idCabana;
        if (!rCabana || Number(rCabana) !== Number(idCabana)) return false;
        // ignorar reservas canceladas (ajusta id si tu backend usa otro)
        if (Number(r.idEstado) === 3) return false;
        const rEntrada = r.fechaEntrada ?? r.fechaInicio ?? "";
        const rSalida = r.fechaReserva ?? r.fechaSalida ?? r.fechaFin ?? "";
        return isDateOverlap(fechaEntrada, fechaSalida, rEntrada, rSalida);
      });
    } catch (e) {
      console.warn("Error verificando conflictos:", e);
      return false;
    }
  };

  // Función para obtener características de cabaña
  const getCabanaFeatures = (cabana) => {
    const features = [];
    if (cabana.capacidad) features.push(`${cabana.capacidad} personas`);
    if (cabana.habitaciones) features.push(`${cabana.habitaciones} habitación${cabana.habitaciones > 1 ? 'es' : ''}`);
    if (cabana.banios || cabana.banos) features.push(`${cabana.banios ?? cabana.banos} baño${(cabana.banios ?? cabana.banos) > 1 ? 's' : ''}`);
    if (cabana.area) features.push(`${cabana.area} m²`);
    return features;
  };

  const paqueteSeleccionadoForm = apiData.paquetes.find(p => p.idPaquete === parseInt(formData.idPaquete));
  const fechaSalidaEsperada = (paqueteSeleccionadoForm && paqueteSeleccionadoForm.dias && formData.fechaEntrada)
    ? addDays(formData.fechaEntrada, paqueteSeleccionadoForm.dias)
    : "";

  const formatCurrency = (value) => {
    const n = Number(value ?? 0);
    try {
      return n.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
    } catch {
      return `COP ${n.toFixed(0)}`;
    }
  };

  return (
    <div style={{
      padding: "24px",
      backgroundColor: "#f5f8f2",
      minHeight: "100vh",
      width: "100%",
      boxSizing: "border-box",
      margin: 0,
      background: "linear-gradient(135deg, #f5f8f2 0%, #e8f0e8 100%)",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      overflowX: 'hidden',
      maxWidth: '100vw'
    }}>
     
      {/* Modal de abono MEJORADO */}
      <AbonoModal
        isOpen={showAbonoModal}
        onClose={() => setShowAbonoModal(false)}
        onSubmit={crearAbonoEnAPI}
        defaultMonto={abonoDefaultMonto}
        metodosPago={apiData.metodosPago}
        defaultMetodo={formData.idMetodoPago || (apiData.metodosPago[0]?.idMetodoPago ?? null)}
      />

      {/* Diálogo de cancelación premium */}
      <AlertDialog
        isOpen={showCancelDialog}
        title="¿Estás seguro de que quieres cancelar?"
        message="Se perderán todos los datos de tu reserva no confirmada."
        onConfirm={handleCancelConfirm}
        onCancel={handleCancelCancel}
        confirmText="Sí, cancelar"
        cancelText="Continuar reservando"
      />

      {/* Alerta */}
      {showAlert && (
        <div style={{
          ...alertStyle,
          backgroundColor: alertMessage.includes('❌') ? '#ffebee' : '#e8f5e8',
          color: alertMessage.includes('❌') ? '#c62828' : '#2E5939',
          borderLeftColor: alertMessage.includes('❌') ? '#e57373' : '#4caf50',
          overflow: 'hidden'
        }}>
          {alertMessage.includes('❌') ?
            <FaExclamationTriangle style={{ color: '#e57373', fontSize: "20px" }} /> :
            <FaCheck style={{ color: '#4caf50', fontSize: "20px" }} />
          }
          <span style={{ flex: 1 }}>{alertMessage}</span>
          <button
            onClick={() => setShowAlert(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              opacity: 0.7,
              padding: "3px",
              borderRadius: '50%',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'rgba(0,0,0,0.1)';
              e.target.style.opacity = '1';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.opacity = '0.7';
            }}
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Header Premium */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 32,
        flexWrap: 'wrap',
        gap: '20px',
        width: '100%',
        maxWidth: '100%'
      }}>
        <div style={{ maxWidth: '100%' }}>
          <h1 style={{
            margin: 0,
            color: "#2E5939",
            fontSize: "36px",
            fontWeight: "900",
            background: "linear-gradient(135deg, #2E5939 0%, #679750 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "10px",
            letterSpacing: "-0.3px",
            wordBreak: 'break-word'
          }}>
            🌲 Reserva tu Aventura en el Bosque
          </h1>
          <p style={{
            margin: "10px 0 0 0",
            color: "#679750",
            fontSize: "16px",
            fontWeight: "500",
            maxWidth: "550px",
            lineHeight: "1.5",
            wordBreak: "break-word"
          }}>
            Vive una experiencia única de glamping en medio de la naturaleza.
            Disfruta de lujo y comodidad en un entorno natural espectacular.
          </p>
        </div>
        <button
          onClick={handleCancel}
          style={{
            ...btnSecondaryStyle,
            display: 'flex',
            alignItems: 'center',
            gap: "10px",
            padding: "14px 28px",
            maxWidth: '200px'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#2E5939";
            e.target.style.color = "white";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 20px rgba(46, 89, 57, 0.25)";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#ffffff";
            e.target.style.color = "#2E5939";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          <FaTimes /> Cancelar
        </button>
      </div>

      {/* Layout principal con dos columnas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: '28px',
        alignItems: 'start',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden'
      }}>
       
        {/* Columna izquierda - Formulario */}
        <div style={{ width: '100%', maxWidth: '100%', minWidth: 0, overflow: 'hidden' }}>
          {/* Indicador de Progreso */}
          <StepIndicator
            currentStep={currentStep}
            totalSteps={steps.length}
            steps={steps}
          />

          {/* Formulario Premium */}
          <div style={cardStyle}>
            <div style={{ padding: "32px", width: '100%', boxSizing: 'border-box' }}>
              {loading && apiData.cabanas.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", width: '100%' }}>
                  <div style={{
                    width: '70px',
                    height: '70px',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #2E5939',
                    borderRadius: '50%',
                    animation: 'spin 1.2s linear infinite',
                    margin: '0 auto 20px'
                  }}></div>
                  <div style={{ fontSize: "20px", marginBottom: "10px", color: "#2E5939", fontWeight: "700", wordBreak: 'break-word' }}>
                    Cargando tu experiencia...
                  </div>
                  <div style={{ color: "#679750", fontSize: "15px", wordBreak: 'break-word' }}>
                    Preparando las mejores opciones para tu aventura en el bosque
                  </div>
                </div>
              ) : (
                <form onSubmit={onFormSubmit} onKeyDown={preventEnterSubmit} style={{ width: '100%' }}>
                  {/* Paso 1: Información Personal */}
                  {currentStep === 0 && (
                    <div style={{
                      backgroundColor: '#FBFDF9',
                      padding: "32px",
                      borderRadius: "18px",
                      marginBottom: "28px",
                      border: '2px solid rgba(103, 151, 80, 0.15)',
                      boxShadow: '0 6px 25px rgba(0,0,0,0.05)',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}>
                      <h3 style={{
                        color: '#2E5939',
                        marginBottom: "28px",
                        display: 'flex',
                        alignItems: 'center',
                        gap: "14px",
                        fontSize: "22px",
                        fontWeight: "800",
                        flexWrap: 'wrap'
                      }}>
                        <div style={{
                          backgroundColor: '#2E5939',
                          color: 'white',
                          width: '45px',
                          height: '45px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: "18px",
                          boxShadow: '0 6px 18px rgba(46, 89, 57, 0.25)',
                          flexShrink: 0
                        }}>
                          <FaUser />
                        </div>
                        Información Personal
                      </h3>
                     
                      {/* Banner informativo del usuario */}
                      {usuarioLogueado && (
                        <div style={{
                          backgroundColor: '#E8F5E8',
                          padding: "18px",
                          borderRadius: "14px",
                          border: '2px solid #2E5939',
                          marginBottom: "24px",
                          display: 'flex',
                          alignItems: 'center',
                          gap: "14px",
                          width: '100%',
                          boxSizing: 'border-box',
                          flexWrap: 'wrap'
                        }}>
                          <div style={{
                            width: '45px',
                            height: '45px',
                            borderRadius: '50%',
                            backgroundColor: '#2E5939',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: "18px",
                            flexShrink: 0
                          }}>
                            <FaUser />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4 style={{
                              margin: '0 0 6px 0',
                              color: '#2E5939',
                              fontSize: "16px",
                              fontWeight: "700",
                              wordBreak: 'break-word'
                            }}>
                              ¡Hola, {usuarioLogueado.nombre} {usuarioLogueado.apellido}!
                            </h4>
                            <p style={{
                              margin: 0,
                              color: '#679750',
                              fontSize: "13px",
                              lineHeight: "1.4",
                              wordBreak: 'break-word'
                            }}>
                              Tus datos han sido cargados automáticamente desde tu perfil. Puedes modificarlos si es necesario.
                            </p>
                          </div>
                        </div>
                      )}

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: "24px",
                        width: '100%'
                      }}>
                        <FormField
                          label="Nombre"
                          name="nombre"
                          type="text"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          required={true}
                          placeholder="Ingresa tu nombre"
                          icon={<FaUser />}
                          validation={(value) => ({
                            isValid: value.length >= 2,
                            message: "El nombre debe tener al menos 2 caracteres"
                          })}
                          style={{ width: '100%' }}
                        />
                        <FormField
                          label="Apellido"
                          name="apellido"
                          type="text"
                          value={formData.apellido}
                          onChange={handleInputChange}
                          required={true}
                          placeholder="Ingresa tu apellido"
                          icon={<FaUser />}
                          validation={(value) => ({
                            isValid: value.length >= 2,
                            message: "El apellido debe tener al menos 2 caracteres"
                          })}
                          style={{ width: '100%' }}
                        />
                        <FormField
                          label="Tipo de Documento"
                          name="tipoDocumento"
                          type="select"
                          value={formData.tipoDocumento}
                          onChange={handleInputChange}
                          options={[
                            { value: "Cédula de Ciudadanía", label: "Cédula de Ciudadanía" },
                            { value: "Cédula de Extranjería", label: "Cédula de Extranjería" },
                            { value: "Pasaporte", label: "Pasaporte" },
                            { value: "Tarjeta de Identidad", label: "Tarjeta de Identidad" }
                          ]}
                          required={true}
                          placeholder="Selecciona tu tipo de documento"
                          icon={<FaIdCard />}
                          style={{ width: '100%' }}
                        />
                        <FormField
                          label="Número de Documento"
                          name="numeroDocumento"
                          type="text"
                          value={formData.numeroDocumento}
                          onChange={handleInputChange}
                          required={true}
                          placeholder="Ingresa tu número de documento"
                          icon={<FaIdCard />}
                          validation={(value) => ({
                            isValid: value.length >= 5,
                            message: "El número de documento debe tener al menos 5 caracteres"
                          })}
                          style={{ width: '100%' }}
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
                          validation={(value) => ({
                            isValid: /\S+@\S+\.\S+/.test(value),
                            message: "Ingresa un email válido"
                          })}
                          style={{ width: '100%' }}
                        />
                        <FormField
                          label="Teléfono / Celular"
                          name="telefono"
                          type="tel"
                          value={formData.telefono}
                          onChange={handleInputChange}
                          required={true}
                          placeholder="+57 300 123 4567"
                          icon={<FaPhone />}
                          validation={(value) => ({
                            isValid: value.length >= 10,
                            message: "Ingresa un número de teléfono válido"
                          })}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Paso 2: Selección de Alojamiento - MODIFICADO PARA IMÁGENES */}
                  {currentStep === 1 && (
                    <div style={{
                      backgroundColor: '#FBFDF9',
                      padding: "32px",
                      borderRadius: "18px",
                      marginBottom: "28px",
                      border: '2px solid rgba(103, 151, 80, 0.15)',
                      boxShadow: '0 6px 25px rgba(0,0,0,0.05)',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}>
                      <h3 style={{
                        color: '#2E5939',
                        marginBottom: "28px",
                        display: 'flex',
                        alignItems: 'center',
                        gap: "14px",
                        fontSize: "22px",
                        fontWeight: "800",
                        flexWrap: 'wrap'
                      }}>
                        <div style={{
                          backgroundColor: '#2E5939',
                          color: 'white',
                          width: '45px',
                          height: '45px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: "18px",
                          boxShadow: '0 6px 18px rgba(46, 89, 57, 0.25)',
                          flexShrink: 0
                        }}>
                          <FaHome />
                        </div>
                        Elige tu Experiencia
                      </h3>

                      {/* Selector de Sede */}
                      <div style={{ marginBottom: "28px", width: '100%' }}>
                        <FormField
                          label="Ubicación"
                          name="idSede"
                          type="select"
                          value={formData.idSede}
                          onChange={handleInputChange}
                          options={apiData.sedes.map(s => ({
                            value: s.idSede,
                            label: `${s.nombreSede} - ${s.ubicacionSede}`
                          }))}
                          required={true}
                          icon={<FaMapMarkerAlt />}
                          style={{ width: '100%' }}
                        />
                      </div>

                      {/* Cabañas en formato de cards - Filtradas por sede */}
                      <div style={{ marginBottom: "28px", width: '100%' }}>
                        <h4 style={{
                          color: '#2E5939',
                          marginBottom: "20px",
                          fontSize: "18px",
                          fontWeight: "700",
                          wordBreak: 'break-word'
                        }}>
                          🏡 Selecciona tu Cabaña {formData.idSede && `(${filteredData.cabanas.length} disponibles)`}
                        </h4>
                       
                        {filteredData.cabanas.length === 0 ? (
                          <div style={{
                            textAlign: 'center',
                            padding: "32px",
                            backgroundColor: '#F9FBFA',
                            borderRadius: "14px",
                            border: '2px dashed #E8F0E8',
                            width: '100%',
                            boxSizing: 'border-box'
                          }}>
                            <FaHome style={{ fontSize: "42px", color: '#679750', marginBottom: "14px" }} />
                            <h4 style={{ color: '#2E5939', marginBottom: "6px", wordBreak: 'break-word' }}>No hay cabañas disponibles</h4>
                            <p style={{ color: '#679750', wordBreak: 'break-word' }}>Selecciona otra sede para ver las opciones disponibles.</p>
                          </div>
                        ) : (
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: "20px",
                            marginBottom: "28px",
                            width: '100%'
                          }}>
                            {filteredData.cabanas.map((cabana) => (
                              <SelectionCard
                                key={cabana.idCabana}
                                title={cabana.nombre}
                                description={cabana.descripcion || "Disfruta de una experiencia única en la naturaleza"}
                                price={formatCurrency(cabana.precio || 0)}
                                imageUrl={cabana.imagenes && cabana.imagenes.length > 0 ? cabana.imagenes[0] : FALLBACK_IMAGE}
                                isSelected={formData.idCabana === cabana.idCabana.toString()}
                                onSelect={() => handleSelectChange('idCabana', cabana.idCabana.toString())}
                                features={getCabanaFeatures(cabana)}
                                popular={cabana.precio > 300000}
                                capacity={cabana.capacidad || 2}
                                disabled={false}
                                type="cabin"
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Paquetes en formato de cards - Filtrados por sede */}
                      <div style={{ marginBottom: "28px", width: '100%' }}>
                        <h4 style={{
                          color: '#2E5939',
                          marginBottom: "20px",
                          fontSize: "18px",
                          fontWeight: "700",
                          wordBreak: 'break-word'
                        }}>
                          📦 Paquetes de Experiencia {formData.idSede && `(${filteredData.paquetes.length} disponibles)`}
                        </h4>
                       
                        {filteredData.paquetes.length === 0 ? (
                          <div style={{
                            textAlign: 'center',
                            padding: "32px",
                            backgroundColor: '#F9FBFA',
                            borderRadius: "14px",
                            border: '2px dashed #E8F0E8',
                            width: '100%',
                            boxSizing: 'border-box'
                          }}>
                            <FaBox style={{ fontSize: "42px", color: '#679750', marginBottom: "14px" }} />
                            <h4 style={{ color: '#2E5939', marginBottom: "6px", wordBreak: 'break-word' }}>No hay paquetes disponibles</h4>
                            <p style={{ color: '#679750', wordBreak: 'break-word' }}>Selecciona otra sede para ver los paquetes disponibles.</p>
                          </div>
                        ) : (
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: "20px",
                            width: '100%'
                          }}>
                            {filteredData.paquetes.map((paquete) => (
                              <SelectionCard
                                key={paquete.idPaquete}
                                title={paquete.nombrePaquete}
                                description={paquete.descripcion || `Incluye servicios especiales para ${paquete.personas} personas`}
                                price={formatCurrency(paquete.precioPaquete || 0)}
                                imageUrl={paquete.imagen || FALLBACK_IMAGE}
                                isSelected={formData.idPaquete === paquete.idPaquete.toString()}
                                onSelect={() => handleSelectChange('idPaquete', paquete.idPaquete.toString())}
                                features={[
                                  `Para ${paquete.personas} personas`,
                                  `${paquete.dias} días de experiencia`,
                                  paquete.descuento > 0 ? `${paquete.descuento}% de descuento` : 'Precio especial'
                                ]}
                                popular={paquete.descuento > 0}
                                capacity={paquete.personas}
                                disabled={false}
                                type="package"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Paso 3: Servicios Extras */}
                  {currentStep === 2 && (
                    <div style={{
                      backgroundColor: '#FBFDF9',
                      padding: "32px",
                      borderRadius: "18px",
                      marginBottom: "28px",
                      border: '2px solid rgba(103, 151, 80, 0.15)',
                      boxShadow: '0 6px 25px rgba(0,0,0,0.05)',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}>
                      <h3 style={{
                        color: '#2E5939',
                        marginBottom: "28px",
                        display: 'flex',
                        alignItems: 'center',
                        gap: "14px",
                        fontSize: "22px",
                        fontWeight: "800",
                        flexWrap: 'wrap'
                      }}>
                        <div style={{
                          backgroundColor: '#2E5939',
                          color: 'white',
                          width: '45px',
                          height: '45px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: "18px",
                          boxShadow: '0 6px 18px rgba(46, 89, 57, 0.25)',
                          flexShrink: 0
                        }}>
                          <FaPlus />
                        </div>
                        Servicios Extras
                      </h3>

                      <div style={{ marginBottom: "20px", width: '100%' }}>
                        <p style={{
                          color: '#679750',
                          fontSize: "15px",
                          lineHeight: "1.5",
                          marginBottom: "20px",
                          wordBreak: 'break-word'
                        }}>
                          Personaliza tu experiencia seleccionando servicios adicionales.
                          Estos se aplicarán por cada noche de tu estadía.
                        </p>
                      </div>

                      {filteredData.servicios.length === 0 ? (
                        <div style={{
                          textAlign: 'center',
                          padding: "32px",
                          backgroundColor: '#F9FBFA',
                          borderRadius: "14px",
                          border: '2px dashed #E8F0E8',
                          width: '100%',
                          boxSizing: 'border-box'
                        }}>
                          <FaBox style={{ fontSize: "42px", color: '#679750', marginBottom: "14px" }} />
                          <h4 style={{ color: '#2E5939', marginBottom: "6px", wordBreak: 'break-word' }}>No hay servicios disponibles</h4>
                          <p style={{ color: '#679750', wordBreak: 'break-word' }}>Selecciona otra sede para ver los servicios disponibles.</p>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: "14px", width: '100%' }}>
                          {filteredData.servicios.map((servicio) => {
                            const paqueteSeleccionado = apiData.paquetes.find(p => p.idPaquete === parseInt(formData.idPaquete));
                            const diasParaMostrar = paqueteSeleccionado && paqueteSeleccionado.dias ? Number(paqueteSeleccionado.dias) : calcularDiasEstadia();
                            return (
                              <ServicioExtraCard
                                key={servicio.idServicio}
                                servicio={servicio}
                                isSelected={serviciosSeleccionados.some(s => s.idServicio === servicio.idServicio)}
                                onToggle={toggleServicioExtra}
                                diasEstadia={diasParaMostrar}
                              />
                            );
                          })}
                        </div>
                      )}

                      {serviciosSeleccionados.length > 0 && (
                        <div style={{
                          marginTop: "28px",
                          padding: "18px",
                          backgroundColor: '#E8F5E8',
                          borderRadius: "14px",
                          border: '2px solid #2E5939',
                          width: '100%',
                          boxSizing: 'border-box'
                        }}>
                          <h5 style={{
                            color: '#2E5939',
                            marginBottom: "10px",
                            fontSize: "16px",
                            fontWeight: "700",
                            wordBreak: 'break-word'
                          }}>
                            🎁 Servicios Seleccionados:
                          </h5>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: "6px", width: '100%' }}>
                            {serviciosSeleccionados.map((servicio, index) => (
                              <div key={index} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: "10px",
                                backgroundColor: 'white',
                                borderRadius: "6px",
                                width: '100%',
                                boxSizing: 'border-box'
                              }}>
                                <span style={{ color: '#2E5939', fontWeight: "600", wordBreak: 'break-word' }}>
                                  {servicio.nombreServicio}
                                </span>
                                <span style={{ color: '#679750', fontWeight: "700", flexShrink: 0 }}>
                                  +{formatCurrency(servicio.precioServicio * calcularDiasEstadia())}
                                </span>
                              </div>
                            ))}
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: "10px",
                              paddingBottom: "10px",
                              borderBottom: '1px solid #E8F0E8',
                              width: '100%'
                            }}>
                              <span style={{ color: '#2E5939', fontSize: "13px", wordBreak: 'break-word' }}>Total servicios</span>
                              <span style={{ color: '#2E5939', fontWeight: "700", fontSize: "13px", flexShrink: 0 }}>
                                +{formatCurrency(serviciosSeleccionados.reduce((total, servicio) => total + (servicio.precioServicio * calcularDiasEstadia()), 0))}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Paso 4: Fechas y Huéspedes */}
                  {currentStep === 3 && (
                    <div style={{
                      backgroundColor: '#FBFDF9',
                      padding: "32px",
                      borderRadius: "18px",
                      marginBottom: "28px",
                      border: '2px solid rgba(103, 151, 80, 0.15)',
                      boxShadow: '0 6px 25px rgba(0,0,0,0.05)',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}>
                      <h3 style={{
                        color: '#2E5939',
                        marginBottom: "28px",
                        display: 'flex',
                        alignItems: 'center',
                        gap: "14px",
                        fontSize: "22px",
                        fontWeight: "800",
                        flexWrap: 'wrap'
                      }}>
                        <div style={{
                          backgroundColor: '#2E5939',
                          color: 'white',
                          width: '45px',
                          height: '45px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: "18px",
                          boxShadow: '0 6px 18px rgba(46, 89, 57, 0.25)',
                          flexShrink: 0
                        }}>
                          <FaCalendarAlt />
                        </div>
                        Fechas de tu Estadía
                      </h3>
                     
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: "24px",
                        width: '100%'
                      }}>
                        <FormField
                          label="Fecha de Llegada (Check-in)"
                          name="fechaEntrada"
                          type="date"
                          value={formData.fechaEntrada}
                          onChange={handleInputChange}
                          required={true}
                          inputProps={{
                            min: new Date().toISOString().split('T')[0],
                            onFocus: (e) => e.target.showPicker?.()
                          }}
                          icon={<FaCalendarAlt />}
                          style={{ width: '100%' }}
                        />
                       
                        <FormField
                          label="Fecha de Salida (Check-out)"
                          name="fechaSalida"
                          type="date"
                          value={formData.fechaSalida}
                          onChange={handleInputChange}
                          required={true}
                          inputProps={{
                            min: formData.fechaEntrada
                              ? addDays(formData.fechaEntrada, 1)
                              : new Date().toISOString().split('T')[0],
                            readOnly: !!(paqueteSeleccionadoForm && paqueteSeleccionadoForm.dias),
                            disabled: !!(paqueteSeleccionadoForm && paqueteSeleccionadoForm.dias),
                            onFocus: (e) => e.target.showPicker?.()
                          }}
                          icon={<FaCalendarAlt />}
                          style={{ width: '100%' }}
                        />
                      </div>
                     
                      {/* Información sobre paquetes */}
                      {paqueteSeleccionadoForm && paqueteSeleccionadoForm.dias && (
                        <div style={{
                          marginTop: "20px",
                          padding: "16px",
                          backgroundColor: '#FFF3E0',
                          borderRadius: "12px",
                          border: '2px solid #FFA000',
                          width: '100%',
                          boxSizing: 'border-box'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: "10px",
                            marginBottom: "8px",
                            flexWrap: 'wrap'
                          }}>
                            <FaInfoCircle style={{ color: '#FFA000', fontSize: "18px", flexShrink: 0 }} />
                            <h5 style={{
                              margin: 0,
                              color: '#FFA000',
                              fontSize: "15px",
                              fontWeight: "700",
                              wordBreak: 'break-word'
                            }}>
                              Información del Paquete
                            </h5>
                          </div>
                          <p style={{
                            margin: 0,
                            color: '#2E5939',
                            fontSize: "14px",
                            lineHeight: "1.4",
                            wordBreak: 'break-word'
                          }}>
                            Tu paquete <strong>"{paqueteSeleccionadoForm.nombrePaquete}"</strong> incluye <strong>{paqueteSeleccionadoForm.dias} noche(s)</strong> de estadía.
                            {formData.fechaEntrada && (
                              <span> La fecha de salida se ha establecido automáticamente para el <strong>{fechaSalidaEsperada}</strong>.</span>
                            )}
                          </p>
                        </div>
                      )}

                      {formData.fechaEntrada && formData.fechaSalida && (
                        <div style={{
                          marginTop: "24px",
                          padding: "20px",
                          backgroundColor: '#E8F5E8',
                          borderRadius: "14px",
                          textAlign: 'center',
                          border: '3px solid #2E5939',
                          boxShadow: '0 6px 20px rgba(46, 89, 57, 0.12)',
                          width: '100%',
                          boxSizing: 'border-box'
                        }}>
                          <strong style={{ color: '#2E5939', fontSize: "18px", display: 'block', marginBottom: "6px", wordBreak: 'break-word' }}>
                            🗓️ ¡Perfecto! Tu estadía será de {calcularDiasEstadia()} {calcularDiasEstadia() === 1 ? 'noche' : 'noches'}
                          </strong>
                          <span style={{ color: '#679750', fontSize: "14px", wordBreak: 'break-word' }}>
                            Del {formData.fechaEntrada} al {formData.fechaSalida}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Paso 5: Confirmación y Pago */}
                  {currentStep === 4 && (
                    <div style={{
                      backgroundColor: '#FBFDF9',
                      padding: "32px",
                      borderRadius: "18px",
                      marginBottom: "28px",
                      border: '2px solid rgba(103, 151, 80, 0.15)',
                      boxShadow: '0 6px 25px rgba(0,0,0,0.05)',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}>
                      <h3 style={{
                        color: '#2E5939',
                        marginBottom: "28px",
                        display: 'flex',
                        alignItems: 'center',
                        gap: "14px",
                        fontSize: "22px",
                        fontWeight: "800",
                        flexWrap: 'wrap'
                      }}>
                        <div style={{
                          backgroundColor: '#2E5939',
                          color: 'white',
                          width: '45px',
                          height: '45px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: "18px",
                          boxShadow: '0 6px 18px rgba(46, 89, 57, 0.25)',
                          flexShrink: 0
                        }}>
                          <FaCreditCard />
                        </div>
                        Confirmación y Pago
                      </h3>

                      {/* Método de Pago */}
                      <div style={{ marginBottom: "28px", width: '100%' }}>
                        <FormField
                          label="Método de Pago"
                          name="idMetodoPago"
                          type="select"
                          value={formData.idMetodoPago}
                          onChange={handleInputChange}
                          options={apiData.metodosPago.map(m => ({ value: m.idMetodoPago, label: m.nombreMetodoPago }))}
                          required={true}
                          icon={<FaCreditCard />}
                          style={{ width: '100%' }}
                        />
                      </div>

                      {/* Observaciones */}
                      <div style={{ marginBottom: "28px", width: '100%' }}>
                        <FormField
                          label="Observaciones Especiales"
                          name="observaciones"
                          type="textarea"
                          value={formData.observaciones}
                          onChange={handleInputChange}
                          placeholder="Alergias alimenticias, necesidades especiales, celebración especial, preferencias dietarias, etc."
                          style={{ width: '100%' }}
                        />
                      </div>

                      {/* Detalles del cálculo */}
                      {formData.montoTotal > 0 && (
                        <div style={{
                          padding: "20px",
                          backgroundColor: '#f8f9fa',
                          borderRadius: "14px",
                          fontSize: "14px",
                          color: '#2E5939',
                          border: '2px solid #E8F0E8',
                          marginBottom: "20px",
                          width: '100%',
                          boxSizing: 'border-box'
                        }}>
                          <div style={{ fontWeight: "800", marginBottom: "14px", fontSize: "15px", display: 'flex', alignItems: 'center', gap: "8px", flexWrap: 'wrap' }}>
                            <FaClock /> Detalles de tu Reserva
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: "10px", width: '100%' }}>
                            <div style={{ wordBreak: 'break-word' }}>• Días de estadía: <strong>{calcularDiasEstadia()}</strong></div>
                            {serviciosSeleccionados.length > 0 && (
                              <div style={{ wordBreak: 'break-word' }}>• Servicios extras: <strong>+{formatCurrency(serviciosSeleccionados.reduce((total, servicio) => total + (servicio.precioServicio * calcularDiasEstadia()), 0))}</strong></div>
                            )}
                            <div style={{ wordBreak: 'break-word' }}>• Abono requerido (50%): <strong>{formatCurrency(formData.abono)}</strong></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Navegación entre pasos */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "40px",
                    paddingTop: "28px",
                    borderTop: '3px solid #f0f0f0',
                    width: '100%',
                    flexWrap: 'wrap',
                    gap: '15px'
                  }}>
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      style={{
                        ...btnSecondaryStyle,
                        display: 'flex',
                        alignItems: 'center',
                        gap: "10px",
                        opacity: currentStep === 0 ? 0.5 : 1,
                        cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                        minWidth: 'auto',
                        flex: 1,
                        maxWidth: '200px'
                      }}
                      onMouseOver={(e) => {
                        if (currentStep !== 0) {
                          e.target.style.backgroundColor = "#2E5939";
                          e.target.style.color = "white";
                          e.target.style.transform = "translateY(-2px)";
                        }
                      }}
                      onMouseOut={(e) => {
                        if (currentStep !== 0) {
                          e.target.style.backgroundColor = "#ffffff";
                          e.target.style.color = "#2E5939";
                          e.target.style.transform = "translateY(0)";
                        }
                      }}
                    >
                      <FaArrowLeft /> Anterior
                    </button>

                    {currentStep < steps.length - 1 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        style={{
                          ...btnPrimaryStyle,
                          display: 'flex',
                          alignItems: 'center',
                          gap: "10px",
                          minWidth: 'auto',
                          flex: 1,
                          maxWidth: '200px'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = "#1e4629";
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = "0 12px 30px rgba(46, 89, 57, 0.35)";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = "#2E5939";
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "0 8px 25px rgba(46, 89, 57, 0.3)";
                        }}
                      >
                        Siguiente <FaArrowRight />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={loading}
                        style={{
                          ...btnPrimaryStyle,
                          backgroundColor: loading ? "#ccc" : "#2E5939",
                          cursor: loading ? "not-allowed" : "pointer",
                          opacity: loading ? 0.7 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: "10px",
                          minWidth: 'auto',
                          flex: 1,
                          maxWidth: '200px'
                        }}
                        onMouseOver={(e) => {
                          if (!loading) {
                            e.target.style.backgroundColor = "#1e4629";
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 12px 30px rgba(46, 89, 57, 0.35)";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!loading) {
                            e.target.style.backgroundColor = "#2E5939";
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 8px 25px rgba(46, 89, 57, 0.3)";
                          }
                        }}
                      >
                        {loading ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: "10px" }}>
                            <div style={{
                              width: '18px',
                              height: '18px',
                              border: '2px solid transparent',
                              borderTop: '2px solid white',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite'
                            }}></div>
                            Creando tu Reserva...
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: "10px" }}>
                            <FaCheck />
                            Confirmar Reserva
                          </div>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Columna derecha - Resumen de la reserva */}
        <div style={{ width: '100%', maxWidth: '340px', minWidth: 0, overflow: 'hidden' }}>
          <ResumenReserva
            formData={formData}
            calcularDiasEstadia={calcularDiasEstadia}
            formatCurrency={formatCurrency}
            datosRelacionados={apiData}
            serviciosSeleccionados={serviciosSeleccionados}
          />
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

          /* Responsive */
          @media (max-width: 1200px) {
            .main-layout {
              grid-template-columns: 1fr !important;
            }
           
            .resumen-columna {
              order: -1;
              margin-bottom: 24px;
              max-width: 100% !important;
            }
          }

          @media (max-width: 768px) {
            .main-container {
              padding: 16px !important;
            }
           
            .form-section {
              padding: 24px !important;
            }
           
            .header-content {
              flex-direction: column;
              text-align: center;
              gap: 16px;
            }
           
            .step-indicator {
              padding: 0 10px !important;
            }
           
            .step-icon {
              width: 40px !important;
              height: 40px !important;
              font-size: 16px !important;
            }
           
            .step-label {
              font-size: 12px !important;
            }
           
            .selection-cards-grid {
              grid-template-columns: 1fr !important;
            }
           
            .abono-modal-grid {
              grid-template-columns: 1fr !important;
            }
           
            .resumen-reserva {
              position: static !important;
              min-width: auto !important;
              margin-bottom: 24px;
              max-width: 100% !important;
            }
          }
        `}
      </style>
    </div>
  );
}
