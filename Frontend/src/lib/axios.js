import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chat-app-server-88sb.onrender.com/api",
  // baseURL: "http://localhost:5001/api",
  withCredentials: true,
});
