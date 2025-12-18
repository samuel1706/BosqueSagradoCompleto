// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { getUser } from "./utils/auth";
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
import TipoCabana from "./features/admin/TipoCabana/Tipocabana";
import Disponibilidad from "./features/admin/Disponibilidad/Disponibilidad";
import Ventas from "./features/admin/Ventas/Ventas";

// ✅ Componentes del Cliente
import HomeCliente from "./features/Cliente/HomeCliente";
import Landing from "./features/Cliente/Landing";
import MisReservas from "./features/Cliente/MisReservas";
import ReservaForm from "./features/Cliente/ReservaForm";

// ✅ Cloudinary Configuration
import { Cloudinary } from '@cloudinary/url-gen';

// Configuración global de Cloudinary
export const cld = new Cloudinary({
  cloud: {
    cloudName: 'dsmhnxyqh' // Tu cloud name
  }
});

// ✅ Cloudinary Context para manejar la subida de imágenes
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

// Crear contexto para Cloudinary
const CloudinaryContext = createContext();

export const useCloudinary = () => {
  const context = useContext(CloudinaryContext);
  if (!context) {
    throw new Error('useCloudinary debe ser usado dentro de CloudinaryProvider');
  }
  return context;
};

// Provider para Cloudinary
export const CloudinaryProvider = ({ children }) => {
  const [uploading, setUploading] = useState(false);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'react_upload'); // Usa el upload preset que creaste

    try {
      setUploading(true);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dsmhnxyqh/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log('✅ Imagen subida a Cloudinary:', response.data.secure_url);
      return {
        success: true,
        url: response.data.secure_url,
        publicId: response.data.public_id,
        fullData: response.data
      };
    } catch (error) {
      console.error('❌ Error subiendo imagen a Cloudinary:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setUploading(false);
    }
  };

  const uploadMultipleToCloudinary = async (files) => {
    const uploadPromises = files.map(file => uploadToCloudinary(file));
    const results = await Promise.all(uploadPromises);
    return results;
  };

  const value = {
    uploadToCloudinary,
    uploadMultipleToCloudinary,
    uploading
  };

  return (
    <CloudinaryContext.Provider value={value}>
      {children}
    </CloudinaryContext.Provider>
  );
};

// ✅ Componente reutilizable para subir imágenes
export const ImageUploader = ({ onImageUpload, multiple = false }) => {
  const { uploadToCloudinary, uploadMultipleToCloudinary, uploading } = useCloudinary();

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    try {
      let results;
      
      if (multiple) {
        results = await uploadMultipleToCloudinary(files);
      } else {
        const result = await uploadToCloudinary(files[0]);
        results = [result];
      }

      // Filtrar solo las subidas exitosas
      const successfulUploads = results.filter(result => result.success);
      
      if (onImageUpload) {
        if (multiple) {
          onImageUpload(successfulUploads);
        } else {
          onImageUpload(successfulUploads[0] || null);
        }
      }

    } catch (error) {
      console.error('Error en el proceso de subida:', error);
    }
  };

  return (
    <div className="image-uploader">
      <input 
        type="file" 
        onChange={handleFileChange} 
        accept="image/*"
        multiple={multiple}
        disabled={uploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
      />
      {uploading && (
        <p className="text-blue-600 text-sm mt-2">⏳ Subiendo imagen(es)...</p>
      )}
      <p className="text-gray-500 text-xs mt-1">
        Formatos soportados: JPG, PNG, GIF, WEBP
        {multiple && ' - Puedes seleccionar múltiples imágenes'}
      </p>
    </div>
  );
};

// ✅ Componente para mostrar imágenes de Cloudinary
export const CloudinaryImage = ({ publicId, width = 300, height, className = "" }) => {
  const imageUrl = cld.image(publicId)
    .resize(`w_${width}`, height ? `h_${height}` : null)
    .quality('auto')
    .format('auto')
    .toURL();

  return (
    <img 
      src={imageUrl} 
      alt="Cloudinary" 
      width={width}
      height={height}
      className={className}
      loading="lazy"
    />
  );
};

// ✅ Componente placeholder reutilizable
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

