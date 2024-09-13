import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: string,
      required: true,
      unique: true,
    },
    email: {
      type: string,
      required: true,
      unique: true,
    },
    password: {
      type: string,
      required: true,
    },
    role: {
      type: string,
      enum: ["user", "admin"],
      default: "user",
    },
    isBlocked: {
      type:Boolean,
      default:false,
    },
  },
  { timestamps: true }
);

//Password encripted before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//Password compare while call the function.
userSchema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
