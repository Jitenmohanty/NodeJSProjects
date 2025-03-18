import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState({
    username: "JohnDoe",
    email: "john@example.com",
    profilePicture: "",
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "http://localhost:5000/api/profile",
        profile,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile({ ...profile, profilePicture: reader.result });
    };
    if (file) reader.readAsDataURL(file);
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen px-4"
    >
      <form
        onSubmit={handleUpdate}
        className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Profile</h2>
        <div className="mb-4">
          <img
            src={profile.profilePicture || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full text-gray-700"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={profile.username}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            placeholder="Username"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="mb-6">
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          Update Profile
        </button>
      </form>
    </motion.div>
  );
};

export default Profile;