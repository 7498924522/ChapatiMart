import React from "react";
import { useEffect, useState } from "react";
import API_BASE_URL from "@/config/api.js";





export default function DeliveryBoysList() {
  const [boys, setBoys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBoyId, setExpandedBoyId] = useState(null);

  // Fetch delivery boys and their orders from backend
  const fetchDeliveryBoys = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/delivery-boys`);
      if (!res.ok) throw new Error("Failed to fetch");
      const boysData = await res.json();

      // Fetch orders for each delivery boy
      const boysWithOrders = await Promise.all(
        boysData.map(async (boy) => {
          try {
            const ordersRes = await fetch(
              `${API_BASE_URL}/admin/delivery/orders/${boy.phone}`
            );
            if (!ordersRes.ok) return { ...boy, orders: [] };
            
            const ordersData = await ordersRes.json();
            
            const mappedOrders = ordersData.map(order => ({
              id: order.orderNumber,
              customerName: order.customerName ?? "N/A",
              phone: order.customerPhone ?? "N/A",
              address: `${order.customerAddress || ""}, ${
                order.customerCity || ""
              } - ${order.customerPincode || ""}`,
              items: order.items?.map(i => ({
                name: i.productName,
                category: i.category,
                qty: i.quantity,
                price: i.price
              })) || [],
              total: order.total ?? 0,
              status: order.status ?? "assigned",
              deliveryCharge: order.deliveryCharge,
              orderTime: order.orderDate
                ? new Date(order.orderDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })
                : "N/A",
              Date: order.orderDate
          ? new Date(order.orderDate).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
              
            })
          : 'N/A',
              paymentMethod: order.paymentMethod,
              deliveredTime: order.deliveredTime || null
            }));
            setBoys(mappedOrders);

            return {
              ...boy,
              orders: mappedOrders,
              totalOrders: mappedOrders.length,
              completedOrders: mappedOrders.filter(o => o.status === "delivered").length,
              pendingOrders: mappedOrders.filter(o => o.status === "assigned" || o.status === "delivering").length,
              cancelledOrders: mappedOrders.filter(o => o.status === "cancelled").length
            };
          } catch (err) {
            console.error(`Failed to fetch orders for ${boy.name}:`, err);
            return { ...boy, orders: [], totalOrders: 0, completedOrders: 0, pendingOrders: 0, cancelledOrders: 0 };
          }
        })
      );

      setBoys(boysWithOrders);
      
    } catch (err) {
      console.error("Failed to load delivery boys", err);
     
    } finally {
      setLoading(false);
    }
  };
 
  const sorted=[...boys].sort((a,b)=>
  {
    return new Date(b.Date) - new Date(a.Date);
  }
  );
  

 
  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case "delivered": return "bg-green-100 text-green-800 border-green-300";
      case "assigned": 
      case "delivering": return "bg-blue-100 text-blue-800 border-blue-300";
      case "cancelled": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Delivery Boys...</p>
        </div>
      </div>
    );
  }
 
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🚴 Delivery Boys Dashboard
          </h1>
          <p className="text-gray-600">Overview of all delivery personnel and their orders</p>
        </div>

        {/* Delivery Boys List */}
        <div className="space-y-4">
          {boys.map((boy) => (
            <div key={boy.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Delivery Boy Summary */}
              <div 
                className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedBoyId(expandedBoyId === boy.id ? null : boy.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 uppercase rounded-full flex items-center justify-center text-green-600 font-bold text-xl">
                      {boy.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{boy.name}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-1">
                        <span>📞 {boy.phone}</span>
                        <span>✉️ {boy.email}</span>
                        <span className={boy.active === "online" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                          {boy.active === "online" ? "🟢 ONLINE" : "⚪ OFFLINE"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <div className="bg-blue-100 px-4 py-2 rounded-lg">
                      <div className="text-xs text-blue-600 font-medium">Total Orders</div>
                      <div className="text-xl font-bold text-blue-800">{boy.totalOrders}</div>
                    </div>
                    <div className="bg-green-100 px-4 py-2 rounded-lg">
                      <div className="text-xs text-green-600 font-medium">Completed</div>
                      <div className="text-xl font-bold text-green-800">{boy.completedOrders}</div>
                    </div>
                    <div className="bg-yellow-100 px-4 py-2 rounded-lg">
                      <div className="text-xs text-yellow-600 font-medium">Pending</div>
                      <div className="text-xl font-bold text-yellow-800">{boy.pendingOrders}</div>
                    </div>
                    <div className="bg-red-100 px-4 py-2 rounded-lg">
                      <div className="text-xs text-red-600 font-medium">Cancelled</div>
                      <div className="text-xl font-bold text-red-800">{boy.cancelledOrders}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders Table - Expandable */}
              {expandedBoyId === boy.id && boy.orders.length > 0 && (
                <div className="border-t border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-green-600 to-green-500 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Order ID</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Date & Time</th>
                          
                          <th className="px-4 py-3 text-right text-sm font-semibold">Charges</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold">Status</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold">Payment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {boy.orders
                        .slice()
                        .sort((a, b) => new Date(b.Date) - new Date(a.Date))
                        .map((order, index) => (
                          <tr 
                            key={order.id}
                            className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                          >
                            <td className="px-4 py-3 font-semibold text-gray-800">
                              #{order.id}
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              {order.customerName}
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              {order.phone}
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              <div className="text-sm">
                                <div>{order.Date}</div>
                                <div className="text-gray-500">{order.orderTime}</div>
                              </div>
                            </td>
                           
                            <td className="px-4 py-3 text-right font-semibold text-gray-800">
                              ₹{order.deliveryCharge}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                                {order.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-gray-700">
                              {order.paymentMethod}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {expandedBoyId === boy.id && boy.orders.length === 0 && (
                <div className="border-t border-gray-200 p-8 text-center text-gray-500">
                  <div className="text-4xl mb-2">📭</div>
                  <p>No orders assigned yet</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {boys.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg font-medium">No delivery boys found</p>
          </div>
        )}
      </div>
    </div>
  );
}