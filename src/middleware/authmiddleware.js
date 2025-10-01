import jwt from "jsonwebtoken";
import User from "../model/user.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
  
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = { id: user._id.toString(), role: user.role || "buyer", email: user.email, name: user.name };
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid token", error: err.message });
  }
};


export default authMiddleware;
