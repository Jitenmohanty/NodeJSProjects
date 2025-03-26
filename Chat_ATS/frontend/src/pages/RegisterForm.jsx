import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContex";
import { toast } from "react-toastify";

const RegisterForm = ({ switchToLogin }) => {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    nickname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    bio: "",
    gender: "Male",
    profilePicture: null,
    profilePicturePreview: null,
  });
  const { darkMode } = useTheme();

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

  const featureCardVariants = {
    hover: {
      y: -5,
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    },
  };
  const handleRegister = async (e) => {
       e.preventDefault();

    if (form.password.length < 6) {
      toast.warn(
        <div className="flex items-center">
          <svg
            className="w-6 h-6 text-yellow-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h8m-4-4v8m-9 4h18a2 2 0 002-2V5a2 2 0 00-2-2H3a2 2 0 00-2 2v14a2 2 0 002 2z"
            ></path>
          </svg>
          <span className="text-yellow-700 font-medium">
            Password must be at least 6 characters long.
          </span>
        </div>,
        {
          position: "top-right",
          autoClose: 4000,
          theme: darkMode ? "dark" : "light",
        }
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.warn(
        <div className="flex items-center">
          <svg
            className="w-6 h-6 text-yellow-500 mr-2"
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
          <span className="text-yellow-700 font-medium">
            Passwords do not match.
          </span>
        </div>,
        {
          position: "top-right",
          autoClose: 4000,
          theme: darkMode ? "dark" : "light",
        }
      );
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(form);

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
              Registration successful! 🎉 Please log in.
            </span>
          </div>,
          {
            position: "top-right",
            autoClose: 3000,
            theme: darkMode ? "dark" : "light",
          }
        );
        switchToLogin();
      } else {
        toast.error(
          <div className="flex items-center">
            <svg
              className="w-6 h-6 text-red-500 mr-2"
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
            <span className="text-red-700 font-medium">
              Registration failed: {result.error}
            </span>
          </div>,
          {
            position: "top-right",
            autoClose: 4000,
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({
          ...form,
          profilePicture: file,
          profilePicturePreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      } fixed inset-0 overflow-hidden`}
    >
      <motion.div
        className="w-full h-full flex flex-col justify-center gap-20 items-center md:flex-row" // Removed spacing between flex items
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Left side - Welcome text */}
        <motion.div
          className={`hidden md:flex flex-col justify-center p-10   ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
          variants={itemVariants}
        >
          <motion.h1
            className="text-3xl font-bold mb-3"
            whileHover={{ scale: 1.02 }}
          >
            Join Our Community
          </motion.h1>
          <motion.p className="text-lg mb-4" whileHover={{ scale: 1.01 }}>
            Create your account and unlock amazing features
          </motion.p>
          <motion.div className="space-y-3" variants={containerVariants}>
            {[
              {
                iconColor: "bg-green-400",
                text: "AI Chatbot Support",
                description: "Get instant answers from our smart AI assistant",
              },
              {
                iconColor: "bg-blue-400",
                text: "Group Chat",
                description: "Create groups with unlimited members",
              },
              {
                iconColor: "bg-purple-400",
                text: "File Sharing",
                description: "Share files up to 2GB with end-to-end encryption",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`p-3 rounded-lg ${
                  darkMode ? "bg-gray-700/50" : "bg-white"
                } backdrop-blur-sm`}
                whileHover="hover"
                variants={featureCardVariants}
              >
                <div className="flex items-start">
                  <div
                    className={`w-10 h-10 rounded-full ${feature.iconColor} flex items-center justify-center mr-3 flex-shrink-0`}
                  >
                    <svg
                      className="w-6 h-6 text-white"
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
                  <div>
                    <h3
                      className={`font-bold text-lg ${
                        darkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {feature.text}
                    </h3>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right side - Registration form */}
        <motion.div
          className={`mt-36  px-10 py-4 h-full overflow-y-auto no-scrollbar ${
            darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
          }`}
          variants={itemVariants}
        >
          <div className="">
            <motion.h2
              className="text-2xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%"],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              Create Your Account
            </motion.h2>

            {/* Additional Features Banner */}
            <motion.div
              className={`mb-4 p-3 rounded-lg flex items-center justify-between ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center">
                <div className="bg-green-400 rounded-full p-2 mr-3">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3
                    className={`font-semibold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Premium Features Included
                  </h3>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    AI Chat, Group Chats & File Sharing
                  </p>
                </div>
              </div>
              <div className="bg-blue-400 text-white text-xs px-2 py-1 rounded-full">
                FREE
              </div>
            </motion.div>

            <motion.form
              onSubmit={handleRegister}
              className="flex flex-col space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Name and Nickname */}
              <motion.div
                className="grid grid-cols-2 gap-3"
                variants={itemVariants}
              >
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full p-2 rounded-lg border ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                    } focus:outline-none focus:ring-2 focus:ring-green-400`}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Nickname"
                    value={form.nickname}
                    onChange={(e) =>
                      setForm({ ...form, nickname: e.target.value })
                    }
                    className={`w-full p-2 rounded-lg border ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                    } focus:outline-none focus:ring-2 focus:ring-green-400`}
                  />
                </div>
              </motion.div>

              {/* Email and Phone */}
              <motion.div
                className="grid grid-cols-2 gap-3"
                variants={itemVariants}
              >
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className={`w-full p-2 rounded-lg border ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                    } focus:outline-none focus:ring-2 focus:ring-green-400`}
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Phone (Optional)"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className={`w-full p-2 rounded-lg border ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                    } focus:outline-none focus:ring-2 focus:ring-green-400`}
                  />
                </div>
              </motion.div>

              {/* Password and Confirm Password */}
              <motion.div
                className="grid grid-cols-2 gap-3"
                variants={itemVariants}
              >
                <div>
                  <input
                    type="password"
                    placeholder="Password (6+ characters)"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className={`w-full p-2 rounded-lg border ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                    } focus:outline-none focus:ring-2 focus:ring-green-400`}
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                    className={`w-full p-2 rounded-lg border ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                    } focus:outline-none focus:ring-2 focus:ring-green-400`}
                  />
                </div>
              </motion.div>

              {/* Bio and Gender */}
              <motion.div
                className="grid grid-cols-2 gap-3"
                variants={itemVariants}
              >
                <div>
                  <textarea
                    placeholder="Tell us about yourself..."
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    className={`w-full p-2 rounded-lg border h-24 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                    } focus:outline-none focus:ring-2 focus:ring-green-400`}
                  />
                </div>
                <div className="space-y-3">
                  <div>
                    <label
                      className={`block mb-1 text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Gender
                    </label>
                    <div className="flex gap-3">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={form.gender === "Male"}
                          onChange={(e) =>
                            setForm({ ...form, gender: e.target.value })
                          }
                          className={`form-radio h-4 w-4 ${
                            darkMode ? "text-green-400" : "text-blue-500"
                          } focus:ring-2 focus:ring-green-400`}
                        />
                        <span
                          className={
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }
                        >
                          Male
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={form.gender === "Female"}
                          onChange={(e) =>
                            setForm({ ...form, gender: e.target.value })
                          }
                          className={`form-radio h-4 w-4 ${
                            darkMode ? "text-green-400" : "text-blue-500"
                          } focus:ring-2 focus:ring-green-400`}
                        />
                        <span
                          className={
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }
                        >
                          Female
                        </span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label
                      className={`block mb-1 text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className={`w-full p-1 text-sm rounded-lg border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                      } focus:outline-none focus:ring-2 focus:ring-green-400`}
                    />
                  </div>
                </div>
              </motion.div>

              {form.profilePicturePreview && (
                <motion.div
                  className="flex justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <img
                    src={form.profilePicturePreview}
                    alt="Profile Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-green-400 shadow-md"
                  />
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full p-2 rounded-lg font-semibold ${
                    isLoading
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
                  } text-white shadow-md`}
                  whileHover={!isLoading ? { scale: 1.02 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                >
                  {isLoading ? "Creating Account..." : "Join Now"}
                </motion.button>
              </motion.div>
            </motion.form>
            <motion.p
              className={`text-center mt-4 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
              variants={itemVariants}
            >
              Already have an account?{" "}
              <motion.button
                onClick={switchToLogin}
                className={`font-semibold ${
                  darkMode ? "text-green-400" : "text-blue-500"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterForm;
