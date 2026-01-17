import { useEffect, useState } from "react";
import {
  Package,
  MapPin,
  User,
  Clock,
  CheckCircle,
  Truck,
  Phone,
  Navigation,
  CreditCard,
  ShoppingBag,
  IndianRupee
} from "lucide-react";
import axios from "axios";
export default function DeliveryDashboard() {
  const phone = localStorage.getItem("deliveryBoyPhone");

  const [active, setActive] = useState(false);
  const [orders, setOrders] = useState([]);

  /* =======================
     FETCH ORDERS
     ======================= */
  const getOrders = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/admin/delivery/orders/${phone}`
      );
    

      const mappedOrders = res.data.map(order => ({
        id: order.orderNumber,
        customerName: order.customerName ?? "N/A",
        phone: order.customerPhone ?? "N/A",
        address: `${order.customerAddress || ""}, ${
          order.customerCity || ""
        } - ${order.customerPincode || ""}`,
        items:
          order.items?.map(i => ({
            name: i.productName,
            category:i.category,
            qty: i.quantity,
            price:i.price
          })) || [],
        total: order.total ?? 0,
        status: order.status ?? "ASSIGNED",
        DeliveryCharged:order.deliveryCharge,
        orderTime: order.orderDate
          ? new Date(order.orderDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })
          : "N/A",
        paymentMethod:order.paymentMethod
      }));

      setOrders(mappedOrders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const updateOrderStatus = async (orderNumber, newStatus) => {
      try {
        await axios.put(`http://localhost:8080/api/${orderNumber}/status`, { status: newStatus });
        getOrders();
      } catch (err) {
        console.error("Failed to update order:", err);
      }
    };

  useEffect(() => {
    const saved = localStorage.getItem("deliveryActive");
    if (saved !== null) setActive(saved === "true");
  }, []);

  /* =======================
     TOGGLE STATUS
     ======================= */
  const toggleStatus = async () => {
    try {
      const newStatus = !active;
      await axios.put(
        `http://localhost:8080/admin/status?phone=${phone}&active=${newStatus}`
      );
      setActive(newStatus);
      localStorage.setItem("deliveryActive", newStatus);
    } catch {
      alert("Failed to update status");
    }
  };

  /* =======================
     UPDATE STATUS (UI)
     ======================= */
  const updateStatus = (id, status) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === id
          ? {
              ...o,
              status,
              deliveredTime:
                status === "delivered"
                  ? new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })
                  : o.deliveredTime
            }
          : o
      )
    );
  };

  const statusColor = status =>
    ({
      assigned: "bg-amber-50 text-amber-700 border border-amber-200",
      delivering: "bg-blue-50 text-blue-700 border border-blue-200",
      delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200"
    }[status] || "bg-gray-50 text-gray-700 border border-gray-200");

  /* =======================
     UI
     ======================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 text-white shadow-xl sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <Truck className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">ChapatiMart Delivery</h1>
                <p className="text-orange-100 text-sm font-medium">Partner Dashboard</p>
              </div>
            </div>

            <button
              onClick={toggleStatus}
              className={`px-8 py-3 rounded-xl font-bold shadow-lg transition-all duration-300 transform hover:scale-105 ${
                active
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                  : "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${active ? "bg-white animate-pulse" : "bg-gray-400"}`}></span>
                {active ? "Go Offline" : "Go Online"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Package className="text-orange-600 w-6 h-6" />
            </div>
            Active Orders
            <span className="text-lg font-normal text-gray-500">
              ({orders.filter(o => o.status !== "deliverd").length})
            </span>
          </h2>
        </div>

        {orders.filter(o => o.status !== "deliverd").length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No active orders at the moment</p>
            <p className="text-gray-400 text-sm mt-2">New orders will appear here</p>
          </div>
        )}

        <div className="space-y-6">
          {orders
            .filter(o => o.status !== "delivered")
            .map(order => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div>
                      <h3 className="font-bold text-xl text-gray-800 mb-1">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Ordered at {order.orderTime}
                      </p>
                    </div>

                    <span
                      className={`px-5 py-2 rounded-xl text-sm uppercase font-bold ${statusColor(
                        order.status
                      )}`}
                    >
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Customer Info */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          <User className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Customer</p>
                          <p className="font-semibold text-gray-800">{order.customerName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          <Phone className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Phone</p>
                          <p className="font-semibold text-gray-800">{order.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-200">
                      <div className="bg-white p-2 rounded-lg shadow-sm mt-1">
                        <MapPin className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-orange-700 font-bold uppercase tracking-wide mb-1">Delivery Address</p>
                        <p className="text-gray-800 font-medium leading-relaxed">{order.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 p-5 rounded-xl border border-purple-200">
                    <h3 className="text-xs font-bold text-purple-900 mb-2 uppercase tracking-wide flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Payment Method
                    </h3>
                    <p className="font-bold text-gray-900 text-lg">{order.paymentMethod}</p>
                  </div>

                  {/* Items & Pricing */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-6 border border-gray-200">
                    {/* Categories */}
                    <div className="mb-5">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" />
                        Categories
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((i, idx) => (
                          <span
                            key={idx}
                            className="bg-white border-2 border-gray-200 px-4 py-2 rounded-full text-sm font-semibold text-gray-700 shadow-sm"
                          >
                            {i.category}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="mb-5">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Order Items
                      </h4>
                      <div className="space-y-2">
                        {order.items.map((i, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm"
                          >
                            <span className="font-semibold text-gray-800">
                              <span className="text-orange-600 font-bold">{i.qty}×</span> {i.name}
                            </span>
                            <span className="font-bold text-gray-900 flex items-center gap-1">
                              <IndianRupee className="w-4 h-4" />
                              {i.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing Summary */}
                    <div className="border-t-2 border-gray-300 pt-4 space-y-3">
                      <div className="flex justify-between items-center text-gray-700">
                        <span className="font-semibold">Delivery Charge</span>
                        <span className="font-bold flex items-center gap-1">
                          <IndianRupee className="w-4 h-4" />
                          {order.DeliveryCharged}
                        </span>
                      </div>
                      <div className="flex justify-between items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-lg shadow-md">
                        <span className="font-bold text-lg">Total Amount</span>
                        <span className="font-bold text-2xl flex items-center gap-1">
                          <IndianRupee className="w-6 h-6" />
                          {order.total}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() =>
                        window.open(
                          `https://maps.google.com/?q=${encodeURIComponent(
                            order.address
                          )}`,
                          "_blank"
                        )
                      }
                      className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <Navigation className="inline w-5 h-5 mr-2" />
                      Navigate
                    </button>

                    {order.status === "assigned" && (
                      <button
                        onClick={() =>
                          updateOrderStatus(order.id, "delivering")
                        }
                        className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <Truck className="inline w-5 h-5 mr-2" />
                        Start Delivery
                      </button>
                    )}

                    {order.status === "delivering" && (
                      <button
                        onClick={() =>
                          updateOrderStatus(order.id, "delivered")
                        }
                        className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-bold shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <CheckCircle className="inline w-5 h-5 mr-2" />
                        Mark Delivered
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}