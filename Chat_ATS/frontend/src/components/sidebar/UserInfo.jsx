import React from "react";
import {
  User,
  Mail,
  Phone,
  Info,
  Calendar,
  MapPin,
  Briefcase,
  Heart,
} from "lucide-react";

const UserInfo = ({ userData }) => {
  const userInfoFields = [
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
  ];

  return (
    <div className="space-y-5">
      <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider px-2">
        Personal Information
      </h3>

      {userInfoFields.map(
        (field) =>
          field.value && (
            <div
              key={field.id}
              className="rounded-lg p-3 bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="text-gray-400">{field.icon}</div>
                <div className="flex-1">
                  <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                    {field.label}
                  </h3>
                  <p className="text-white mt-1 break-words">{field.value}</p>
                </div>
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default UserInfo;