import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaCalendarAlt, FaHome, FaMapMarkerAlt, FaMoneyBillAlt, FaBox, 
  FaCreditCard, FaTimes, FaCheck, FaExclamationTriangle, FaUser,
  FaPhone, FaEnvelope, FaUsers, FaStar, FaArrowRight, FaArrowLeft,
  FaClock, FaShieldAlt, FaSmile, FaMountain, FaUmbrellaBeach, FaLeaf,
  FaHeart, FaCouch, FaUtensils, FaWifi, FaCar, FaSnowflake,
  FaFire, FaShower, FaTree, FaSun, FaMoon, FaPlus, FaMinus
} from "react-icons/fa";

// ===============================================
// ESTILOS PREMIUM
// ===============================================
const cardStyle = {
  backgroundColor: '#fff',
  borderRadius: '24px',
  boxShadow: '0 20px 60px rgba(46, 89, 57, 0.15)',
  overflow: 'hidden',
  border: '1px solid rgba(103, 151, 80, 0.2)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
};

const inputStyle = {
  width: "100%",
  padding: "18px 20px",
  border: "2px solid #E8F0E8",
  borderRadius: "16px",
  backgroundColor: "#F9FBFA",
  color: "#2E5939",
  boxSizing: 'border-box',
  boxShadow: "0 4px 15px rgba(46, 89, 57, 0.08)",
  fontSize: "16px",
  transition: "all 0.3s ease",
  fontFamily: 'inherit',
  fontWeight: '500'
};

const inputFocusStyle = {
  outline: "none",
  borderColor: "#2E5939",
  boxShadow: "0 0 0 4px rgba(46, 89, 57, 0.15)",
  backgroundColor: "#FFFFFF",
  transform: "translateY(-2px)"
};

const labelStyle = {
  display: "block",
  fontWeight: "700",
  marginBottom: "12px",
  color: "#2E5939",
  fontSize: "15px",
  letterSpacing: "0.5px"
};

const alertStyle = {
  position: 'fixed',
  top: "24px",
  right: "24px",
  padding: '20px 24px',
  borderRadius: '16px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
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
  animation: 'slideInRight 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
};

const btnPrimaryStyle = {
  backgroundColor: "#2E5939",
  color: "white",
  padding: "20px 40px",
  border: "none",
  borderRadius: "16px",
  cursor: "pointer",
  fontWeight: "700",
  boxShadow: "0 12px 30px rgba(46, 89, 57, 0.4)",
  transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  fontSize: "16px",
  minWidth: '200px',
  letterSpacing: '0.5px',
  textTransform: 'uppercase'
};

const btnSecondaryStyle = {
  backgroundColor: "#ffffff",
  color: "#2E5939",
  padding: "20px 36px",
  border: "2px solid #2E5939",
  borderRadius: "16px",
  cursor: "pointer",
  fontWeight: "700",
  transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  minWidth: '160px',
  fontSize: "15px",
  letterSpacing: '0.5px'
};

// ===============================================
// URLs DE LA API
// ===============================================
const API_BASE_URL = "http://localhost:5272/api";
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
  SEDES_POR_SERVICIO: `${API_BASE_URL}/SedesPorServicio`
};

