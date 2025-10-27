import mongooes from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongooes.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected : ${conn.connection.host}`);
    // console.log(conn);
  } catch (error) {
    console.log("mongoDB connetion error :", error);
  }
};
