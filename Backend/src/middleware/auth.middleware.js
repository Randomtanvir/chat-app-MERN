import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({
        message: "Unauthorized - no Toker Provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      res.status(401).json({
        message: "Unauthorized - Token is invalid",
      });
    }
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("middleware error", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
