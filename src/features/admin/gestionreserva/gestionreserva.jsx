// src/components/GestionReserva.jsx
import { FaEye, FaEdit, FaTrash, FaTimes, FaExclamationTriangle, FaPlus, FaMoneyBillAlt, FaFilePdf } from "react-icons/fa";
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

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

const inputDisabledStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #ccc",
  borderRadius: 8,
  backgroundColor: "#f0f0f0",
  color: "#666",
  boxSizing: 'border-box',
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  cursor: "not-allowed",
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
  maxWidth: 700,
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
  maxWidth: 700,
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

// ===============================================
// DATOS DE CONFIGURACIÓN
// ===============================================
const API_BASE_URL = "http://localhost:5255/api";
const API_RESERVAS = `${API_BASE_URL}/Reserva`;
const API_CABANAS = `${API_BASE_URL}/Cabanas`;
const API_SEDES = `${API_BASE_URL}/Sede`;
const API_PAQUETES = `${API_BASE_URL}/Paquetes`;
const API_ESTADOS = `${API_BASE_URL}/EstadosReserva`;
const API_USUARIOS = `${API_BASE_URL}/Usuarios`;
const API_METODOS_PAGO = `${API_BASE_URL}/metodopago`;
const API_SERVICIOS = `${API_BASE_URL}/Servicio`;

const ITEMS_PER_PAGE = 10;

