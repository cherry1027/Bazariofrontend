// models/Order.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  price: Number,
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "paid", "shipped", "delivered", "cancelled"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  shippingAddress: { type: String }, // optional
  paymentInfo: { type: mongoose.Schema.Types.Mixed }, // optional (for later)
});

export default mongoose.model("Order", orderSchema);