// ✅ Layout con Sidebar (Solo para Admin)
function LayoutWithSidebar() {
  const user = getUser();
  
  // Si no es admin, redirigir al home del cliente
  if (!user || user.rol !== "Admin") {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-[#F5F5F5] min-h-screen">
        <Routes>
          {/* 📊 Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* ⚙️ Configuración */}
          <Route path="/roles" element={<Roles />} />
          <Route path="/usuarios" element={<Users />} />

          {/* 🏕️ Reservas */}
          <Route path="/reservas/cabanas" element={<Cabins />} />
          <Route path="/reservas/tipocabana" element={<TipoCabana />} />
          <Route path="/reservas/disponibilidad" element={<Disponibilidad />} />
          <Route path="/reservas/servicios" element={<Gestiservi />} />
          <Route path="/reservas/paquetes" element={<Gestipaq />} />
          <Route path="/reservas/sedes" element={<Admisede />} />
          <Route path="/reservas/gestion-reservas" element={<GestionReserva />} />
          <Route path="/reservas/muebles" element={<Furniture />} />
          <Route path="/reservas/temporada" element={<Temporada />} />

          {/* 🛍️ Compras */}
          <Route path="/compras/gestion-categoria-producto" element={<CategoriaProducto />} />
          <Route path="/compras/gestion-productos" element={<Productos />} />
          <Route path="/compras/proveedores" element={<Proveedores />} />
          <Route path="/compras/compras" element={<Compras />} />
          <Route path="/compras/gestion-marca" element={<Marca />} />

          {/* 🆕 🛒 Ventas */}
          <Route path="/ventas/ventas" element={<Ventas />} />

          {/* 🚧 Rutas vacías opcionales */}
          <Route path="/reservas" element={<Placeholder title="Gestión de Reservas" />} />
          <Route path="/compras" element={<Placeholder title="Gestión de Compras" />} />
          <Route path="/ventas" element={<Ventas />} /> {/* Ruta principal de ventas */}

          {/* 🏠 Ruta por defecto */}
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}

// ✅ Layout del Cliente (Sin Sidebar)
function ClienteLayout() {
  const user = getUser();
  
  // Si no está autenticado, redirigir al login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Si es admin, redirigir al dashboard
  if (user.rol === "Admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f8faf8]">
      <Routes>
        <Route path="/home" element={<HomeCliente />} />
        <Route path="/mis-reservas" element={<MisReservas />} />
        <Route path="/reservar" element={<ReservaForm />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  );
}

// ✅ Componente de redirección basado en el rol
function RoleBasedRedirect() {
  const user = getUser();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.rol === "Admin") {
    return <Navigate to="/dashboard" replace />;
  } else {
    return <Navigate to="/home" replace />;
  }
}

// ✅ App principal
function App() {
  const location = useLocation();
  const user = getUser();
  
  // Determinar qué layout mostrar basado en la ruta y el rol del usuario
  const isLoginPage = location.pathname === "/";
  const isAdminRoute = location.pathname.startsWith('/dashboard') || 
                       location.pathname.startsWith('/reservas') ||
                       location.pathname.startsWith('/compras') ||
                       location.pathname.startsWith('/ventas') ||
                       location.pathname.startsWith('/roles') ||
                       location.pathname.startsWith('/usuarios');
  
  const isClienteRoute = location.pathname.startsWith('/home') ||
                        location.pathname.startsWith('/mis-reservas') ||
                        location.pathname.startsWith('/reservar') ||
                        location.pathname.startsWith('/landing');

  return (
    <>
      {isLoginPage ? (
        <Routes>
          <Route path="/" element={<LoginRegister />} />
        </Routes>
      ) : isAdminRoute ? (
        <LayoutWithSidebar />
      ) : isClienteRoute ? (
        <ClienteLayout />
      ) : (
        // Redirección por defecto basada en el rol
        <RoleBasedRedirect />
      )}
    </>
  );
}

// ✅ Exporta envuelto en Router y CloudinaryProvider
export default function AppWrapper() {
  return (
    <CloudinaryProvider>
      <Router>
        <App />
      </Router>
    </CloudinaryProvider>
  );
}