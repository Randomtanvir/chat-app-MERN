import express from "express";
import authRouts from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

//runnig port
const port = process.env.PORT || 3001;

//routes
app.use("/api/auth", authRouts);
app.use("/api/message", messageRoutes);

app.listen(port, () => {
  console.log(`server running on port : ${port}`);
  connectDB();
});
