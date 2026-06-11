import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-red-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Food Ordering System
        </h1>

        <div className="flex gap-4">
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/signin">Sign In</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;