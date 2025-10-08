import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  imageUrl: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Product", productSchema);
