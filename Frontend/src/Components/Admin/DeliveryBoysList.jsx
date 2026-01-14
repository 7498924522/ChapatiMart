import { useEffect, useState } from "react";
import axios from "axios";

export default function DeliveryBoysList() {
  const [boys, setBoys] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch delivery boys from backend
  const fetchDeliveryBoys = async () => {
    try {
      const res = await axios.get("http://localhost:8080/admin/delivery-boys");
      setBoys(res.data);
    } catch (err) {
      console.error("Failed to load delivery boys", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryBoys();

   
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading Delivery Boys...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-green-700">
        🚴 Delivery Boys Dashboard
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border rounded-xl overflow-hidden shadow">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Delivery Status</th>
              <th className="p-3 text-left">Active</th>
            </tr>
          </thead>

          <tbody>
            {boys.map((boy) => (
              <tr
                key={boy.id}
                
                
              >
                <td className="p-3">{boy.id}</td>
                <td className="p-3 font-semibold">{boy.name}</td>
                <td className="p-3">{boy.phone}</td>
                <td className="p-3">{boy.email}</td>
                <td className="p-3">{boy.deliveryStatus || "Pending"}</td>
                <td>
                  <span
                    className={
                      boy.active === "online" ? "text-green-600 font-bold" : "text-red-600 font-bold"
                    }
                  >
                    {boy.active === "online" ? "🟢 ONLINE" : "⚪ OFFLINE"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
