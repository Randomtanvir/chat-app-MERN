import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateprofile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { uploadSingleImage } from "../middleware/uploadImage.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

//for upadating profile image
router.put(
  "/update-profile",
  protectRoute,
  uploadSingleImage("profilePic"),
  updateprofile
);
router.get("/check", protectRoute, checkAuth);

export default router;
