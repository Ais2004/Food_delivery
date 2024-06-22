import express from "express"
import { addFood,listFood,remove } from "../controllers/foodControllers.js"
import multer from "multer"
import userModel from "../models/userModel.js";
const foodRouter=express.Router();

//img storage engine

const storage=multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
       return cb(null,`${Date.now()}${file.originalname}`)
    }
})



const upload=multer({storage:storage})
foodRouter.post("/add",upload.single("image"),addFood)
foodRouter.post("/remove",remove)
foodRouter.get("/list",listFood)


export default foodRouter;
