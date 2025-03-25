import React from "react";
import { Info, Calendar, Users } from "lucide-react";

const GroupInfo = ({ userData }) => {
  const groupInfoFields = [
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
  ];

  return (
    <div className="space-y-5">
      <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider px-2">
        Group Information
      </h3>

      {groupInfoFields.map(
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

export default GroupInfo;