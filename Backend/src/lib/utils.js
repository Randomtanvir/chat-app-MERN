import jwt from "jsonwebtoken";

export const generateTocken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "5d",
  });

  res.cookie("jwt", token, {
    maxAge: 5 * 24 * 60 * 1000, // ms
    httpOnly: true, //prevent xss attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attcks
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