// ===============================================
// COMPONENTE PRINCIPAL GestionReserva
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
  // EFECTOS
  // ===============================================
  useEffect(() => {
    fetchReservas();
    fetchDatosRelacionados();
  }, []);

  // 1. Actualiza el estado de newReserva para que monofiota1, abono y restante se calculen automáticamente
  useEffect(() => {
    // Obtener el precio del paquete seleccionado
    const paqueteSeleccionado = paquetes.find(p => p.idPaquete === parseInt(newReserva.idPaquete));
    const precioPaquete = paqueteSeleccionado ? parseFloat(paqueteSeleccionado.precioPaquete || 0) : 0;

    // Obtener el precio de los servicios seleccionados
    const preciosServicios = servicios
      .filter(s => newReserva.serviciosSeleccionados.includes(s.idServicio))
      .map(s => parseFloat(s.precioServicio || 0));
    const totalServicios = preciosServicios.reduce((acc, val) => acc + val, 0);

    // Calcular monto total
    const montoTotal = precioPaquete + totalServicios;

    // Calcular abono (50%) y restante
    const abono = Math.round(montoTotal * 0.5);
    const restante = montoTotal - abono;

    setNewReserva(prev => ({
      ...prev,
      monofiota1: montoTotal,
      abono: abono,
      restante: restante
    }));
  // Solo recalcular cuando cambian paquete o servicios seleccionados
  }, [newReserva.idPaquete, newReserva.serviciosSeleccionados, paquetes, servicios]);

  // ===============================================
  // FUNCIONES DE LA API
  // ===============================================
  const fetchReservas = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔍 Conectando a la API de reservas:", API_RESERVAS);
      const res = await axios.get(API_RESERVAS, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
     
      console.log("✅ Datos de reservas recibidos:", res.data);
     
      if (Array.isArray(res.data)) {
        setReservas(res.data);
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
      console.log("🔄 Cargando datos relacionados...");
     
      const promises = [
        axios.get(API_CABANAS),
        axios.get(API_SEDES),
        axios.get(API_PAQUETES),
        axios.get(API_USUARIOS),
        axios.get(API_METODOS_PAGO),
        axios.get(API_SERVICIOS).catch(error => {
          console.warn("⚠️ No se pudieron cargar servicios:", error);
          return { data: [] };
        })
      ];

      const estadoPromise = axios.get(API_ESTADOS).catch(() => ({
        data: [
          { idEstado: 1, nombreEstado: 'Abonado' },
          { idEstado: 2, nombreEstado: 'Pendiente' },
          { idEstado: 3, nombreEstado: 'Cancelada' },
          { idEstado: 4, nombreEstado: 'Completada' }
        ]
      }));

      promises.push(estadoPromise);

      const [
        cabinasRes, sedesRes, paquetesRes,
        usuariosRes, metodosPagoRes, serviciosRes, estadosRes
      ] = await Promise.all(promises);

      setCabinas(cabinasRes.data || []);
      setSedes(sedesRes.data || []);
      setPaquetes(paquetesRes.data || []);
      setUsuarios(usuariosRes.data || []);
      setMetodosPago(metodosPagoRes.data || []);
      setServicios(serviciosRes.data || []);
      setEstados(estadosRes.data || []);

      console.log("✅ Datos relacionados cargados:");
      console.log("- Servicios:", serviciosRes.data);
      console.log("- Métodos de Pago:", metodosPagoRes.data);

    } catch (error) {
      console.error("❌ Error al obtener datos relacionados:", error);
      setEstados([
        { idEstado: 1, nombreEstado: 'Abonado' },
        { idEstado: 2, nombreEstado: 'Pendiente' },
        { idEstado: 3, nombreEstado: 'Cancelada' },
        { idEstado: 4, nombreEstado: 'Completada' }
      ]);
      setMetodosPago([
        { idMetodoPago: 1, nombreMetodoPago: "Transferencia" }
      ]);
      setServicios([]);
    }
  };

  // ===============================================
  // FUNCIÓN PARA INICIALIZAR NUEVA RESERVA
  // ===============================================
  const inicializarNuevaReserva = () => {
    const fechaActual = new Date().toISOString().split('T')[0];
   
    // Buscar el método de pago "Transferencia"
    const metodoTransferencia = metodosPago.find(m =>
      m.nombreMetodoPago?.toLowerCase() === 'transferencia' ||
      m.nombreMetodoPago?.toLowerCase().includes('transferencia')
    );
   
    // Buscar estado "Pendiente"
    const estadoPendiente = estados.find(e =>
      e.nombreEstado?.toLowerCase() === 'pendiente' ||
      e.nombreEstado?.toLowerCase().includes('pendiente')
    );
   
    // Si no encuentra "Transferencia", usar el primer método disponible
    const metodoPagoDefault = metodoTransferencia ||
                             (metodosPago.length > 0 ? metodosPago[0] : null);

    // Si no encuentra "Pendiente", usar el primer estado disponible
    const estadoDefault = estadoPendiente ||
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
      idEstado: estadoDefault ? estadoDefault.idEstado.toString() : "",
      idSede: sedes.length > 0 ? sedes[0].idSede.toString() : "",
      idCabana: cabinas.length > 0 ? cabinas[0].idCabana.toString() : "",
      idMetodoPago: metodoPagoDefault ? metodoPagoDefault.idMetodoPago.toString() : "1",
      idPaquete: "",
      serviciosSeleccionados: []
    });
  };

  const handleAddReserva = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      try {
        // 1. Guardar la reserva principal
        const reservaData = {
          idReserva: isEditing ? newReserva.idReserva : 0,
          fechaReserva: newReserva.fechaReserva || new Date().toISOString().split('T')[0],
          fechaEntrada: newReserva.fechaEntrada || new Date().toISOString().split('T')[0],
          fechaRegistro: newReserva.fechaRegistro || new Date().toISOString().split('T')[0],
          abono: parseFloat(newReserva.abono) || 0,
          restante: parseFloat(newReserva.restante) || 0,
          monofiota1: parseFloat(newReserva.monofiota1) || 0,
          montoTotal: parseFloat(newReserva.monofiota1) || 0,
          idUsuario: parseInt(newReserva.idUsuario),
          idEstado: parseInt(newReserva.idEstado),
          idSede: parseInt(newReserva.idSede),
          idCabana: parseInt(newReserva.idCabana),
          idMetodoPago: parseInt(newReserva.idMetodoPago),
          idPaquete: newReserva.idPaquete && newReserva.idPaquete !== "" ? parseInt(newReserva.idPaquete) : null,
          serviciosSeleccionados: newReserva.serviciosSeleccionados
        };

        let response;
        if (isEditing) {
          response = await axios.put(`${API_RESERVAS}/${newReserva.idReserva}`, reservaData, {
            headers: { 'Content-Type': 'application/json' }
          });

          // Actualiza los servicios asociados a la reserva
          // 1. Elimina todos los servicios actuales de la reserva
          const resServicios = await axios.get(`${API_BASE_URL}/ServiciosReserva`);
          const serviciosReserva = resServicios.data.filter(s => s.idReserva === newReserva.idReserva);
          for (const servicio of serviciosReserva) {
            await axios.delete(`${API_BASE_URL}/ServiciosReserva/${servicio.idServicioReserva}`);
          }
          // 2. Agrega los servicios seleccionados
          for (const idServicio of newReserva.serviciosSeleccionados) {
            const servicio = servicios.find(s => s.idServicio === idServicio);
            await axios.post(`${API_BASE_URL}/ServiciosReserva`, {
              idServicioReserva: 0,
              idServicio,
              idReserva: newReserva.idReserva,
              precio: servicio ? servicio.precioServicio : 0
            });
          }
        } else {
          response = await axios.post(API_RESERVAS, reservaData, {
            headers: { 'Content-Type': 'application/json' }
          });

          // 2. Guardar los servicios seleccionados en la tabla ServiciosReserva
          const idReserva = response.data.idReserva;
          for (const idServicio of newReserva.serviciosSeleccionados) {
            const servicio = servicios.find(s => s.idServicio === idServicio);
            await axios.post(`${API_BASE_URL}/ServiciosReserva`, {
              idServicioReserva: 0,
              idServicio,
              idReserva,
              precio: servicio ? servicio.precioServicio : 0
            });
          }
        }

        displayAlert(isEditing ? "✅ Reserva actualizada exitosamente." : "✅ Reserva agregada exitosamente.");
        await fetchReservas();
        closeForm();
      } catch (error) {
        console.error("❌ Error al guardar reserva:", error);
        if (error.response) {
          console.error("❌ Datos de error:", error.response.data);
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
        // 1. Elimina primero los servicios asociados a la reserva
        try {
          const res = await axios.get(`${API_BASE_URL}/ServiciosReserva`);
          const serviciosReserva = res.data.filter(s => s.idReserva === reservaToDelete.idReserva);
          for (const servicio of serviciosReserva) {
            await axios.delete(`${API_BASE_URL}/ServiciosReserva/${servicio.idServicioReserva}`);
          }
        } catch (err) {
          // Si no hay servicios, ignora el error
        }

        // 2. Elimina la reserva principal
        await axios.delete(`${API_RESERVAS}/${reservaToDelete.idReserva}`);

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
      errorMessage = "❌ No se puede conectar al servidor en http://localhost:5201";
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

  // Función para verificar si hay conflicto de fechas
  const hayConflictoFechas = (entrada, salida, cabanaId) => {
    const entradaDate = new Date(entrada);
    const salidaDate = new Date(salida);

    // Recorre todas las reservas existentes
    return reservas.some(reserva => {
      // Solo comparar reservas de la misma cabaña
      if (parseInt(reserva.idCabana) !== parseInt(cabanaId)) return false;

      const entradaExistente = new Date(reserva.fechafintrada || reserva.fechaEntrada);
      const salidaExistente = new Date(reserva.fechaReserva);

      // Si hay traslape de fechas
      return (
        (entradaDate <= salidaExistente && salidaDate >= entradaExistente)
      );
    });
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

    // Validar que la fecha de entrada no sea anterior a hoy
    const hoy = new Date().toISOString().split('T')[0];
    if (newReserva.fechaEntrada < hoy) {
      displayAlert("❌ La fecha de entrada no puede ser anterior a hoy.");
      return false;
    }

    // QUITA la validación de conflicto de fechas
    // if (hayConflictoFechas(newReserva.fechaEntrada, newReserva.fechaReserva, newReserva.idCabana)) {
    //   displayAlert("❌ Ya existe una reserva para esa cabaña en el rango de fechas seleccionado.");
    //   return false;
    // }

    if (parseFloat(newReserva.monofiota1) <= 0) {
      displayAlert("❌ El monto total debe ser mayor a 0.");
      return false;
    }

    if (parseFloat(newReserva.abono) < 0) {
      displayAlert("❌ El abono no puede ser negativo.");
      return false;
    }

    if (parseFloat(newReserva.restante) < 0) {
      displayAlert("❌ El restante no puede ser negativo.");
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
   
    // No permitir modificar SOLO la fecha de registro y estado si no está editando
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

  // MODIFICA handleView para que traiga los servicios extras desde la API
  const handleView = async (reserva) => {
    // Consulta los servicios asociados a la reserva
    let serviciosNormalizados = [];
    try {
      const res = await axios.get(`${API_BASE_URL}/ServiciosReserva`);
      const serviciosReserva = res.data.filter(s => s.idReserva === reserva.idReserva);
      serviciosNormalizados = serviciosReserva.map(s => s.idServicio);
    } catch {
      serviciosNormalizados = [];
    }

    setCurrentReserva({
      ...reserva,
      serviciosSeleccionados: serviciosNormalizados
    });
    setShowDetails(true);
  };

  const handleEdit = async (reserva) => {
    // 1. Consulta los servicios asociados a la reserva
    let serviciosNormalizados = [];
    try {
      const res = await axios.get(`${API_BASE_URL}/ServiciosReserva`);
      const serviciosReserva = res.data.filter(s => s.idReserva === reserva.idReserva);
      serviciosNormalizados = serviciosReserva.map(s => s.idServicio);
    } catch {
      serviciosNormalizados = [];
    }

    setNewReserva({
      idReserva: reserva.idReserva,
      fechaReserva: formatDateForInput(reserva.fechaReserva),
      fechaEntrada: formatDateForInput(reserva.fechafintrada || reserva.fechaEntrada),
      fechaRegistro: formatDateForInput(reserva.fechaRegistro),
      abono: reserva.abono,
      restante: reserva.restante,
      monofiota1: reserva.monofiota1 || reserva.montoTotal,
      idUsuario: reserva.idUsuario?.toString() || "",
      idEstado: reserva.idEstado?.toString() || "",
      idSede: reserva.idSede?.toString() || "",
      idCabana: reserva.idCabana?.toString() || "",
      idMetodoPago: reserva.idMetodoPago?.toString() || "",
      idPaquete: reserva.idPaquete?.toString() || "",
      serviciosSeleccionados: serviciosNormalizados // <-- SERVICIOS SELECCIONADOS
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteClick = (reserva) => {
    setReservaToDelete(reserva);
    setShowDeleteConfirm(true);
  };

  // Función para obtener detalles de servicios seleccionados
  const getServiciosDetalle = (serviciosIds) => {
    if (!Array.isArray(serviciosIds) || serviciosIds.length === 0) return [];
   
    return serviciosIds
      .map(id => {
        const servicio = servicios.find(s => s.idServicio === id);
        return servicio ? {
          id: servicio.idServicio,
          nombre: servicio.nombreServicio,
          precio: servicio.precioServicio || 0
        } : null;
      })
      .filter(serv => serv !== null);
  };

  // MODIFICA handleDownloadPDF para que el PDF tenga todos los datos y se vea bonito
  const handleDownloadPDF = async (reserva) => {
    // Consulta los servicios asociados a la reserva para el PDF
    let serviciosDetalle = [];
    try {
      const res = await axios.get(`${API_BASE_URL}/ServiciosReserva`);
      const serviciosReserva = res.data.filter(s => s.idReserva === reserva.idReserva);
      serviciosDetalle = serviciosReserva.map(s => {
        const servicio = servicios.find(serv => serv.idServicio === s.idServicio);
        return servicio
          ? { nombre: servicio.nombreServicio, precio: servicio.precioServicio }
          : { nombre: `Servicio ${s.idServicio}`, precio: s.precio };
      });
    } catch {
      serviciosDetalle = [];
    }

    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(46, 89, 57);
    doc.text("Comprobante de Reserva", 105, 18, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);

    let y = 32;
    doc.setDrawColor(103, 151, 80);
    doc.setLineWidth(0.8);
    doc.line(20, y, 190, y);
    y += 8;

    doc.text(`ID Reserva: #${reserva.idReserva}`, 20, y);
    doc.text(`Estado: ${getEstadoNombre(reserva.idEstado)}`, 140, y);
    y += 8;
    doc.text(`Usuario: ${getUsuarioNombre(reserva.idUsuario)}`, 20, y);
    doc.text(`Método de Pago: ${getMetodoPagoNombre(reserva.idMetodoPago)}`, 140, y);
    y += 8;
    doc.text(`Cabaña: ${getCabinaNombre(reserva.idCabana)}`, 20, y);
    doc.text(`Sede: ${getSedeNombre(reserva.idSede)}`, 140, y);
    y += 8;
    doc.text(`Paquete: ${getPaqueteNombre(reserva.idPaquete)}`, 20, y);
    y += 8;

    doc.setDrawColor(103, 151, 80);
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    y += 10;

    doc.text(`Fecha Entrada: ${formatDate(reserva.fechafintrada || reserva.fechaEntrada)}`, 20, y);
    doc.text(`Fecha Salida: ${formatDate(reserva.fechaReserva)}`, 140, y);
    y += 8;
    doc.text(`Fecha Registro: ${formatDate(reserva.fechaRegistro)}`, 20, y);
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(46, 89, 57);
    doc.text("Información de Pago", 20, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    y += 8;
    doc.text(`Monto Total: ${formatCurrency(reserva.monofiota1 || reserva.montoTotal)}`, 20, y);
    doc.text(`Abono: ${formatCurrency(reserva.abono)}`, 80, y);
    doc.text(`Restante: ${formatCurrency(reserva.restante)}`, 140, y);
    y += 10;

    doc.setDrawColor(103, 151, 80);
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(46, 89, 57);
    doc.text("Servicios Extras", 20, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    y += 8;

    if (serviciosDetalle.length > 0) {
      serviciosDetalle.forEach(servicio => {
        doc.text(`• ${servicio.nombre}: ${formatCurrency(servicio.precio)}`, 25, y);
        y += 7;
      });
      doc.setFont("helvetica", "bold");
      doc.text(
        `Total servicios: ${formatCurrency(serviciosDetalle.reduce((total, serv) => total + (serv.precio || 0), 0))}`,
        25,
        y
      );
      doc.setFont("helvetica", "normal");
      y += 10;
    } else {
      doc.text("No se seleccionaron servicios extras.", 25, y);
      y += 10;
    }

    doc.setDrawColor(103, 151, 80);
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    y += 15;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Glamping Luxury - Vereda El Descanso, Villeta", 105, y, { align: "center" });
    y += 5;
    doc.text("Tel: 310 123 4567 | Email: info@glampingluxury.com", 105, y, { align: "center" });

    doc.save(`reserva_${reserva.idReserva}.pdf`);
    displayAlert("✅ PDF generado exitosamente.");
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
        month: 'long',
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
    const cabina = cabinas.find(c => c.idCabana === idCabana);
    return cabina ? `${cabina.nombre} (${cabina.tipoCabana || 'Tipo no especificado'})` : `Cabaña ${idCabana}`;
  };

  const getSedeNombre = (idSede) => {
    const sede = sedes.find(s => s.idSede === idSede);
    return sede ? sede.nombreSede : `Sede ${idSede}`;
  };

  const getPaqueteNombre = (idPaquete) => {
    if (!idPaquete || idPaquete === 0) return 'No aplica';
    const paquete = paquetes.find(p => p.idPaquete === idPaquete);
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
      reserva.idReserva?.toString().includes(searchTerm)
    );
  }, [reservas, searchTerm, cabinas, sedes, estados]);

  const totalPages = Math.ceil(filteredReservas.length / ITEMS_PER_PAGE);

  const paginatedReservas = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReservas.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredReservas, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Agrega esta función antes del return para obtener los días del paquete seleccionado
  const getDiasPaquete = () => {
    if (!newReserva.idPaquete) return 1;
    const paquete = paquetes.find(p => p.idPaquete === parseInt(newReserva.idPaquete));
    return paquete && paquete.dias ? parseInt(paquete.dias) : 1;
  };

  // Función para obtener las fechas ocupadas de una cabaña
  const getFechasOcupadas = (idCabana) => {
    const ocupadas = [];
    reservas.forEach(reserva => {
      if (parseInt(reserva.idCabana) === parseInt(idCabana)) {
        const entrada = new Date(reserva.fechaEntrada || reserva.fechafintrada);
        const salida = new Date(reserva.fechaReserva);
        if (!isNaN(entrada.getTime()) && !isNaN(salida.getTime())) {
          let actual = new Date(entrada);
          while (actual <= salida) {
            ocupadas.push(actual.toISOString().split('T')[0]);
            actual.setDate(actual.getDate() + 1);
          }
        }
      }
    });
    return ocupadas;
  };

  // ===============================================
  // RENDERIZADO
  // ===============================================
  return (
    <div style={{ position: "relative", padding: 20, marginLeft: 260, backgroundColor: "#f5f8f2", minHeight: "100vh" }}>
     
      {/* Alerta */}
      {showAlert && (
        <div style={{
          ...alertStyle,
          backgroundColor: alertMessage.includes('❌') ? '#e57373' : '#2E5939'
        }}>
          {alertMessage.includes('❌') && <FaExclamationTriangle />}
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
              onClick={fetchReservas}
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
                backgroundColor: '#757575',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Ocultar
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, color: "#2E5939" }}>Gestión de Reservas</h2>
          <p style={{ margin: "5px 0 0 0", color: "#679750", fontSize: "14px" }}>
            {reservas.length} reservas registradas | {cabinas.length} cabañas | {sedes.length} sedes
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setIsEditing(false);
            inicializarNuevaReserva();
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
          <FaPlus /> Nueva Reserva
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Buscar por cabaña, sede, estado o ID..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            padding: "12px 15px",
            borderRadius: 10,
            border: "1px solid #ccc",
            width: "100%",
            maxWidth: 400,
            backgroundColor: "#F7F4EA",
            color: "#2E5939",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        />
        <div style={{ color: '#2E5939', fontSize: '14px', whiteSpace: 'nowrap' }}>
          {filteredReservas.length} resultados
        </div>
      </div>

      {/* Formulario de agregar/editar */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={{...modalContentStyle, maxWidth: 700}}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939" }}>
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
                }}
              >
                <FaTimes />
              </button>
            </div>
           
            <form onSubmit={handleAddReserva}>
              {/* Fechas */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                {/* Fecha Entrada primero */}
                <div>
                  <label style={labelStyle}>Fecha Entrada *</label>
                  <input
                    type="date"
                    name="fechaEntrada"
                    value={newReserva.fechaEntrada}
                    onChange={handleInputChange}
                    style={inputStyle}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    title="No se pueden seleccionar fechas anteriores a hoy"
                  />
                </div>
                {/* Fecha Salida después */}
                <div>
                  <label style={labelStyle}>Fecha Salida *</label>
                  <input
                    type="date"
                    name="fechaReserva"
                    value={newReserva.fechaReserva}
                    onChange={handleInputChange}
                    style={inputStyle}
                    required
                    min={
                      newReserva.fechaEntrada
                        ? (() => {
                            const entrada = new Date(newReserva.fechaEntrada);
                            entrada.setDate(entrada.getDate() + 1);
                            return entrada.toISOString().split('T')[0];
                          })()
                        : new Date().toISOString().split('T')[0]
                    }
                    max={
                      newReserva.fechaEntrada && getDiasPaquete() > 1
                        ? (() => {
                            const entrada = new Date(newReserva.fechaEntrada);
                            entrada.setDate(entrada.getDate() + getDiasPaquete());
                            return entrada.toISOString().split('T')[0];
                          })()
                        : ""
                    }
                    title={`Solo puedes seleccionar hasta ${getDiasPaquete()} días después de la fecha de entrada según el paquete`}
                  />
                  {newReserva.idPaquete && (
                    <small style={{ color: '#679750', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                      Este paquete permite {getDiasPaquete()} día(s) de reserva.
                    </small>
                  )}
                </div>
                {/* Fecha Registro */}
                <div>
                  <label style={labelStyle}>Fecha Registro *</label>
                  <input
                    type="date"
                    name="fechaRegistro"
                    value={newReserva.fechaRegistro}
                    style={inputDisabledStyle}
                    required
                    disabled
                    title="Fecha automática (no editable)"
                  />
                  <small style={{ color: '#679750', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                    ⚡ Automático: fecha de registro no editable
                  </small>
                </div>
              </div>

              {/* Campos principales */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={labelStyle}>Cabaña *</label>
                  <select
                    name="idCabana"
                    value={newReserva.idCabana}
                    onChange={handleInputChange}
                    style={inputStyle}
                    required
                  >
                    <option value="">Seleccionar cabaña</option>
                    {cabinas.map(cabina => (
                      <option key={cabina.idCabana} value={cabina.idCabana}>
                        {cabina.nombre} - {cabina.tipoCabana || 'Sin tipo'}
                      </option>
                    ))}
                  </select>
                </div>
               
                <div>
                  <label style={labelStyle}>Sede *</label>
                  <select
                    name="idSede"
                    value={newReserva.idSede}
                    onChange={handleInputChange}
                    style={inputStyle}
                    required
                  >
                    <option value="">Seleccionar sede</option>
                    {sedes.map(sede => (
                      <option key={sede.idSede} value={sede.idSede}>
                        {sede.nombreSede}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={labelStyle}>Paquete</label>
                  <select
                    name="idPaquete"
                    value={newReserva.idPaquete}
                    onChange={handleInputChange}
                    style={inputStyle}
                  >
                    <option value="">Sin paquete</option>
                    {paquetes.map(paquete => (
                      <option key={paquete.idPaquete} value={paquete.idPaquete}>
                        {paquete.nombrePaquete}
                      </option>
                    ))}
                  </select>
                </div>
               
                <div>
                  <label style={labelStyle}>Estado *</label>
                  <select
                    name="idEstado"
                    value={newReserva.idEstado}
                    onChange={handleInputChange}
                    style={isEditing ? inputStyle : inputDisabledStyle}
                    required
                    disabled={!isEditing}
                    title={!isEditing ? "Estado automático (Pendiente)" : "Seleccionar estado"}
                  >
                    <option value="">Seleccionar estado</option>
                    {estados.map(estado => (
                      <option key={estado.idEstado} value={estado.idEstado}>
                        {estado.nombreEstado}
                      </option>
                    ))}
                  </select>
                  {!isEditing && (
                    <small style={{ color: '#679750', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                      ⚡ Automático: Pendiente
                    </small>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={labelStyle}>Usuario *</label>
                  <select
                    name="idUsuario"
                    value={newReserva.idUsuario}
                    onChange={handleInputChange}
                    style={inputStyle}
                    required
                  >
                    <option value="">Seleccionar usuario</option>
                    {usuarios.map(usuario => (
                      <option key={usuario.idUsuario} value={usuario.idUsuario}>
                        {usuario.nombre} {usuario.apellido || ''}
                      </option>
                    ))}
                  </select>
                </div>
               
                <div>
                  <label style={labelStyle}>Método de Pago *</label>
                  <select
                    name="idMetodoPago"
                    value={newReserva.idMetodoPago}
                    // No se puede modificar nunca
                    style={inputDisabledStyle}
                    required
                    disabled
                    title="Método de pago no editable"
                  >
                    <option value="">Seleccionar método</option>
                    {metodosPago.map(metodo => (
                      <option key={metodo.idMetodoPago} value={metodo.idMetodoPago}>
                        {metodo.nombreMetodoPago}
                      </option>
                    ))}
                  </select>
                  <small style={{ color: '#679750', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                    ⚡ Automático: método de pago no editable
                  </small>
                </div>
              </div>

              {/* Campos financieros */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Monto Total *</label>
                  <input
                    type="number"
                    name="monofiota1"
                    value={newReserva.monofiota1}
                    style={inputDisabledStyle}
                    readOnly
                    disabled
                  />
                </div>
               
                <div>
                  <label style={labelStyle}>Abono (50%) *</label>
                  <input
                    type="number"
                    name="abono"
                    value={newReserva.abono}
                    style={inputDisabledStyle}
                    readOnly
                    disabled
                  />
                </div>
               
                <div>
                  <label style={labelStyle}>Restante *</label>
                  <input
                    type="number"
                    name="restante"
                    value={newReserva.restante}
                    style={inputDisabledStyle}
                    readOnly
                    disabled
                  />
                </div>
              </div>

              {/* Servicios Extras */}
              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>Servicios Extras</label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '10px',
                  maxHeight: '150px',
                  overflowY: 'auto',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9'
                }}>
                  {servicios.map(servicio => (
                    <label
                      key={servicio.idServicio}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '5px',
                        borderRadius: '4px',
                        backgroundColor: Array.isArray(newReserva.serviciosSeleccionados) &&
                          newReserva.serviciosSeleccionados.map(id => Number(id)).includes(Number(servicio.idServicio))
                          ? '#e8f5e8' : 'transparent',
                        transition: 'background-color 0.2s'
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
                      />
                      <div>
                        <div style={{ fontWeight: '500' }}>{servicio.nombreServicio}</div>
                        <div style={{ fontSize: '12px', color: '#679750' }}>
                          {formatCurrency(servicio.precioServicio || 0)}
                        </div>
                      </div>
                    </label>
                  ))}
                  {servicios.length === 0 && (
                    <span style={{ color: '#999', fontSize: '13px', gridColumn: '1 / -1', textAlign: 'center' }}>
                      No hay servicios extras disponibles
                    </span>
                  )}
                </div>
                {servicios.length > 0 && (
                  <small style={{ color: '#679750', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                    💡 Los servicios seleccionados se sumarán automáticamente al monto total
                  </small>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? "#ccc" : "#2E5939",
                    color: "#fff",
                    padding: "12px 25px",
                    border: "none",
                    borderRadius: 10,
                    cursor: loading ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    flex: 1,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                  }}
                >
                  {loading ? "Guardando..." : (isEditing ? "Actualizar" : "Guardar")} Reserva
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
      {showDetails && currentReserva && (
        <div style={modalOverlayStyle}>
          <div style={detailsModalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#2E5939" }}>Detalles de la Reserva #{currentReserva.idReserva}</h2>
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
              {/* Fechas */}
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Fechas</div>
                <div style={detailValueStyle}>
                  <div><strong>Entrada:</strong> {formatDate(currentReserva.fechafintrada || currentReserva.fechaEntrada)}</div>
                  <div><strong>Salida:</strong> {formatDate(currentReserva.fechaReserva)}</div>
                  <div><strong>Registro:</strong> {formatDate(currentReserva.fechaRegistro)}</div>
                </div>
              </div>
             
              {/* Información de Pago */}
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Información de Pago</div>
                <div style={detailValueStyle}>
                  <div><strong>Monto Total:</strong> {formatCurrency(currentReserva.monofiota1 || currentReserva.montoTotal)}</div>
                  <div><strong>Abono:</strong> {formatCurrency(currentReserva.abono)}</div>
                  <div><strong>Restante:</strong> {formatCurrency(currentReserva.restante)}</div>
                  <div><strong>Método de Pago:</strong> {getMetodoPagoNombre(currentReserva.idMetodoPago)}</div>
                </div>
              </div>
             
              {/* Detalles de la Reserva */}
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Detalles de la Reserva</div>
                <div style={detailValueStyle}>
                  <div><strong>Cabaña:</strong> {getCabinaNombre(currentReserva.idCabana)}</div>
                  <div><strong>Sede:</strong> {getSedeNombre(currentReserva.idSede)}</div>
                  <div><strong>Paquete:</strong> {getPaqueteNombre(currentReserva.idPaquete)}</div>
                  <div><strong>Estado:</strong>
                    <span style={{
                      color: getEstadoColor(currentReserva.idEstado),
                      fontWeight: 'bold',
                      marginLeft: '5px'
                    }}>
                      {getEstadoNombre(currentReserva.idEstado)}
                    </span>
                  </div>
                  <div><strong>Usuario:</strong> {getUsuarioNombre(currentReserva.idUsuario)}</div>
                </div>
              </div>

              {/* Servicios Extras */}
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Servicios Extras</div>
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
                          <ul style={{ margin: 0, paddingLeft: 18 }}>
                            {serviciosDetalle.map((serv, idx) => (
                              <li key={idx} style={{ marginBottom: '8px' }}>
                                <strong>{serv.nombre}</strong>
                                <span style={{ color: '#679750', fontWeight: 'bold', marginLeft: '8px' }}>
                                  ({formatCurrency(serv.precio)})
                                </span>
                              </li>
                            ))}
                          </ul>
                          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f7f0', borderRadius: '5px' }}>
                            <strong>Total servicios: {formatCurrency(
                              serviciosDetalle.reduce((total, serv) => total + (serv.precio || 0), 0)
                            )}</strong>
                          </div>
                        </div>
                      );
                    } else {
                      return <span style={{ color: '#999' }}>No se seleccionaron servicios extras.</span>;
                    }
                  })()}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 20 }}>
              <button
                onClick={() => handleDownloadPDF(currentReserva)}
                style={{
                  backgroundColor: "#e57373",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontWeight: "600",
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FaFilePdf /> Descargar PDF
              </button>
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
      {showDeleteConfirm && reservaToDelete && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 450, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 20, color: "#2E5939" }}>Confirmar Eliminación</h3>
            <p style={{ marginBottom: 30, fontSize: '1.1rem', color: "#2E5939" }}>
              ¿Estás seguro de eliminar la reserva #<strong>{reservaToDelete.idReserva}</strong>?
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
              🔄 Cargando reservas...
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
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>ID</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Cabaña</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Sede</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Fecha Entrada</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Monto Total</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Método Pago</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Estado</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReservas.length === 0 && !loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#2E5939" }}>
                    {reservas.length === 0 ? "No hay reservas registradas" : "No se encontraron resultados"}
                  </td>
                </tr>
              ) : (
                paginatedReservas.map((reserva) => (
                  <tr key={reserva.idReserva} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "15px", fontWeight: "500" }}>#{reserva.idReserva}</td>
                    <td style={{ padding: "15px" }}>{getCabinaNombre(reserva.idCabana)}</td>
                    <td style={{ padding: "15px" }}>{getSedeNombre(reserva.idSede)}</td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      {reserva.fechafintrada
                        ? formatDate(reserva.fechafintrada)
                        : reserva.fechaEntrada
                          ? formatDate(reserva.fechaEntrada)
                          : "Sin fecha"}
                    </td>
                    <td style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>
                      {formatCurrency(
                        reserva.monofiota1 && reserva.monofiota1 > 0
                          ? reserva.monofiota1
                          : reserva.montoTotal && reserva.montoTotal > 0
                            ? reserva.montoTotal
                            : 0
                      )}
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      {getMetodoPagoNombre(reserva.idMetodoPago)}
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <span style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        backgroundColor: getEstadoColor(reserva.idEstado),
                        color: "white",
                        fontWeight: "600",
                        fontSize: "12px"
                      }}>
                        {getEstadoNombre(reserva.idEstado)}
                      </span>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <div style={{
    display: "flex",
    flexDirection: "row",
    gap: "4px", // Reduce el espacio entre botones
    justifyContent: "center",
    alignItems: "center"
  }}>
    <button
      onClick={() => handleView(reserva)}
      style={btnAccion("#F7F4EA", "#2E5939")}
      title="Ver Detalles"
    >
      <FaEye />
    </button>
    <button
      onClick={() => handleEdit(reserva)}
      style={btnAccion("#F7F4EA", "#2E5939")}
      title="Editar"
    >
      <FaEdit />
    </button>
    <button
      onClick={() => handleDeleteClick(reserva)}
      style={btnAccion("#fbe9e7", "#e57373")}
      title="Eliminar"
    >
      <FaTrash />
    </button>
    <button
      onClick={() => handleDownloadPDF(reserva)}
      style={btnAccion("#fce4ec", "#c2185b")}
      title="Descargar PDF"
    >
      <FaFilePdf />
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

export default GestionReserva;