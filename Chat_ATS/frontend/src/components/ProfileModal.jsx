import React from "react";
import { X, User, Mail, Phone, Info, Calendar, MapPin, Briefcase, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ProfileModal = ({ isOpen, onClose,data }) => {

  const {user:profile} = useAuth();

  const userData = data || profile;
  

  

  // Default avatar if userData has no profile picture
  const defaultAvatar = "https://via.placeholder.com/150";

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 " onClick={onClose} />}
      <div
        className={`fixed top-0 left-0 h-full w-80 md:w-[29vw] z-50 bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto overflow-x-hidden no-scrollbar
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-white text-xl font-semibold">Profile</h2>
          <button
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
            onClick={onClose}
            aria-label="Close profile"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-8">
          {/* Profile Picture and Basic Info */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={userData?.profilePicture || defaultAvatar}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-gray-700"
              />
              {userData?.online && (
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
              )}
            </div>
            <h2 className="text-white text-lg font-medium mt-4">{userData?.name || "userData Name"}</h2>
            <p className="text-gray-400 text-sm mt-2 text-center">{userData?.bio || "No bio available"}</p>
            
            {userData?.status && (
              <div className="mt-4 px-3 py-1 bg-gray-800 rounded-full">
                <p className="text-gray-300 text-sm">{userData.status}</p>
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-3 bg-gray-800 rounded-lg p-4">
            <div className="flex flex-col items-center">
              <span className="text-white font-bold">{userData?.posts || 0}</span>
              <span className="text-gray-400 text-xs">Posts</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-white font-bold">{userData?.followers || 0}</span>
              <span className="text-gray-400 text-xs">Followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-white font-bold">{userData?.following || 0}</span>
              <span className="text-gray-400 text-xs">Following</span>
            </div>
          </div>

          {/* userData Details */}
          <div className="space-y-5">
            <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider px-2">Personal Information</h3>
            
            {/* userData Info Fields */}
            {[
              { id: "nickname", icon: <User size={18} />, label: "Nickname", value: userData?.nickname },
              { id: "email", icon: <Mail size={18} />, label: "Email", value: userData?.email },
              { id: "phone", icon: <Phone size={18} />, label: "Phone", value: userData?.phone },
              { id: "gender", icon: <Info size={18} />, label: "Gender", value: userData?.gender },
              { id: "birthday", icon: <Calendar size={18} />, label: "Birthday", value: userData?.birthday },
              { id: "location", icon: <MapPin size={18} />, label: "Location", value: userData?.location },
              { id: "occupation", icon: <Briefcase size={18} />, label: "Occupation", value: userData?.occupation },
              { id: "interests", icon: <Heart size={18} />, label: "Interests", value: userData?.interests },
            ].map((field) => (
              field.value && (
                <div 
                  key={field.id}
                  className="rounded-lg p-3 bg-gray-800 hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-gray-400">{field.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider">{field.label}</h3>
                      <p className="text-white mt-1 break-words">{field.value}</p>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>

          {/* About Section */}
          {userData?.about && (
            <div className="space-y-4">
              <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider px-2">About</h3>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-white whitespace-pre-line">{userData.about}</p>
              </div>
            </div>
          )}

        </div>
      </div>
      
      {/* Custom CSS to hide scrollbar */}
      <style jsx>{`
        .no-scrollbar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, and Opera */
        }
      `}</style>
    </>
  );
};

export default ProfileModal;