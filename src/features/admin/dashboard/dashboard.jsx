import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [sedes, setSedes] = useState([]);
  const [sedeSeleccionada, setSedeSeleccionada] = useState(null);
  const [filtro, setFiltro] = useState("diario");
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Obtener sedes desde backend
  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const response = await fetch("http://localhost:5272/api/reportes/sedes");
        const data = await response.json();
        setSedes(data);
        if (data.length > 0) {
          setSedeSeleccionada(data[0].idSede); // primera sede por defecto
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sedeSeleccionada, filtro]);

  // 🔹 Estado de carga
  if (loading) {
    return <div style={{ textAlign: "center", padding: 40 }}>Cargando datos...</div>;
  }

  if (!datos) {
    return <div style={{ textAlign: "center", padding: 40 }}>No hay datos disponibles</div>;
  }

  // 🔹 Preparar gráfica
  const chartData = {
    labels: datos.map((d) => d.label),
    datasets: [
      {
        label: "Reservas",
        data: datos.map((d) => d.valor),
        backgroundColor: "#2E5939",
        borderRadius: 6,
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
          },
        },
      },
      title: {
        display: true,
        text: `Reservas (${filtro.charAt(0).toUpperCase() + filtro.slice(1)})`,
        color: "#2E5939",
        font: {
          size: 18,
          weight: "bold",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(46, 89, 57, 0.1)",
        },
        ticks: {
          color: "#2E5939",
          font: {
            weight: "bold",
          },
        },
      },
      x: {
        grid: {
          color: "rgba(46, 89, 57, 0.1)",
        },
        ticks: {
          color: "#2E5939",
          font: {
            weight: "bold",
          },
        },
      },
    },
  };

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

      {/* 🔹 Botones de sedes dinámicos */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {sedes.map((sede) => (
          <button
            key={sede.idSede}
            onClick={() => setSedeSeleccionada(sede.idSede)}
            style={{
              backgroundColor: sedeSeleccionada === sede.idSede ? "#2E5939" : "#F7F4EA",
              color: sedeSeleccionada === sede.idSede ? "white" : "#2E5939",
              padding: "12px 16px",
              border: "1px solid #2E5939",
              borderRadius: 10,
              fontWeight: "600",
              cursor: "pointer",
              flex: "1 1 200px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              minWidth: "200px",
            }}
          >
            {sede.nombreSede}
          </button>
        ))}
      </div>

      {/* 🔹 Botones de filtros */}
      <div style={{ display: "flex", gap: 12, marginBottom: 30, flexWrap: "wrap" }}>
        {["diario", "semanal", "mensual", "anual"].map((tipo) => (
          <button
            key={tipo}
            onClick={() => setFiltro(tipo)}
            style={{
              backgroundColor: filtro === tipo ? "#2E5939" : "#F7F4EA",
              color: filtro === tipo ? "white" : "#2E5939",
              padding: "10px 14px",
              border: "1px solid #2E5939",
              borderRadius: 10,
              fontWeight: "600",
              cursor: "pointer",
              flex: "1 1 120px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              minWidth: "120px",
            }}
          >
            {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
          </button>
        ))}
      </div>

      {/* 🔹 Gráfica */}
      <div
        style={{
          backgroundColor: "#fff",
          padding: 25,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          border: "2px solid #679750",
        }}
      >
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Dashboard;
