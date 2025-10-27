import express from "express";
import authRouts from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";

dotenv.config();
const app = express();
app.use(express.json());

//runnig port
const port = process.env.PORT || 3001;

//routes
app.use("/api/auth", authRouts);

app.listen(port, () => {
  console.log(`server running on port : ${port}`);
  connectDB();
});
