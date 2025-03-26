import { useTheme } from "../context/ThemeContex";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/logo2.png";
import { Link } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  const { darkMode } = useTheme();

  return (
    <header className={`sticky top-0 z-50`}>
      <nav
        className={`w-full shadow-sm transition-colors duration-300 ${
          darkMode
            ? "bg-gray-800 shadow-gray-500/50"
            : "bg-gray-200 shadow-gray-200/50"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            {/* Left side - Logo/Brand */}
            <Link to="/" className="flex items-center p-2">
              <img className="w-12 h-12 scale-100 object-contain" src={logo} alt="Logo" />
            </Link>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <button
                    onClick={logout}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      darkMode
                        ? "bg-red-700 text-white hover:bg-red-600"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    Logout
                  </button>
                  <ThemeToggle />
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      darkMode
                        ? "bg-orange-700 text-white hover:bg-orange-600"
                        : "bg-orange-700 text-white hover:bg-orange-600"
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    to="/auth?mode=login"
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      darkMode
                        ? "bg-blue-700 text-white hover:bg-blue-600"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth?mode=register"
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      darkMode
                        ? "bg-green-700 text-white hover:bg-green-600"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    Register
                  </Link>
                  <ThemeToggle />
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;