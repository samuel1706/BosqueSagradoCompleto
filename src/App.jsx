// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Cabins from "./features/admin/cabins/cabins";
import Gestiservi from "./features/admin/gestiservi/gestiservi";
import Gestipaq from "./features/admin/gestipaq/gestipaq";
import Admisede from "./features/admin/admisede/admisede";
import GestionReserva from "./features/admin/gestionreserva/gestionreserva";
import CategoriaProducto from "./features/admin/categoria/categoria";
import Productos from "./features/admin/producto/producto";
import Roles from "./features/admin/roles/roles";
import Dashboard from "./features/admin/dashboard/dashboard";
import Furniture from "./features/admin/furniture/Furniture";
import Users from "./features/admin/users/users";
import Proveedores from "./features/admin/proveedores/proveedores";
import Compras from "./features/admin/compras/compras";
import LoginRegister from "./features/admin/loginform/loginform";
import Marca from "./features/admin/marca/marca";
import Temporada from "./features/admin/Temporada/Temporada";

// ✅ CORREGIR ESTAS IMPORTACIONES - Usar el casing exacto de tus archivos
import TipoCabana from "./features/admin/TipoCabana/Tipocabana";
import Disponibilidad from "./features/admin/Disponibilidad/Disponibilidad";

// ✅ Componente placeholder para rutas vacías
const Placeholder = ({ title }) => (
  <div style={{ 
    padding: '40px', 
    textAlign: 'center', 
    color: '#2E5939',
    backgroundColor: '#f5f8f2',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  }}>
    <h1 style={{ fontSize: '2.5rem', margin: 0 }}>🚧 {title}</h1>
    <p style={{ fontSize: '1.2rem', color: '#679750' }}>
      Módulo en desarrollo
    </p>
  </div>
);

// ✅ Layout con Sidebar
function LayoutWithSidebar() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-[#F5F5F5] min-h-screen">
        <Routes>
          {/* 📌 Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* 📌 Configuración */}
          <Route path="/roles" element={<Roles />} />
          <Route path="/usuarios" element={<Users />} />
          

          {/* 📌 Reservas - MANTIENDO LA ESTRUCTURA ORIGINAL */}
          <Route path="/reservas/cabanas" element={<Cabins />} />
          <Route path="/reservas/tipocabana" element={<TipoCabana />} />
          <Route path="/reservas/disponibilidad" element={<Disponibilidad />} />
          <Route path="/reservas/servicios" element={<Gestiservi />} />
          <Route path="/reservas/paquetes" element={<Gestipaq />} />
          <Route path="/reservas/sedes" element={<Admisede />} />
          <Route path="/reservas/gestion-reservas" element={<GestionReserva />} />
          <Route path="/reservas/muebles" element={<Furniture />} />
          <Route path="/reservas/Temporada" element={<Temporada />} />

          {/* 📌 Compras */}
          <Route path="/compras/gestion-categoria-producto" element={<CategoriaProducto />} />
          <Route path="/compras/gestion-productos" element={<Productos />} />
          <Route path="/compras/proveedores" element={<Proveedores />} />
          <Route path="/compras/compras" element={<Compras />} />
          <Route path="/compras/gestion-marca" element={<Marca />} />

          {/* 📌 Rutas vacías opcionales */}
          <Route path="/reservas" element={<Placeholder title="Gestión de Reservas" />} />
          <Route path="/compras" element={<Placeholder title="Gestión de Compras" />} />

          {/* 📌 Ruta por defecto */}
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}

// ✅ App principal
function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <>
      {isLoginPage ? (
        <Routes>
          <Route path="/" element={<LoginRegister />} />
        </Routes>
      ) : (
        <LayoutWithSidebar />
      )}
    </>
  );
}

// ✅ Exporta envuelto en Router
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}