// src/routes/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { getUser } from "../utils/auth";

export default function ProtectedRoute({ children, allowedRole }) {
  const user = getUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Obtener el rol del usuario (soporta tanto 'rol' como 'role')
  const userRole = user.rol || user.role || "cliente";
  
  // Convertir a minúsculas para comparación case-insensitive
  const normalizedUserRole = userRole.toLowerCase();
  const normalizedAllowedRole = allowedRole.toLowerCase();

  if (normalizedUserRole !== normalizedAllowedRole) {
    // Redirigir según el rol del usuario
    if (normalizedUserRole === "admin") {
      return <Navigate to="/dashboard" replace />;
    }
    if (normalizedUserRole === "cliente") {
      return <Navigate to="/cliente" replace />;
    }
    
    // Rol no reconocido, redirigir al login
    return <Navigate to="/" replace />;
  }

  return children;
}