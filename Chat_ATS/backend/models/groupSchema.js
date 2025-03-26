import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const groupSchema = new mongoose.Schema({
    name: String,
    description: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bio:{type: String},
    password: { type: String, required: true }, // Store hashed password
    createdAt: { type: Date, default: Date.now },
});

// Hash the group password before saving
groupSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

export const Group = mongoose.model("Group", groupSchema);
