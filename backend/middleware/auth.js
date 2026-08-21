import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    const err = new Error("Not authorized, no token provided");
    err.statusCode = 401;
    return next(err);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      const err = new Error("Not authorized, user not found");
      err.statusCode = 401;
      return next(err);
    }
    next();
  } catch (error) {
    const err = new Error("Not authorized, token invalid or expired");
    err.statusCode = 401;
    next(err);
  }
};
