import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
  pingTimeout: 60000, // disconnect before 60s idle
  pingInterval: 25000, // ping every 25s
});

export const activeUserSocketId = (userId) => {
  return userSocketMap[userId];
};

//used to store online Users
const userSocketMap = {}; //{userId: socketId}

io.on("connection", (socket) => {
  console.log("connection ======================", socket.id);

  //get id from frontend
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;
  //io.emait() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("disconnection ======================", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
