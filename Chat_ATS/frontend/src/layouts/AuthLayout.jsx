import Header from "../components/Header";
import { useTheme } from "../context/ThemeContex";

const AuthLayout = ({ children }) => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-r from-blue-100 via-white to-blue-100"
      } transition-colors duration-200`}
    >
      <Header />
      <div className="w-full px-4 py-3 sm:px-6 lg:px-8 pt-14"> 
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;