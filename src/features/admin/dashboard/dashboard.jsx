import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [sedes, setSedes] = useState([]);
  const [sedeSeleccionada, setSedeSeleccionada] = useState("");
  const [filtro, setFiltro] = useState("diario");
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("2025-12-09");
  const [reservasCalendario, setReservasCalendario] = useState([]);
  const [reservasPorDia, setReservasPorDia] = useState({});
  const [datosCabañas, setDatosCabañas] = useState(null);
  const [datosSedes, setDatosSedes] = useState(null);

  // 🔹 Obtener sedes desde backend
  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const response = await fetch("https://www.bosquesagrado.somee.com/api/reportes/sedes");
        if (!response.ok) {
          throw new Error("Error al obtener sedes");
        }
        const data = await response.json();
        setSedes(data);
        if (data.length > 0) {
          setSedeSeleccionada(data[0].idSede);
        }
      } catch (error) {
        console.error("Error al obtener sedes:", error);
      }
    };
    fetchSedes();
  }, []);

  // 🔹 Llamar a reservas cuando cambien sede o filtro
  useEffect(() => {
    if (!sedeSeleccionada) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://www.bosquesagrado.somee.com/api/reportes/reservas/${sedeSeleccionada}/${filtro}`
        );

        if (!response.ok) {
          throw new Error("Error en la petición: " + response.status);
        }

        const data = await response.json();
        setDatos(data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setDatos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sedeSeleccionada, filtro]);

  // 🔹 Obtener datos para gráficos de cabañas y sedes
  useEffect(() => {
    const fetchDatosGraficos = async () => {
      try {
        const responseCabañas = await fetch(
          `https://www.bosquesagrado.somee.com/api/reportes/cabanas-populares/${filtro}`
        );
        if (responseCabañas.ok) {
          const dataCabañas = await responseCabañas.json();
          setDatosCabañas(dataCabañas);
        }

        const responseSedes = await fetch(
          `https://www.bosquesagrado.somee.com/api/reportes/reservas-sedes/${filtro}`
        );
        if (responseSedes.ok) {
          const dataSedes = await responseSedes.json();
          setDatosSedes(dataSedes);
        }
      } catch (error) {
        console.error("Error al obtener datos para gráficos:", error);
      }
    };

    fetchDatosGraficos();
  }, [filtro]);

  // 🔹 Obtener reservas de DICIEMBRE 2025 para el calendario
  useEffect(() => {
    if (!sedeSeleccionada) return;

    const obtenerReservasMes = async () => {
      try {
        const año = 2025;
        const mes = 12;
        
        console.log(`🔍 BUSCANDO RESERVAS: Sede=${sedeSeleccionada}, Año=${año}, Mes=${mes}`);
        
        const response = await fetch(
          `https://www.bosquesagrado.somee.com/api/reportes/reservas-mes/${sedeSeleccionada}/${año}/${mes}`
        );
        
        if (response.ok) {
          const data = await response.json();
          console.log("✅ Datos recibidos del backend:", data);
          
          const reservasPorDiaObj = {};
          data.forEach((reserva, index) => {
            console.log(`Reserva ${index + 1}:`, reserva);
            const fechaReserva = reserva.fecha;
            
            if (fechaReserva) {
              if (!reservasPorDiaObj[fechaReserva]) {
                reservasPorDiaObj[fechaReserva] = [];
              }
              reservasPorDiaObj[fechaReserva].push(reserva);
            }
          });
          
          console.log("🗓️ Reservas organizadas por día:", reservasPorDiaObj);
          setReservasPorDia(reservasPorDiaObj);
          
          // Mostrar reservas para el 9 de diciembre automáticamente
          if (reservasPorDiaObj["2025-12-09"]) {
            console.log("🎯 Encontrada reserva para el 9 de diciembre 2025");
            obtenerReservasPorFecha("2025-12-09");
          }
        } else {
          console.error("❌ Error en la respuesta del backend:", response.status);
          setReservasPorDia({});
        }
      } catch (error) {
        console.error("❌ Error al obtener reservas del mes:", error);
        setReservasPorDia({});
      }
    };

    obtenerReservasMes();
  }, [sedeSeleccionada]);

  // 🔹 Obtener reservas por fecha - CORREGIDO
  const obtenerReservasPorFecha = async (fecha) => {
    if (!sedeSeleccionada || !fecha) return;
    
    try {
      console.log(`📅 Obteniendo reservas para fecha EXACTA: ${fecha}`);
      const response = await fetch(
        `https://www.bosquesagrado.somee.com/api/reportes/reservas-fecha/${sedeSeleccionada}/${fecha}`
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Reservas para la fecha:", data);
        setReservasCalendario(data);
      } else {
        console.log("ℹ️ No hay reservas para esta fecha");
        setReservasCalendario([]);
      }
    } catch (error) {
      console.error("❌ Error al obtener reservas:", error);
      setReservasCalendario([]);
    }
  };

  // 🔹 Generar días de DICIEMBRE 2025 - CORREGIDO
  const generarDiasDelMes = () => {
    const año = 2025;
    const mes = 12;
    const dias = [];

    // Generar 42 celdas (6 semanas) para asegurar que cubrimos todo
    const fechaInicio = new Date(2025, 10, 30); // 30 de noviembre 2025
    for (let i = 0; i < 42; i++) {
      const fecha = new Date(fechaInicio);
      fecha.setDate(fechaInicio.getDate() + i);
      
      const añoCelda = fecha.getFullYear();
      const mesCelda = fecha.getMonth() + 1;
      const diaCelda = fecha.getDate();
      
      const fechaStr = `${añoCelda}-${String(mesCelda).padStart(2, '0')}-${String(diaCelda).padStart(2, '0')}`;
      
      // Solo mostrar días de diciembre 2025
      if (añoCelda === 2025 && mesCelda === 12) {
        dias.push({
          fecha: fechaStr,
          dia: diaCelda,
          mes: mesCelda
        });
      } else if (añoCelda === 2025 && mesCelda === 11 && diaCelda >= 30) {
        // Días de noviembre que aparecen en el calendario
        dias.push({ fecha: null, dia: diaCelda, mes: mesCelda });
      } else {
        dias.push({ fecha: null, dia: "", mes: mesCelda });
      }
    }

    return dias;
  };

  // 🔹 Función para formatear fecha CORRECTAMENTE
  const formatearFechaParaMostrar = (fechaStr) => {
    if (!fechaStr) return "";
    
    const partes = fechaStr.split('-');
    if (partes.length !== 3) return fechaStr;
    
    const año = parseInt(partes[0]);
    const mes = parseInt(partes[1]) - 1;
    const dia = parseInt(partes[2]);
    
    const fecha = new Date(año, mes, dia);
    
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 🔹 Verificar si un día tiene reservas
  const tieneReservas = (fecha) => {
    if (!fecha) return false;
    return reservasPorDia[fecha] && reservasPorDia[fecha].length > 0;
  };

  // 🔹 Obtener número de reservas para un día
  const obtenerNumeroReservas = (fecha) => {
    if (!fecha || !reservasPorDia[fecha]) return 0;
    return reservasPorDia[fecha].length;
  };

  // 🔹 Obtener color según cantidad de reservas
  const obtenerColorFondo = (fecha) => {
    if (!fecha) return "";
    const numReservas = obtenerNumeroReservas(fecha);
    
    if (numReservas === 0) return "";
    if (numReservas === 1) return "linear-gradient(135deg, #4CAF50 30%, #2E5939 100%)";
    return "linear-gradient(135deg, #FF9800 30%, #FF5722 100%)";
  };

  // 🔹 Preparar gráfica de barras mejorada
  const chartData = {
    labels: datos ? datos.map((d) => d.label) : [],
    datasets: [
      {
        label: "Reservas",
        data: datos ? datos.map((d) => d.valor) : [],
        backgroundColor: [
          "#2E5939",
          "#3b9d54ff",
          "#4CAF50",
          "#679750",
          "#8BC34A",
          "#CDDC39"
        ],
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#fff",
        hoverBackgroundColor: "#1e3d28",
        hoverBorderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#2E5939",
          font: {
            weight: "bold",
            size: 12,
          },
          padding: 15,
        },
      },
      title: {
        display: true,
        text: `Reservas por ${filtro.charAt(0).toUpperCase() + filtro.slice(1)}`,
        color: "#2E5939",
        font: {
          size: 18,
          weight: "bold",
        },
      },
      tooltip: {
        backgroundColor: "#2E5939",
        titleFont: {
          size: 13,
          weight: "bold",
        },
        bodyFont: {
          size: 12,
        },
        padding: 10,
        cornerRadius: 6,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(46, 89, 57, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "#2E5939",
          font: {
            weight: "bold",
            size: 11,
          },
          padding: 8,
        },
        title: {
          display: true,
          text: 'Cantidad de Reservas',
          color: "#2E5939",
          font: {
            weight: "bold",
            size: 12,
          },
        },
      },
      x: {
        grid: {
          color: "rgba(46, 89, 57, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "#2E5939",
          font: {
            weight: "bold",
            size: 11,
          },
          maxRotation: 45,
        },
        title: {
          display: true,
          text: filtro === 'diario' ? 'Días' : filtro === 'semanal' ? 'Semanas' : filtro === 'mensual' ? 'Meses' : 'Años',
          color: "#2E5939",
          font: {
            weight: "bold",
            size: 12,
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
    maintainAspectRatio: false,
  };

  // 🔹 Preparar gráfica de torta para cabañas
  const pieDataCabañas = {
    labels: datosCabañas ? datosCabañas.map((d) => d.label) : [],
    datasets: [
      {
        data: datosCabañas ? datosCabañas.map((d) => d.valor) : [],
        backgroundColor: [
          "#2E5939",
          "#3b9d54ff",
          "#4CAF50",
          "#679750",
          "#8BC34A",
          "#CDDC39",
          "#AFB42B",
          "#9E9D24"
        ],
        borderWidth: 3,
        borderColor: "#fff",
        hoverBorderWidth: 4,
        hoverOffset: 8,
      },
    ],
  };

  const pieOptionsCabañas = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: "#2E5939",
          font: {
            weight: "bold",
            size: 11,
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: `Cabañas Más Reservadas (${filtro.charAt(0).toUpperCase() + filtro.slice(1)})`,
        color: "#2E5939",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        backgroundColor: "#2E5939",
        titleFont: {
          size: 12,
          weight: "bold",
        },
        bodyFont: {
          size: 11,
        },
        padding: 8,
        cornerRadius: 6,
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true
    },
    maintainAspectRatio: false,
  };

  // 🔹 Preparar gráfica de torta para sedes
  const pieDataSedes = {
    labels: datosSedes ? datosSedes.map((d) => d.label) : [],
    datasets: [
      {
        data: datosSedes ? datosSedes.map((d) => d.valor) : [],
        backgroundColor: [
          "#2E5939",
          "#3b9d54ff",
          "#4CAF50",
          "#679750",
          "#8BC34A",
          "#CDDC39",
          "#AFB42B",
          "#9E9D24"
        ],
        borderWidth: 3,
        borderColor: "#fff",
        hoverBorderWidth: 4,
        hoverOffset: 8,
      },
    ],
  };

  const pieOptionsSedes = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: "#2E5939",
          font: {
            weight: "bold",
            size: 11,
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: `Reservas por Sede (${filtro.charAt(0).toUpperCase() + filtro.slice(1)})`,
        color: "#2E5939",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        backgroundColor: "#2E5939",
        titleFont: {
          size: 12,
          weight: "bold",
        },
        bodyFont: {
          size: 11,
        },
        padding: 8,
        cornerRadius: 6,
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true
    },
    maintainAspectRatio: false,
  };

  const totalReservas = datos ? datos.reduce((total, item) => total + (item.valor || 0), 0) : 0;

  if (loading) {
    return <div style={{ textAlign: "center", padding: 40 }}>Cargando datos...</div>;
  }

  const diasDelMes = generarDiasDelMes();
  const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div
      style={{
        marginLeft: 260,
        padding: 20,
        backgroundColor: "#f5f8f2",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          color: "#2E5939",
          marginBottom: 20,
          textAlign: "center",
          fontSize: "28px",
        }}
      >
        Dashboard por Sede
      </h2>

      {/* Selectores */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr 1fr", 
        gap: 15, 
        marginBottom: 30,
        alignItems: "end"
      }}>
        <div>
          <label style={{ 
            display: "block", 
            marginBottom: 8, 
            color: "#2E5939", 
            fontWeight: "bold" 
          }}>
            Seleccionar Sede:
          </label>
          <select
            value={sedeSeleccionada}
            onChange={(e) => setSedeSeleccionada(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "2px solid #2E5939",
              borderRadius: 8,
              backgroundColor: "#F7F4EA",
              color: "#2E5939",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {sedes.map((sede) => (
              <option key={sede.idSede} value={sede.idSede}>
                {sede.nombreSede}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ 
            display: "block", 
            marginBottom: 8, 
            color: "#2E5939", 
            fontWeight: "bold" 
          }}>
            Período:
          </label>
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "2px solid #2E5939",
              borderRadius: 8,
              backgroundColor: "#F7F4EA",
              color: "#2E5939",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {["diario", "semanal", "mensual", "anual"].map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ 
            display: "block", 
            marginBottom: 8, 
            color: "#2E5939", 
            fontWeight: "bold" 
          }}>
            Fecha Calendario:
          </label>
          <input
            type="date"
            value={fechaSeleccionada}
            onChange={(e) => {
              const fecha = e.target.value;
              setFechaSeleccionada(fecha);
              obtenerReservasPorFecha(fecha);
            }}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "2px solid #2E5939",
              borderRadius: 8,
              backgroundColor: "#F7F4EA",
              color: "#2E5939",
              fontWeight: "600",
            }}
          />
        </div>
      </div>

      {/* Estadísticas */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 15,
        marginBottom: 30
      }}>
        <div style={{
          backgroundColor: "#2E5939",
          color: "white",
          padding: "20px",
          borderRadius: 10,
          textAlign: "center",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>Total Reservas</h3>
          <p style={{ margin: "10px 0 0 0", fontSize: "24px", fontWeight: "bold" }}>
            {totalReservas}
          </p>
        </div>
        
        <div style={{
          backgroundColor: "#3b9d54ff",
          color: "white",
          padding: "20px",
          borderRadius: 10,
          textAlign: "center",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>Período</h3>
          <p style={{ margin: "10px 0 0 0", fontSize: "24px", fontWeight: "bold" }}>
            {filtro.charAt(0).toUpperCase() + filtro.slice(1)}
          </p>
        </div>
      </div>

      {/* Contenido Principal */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 20,
        alignItems: "start"
      }}>
        {/* Columna Izquierda - Gráficos */}
        <div style={{
          display: "grid",
          gridTemplateRows: "auto auto",
          gap: 20
        }}>
          <div
            style={{
              backgroundColor: "#fff",
              padding: 25,
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "2px solid #679750",
              height: "400px"
            }}
          >
            {datos && datos.length > 0 ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: "#666" }}>
                No hay datos disponibles para mostrar en el gráfico
              </div>
            )}
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20
          }}>
            <div
              style={{
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                border: "2px solid #679750",
                height: "350px"
              }}
            >
              {datosCabañas && datosCabañas.length > 0 ? (
                <Pie data={pieDataCabañas} options={pieOptionsCabañas} />
              ) : (
                <div style={{ textAlign: "center", padding: 30, color: "#666" }}>
                  No hay datos de cabañas disponibles
                </div>
              )}
            </div>

            <div
              style={{
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                border: "2px solid #679750",
                height: "350px"
              }}
            >
              {datosSedes && datosSedes.length > 0 ? (
                <Pie data={pieDataSedes} options={pieOptionsSedes} />
              ) : (
                <div style={{ textAlign: "center", padding: 30, color: "#666" }}>
                  No hay datos de sedes disponibles
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha - Calendario SIMPLIFICADO */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: 25,
            borderRadius: 12,
            boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
            border: "3px solid #2E5939",
            height: "fit-content",
            position: "sticky",
            top: 20
          }}
        >
          <h3 style={{ 
            color: "#2E5939", 
            marginBottom: 15, 
            textAlign: "center",
            fontSize: "20px",
            fontWeight: "bold"
          }}>
            Calendario - Diciembre 2025
          </h3>
          
          {/* Leyenda */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 15,
            marginBottom: 15,
            padding: "8px",
            backgroundColor: "#f0f7f0",
            borderRadius: 6,
            border: "1px solid #2E5939"
          }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                width: "12px",
                height: "12px",
                background: "linear-gradient(135deg, #4CAF50 30%, #2E5939 100%)",
                borderRadius: "50%",
                marginRight: "5px"
              }}></div>
              <span style={{ fontSize: "11px", color: "#2E5939", fontWeight: "bold" }}>1 reserva</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                width: "12px",
                height: "12px",
                background: "linear-gradient(135deg, #FF9800 30%, #FF5722 100%)",
                borderRadius: "50%",
                marginRight: "5px"
              }}></div>
              <span style={{ fontSize: "11px", color: "#2E5939", fontWeight: "bold" }}>2+ reservas</span>
            </div>
          </div>
          
          {/* Grid de días */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(7, 1fr)", 
            gap: 4,
            marginBottom: 25
          }}>
            {nombresDias.map((dia) => (
              <div key={dia} style={{ 
                textAlign: "center", 
                fontWeight: "bold", 
                color: "#2E5939",
                padding: "8px 2px",
                fontSize: "12px",
                backgroundColor: "#f0f7f0",
                borderRadius: 4
              }}>
                {dia}
              </div>
            ))}
            {diasDelMes.map(({ fecha, dia, mes }, index) => {
              const esSeleccionado = fecha === fechaSeleccionada;
              const tieneReservasHoy = tieneReservas(fecha);
              const numReservas = obtenerNumeroReservas(fecha);
              const colorFondo = obtenerColorFondo(fecha);
              
              // Solo mostrar días de diciembre
              const mostrarDia = mes === 12 && dia !== "";
              
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (fecha) {
                      setFechaSeleccionada(fecha);
                      obtenerReservasPorFecha(fecha);
                    }
                  }}
                  disabled={!fecha}
                  style={{
                    padding: "8px 2px",
                    border: esSeleccionado ? "2px solid #2E5939" : "1px solid #e0e0e0",
                    background: tieneReservasHoy ? colorFondo : "transparent",
                    color: tieneReservasHoy ? "white" : 
                          mes === 12 ? "#2E5939" : "#999",
                    borderRadius: 4,
                    cursor: fecha ? "pointer" : "default",
                    fontSize: "12px",
                    fontWeight: "bold",
                    transition: "all 0.2s ease",
                    position: "relative",
                    minHeight: "35px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: mostrarDia ? 1 : 0.5
                  }}
                  title={fecha ? 
                    `Día: ${dia}\nFecha: ${fecha}\nReservas: ${numReservas}` : 
                    "Día fuera de diciembre 2025"
                  }
                >
                  {mostrarDia && (
                    <>
                      <span style={{ fontSize: "12px" }}>{dia}</span>
                      {tieneReservasHoy && numReservas > 0 && (
                        <span style={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          fontSize: "8px",
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          color: "#2E5939",
                          borderRadius: "50%",
                          width: "14px",
                          height: "14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          border: "1px solid #2E5939"
                        }}>
                          {numReservas}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Lista de reservas SIMPLIFICADA */}
          <div style={{ marginTop: 20 }}>
            <h4 style={{ 
              color: "#2E5939", 
              marginBottom: 15,
              fontSize: "16px",
              fontWeight: "bold",
              borderBottom: "2px solid #f0f7f0",
              paddingBottom: 8,
              textAlign: "center"
            }}>
              {fechaSeleccionada ? `Reservas para ${formatearFechaParaMostrar(fechaSeleccionada)}` : "Seleccione una fecha"}
            </h4>
            
            {reservasCalendario && reservasCalendario.length > 0 ? (
              <div style={{ 
                maxHeight: "300px", 
                overflowY: "auto",
                borderRadius: 8,
                border: "1px solid #e0e0e0"
              }}>
                {reservasCalendario.map((reserva, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "15px",
                      marginBottom: "8px",
                      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                      borderLeft: "4px solid #2E5939",
                      borderRadius: "6px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                    }}
                  >
                    {/* Información principal - SIN el círculo con hora */}
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "8px"
                    }}>
                      <div>
                        <div style={{ 
                          fontWeight: "bold", 
                          color: "#2E5939", 
                          fontSize: "15px",
                          marginBottom: "4px"
                        }}>
                          {reserva.cliente || "Usuario"}
                        </div>
                        <div style={{ 
                          fontSize: "13px", 
                          color: "#666"
                        }}>
                          {reserva.cabana || "Cabaña"}
                        </div>
                      </div>
                      
                      {/* Estado */}
                      {reserva.estado && (
                        <span style={{ 
                          backgroundColor: 
                            reserva.estado.toLowerCase() === "confirmada" ? "#4CAF50" : 
                            reserva.estado.toLowerCase() === "pendiente" ? "#FF9800" : 
                            reserva.estado.toLowerCase() === "cancelada" ? "#F44336" : "#9E9E9E",
                          color: "white",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: "bold",
                          textTransform: "capitalize"
                        }}>
                          {reserva.estado}
                        </span>
                      )}
                    </div>
                    
                    {/* Información adicional - QUITADO el "Reserva #1" */}
                    {reserva.montoTotal && (
                      <div style={{
                        marginTop: "8px",
                        paddingTop: "8px",
                        borderTop: "1px dashed #e0e0e0",
                        fontSize: "12px",
                        color: "#666",
                        fontWeight: "bold"
                      }}>
                        Monto: ${reserva.montoTotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                textAlign: "center", 
                padding: "30px 20px",
                backgroundColor: "#f9f9f9",
                borderRadius: 8,
                color: "#666",
                border: "1px dashed #ddd"
              }}>
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>📅</div>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: "bold" }}>
                  No hay reservas para esta fecha
                </p>
              </div>
            )}
          </div>
          
          {/* Solo el total de reservas - QUITADO "Cabañas: X diferentes" */}
          {reservasCalendario && reservasCalendario.length > 0 && (
            <div style={{
              marginTop: "15px",
              padding: "12px",
              backgroundColor: "#f0f7f0",
              borderRadius: "6px",
              border: "1px solid #2E5939",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "14px", color: "#2E5939", fontWeight: "bold" }}>
                Total de reservas: {reservasCalendario.length}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Estilos CSS */}
      <style>
        {`
          button:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15) !important;
          }
          
          button:active {
            transform: scale(0.98);
          }
          
          /* Scrollbar personalizado */
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: #2E5939;
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: #1e3d28;
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;