import React, { useState } from "react";
import { X, Camera, User, Mail, Phone, Info } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const SettingsModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "John Doe",
    nickname: user?.nickname || "Johnny",
    email: user?.email || "john.doe@example.com",
    phone: user?.phone || "123-456-7890",
    bio: user?.bio || "Living life to the fullest! 🚀",
    gender: user?.gender || "Male",
    profilePicture: user?.profilePicture,
    profilePicturePreview: user?.profilePicture,
  });
  

  const [isEditing, setIsEditing] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          profilePicture: file,
          profilePicturePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const response = await updateProfile(user.id, form);
    setLoading(false);

    if (response.success) {
      alert("Profile updated successfully!");
      setIsEditing(false);
    } else {
      alert(response.error);
    }
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40" onClick={onClose} />}
      <div
        className={`fixed top-0 left-0 h-full w-80 md:w-[29vw] z-50 bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto overflow-x-hidden no-scrollbar
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-white text-xl font-semibold">Profile Settings</h2>
          <button
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
            onClick={onClose}
            aria-label="Close settings"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-8">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <img
                src={form.profilePicturePreview}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-gray-700 group-hover:opacity-80 transition-opacity"
              />
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <label htmlFor="profile-picture" className="cursor-pointer flex items-center justify-center w-full h-full rounded-full">
                    <span className="bg-black bg-opacity-50 rounded-full p-2 text-white">
                      <Camera size={24} />
                    </span>
                    <input
                      id="profile-picture"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {isEditing ? (
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-4 text-center text-white text-lg font-medium px-2 py-1 w-full bg-gray-800 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
            ) : (
              <h2 className="text-white text-lg font-medium mt-4">{form.name}</h2>
            )}

            {isEditing ? (
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-2 text-white bg-gray-800 rounded border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
                rows="2"
                placeholder="Write a short bio..."
              />
            ) : (
              <p className="text-gray-400 text-sm mt-2 text-center">{form.bio}</p>
            )}
          </div>

          {/* User Info Fields */}
          <div className="space-y-5">
            {[
              { id: "nickname", icon: <User size={18} />, label: "Nickname" },
              { id: "email", icon: <Mail size={18} />, label: "Email" },
              { id: "phone", icon: <Phone size={18} />, label: "Phone" },
              { id: "gender", icon: <Info size={18} />, label: "Gender" }
            ].map((field) => (
              <div 
                key={field.id}
                className={`rounded-lg p-3 transition-colors ${activeField === field.id ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-750"}`}
                onClick={() => isEditing && setActiveField(field.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-gray-400">{field.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider">{field.label}</h3>
                    {isEditing ? (
                      <input
                        type={field.id === "email" ? "email" : "text"}
                        name={field.id}
                        value={form[field.id]}
                        onChange={handleChange}
                        className="w-full p-0 border-0 bg-transparent text-white focus:outline-none mt-1"
                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                        autoFocus={activeField === field.id}
                      />
                    ) : (
                      <p className="text-white mt-1 break-words">{form[field.id]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 pt-4 pb-6">
            {isEditing ? (
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsModal;
