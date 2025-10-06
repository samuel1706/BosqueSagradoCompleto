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
  FaUserCircle
} from "react-icons/fa";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/");
  };

  return (
    <div
      className="sidebar"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      {/* Logo */}
      <div className="logo">
        <img src="/images/Logo.png" alt="Logo" />
      </div>

      {/* Menú principal */}
      <ul className="menu" style={{ flex: 1 }}>
        {/* Dashboard */}
        <li>
          <Link to="/dashboard">
            <FaTachometerAlt /> &nbsp; Dashboard
          </Link>
        </li>

        {/* Configuración */}
        <li>
          <details>
            <summary className="submenu-toggle">
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
            <summary className="submenu-toggle">
              <FaHotel /> &nbsp; Reservas
            </summary>
            <ul className="submenu">
              <li>
                <Link to="/reservas/sedes">
                  <FaBuilding /> &nbsp; Sedes
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
            <summary className="submenu-toggle">
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
      </ul>

      {/* Perfil Admin */}
      <div
        style={{
          backgroundColor: "rgba(240, 252, 241, 1)",
          padding: "12px",
          borderRadius: "8px",
          margin: "0 10px 10px 10px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}
      >
        <FaUserCircle size={32} color="#333" />
        <div>
          <div style={{ fontWeight: "bold", color: "#333" }}>Admin</div>
          <div style={{ fontSize: "0.8rem", color: "#555" }}>Administrador</div>
        </div>
      </div>

      {/* Botón Cerrar Sesión */}
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
            transition: "background-color 0.3s"
          }}
        >
          <FaSignOutAlt style={{ marginRight: "8px" }} />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