// ===============================================
// COMPONENTE DE RECIBO/RESUMEN (IZQUIERDA)
// ===============================================
const ResumenReserva = ({ formData, calcularDiasEstadia, formatCurrency, datosRelacionados, serviciosSeleccionados = [] }) => {
  const cabanaSeleccionada = datosRelacionados.cabanas.find(c => c.idCabana === parseInt(formData.idCabana));
  const paqueteSeleccionado = datosRelacionados.paquetes.find(p => p.idPaquete === parseInt(formData.idPaquete));
  const sedeSeleccionada = datosRelacionados.sedes.find(s => s.idSede === parseInt(formData.idSede));
  
  // Calcular total de servicios extras
  const totalServiciosExtras = serviciosSeleccionados.reduce((total, servicio) => 
    total + (servicio.precioServicio * calcularDiasEstadia()), 0
  );

  const totalGeneral = formData.montoTotal + totalServiciosExtras;
  const abonoInicial = totalGeneral * 0.5;
  const saldoRestante = totalGeneral - abonoInicial;

  return (
    <div style={{
      position: 'sticky',
      top: '24px',
      backgroundColor: '#fff',
      borderRadius: '20px',
      padding: '28px',
      boxShadow: '0 20px 60px rgba(46, 89, 57, 0.15)',
      border: '1px solid rgba(103, 151, 80, 0.2)',
      height: 'fit-content',
      minWidth: '380px'
    }}>
      {/* Header del recibo */}
      <div style={{
        textAlign: 'center',
        marginBottom: '24px',
        paddingBottom: '20px',
        borderBottom: '2px solid #E8F0E8'
      }}>
        <h3 style={{
          margin: '0 0 8px 0',
          color: '#2E5939',
          fontSize: '20px',
          fontWeight: '800'
        }}>
          Resumen de tu Reserva
        </h3>
        <p style={{
          margin: 0,
          color: '#679750',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          Detalles y costos de tu experiencia
        </p>
      </div>

      {/* Información de fechas */}
      {formData.fechaEntrada && formData.fechaSalida && (
        <div style={{
          backgroundColor: '#F9FBFA',
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '20px',
          border: '1px solid #E8F0E8'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ color: '#2E5939', fontWeight: '600', fontSize: '14px' }}>
              {formData.fechaEntrada} → {formData.fechaSalida}
            </span>
            <span style={{
              backgroundColor: '#2E5939',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '700'
            }}>
              {calcularDiasEstadia()} noche{calcularDiasEstadia() !== 1 ? 's' : ''}
            </span>
          </div>
          <div style={{ color: '#679750', fontSize: '13px', fontWeight: '500' }}>
            {formData.numeroPersonas} huésped{formData.numeroPersonas !== 1 ? 'es' : ''}
          </div>
        </div>
      )}

      {/* Alojamiento seleccionado */}
      {(cabanaSeleccionada || paqueteSeleccionado) && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{
            margin: '0 0 12px 0',
            color: '#2E5939',
            fontSize: '16px',
            fontWeight: '700'
          }}>
            Alojamiento
          </h4>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '16px',
            backgroundColor: '#F9FBFA',
            borderRadius: '12px',
            border: '1px solid #E8F0E8'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '10px',
              backgroundColor: '#2E5939',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px',
              flexShrink: 0
            }}>
              {cabanaSeleccionada ? <FaHome /> : <FaStar />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontWeight: '700',
                color: '#2E5939',
                fontSize: '15px',
                marginBottom: '4px'
              }}>
                {cabanaSeleccionada ? cabanaSeleccionada.nombre : paqueteSeleccionado.nombrePaquete}
              </div>
              <div style={{
                color: '#679750',
                fontSize: '13px',
                lineHeight: '1.4'
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
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{
            margin: '0 0 12px 0',
            color: '#2E5939',
            fontSize: '16px',
            fontWeight: '700'
          }}>
            Ubicación
          </h4>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px',
            backgroundColor: '#F9FBFA',
            borderRadius: '12px',
            border: '1px solid #E8F0E8'
          }}>
            <FaMapMarkerAlt style={{ color: '#2E5939', fontSize: '18px', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: '600', color: '#2E5939', fontSize: '14px' }}>
                {sedeSeleccionada.nombreSede}
              </div>
              <div style={{ color: '#679750', fontSize: '13px' }}>
                {sedeSeleccionada.ubicacionSede}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desglose de costos */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{
          margin: '0 0 16px 0',
          color: '#2E5939',
          fontSize: '16px',
          fontWeight: '700'
        }}>
          Desglose de Costos
        </h4>

        {/* Subtotal alojamiento */}
        {formData.montoTotal > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            paddingBottom: '12px',
            borderBottom: '1px solid #E8F0E8'
          }}>
            <span style={{ color: '#2E5939', fontSize: '14px' }}>Subtotal alojamiento</span>
            <span style={{ color: '#2E5939', fontWeight: '700', fontSize: '14px' }}>
              {formatCurrency(formData.montoTotal)}
            </span>
          </div>
        )}

        {/* Servicios extras */}
        {serviciosSeleccionados.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            {serviciosSeleccionados.map((servicio, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{ color: '#679750', fontSize: '13px' }}>
                  + {servicio.nombreServicio}
                </span>
                <span style={{ color: '#679750', fontWeight: '600', fontSize: '13px' }}>
                  {formatCurrency(servicio.precioServicio * calcularDiasEstadia())}
                </span>
              </div>
            ))}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
              paddingBottom: '12px',
              borderBottom: '1px solid #E8F0E8'
            }}>
              <span style={{ color: '#2E5939', fontSize: '14px' }}>Total servicios</span>
              <span style={{ color: '#2E5939', fontWeight: '700', fontSize: '14px' }}>
                +{formatCurrency(totalServiciosExtras)}
              </span>
            </div>
          </div>
        )}

        {/* Impuestos y tasas */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          paddingBottom: '16px',
          borderBottom: '2px solid #E8F0E8'
        }}>
          <span style={{ color: '#2E5939', fontSize: '14px' }}>Impuestos y tasas</span>
          <span style={{ color: '#2E5939', fontWeight: '700', fontSize: '14px' }}>
            {formatCurrency(totalGeneral * 0.19)} {/* 19% de impuestos */}
          </span>
        </div>

        {/* Total general */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          padding: '16px',
          backgroundColor: '#2E5939',
          borderRadius: '12px',
          color: 'white'
        }}>
          <span style={{ fontWeight: '700', fontSize: '16px' }}>TOTAL</span>
          <span style={{ fontWeight: '900', fontSize: '20px' }}>
            {formatCurrency(totalGeneral + (totalGeneral * 0.19))}
          </span>
        </div>

        {/* Información de pago */}
        <div style={{
          padding: '16px',
          backgroundColor: '#FFF3E0',
          borderRadius: '12px',
          border: '2px solid #FFA000'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ color: '#FFA000', fontWeight: '600', fontSize: '14px' }}>
              Depósito inicial (50%)
            </span>
            <span style={{ color: '#FFA000', fontWeight: '800', fontSize: '15px' }}>
              {formatCurrency(abonoInicial)}
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ color: '#FFA000', fontWeight: '600', fontSize: '14px' }}>
              Saldo restante
            </span>
            <span style={{ color: '#FFA000', fontWeight: '800', fontSize: '15px' }}>
              {formatCurrency(saldoRestante)}
            </span>
          </div>
          <div style={{
            marginTop: '8px',
            padding: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <span style={{ color: '#FFA000', fontSize: '12px', fontWeight: '600' }}>
              💳 Pago seguro online
            </span>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div style={{
        padding: '16px',
        backgroundColor: '#E8F5E8',
        borderRadius: '12px',
        border: '2px solid #2E5939'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '8px'
        }}>
          <FaShieldAlt style={{ color: '#2E5939' }} />
          <span style={{ color: '#2E5939', fontWeight: '700', fontSize: '14px' }}>
            Reserva Protegida
          </span>
        </div>
        <p style={{
          margin: 0,
          color: '#679750',
          fontSize: '12px',
          lineHeight: '1.4'
        }}>
          Tu reserva está 100% protegida. Cancelación gratuita hasta 48 horas antes del check-in.
        </p>
      </div>
    </div>
  );
};

// ===============================================
// COMPONENTES INTERACTIVOS (se mantienen igual)
// ===============================================

// Componente de progreso con pasos
const StepIndicator = ({ currentStep, totalSteps, steps }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '50px',
    position: 'relative',
    padding: '0 30px'
  }}>
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '0',
      right: '0',
      height: '6px',
      backgroundColor: '#E8F0E8',
      transform: 'translateY(-50%)',
      zIndex: 1,
      borderRadius: '3px'
    }}></div>
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '0',
      height: '6px',
      backgroundColor: '#2E5939',
      transform: 'translateY(-50%)',
      zIndex: 2,
      width: `${(currentStep / (totalSteps - 1)) * 100}%`,
      transition: 'width 0.5s ease',
      borderRadius: '3px'
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
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: index <= currentStep ? '#2E5939' : '#E8F0E8',
          color: index <= currentStep ? 'white' : '#679750',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '700',
          fontSize: '20px',
          boxShadow: index <= currentStep ? '0 12px 25px rgba(46, 89, 57, 0.3)' : '0 4px 15px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          border: index === currentStep ? '4px solid #2E5939' : 'none'
        }}>
          {index < currentStep ? <FaCheck /> : step.icon}
        </div>
        <span style={{
          marginTop: '12px',
          fontSize: '14px',
          fontWeight: '700',
          color: index <= currentStep ? '#2E5939' : '#679750',
          textAlign: 'center'
        }}>
          {step.label}
        </span>
      </div>
    ))}
  </div>
);

