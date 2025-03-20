import { GroupMessage } from "../models/groupMessageSchema.js";
import { Group } from "../models/groupSchema.js";

// ✅ Create Group
export const createGroup = async (req, res) => {
    try {
        const { name, description, members } = req.body;
        const group = new Group({
            name,
            description,
            creator: req.user.id,
            members: [...new Set([req.user.id, ...members])], // Ensure unique members
            admins: [req.user.id],
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
            .populate("members", "name email online")
            .populate("admins", "name email");
        res.json(groups);
    } catch (error) {
        res.status(500).json({ error: "Error fetching groups" });
    }
};

// ✅ Update Group (Only Admin)
export const updateGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.groupId);
        if (!group.admins.includes(req.user.id)) {
            return res.status(403).json({ error: "Not authorized" });
        }

        const { name, description, members, admins } = req.body;
        const updatedGroup = await Group.findByIdAndUpdate(
            req.params.groupId,
            { name, description, members, admins },
            { new: true }
        );
        res.json(updatedGroup);
    } catch (error) {
        res.status(500).json({ error: "Error updating group" });
    }
};

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
