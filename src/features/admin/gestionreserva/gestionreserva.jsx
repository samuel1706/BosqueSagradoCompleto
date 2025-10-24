// src/components/GestionReserva.jsx
import { FaEye, FaEdit, FaTrash, FaTimes, FaExclamationTriangle, FaPlus, FaMoneyBillAlt, FaFilePdf, FaCalendarAlt, FaUser, FaMapMarkerAlt, FaHome, FaBox, FaCreditCard, FaSearch, FaSync, FaCheck } from "react-icons/fa";
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

// ===============================================
// ESTILOS MEJORADOS
// ===============================================
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

const labelStyle = {
  display: "block",
  fontWeight: "600",
  marginBottom: 8,
  color: "#2E5939",
  fontSize: "14px"
};

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

const inputDisabledStyle = {
  ...inputStyle,
  backgroundColor: "#f8f9fa",
  color: "#6c757d",
  cursor: "not-allowed",
  borderColor: "#e9ecef"
};

const cardStyle = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  overflow: 'hidden',
  border: '1px solid rgba(103, 151, 80, 0.1)'
};

const statCardStyle = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  border: '1px solid rgba(103, 151, 80, 0.1)',
  textAlign: 'center'
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
  backdropFilter: "blur(4px)"
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: 30,
  borderRadius: 16,
  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
  width: "90%",
  maxWidth: 750,
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
  padding: '16px 20px',
  borderRadius: '12px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
  zIndex: 10000,
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontWeight: '600',
  fontSize: '15px',
  minWidth: '320px',
  maxWidth: '500px',
  animation: 'slideInRight 0.3s ease-out',
  borderLeft: '5px solid',
  backdropFilter: 'blur(10px)',
};

const detailsModalStyle = {
  backgroundColor: "#fff",
  padding: 30,
  borderRadius: 16,
  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
  width: "90%",
  maxWidth: 700,
  color: "#2E5939",
  boxSizing: 'border-box',
  maxHeight: '85vh',
  overflowY: 'auto',
  border: "2px solid #679750",
};

const detailItemStyle = {
  marginBottom: 20,
  paddingBottom: 20,
  borderBottom: "1px solid rgba(46, 89, 57, 0.1)"
};

