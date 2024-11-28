import mongoose from 'mongoose'

const candidateSchema = new mongoose.Schema(
    {
        stuId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        dob: { type: Date },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other", ""],
        },
        dp: { type: String },
        phone: { type: String, required: true },
        whatsappNo: { type: String },
        skills: [
            {
                skillName: {
                    type: String,
                },
                relevantExp: { type: Number, default: 0 },
            },
        ],
        isFresher: { type: Boolean, default: "true" },
        experience: { type: String, default: 0 },
        experienceType: {
            type: String,
            enum: ["Internship", "Full Time", "Part Time", "Contract", "NA"],
            default: "NA",
        },
        workDetails: [
            {
                companyName: { type: String },
                companyAddress: {
                    city: { type: String },
                    state: { type: String },
                    country: { type: String },
                },
                role: { type: String },
                startingDate: { type: Date },
                endingDate: { type: Date },
                workDetails: { type: String },
            },
        ],
        stipend: { type: Number },
        currentCTC: { type: Number },
        expectedCTC: { type: Number },
        noticePeriod: { type: String },
        address: {
            at: { type: String },
            po: { type: String },
            city: { type: String },
            dist: { type: String },
            state: { type: String },
            country: { type: String },
            pin: { type: String },
        },
        cv: { type: String },
        currentStatus: {
            type: String,
            default: "On Bench",
            enum: ["Processing", "On Bench", "Selected"],
        },
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        otherDetails: { type: String },
    },
    {
        timestamps: true,
    }
);


export const Candidate = mongoose.model("Candidate",candidateSchema)
