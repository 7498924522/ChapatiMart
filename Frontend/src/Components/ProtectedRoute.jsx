import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("jwtToken");
  const location = useLocation();

  // ❌ No login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ Logged in
  return <Outlet />;
};

export default ProtectedRoute;
