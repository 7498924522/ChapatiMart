import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./Components/Home";
import Chapati from "./Components/Chapati";
import Flour from "./Components/Flour";
import Wheat from "./Components/Wheat";
import UnifiedCartFlow from "./Components/UnifiedCartFlow";
import MainPage from "./Components/MainPage";
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import AdminDashboard from "./Components/Admin/AdminDashboard";
// import PhoneLogin from "./Components/PhoneLogin";
import DeliveryDashboard from "./Components/Delivery/DeliveryDashboard";
import DeliveryBoysList from "./Components/Admin/DeliveryBoysList";
import DeliveryBoyLogin from "./Components/Delivery/DeliveryBoyLogin";
import MyOrders from "./Components/MyOrders";
import ProtectedRoute from "./Components/ProtectedRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



function App() {
  return (
    <>
      {/* Pop Up Purpose */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        theme="light"
      />
      <Router>
        <Routes>
          {/* Public By Default */}
          <Route path="/" element={<MainPage />} />

          {/* Account Creation Login Pages  */}
          <Route path="/signup" element={<SignUp />}/>
          <Route path="/login" element={<Login />}/>
          {/* <Route path="/phone_login" element={<PhoneLogin/>} /> */}

          {/* PRIVATE Customer Side Pages */}
          <Route element={<ProtectedRoute />}>
            <Route path="/chapati" element={<Chapati />} />
            <Route path="/flour" element={<Flour />} />
            <Route path="/gahu" element={<Wheat />} />
            <Route path="/cart" element={<UnifiedCartFlow />} />
            <Route path="/home" element={<Home />} />
            <Route path="/myorders" element={<MyOrders />} />
          </Route>

          {/* Admin Page  */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Delivery Dashboard */}
          <Route path="/delivery" element={<DeliveryDashboard />} />
          <Route path="/delivery_Login" element={<DeliveryBoyLogin />} />
          <Route path="/deliveryB_list" element={<DeliveryBoysList />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
