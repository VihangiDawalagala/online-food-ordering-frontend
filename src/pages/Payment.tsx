function Payment() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">

        <h1 className="text-3xl font-bold mb-6">
          Payment
        </h1>

        <input
          placeholder="Card Number"
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          placeholder="Card Holder Name"
          className="w-full border p-3 rounded-lg mb-4"
        />

        <button className="w-full bg-green-500 text-white py-3 rounded-lg font-bold">
          Pay Now
        </button>

      </div>
    </div>
  );
}

export default Payment;