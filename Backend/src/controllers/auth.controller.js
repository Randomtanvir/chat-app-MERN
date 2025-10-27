import { generateTocken } from "../lib/utils.js";
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

    generateTocken(newUser._id, res);
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
export const login = async (req, res) => {};
export const logout = async (req, res) => {};
