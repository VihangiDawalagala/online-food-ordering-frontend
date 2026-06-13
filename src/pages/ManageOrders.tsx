import { useEffect, useState } from "react";
import { ClipboardList, PackageCheck } from "lucide-react";

import {
  getAllOrders,
  updateOrderStatus,
} from "../api/orderApi";
import type { Order } from "../types";

const statuses = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "DELIVERED",
  "CANCELLED",
];

const statusClass = (status: string) => {
  if (status === "DELIVERED") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "CANCELLED") {
    return "bg-red-50 text-red-700";
  }

  if (status === "PREPARING") {
    return "bg-blue-50 text-blue-700";
  }

  return "bg-amber-50 text-amber-700";
};

function ManageOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const response = await getAllOrders();
      setOrders(response.data as Order[]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      await loadOrders();
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (
    orderId: number,
    status: string
  ) => {
    try {
      await updateOrderStatus(orderId, status);
      await loadOrders();
    } catch (error) {
      console.error(error);
      alert("Failed to update order status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-6xl rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <p className="font-semibold text-gray-700">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="inline-flex items-center gap-2 text-sm font-black uppercase text-emerald-700">
            <ClipboardList size={16} />
            Fulfilment
          </p>
          <h1 className="mt-2 text-4xl font-black text-gray-950">
            Manage Orders
          </h1>
          <p className="mt-2 max-w-2xl text-gray-600">
            Track customer orders and update each order status as it
            moves through the kitchen.
          </p>
        </div>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-gray-500 shadow-sm">
              No orders found.
            </div>
          ) : (
            orders.map((order) => (
              <article
                key={order.id}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-black text-gray-950">
                        Order #{order.id}
                      </h2>
                      <span
                        className={`rounded-md px-3 py-1 text-sm font-bold ${statusClass(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-500">
                      {new Date(order.orderDate).toLocaleString()}
                    </p>
                  </div>

                  <select
                    value={order.status}
                    onChange={(event) =>
                      handleStatusChange(
                        order.id,
                        event.target.value
                      )
                    }
                    className="h-11 rounded-md border border-gray-300 px-3 text-sm font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {order.orderItems?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-4"
                    >
                      <span className="grid h-10 w-10 place-items-center rounded-md bg-white text-emerald-700">
                        <PackageCheck size={18} />
                      </span>
                      <div>
                        <p className="font-bold text-gray-950">
                          {item.foodItem.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageOrders;
