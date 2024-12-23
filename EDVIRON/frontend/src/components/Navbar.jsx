// components/Navbar.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/userContext";

const Navbar = () => {

  const { user, logoutUser } = useContext(UserContext);

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
      {/* Brand Logo */}
      <h1 className="text-2xl font-bold">
        <Link to="/" className="hover:text-blue-200">
          School Payments Dashboard
        </Link>
      </h1>

      {/* Navigation Links */}

      { user && 

        <div className="flex space-x-4">
        <Link
          to="/"
          className="text-lg font-bold hover:text-blue-200 transition-colors duration-200"
        >
          Transactions
        </Link>
        <Link
          to="/details"
          className="text-lg font-bold hover:text-blue-200 transition-colors duration-200"
          >
          Schools
        </Link>
        <Link
          to="/status"
          className="text-lg font-bold hover:text-blue-200 transition-colors duration-200"
          >
          Check Status
        </Link>
      </div>
        }

      {/* User Authentication Links */}
      <div>
        {user ? (
          <Link
            onClick={handleLogout}
            to="/login"
            className="px-6 py-2 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition duration-300"
          >
            Logout
          </Link>
        ) : (
          <nav className="space-x-4">
            <Link
              to="/login"
              className="px-6 py-2 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 transition duration-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 rounded-full bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition duration-300"
            >
              Register
            </Link>
          </nav>
        )}
      </div>
    </div>
  </nav>
  );
};

export default Navbar;
