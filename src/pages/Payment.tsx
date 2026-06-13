import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Banknote, CreditCard, ReceiptText, User } from "lucide-react";

import { makePayment } from "../api/paymentApi";

function Payment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    orderId: searchParams.get("orderId") || "",
    amount: searchParams.get("amount") || "",
    cardNumber: "",
    cardHolderName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (
      !form.orderId ||
      !form.amount ||
      !form.cardNumber ||
      !form.cardHolderName
    ) {
      setError("All payment fields are required");
      return;
    }

    if (form.cardNumber.replace(/\s/g, "").length < 12) {
      setError("Enter a valid card number");
      return;
    }

    try {
      setLoading(true);
      await makePayment({
        orderId: Number(form.orderId),
        amount: Number(form.amount),
        cardNumber: form.cardNumber,
        cardHolderName: form.cardHolderName,
      });

      alert("Payment successful");
      navigate("/orders");
    } catch (paymentError) {
      console.error(paymentError);
      setError("Payment failed. Please check backend payment endpoint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_460px]">
        <div className="rounded-lg border border-gray-200 bg-gray-950 p-8 text-white shadow-sm">
          <p className="text-sm font-black uppercase text-amber-400">
            Secure checkout
          </p>

          <h1 className="mt-3 text-4xl font-black">
            Complete your payment
          </h1>

          <p className="mt-4 max-w-xl leading-7 text-gray-300">
            Confirm the order details and submit your payment to finish
            the checkout process.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/5 p-5">
              <ReceiptText className="text-amber-400" />
              <p className="mt-4 text-sm text-gray-300">
                Order ID
              </p>
              <p className="text-2xl font-black">
                {form.orderId || "-"}
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-5">
              <Banknote className="text-emerald-400" />
              <p className="mt-4 text-sm text-gray-300">
                Amount
              </p>
              <p className="text-2xl font-black">
                Rs. {form.amount || "0"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-black text-gray-950">
            Payment Details
          </h2>

          {error && (
            <p className="mt-6 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="relative block">
              <ReceiptText
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                name="orderId"
                placeholder="Order ID"
                value={form.orderId}
                onChange={handleChange}
                className="h-12 w-full rounded-md border border-gray-300 pl-11 pr-4 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </label>

            <label className="relative block">
              <Banknote
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                name="amount"
                placeholder="Amount"
                value={form.amount}
                onChange={handleChange}
                className="h-12 w-full rounded-md border border-gray-300 pl-11 pr-4 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </label>

            <label className="relative block">
              <CreditCard
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                name="cardNumber"
                placeholder="Card Number"
                value={form.cardNumber}
                onChange={handleChange}
                className="h-12 w-full rounded-md border border-gray-300 pl-11 pr-4 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </label>

            <label className="relative block">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                name="cardHolderName"
                placeholder="Card Holder Name"
                value={form.cardHolderName}
                onChange={handleChange}
                className="h-12 w-full rounded-md border border-gray-300 pl-11 pr-4 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-md bg-emerald-600 font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Payment;
