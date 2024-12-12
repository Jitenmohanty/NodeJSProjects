import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/userContext";

const Header = () => {
  const { user, logoutUser } = useContext(UserContext);

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo or App Name */}
        <div className="text-2xl font-bold text-blue-600">
          <Link to="/">Task Scheduler</Link>
        </div>
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
    </header>
  );
};

export default Header;
