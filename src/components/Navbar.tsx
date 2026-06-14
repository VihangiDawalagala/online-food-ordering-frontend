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
      ? "bg-amber-50 text-amber-800"
      : "text-gray-600 hover:bg-slate-100 hover:text-gray-950"
  }`;

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const roleLabel = isAdmin() ? "Admin" : user?.role ? "Customer" : "";

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
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
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
                  className="btn-primary min-h-0 px-4 py-2"
                >
                  <UserPlus size={17} />
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <span className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-gray-700">
                  {user.name}
                </span>

                {roleLabel && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-3 py-2 text-xs font-black uppercase text-amber-800">
                    <ShieldCheck size={15} />
                    {roleLabel}
                  </span>
                )}

                <button
                  onClick={handleLogout}
                  className="btn-danger min-h-0 px-4 py-2"
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
                    className="btn-primary"
                  >
                    <UserPlus size={17} />
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <span className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-gray-700">
                    {user.name}
                  </span>

                  {roleLabel && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-3 py-2 text-xs font-black uppercase text-amber-800">
                      <ShieldCheck size={15} />
                      {roleLabel}
                    </span>
                  )}

                  <button
                    onClick={handleLogout}
                    className="btn-danger"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