const detailLabelStyle = {
  fontWeight: "bold",
  color: "#2E5939",
  marginBottom: 8,
  fontSize: "15px",
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const detailValueStyle = {
  fontSize: 16,
  color: "#2E5939",
  fontWeight: "500",
  lineHeight: "1.5"
};

// ===============================================
// DATOS DE CONFIGURACIÓN
// ===============================================
const API_BASE_URL = "http://localhost:5204/api";
const API_RESERVAS = `${API_BASE_URL}/Reserva`;
const API_CABANAS = `${API_BASE_URL}/Cabana`;
const API_SEDES = `${API_BASE_URL}/Sede`;
const API_PAQUETES = `${API_BASE_URL}/Paquete`;
const API_ESTADOS = `${API_BASE_URL}/EstadosReserva`;
const API_USUARIOS = `${API_BASE_URL}/Usuarios`;
const API_METODOS_PAGO = `${API_BASE_URL}/metodopago`;
const API_SERVICIOS = `${API_BASE_URL}/Servicios`;
const API_SERVICIOS_RESERVA = `${API_BASE_URL}/ServiciosReserva`;

const ITEMS_PER_PAGE = 8;

// ===============================================
// COMPONENTE PRINCIPAL GestionReserva MEJORADO
// ===============================================
const GestionReserva = () => {
  const [reservas, setReservas] = useState([]);
  const [cabinas, setCabinas] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [servicios, setServicios] = useState([]);
 
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentReserva, setCurrentReserva] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reservaToDelete, setReservaToDelete] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newReserva, setNewReserva] = useState({
    idReserva: 0,
    fechaReserva: "",
    fechaEntrada: "",
    fechaRegistro: "",
    abono: 0,
    restante: 0,
    monofiota1: 0,
    idUsuario: "",
    idEstado: "",
    idSede: "",
    idCabana: "",
    idMetodoPago: "",
    idPaquete: "",
    serviciosSeleccionados: []
  });

  // ===============================================
  // FUNCIONES PARA FILTRAR ELEMENTOS ACTIVOS
  // ===============================================
  const serviciosActivos = useMemo(() => {
    return servicios.filter(servicio => {
      if (servicio.estadoServicio === undefined) return true;
      return servicio.estadoServicio === true ||
             servicio.estadoServicio === 1 ||
             servicio.estadoServicio?.toString().toLowerCase() === 'activo';
    });
  }, [servicios]);

  const paquetesActivos = useMemo(() => {
    return paquetes.filter(paquete => {
      if (paquete.estadoPaquete === undefined) return true;
      return paquete.estadoPaquete === true ||
             paquete.estadoPaquete === 1 ||
             paquete.estadoPaquete?.toString().toLowerCase() === 'activo';
    });
  }, [paquetes]);

  const sedesActivas = useMemo(() => {
    return sedes.filter(sede => {
      if (sede.estadoSede === undefined) return true;
      return sede.estadoSede === true ||
             sede.estadoSede === 1 ||
             sede.estadoSede?.toString().toLowerCase() === 'activo';
    });
  }, [sedes]);

  const cabinasActivas = useMemo(() => {
    return cabinas.filter(cabina => {
      if (cabina.estadoCabana === undefined) return true;
      return cabina.estadoCabana === true ||
             cabina.estadoCabana === 1 ||
             cabina.estadoCabana?.toString().toLowerCase() === 'activo';
    });
  }, [cabinas]);

  // ===============================================
  // EFECTOS
  // ===============================================
  useEffect(() => {
    fetchReservas();
    fetchDatosRelacionados();
  }, []);

  useEffect(() => {
    const paqueteSeleccionado = paquetesActivos.find(p => p.idPaquete === parseInt(newReserva.idPaquete));
    const precioPaquete = paqueteSeleccionado ? parseFloat(paqueteSeleccionado.precioPaquete || 0) : 0;

    const preciosServicios = serviciosActivos
      .filter(s => newReserva.serviciosSeleccionados.includes(s.idServicio))
      .map(s => parseFloat(s.precioServicio || 0));
    const totalServicios = preciosServicios.reduce((acc, val) => acc + val, 0);

    const montoTotal = precioPaquete + totalServicios;
    const abono = Math.round(montoTotal * 0.5);
    const restante = montoTotal - abono;

    setNewReserva(prev => ({
      ...prev,
      monofiota1: montoTotal,
      abono: abono,
      restante: restante
    }));
  }, [newReserva.idPaquete, newReserva.serviciosSeleccionados, paquetesActivos, serviciosActivos]);

  // ===============================================
  // FUNCIONES DE LA API
  // ===============================================
  const fetchReservas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_RESERVAS, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
     
      if (Array.isArray(res.data)) {
        setReservas(res.data);
      } else if (res.data && Array.isArray(res.data.$values)) {
        setReservas(res.data.$values);
      } else if (res.data && typeof res.data === 'object') {
        setReservas([res.data]);
      } else {
        throw new Error("Formato de datos inválido");
      }
    } catch (error) {
      console.error("❌ Error al obtener reservas:", error);
      handleApiError(error, "cargar las reservas");
    } finally {
      setLoading(false);
    }
  };

  const fetchDatosRelacionados = async () => {
    try {
      const configuracionPorDefecto = {
        estados: [
          { idEstado: 1, nombreEstado: 'Abonado' },
          { idEstado: 2, nombreEstado: 'Pendiente' },
          { idEstado: 3, nombreEstado: 'Cancelada' },
          { idEstado: 4, nombreEstado: 'Completada' }
        ],
        metodosPago: [
          { idMetodoPago: 1, nombreMetodoPago: "Transferencia" }
        ],
        servicios: []
      };

      const fetchConManejoError = async (url, defaultValue = []) => {
        try {
          const response = await axios.get(url, { timeout: 8000 });
          if (Array.isArray(response.data)) {
            return response.data;
          } else if (response.data && Array.isArray(response.data.$values)) {
            return response.data.$values;
          } else if (response.data && typeof response.data === 'object') {
            return [response.data];
          } else {
            return defaultValue;
          }
        } catch (error) {
          console.warn(`⚠ No se pudieron cargar datos de ${url}:`, error.message);
          return defaultValue;
        }
      };

      const [
        cabinasData,
        sedesData,
        paquetesData,
        usuariosData,
        metodosPagoData,
        serviciosData,
        estadosData
      ] = await Promise.all([
        fetchConManejoError(API_CABANAS),
        fetchConManejoError(API_SEDES),
        fetchConManejoError(API_PAQUETES),
        fetchConManejoError(API_USUARIOS),
        fetchConManejoError(API_METODOS_PAGO, configuracionPorDefecto.metodosPago),
        fetchConManejoError(API_SERVICIOS, configuracionPorDefecto.servicios),
        fetchConManejoError(API_ESTADOS, configuracionPorDefecto.estados)
      ]);

      setCabinas(cabinasData);
      setSedes(sedesData);
      setPaquetes(paquetesData);
      setUsuarios(usuariosData);
      setMetodosPago(metodosPagoData);
      setServicios(serviciosData);
      setEstados(estadosData);

    } catch (error) {
      console.error("❌ Error crítico al cargar datos relacionados:", error);
      setEstados(configuracionPorDefecto.estados);
      setMetodosPago(configuracionPorDefecto.metodosPago);
      setServicios([]);
    }
  };

  const obtenerServiciosReserva = async (idReserva) => {
    try {
      const res = await axios.get(API_SERVICIOS_RESERVA, { timeout: 10000 });
      const datos = Array.isArray(res.data) ? res.data
        : (res.data && Array.isArray(res.data.$values) ? res.data.$values : []);
      return datos.filter(s => s.idReserva != null && s.idReserva.toString() === idReserva.toString());
    } catch (error) {
      console.warn("⚠ Error al obtener servicios de reserva:", error);
      return [];
    }
  };

  const manejarServiciosReserva = async (idReserva, serviciosSeleccionados = []) => {
    try {
      const existentes = await obtenerServiciosReserva(idReserva);
      if (Array.isArray(existentes) && existentes.length > 0) {
        for (const s of existentes) {
          const idToDelete = s.idServicioReserva ?? s.id;
          if (idToDelete != null) {
            await axios.delete(`${API_SERVICIOS_RESERVA}/${idToDelete}`);
          }
        }
      }

      if (!Array.isArray(serviciosSeleccionados) || serviciosSeleccionados.length === 0) return;

      for (const idServ of serviciosSeleccionados) {
        const servicioObj = serviciosActivos.find(s => s.idServicio?.toString() === idServ.toString());
        const precio = servicioObj ? Number(servicioObj.precioServicio || 0) : 0;

        const payload = {
          idServicioReserva: 0,
          idServicio: Number(idServ),
          idReserva: Number(idReserva),
          precio: precio
        };

        await axios.post(API_SERVICIOS_RESERVA, payload, {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (error) {
      console.error("❌ Error al manejar servicios de reserva:", error);
      throw error;
    }
  };

  // ===============================================
  // FUNCIONES PRINCIPALES
  // ===============================================
  const inicializarNuevaReserva = () => {
    const fechaActual = new Date().toISOString().split('T')[0];
   
    const metodoTransferencia = metodosPago.find(m =>
      m.nombreMetodoPago?.toLowerCase() === 'transferencia' ||
      m.nombreMetodoPago?.toLowerCase().includes('transferencia')
    );
   
    const estadoPorId2 = estados.find(e => Number(e.idEstado) === 2);
    const estadoPendienteByName = estados.find(e =>
      e.nombreEstado?.toLowerCase() === 'pendiente' ||
      e.nombreEstado?.toLowerCase().includes('pendiente')
    );
   
    const metodoPagoDefault = metodoTransferencia ||
                             (metodosPago.length > 0 ? metodosPago[0] : null);

    const estadoDefault = estadoPorId2 || estadoPendienteByName ||
                         (estados.length > 0 ? estados[0] : null);

    setNewReserva({
      idReserva: 0,
      fechaReserva: fechaActual,
      fechaEntrada: fechaActual,
      fechaRegistro: fechaActual,
      abono: 0,
      restante: 0,
      monofiota1: 0,
      idUsuario: usuarios.length > 0 ? usuarios[0].idUsuario.toString() : "",
      idEstado: estadoDefault ? String(estadoDefault.idEstado) : "2",
      idSede: sedesActivas.length > 0 ? String(sedesActivas[0].idSede) : "",
      idCabana: cabinasActivas.length > 0 ? String(cabinasActivas[0].idCabana) : "",
      idMetodoPago: metodoPagoDefault ? String(metodoPagoDefault.idMetodoPago) : "1",
      idPaquete: "",
      serviciosSeleccionados: []
    });
  };

  const handleAddReserva = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      try {
        const reservaData = {
          idReserva: isEditing ? newReserva.idReserva : 0,
          fechaReserva: newReserva.fechaReserva,
          fechaEntrada: newReserva.fechaEntrada,
          fechaRegistro: newReserva.fechaRegistro,
          abono: parseFloat(newReserva.abono) || 0,
          restante: parseFloat(newReserva.restante) || 0,
          montoTotal: parseFloat(newReserva.monofiota1) || 0,
          idUsuario: parseInt(newReserva.idUsuario),
          idEstado: parseInt(newReserva.idEstado),
          idSede: parseInt(newReserva.idSede),
          idCabana: parseInt(newReserva.idCabana),
          idMetodoPago: parseInt(newReserva.idMetodoPago),
          idPaquete: newReserva.idPaquete && newReserva.idPaquete !== "" ? parseInt(newReserva.idPaquete) : null
        };

        let response;
        if (isEditing) {
          response = await axios.put(`${API_RESERVAS}/${newReserva.idReserva}`, reservaData, {
            headers: { 'Content-Type': 'application/json' }
          });
          await manejarServiciosReserva(newReserva.idReserva, newReserva.serviciosSeleccionados);
        } else {
          response = await axios.post(API_RESERVAS, reservaData, {
            headers: { 'Content-Type': 'application/json' }
          });

          let idNumeric = null;
          const returned = response.data;

          if (returned != null) {
            if (typeof returned === 'number') {
              idNumeric = Number(returned);
            } else if (returned.idReserva ?? returned.IdReserva ?? returned.id) {
              idNumeric = Number(returned.idReserva ?? returned.IdReserva ?? returned.id);
            }
          }

          if (!idNumeric || isNaN(idNumeric)) {
            const resAll = await axios.get(API_RESERVAS, { timeout: 10000 });
            const lista = Array.isArray(resAll.data) ? resAll.data : (resAll.data?.$values ?? []);
           
            const normalizeDate = (d) => {
              if (!d) return "";
              try { return new Date(d).toISOString().split('T')[0]; } catch { return String(d).split('T')[0]; }
            };

            const found = lista.find(r => {
              const fechaRegApi = normalizeDate(r.fechaRegistro ?? r.fechaRegistro);
              return fechaRegApi === normalizeDate(newReserva.fechaRegistro)
                && String(r.idUsuario) === String(newReserva.idUsuario)
                && String(r.idCabana) === String(newReserva.idCabana)
                && Math.abs(Number(r.monofiota1 ?? r.montoTotal ?? 0) - Number(reservaData.montoTotal)) < 1;
            });

            if (found) {
              idNumeric = Number(found.idReserva ?? found.IdReserva ?? found.id);
            }
          }

          if (idNumeric && !isNaN(idNumeric)) {
            await manejarServiciosReserva(idNumeric, newReserva.serviciosSeleccionados);
          }
        }

        displayAlert(isEditing ? "✅ Reserva actualizada exitosamente." : "✅ Reserva agregada exitosamente.");
        await fetchReservas();
        closeForm();
      } catch (error) {
        console.error("❌ Error al guardar reserva:", error);
        if (error.response) {
          displayAlert(`❌ Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
        } else {
          handleApiError(error, isEditing ? "actualizar la reserva" : "agregar la reserva");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const confirmDelete = async () => {
    if (reservaToDelete) {
      setLoading(true);
      try {
        const idReserva = reservaToDelete.idReserva;
       
        try {
          const serviciosReserva = await obtenerServiciosReserva(idReserva);
          for (const servicio of serviciosReserva) {
            await axios.delete(`${API_SERVICIOS_RESERVA}/${servicio.idServicioReserva}`);
          }
        } catch (error) {
          console.warn("⚠ No se pudieron eliminar servicios asociados:", error);
        }

        await axios.delete(`${API_RESERVAS}/${idReserva}`);
        displayAlert("✅ Reserva eliminada exitosamente.");
        await fetchReservas();
      } catch (error) {
        console.error("❌ Error al eliminar reserva:", error);
        handleApiError(error, "eliminar la reserva");
      } finally {
        setLoading(false);
        setReservaToDelete(null);
        setShowDeleteConfirm(false);
      }
    }
  };

  // ===============================================
  // FUNCIONES AUXILIARES
  // ===============================================
  const handleApiError = (error, operation) => {
    let errorMessage = `Error al ${operation}`;
   
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      errorMessage = "❌ Error de conexión. Verifica que el servidor esté ejecutándose.";
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = "❌ No se puede conectar al servidor en http://localhost:5204";
    } else if (error.response) {
      errorMessage = `❌ Error ${error.response.status}: ${error.response.data?.message || 'Error del servidor'}`;
    } else if (error.request) {
      errorMessage = "❌ No hay respuesta del servidor.";
    }
   
    setError(errorMessage);
    displayAlert(errorMessage);
  };

  const displayAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage("");
    }, 4000);
  };

  const validateForm = () => {
    const requiredFields = [
      'fechaReserva', 'fechaEntrada', 'fechaRegistro',
      'monofiota1', 'abono', 'restante',
      'idUsuario', 'idEstado', 'idSede', 'idCabana', 'idMetodoPago'
    ];

    for (const field of requiredFields) {
      if (!newReserva[field]) {
        displayAlert(`❌ El campo ${field.replace('id', '').replace('fechaEntrada', 'Fecha Entrada').replace('monofiota1', 'Monto Total')} es obligatorio.`);
        return false;
      }
    }

    const hoy = new Date().toISOString().split('T')[0];
    if (newReserva.fechaEntrada < hoy) {
      displayAlert("❌ La fecha de entrada no puede ser anterior a hoy.");
      return false;
    }

    if (parseFloat(newReserva.monofiota1) <= 0) {
      displayAlert("❌ El monto total debe ser mayor a 0.");
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
   
    if ((name === 'fechaRegistro' || name === 'idEstado') && !isEditing) {
      return;
    }
   
    setNewReserva((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setNewReserva({
      idReserva: 0,
      fechaReserva: "",
      fechaEntrada: "",
      fechaRegistro: "",
      abono: 0,
      restante: 0,
      monofiota1: 0,
      idUsuario: "",
      idEstado: "",
      idSede: "",
      idCabana: "",
      idMetodoPago: "",
      idPaquete: "",
      serviciosSeleccionados: []
    });
    setError(null);
  };

  const closeDetailsModal = () => {
    setShowDetails(false);
    setCurrentReserva(null);
  };

  const cancelDelete = () => {
    setReservaToDelete(null);
    setShowDeleteConfirm(false);
  };

  const handleView = async (reserva) => {
    try {
      const serviciosNormalizados = await obtenerServiciosReserva(reserva.idReserva)
        .then(servicios => servicios.map(s => s.idServicio));
     
      setCurrentReserva({
        ...reserva,
        serviciosSeleccionados: serviciosNormalizados
      });
      setShowDetails(true);
    } catch (error) {
      console.error("❌ Error al cargar detalles:", error);
      setCurrentReserva(reserva);
      setShowDetails(true);
    }
  };

  const handleEdit = async (reserva) => {
    try {
      const serviciosNormalizados = await obtenerServiciosReserva(reserva.idReserva)
        .then(servicios => servicios.map(s => s.idServicio));

      setNewReserva({
        idReserva: reserva.idReserva,
        fechaReserva: formatDateForInput(reserva.fechaReserva),
        fechaEntrada: formatDateForInput(reserva.fechafintrada || reserva.fechaEntrada),
        fechaRegistro: formatDateForInput(reserva.fechaRegistro),
        abono: reserva.abono || 0,
        restante: reserva.restante || 0,
        monofiota1: reserva.monofiota1 || reserva.montoTotal || 0,
        idUsuario: reserva.idUsuario?.toString() || "",
        idEstado: reserva.idEstado?.toString() || "",
        idSede: reserva.idSede?.toString() || "",
        idCabana: reserva.idCabana?.toString() || "",
        idMetodoPago: reserva.idMetodoPago?.toString() || "",
        idPaquete: reserva.idPaquete?.toString() || "",
        serviciosSeleccionados: serviciosNormalizados
      });
      setIsEditing(true);
      setShowForm(true);
    } catch (error) {
      console.error("❌ Error al cargar datos para edición:", error);
      displayAlert("❌ Error al cargar los datos de la reserva");
    }
  };

  const handleDeleteClick = (reserva) => {
    setReservaToDelete(reserva);
    setShowDeleteConfirm(true);
  };

  const getServiciosDetalle = (serviciosIds) => {
    if (!Array.isArray(serviciosIds) || serviciosIds.length === 0) return [];
   
    return serviciosIds
      .map(id => {
        const servicio = serviciosActivos.find(s => s.idServicio === id);
        return servicio ? {
          id: servicio.idServicio,
          nombre: servicio.nombreServicio,
          precio: servicio.precioServicio || 0
        } : null;
      })
      .filter(serv => serv !== null);
  };

  // ===============================================
  // FUNCIONES DE FORMATO
  // ===============================================
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

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // ===============================================
  // FUNCIONES PARA OBTENER NOMBRES
  // ===============================================
  const getCabinaNombre = (idCabana) => {
    const cabina = cabinasActivas.find(c => c.idCabana === idCabana);
    return cabina ? `${cabina.nombre} (${cabina.tipoCabana || 'Tipo no especificado'})` : `Cabaña ${idCabana}`;
  };

  const getSedeNombre = (idSede) => {
    const sede = sedesActivas.find(s => s.idSede === idSede);
    return sede ? sede.nombreSede : `Sede ${idSede}`;
  };

  const getPaqueteNombre = (idPaquete) => {
    if (!idPaquete || idPaquete === 0) return 'No aplica';
    const paquete = paquetesActivos.find(p => p.idPaquete === idPaquete);
    return paquete ? paquete.nombrePaquete : `Paquete ${idPaquete}`;
  };

  const getEstadoNombre = (idEstado) => {
    const estado = estados.find(e => e.idEstado === idEstado);
    return estado ? estado.nombreEstado : `Estado ${idEstado}`;
  };

  const getUsuarioNombre = (idUsuario) => {
    const usuario = usuarios.find(u => u.idUsuario === idUsuario);
    return usuario ? `${usuario.nombre} ${usuario.apellido || ''}` : `Usuario ${idUsuario}`;
  };

  const getMetodoPagoNombre = (idMetodoPago) => {
    const metodo = metodosPago.find(m => m.idMetodoPago === idMetodoPago);
    return metodo ? metodo.nombreMetodoPago : `Método ${idMetodoPago}`;
  };

  const getEstadoColor = (idEstado) => {
    const estado = getEstadoNombre(idEstado).toLowerCase();
    if (estado.includes('abonado') || estado.includes('completada')) return '#4caf50';
    if (estado.includes('pendiente')) return '#ff9800';
    if (estado.includes('cancelada')) return '#f44336';
    return '#757575';
  };

  // ===============================================
  // FUNCIONES DE FILTRADO Y PAGINACIÓN
  // ===============================================
  const filteredReservas = useMemo(() => {
    return reservas.filter(reserva =>
      getCabinaNombre(reserva.idCabana)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getSedeNombre(reserva.idSede)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getEstadoNombre(reserva.idEstado)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUsuarioNombre(reserva.idUsuario)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reserva.idReserva?.toString().includes(searchTerm)
    );
  }, [reservas, searchTerm, cabinasActivas, sedesActivas, estados, usuarios]);

  const totalPages = Math.ceil(filteredReservas.length / ITEMS_PER_PAGE);

  const paginatedReservas = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReservas.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredReservas, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getDiasPaquete = () => {
    if (!newReserva.idPaquete) return 1;
    const paquete = paquetesActivos.find(p => p.idPaquete === parseInt(newReserva.idPaquete));
    return paquete && paquete.dias ? parseInt(paquete.dias) : 1;
  };

  // ===============================================
  // ESTADÍSTICAS
  // ===============================================
  const estadisticas = useMemo(() => {
    const total = reservas.length;
    const pendientes = reservas.filter(r => getEstadoNombre(r.idEstado).toLowerCase().includes('pendiente')).length;
    const abonadas = reservas.filter(r => getEstadoNombre(r.idEstado).toLowerCase().includes('abonado')).length;
    const completadas = reservas.filter(r => getEstadoNombre(r.idEstado).toLowerCase().includes('completada')).length;
    const totalIngresos = reservas.reduce((sum, r) => sum + (r.monofiota1 || r.montoTotal || 0), 0);

    return { total, pendientes, abonadas, completadas, totalIngresos };
  }, [reservas]);

  // ===============================================
  // FUNCIÓN PARA GENERAR PDF
  // ===============================================
  const handleDownloadPDF = async (reserva) => {
    let serviciosDetalle = [];
    try {
      const serviciosReserva = await obtenerServiciosReserva(reserva.idReserva);
      serviciosDetalle = serviciosReserva.map(s => {
        const servicio = serviciosActivos.find(serv => serv.idServicio === s.idServicio);
        return servicio
          ? { nombre: servicio.nombreServicio, precio: servicio.precioServicio }
          : { nombre: `Servicio ${s.idServicio}`, precio: s.precio };
      });
    } catch {
      serviciosDetalle = [];
    }

    const doc = new jsPDF();
   
    // ENCABEZADO MEJORADO
    doc.setFillColor(46, 89, 57);
    doc.rect(0, 0, 210, 40, 'F');
   
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text("🏕", 20, 25);
    doc.text("GLAMPING LUXURY", 35, 25);
   
    doc.setFontSize(12);
    doc.setTextColor(200, 200, 200);
    doc.text("Vereda El Descanso, Villeta - Cundinamarca", 35, 32);
   
    doc.setFontSize(20);
    doc.setTextColor(46, 89, 57);
    doc.text("COMPROBANTE DE RESERVA", 105, 55, { align: "center" });
   
    doc.setDrawColor(103, 151, 80);
    doc.setLineWidth(1);
    doc.line(20, 60, 190, 60);
   
    let y = 70;

    // INFORMACIÓN PRINCIPAL EN DOS COLUMNAS
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(46, 89, 57);
    doc.text("INFORMACIÓN DE LA RESERVA", 20, y);
    y += 10;
   
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
   
    doc.text(`ID Reserva: #${reserva.idReserva}`, 20, y);
    doc.text(`Estado: ${getEstadoNombre(reserva.idEstado)}`, 20, y + 6);
    doc.text(`Usuario: ${getUsuarioNombre(reserva.idUsuario)}`, 20, y + 12);
    doc.text(`Cabaña: ${getCabinaNombre(reserva.idCabana)}`, 20, y + 18);
    doc.text(`Sede: ${getSedeNombre(reserva.idSede)}`, 20, y + 24);
   
    doc.text(`Fecha Entrada: ${formatDate(reserva.fechafintrada || reserva.fechaEntrada)}`, 110, y);
    doc.text(`Fecha Salida: ${formatDate(reserva.fechaReserva)}`, 110, y + 6);
    doc.text(`Fecha Registro: ${formatDate(reserva.fechaRegistro)}`, 110, y + 12);
    doc.text(`Paquete: ${getPaqueteNombre(reserva.idPaquete)}`, 110, y + 18);
    doc.text(`Método de Pago: ${getMetodoPagoNombre(reserva.idMetodoPago)}`, 110, y + 24);
   
    y += 35;

    // DETALLES DE PAGO CON DISEÑO MEJORADO
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(46, 89, 57);
    doc.text("DETALLES DE PAGO", 20, y);
    y += 8;
   
    doc.setFillColor(247, 244, 234);
    doc.roundedRect(20, y, 170, 25, 3, 3, 'F');
   
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(46, 89, 57);
   
    doc.text("Monto Total:", 30, y + 8);
    doc.text("Abono (50%):", 30, y + 16);
    doc.text("Restante:", 30, y + 24);
   
    doc.setTextColor(0, 0, 0);
    doc.text(formatCurrency(reserva.monofiota1 || reserva.montoTotal), 120, y + 8);
    doc.text(formatCurrency(reserva.abono), 120, y + 16);
    doc.text(formatCurrency(reserva.restante), 120, y + 24);
   
    y += 35;

    // SERVICIOS EXTRAS CON DISEÑO MEJORADO
    if (serviciosDetalle.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(46, 89, 57);
      doc.text("SERVICIOS EXTRAS ADICIONALES", 20, y);
      y += 8;
     
      const serviciosTable = serviciosDetalle.map(servicio => [
        servicio.nombre,
        formatCurrency(servicio.precio)
      ]);
     
      const totalServicios = serviciosDetalle.reduce((total, serv) => total + (serv.precio || 0), 0);
      serviciosTable.push(['TOTAL SERVICIOS', formatCurrency(totalServicios)]);
     
      doc.autoTable({
        startY: y,
        head: [['Servicio', 'Precio']],
        body: serviciosTable,
        theme: 'grid',
        headStyles: {
          fillColor: [46, 89, 57],
          textColor: 255,
          fontStyle: 'bold'
        },
        bodyStyles: {
          textColor: [0, 0, 0]
        },
        alternateRowStyles: {
          fillColor: [247, 244, 234]
        },
        styles: {
          fontSize: 10,
          cellPadding: 3
        },
        margin: { left: 20, right: 20 }
      });
     
      y = doc.lastAutoTable.finalY + 10;
    }

    // RESUMEN FINAL
    const montoTotal = reserva.monofiota1 || reserva.montoTotal || 0;
    const totalServicios = serviciosDetalle.reduce((total, serv) => total + (serv.precio || 0), 0);
   
    doc.setFillColor(46, 89, 57);
    doc.roundedRect(20, y, 170, 25, 3, 3, 'F');
   
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text("RESUMEN FINAL", 105, y + 8, { align: "center" });
   
    doc.setFontSize(11);
    doc.text(`Total Reserva: ${formatCurrency(montoTotal - totalServicios)}`, 30, y + 16);
    doc.text(`+ Servicios: ${formatCurrency(totalServicios)}`, 30, y + 22);
   
    doc.setFontSize(13);
    doc.text(`TOTAL: ${formatCurrency(montoTotal)}`, 140, y + 19, { align: "right" });
   
    y += 35;

    // PIE DE PÁGINA MEJORADO
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
   
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    y += 10;
   
    doc.text("Glamping Luxury - Experiencias Únicas en la Naturaleza", 105, y, { align: "center" });
    y += 5;
    doc.text("📍 Vereda El Descanso, Villeta, Cundinamarca", 105, y, { align: "center" });
    y += 5;
    doc.text("📞 Tel: 310 123 4567 | ✉ Email: info@glampingluxury.com", 105, y, { align: "center" });
    y += 5;
    doc.text("🌐 www.glampingluxury.com", 105, y, { align: "center" });
    y += 10;
   
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Este documento es un comprobante de reserva generado automáticamente.", 105, y, { align: "center" });
    y += 4;
    doc.text("Para consultas o modificaciones contacte con nuestro equipo de soporte.", 105, y, { align: "center" });
    y += 4;
    doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}`, 105, y, { align: "center" });

    doc.save(`Reserva_${reserva.idReserva}_GlampingLuxury.pdf`);
    displayAlert("✅ PDF generado exitosamente.");
  };

  // ===============================================
  // COMPONENTE FormField REUTILIZABLE
  // ===============================================
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
      <div style={{ marginBottom: '16px', ...style }}>
        <label style={labelStyle}>
          {icon && <span style={{ marginRight: '8px' }}>{icon}</span>}
          {label}
          {required && <span style={{ color: "#e57373", marginLeft: '4px' }}>*</span>}
        </label>
        {type === "select" ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            style={{
              ...inputStyle,
              ...(disabled && inputDisabledStyle),
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232E5939' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '16px'
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
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            style={{
              ...inputStyle,
              ...(disabled && inputDisabledStyle)
            }}
            required={required}
            disabled={disabled}
          />
        )}
      </div>
    );
  };

  // ===============================================
  // COMPONENTES DE MODALES
  // ===============================================
  const DetailsModal = () => {
    if (!showDetails || !currentReserva) return null;

    return (
      <div style={modalOverlayStyle}>
        <div style={detailsModalStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h2 style={{ margin: 0, color: "#2E5939", fontSize: "24px" }}>
              Detalles de la Reserva #{currentReserva.idReserva}
            </h2>
            <button
              onClick={closeDetailsModal}
              style={{
                background: "none",
                border: "none",
                color: "#2E5939",
                fontSize: "20px",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "50%",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "rgba(46, 89, 57, 0.1)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              <FaTimes />
            </button>
          </div>
         
          <div>
            {/* Fechas */}
            <div style={detailItemStyle}>
              <div style={detailLabelStyle}>
                <FaCalendarAlt /> Fechas
              </div>
              <div style={detailValueStyle}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div><strong>Entrada:</strong> {formatDate(currentReserva.fechafintrada || currentReserva.fechaEntrada)}</div>
                  <div><strong>Salida:</strong> {formatDate(currentReserva.fechaReserva)}</div>
                  <div><strong>Registro:</strong> {formatDate(currentReserva.fechaRegistro)}</div>
                </div>
              </div>
            </div>
           
            {/* Información de Pago */}
            <div style={detailItemStyle}>
              <div style={detailLabelStyle}>
                <FaMoneyBillAlt /> Información de Pago
              </div>
              <div style={detailValueStyle}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div><strong>Monto Total:</strong> {formatCurrency(currentReserva.monofiota1 || currentReserva.montoTotal)}</div>
                  <div><strong>Abono:</strong> {formatCurrency(currentReserva.abono)}</div>
                  <div><strong>Restante:</strong> {formatCurrency(currentReserva.restante)}</div>
                  <div><strong>Método de Pago:</strong> {getMetodoPagoNombre(currentReserva.idMetodoPago)}</div>
                </div>
              </div>
            </div>
           
            {/* Detalles de la Reserva */}
            <div style={detailItemStyle}>
              <div style={detailLabelStyle}>
                <FaHome /> Detalles de la Reserva
              </div>
              <div style={detailValueStyle}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div><strong>Sede:</strong> {getSedeNombre(currentReserva.idSede)}</div>
                  <div><strong>Cabaña:</strong> {getCabinaNombre(currentReserva.idCabana)}</div>
                  <div><strong>Paquete:</strong> {getPaqueteNombre(currentReserva.idPaquete)}</div>
                  <div><strong>Estado:</strong>
                    <span style={{
                      color: getEstadoColor(currentReserva.idEstado),
                      fontWeight: 'bold',
                      marginLeft: '8px',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(46, 89, 57, 0.1)',
                      fontSize: '14px'
                    }}>
                      {getEstadoNombre(currentReserva.idEstado)}
                    </span>
                  </div>
                  <div><strong>Usuario:</strong> {getUsuarioNombre(currentReserva.idUsuario)}</div>
                </div>
              </div>
            </div>

            {/* Servicios Extras */}
            <div style={detailItemStyle}>
              <div style={detailLabelStyle}>
                <FaBox /> Servicios Extras
              </div>
              <div style={detailValueStyle}>
                {(() => {
                  const serviciosDetalle = getServiciosDetalle(
                    Array.isArray(currentReserva.serviciosSeleccionados)
                      ? currentReserva.serviciosSeleccionados
                      : []
                  );
                 
                  if (serviciosDetalle.length > 0) {
                    return (
                      <div>
                        <div style={{ 
                          display: 'grid', 
                          gap: '8px',
                          marginBottom: '16px'
                        }}>
                          {serviciosDetalle.map((serv, idx) => (
                            <div key={idx} style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '12px',
                              backgroundColor: '#f8f9fa',
                              borderRadius: '8px',
                              border: '1px solid rgba(46, 89, 57, 0.1)'
                            }}>
                              <span style={{ fontWeight: '500' }}>{serv.nombre}</span>
                              <span style={{ 
                                color: '#2E5939', 
                                fontWeight: 'bold',
                                fontSize: '14px'
                              }}>
                                {formatCurrency(serv.precio)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div style={{ 
                          padding: '12px', 
                          backgroundColor: '#E8F5E8', 
                          borderRadius: '8px',
                          border: '1px solid #679750',
                          textAlign: 'center'
                        }}>
                          <strong style={{ color: '#2E5939', fontSize: '15px' }}>
                            Total servicios: {formatCurrency(
                              serviciosDetalle.reduce((total, serv) => total + (serv.precio || 0), 0)
                            )}
                          </strong>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div style={{ 
                        textAlign: 'center', 
                        color: '#999', 
                        padding: '20px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px'
                      }}>
                        No se seleccionaron servicios extras.
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
          </div>

          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: "12px", 
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(46, 89, 57, 0.1)"
          }}>
            <button
              onClick={() => handleDownloadPDF(currentReserva)}
              style={{
                backgroundColor: "#e57373",
                color: "white",
                padding: "12px 24px",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: "600",
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#d32f2f";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#e57373";
                e.target.style.transform = "translateY(0)";
              }}
            >
              <FaFilePdf /> Descargar PDF
            </button>
            <button
              onClick={closeDetailsModal}
              style={{
                backgroundColor: "#2E5939",
                color: "#fff",
                padding: "12px 24px",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
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
    );
  };

  const DeleteConfirmModal = () => {
    if (!showDeleteConfirm || !reservaToDelete) return null;

    return (
      <div style={modalOverlayStyle}>
        <div style={{ ...modalContentStyle, maxWidth: 480, textAlign: 'center' }}>
          <div style={{ 
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <FaExclamationTriangle style={{ color: '#856404' }} />
              <strong style={{ color: '#856404' }}>Confirmar Eliminación</strong>
            </div>
            <p style={{ color: '#856404', margin: 0, fontSize: '14px' }}>
              ¿Estás seguro de eliminar la reserva del usuario <strong>{getUsuarioNombre(reservaToDelete.idUsuario)}</strong>?
            </p>
          </div>

          <div style={{ 
            backgroundColor: '#f8f9fa',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
            textAlign: 'left'
          }}>
            <div style={{ fontSize: '14px', color: '#2E5939', marginBottom: '8px' }}>
              <strong>Detalles de la reserva:</strong>
            </div>
            <div style={{ fontSize: '13px', color: '#666' }}>
              <div>• Cabaña: {getCabinaNombre(reservaToDelete.idCabana)}</div>
              <div>• Fecha Entrada: {formatDate(reservaToDelete.fechaEntrada)}</div>
              <div>• Monto: {formatCurrency(reservaToDelete.monofiota1)}</div>
              <div>• Estado: {getEstadoNombre(reservaToDelete.idEstado)}</div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
            <button
              onClick={confirmDelete}
              disabled={loading}
              style={{
                backgroundColor: loading ? "#ccc" : "#e57373",
                color: "white",
                padding: "12px 24px",
                border: "none",
                borderRadius: 10,
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "600",
                flex: 1,
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = "#d32f2f";
                  e.target.style.transform = "translateY(-2px)";
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = "#e57373";
                  e.target.style.transform = "translateY(0)";
                }
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Eliminando...
                </div>
              ) : (
                "Sí, Eliminar"
              )}
            </button>
            <button
              onClick={cancelDelete}
              disabled={loading}
              style={{
                backgroundColor: loading ? "#ccc" : "#2E5939",
                color: "#fff",
                padding: "12px 24px",
                border: "none",
                borderRadius: 10,
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "600",
                flex: 1,
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.background = "linear-gradient(90deg, #67d630, #95d34e)";
                  e.target.style.transform = "translateY(-2px)";
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.target.style.background = "#2E5939";
                  e.target.style.transform = "translateY(0)";
                }
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ===============================================
  // ESTILOS CSS PARA ANIMACIONES
  // ===============================================
  useEffect(() => {
    const styles = `
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
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // ===============================================
  // RENDER FINAL DEL COMPONENTE
  // ===============================================
  return (
    <div style={{ position: "relative", padding: 24, marginLeft: 260, backgroundColor: "#f5f8f2", minHeight: "100vh" }}>
     
      {/* Alerta Mejorada */}
      {showAlert && (
        <div style={{
          ...alertStyle,
          backgroundColor: alertMessage.includes('❌') ? '#e57373' : '#2E5939',
          animation: 'slideInRight 0.3s ease-out'
        }}>
          {alertMessage.includes('❌') ? <FaExclamationTriangle /> : <FaCheck />}
          <span>{alertMessage}</span>
          <button
            onClick={() => setShowAlert(false)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'white', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
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
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          color: '#856404'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <FaExclamationTriangle />
            <strong>Error de conexión</strong>
          </div>
          <p style={{ margin: 0 }}>{error}</p>
          <div style={{ marginTop: '12px' }}>
            <button
              onClick={fetchReservas}
              style={{
                backgroundColor: '#2E5939',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginRight: '10px',
                fontWeight: '600'
              }}
            >
              Reintentar
            </button>
            <button
              onClick={() => setError(null)}
              style={{
                backgroundColor: '#757575',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Ocultar
            </button>
          </div>
        </div>
      )}

      {/* Header Mejorado */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, color: "#2E5939", fontSize: "28px", fontWeight: "700" }}>Gestión de Reservas</h2>
          <p style={{ margin: "8px 0 0 0", color: "#679750", fontSize: "15px" }}>
            Administra y controla todas las reservas del sistema
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            onClick={fetchReservas}
            style={{
              backgroundColor: "#679750",
              color: "white",
              padding: "12px 16px",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: "600",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.background = "linear-gradient(90deg, #67d630, #95d34e)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "#679750";
              e.target.style.transform = "translateY(0)";
            }}
            title="Actualizar lista"
          >
            <FaSync /> Actualizar
          </button>
          <button
            onClick={() => {
              setShowForm(true);
              setIsEditing(false);
              inicializarNuevaReserva();
            }}
            style={{
              backgroundColor: "#2E5939",
              color: "white",
              padding: "14px 24px",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: "600",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
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
            <FaPlus /> Nueva Reserva
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px', 
        marginBottom: '24px' 
      }}>
        <div style={statCardStyle}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2E5939', marginBottom: '8px' }}>
            {estadisticas.total}
          </div>
          <div style={{ color: '#679750', fontSize: '14px', fontWeight: '600' }}>
            Total Reservas
          </div>
        </div>
        <div style={statCardStyle}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff9800', marginBottom: '8px' }}>
            {estadisticas.pendientes}
          </div>
          <div style={{ color: '#679750', fontSize: '14px', fontWeight: '600' }}>
            Pendientes
          </div>
        </div>
        <div style={statCardStyle}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4caf50', marginBottom: '8px' }}>
            {estadisticas.abonadas}
          </div>
          <div style={{ color: '#679750', fontSize: '14px', fontWeight: '600' }}>
            Abonadas
          </div>
        </div>
        <div style={statCardStyle}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2196f3', marginBottom: '8px' }}>
            {formatCurrency(estadisticas.totalIngresos)}
          </div>
          <div style={{ color: '#679750', fontSize: '14px', fontWeight: '600' }}>
            Ingresos Totales
          </div>
        </div>
      </div>

      {/* Barra de búsqueda mejorada */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '24px', 
        alignItems: 'center',
        padding: '20px',
        ...cardStyle
      }}>
        <div style={{ position: "relative", flex: 1 }}>
          <FaSearch style={{ 
            position: "absolute", 
            left: 16, 
            top: "50%", 
            transform: "translateY(-50%)", 
            color: "#2E5939" 
          }} />
          <input
            type="text"
            placeholder="Buscar por cabaña, sede, estado, usuario o ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: "14px 14px 14px 45px",
              borderRadius: 10,
              border: "1px solid #ddd",
              width: "100%",
              backgroundColor: "#F7F4EA",
              color: "#2E5939",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              fontSize: "15px"
            }}
          />
        </div>
        <div style={{ 
          color: '#2E5939', 
          fontSize: '14px', 
          whiteSpace: 'nowrap',
          fontWeight: '600',
          backgroundColor: '#E8F5E8',
          padding: '8px 16px',
          borderRadius: '8px'
        }}>
          {filteredReservas.length} {filteredReservas.length === 1 ? 'resultado' : 'resultados'}
        </div>
      </div>

      {/* Formulario de Reserva */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={{...modalContentStyle, maxWidth: 750}}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ margin: 0, color: "#2E5939", fontSize: "24px" }}>
                {isEditing ? "Editar Reserva" : "Nueva Reserva"}
              </h2>
              <button
                onClick={closeForm}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2E5939",
                  fontSize: "20px",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "50%",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "rgba(46, 89, 57, 0.1)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                <FaTimes />
              </button>
            </div>
           
            <form onSubmit={handleAddReserva}>
              {/* Sección de Información Básica */}
              <div style={{ 
                backgroundColor: '#FBFDF9', 
                padding: '20px', 
                borderRadius: '12px',
                marginBottom: '20px',
                border: '1px solid rgba(103, 151, 80, 0.1)'
              }}>
                <h3 style={{ color: '#2E5939', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaUser /> Información Básica
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <FormField
                    label="Usuario"
                    name="idUsuario"
                    type="select"
                    value={newReserva.idUsuario}
                    onChange={handleInputChange}
                    options={usuarios.map(u => ({ value: u.idUsuario, label: `${u.nombre} ${u.apellido || ''}` }))}
                    required={true}
                    icon={<FaUser />}
                  />
                  <FormField
                    label="Sede"
                    name="idSede"
                    type="select"
                    value={newReserva.idSede}
                    onChange={handleInputChange}
                    options={sedesActivas.map(s => ({ value: s.idSede, label: s.nombreSede }))}
                    required={true}
                    icon={<FaMapMarkerAlt />}
                  />
                </div>
              </div>

              {/* Sección de Alojamiento */}
              <div style={{ 
                backgroundColor: '#FBFDF9', 
                padding: '20px', 
                borderRadius: '12px',
                marginBottom: '20px',
                border: '1px solid rgba(103, 151, 80, 0.1)'
              }}>
                <h3 style={{ color: '#2E5939', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaHome /> Alojamiento
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <FormField
                    label="Cabaña"
                    name="idCabana"
                    type="select"
                    value={newReserva.idCabana}
                    onChange={handleInputChange}
                    options={cabinasActivas.map(c => ({ value: c.idCabana, label: `${c.nombre} - ${c.tipoCabana || 'Sin tipo'}` }))}
                    required={true}
                    icon={<FaHome />}
                  />
                  <FormField
                    label="Paquete"
                    name="idPaquete"
                    type="select"
                    value={newReserva.idPaquete}
                    onChange={handleInputChange}
                    options={[{ value: '', label: 'Sin paquete' }, ...paquetesActivos.map(p => ({ value: p.idPaquete, label: p.nombrePaquete }))]}
                    icon={<FaBox />}
                  />
                </div>
              </div>

              {/* Sección de Servicios Extras */}
              <div style={{ 
                backgroundColor: '#FBFDF9', 
                padding: '20px', 
                borderRadius: '12px',
                marginBottom: '20px',
                border: '1px solid rgba(103, 151, 80, 0.1)'
              }}>
                <h3 style={{ color: '#2E5939', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaBox /> Servicios Extras
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '12px',
                  maxHeight: '150px',
                  overflowY: 'auto',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9'
                }}>
                  {serviciosActivos.map(servicio => (
                    <label
                      key={servicio.idServicio}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        borderRadius: '6px',
                        backgroundColor: Array.isArray(newReserva.serviciosSeleccionados) &&
                          newReserva.serviciosSeleccionados.map(id => Number(id)).includes(Number(servicio.idServicio))
                          ? '#e8f5e8' : 'transparent',
                        transition: 'background-color 0.2s',
                        cursor: 'pointer',
                        border: '1px solid rgba(46, 89, 57, 0.1)'
                      }}
                    >
                      <input
                        type="checkbox"
                        value={servicio.idServicio}
                        checked={Array.isArray(newReserva.serviciosSeleccionados) &&
                          newReserva.serviciosSeleccionados.map(id => Number(id)).includes(Number(servicio.idServicio))}
                        onChange={e => {
                          const checked = e.target.checked;
                          setNewReserva(prev => {
                            const serviciosActuales = Array.isArray(prev.serviciosSeleccionados)
                              ? prev.serviciosSeleccionados.map(id => Number(id))
                              : [];
                            return {
                              ...prev,
                              serviciosSeleccionados: checked
                                ? [...serviciosActuales, Number(servicio.idServicio)]
                                : serviciosActuales.filter(id => id !== Number(servicio.idServicio))
                            };
                          });
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '500', fontSize: '14px' }}>{servicio.nombreServicio}</div>
                        <div style={{ fontSize: '12px', color: '#679750', fontWeight: '600' }}>
                          {formatCurrency(servicio.precioServicio || 0)}
                        </div>
                      </div>
                    </label>
                  ))}
                  {serviciosActivos.length === 0 && (
                    <span style={{ color: '#999', fontSize: '14px', gridColumn: '1 / -1', textAlign: 'center' }}>
                      No hay servicios extras disponibles
                    </span>
                  )}
                </div>
              </div>

              {/* Sección de Fechas */}
              <div style={{ 
                backgroundColor: '#FBFDF9', 
                padding: '20px', 
                borderRadius: '12px',
                marginBottom: '20px',
                border: '1px solid rgba(103, 151, 80, 0.1)'
              }}>
                <h3 style={{ color: '#2E5939', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaCalendarAlt /> Fechas
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <FormField
                    label="Fecha Entrada"
                    name="fechaEntrada"
                    type="date"
                    value={newReserva.fechaEntrada}
                    onChange={handleInputChange}
                    required={true}
                  />
                  <FormField
                    label="Fecha Salida"
                    name="fechaReserva"
                    type="date"
                    value={newReserva.fechaReserva}
                    onChange={handleInputChange}
                    required={true}
                  />
                  <FormField
                    label="Fecha Registro"
                    name="fechaRegistro"
                    type="date"
                    value={newReserva.fechaRegistro}
                    disabled={true}
                  />
                </div>
              </div>

              {/* Sección de Pagos */}
              <div style={{ 
                backgroundColor: '#FBFDF9', 
                padding: '20px', 
                borderRadius: '12px',
                marginBottom: '20px',
                border: '1px solid rgba(103, 151, 80, 0.1)'
              }}>
                <h3 style={{ color: '#2E5939', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaMoneyBillAlt /> Información de Pago
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <FormField
                    label="Monto Total"
                    name="monofiota1"
                    type="number"
                    value={newReserva.monofiota1}
                    disabled={true}
                  />
                  <FormField
                    label="Abono (50%)"
                    name="abono"
                    type="number"
                    value={newReserva.abono}
                    disabled={true}
                  />
                  <FormField
                    label="Restante"
                    name="restante"
                    type="number"
                    value={newReserva.restante}
                    disabled={true}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                  <FormField
                    label="Estado"
                    name="idEstado"
                    type="select"
                    value={newReserva.idEstado}
                    onChange={handleInputChange}
                    options={estados.map(e => ({ value: e.idEstado, label: e.nombreEstado }))}
                    required={true}
                    disabled={!isEditing}
                  />
                  <FormField
                    label="Método de Pago"
                    name="idMetodoPago"
                    type="select"
                    value={newReserva.idMetodoPago}
                    options={metodosPago.map(m => ({ value: m.idMetodoPago, label: m.nombreMetodoPago }))}
                    required={true}
                    disabled={true}
                    icon={<FaCreditCard />}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? "#ccc" : "#2E5939",
                    color: "#fff",
                    padding: "14px 24px",
                    border: "none",
                    borderRadius: 10,
                    cursor: loading ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    flex: 1,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    transition: "all 0.3s ease",
                    fontSize: "15px"
                  }}
                  onMouseOver={(e) => {
                    if (!loading) {
                      e.target.style.background = "linear-gradient(90deg, #67d630, #95d34e)";
                      e.target.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loading) {
                      e.target.style.background = "#2E5939";
                      e.target.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid transparent',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Guardando...
                    </div>
                  ) : (
                    isEditing ? "Actualizar Reserva" : "Crear Reserva"
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={loading}
                  style={{
                    backgroundColor: "#f8f9fa",
                    color: "#2E5939",
                    padding: "14px 24px",
                    border: "1px solid #ddd",
                    borderRadius: 10,
                    cursor: loading ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    flex: 1,
                    transition: "all 0.3s ease"
                  }}
                  onMouseOver={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = "#e9ecef";
                      e.target.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = "#f8f9fa";
                      e.target.style.transform = "translateY(0)";
                    }
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla de Reservas Mejorada */}
      <div style={cardStyle}>
        {loading ? (
          <div style={{
            textAlign: "center",
            padding: "60px",
            color: "#2E5939"
          }}>
            <div style={{ fontSize: '18px', marginBottom: '16px' }}>
              🔄 Cargando reservas...
            </div>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #2E5939',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
          </div>
        ) : (
          <>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#fff",
              color: "#2E5939",
            }}>
              <thead>
                <tr style={{ 
                  backgroundColor: "#679750", 
                  color: "#fff",
                  borderBottom: "2px solid #2E5939"
                }}>
                  <th style={{ padding: "18px 16px", textAlign: "left", fontWeight: "600", fontSize: "14px" }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaUser /> Usuario
                    </div>
                  </th>
                  <th style={{ padding: "18px 16px", textAlign: "left", fontWeight: "600", fontSize: "14px" }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaHome /> Cabaña
                    </div>
                  </th>
                  <th style={{ padding: "18px 16px", textAlign: "center", fontWeight: "600", fontSize: "14px" }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                      <FaCalendarAlt /> Fechas
                    </div>
                  </th>
                  <th style={{ padding: "18px 16px", textAlign: "center", fontWeight: "600", fontSize: "14px" }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                      <FaMoneyBillAlt /> Monto
                    </div>
                  </th>
                  <th style={{ padding: "18px 16px", textAlign: "center", fontWeight: "600", fontSize: "14px" }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                      <FaCreditCard /> Estado
                    </div>
                  </th>
                  <th style={{ padding: "18px 16px", textAlign: "center", fontWeight: "600", fontSize: "14px" }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedReservas.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "60px", textAlign: "center", color: "#2E5939" }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <FaCalendarAlt size={48} color="#679750" />
                        <div style={{ fontSize: '18px', fontWeight: '600' }}>
                          {reservas.length === 0 ? "No hay reservas registradas" : "No se encontraron resultados"}
                        </div>
                        {reservas.length === 0 && (
                          <button
                            onClick={() => setShowForm(true)}
                            style={{
                              backgroundColor: "#2E5939",
                              color: "white",
                              padding: "12px 24px",
                              border: "none",
                              borderRadius: 8,
                              cursor: "pointer",
                              fontWeight: "600",
                              marginTop: '10px'
                            }}
                          >
                            <FaPlus style={{ marginRight: '8px' }} />
                            Crear Primera Reserva
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedReservas.map((reserva) => (
                    <tr key={reserva.idReserva} style={{ 
                      borderBottom: "1px solid rgba(46, 89, 57, 0.1)",
                      transition: "all 0.3s ease",
                    }}>
                      <td style={{ padding: "20px 16px", textAlign: "left" }}>
                        <div style={{ fontWeight: "600", color: "#2E5939" }}>
                          {getUsuarioNombre(reserva.idUsuario)}
                        </div>
                        <div style={{ fontSize: "13px", color: "#679750", marginTop: "4px" }}>
                          {getSedeNombre(reserva.idSede)}
                        </div>
                      </td>
                      <td style={{ padding: "20px 16px", textAlign: "left" }}>
                        <div style={{ fontWeight: "500" }}>
                          {getCabinaNombre(reserva.idCabana)}
                        </div>
                      </td>
                      <td style={{ padding: "20px 16px", textAlign: "center" }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ fontSize: "14px", fontWeight: "500" }}>
                            {formatDate(reserva.fechaEntrada)}
                          </div>
                          <div style={{ fontSize: "12px", color: "#679750" }}>
                            Salida: {formatDate(reserva.fechaReserva)}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "20px 16px", textAlign: "center" }}>
                        <div style={{ 
                          fontWeight: "600", 
                          color: "#2E5939",
                          fontSize: "15px"
                        }}>
                          {formatCurrency(reserva.monofiota1 || reserva.montoTotal)}
                        </div>
                        <div style={{ fontSize: "12px", color: "#679750", marginTop: "4px" }}>
                          Abono: {formatCurrency(reserva.abono)}
                        </div>
                      </td>
                      <td style={{ padding: "20px 16px", textAlign: "center" }}>
                        <span style={{
                          color: getEstadoColor(reserva.idEstado),
                          fontWeight: 'bold',
                          display: 'inline-block',
                          padding: '8px 16px',
                          borderRadius: '20px',
                          backgroundColor: 'rgba(46, 89, 57, 0.1)',
                          fontSize: "13px",
                          border: `1px solid ${getEstadoColor(reserva.idEstado)}20`
                        }}>
                          {getEstadoNombre(reserva.idEstado)}
                        </span>
                      </td>
                      <td style={{ padding: "20px 16px", textAlign: "center" }}>
                        <div style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "6px",
                          justifyContent: "center",
                          alignItems: "center"
                        }}>
                          <button
                            onClick={() => handleView(reserva)}
                            style={{
                              ...btnAccion("#F7F4EA", "#2E5939", "rgba(46, 89, 57, 0.1)"),
                              padding: "10px 12px"
                            }}
                            title="Ver Detalles"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleEdit(reserva)}
                            style={{
                              ...btnAccion("#F7F4EA", "#2E5939", "rgba(46, 89, 57, 0.1)"),
                              padding: "10px 12px"
                            }}
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(reserva)}
                            style={{
                              ...btnAccion("#fce4ec", "#c2185b", "rgba(194, 24, 91, 0.1)"),
                              padding: "10px 12px"
                            }}
                            title="Descargar PDF"
                          >
                            <FaFilePdf />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(reserva)}
                            style={{
                              ...btnAccion("#fbe9e7", "#e57373", "rgba(229, 115, 115, 0.1)"),
                              padding: "10px 12px"
                            }}
                            title="Eliminar"
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

            {/* Paginación Mejorada */}
            {totalPages > 1 && (
              <div style={{ 
                padding: "20px", 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                borderTop: "1px solid rgba(46, 89, 57, 0.1)"
              }}>
                <div style={{ color: '#2E5939', fontSize: '14px', fontWeight: '500' }}>
                  Mostrando {Math.min(ITEMS_PER_PAGE, paginatedReservas.length)} de {filteredReservas.length} reservas
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                      padding: "10px 16px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      backgroundColor: currentPage === 1 ? "#f5f5f5" : "#fff",
                      color: currentPage === 1 ? "#999" : "#2E5939",
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      fontWeight: "600",
                      transition: "all 0.3s ease"
                    }}
                  >
                    Anterior
                  </button>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        style={{
                          padding: "10px 16px",
                          border: "1px solid",
                          borderRadius: "8px",
                          backgroundColor: currentPage === page ? "#2E5939" : "#fff",
                          color: currentPage === page ? "white" : "#2E5939",
                          borderColor: currentPage === page ? "#2E5939" : "#ddd",
                          cursor: "pointer",
                          fontWeight: "600",
                          transition: "all 0.3s ease"
                        }}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: "10px 16px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      backgroundColor: currentPage === totalPages ? "#f5f5f5" : "#fff",
                      color: currentPage === totalPages ? "#999" : "#2E5939",
                      cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                      fontWeight: "600",
                      transition: "all 0.3s ease"
                    }}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modales */}
      <DetailsModal />
      <DeleteConfirmModal />
    </div>
  );
};

export default GestionReserva;