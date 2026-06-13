import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10 text-center">
          <h1 className="text-5xl font-bold text-gray-800">
            Admin Dashboard
          </h1>

          <p className="text-gray-600 mt-3 text-lg">
            Manage foods, categories, orders and customers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">

          <div className="bg-white rounded-3xl shadow-xl p-8 hover:scale-105 transition duration-300">
            <div className="text-6xl mb-4">🍔</div>

            <h2 className="text-2xl font-bold text-gray-800">
              Food Management
            </h2>

            <p className="text-gray-500 mt-2">
              Add, update and delete food items
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 hover:scale-105 transition duration-300">
            <div className="text-6xl mb-4">📂</div>

            <h2 className="text-2xl font-bold text-gray-800">
              Categories
            </h2>

            <p className="text-gray-500 mt-2">
              Manage food categories
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 hover:scale-105 transition duration-300">
            <div className="text-6xl mb-4">📦</div>

            <h2 className="text-2xl font-bold text-gray-800">
              Orders
            </h2>

            <p className="text-gray-500 mt-2">
              Track and manage customer orders
            </p>
          </div>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <Link
            to="/manage-foods"
            className="bg-yellow-500 hover:bg-yellow-400 text-black text-center font-bold py-5 rounded-2xl shadow-lg transition"
          >
            🍔 Manage Foods
          </Link>

          <Link
            to="/manage-categories"
            className="bg-blue-500 hover:bg-blue-400 text-white text-center font-bold py-5 rounded-2xl shadow-lg transition"
          >
            📂 Categories
          </Link>

          <Link
            to="/manage-orders"
            className="bg-green-500 hover:bg-green-400 text-white text-center font-bold py-5 rounded-2xl shadow-lg transition"
          >
            📦 Orders
          </Link>

          <Link
            to="/"
            className="bg-gray-700 hover:bg-gray-600 text-white text-center font-bold py-5 rounded-2xl shadow-lg transition"
          >
            🏠 Back Home
          </Link>

        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;