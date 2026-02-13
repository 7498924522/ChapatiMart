import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export default function DeliveryBoyLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const ADMIN_USER = import.meta.env.VITE_ADMIN_USER;
  const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS;
  const handleLogin = async (e) => {
  e.preventDefault();
  if(form.username == ADMIN_USER && form.password == ADMIN_PASS)
    {
      localStorage.setItem("role", "ADMIN");
      navigate("/admin")
      toast.success("Login Sucessfully !")
       return;

    }
    else
    {
        toast.error("Login Failed");
    }


};
  return (
    
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-100 to-green-200">
      <div  className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <form
        onSubmit={handleLogin}
       
      >
       
          <h2 className="text-2xl font-bold mb-6 text-green-700">Admin Login</h2>

       
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-6 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <button
          type="submit"
          
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all font-bold"
        >
           Login Here
        </button>
       
      </form>
       <button
        onClick={()=>navigate(-1)}
        className="w-full bg-white/50 my-4 text-gray-500 py-3 rounded-lg hover:bg-gray-200 transition-all font-bold"
        >
         Back
        </button>
      </div>
      
    </div>
  );
}
