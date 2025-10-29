import { uploadImageInCloudinary } from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  // all field validition
  // password minimum length 6
  // user alrady exists or not
  // has password
  // email validition --- todo
  // genetate jwt tocken

  try {
    // field validiton
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All field are required.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // password length  validiton
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must me at least 6 characters",
      });
    }

    // user alrady exists or not
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Email alrady Exists",
      });
    }

    //hashed- passed
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create a user
    const newUser = await new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (!newUser) {
      return res.status(400).json({
        message: "Invalid user data.",
      });
    }

    generateToken(newUser._id, res);
    await newUser.save();

    //send response
    return res.status(201).json({
      _id: newUser?._id,
      fullName: newUser?.fullName,
      email: newUser?.email,
      profilePic: newUser?.profilePic,
    });
  } catch (error) {
    console.log("error in signup conrollers :", error?.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "All fiend are required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    //this sintax does not work
    // const isValidPassword = await bcrypt.compare(user.password, password);
    if (!isValidPassword) {
      return res.status(400).json({
        message: "Invalid credential",
      });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internel server error from login-controller",
    });
  }
};
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      message: "Logged out successfully",
    });

    //     res.cookie("jwt", "", {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   expires: new Date(0),
    // });
  } catch (error) {
    res.status(500).json({
      message: "Internel server error" + error.message,
    });
  }
};
export const updateprofile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Cloudinary upload
    const result = await uploadImageInCloudinary(req.file);

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: result.secure_url },
      { new: true }
    );

    res.json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("error in checkAuth controller :", error.message);
    res.status(500).json({
      message: "Internal Server errror",
    });
  }
};
