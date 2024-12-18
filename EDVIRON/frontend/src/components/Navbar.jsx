// components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <h1 className="text-lg">School Payments Dashboard</h1>
      <div>
        <Link to="/" className="mx-2">Transactions</Link>
        <Link to="/details" className="mx-2">Details</Link>
        <Link to="/status" className="mx-2">Check Status</Link>
      </div>
    </nav>
  );
};

export default Navbar;
