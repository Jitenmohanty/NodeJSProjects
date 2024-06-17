import { TryCatch } from "../middleware/ErrorHandler";
import { ErrorHandler } from "../utils/ErrorClass";

const registerUser = TryCatch(async (req,res,next)=>{
    const {name,bio,username,password} = req.body;
    const file = req.file;
    
    if(!file) return next(new ErrorHandler("Please upload a avatar"))

     // validation - not empty
  if (
    [username, email, fullName, password].some((field) => field?.trim() === "")
  ) {
    throw new Error(400, "All fields are required!");
  }

   // check if user already exists: username, email
   const userExist = await User.findOne({
    $or: [{ username }, { email }],
  });
    if(userExist){
        throw new Error(409,"User with username already exists!")
    }
    

})

const login = TryCatch(async(req,res,next)=>{
  const {email,password} = req.body;

  if(!email && !password)   throw new Error(400, "All fields are required!");

  const userExist = await User.findOne(email);
  if(!userExist){
    return next(new ErrorHandler("User not found!"))
  }

  const isPasswordValid = await userExist 
})