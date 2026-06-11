import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signIn } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const response = await signIn(form);

      login(response.data);
      navigate("/");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-orange-600">
          Sign In
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-6">
          Welcome back to Food Ordering System
        </p>

        {error && (
          <p className="bg-red-100 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm mt-5">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-orange-600 font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;