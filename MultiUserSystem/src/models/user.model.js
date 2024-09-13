import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    username:{
        type:string,
        required:true,
        unique:true
    },
    email:{
        type:string,
        required:true,
        unique:true
    },
    password:{
        type:string,
        required:true,
    },
    role:{
        type:string,
        enum:['user','admin'],
        default:'user'
    },
},{timestamps:true})

userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password,this.password)
}

export const User = mongoose.model("User",userSchema);