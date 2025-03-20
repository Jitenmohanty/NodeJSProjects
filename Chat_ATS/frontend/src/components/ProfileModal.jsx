import React from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Info,
  Calendar,
  MapPin,
  Briefcase,
  Heart,
  Users,
  Shield,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ProfileModal = ({ isOpen, onClose, data }) => {
  const { user: profile } = useAuth();

  const userData = data || profile;
  
  // Check if data is a group (has members array)
  const isGroup = userData?.members && Array.isArray(userData.members);
  
  // Default avatar if userData has no profile picture
  const defaultAvatar =
    "https://images.pexels.com/photos/1435517/pexels-photo-1435517.jpeg?auto=compress&cs=tinysrgb&w=600";

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 " onClick={onClose} />}
      <div
        className={`fixed top-0 left-0 h-full w-80 md:w-[29vw] z-50 bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto overflow-x-hidden no-scrollbar
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-white text-xl font-semibold">
            {isGroup ? "Group Profile" : "Profile"}
          </h2>
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
              {!isGroup && userData?.online && (
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
              )}
            </div>
            <h2 className="text-white text-lg font-medium mt-4">
              {userData?.name || "User Name"}
            </h2>
            <p className="text-gray-400 text-sm mt-2 text-center">
              {userData?.bio || userData?.description || "No description available"}
            </p>

            {userData?.status && (
              <div className="mt-4 px-3 py-1 bg-gray-800 rounded-full">
                <p className="text-gray-300 text-sm">{userData.status}</p>
              </div>
            )}
          </div>

          {/* Group Members Section for Group Profile */}
          {isGroup && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider px-2">
                  Group Members ({userData.members.length})
                </h3>
                <div className="flex items-center text-gray-400">
                  <Users size={16} className="mr-1" />
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg space-y-3">
                {userData.members.map((member) => {
                  const isAdmin = userData.admins?.some(
                    (admin) => admin._id === member._id
                  );
                  return (
                    <div
                      key={member._id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={member?.profilePicture || defaultAvatar}
                            alt={member.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
                          />
                          {member.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-1 border-gray-800"></div>
                          )}
                        </div>
                        <div>
                          <p className="text-white text-sm">{member.name}</p>
                          <p className="text-gray-400 text-xs">{member.email}</p>
                        </div>
                      </div>
                      {isAdmin && (
                        <span className="text-amber-500 text-xs px-2 py-1 bg-gray-700 rounded-full flex items-center">
                          <Shield size={12} className="mr-1" />
                          Admin
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stats Section for User Profile */}
          {!isGroup && (
            <div className="grid grid-cols-3 gap-3 bg-gray-800 rounded-lg p-4">
              <div className="flex flex-col items-center">
                <span className="text-white font-bold">
                  {userData?.posts || 0}
                </span>
                <span className="text-gray-400 text-xs">Posts</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-white font-bold">
                  {userData?.followers || 0}
                </span>
                <span className="text-gray-400 text-xs">Followers</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-white font-bold">
                  {userData?.following || 0}
                </span>
                <span className="text-gray-400 text-xs">Following</span>
              </div>
            </div>
          )}

          {/* Group Info for Group Profile */}
          {isGroup && (
            <div className="space-y-5">
              <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider px-2">
                Group Information
              </h3>
              
              {[
                {
                  id: "name",
                  icon: <Info size={18} />,
                  label: "Name",
                  value: userData?.name,
                },
                {
                  id: "description",
                  icon: <Info size={18} />,
                  label: "Description",
                  value: userData?.description,
                },
                {
                  id: "createdAt",
                  icon: <Calendar size={18} />,
                  label: "Created At",
                  value: userData?.createdAt && new Date(userData.createdAt).toLocaleDateString(),
                },
                {
                  id: "membersCount",
                  icon: <Users size={18} />,
                  label: "Members Count",
                  value: userData?.members?.length,
                },
              ].map(
                (field) =>
                  field.value && (
                    <div
                      key={field.id}
                      className="rounded-lg p-3 bg-gray-800 hover:bg-gray-750 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-gray-400">{field.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                            {field.label}
                          </h3>
                          <p className="text-white mt-1 break-words">
                            {field.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          )}

          {/* User Details for Individual Profile */}
          {!isGroup && (
            <div className="space-y-5">
              <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider px-2">
                Personal Information
              </h3>

              {/* User Info Fields */}
              {[
                {
                  id: "nickname",
                  icon: <User size={18} />,
                  label: "Nickname",
                  value: userData?.nickname,
                },
                {
                  id: "email",
                  icon: <Mail size={18} />,
                  label: "Email",
                  value: userData?.email,
                },
                {
                  id: "phone",
                  icon: <Phone size={18} />,
                  label: "Phone",
                  value: userData?.phone,
                },
                {
                  id: "gender",
                  icon: <Info size={18} />,
                  label: "Gender",
                  value: userData?.gender,
                },
                {
                  id: "birthday",
                  icon: <Calendar size={18} />,
                  label: "Birthday",
                  value: userData?.birthday,
                },
                {
                  id: "location",
                  icon: <MapPin size={18} />,
                  label: "Location",
                  value: userData?.location,
                },
                {
                  id: "occupation",
                  icon: <Briefcase size={18} />,
                  label: "Occupation",
                  value: userData?.occupation,
                },
                {
                  id: "interests",
                  icon: <Heart size={18} />,
                  label: "Interests",
                  value: userData?.interests,
                },
              ].map(
                (field) =>
                  field.value && (
                    <div
                      key={field.id}
                      className="rounded-lg p-3 bg-gray-800 hover:bg-gray-750 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-gray-400">{field.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                            {field.label}
                          </h3>
                          <p className="text-white mt-1 break-words">
                            {field.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          )}

          {/* About Section for User Profile */}
          {!isGroup && userData?.about && (
            <div className="space-y-4">
              <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider px-2">
                About
              </h3>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-white whitespace-pre-line">
                  {userData.about}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileModal;