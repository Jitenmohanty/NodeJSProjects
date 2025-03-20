import { GroupMessage } from "../models/groupMessageSchema.js";
import { Group } from "../models/groupSchema.js";

// ✅ Get Messages for a Group (Paginated)
export const getGroupMessages = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const group = await Group.findById(req.params.groupId);
        if (!group.members.includes(req.user.id)) {
            return res.status(403).json({ error: "Not a member of this group" });
        }

        const messages = await GroupMessage.find({ group: req.params.groupId })
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate("sender", "name email");

        res.json(messages.reverse());
    } catch (error) {
        res.status(500).json({ error: "Error fetching group messages" });
    }
};

// ✅ Get Unread Messages Count for User
export const getUnreadGroupMessages = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find groups the user is a member of
        const userGroups = await Group.find({ members: userId });

        // Count unread messages per group
        const unreadCounts = await Promise.all(
            userGroups.map(async (group) => {
                const count = await GroupMessage.countDocuments({
                    group: group._id,
                    "readBy.user": { $ne: userId },
                });

                return { groupId: group._id, count };
            })
        );

        res.json(unreadCounts);
    } catch (error) {
        console.error("Error fetching unread group messages:", error);
        res.status(500).json({ error: "Error fetching unread group messages" });
    }
};
