// components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
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
      </div>
    </nav>
  );
};

export default Navbar;
