import express from "express";
import { loginUser, registerUser } from '../controllers/userController.js';
import userModel from "../models/userModel.js";
// Create a router instance
const userRouter = express.Router();

// Define routes
userRouter.post("/register", registerUser); // Route to register a new user
userRouter.post("/login", loginUser);       // Route to login an existing user

// Export the router instance
export default userRouter;
