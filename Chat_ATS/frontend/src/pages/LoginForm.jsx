import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContex";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ switchToRegister }) => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(form.email, form.password);
      if (result.success) {
        toast.success(
          <div className="flex items-center">
            <svg
              className="w-6 h-6 text-green-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span className="text-green-700 font-medium">
              Welcome to Chat App! 🎉
            </span>
          </div>,
          {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: darkMode ? "dark" : "light",
          }
        );
        navigate("/");
      } else {
        toast.error(
          <div className="flex items-center">
            <svg
              className="w-6 h-6 text-red-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
            <span className="text-red-300 font-medium">
              Login failed: {result.error}
            </span>
          </div>,
          {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: darkMode ? "dark" : "light",
          }
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.", {
        position: "top-right",
        autoClose: 4000,
        theme: darkMode ? "dark" : "light",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      } fixed inset-0 overflow-hidden flex items-center justify-center p-20 bg-fixed bg-cover bg-center`}
    >
      <motion.div
        className="w-full max-w-2xl flex"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Left side - Welcome text */}
        <motion.div
          className={`hidden md:flex flex-col justify-center p-8 w-1/2 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
          variants={itemVariants}
        >
          <motion.h1
            className="text-4xl font-bold mb-4"
            whileHover={{ scale: 1.02 }}
          >
            Welcome to ChatConnect
          </motion.h1>
          <motion.p className="text-xl mb-6" whileHover={{ scale: 1.01 }}>
            Connect with friends and colleagues in real-time
          </motion.p>
          <motion.div className="space-y-2" variants={containerVariants}>
            {[
              {
                iconColor: "bg-green-400",
                text: "Secure end-to-end encryption",
              },
              { iconColor: "bg-blue-400", text: "Group and private chats" },
              { iconColor: "bg-purple-400", text: "File sharing capabilities" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center"
                variants={itemVariants}
                whileHover={{ x: 5 }}
              >
                <div
                  className={`w-8 h-8 rounded-full ${feature.iconColor} flex items-center justify-center mr-3`}
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className={darkMode ? "text-gray-200" : "text-gray-700"}>
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right side - Login form */}
        <motion.div
          className={`p-8 rounded-lg w-full md:w-1/2 ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          } shadow-xl`}
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
        >
          <motion.h2
            className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            Login
          </motion.h2>
          <motion.form
            onSubmit={handleLogin}
            className="flex flex-col space-y-4"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full p-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-green-400`}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`w-full p-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-green-400`}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={isLoading}
                className={`w-full p-3 rounded-lg font-semibold ${
                  isLoading
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-400 to-blue-500"
                } text-white`}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading ? "Logging in..." : "Login"}
              </motion.button>
            </motion.div>
          </motion.form>
          <motion.p
            className={`text-center mt-6 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
            variants={itemVariants}
          >
            Don't have an account?{" "}
            <motion.button
              onClick={switchToRegister}
              className={`font-semibold ${
                darkMode ? "text-green-400" : "text-blue-500"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Register
            </motion.button>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginForm;
