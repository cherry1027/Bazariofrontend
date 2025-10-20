import express from "express";
import { 
  createOrder, 
  getBuyerOrders, 
  getOrderById,
  getSellerOrders,
  getSellerAnalytics 
} from "../conntrolers/ordercontroller.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

// Buyer routes (keeping same paths)
router.post("/place", authMiddleware, createOrder);           // Place order (checkout)
router.get("/my", authMiddleware, getBuyerOrders);            // Order history
router.get("/:id", authMiddleware, getOrderById);             // Single order details

// Seller routes
router.get("/seller", authMiddleware, getSellerOrders);       // Seller's orders
router.get("/seller/analytics", authMiddleware, getSellerAnalytics); // Analytics data

export default router;