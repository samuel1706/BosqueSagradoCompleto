// src/components/Sidebar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTrademark,
  FaTachometerAlt,
  FaCogs,
  FaUserShield,
  FaUsers,
  FaHotel,
  FaBoxOpen,
  FaHome,
  FaConciergeBell,
  FaBoxes,
  FaBuilding,
  FaClipboardList,
  FaCouch,
  FaTags,
  FaTruck,
  FaShoppingCart,
  FaSignOutAlt,
  FaUserCircle,
  FaCalendarAlt,
  FaCalendar,
  FaShoppingBag, // 🆕 Icono para Ventas
} from "react-icons/fa";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar toda la información de autenticación
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userToken");
    
    // Redirigir al landing page (página principal)
    navigate("/");
  };

  return (
    <aside
      className="sidebar"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
      aria-label="Barra lateral de navegación"
    >
      {/* Logo */}
      <div className="logo" style={{ padding: "16px 12px" }}>
        <img src="/images/Logo.png" alt="Logo" style={{ maxWidth: "100%" }} />
      </div>

      {/* Menú principal */}
      <nav style={{ flex: 1 }}>
        <ul className="menu" style={{ padding: 0, margin: 0 }}>
          {/* Dashboard */}
          <li>
            <Link to="/dashboard" aria-label="Dashboard">
              <FaTachometerAlt /> &nbsp; Dashboard
            </Link>
          </li>

          {/* Configuración */}
          <li>
            <details>
              <summary className="submenu-toggle" aria-haspopup="true" aria-expanded="false">
                <FaCogs /> &nbsp; Configuración
              </summary>
              <ul className="submenu">
                <li>
                  <Link to="/roles">
                    <FaUserShield /> &nbsp; Roles
                  </Link>
                </li>
                <li>
                  <Link to="/usuarios">
                    <FaUsers /> &nbsp; Usuarios
                  </Link>
                </li>
              </ul>
            </details>
          </li>

          {/* Reservas */}
          <li>
            <details>
              <summary className="submenu-toggle" aria-haspopup="true" aria-expanded="false">
                <FaHotel /> &nbsp; Reservas
              </summary>
              <ul className="submenu">
                <li>
                  <Link to="/reservas/sedes">
                    <FaBuilding /> &nbsp; Sedes
                  </Link>
                </li>
                <li>
                  <Link to="/reservas/tipocabana">
                    <FaHome /> &nbsp; Tipo Cabañas
                  </Link>
                </li>
                <li>
                  <Link to="/reservas/cabanas">
                    <FaHome /> &nbsp; Cabañas
                  </Link>
                </li>
                <li>
                  <Link to="/reservas/muebles">
                    <FaCouch /> &nbsp; Comodidades
                  </Link>
                </li>
                <li>
                  <Link to="/reservas/servicios">
                    <FaConciergeBell /> &nbsp; Servicios
                  </Link>
                </li>
                <li>
                  <Link to="/reservas/paquetes">
                    <FaBoxes /> &nbsp; Paquetes
                  </Link>
                </li>
                <li>
                  <Link to="/reservas/temporada">
                    <FaCalendar /> &nbsp; Temporada
                  </Link>
                </li>
                <li>
                  <Link to="/reservas/disponibilidad">
                    <FaHome /> &nbsp; Disponibilidad
                  </Link>
                </li>
                <li>
                  <Link to="/reservas/gestion-reservas">
                    <FaClipboardList /> &nbsp; Reservas
                  </Link>
                </li>
              </ul>
            </details>
          </li>

          {/* Compras */}
          <li>
            <details>
              <summary className="submenu-toggle" aria-haspopup="true" aria-expanded="false">
                <FaBoxOpen /> &nbsp; Compras
              </summary>
              <ul className="submenu">
                <li>
                  <Link to="/compras/gestion-categoria-producto">
                    <FaTags /> &nbsp; Categoría Producto
                  </Link>
                </li>
                <li>
                  <Link to="/compras/gestion-marca">
                    <FaTrademark /> &nbsp; Marca
                  </Link>
                </li>
                <li>
                  <Link to="/compras/proveedores">
                    <FaTruck /> &nbsp; Proveedores
                  </Link>
                </li>
                <li>
                  <Link to="/compras/gestion-productos">
                    <FaBoxes /> &nbsp; Productos
                  </Link>
                </li>
                <li>
                  <Link to="/compras/compras">
                    <FaShoppingCart /> &nbsp; Compras
                  </Link>
                </li>
              </ul>
            </details>
          </li>
          <li>
                  <Link to="/ventas">
                    <FaShoppingCart /> &nbsp; Ventas
                  </Link>
                </li>
        </ul>
      </nav>

      {/* Perfil Admin */}
      <div
        style={{
          backgroundColor: "rgba(240, 252, 241, 1)",
          padding: "12px",
          borderRadius: "8px",
          margin: "0 10px 10px 10px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
        aria-label="Perfil del usuario"
      >
        <FaUserCircle size={32} color="#333" />
        <div>
          <div style={{ fontWeight: "bold", color: "#333" }}>Admin</div>
          <div style={{ fontSize: "0.8rem", color: "#555" }}>Administrador</div>
        </div>
      </div>

      {/* Botón Cerrar Sesión - CORREGIDO */}
      <div style={{ padding: "10px", marginBottom: "15px" }}>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            backgroundColor: "rgba(240, 252, 241, 1)",
            color: "#333",
            padding: "10px",
            border: "none",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(232, 245, 233, 1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(240, 252, 241, 1)";
          }}
          aria-label="Cerrar sesión"
        >
          <FaSignOutAlt style={{ marginRight: "8px" }} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;