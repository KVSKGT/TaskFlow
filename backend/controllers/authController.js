import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @desc   Register a new user
// @route  POST /api/auth/signup
// @access Public
export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      const err = new Error("Please provide name, email and password");
      err.statusCode = 400;
      throw err;
    }

    if (password.length < 6) {
      const err = new Error("Password must be at least 6 characters");
      err.statusCode = 400;
      throw err;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const err = new Error("Email already registered");
      err.statusCode = 400;
      throw err;
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error("Please provide email and password");
      err.statusCode = 400;
      throw err;
    }

    // password has select:false in schema, so explicitly request it
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      const err = new Error("Invalid email or password");
      err.statusCode = 401;
      throw err;
    }

    res.status(200).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get logged-in user's profile
// @route  GET /api/auth/me
// @access Private
export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    next(error);
  }
};
