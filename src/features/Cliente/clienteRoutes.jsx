import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import ReservaForm from "./ReservaForm";
import MisReservas from "./MisReservas";

// ✅ Este componente define todas las rutas del cliente
export default function ClienteRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/reservar" element={<ReservaForm />} />
      <Route path="/mis-reservas" element={<MisReservas />} />
    </Routes>
  );
}

///clienteroutes