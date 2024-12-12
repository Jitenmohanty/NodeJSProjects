const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Environment variables for JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
const registerUser = async (req, res) => {
  const { username:name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
};

// Login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
console.log(req.body)
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in user" });
  }
};

// Get all users (Admin only)
const getUsers = async (req, res) => {
  try {
    // Get user information based on the decoded token data (req.user)
    const user = await User.findById(req.user.id).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user data" });
  }
};

const addUser = async (req, res) => {
  try {
    const {name,email,userType:role} = req.body;
    // console.log(req.body);
    const user = await User.create({name,email,role});
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding user" });
  }
};

const getAllUser = async(req,res)=>{
  try {
    const users = await User.find().select('_id name');

    if(users.length === 0){
      return res.status(400).json({message:"No user found"});
    }
    return res.status(201).json(users)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error at fetching users" });
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  addUser,
  getAllUser
};
