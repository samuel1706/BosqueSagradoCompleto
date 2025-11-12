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
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
  const [reservasCalendario, setReservasCalendario] = useState([]);
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
        // Datos para gráfico de cabañas - CORREGIDO: sin parámetro de sede
        const responseCabañas = await fetch(
          `http://localhost:5272/api/reportes/cabanas-populares/${filtro}`
        );
        if (responseCabañas.ok) {
          const dataCabañas = await responseCabañas.json(); // CORREGIDO: responseCabañas
          setDatosCabañas(dataCabañas);
        }

        // Datos para gráfico de sedes
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
  }, [filtro]); // CORREGIDO: solo depende del filtro, no de la sede

  // 🔹 Obtener reservas por fecha
  const obtenerReservasPorFecha = async (fecha) => {
    if (!sedeSeleccionada) return;
    
    try {
      const response = await fetch(
        `http://localhost:5272/api/reportes/reservas-fecha/${sedeSeleccionada}/${fecha}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setReservasCalendario(data);
      } else {
        setReservasCalendario([]);
      }
    } catch (error) {
      console.error("Error al obtener reservas:", error);
      setReservasCalendario([]);
    }
  };

  // 🔹 Generar días del mes actual para el calendario simple
  const generarDiasDelMes = () => {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = fecha.getMonth();
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const dias = [];

    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      dias.push({
        fecha: `${año}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`,
        dia: dia
      });
    }

    return dias;
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

  // 🔹 Calcular total de reservas
  const totalReservas = datos ? datos.reduce((total, item) => total + (item.valor || 0), 0) : 0;

  // 🔹 Estado de carga
  if (loading) {
    return <div style={{ textAlign: "center", padding: 40 }}>Cargando datos...</div>;
  }

  const diasDelMes = generarDiasDelMes();
  const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const fechaActual = new Date();

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

      {/* 🔹 Selectores Mejorados */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr 1fr", 
        gap: 15, 
        marginBottom: 30,
        alignItems: "end"
      }}>
        {/* Selector de Sede */}
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

        {/* Selector de Filtro */}
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

        {/* Selector de Fecha */}
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
              setFechaSeleccionada(e.target.value);
              obtenerReservasPorFecha(e.target.value);
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

      {/* 🔹 Estadísticas Rápidas - Sin "Sede Activa" */}
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

      {/* 🔹 Contenido Principal - Tres Gráficos y Calendario */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 400px",
        gap: 20,
        alignItems: "start"
      }}>
        {/* Columna de Gráficos */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 20
        }}>
          {/* Gráfico de Barras Principal Mejorado */}
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

          {/* Gráficos de Torta - Lado a Lado */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20
          }}>
            {/* Gráfico de Cabañas Más Reservadas */}
            <div
              style={{
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                border: "2px solid #679750",
                height: "300px"
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

            {/* Gráfico de Reservas por Sede */}
            <div
              style={{
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                border: "2px solid #679750",
                height: "300px"
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

        {/* Calendario y Reservas */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            border: "2px solid #679750",
          }}
        >
          <h3 style={{ color: "#2E5939", marginBottom: 15, textAlign: "center" }}>
            Calendario - {meses[fechaActual.getMonth()]} {fechaActual.getFullYear()}
          </h3>
          
          {/* Grid de días del mes */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(7, 1fr)", 
            gap: 4,
            marginBottom: 20
          }}>
            {nombresDias.map((dia) => (
              <div key={dia} style={{ 
                textAlign: "center", 
                fontWeight: "bold", 
                color: "#2E5939",
                padding: "8px 4px",
                fontSize: "12px"
              }}>
                {dia}
              </div>
            ))}
            {diasDelMes.map(({ fecha, dia }) => {
              const esHoy = fecha === new Date().toISOString().split('T')[0];
              return (
                <button
                  key={fecha}
                  onClick={() => {
                    setFechaSeleccionada(fecha);
                    obtenerReservasPorFecha(fecha);
                  }}
                  style={{
                    padding: "8px 4px",
                    border: "1px solid #e0e0e0",
                    backgroundColor: esHoy ? "#2E5939" : 
                                    fecha === fechaSeleccionada ? "#4CAF50" : "transparent",
                    color: esHoy || fecha === fechaSeleccionada ? "white" : "#2E5939",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "bold",
                    transition: "all 0.2s ease"
                  }}
                >
                  {dia}
                </button>
              );
            })}
          </div>
          
          {/* Lista de reservas para la fecha seleccionada */}
          <div style={{ marginTop: 20 }}>
            <h4 style={{ color: "#2E5939", marginBottom: 10 }}>
              Reservas para {new Date(fechaSeleccionada).toLocaleDateString('es-ES')}
            </h4>
            {reservasCalendario && reservasCalendario.length > 0 ? (
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                {reservasCalendario.map((reserva, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "8px 12px",
                      marginBottom: 8,
                      backgroundColor: "#f0f7f0",
                      borderRadius: 6,
                      borderLeft: "4px solid #2E5939"
                    }}
                  >
                    <strong>{reserva.hora}</strong> - {reserva.cliente || "Reserva"}
                    {reserva.estado && (
                      <span style={{ 
                        float: "right", 
                        backgroundColor: reserva.estado === "confirmada" ? "#4CAF50" : "#FF9800",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: 12,
                        fontSize: "12px"
                      }}>
                        {reserva.estado}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#666", textAlign: "center" }}>
                No hay reservas para esta fecha
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;