import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authroutes.js";
import productRoutes from "./src/routes/productroutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


app.use("/auth", authRoutes);
app.use("/products", productRoutes);


connectDB();
const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