// Componente de tarjeta de selección premium
const SelectionCard = ({ 
  title, 
  description, 
  price, 
  image, 
  isSelected, 
  onSelect, 
  features = [],
  popular = false,
  capacity = 2,
  disabled = false
}) => (
  <div 
    onClick={disabled ? null : onSelect}
    style={{
      border: isSelected ? '3px solid #2E5939' : '2px solid #E8F0E8',
      borderRadius: '20px',
      padding: '28px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      backgroundColor: disabled ? '#f5f5f5' : (isSelected ? '#F9FBFA' : 'white'),
      position: 'relative',
      transform: isSelected ? 'translateY(-8px) scale(1.02)' : 'translateY(0)',
      boxShadow: isSelected ? '0 25px 50px rgba(46, 89, 57, 0.2)' : '0 8px 30px rgba(0,0,0,0.1)',
      opacity: disabled ? 0.6 : 1
    }}
    onMouseEnter={(e) => {
      if (!isSelected && !disabled) {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
      }
    }}
    onMouseLeave={(e) => {
      if (!isSelected && !disabled) {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)';
      }
    }}
  >
    {popular && (
      <div style={{
        position: 'absolute',
        top: '-12px',
        right: '20px',
        backgroundColor: '#FFA000',
        color: 'white',
        padding: '8px 20px',
        borderRadius: '25px',
        fontSize: '12px',
        fontWeight: '800',
        textTransform: 'uppercase',
        boxShadow: '0 4px 15px rgba(255, 160, 0, 0.3)'
      }}>
        ⭐ Más Popular
      </div>
    )}
    
    {disabled && (
      <div style={{
        position: 'absolute',
        top: '-12px',
        left: '20px',
        backgroundColor: '#f44336',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '25px',
        fontSize: '12px',
        fontWeight: '800',
        textTransform: 'uppercase',
        boxShadow: '0 4px 15px rgba(244, 67, 54, 0.3)',
        zIndex: 2
      }}>
        No Disponible
      </div>
    )}
    
    <div style={{
      width: '100%',
      height: '140px',
      borderRadius: '16px',
      marginBottom: '20px',
      background: disabled 
        ? 'linear-gradient(135deg, #cccccc 0%, #999999 100%)' 
        : 'linear-gradient(135deg, #2E5939 0%, #679750 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '54px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {image}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        right: '12px',
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '700',
        backdropFilter: 'blur(10px)'
      }}>
        {capacity} personas
      </div>
    </div>
    
    <h4 style={{
      margin: '0 0 12px 0',
      color: disabled ? '#999' : '#2E5939',
      fontSize: '20px',
      fontWeight: '800'
    }}>
      {title}
    </h4>
    
    <p style={{
      margin: '0 0 20px 0',
      color: disabled ? '#bbb' : '#679750',
      fontSize: '15px',
      lineHeight: '1.6'
    }}>
      {description}
    </p>
    
    {features.length > 0 && (
      <div style={{ marginBottom: '20px' }}>
        {features.map((feature, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '8px',
            fontSize: '14px',
            color: disabled ? '#bbb' : '#2E5939',
            fontWeight: '500'
          }}>
            <FaCheck style={{ color: disabled ? '#bbb' : '#4CAF50', fontSize: '14px' }} />
            {feature}
          </div>
        ))}
      </div>
    )}
    
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span style={{
        fontSize: '24px',
        fontWeight: '900',
        color: disabled ? '#999' : '#2E5939'
      }}>
        {price}
      </span>
      <div style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        border: `3px solid ${disabled ? '#ccc' : '#2E5939'}`,
        backgroundColor: isSelected ? '#2E5939' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease'
      }}>
        {isSelected && <FaCheck style={{ color: 'white', fontSize: '14px' }} />}
      </div>
    </div>
  </div>
);

