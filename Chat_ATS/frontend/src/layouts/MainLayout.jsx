import Header from "../components/Header";
import { useTheme } from "../context/ThemeContex";

const MainLayout = ({ children }) => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-r from-blue-100 via-white to-blue-100"
      } transition-colors duration-200 overflow-hidden no-scrollbar`}
    >
      <main className="mx-auto max-w-7xl px-4 py-4 sm:px-4 lg:px-6">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;