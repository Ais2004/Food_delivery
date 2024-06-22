// Import necessary modules
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Corrected import for bcryptjs
import validator from "validator";

// Login user function (to be implemented)
const loginUser = async (req, res) => {
  // Implement login functionality here
  const {email,password}=req.body;
  try{
    const user=await userModel.findOne({email})
    if(!user){
      return res.json({success:false,message:"user doesnt exist"});
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.json({success:false,message:"invalid"});
    }
    const token=createToken(user._id);
    res.json({success:true,token})
  }
  catch(error){
    console.log(error);
    res.json({ success: false, message: "error " });
  }
};

// Function to create JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Register user function
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    // Check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Validate email format and password strength
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Password length must be at least 8 characters" });
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); // Corrected to bcrypt.hash

    // Create a new user instance
    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword
    });

    // Save the new user to the database
    const user = await newUser.save();

    // Generate JWT token for the new user
    const token = createToken(user._id);

    // Send success response with token
    res.json({ success: true, token });
  } catch (error) {
    // Log any errors that occur during registration
    console.log(error);
    res.json({ success: false, message: "Registration failed" });
  }
};

// Export loginUser and registerUser functions
export { loginUser, registerUser };

