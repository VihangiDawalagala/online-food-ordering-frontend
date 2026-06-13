import { useEffect, useState } from "react";

import { getOrders } from "../api/orderApi";
import type { Order } from "../types";
import { useAuth } from "../context/useAuth";

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        return;
      }

      try {
        const response = await getOrders(user.id);
        setOrders(response.data as Order[]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <p className="text-center font-semibold">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-gray-800 mb-10">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-600">
              No Orders Found
            </h2>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Order #{order.id}
                </h2>

                <span className="w-fit rounded-md bg-amber-100 px-4 py-2 font-semibold text-amber-800">
                  {order.status}
                </span>
              </div>

              <p className="text-gray-500 mb-4">
                {new Date(order.orderDate).toLocaleString()}
              </p>

              <div className="space-y-3">
                {order.orderItems?.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                  >
                    <h3 className="font-bold text-lg text-gray-800">
                      {item.foodItem.name}
                    </h3>

                    <p className="text-gray-600">
                      Quantity: {item.quantity}
                    </p>

                    <p className="font-semibold text-green-600">
                      Rs. {item.foodItem.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
                <span
                  className={`w-fit rounded-md px-4 py-2 font-semibold ${
                    order.payment?.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : order.payment?.status === "FAILED"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  Payment: {order.payment?.status || "N/A"}
                </span>

                <span className="text-2xl font-bold text-green-600">
                  Rs. {order.payment?.amount?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Orders;
