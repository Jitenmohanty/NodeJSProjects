import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const GroupContext = createContext(null);

export const GroupProvider = ({ children }) => {
  const { user, socket } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadGroupMessages, setUnreadGroupMessages] = useState({});
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [error, setError] = useState(null);
  // Add state for authorized groups (groups the user has already entered a password for)
  const [authorizedGroups, setAuthorizedGroups] = useState([]);

  // Load authorized groups from sessionStorage when component mounts
  useEffect(() => {
    if (user) {
      try {
        const savedAuthorizedGroups = sessionStorage.getItem(
          `authorized_groups_${user.id}`
        );
        if (savedAuthorizedGroups) {
          setAuthorizedGroups(JSON.parse(savedAuthorizedGroups));
        }
      } catch (error) {
        console.error(
          "Error loading authorized groups from sessionStorage:",
          error
        );
      }
    }
  }, [user]);

  // Save authorized groups to sessionStorage whenever it changes
  useEffect(() => {
    if (user && authorizedGroups.length > 0) {
      sessionStorage.setItem(
        `authorized_groups_${user.id}`,
        JSON.stringify(authorizedGroups)
      );
    }
  }, [user, authorizedGroups]);

  const fetchGroups = useCallback(async () => {
    if (!user) {
      setGroups([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_FRONTEND_URI}/groups`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setGroups(response.data);

      // Fetch unread group messages
      const unreadResponse = await axios.get(
        `${import.meta.env.VITE_FRONTEND_URI}/group-messages/unread`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Process unread messages
      const unreadCounts = {};
      if (unreadResponse.data && unreadResponse.data.length > 0) {
        unreadResponse.data.forEach((item) => {
          unreadCounts[item.groupId] = item.count;
        });
      }

      setUnreadGroupMessages(unreadCounts);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createGroup = async (name, description, members, password = "") => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_FRONTEND_URI}/groups`,
        {
          name,
          description,
          members,
          password,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setGroups((prev) => [...prev, response.data]);

      // If user creates a group, they are automatically authorized for it
      if (password) {
        addAuthorizedGroup(response.data._id);
      }

      return { success: true, group: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to create group",
      };
    }
  };

  const getGroupById = useCallback(
    (groupId) => {
      return groups.find((g) => g._id === groupId) || null;
    },
    [groups]
  );

  const updateUnreadCount = useCallback((groupId, countOrUpdater) => {
    setUnreadGroupMessages((prev) => {
      const currentCount = prev[groupId] || 0;
      const newCount =
        typeof countOrUpdater === "function"
          ? countOrUpdater(currentCount)
          : countOrUpdater;

      return {
        ...prev,
        [groupId]: newCount,
      };
    });
  }, []);

  const clearUnreadCount = useCallback((groupId) => {
    setUnreadGroupMessages((prev) => ({
      ...prev,
      [groupId]: 0,
    }));
  }, []);

  const setActiveGroup = useCallback(
    (groupId) => {
      setActiveGroupId(groupId);

      // When a group becomes active, clear its unread count
      if (groupId) {
        clearUnreadCount(groupId);
      }
    },
    [clearUnreadCount]
  );

  // Listen for socket events
  useEffect(() => {
    if (!socket || !user) return;

    // Standard group message reception
    const handleReceiveGroupMessage = (data) => {
      console.log(data);
      if (data.message && data.message.group) {
        const groupId = data.message.group;
        // Only update count if this message is not from current user and user is not viewing this group
        if (data.message.sender !== user.id && activeGroupId !== groupId) {
          updateUnreadCount(groupId, (count) => (count || 0) + 1);
        }
      }
    };

    // Special notification for when user is not in the group chat but online
    const handleGroupNotification = (data) => {
      if (data.groupId) {
        // Only increment
        // if not actively viewing this group
        let isHaveGroup = groups?.some((group) => group._id === data.groupId);
        console.log(isHaveGroup);
        if (isHaveGroup) {
          updateUnreadCount(data.groupId, (count) => (count || 0) + 1);

          // Optionally show a browser notification
          if (Notification.permission === "granted") {
            const group = getGroupById(data.groupId);
            const groupName = group ? group.name : "A group";
            new Notification(`New message in ${groupName}`, {
              body: `${data.sender.name}: ${data.text.substring(0, 50)}${
                data.text.length > 50 ? "..." : ""
              }`,
            });
          }
        }
      }
    };

    socket.on("receive_group_message", handleReceiveGroupMessage);
    socket.on("group_message_notification", handleGroupNotification);

    return () => {
      socket.off("receive_group_message", handleReceiveGroupMessage);
      socket.off("group_message_notification", handleGroupNotification);
    };
  }, [socket, user, activeGroupId, updateUnreadCount, getGroupById]);

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchGroups();

      // Request notification permission on first load
      if (
        Notification.permission !== "denied" &&
        Notification.permission !== "granted"
      ) {
        Notification.requestPermission();
      }
    }
  }, [user, fetchGroups]);

  // Check if a user is authorized for a group
  const isAuthorizedForGroup = useCallback(
    (groupId) => {
      return authorizedGroups.includes(groupId);
    },
    [authorizedGroups]
  );

  // Add a group to the authorized list
  const addAuthorizedGroup = useCallback((groupId) => {
    setAuthorizedGroups((prev) => {
      if (!prev.includes(groupId)) {
        return [...prev, groupId];
      }
      return prev;
    });
  }, []);

  // Verify group password and add to authorized groups if successful
  const verifyGroupPassword = useCallback(
    async (groupId, password) => {
      try {
        const response = await axios.post(
          `${
            import.meta.env.VITE_FRONTEND_URI
          }/groups/${groupId}/verify-password`,
          { password },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response);

        if (response.data.message === "Password verified. You can now chat.") {
          addAuthorizedGroup(groupId);
          return { success: true };
        }
        return { success: false, error: "Verification failed" };
      } catch (err) {
        return {
          success: false,
          error: err.response?.data?.error || "Incorrect password",
        };
      }
    },
    [addAuthorizedGroup]
  );

  // Function to add a member to a group
  const addMembersToGroup = async (groupId, userIds) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_FRONTEND_URI}/groups/add-member`,
        { groupId, userIds },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Ensure local state reflects the updated group
      if (response.data.group) {
        setGroups((prevGroups) =>
          prevGroups.map((gr) =>
            gr._id === response.data.group._id ? response.data.group : gr
          )
        );
      }

      setError(null);
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to add members to group";
      setError(errorMsg);
      console.error("Error adding members:", errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Remove a member from a group
  const removeMember = async (groupId, userId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_FRONTEND_URI}/groups/remove-member`,
        { groupId, userId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Update groups state by removing the user from the specified group
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group._id === groupId
            ? {
                ...group,
                members: group.members.filter((member) =>
                  typeof member === "object"
                    ? member._id !== userId
                    : member !== userId
                ),
              }
            : group
        )
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error removing member:",
        error.response?.data?.message || error.message
      );
      throw error;
    }
  };

  const updateGroup = async (groupId, updateData) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${import.meta.env.VITE_FRONTEND_URI}/groups/${groupId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Final update with server response
      setGroups((prevGroups) =>
        prevGroups.map((group) => (group._id === groupId ? res.data : group))
      );
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update group");
      throw err;
    }
  };

  // console.log(groups)

  return (
    <GroupContext.Provider
      value={{
        groups,
        loading,
        fetchGroups,
        createGroup,
        getGroupById,
        unreadGroupMessages,
        setUnreadGroupMessages,
        updateUnreadCount,
        clearUnreadCount,
        activeGroupId,
        setActiveGroup,
        // Add new functions for password management
        isAuthorizedForGroup,
        addAuthorizedGroup,
        verifyGroupPassword,
        addMembersToGroup,
        removeMember,
        updateGroup,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export const useGroup = () => useContext(GroupContext);

export default GroupProvider;
