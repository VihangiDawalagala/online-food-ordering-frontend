import { useEffect, useState } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
import { placeOrder } from "../api/orderApi";
import api from "../api/axios";

function Cart() {

  const [cart, setCart] = useState<any>(null);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const response = await api.get(
        `/cart/${user.id}`
      );

      setCart(response.data);

    } catch (error) {

      console.error(error);

    }
  };

  const removeItem = async (cartItemId: number) => {

    try {

      await api.delete(
        `/cart/remove/${cartItemId}`
      );

      loadCart();

    } catch (error) {

      console.error(error);

    }
  };

  const handleCheckout = async () => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      await placeOrder(user.id);

      alert("Order placed successfully");

      window.location.href = "/orders";

    } catch (error) {

      console.error(error);

      alert("Checkout failed");
    }
  };

  const total =
    cart?.cartItems?.reduce(
      (sum: number, item: any) =>
        sum +
        item.foodItem.price *
          item.quantity,
      0
    ) || 0;

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <ShoppingCart />
          Shopping Cart
        </h1>

        {!cart ||
        !cart.cartItems ||
        cart.cartItems.length === 0 ? (

          <div className="bg-white p-8 rounded-2xl shadow">

            <p className="text-gray-500 text-lg">
              Your cart is currently empty.
            </p>

          </div>

        ) : (

          <>
            <div className="space-y-4">

              {cart.cartItems.map((item: any) => (

                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow p-5 flex justify-between items-center"
                >

                  <div>

                    <h2 className="text-xl font-bold">
                      {item.foodItem.name}
                    </h2>

                    <p className="text-gray-500">
                      Qty: {item.quantity}
                    </p>

                    <p className="text-yellow-600 font-bold">
                      Rs.
                      {" "}
                      {item.foodItem.price.toLocaleString()}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      removeItem(item.id)
                    }
                    className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              ))}

            </div>

            <div className="bg-white rounded-xl shadow p-6 mt-8">

              <h2 className="text-3xl font-bold mb-4">
                Total: Rs.
                {" "}
                {total.toLocaleString()}
              </h2>

              <button
                onClick={handleCheckout}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-bold"
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