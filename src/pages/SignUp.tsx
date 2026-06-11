import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signUp } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const response = await signUp(form);

      login(response.data);
      navigate("/");
    } catch {
      setError("Sign up failed. Email may already be registered.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-orange-600">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-6">
          Join our Online Food Ordering System
        </p>

        {error && (
          <p className="bg-red-100 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="CUSTOMER">Customer</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm mt-5">
          Already have an account?{" "}
          <Link to="/signin" className="text-orange-600 font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;