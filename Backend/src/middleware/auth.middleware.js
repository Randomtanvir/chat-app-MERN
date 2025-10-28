import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    // 1️⃣ Token না থাকলে
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No Token Provided",
      });
    }

    // 2️⃣ Token যাচাই
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        message: "Unauthorized - Token is invalid",
      });
    }

    // 3️⃣ User খোঁজা
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 4️⃣ সব ঠিক থাকলে req.user সেট করা
    req.user = user;
    next();
  } catch (error) {
    console.log("middleware error", error.message);

    // JWT verification ব্যর্থ হলে
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid Token" });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token Expired" });
    }

    // অন্য কোনো error হলে
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
