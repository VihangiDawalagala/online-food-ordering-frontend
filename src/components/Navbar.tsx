import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-black text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link
          to="/"
          className="text-3xl font-bold text-yellow-400"
        >
          GourmetHub
        </Link>

        <div className="flex items-center gap-6">

          <Link to="/">Home</Link>

          <Link to="/cart">Cart</Link>

          <Link to="/orders">Orders</Link>

          {!user ? (
            <>
              <Link to="/signin">Sign In</Link>
              <Link
                to="/signup"
                className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <span className="text-yellow-400">
                {user.name}
              </span>

              <button
                onClick={logout}
                className="bg-red-500 px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;