import { GroupMessage } from "../models/groupMessageSchema.js";
import { Group } from "../models/groupSchema.js";
import bcrypt from "bcryptjs"


// ✅ Create Group
export const createGroup = async (req, res) => {
    try {
        const { name, description, members, password } = req.body;

        if (!password) {
            return res.status(400).json({ error: "Password is required for the group" });
        }

        const group = new Group({
            name,
            description,
            creator: req.user.id,
            members: [...new Set([req.user.id, ...members])], // Ensure unique members
            admins: [req.user.id],
            password, // Password will be hashed automatically
        });

        await group.save();
        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ error: "Error creating group" });
    }
};


// ✅ Get User's Groups
export const getGroups = async (req, res) => {
    try {
        const groups = await Group.find({ members: req.user.id })
            .populate("members", "name email online profilePicture")
            .populate("admins", "name email profilePicture");
        res.json(groups);
    } catch (error) {
        res.status(500).json({ error: "Error fetching groups" });
    }
};

// export const updateGroup = async (req, res) => {
    //     try {
        //         const group = await Group.findById(req.params.groupId);
//         if (!group.admins.includes(req.user.id)) {
//             return res.status(403).json({ error: "Not authorized" });
//         }

//         const { name, description, members, admins } = req.body;
//         const updatedGroup = await Group.findByIdAndUpdate(
//             req.params.groupId,
//             { name, description, members, admins },
//             { new: true }
//         );
//         res.json(updatedGroup);
//     } catch (error) {
//         res.status(500).json({ error: "Error updating group" });
//     }
// };

// ✅ Delete Group (Only Admin)
export const deleteGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.groupId);
        if (!group.admins.includes(req.user.id)) {
            return res.status(403).json({ error: "Not authorized" });
        }

        await Group.findByIdAndDelete(req.params.groupId);
        await GroupMessage.deleteMany({ group: req.params.groupId });
        res.json({ message: "Group deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting group" });
    }
};


export const verifyGroupPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const { groupId } = req.params; // ✅ Correct way to get it from URL path
        
        const userId = req.user.id;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }
        
        // Check if the user is a member
        if (!group.members.includes(userId)) {
            return res.status(403).json({ error: "You are not a member of this group" });
        }

        // Verify the password
        // const isMatch = await bcrypt.compare(password, group.password);
        // if (!isMatch) {
        //     return res.status(401).json({ error: "Incorrect password" });
        // }

        if(group.password !== password){
            return res.status(401).json({ error: "Incorrect password" });
        }

        res.json({ message: "Password verified. You can now chat." });
    } catch (error) {
        res.status(500).json({ error: "Error verifying group password" });
    }
};


export const addMembersToGroup = async (req, res) => {
    try {
        const { groupId, userIds } = req.body; // Accept an array of user IDs
        
        // Validate input
        if (!groupId) {
            return res.status(400).json({ message: "Group ID is required" });
        }
        
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({ message: "At least one user ID is required" });
        }

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

       
        // Ensure requester is an admin
        if (!group.admins.includes(req.user.id)) {
            return res.status(403).json({ message: "Only admins can add members" });
        }

        // Filter out users already in the group
        const newMembers = userIds.filter(userId => !group.members.includes(userId));

        if (newMembers.length === 0) {
            return res.status(400).json({ message: "All selected users are already in the group" });
        }

        // Add new members
        group.members.push(...newMembers);
        await group.save();

        // Optionally populate the member details before returning
        const updatedGroup = await Group.findById(groupId)
            .populate('members', 'name email profilePicture online')
            .populate('admins', 'name email profilePicture');

        res.status(200).json({ 
            message: "Members added successfully", 
            group: updatedGroup
        });
    } catch (error) {
        console.error("Error adding members to group:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const removeMemberFromGroup = async (req, res) => {
    try {
        const { groupId, userId } = req.body;
        
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }
        
        // Ensure requester is an admin
        if (!group.admins.includes(req.user.id)) {
            return res.status(403).json({ message: "Only admins can remove members" });
        }

        // Check if the user is in the group
        if (!group.members.includes(userId)) {
            return res.status(400).json({ message: "User is not a member of this group" });
        }
        
        // Remove the user
        group.members = group.members.filter(member => member.toString() !== userId);
        await group.save();

        res.status(200).json({ message: "User removed successfully", group });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// // ✅ Update Group (Only Admin)
export const updateGroup = async (req, res) => {
    try {
      const { name, bio, password } = req.body;
      const group = await Group.findById(req.params.groupId);
      
      if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }
  
      // Check if user is admin
      if (!group.admins.includes(req.user.id)) {
        return res.status(403).json({ message: 'Not authorized to update this group' });
      }
  
      group.name = name || group.name;
      group.bio = bio || group.bio;
      if (password) group.password = password;
  
      await group.save();
      res.json(group);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  



