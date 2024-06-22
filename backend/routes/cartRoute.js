import express from "express"

import authMiddleware from "../middleware/auth.js";
import { addToCart,removefromCart,getCart } from "../controllers/cartController.js";

const cartRouter=express.Router();

cartRouter.post("/add",authMiddleware,addToCart)
cartRouter.post("/remove",authMiddleware,removefromCart)
cartRouter.post("/get",authMiddleware,getCart)

export default cartRouter;
