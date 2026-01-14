import { useState } from "react";
import axios from "axios";

export default function AddDeliveryBoy() {
  
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createDeliveryBoy = async () => {
    await axios.post("http://localhost:8080/admin/delivery-boy", {
      ...form,
     
     
    });
    alert("Delivery Boy Created");
  };

  return (
    <div className="p-6 max-w-md bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Create Delivery Boy</h2>

      <input name="name" placeholder="Name" onChange={handleChange} className="input" />
      <input name="phone" placeholder="Phone" onChange={handleChange} className="input" />
      <input name="email" placeholder="Email" onChange={handleChange} className="input" />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} className="input" />

      <button onClick={createDeliveryBoy} className="bg-green-600 text-white px-4 py-2 mt-4 rounded">
        Create
      </button>
    </div>
  );
}
