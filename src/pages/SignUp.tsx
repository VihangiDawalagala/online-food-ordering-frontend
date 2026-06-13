import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, User } from "lucide-react";

import { signUp } from "../api/authApi";
import { useAuth } from "../context/useAuth";

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
    <div className="min-h-screen bg-gray-100 px-4 py-12">
      <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_460px]">
        <div className="hidden lg:block">
          <p className="text-sm font-black uppercase text-amber-600">
            Create access
          </p>
          <h1 className="mt-3 max-w-xl text-5xl font-black leading-tight text-gray-950">
            Join the food ordering system in seconds.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-gray-600">
            Customers can order food, while admins can manage foods,
            categories, orders, and users.
          </p>
        </div>

        <div className="w-full rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-black text-gray-950">
            Create Account
          </h2>

          <p className="mt-2 text-gray-500">
            Start using GourmetHub today.
          </p>

          {error && (
            <p className="mt-6 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="relative block">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="h-12 w-full rounded-md border border-gray-300 pl-11 pr-4 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </label>

            <label className="relative block">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="h-12 w-full rounded-md border border-gray-300 pl-11 pr-4 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </label>

            <label className="relative block">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="h-12 w-full rounded-md border border-gray-300 pl-11 pr-4 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="h-12 w-full rounded-md border border-gray-300 px-4 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Admin</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-md bg-gray-950 font-bold text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-bold text-amber-700 hover:text-amber-800"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
