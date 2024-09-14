import { User } from "../models/user.model.js";

export const blockUser = async (req, res) => {
  const {id} = req.params.id;
  try {
    const user = await User.findOne({id});
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    if(user.isBlocked){
      return res.status(404).json({ msg: "User already blocked" });
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
  const {id} = req.params.id
    try {
        const user = await User.findOne({id});
        if (!user) {
          return res.status(404).json({ msg: "User not found" });
        }
        if(!user.isBlocked){
          return res.status(404).json({ msg: "User was not in Block state" });
        }
        user.isBlocked = false;
        await user.save();
    
        res.json({ msg: "User unblocked sucessfully " });
      } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
      }
}


