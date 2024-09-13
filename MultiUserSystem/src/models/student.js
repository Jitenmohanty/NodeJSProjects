import mongoose from "mongoose";


const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    course: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  
  export const Student = mongoose.model('Student', StudentSchema);