
const registerUser = async (req,res,next)=>{
    const {name,bio,username,password} = req.body;

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

    
}