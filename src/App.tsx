import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Payment from "./pages/Payment";
import FoodDetails from "./pages/FoodDetails";
import AdminDashboard from "./pages/AdminDashboard";
import ManageFoods from "./pages/ManageFoods";
import ManageCategories from "./pages/ManageCategories";
import ManageOrders from "./pages/ManageOrders";
import ManageUsers from "./pages/ManageUsers";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route path="/food/:id" element={<FoodDetails />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-foods"
          element={
            <ProtectedRoute adminOnly>
              <ManageFoods />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-categories"
          element={
            <ProtectedRoute adminOnly>
              <ManageCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-orders"
          element={
            <ProtectedRoute adminOnly>
              <ManageOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-users"
          element={
            <ProtectedRoute adminOnly>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
