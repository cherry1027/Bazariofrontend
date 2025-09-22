import express from "express";
import { createProduct, getProducts, getProductById } from "../conntrolers/productcontroller.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createProduct); // only sellers
router.get("/", getProducts); // public
router.get("/:id", getProductById); // public

export default router;