// Componente de servicio extra
const ServicioExtraCard = ({ 
  servicio, 
  isSelected, 
  onToggle,
  diasEstadia = 1
}) => {
  const precioTotal = servicio.precioServicio * diasEstadia;

  return (
    <div 
      onClick={() => onToggle(servicio)}
      style={{
        border: isSelected ? '3px solid #2E5939' : '2px solid #E8F0E8',
        borderRadius: '16px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backgroundColor: isSelected ? '#F9FBFA' : 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
        }
      }}
    >
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '6px',
        border: '2px solid #2E5939',
        backgroundColor: isSelected ? '#2E5939' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {isSelected && <FaCheck style={{ color: 'white', fontSize: '12px' }} />}
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <h5 style={{
            margin: 0,
            color: '#2E5939',
            fontSize: '16px',
            fontWeight: '700'
          }}>
            {servicio.nombreServicio}
          </h5>
          <span style={{
            color: '#2E5939',
            fontWeight: '800',
            fontSize: '16px'
          }}>
            ${servicio.precioServicio.toLocaleString()} / noche
          </span>
        </div>
        <p style={{
          margin: 0,
          color: '#679750',
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          {servicio.descripcion}
        </p>
        {diasEstadia > 1 && (
          <div style={{
            marginTop: '8px',
            fontSize: '13px',
            color: '#FFA000',
            fontWeight: '600'
          }}>
            Total por {diasEstadia} noches: ${precioTotal.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

// Diálogo de cancelación premium
const AlertDialog = ({ 
  isOpen, 
  title = "¿Estás seguro de que quieres cancelar?", 
  message = "Se perderán los datos no guardados.", 
  onConfirm, 
  onCancel,
  confirmText = "Sí, cancelar",
  cancelText = "Continuar"
}) => {
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
      padding: '20px',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        padding: '36px',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.4)',
        maxWidth: '480px',
        width: '100%',
        border: '1px solid #e0e0e0',
        animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#fff3cd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '3px solid #ffc107',
          margin: '0 auto 20px'
        }}>
          <FaExclamationTriangle style={{ 
            color: '#856404', 
            fontSize: '32px' 
          }} />
        </div>

        <h3 style={{
          margin: '0 0 16px 0',
          color: '#2E5939',
          fontSize: '22px',
          fontWeight: '800'
        }}>
          {title}
        </h3>

        <p style={{
          margin: '0 0 32px 0',
          color: '#666',
          fontSize: '16px',
          lineHeight: '1.6'
        }}>
          {message}
        </p>

        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center'
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '16px 32px',
              border: '2px solid #2E5939',
              backgroundColor: 'white',
              color: '#2E5939',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '15px',
              minWidth: '140px',
              transition: 'all 0.3s ease'
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
              padding: '16px 32px',
              border: 'none',
              backgroundColor: '#2E5939',
              color: 'white',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '15px',
              minWidth: '140px',
              transition: 'all 0.3s ease',
              boxShadow: '0 6px 20px rgba(46, 89, 57, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#1e4629';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(46, 89, 57, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#2E5939';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 6px 20px rgba(46, 89, 57, 0.3)';
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente FormField mejorado
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
  validation = null
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
    <div style={{ marginBottom: '24px', ...style }}>
      <label style={labelStyle}>
        {icon && <span style={{ marginRight: '12px', color: '#679750' }}>{icon}</span>}
        {label}
        {required && <span style={{ color: "#e57373", marginLeft: '6px' }}>*</span>}
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
            backgroundPosition: 'right 20px center',
            backgroundSize: '20px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            borderColor: !isValid ? '#e57373' : '#E8F0E8'
          }}
          onFocus={(e) => !disabled && Object.assign(e.target.style, { ...inputFocusStyle, borderColor: !isValid ? '#e57373' : '#2E5939' })}
          onBlur={(e) => {
            e.target.style.outline = "none";
            e.target.style.borderColor = !isValid ? '#e57373' : "#E8F0E8";
            e.target.style.boxShadow = "0 4px 15px rgba(46, 89, 57, 0.08)";
            e.target.style.transform = "translateY(0)";
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
          onChange={handleChange}
          placeholder={placeholder}
          style={{
            ...inputStyle,
            minHeight: '120px',
            resize: 'vertical',
            fontFamily: 'inherit',
            borderColor: !isValid ? '#e57373' : '#E8F0E8'
          }}
          onFocus={(e) => Object.assign(e.target.style, { ...inputFocusStyle, borderColor: !isValid ? '#e57373' : '#2E5939' })}
          onBlur={(e) => {
            e.target.style.outline = "none";
            e.target.style.borderColor = !isValid ? '#e57373' : "#E8F0E8";
            e.target.style.boxShadow = "0 4px 15px rgba(46, 89, 57, 0.08)";
            e.target.style.transform = "translateY(0)";
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
          onChange={handleChange}
          placeholder={placeholder}
          style={{
            ...inputStyle,
            borderColor: !isValid ? '#e57373' : '#E8F0E8'
          }}
          onFocus={(e) => Object.assign(e.target.style, { ...inputFocusStyle, borderColor: !isValid ? '#e57373' : '#2E5939' })}
          onBlur={(e) => {
            e.target.style.outline = "none";
            e.target.style.borderColor = !isValid ? '#e57373' : "#E8F0E8";
            e.target.style.boxShadow = "0 4px 15px rgba(46, 89, 57, 0.08)";
            e.target.style.transform = "translateY(0)";
          }}
          required={required}
          disabled={disabled}
        />
      )}
      {!isValid && validationMessage && (
        <div style={{
          color: '#e57373',
          fontSize: '13px',
          marginTop: '8px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <FaExclamationTriangle size={12} />
          {validationMessage}
        </div>
      )}
    </div>
  );
};

// ===============================================
// COMPONENTE PRINCIPAL DEL FORMULARIO
// ===============================================
export default function ReservaForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  
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
    sedesPorServicio: []
  });

  // Estado del formulario
  const [formData, setFormData] = useState({
    // Información personal
    nombre: "",
    email: "",
    telefono: "",
    
    // Información de reserva - CORREGIDO NOMBRES DE FECHAS
    idReserva: 0,
    fechaSalida: "", // Fecha de salida (antes fechaReserva)
    fechaEntrada: "", // Fecha de entrada
    fechaRegistro: new Date().toISOString().split('T')[0], // Se llena automáticamente
    abono: 0,
    restante: 0,
    montoTotal: 0,
    idUsuario: 1, // Temporal - se puede obtener del localStorage o contexto
    idEstado: 2, // Pendiente por defecto
    idSede: "",
    idCabana: "",
    idMetodoPago: "",
    idPaquete: "",
    
    // Información adicional
    numeroPersonas: 1,
    observaciones: ""
  });

  // Datos filtrados
  const [filteredData, setFilteredData] = useState({
    cabanas: [],
    paquetes: [],
    servicios: [] // Servicios filtrados por sede
  });

  // Definir los pasos del formulario
  const steps = [
    { label: "Tus Datos", icon: <FaUser /> },
    { label: "Fechas", icon: <FaCalendarAlt /> },
    { label: "Alojamiento", icon: <FaHome /> },
    { label: "Extras", icon: <FaPlus /> },
    { label: "Confirmación", icon: <FaCheck /> }
  ];

  // Cargar datos relacionados al montar el componente
  useEffect(() => {
    cargarDatosRelacionados();
  }, []);

  // Filtrar datos cuando cambia la sede seleccionada
  useEffect(() => {
    filtrarDatosPorSede();
  }, [formData.idSede, apiData]);

  // Calcular montos cuando cambian los datos relevantes
  useEffect(() => {
    calcularMontos();
  }, [formData.idPaquete, formData.fechaEntrada, formData.fechaSalida, formData.numeroPersonas, formData.idCabana]);

  // Función para cargar todos los datos de la API
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
          { idMetodoPago: 1, nombreMetodoPago: "Transferencia Bancaria" },
          { idMetodoPago: 2, nombreMetodoPago: "Efectivo" },
          { idMetodoPago: 3, nombreMetodoPago: "Tarjeta de Crédito" }
        ],
        servicios: [
          { idServicio: 1, nombreServicio: "Desayuno Premium", descripcion: "Desayuno buffet con productos locales y orgánicos", precioServicio: 25000 },
          { idServicio: 2, nombreServicio: "Cena Romántica", descripcion: "Cena especial para parejas con velas y música", precioServicio: 80000 },
          { idServicio: 3, nombreServicio: "Tour Guiado", descripcion: "Recorrido por senderos naturales con guía especializado", precioServicio: 40000 },
          { idServicio: 4, nombreServicio: "Spa Relajante", descripcion: "Masajes relajantes y tratamientos de bienestar", precioServicio: 120000 },
          { idServicio: 5, nombreServicio: "Cabalgata", descripcion: "Paseo a caballo por los alrededores del bosque", precioServicio: 60000 }
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

      // Cargar todos los datos en paralelo
      const [
        sedesData, 
        cabanasData, 
        paquetesData, 
        estadosData, 
        metodosPagoData,
        sedePaquetesData,
        cabanaSedesData,
        serviciosData,
        sedesPorServicioData
      ] = await Promise.all([
        fetchConManejoError(API_URLS.SEDES),
        fetchConManejoError(API_URLS.CABANAS),
        fetchConManejoError(API_URLS.PAQUETES),
        fetchConManejoError(API_URLS.ESTADOS, configuracionPorDefecto.estados),
        fetchConManejoError(API_URLS.METODOS_PAGO, configuracionPorDefecto.metodosPago),
        fetchConManejoError(API_URLS.SEDE_POR_PAQUETE),
        fetchConManejoError(API_URLS.CABANA_POR_SEDE),
        fetchConManejoError(API_URLS.SERVICIOS, configuracionPorDefecto.servicios),
        fetchConManejoError(API_URLS.SEDES_POR_SERVICIO, [])
      ]);

      // Asegurarse de que las cabañas tengan datos mínimos
      const cabanasConDatos = cabanasData.map(cabana => ({
        idCabana: cabana.idCabana,
        nombre: cabana.nombre || `Cabaña ${cabana.idCabana}`,
        descripcion: cabana.descripcion || "Disfruta de una experiencia única en la naturaleza",
        precio: cabana.precio || 150000,
        capacidad: cabana.capacidad || 2,
        ...cabana
      }));

      // Asegurarse de que los servicios tengan datos mínimos
      const serviciosConDatos = serviciosData.map(servicio => ({
        idServicio: servicio.idServicio,
        nombreServicio: servicio.nombreServicio || `Servicio ${servicio.idServicio}`,
        precioServicio: servicio.precioServicio || servicio.precio || 0,
        descripcion: servicio.descripcion || "Servicio adicional para tu estadía",
        imagen: servicio.imagen || "",
        estado: servicio.estado !== undefined ? servicio.estado : true,
        ...servicio
      }));

      setApiData({
        sedes: sedesData,
        cabanas: cabanasConDatos,
        paquetes: paquetesData,
        estados: estadosData,
        metodosPago: metodosPagoData,
        sedePaquetes: sedePaquetesData,
        cabanaSedes: cabanaSedesData,
        servicios: serviciosConDatos,
        sedesPorServicio: sedesPorServicioData
      });

      console.log("📊 Datos de la API cargados:", {
        sedes: sedesData.length,
        cabanas: cabanasConDatos.length,
        paquetes: paquetesData.length,
        cabanaSedes: cabanaSedesData.length,
        sedePaquetes: sedePaquetesData.length
      });

      // Establecer valores por defecto
      if (sedesData.length > 0) {
        // Buscar Copacabana primero, si no existe usar la primera sede
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

  // Función para filtrar cabañas, paquetes y servicios por sede seleccionada - MEJORADA
  const filtrarDatosPorSede = () => {
    if (!formData.idSede) {
      // Si no hay sede seleccionada, mostrar todos los datos
      setFilteredData({
        cabanas: [],
        paquetes: [],
        servicios: []
      });
      return;
    }

    const sedeId = parseInt(formData.idSede);
    console.log(`🔍 Filtrando datos para sede ID: ${sedeId}`);

    // Filtrar cabañas por sede - MEJORADO con manejo de errores
    let cabanasFiltradas = [];
    try {
      if (apiData.cabanaSedes && apiData.cabanaSedes.length > 0) {
        cabanasFiltradas = apiData.cabanaSedes
          .filter(cs => {
            // Verificar que cs existe y tiene las propiedades necesarias
            if (!cs) return false;
            
            // Manejar diferentes estructuras posibles de la API
            const csSedeId = cs.idSede || cs.sedeId || cs.idsede;
            const csCabanaId = cs.idCabana || cs.cabanaId || cs.idcabana;
            
            return csSedeId === sedeId && csCabanaId;
          })
          .map(cs => {
            const cabanaId = cs.idCabana || cs.cabanaId || cs.idcabana;
            return apiData.cabanas.find(c => c.idCabana === cabanaId);
          })
          .filter(Boolean);
      } else {
        // Si no hay datos de cabanaSedes, mostrar todas las cabañas
        console.warn("⚠ No hay datos de CabanaPorSede, mostrando todas las cabañas");
        cabanasFiltradas = apiData.cabanas;
      }
    } catch (error) {
      console.error("❌ Error al filtrar cabañas:", error);
      cabanasFiltradas = apiData.cabanas; // Fallback: mostrar todas
    }

    // Filtrar paquetes por sede
    const paquetesFiltrados = apiData.sedePaquetes
      .filter(sp => {
        if (!sp) return false;
        const spSedeId = sp.idSede || sp.sedeId || sp.idsede;
        return spSedeId === sedeId;
      })
      .map(sp => {
        const paqueteId = sp.idPaquete || sp.paqueteId || sp.idpaquete;
        return apiData.paquetes.find(p => p.idPaquete === paqueteId);
      })
      .filter(Boolean);

    // Filtrar servicios por sede
    const serviciosFiltrados = apiData.servicios.filter(servicio => {
      // Si no hay datos de sedesPorServicio, mostrar todos los servicios activos
      if (apiData.sedesPorServicio.length === 0) {
        return servicio.estado !== false;
      }
      
      const disponibleEnSede = apiData.sedesPorServicio.some(
        sss => {
          if (!sss) return false;
          const sssSedeId = sss.idSede || sss.sedeId || sss.idsede;
          const sssServicioId = sss.idServicio || sss.servicioId || sss.idservicio;
          return sssSedeId === sedeId && sssServicioId === servicio.idServicio;
        }
      );
      
      return disponibleEnSede && servicio.estado !== false;
    });

    console.log("🔍 Resultados del filtrado:", {
      cabanasFiltradas: cabanasFiltradas.length,
      paquetesFiltrados: paquetesFiltrados.length,
      serviciosFiltrados: serviciosFiltrados.length,
      cabanasFiltradas,
      paquetesFiltrados
    });

    setFilteredData({
      cabanas: cabanasFiltradas,
      paquetes: paquetesFiltrados,
      servicios: serviciosFiltrados
    });

    // Resetear selecciones si ya no están disponibles
    if (formData.idCabana && !cabanasFiltradas.find(c => c.idCabana === parseInt(formData.idCabana))) {
      setFormData(prev => ({ ...prev, idCabana: "" }));
    }
    if (formData.idPaquete && !paquetesFiltrados.find(p => p.idPaquete === parseInt(formData.idPaquete))) {
      setFormData(prev => ({ ...prev, idPaquete: "" }));
    }
  };

  // Función para calcular montos automáticamente
  const calcularMontos = () => {
    const paqueteSeleccionado = apiData.paquetes.find(
      p => p.idPaquete === parseInt(formData.idPaquete)
    );
    
    const cabanaSeleccionada = apiData.cabanas.find(
      c => c.idCabana === parseInt(formData.idCabana)
    );
    
    // Precio base del paquete o cabaña
    let precioBase = 0;
    if (paqueteSeleccionado) {
      precioBase = parseFloat(paqueteSeleccionado.precioPaquete || 0);
    } else if (cabanaSeleccionada) {
      precioBase = parseFloat(cabanaSeleccionada.precio || 0);
    }
    
    // Calcular días de estadía
    let diasEstadia = 1;
    if (formData.fechaEntrada && formData.fechaSalida) {
      const entrada = new Date(formData.fechaEntrada);
      const salida = new Date(formData.fechaSalida);
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

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para manejar servicios extras
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    try {
      // Preparar datos para la API en el formato exacto que necesitas
      const reservaData = {
        idReserva: 0,
        fechaSalida: formData.fechaSalida, // Fecha de salida (CORREGIDO)
        fechaEntrada: formData.fechaEntrada, // Fecha de entrada
        // fechaRegistro se llena automáticamente en la API, no la enviamos
        abono: parseFloat(formData.abono),
        restante: parseFloat(formData.restante),
        montoTotal: parseFloat(formData.montoTotal),
        idUsuario: parseInt(formData.idUsuario),
        idEstado: 2, // Siempre pendiente por defecto
        idSede: parseInt(formData.idSede),
        idCabana: parseInt(formData.idCabana),
        idMetodoPago: parseInt(formData.idMetodoPago),
        idPaquete: formData.idPaquete ? parseInt(formData.idPaquete) : 0
        // serviciosExtras se manejan en una tabla aparte
      };

      console.log("📤 Enviando datos de reserva:", reservaData);

      const response = await fetch(API_URLS.RESERVAS, {
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
      
      // Si hay servicios extras seleccionados, guardarlos en la tabla de servicios_reserva
      if (serviciosSeleccionados.length > 0) {
        await guardarServiciosReserva(result.idReserva);
      }
      
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

  // Función para guardar servicios de reserva
  const guardarServiciosReserva = async (idReserva) => {
    try {
      for (const servicio of serviciosSeleccionados) {
        const servicioReservaData = {
          idServicioReserva: 0,
          idReserva: idReserva,
          idServicio: servicio.idServicio,
          precio: servicio.precioServicio,
          cantidad: calcularDiasEstadia()
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
      'fechaEntrada', 'fechaSalida', 'idSede', 'idMetodoPago'
    ];

    for (const campo of camposRequeridos) {
      if (!formData[campo]) {
        const nombreCampo = campo.replace('id', '').replace(/([A-Z])/g, ' $1').trim();
        displayAlert(`❌ El campo ${nombreCampo} es obligatorio`, "error");
        return false;
      }
    }

    // Validar que se haya seleccionado al menos cabaña o paquete
    if (!formData.idCabana && !formData.idPaquete) {
      displayAlert("❌ Debes seleccionar al menos una cabaña o un paquete", "error");
      return false;
    }

    // Validar fechas - CORREGIDO
    const hoy = new Date().toISOString().split('T')[0];
    if (formData.fechaEntrada < hoy) {
      displayAlert("❌ La fecha de entrada no puede ser anterior a hoy", "error");
      return false;
    }

    // CORREGIDO: La fecha de salida debe ser posterior a la fecha de entrada
    if (formData.fechaSalida <= formData.fechaEntrada) {
      displayAlert("❌ La fecha de salida debe ser posterior a la fecha de entrada", "error");
      return false;
    }

    if (formData.montoTotal <= 0) {
      displayAlert("❌ Debe seleccionar al menos una cabaña o paquete para calcular el monto total", "error");
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
    setShowCancelDialog(true);
  };

  const handleCancelConfirm = () => {
    setShowCancelDialog(false);
    navigate("/cliente/reservas");
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

  // Función para obtener icono según el tipo de cabaña
  const getCabanaIcon = (cabana) => {
    const nombre = cabana.nombre?.toLowerCase() || '';
    if (nombre.includes('premium') || nombre.includes('vista')) return <FaMountain />;
    if (nombre.includes('familiar') || nombre.includes('deluxe')) return <FaHome />;
    if (nombre.includes('romántica') || nombre.includes('pareja')) return <FaHeart />;
    if (nombre.includes('playa') || nombre.includes('arena')) return <FaUmbrellaBeach />;
    return <FaLeaf />;
  };

  // Función para obtener características según la cabaña
  const getCabanaFeatures = (cabana) => {
    const features = [];
    const nombre = cabana.nombre?.toLowerCase() || '';
    
    if (nombre.includes('jacuzzi') || nombre.includes('premium')) {
      features.push('Jacuzzi privado', 'Terraza con vista', 'Desayuno incluido');
    }
    if (nombre.includes('familiar') || cabana.capacidad > 2) {
      features.push('Amplio espacio', 'Cocina equipada', 'Área familiar');
    }
    if (nombre.includes('romántica')) {
      features.push('Ambiente íntimo', 'Decoración especial', 'Cena romántica');
    }
    
    // Características básicas para todas
    features.push('WiFi gratis', 'Aire acondicionado', 'Baño privado');
    
    return features.slice(0, 4); // Máximo 4 características
  };

  return (
    <div style={{ 
      padding: "32px", 
      backgroundColor: "#f5f8f2", 
      minHeight: "100vh",
      width: "100%",
      boxSizing: "border-box",
      margin: 0,
      background: "linear-gradient(135deg, #f5f8f2 0%, #e8f0e8 100%)",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      
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
          borderLeftColor: alertMessage.includes('❌') ? '#e57373' : '#4caf50'
        }}>
          {alertMessage.includes('❌') ? 
            <FaExclamationTriangle style={{ color: '#e57373', fontSize: '22px' }} /> : 
            <FaCheck style={{ color: '#4caf50', fontSize: '22px' }} />
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
              padding: '4px',
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
        marginBottom: 40,
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div>
          <h1 style={{ 
            margin: 0, 
            color: "#2E5939", 
            fontSize: "42px", 
            fontWeight: "900",
            background: "linear-gradient(135deg, #2E5939 0%, #679750 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "12px",
            letterSpacing: "-0.5px"
          }}>
            🌲 Reserva tu Aventura en el Bosque
          </h1>
          <p style={{ 
            margin: "12px 0 0 0", 
            color: "#679750", 
            fontSize: "18px",
            fontWeight: "500",
            maxWidth: "600px",
            lineHeight: "1.6"
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
            gap: '12px',
            padding: "16px 32px"
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#2E5939";
            e.target.style.color = "white";
            e.target.style.transform = "translateY(-3px)";
            e.target.style.boxShadow = "0 8px 25px rgba(46, 89, 57, 0.3)";
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
        gridTemplateColumns: '1fr 400px',
        gap: '32px',
        alignItems: 'start'
      }}>
        
        {/* Columna izquierda - Formulario */}
        <div>
          {/* Indicador de Progreso */}
          <StepIndicator 
            currentStep={currentStep} 
            totalSteps={steps.length} 
            steps={steps} 
          />

          {/* Formulario Premium */}
          <div style={cardStyle}>
            <div style={{ padding: "40px" }}>
              {loading && apiData.cabanas.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px" }}>
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    border: '5px solid #f3f3f3',
                    borderTop: '5px solid #2E5939',
                    borderRadius: '50%',
                    animation: 'spin 1.2s linear infinite',
                    margin: '0 auto 24px'
                  }}></div>
                  <div style={{ fontSize: '22px', marginBottom: '12px', color: "#2E5939", fontWeight: '700' }}>
                    Cargando tu experiencia...
                  </div>
                  <div style={{ color: "#679750", fontSize: '16px' }}>
                    Preparando las mejores opciones para tu aventura en el bosque
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Paso 1: Información Personal */}
                  {currentStep === 0 && (
                    <div style={{ 
                      backgroundColor: '#FBFDF9', 
                      padding: '36px', 
                      borderRadius: '20px',
                      marginBottom: '32px',
                      border: '2px solid rgba(103, 151, 80, 0.2)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
                    }}>
                      <h3 style={{ 
                        color: '#2E5939', 
                        marginBottom: '32px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '16px',
                        fontSize: '24px',
                        fontWeight: '800'
                      }}>
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
                          boxShadow: '0 8px 20px rgba(46, 89, 57, 0.3)'
                        }}>
                          <FaUser />
                        </div>
                        Información Personal
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
                        <FormField
                          label="Nombre Completo"
                          name="nombre"
                          type="text"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          required={true}
                          placeholder="Ingresa tu nombre completo"
                          icon={<FaUser />}
                          validation={(value) => ({
                            isValid: value.length >= 2,
                            message: "El nombre debe tener al menos 2 caracteres"
                          })}
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
                          validation={(value) => ({
                            isValid: value.length >= 10,
                            message: "Ingresa un número de teléfono válido"
                          })}
                        />
                      </div>
                    </div>
                  )}

                  {/* Paso 2: Fechas y Huéspedes */}
                  {currentStep === 1 && (
                    <div style={{ 
                      backgroundColor: '#FBFDF9', 
                      padding: '36px', 
                      borderRadius: '20px',
                      marginBottom: '32px',
                      border: '2px solid rgba(103, 151, 80, 0.2)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
                    }}>
                      <h3 style={{ 
                        color: '#2E5939', 
                        marginBottom: '32px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '16px',
                        fontSize: '24px',
                        fontWeight: '800'
                      }}>
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
                          boxShadow: '0 8px 20px rgba(46, 89, 57, 0.3)'
                        }}>
                          <FaCalendarAlt />
                        </div>
                        Fechas y Huéspedes
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
                        <FormField
                          label="Fecha de Llegada"
                          name="fechaEntrada"
                          type="date"
                          value={formData.fechaEntrada}
                          onChange={handleInputChange}
                          required={true}
                        />
                        <FormField
                          label="Fecha de Salida"
                          name="fechaSalida"
                          type="date"
                          value={formData.fechaSalida}
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
                      {formData.fechaEntrada && formData.fechaSalida && (
                        <div style={{ 
                          marginTop: '28px', 
                          padding: '24px', 
                          backgroundColor: '#E8F5E8', 
                          borderRadius: '16px',
                          textAlign: 'center',
                          border: '3px solid #2E5939',
                          boxShadow: '0 8px 25px rgba(46, 89, 57, 0.15)'
                        }}>
                          <strong style={{ color: '#2E5939', fontSize: '20px', display: 'block', marginBottom: '8px' }}>
                            🗓️ ¡Perfecto! Tu estadía será de {calcularDiasEstadia()} {calcularDiasEstadia() === 1 ? 'noche' : 'noches'}
                          </strong>
                          <span style={{ color: '#679750', fontSize: '15px' }}>
                            {formData.fechaEntrada} → {formData.fechaSalida}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Paso 3: Selección de Alojamiento */}
                  {currentStep === 2 && (
                    <div style={{ 
                      backgroundColor: '#FBFDF9', 
                      padding: '36px', 
                      borderRadius: '20px',
                      marginBottom: '32px',
                      border: '2px solid rgba(103, 151, 80, 0.2)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
                    }}>
                      <h3 style={{ 
                        color: '#2E5939', 
                        marginBottom: '32px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '16px',
                        fontSize: '24px',
                        fontWeight: '800'
                      }}>
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
                          boxShadow: '0 8px 20px rgba(46, 89, 57, 0.3)'
                        }}>
                          <FaHome />
                        </div>
                        Elige tu Experiencia
                      </h3>

                      {/* Selector de Sede */}
                      <div style={{ marginBottom: '32px' }}>
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
                        />
                      </div>

                      {/* Cabañas en formato de cards - Filtradas por sede */}
                      <div style={{ marginBottom: '32px' }}>
                        <h4 style={{ 
                          color: '#2E5939', 
                          marginBottom: '24px',
                          fontSize: '20px',
                          fontWeight: '700'
                        }}>
                          🏡 Selecciona tu Cabaña {formData.idSede && `(${filteredData.cabanas.length} disponibles)`}
                        </h4>
                        
                        {filteredData.cabanas.length === 0 ? (
                          <div style={{ 
                            textAlign: 'center', 
                            padding: '40px', 
                            backgroundColor: '#F9FBFA',
                            borderRadius: '16px',
                            border: '2px dashed #E8F0E8'
                          }}>
                            <FaHome style={{ fontSize: '48px', color: '#679750', marginBottom: '16px' }} />
                            <h4 style={{ color: '#2E5939', marginBottom: '8px' }}>No hay cabañas disponibles</h4>
                            <p style={{ color: '#679750' }}>Selecciona otra sede para ver las opciones disponibles.</p>
                          </div>
                        ) : (
                          <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
                            gap: '24px',
                            marginBottom: '32px'
                          }}>
                            {filteredData.cabanas.map((cabana) => (
                              <SelectionCard
                                key={cabana.idCabana}
                                title={cabana.nombre}
                                description={cabana.descripcion || "Disfruta de una experiencia única en la naturaleza"}
                                price={formatCurrency(cabana.precio || 0)}
                                image={getCabanaIcon(cabana)}
                                isSelected={formData.idCabana === cabana.idCabana.toString()}
                                onSelect={() => handleSelectChange('idCabana', cabana.idCabana.toString())}
                                features={getCabanaFeatures(cabana)}
                                popular={cabana.precio > 300000}
                                capacity={cabana.capacidad || 2}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Paquetes en formato de cards - Filtrados por sede */}
                      <div style={{ marginBottom: '32px' }}>
                        <h4 style={{ 
                          color: '#2E5939', 
                          marginBottom: '24px',
                          fontSize: '20px',
                          fontWeight: '700'
                        }}>
                          📦 Paquetes de Experiencia {formData.idSede && `(${filteredData.paquetes.length} disponibles)`}
                        </h4>
                        
                        {filteredData.paquetes.length === 0 ? (
                          <div style={{ 
                            textAlign: 'center', 
                            padding: '40px', 
                            backgroundColor: '#F9FBFA',
                            borderRadius: '16px',
                            border: '2px dashed #E8F0E8'
                          }}>
                            <FaBox style={{ fontSize: '48px', color: '#679750', marginBottom: '16px' }} />
                            <h4 style={{ color: '#2E5939', marginBottom: '8px' }}>No hay paquetes disponibles</h4>
                            <p style={{ color: '#679750' }}>Selecciona otra sede para ver los paquetes disponibles.</p>
                          </div>
                        ) : (
                          <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
                            gap: '24px'
                          }}>
                            {filteredData.paquetes.map((paquete) => (
                              <SelectionCard
                                key={paquete.idPaquete}
                                title={paquete.nombrePaquete}
                                description={paquete.descripcion || `Incluye servicios especiales para ${paquete.personas} personas`}
                                price={formatCurrency(paquete.precioPaquete || 0)}
                                image={<FaStar />}
                                isSelected={formData.idPaquete === paquete.idPaquete.toString()}
                                onSelect={() => handleSelectChange('idPaquete', paquete.idPaquete.toString())}
                                features={[
                                  `Para ${paquete.personas} personas`,
                                  `${paquete.dias} días de experiencia`,
                                  paquete.descuento > 0 ? `${paquete.descuento}% de descuento` : 'Precio especial'
                                ]}
                                popular={paquete.descuento > 0}
                                capacity={paquete.personas}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Paso 4: Servicios Extras */}
                  {currentStep === 3 && (
                    <div style={{ 
                      backgroundColor: '#FBFDF9', 
                      padding: '36px', 
                      borderRadius: '20px',
                      marginBottom: '32px',
                      border: '2px solid rgba(103, 151, 80, 0.2)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
                    }}>
                      <h3 style={{ 
                        color: '#2E5939', 
                        marginBottom: '32px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '16px',
                        fontSize: '24px',
                        fontWeight: '800'
                      }}>
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
                          boxShadow: '0 8px 20px rgba(46, 89, 57, 0.3)'
                        }}>
                          <FaPlus />
                        </div>
                        Servicios Extras
                      </h3>

                      <div style={{ marginBottom: '24px' }}>
                        <p style={{ 
                          color: '#679750', 
                          fontSize: '16px',
                          lineHeight: '1.6',
                          marginBottom: '24px'
                        }}>
                          Personaliza tu experiencia seleccionando servicios adicionales. 
                          Estos se aplicarán por cada noche de tu estadía.
                        </p>
                      </div>

                      {filteredData.servicios.length === 0 ? (
                        <div style={{ 
                          textAlign: 'center', 
                          padding: '40px', 
                          backgroundColor: '#F9FBFA',
                          borderRadius: '16px',
                          border: '2px dashed #E8F0E8'
                        }}>
                          <FaBox style={{ fontSize: '48px', color: '#679750', marginBottom: '16px' }} />
                          <h4 style={{ color: '#2E5939', marginBottom: '8px' }}>No hay servicios disponibles</h4>
                          <p style={{ color: '#679750' }}>Selecciona otra sede para ver los servicios disponibles.</p>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {filteredData.servicios.map((servicio) => (
                            <ServicioExtraCard
                              key={servicio.idServicio}
                              servicio={servicio}
                              isSelected={serviciosSeleccionados.some(s => s.idServicio === servicio.idServicio)}
                              onToggle={toggleServicioExtra}
                              diasEstadia={calcularDiasEstadia()}
                            />
                          ))}
                        </div>
                      )}

                      {serviciosSeleccionados.length > 0 && (
                        <div style={{ 
                          marginTop: '32px',
                          padding: '20px',
                          backgroundColor: '#E8F5E8',
                          borderRadius: '16px',
                          border: '2px solid #2E5939'
                        }}>
                          <h5 style={{ 
                            color: '#2E5939', 
                            marginBottom: '12px',
                            fontSize: '18px',
                            fontWeight: '700'
                          }}>
                            🎁 Servicios Seleccionados:
                          </h5>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {serviciosSeleccionados.map((servicio, index) => (
                              <div key={index} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px',
                                backgroundColor: 'white',
                                borderRadius: '8px'
                              }}>
                                <span style={{ color: '#2E5939', fontWeight: '600' }}>
                                  {servicio.nombreServicio}
                                </span>
                                <span style={{ color: '#679750', fontWeight: '700' }}>
                                  +{formatCurrency(servicio.precioServicio * calcularDiasEstadia())}
                                </span>
                              </div>
                            ))}
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '12px',
                              backgroundColor: '#2E5939',
                              borderRadius: '8px',
                              color: 'white',
                              fontWeight: '800'
                            }}>
                              <span>Total servicios extras:</span>
                              <span>
                                +{formatCurrency(serviciosSeleccionados.reduce((total, servicio) => 
                                  total + (servicio.precioServicio * calcularDiasEstadia()), 0
                                ))}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Paso 5: Confirmación y Pago */}
                  {currentStep === 4 && (
                    <div style={{ 
                      backgroundColor: '#FBFDF9', 
                      padding: '36px', 
                      borderRadius: '20px',
                      marginBottom: '32px',
                      border: '2px solid rgba(103, 151, 80, 0.2)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
                    }}>
                      <h3 style={{ 
                        color: '#2E5939', 
                        marginBottom: '32px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '16px',
                        fontSize: '24px',
                        fontWeight: '800'
                      }}>
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
                          boxShadow: '0 8px 20px rgba(46, 89, 57, 0.3)'
                        }}>
                          <FaCreditCard />
                        </div>
                        Confirmación y Pago
                      </h3>

                      {/* Método de Pago */}
                      <div style={{ marginBottom: '32px' }}>
                        <FormField
                          label="Método de Pago"
                          name="idMetodoPago"
                          type="select"
                          value={formData.idMetodoPago}
                          onChange={handleInputChange}
                          options={apiData.metodosPago.map(m => ({ value: m.idMetodoPago, label: m.nombreMetodoPago }))}
                          required={true}
                          icon={<FaCreditCard />}
                        />
                      </div>

                      {/* Observaciones */}
                      <div style={{ marginBottom: '32px' }}>
                        <FormField
                          label="Observaciones Especiales"
                          name="observaciones"
                          type="textarea"
                          value={formData.observaciones}
                          onChange={handleInputChange}
                          placeholder="Alergias alimenticias, necesidades especiales, celebración especial, preferencias dietarias, etc."
                        />
                      </div>

                      {/* Detalles del cálculo */}
                      {formData.montoTotal > 0 && (
                        <div style={{ 
                          padding: '24px', 
                          backgroundColor: '#f8f9fa', 
                          borderRadius: '16px',
                          fontSize: '15px',
                          color: '#2E5939',
                          border: '2px solid #E8F0E8',
                          marginBottom: '24px'
                        }}>
                          <div style={{ fontWeight: '800', marginBottom: '16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaClock /> Detalles de tu Reserva
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                            <div>• Días de estadía: <strong>{calcularDiasEstadia()}</strong></div>
                            <div>• Número de personas: <strong>{formData.numeroPersonas}</strong></div>
                            {formData.numeroPersonas > 2 && (
                              <div>• Recargo por personas adicionales: <strong>{formatCurrency((formData.numeroPersonas - 2) * 50000)}</strong></div>
                            )}
                            {serviciosSeleccionados.length > 0 && (
                              <div>• Servicios extras: <strong>+{formatCurrency(serviciosSeleccionados.reduce((total, servicio) => total + (servicio.precioServicio * calcularDiasEstadia()), 0))}</strong></div>
                            )}
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
                    marginTop: "48px",
                    paddingTop: '32px',
                    borderTop: '3px solid #f0f0f0'
                  }}>
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      style={{
                        ...btnSecondaryStyle,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        opacity: currentStep === 0 ? 0.5 : 1,
                        cursor: currentStep === 0 ? 'not-allowed' : 'pointer'
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
                          gap: '12px'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = "#1e4629";
                          e.target.style.transform = "translateY(-3px)";
                          e.target.style.boxShadow = "0 15px 35px rgba(46, 89, 57, 0.4)";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = "#2E5939";
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "0 12px 30px rgba(46, 89, 57, 0.4)";
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
                          gap: '12px'
                        }}
                        onMouseOver={(e) => {
                          if (!loading) {
                            e.target.style.backgroundColor = "#1e4629";
                            e.target.style.transform = "translateY(-3px)";
                            e.target.style.boxShadow = "0 15px 35px rgba(46, 89, 57, 0.4)";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!loading) {
                            e.target.style.backgroundColor = "#2E5939";
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 12px 30px rgba(46, 89, 57, 0.4)";
                          }
                        }}
                      >
                        {loading ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                            <div style={{
                              width: '20px',
                              height: '20px',
                              border: '3px solid transparent',
                              borderTop: '3px solid white',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite'
                            }}></div>
                            Creando tu Reserva...
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
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
        <ResumenReserva 
          formData={formData}
          calcularDiasEstadia={calcularDiasEstadia}
          formatCurrency={formatCurrency}
          datosRelacionados={apiData}
          serviciosSeleccionados={serviciosSeleccionados}
        />
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

          /* Scroll suave */
          html {
            scroll-behavior: smooth;
          }

          /* Mejoras de hover para las tarjetas */
          .info-card:hover {
            transform: translateY(-8px);
            boxShadow: 0 20px 40px rgba(0,0,0,0.15);
          }

          /* Responsive */
          @media (max-width: 1200px) {
            .main-layout {
              grid-template-columns: 1fr !important;
            }
            
            .resumen-columna {
              order: -1;
              margin-bottom: 32px;
            }
          }

          @media (max-width: 768px) {
            .form-section {
              padding: 24px !important;
            }
            
            .header-content {
              flex-direction: column;
              text-align: center;
            }
            
            .step-indicator {
              padding: 0 10px !important;
            }
          }
        `}
      </style>
    </div>
  );
}