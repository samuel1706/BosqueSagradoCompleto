import React, { useEffect, useState } from "react";
import { FaSearch, FaPlus, FaEye, FaCalendarAlt, FaHome, FaMapMarkerAlt, FaExclamationTriangle } from "react-icons/fa";

// ===============================================
// ESTILOS
// ===============================================
const cardStyle = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  overflow: 'hidden',
  border: '1px solid rgba(103, 151, 80, 0.1)'
};

const btnAccion = (bg, borderColor, hoverBg) => ({
  marginRight: 6,
  cursor: "pointer",
  padding: "8px 12px",
  borderRadius: 8,
  border: `1px solid ${borderColor}`,
  backgroundColor: bg,
  color: borderColor,
  fontWeight: "600",
  fontSize: "14px",
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  transition: "all 0.3s ease",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  ':hover': {
    backgroundColor: hoverBg,
    transform: "translateY(-1px)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.15)"
  }
});

const inputStyle = {
  width: "100%",
  padding: "12px 15px",
  border: "1px solid #ddd",
  borderRadius: 10,
  backgroundColor: "#F7F4EA",
  color: "#2E5939",
  boxSizing: 'border-box',
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  fontSize: "14px",
  transition: "all 0.3s ease",
  ':focus': {
    outline: "none",
    borderColor: "#2E5939",
    boxShadow: "0 0 0 3px rgba(46, 89, 57, 0.1)"
  }
};

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================
export default function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newReserva, setNewReserva] = useState({
    idReserva: 0,
    fechaReserva: "",
    fechaEntrada: "",
    fechaRegistro: "",
    abono: 0,
    restante: 0,
    montoTotal: 0,
    idUsuario: 0,
    idEstado: 0,
    idSede: 0,
    idCabana: 0,
    idMetodoPago: 0,
    idPaquete: 0
  });

  // Datos de ejemplo
  const sampleData = [
    { id: 1, cliente: "Leider Sahur", sede: "Sede San Felix", cabaña: "Cabaña Premium", fecha: "2025-12-01", estado: "Confirmada" },
    { id: 2, cliente: "María Pérez", sede: "Sede Copacabana", cabaña: "Cabaña VIP", fecha: "2025-11-15", estado: "Pendiente" },
    { id: 3, cliente: "Juan López", sede: "Cerro Tres Cruces", cabaña: "Cabaña Tres Cruces", fecha: "2026-01-10", estado: "Cancelada" },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setReservas(sampleData);
      setLoading(false);
    }, 800);
  }, []);

  const handleSearch = (e) => setQuery(e.target.value);

  const handleNewReservation = () => setShowForm(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReserva((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveReservation = (e) => {
    e.preventDefault();

    const nueva = { ...newReserva, idReserva: reservas.length + 1 };
    setReservas([...reservas, nueva]);
    setNewReserva({
      idReserva: 0,
      fechaReserva: "",
      fechaEntrada: "",
      fechaRegistro: "",
      abono: 0,
      restante: 0,
      montoTotal: 0,
      idUsuario: 0,
      idEstado: 0,
      idSede: 0,
      idCabana: 0,
      idMetodoPago: 0,
      idPaquete: 0
    });
    setShowForm(false);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setNewReserva({
      idReserva: 0,
      fechaReserva: "",
      fechaEntrada: "",
      fechaRegistro: "",
      abono: 0,
      restante: 0,
      montoTotal: 0,
      idUsuario: 0,
      idEstado: 0,
      idSede: 0,
      idCabana: 0,
      idMetodoPago: 0,
      idPaquete: 0
    });
  };

  const getEstadoColor = (estado) => {
    const estadoLower = (estado || "").toLowerCase();
    if (estadoLower.includes('confirmada')) return '#4caf50';
    if (estadoLower.includes('pendiente')) return '#ff9800';
    if (estadoLower.includes('cancelada')) return '#f44336';
    return '#757575';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  const filtered = reservas.filter((r) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      String(r.id).includes(q) ||
      (r.cliente || "").toLowerCase().includes(q) ||
      (r.sede || "").toLowerCase().includes(q) ||
      (r.cabaña || "").toLowerCase().includes(q) ||
      (r.fecha || "").toLowerCase().includes(q)
    );
  });

  // ===============================================
  // RENDER
  // ===============================================
  return (
    <div style={{ 
      padding: "24px", 
      backgroundColor: "#f5f8f2", 
      minHeight: "100vh", 
      width: "100%",
      boxSizing: 'border-box'
    }}>
      
      {/* Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ margin: 0, color: "#2E5939", fontSize: "28px", fontWeight: "700" }}>Mis Reservas</h2>
          <p style={{ margin: "8px 0 0 0", color: "#679750", fontSize: "15px" }}>Gestiona y consulta todas tus reservas</p>
        </div>
        <button
          onClick={handleNewReservation}
          style={{
            backgroundColor: "#2E5939",
            color: "white",
            padding: "14px 24px",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0
          }}
        >
          <FaPlus /> Nueva Reserva
        </button>
      </div>

      {/* FORMULARIO NUEVA RESERVA */}
      {showForm && (
        <div style={{ ...cardStyle, padding: "20px", marginBottom: "24px" }}>
          <h3 style={{ color: "#2E5939", marginBottom: "16px" }}>Crear Nueva Reserva</h3>
          <form onSubmit={handleSaveReservation} style={{ 
            display: "grid", 
            gap: "12px", 
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))"
          }}>
            {Object.keys(newReserva).map((key) => (
              <div key={key}>
                <label style={{ fontWeight: "600", color: "#2E5939", fontSize: "14px" }}>{key}</label>
                <input
                  type={key.toLowerCase().includes("fecha") ? "date" : "number"}
                  name={key}
                  value={newReserva[key]}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </div>
            ))}
            <div style={{ 
              gridColumn: "1 / -1", 
              display: "flex", 
              gap: "12px", 
              justifyContent: "flex-end", 
              marginTop: "16px" 
            }}>
              <button 
                type="button" 
                onClick={handleCancelForm} 
                style={{
                  ...btnAccion("#fff", "#f44336", "#ffebee"),
                  padding: "10px 20px"
                }}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                style={{
                  ...btnAccion("#2E5939", "white", "#4CAF50"),
                  padding: "10px 20px"
                }}
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Barra de búsqueda */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '24px', 
        alignItems: 'center', 
        padding: '20px', 
        ...cardStyle,
        flexWrap: 'wrap'
      }}>
        <div style={{ position: "relative", flex: "1 1 300px", minWidth: "250px" }}>
          <FaSearch style={{ 
            position: "absolute", 
            left: 16, 
            top: "50%", 
            transform: "translateY(-50%)", 
            color: "#2E5939" 
          }} />
          <input
            type="text"
            placeholder="Buscar por cliente, sede, cabaña, fecha o ID..."
            value={query}
            onChange={handleSearch}
            style={{ ...inputStyle, padding: "14px 14px 14px 45px" }}
          />
        </div>
        <div style={{ 
          color: '#2E5939', 
          fontSize: '14px', 
          fontWeight: '600',
          flexShrink: 0
        }}>
          {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
        </div>
      </div>

      {/* LISTA DE RESERVAS */}
      <div style={cardStyle}>
        {loading ? (
          <div style={{ 
            textAlign: "center", 
            padding: "60px", 
            color: "#2E5939" 
          }}>
            🔄 Cargando reservas...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "60px", 
            color: "#2E5939" 
          }}>
            <FaExclamationTriangle size={48} color="#679750" />
            <div style={{ fontSize: '18px', fontWeight: '600', marginTop: '16px' }}>
              No se encontraron resultados
            </div>
          </div>
        ) : (
          <div style={{ padding: "20px" }}>
            {filtered.map((res) => (
              <div 
                key={res.id} 
                style={{ 
                  padding: "20px", 
                  borderRadius: "12px", 
                  border: "1px solid rgba(46, 89, 57, 0.1)", 
                  marginBottom: "16px", 
                  backgroundColor: "#fff",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  ':hover': {
                    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                    transform: "translateY(-2px)"
                  }
                }}
              >
                <h3 style={{ color: "#2E5939", margin: "0 0 8px 0" }}>
                  #{res.id} — {res.cliente}
                </h3>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  <FaMapMarkerAlt size={14} color="#679750" />
                  <span style={{ color: "#679750" }}>
                    {res.sede} | {res.cabaña} | {formatDate(res.fecha)} | 
                  </span>
                  <span style={{ 
                    color: getEstadoColor(res.estado),
                    fontWeight: '600'
                  }}>
                    {res.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}