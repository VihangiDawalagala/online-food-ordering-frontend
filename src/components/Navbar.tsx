import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  ClipboardList,
  Home,
  LogOut,
  Menu,
  ShieldCheck,
  ShoppingCart,
  UserPlus,
  X,
} from "lucide-react";

import { useAuth } from "../context/useAuth";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-amber-100 text-amber-900"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-950"
  }`;

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  const links = (
    <>
      <NavLink
        to="/"
        onClick={closeMenu}
        className={navLinkClass}
      >
        <Home size={17} />
        Home
      </NavLink>

      {user && (
        <>
          <NavLink
            to="/cart"
            onClick={closeMenu}
            className={navLinkClass}
          >
            <ShoppingCart size={17} />
            Cart
          </NavLink>

          <NavLink
            to="/orders"
            onClick={closeMenu}
            className={navLinkClass}
          >
            <ClipboardList size={17} />
            Orders
          </NavLink>

          {isAdmin() && (
            <NavLink
              to="/admin"
              onClick={closeMenu}
              className={navLinkClass}
            >
              <ShieldCheck size={17} />
              Admin
            </NavLink>
          )}
        </>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between">
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-3"
          >
            <span className="grid h-10 w-10 place-items-center rounded-md bg-gray-950 text-amber-400 font-black">
              GH
            </span>
            <span className="leading-tight">
              <span className="block text-xl font-black text-gray-950">
                GourmetHub
              </span>
              <span className="hidden text-xs font-medium text-gray-500 sm:block">
                Online Food Ordering
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            {links}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {!user ? (
              <>
                <NavLink
                  to="/signin"
                  className={navLinkClass}
                >
                  Sign In
                </NavLink>

                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 rounded-md bg-gray-950 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  <UserPlus size={17} />
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <span className="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">
                  {user.name}
                </span>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-md bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="grid h-10 w-10 place-items-center rounded-md border border-gray-200 text-gray-700 md:hidden"
            aria-label="Toggle navigation"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="border-t border-gray-200 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              {links}

              {!user ? (
                <>
                  <NavLink
                    to="/signin"
                    onClick={closeMenu}
                    className={navLinkClass}
                  >
                    Sign In
                  </NavLink>

                  <Link
                    to="/signup"
                    onClick={closeMenu}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-gray-950 px-4 py-3 text-sm font-semibold text-white"
                  >
                    <UserPlus size={17} />
                    Sign Up
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
