export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const myId = req.user._id;

    let imageUrl = null;
    if (req.file) {
      const result = await uploadImageInCloudinary(req.file);
      imageUrl = result.secure_url;
    }

    const newMessage = new Message({
      senderId: myId,
      receiverId,
      text,
      image: imageUrl,
    });

    if (!newMessage) {
      return res.status(400).json({
        message: "Message can't send",
      });
    }

    await newMessage.save();

    // ✅ Realtime message
    const receiverSocketId = activeUserSocketId(receiverId);
    const senderSocketId = activeUserSocketId(myId);

    // ✅ Prevent duplicate emit
    if (receiverSocketId && receiverSocketId !== senderSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // ✅ Always emit to sender for UI update
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
