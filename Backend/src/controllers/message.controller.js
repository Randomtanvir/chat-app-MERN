import { Message } from "../models/message.mode.js";
import { User } from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loginUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loginUserId } }).select(
      "-password"
    );

    res.status(200).json({
      filteredUsers,
    });
  } catch (error) {
    console.log("Error in getUsersForSidebar controller", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;

    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json({ messages });
  } catch (error) {
    console.log("Error in getUsersForSidebar controller", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const myId = req.user._id;

    let imgUrl;
    if (image) {
      // upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imgUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId: myId,
      receiverId,
      text,
      image: imgUrl,
    });

    if (!newMessage) {
      return res.status(400).json({
        message: "Message can't send",
      });
    }

    await newMessage.save();

    // left realtime message

    res.status(200).json(newMessage);
  } catch (error) {
    console.log("Error in getUsersForSidebar controller", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
