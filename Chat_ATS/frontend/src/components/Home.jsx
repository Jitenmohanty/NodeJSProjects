import React, { useState } from "react";
import { useTheme } from "../context/ThemeContex";
import { motion } from "framer-motion";
import { featureItems } from "../constants/featureItem.jsx";

const Home = () => {
  const [featureHovered, setFeatureHovered] = useState(null);

  const { darkMode } = useTheme();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
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
        ease: "easeOut",
      },
    },
    hover: {
      y: -5,
      scale: 1.02,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className={`flex flex-col items-center justify-center min-h-[calc(80vh-64px)] rounded-xl p-4 ${
        darkMode
          ? "bg-gradient-to-br from-gray-600 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-200 via-white to-blue-50"
      } transition-colors duration-300`}
    >
      <motion.div
        className="max-w-6xl w-full text-center space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Main Heading */}
        <motion.div className="space-y-2" variants={itemVariants}>
          <motion.h1
            className={`text-4xl md:text-5xl font-extrabold tracking-tight ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
            whileHover={{ scale: 1.02 }}
          >
            Welcome to{" "}
            <motion.span
              className="text-blue-500"
              animate={{
                textShadow: [
                  "0 0 8px rgba(59,130,246,0)",
                  "0 0 8px rgba(59,130,246,0.5)",
                  "0 0 8px rgba(59,130,246,0)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              ChatApp
            </motion.span>
          </motion.h1>
          <motion.div
            className="w-24 h-1.5 bg-blue-500 rounded-full mx-auto"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          ></motion.div>
        </motion.div>

        {/* Quote */}
        <motion.div className="max-w-2xl mx-auto" variants={itemVariants}>
          <motion.p
            className={`text-lg italic ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
            whileHover={{ scale: 1.01 }}
          >
            "The most important thing in communication is hearing what isn't
            said."
          </motion.p>
          <motion.p
            className={`text-sm not-italic mt-2 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            – Peter Drucker
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-12"
          variants={containerVariants}
        >
          {featureItems.map((feature, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-xl ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-white hover:bg-blue-50"
              } border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
              variants={itemVariants}
              whileHover="hover"
              onHoverStart={() => setFeatureHovered(index)}
              onHoverEnd={() => setFeatureHovered(null)}
            >
              <motion.div
                animate={{
                  scale: featureHovered === index ? 1.1 : 1,
                  rotate: featureHovered === index ? 5 : 0,
                }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                {feature.icon}
              </motion.div>
              <motion.h3
                className={`text-lg font-semibold mt-4 mb-2 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
                animate={{
                  color:
                    featureHovered === index
                      ? darkMode
                        ? "#3B82F6"
                        : "#2563EB"
                      : darkMode
                      ? "#FFFFFF"
                      : "#1F2937",
                }}
              >
                {feature.title}
              </motion.h3>
              <motion.p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {feature.desc}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Home;
