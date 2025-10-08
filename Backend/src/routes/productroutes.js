import express from "express";
import { createProduct, getProducts, getProductById } from "../conntrolers/productcontroller.js";
import authMiddleware from "../middleware/authmiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), createProduct); 
router.get("/", getProducts); 
router.get("/:id", getProductById); 

export default router;
