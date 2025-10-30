import express from "express";
import authRouts from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";

dotenv.config();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//runnig port
const port = process.env.PORT || 3001;

//routes
app.use("/api/auth", authRouts);
app.use("/api/messages", messageRoutes);

server.listen(port, () => {
  console.log(`server running on port : ${port}`);
  connectDB();
});
