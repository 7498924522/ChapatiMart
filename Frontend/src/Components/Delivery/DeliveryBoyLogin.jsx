import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_BASE_URL from "@/config/api.js";






export default function DeliveryBoyLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await axios.post(
      `${API_BASE_URL}/admin/deliveryBoy/login`,
      form
    );

    console.log("Login Success:", res.data);

    // ✅ Store ONLY phone number
    localStorage.setItem("deliveryBoyPhone", String(res.data.phone));

    // ✅ Verify storage
    console.log(
      "Stored phone:",
      localStorage.getItem("deliveryBoyPhone")
    );

    toast.success("Login Successful!");
    navigate("/delivery");

  } catch (err) {
    console.error("Login Error:", err.response?.data || err.message);
    toast.error(err.response?.data || "Login failed");

  } finally {
    setLoading(false);
  }
};
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-100 to-green-200">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-green-700">DeliveryBoy Login</h2>

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
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
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all font-bold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
