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
        const response = await fetch("http://localhost:5272/api/reportes/sedes");
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
          `http://localhost:5272/api/reportes/reservas/${sedeSeleccionada}/${filtro}`
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
          `http://localhost:5272/api/reportes/cabanas-populares/${filtro}`
        );
        if (responseCabañas.ok) {
          const dataCabañas = await responseCabañas.json();
          setDatosCabañas(dataCabañas);
        }

        const responseSedes = await fetch(
          `http://localhost:5272/api/reportes/reservas-sedes/${filtro}`
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
          `http://localhost:5272/api/reportes/reservas-mes/${sedeSeleccionada}/${año}/${mes}`
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
        `http://localhost:5272/api/reportes/reservas-fecha/${sedeSeleccionada}/${fecha}`
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

    // El 1 de diciembre 2025 es lunes (getDay() = 1)
    // Pero en tu imagen el 1 está en martes, así que ajustamos
    // Vamos a generar desde domingo 30 de noviembre para que cuadre
    
    // Generar 42 celdas (6 semanas) para asegurar que cubrimos todo
    const fechaInicio = new Date(2025, 10, 30); // 30 de noviembre 2025
    for (let i = 0; i < 42; i++) {
      const fecha = new Date(fechaInicio);
      fecha.setDate(fechaInicio.getDate() + i);
      
      const añoCelda = fecha.getFullYear();
      const mesCelda = fecha.getMonth() + 1; // JS: 0 = enero, 11 = diciembre
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

    console.log("📅 Días generados:", dias);
    return dias;
  };

  // 🔹 Función para formatear fecha CORRECTAMENTE
  const formatearFechaParaMostrar = (fechaStr) => {
    if (!fechaStr) return "";
    
    // Crear fecha SIN problemas de zona horaria
    const partes = fechaStr.split('-');
    if (partes.length !== 3) return fechaStr;
    
    const año = parseInt(partes[0]);
    const mes = parseInt(partes[1]) - 1; // JS: 0 = enero
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

  // 🔹 Resto del código (gráficos sin cambios)
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
        width: "calc(100% - 260px)",
        overflowX: "hidden", // 🔹 CORRECCIÓN: Evita scroll horizontal
        boxSizing: "border-box", // 🔹 CORRECCIÓN: Incluye padding en el cálculo del ancho
      }}
    >
      <h2
        style={{
          color: "#2E5939",
          marginBottom: 20,
          textAlign: "center",
          fontSize: "28px",
          width: "100%",
        }}
      >
        Dashboard por Sede
      </h2>

      {/* Selectores - CORREGIDO */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(3, minmax(150px, 1fr))", 
        gap: 15, 
        marginBottom: 30,
        alignItems: "end",
        width: "100%",
        maxWidth: "100%", // 🔹 CORRECCIÓN: Limita el ancho máximo
        boxSizing: "border-box"
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
              boxSizing: "border-box"
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
              boxSizing: "border-box"
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
              console.log("📅 Fecha seleccionada:", fecha, "Fecha exacta para backend:", fecha);
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
              boxSizing: "border-box"
            }}
          />
        </div>
      </div>

      {/* Estadísticas */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 15,
        marginBottom: 30,
        width: "100%",
        maxWidth: "100%"
      }}>
        <div style={{
          backgroundColor: "#2E5939",
          color: "white",
          padding: "20px",
          borderRadius: 10,
          textAlign: "center",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          width: "100%",
          boxSizing: "border-box"
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
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          width: "100%",
          boxSizing: "border-box"
        }}>
          <h3 style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>Período</h3>
          <p style={{ margin: "10px 0 0 0", fontSize: "24px", fontWeight: "bold" }}>
            {filtro.charAt(0).toUpperCase() + filtro.slice(1)}
          </p>
        </div>
      </div>

      {/* Contenido Principal - CORREGIDO */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)", // 🔹 CORRECCIÓN: minmax(0, ...) evita overflow
        gap: 20,
        alignItems: "start",
        width: "100%",
        maxWidth: "100%", // 🔹 CORRECCIÓN: Limita el ancho máximo
        boxSizing: "border-box"
      }}>
        {/* Columna Izquierda - Gráficos */}
        <div style={{
          display: "grid",
          gridTemplateRows: "auto auto",
          gap: 20,
          width: "100%",
          maxWidth: "100%",
          overflow: "hidden" // 🔹 CORRECCIÓN: Evita que los hijos generen scroll
        }}>
          <div
            style={{
              backgroundColor: "#fff",
              padding: 25,
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "2px solid #679750",
              height: "400px",
              width: "100%",
              maxWidth: "100%",
              overflow: "hidden" // 🔹 CORRECCIÓN: Evita scroll en el gráfico
            }}
          >
            {datos && datos.length > 0 ? (
              <div style={{ width: "100%", height: "100%" }}>
                <Bar data={chartData} options={chartOptions} />
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: "#666" }}>
                No hay datos disponibles para mostrar en el gráfico
              </div>
            )}
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", // 🔹 CORRECCIÓN: minmax(0, ...)
            gap: 20,
            width: "100%",
            maxWidth: "100%"
          }}>
            <div
              style={{
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                border: "2px solid #679750",
                height: "350px",
                width: "100%",
                overflow: "hidden"
              }}
            >
              {datosCabañas && datosCabañas.length > 0 ? (
                <div style={{ width: "100%", height: "100%" }}>
                  <Pie data={pieDataCabañas} options={pieOptionsCabañas} />
                </div>
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
                height: "350px",
                width: "100%",
                overflow: "hidden"
              }}
            >
              {datosSedes && datosSedes.length > 0 ? (
                <div style={{ width: "100%", height: "100%" }}>
                  <Pie data={pieDataSedes} options={pieOptionsSedes} />
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: 30, color: "#666" }}>
                  No hay datos de sedes disponibles
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha - Calendario CORREGIDO */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: 25,
            borderRadius: 12,
            boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
            border: "3px solid #2E5939",
            height: "fit-content",
            position: "sticky",
            top: 20,
            width: "100%",
            maxWidth: "100%", // 🔹 CORRECCIÓN: Limita el ancho máximo
            boxSizing: "border-box",
            overflow: "hidden" // 🔹 CORRECCIÓN: Evita scroll interno
          }}
        >
          <h3 style={{ 
            color: "#2E5939", 
            marginBottom: 15, 
            textAlign: "center",
            fontSize: "20px",
            fontWeight: "bold",
            width: "100%"
          }}>
            Calendario - Diciembre 2025
          </h3>
          
          {/* Leyenda */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap", // 🔹 CORRECCIÓN: Permite que se ajuste si no cabe
            gap: 15,
            marginBottom: 15,
            padding: "8px",
            backgroundColor: "#f0f7f0",
            borderRadius: 6,
            border: "1px solid #2E5939",
            width: "100%"
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
          
          {/* Grid de días CORREGIDO */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(7, 1fr)", 
            gap: 4,
            marginBottom: 25,
            width: "100%",
            boxSizing: "border-box"
          }}>
            {nombresDias.map((dia) => (
              <div key={dia} style={{ 
                textAlign: "center", 
                fontWeight: "bold", 
                color: "#2E5939",
                padding: "8px 2px",
                fontSize: "12px",
                backgroundColor: "#f0f7f0",
                borderRadius: 4,
                width: "100%",
                boxSizing: "border-box"
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
                      console.log(`🖱️ Clic en: Día ${dia}, Fecha exacta: ${fecha}`);
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
                    opacity: mostrarDia ? 1 : 0.5,
                    width: "100%", // 🔹 CORRECCIÓN: Ancho completo
                    boxSizing: "border-box" // 🔹 CORRECCIÓN: Incluye border en el ancho
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
          
          {/* Lista de reservas CORREGIDA */}
          <div style={{ marginTop: 20, width: "100%" }}>
            <h4 style={{ 
              color: "#2E5939", 
              marginBottom: 15,
              fontSize: "16px",
              fontWeight: "bold",
              borderBottom: "2px solid #f0f7f0",
              paddingBottom: 8,
              textAlign: "center",
              width: "100%"
            }}>
              {fechaSeleccionada ? `Reservas para ${formatearFechaParaMostrar(fechaSeleccionada)}` : "Seleccione una fecha"}
            </h4>
            
            {/* Debug: Mostrar la fecha que se está usando */}
            <div style={{ 
              textAlign: "center", 
              fontSize: "11px", 
              color: "#666",
              marginBottom: 10,
              backgroundColor: "#f9f9f9",
              padding: "4px",
              borderRadius: 4,
              width: "100%",
              boxSizing: "border-box"
            }}>
              Fecha consultada: {fechaSeleccionada}
            </div>
            
            {reservasCalendario && reservasCalendario.length > 0 ? (
              <div style={{ 
                maxHeight: "250px", 
                overflowY: "auto",
                borderRadius: 6,
                border: "1px solid #e0e0e0",
                width: "100%",
                boxSizing: "border-box"
              }}>
                {reservasCalendario.map((reserva, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "10px 12px",
                      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                      borderBottom: "1px solid #f0f0f0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      boxSizing: "border-box"
                    }}
                  >
                    <div style={{ width: "calc(100% - 70px)" }}>
                      <div style={{ fontWeight: "bold", color: "#2E5939", fontSize: "13px" }}>
                        {reserva.hora || "12:00"}
                      </div>
                      <div style={{ fontSize: "12px", color: "#666", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {reserva.cliente || "Cliente"}
                      </div>
                    </div>
                    {reserva.estado && (
                      <span style={{ 
                        backgroundColor: reserva.estado === "confirmada" ? "#4CAF50" : 
                                       reserva.estado === "pendiente" ? "#FF9800" : "#F44336",
                        color: "white",
                        padding: "3px 8px",
                        borderRadius: 10,
                        fontSize: "10px",
                        fontWeight: "bold",
                        flexShrink: 0,
                        marginLeft: 8
                      }}>
                        {reserva.estado}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                textAlign: "center", 
                padding: "20px",
                backgroundColor: "#f9f9f9",
                borderRadius: 6,
                color: "#666",
                border: "1px dashed #ddd",
                width: "100%",
                boxSizing: "border-box"
              }}>
                <p style={{ margin: 0, fontSize: "13px" }}>
                  {fechaSeleccionada ? "No hay reservas para esta fecha" : "Seleccione una fecha del calendario"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;