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
    return "status-success";
  }

  if (status === "CANCELLED") {
    return "bg-red-50 text-red-700";
  }

  if (status === "PREPARING") {
    return "status-neutral";
  }

  return "status-neutral";
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
      <div className="page-shell">
        <div className="surface mx-auto max-w-6xl p-8">
          <p className="font-semibold text-gray-700">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-container-narrow">
        <div className="page-header mb-6">
          <p className="section-kicker">
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
                className="surface p-6"
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
                    className="field max-w-[220px] text-sm font-semibold"
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
                      className="flex items-center gap-3 rounded-md border border-gray-200 bg-slate-50/80 p-4"
                    >
                      <span className="grid h-10 w-10 place-items-center rounded-md bg-white text-amber-700">
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
