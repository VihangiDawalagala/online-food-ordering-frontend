import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

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
      const isAdminSignup =
        form.role.toUpperCase().includes("ADMIN");
      const savedRoles = JSON.parse(
        localStorage.getItem("accountRoles") ?? "{}"
      );
      savedRoles[form.email.toLowerCase()] = form.role;
      localStorage.setItem("accountRoles", JSON.stringify(savedRoles));

      login({
        ...response.data,
        role: form.role,
      });
      navigate(isAdminSignup ? "/admin" : "/");
    } catch {
      setError("Sign up failed. Email may already be registered.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_480px]">
        <section className="hidden lg:block">
          <p className="section-kicker">
            <Sparkles size={16} />
            Create access
          </p>
          <h1 className="mt-3 max-w-xl text-5xl font-black leading-tight text-gray-950">
            Create an account built for customers and operations teams.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-gray-600">
            Customers can order food, while admins can manage foods,
            categories, orders, and users.
          </p>

          <div className="mt-8 grid max-w-xl gap-4">
            <div className="surface flex items-start gap-4 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-amber-50 text-amber-700">
                <User size={20} />
              </span>
              <div>
                <h2 className="font-black text-gray-950">
                  Customer workspace
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Browse the menu, add meals to cart, checkout, and
                  review order history from one clean account.
                </p>
              </div>
            </div>

            <div className="surface flex items-start gap-4 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-amber-50 text-amber-700">
                <ShieldCheck size={20} />
              </span>
              <div>
                <h2 className="font-black text-gray-950">
                  Admin workspace
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Maintain menu items, categories, order statuses, and
                  registered users with role-based access.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="surface w-full p-8">
          <div className="mb-7 flex items-start justify-between gap-4">
            <div>
              <p className="section-kicker">
                <ClipboardList size={16} />
                New account
              </p>
              <h2 className="mt-2 text-3xl font-black text-gray-950">
                Create Account
              </h2>
            </div>
            <span className="rounded-md bg-amber-50 px-3 py-2 text-xs font-black uppercase text-amber-700">
              GourmetHub
            </span>
          </div>

          <p className="text-sm leading-6 text-gray-500">
            Enter your details and choose the correct access level for
            how you will use the ordering system.
          </p>

          {error && (
            <p className="mt-6 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-gray-700">
                Full name
              </span>
              <span className="relative block">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  className="field field-icon"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-gray-700">
                Email address
              </span>
              <span className="relative block">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="field field-icon"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-gray-700">
                Password
              </span>
              <span className="relative block">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  className="field field-icon"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-gray-700">
                Account type
              </span>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="field"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="ADMIN">Admin</option>
              </select>
              <span className="mt-2 block text-xs font-semibold text-gray-500">
                Choose Admin only for restaurant management access.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
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
