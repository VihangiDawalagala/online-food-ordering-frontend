import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ClipboardList,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { signIn } from "../api/authApi";
import { useAuth } from "../context/useAuth";

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
    <div className="page-shell">
      <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_480px]">
        <section className="hidden lg:block">
          <p className="section-kicker">
            <ShieldCheck size={16} />
            Welcome back
          </p>
          <h1 className="mt-3 max-w-xl text-5xl font-black leading-tight text-gray-950">
            Continue managing orders, meals, and customer activity.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-gray-600">
            Sign in to continue browsing, placing orders, or managing
            menu operations with your assigned role.
          </p>

          <div className="mt-8 grid max-w-xl gap-4">
            <div className="surface flex items-start gap-4 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-amber-50 text-amber-700">
                <ClipboardList size={20} />
              </span>
              <div>
                <h2 className="font-black text-gray-950">
                  Operational overview
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Access carts, orders, payments, menu updates, and
                  admin tools from one consistent workspace.
                </p>
              </div>
            </div>

            <div className="surface grid grid-cols-3 overflow-hidden text-center">
              <div className="p-4">
                <p className="text-2xl font-black text-gray-950">24/7</p>
                <p className="text-xs font-bold text-gray-500">
                  Ordering
                </p>
              </div>
              <div className="border-x border-gray-200 p-4">
                <p className="text-2xl font-black text-gray-950">Live</p>
                <p className="text-xs font-bold text-gray-500">
                  Status
                </p>
              </div>
              <div className="p-4">
                <p className="text-2xl font-black text-gray-950">Role</p>
                <p className="text-xs font-bold text-gray-500">
                  Access
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="surface w-full p-8">
          <div className="mb-7 flex items-start justify-between gap-4">
            <div>
              <p className="section-kicker">
                <CheckCircle2 size={16} />
                Secure access
              </p>
              <h2 className="mt-2 text-3xl font-black text-gray-950">
                Sign In
              </h2>
            </div>
            <span className="rounded-md bg-amber-50 px-3 py-2 text-xs font-black uppercase text-amber-700">
              GourmetHub
            </span>
          </div>

          <p className="text-sm leading-6 text-gray-500">
            Use your registered email and password to continue to your
            customer or admin workspace.
          </p>

          <div className="mt-6 rounded-lg border border-amber-100 bg-amber-50/70 p-4 text-sm leading-6 text-amber-900">
            Admin accounts can manage foods, categories, orders, and
            users. Customer accounts can order meals and track payments.
          </div>

          {error && (
            <p className="mt-6 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="field field-icon"
                />
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Do not have an account?{" "}
            <Link
              to="/signup"
              className="font-bold text-amber-700 hover:text-amber-800"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
