
const mongoose = require("mongoose");

// Define a schema for the 'User' model
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        empId: {
            type: String,
            required: true,
            unique: true,
        },
        dp: {
            type: String,
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other", ""],
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        phoneNo: {
            type: String,
        },
        whatsAppNo: {
            type: String,
        },
        userType: {
            type: String,
            enum: ["Admin", "HR Manager", "Business Developer", "Recruiter"],
            default: "Recruiter",
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        secret: {
            type: String,
        },
    },
    {
        timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields
    }
);


export const User = mongoose.model("User",userSchema)
