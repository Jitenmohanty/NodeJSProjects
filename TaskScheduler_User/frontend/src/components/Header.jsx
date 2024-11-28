import React from "react";
import { Link } from "react-router-dom";

const Header = ({ userType }) => {
  const navigation = {
    Admin: [
      { name: "Dashboard", path: "/admin/dashboard" },
      { name: "Manage Users", path: "/admin/users" },
      { name: "Reports", path: "/admin/reports" },
    ],
    Organizer: [
      { name: "My Contests", path: "/organizer/contests" },
      { name: "Create Contest", path: "/organizer/create" },
      { name: "Results", path: "/organizer/results" },
    ],
    Participant: [
      { name: "Contests", path: "/participant/contests" },
      { name: "My Results", path: "/participant/results" },
    ],
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          Contest Tracker
        </Link>

        {/* Navigation */}
        <nav className="flex space-x-4">
          {navigation[userType]?.map((navItem) => (
            <Link
              key={navItem.name}
              to={navItem.path}
              className="hover:underline"
            >
              {navItem.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
