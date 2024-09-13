import { User } from "../models/user.model.js";

export const blockUser = async (req, res) => {
  try {
    const user = await User.findOne(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.isBlocked = true;
    await user.save();

    res.json({ msg: "User blocked sucessfully " });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

//Unblock a User.

export const unblockUser = async(req,res)=>{
    try {
        const user = await User.findOne(req.params.id);
        if (!user) {
          return res.status(404).json({ msg: "User not found" });
        }
    
        user.isBlocked = false;
        await user.save();
    
        res.json({ msg: "User unblocked sucessfully " });
      } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
      }
}


