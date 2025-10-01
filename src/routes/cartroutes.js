import express from "express";
import { addToCart, removeFromCart, getCart } from "../conntrolers/cartcontroller.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, addToCart);
router.delete("/remove/:productId", authMiddleware, removeFromCart);
router.get("/", authMiddleware, getCart);

export default router;
