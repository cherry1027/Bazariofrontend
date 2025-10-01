import express from "express";
import { placeOrder, getMyOrders, getSellerOrders } from "../conntrolers/ordercontroller.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/place", authMiddleware, placeOrder);
router.get("/my", authMiddleware, getMyOrders);
router.get("/seller", authMiddleware, getSellerOrders);

export default router;
