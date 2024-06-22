 import mongoose from "mongoose";

 export const connectDB=async()=>{
    await mongoose.connect('mongodb+srv://aishwaryaperambuduri:221982@cluster0.zurugqe.mongodb.net/food-del').then(()=>console.log("DB connected"));
 }