import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import {
  getCart,
  removeCartItem,
  updateCartItem,
} from "../api/cartApi";
import { placeOrder } from "../api/orderApi";
import type { Cart as CartType, CartItem, Order } from "../types";
import { useAuth } from "../context/useAuth";

const getOrderId = (data: unknown) => {
  if (
    data &&
    typeof data === "object" &&
    "id" in data &&
    typeof data.id === "number"
  ) {
    return data.id;
  }

  return null;
};

function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cart, setCart] = useState<CartType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        return;
      }

      try {
        const response = await getCart(user.id);
        setCart(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user]);

  const refreshCart = async () => {
    if (!user) {
      return;
    }

    const response = await getCart(user.id);
    setCart(response.data);
  };

  const removeItem = async (cartItemId: number) => {
    try {
      await removeCartItem(cartItemId);
      await refreshCart();
    } catch (error) {
      console.error(error);
    }
  };

  const changeQuantity = async (
    item: CartItem,
    nextQuantity: number
  ) => {
    if (nextQuantity < 1) {
      await removeItem(item.id);
      return;
    }

    try {
      await updateCartItem(item.id, nextQuantity);
      await refreshCart();
    } catch (error) {
      console.error(error);
      alert("Failed to update quantity");
    }
  };

  const total = useMemo(
    () =>
      cart?.cartItems?.reduce(
        (sum, item) =>
          sum +
          item.foodItem.price *
            item.quantity,
        0
      ) || 0,
    [cart]
  );

  const handleCheckout = async () => {
    if (!user) {
      return;
    }

    try {
      const response = await placeOrder(user.id);
      const orderId = getOrderId(response.data as Order);
      const query = orderId
        ? `?orderId=${orderId}&amount=${total}`
        : `?amount=${total}`;

      alert("Order placed successfully");
      navigate(`/payment${query}`);
    } catch (error) {
      console.error(error);
      alert("Checkout failed");
    }
  };

  if (loading) {
    return (
      <div className="page-shell">
        <div className="page-container-narrow">
          <p className="text-lg font-semibold">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-container-narrow">
        <div className="page-header mb-8">
          <p className="section-kicker">
            <ShoppingCart size={16} />
            Checkout
          </p>
          <h1 className="mt-2 text-4xl font-black text-gray-950">
            Shopping Cart
          </h1>
          <p className="mt-2 text-gray-600">
            Review quantities and continue to secure payment.
          </p>
        </div>

        {!cart?.cartItems?.length ? (
          <div className="surface p-8">
            <p className="text-gray-500 text-lg">
              Your cart is currently empty.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cart.cartItems.map((item) => (
                <div
                  key={item.id}
                  className="surface flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h2 className="text-xl font-bold">
                      {item.foodItem.name}
                    </h2>

                    <p className="font-bold text-amber-700">
                      Rs. {item.foodItem.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        changeQuantity(
                          item,
                          item.quantity - 1
                        )
                      }
                      className="rounded-md bg-slate-100 p-3 hover:bg-slate-200"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={18} />
                    </button>

                    <span className="w-10 text-center font-bold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        changeQuantity(
                          item,
                          item.quantity + 1
                        )
                      }
                      className="rounded-md bg-slate-100 p-3 hover:bg-slate-200"
                      aria-label="Increase quantity"
                    >
                      <Plus size={18} />
                    </button>

                    <button
                      onClick={() =>
                        removeItem(item.id)
                      }
                      className="rounded-md bg-red-50 p-3 text-red-700 hover:bg-red-100"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="surface mt-8 flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
              <h2 className="text-3xl font-black mb-4 text-gray-950">
                Total: Rs. {total.toLocaleString()}
              </h2>

              <button
                onClick={handleCheckout}
                className="btn-primary"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
