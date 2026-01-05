import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem("loggedInUser"); // check login

  if (!isLoggedIn) {
    // Redirect to login page if not logged in
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the requested page
  return children;
}
