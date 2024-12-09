import bcrypt from 'bcrypt';
import { UserModel } from "../models/user.model.js";

export const signup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newPost = new UserModel({
      ...req.body,
      password: hashedPassword
    });
    await newPost.save();
    return res.json({
      success: true,
      message: "New user created",
      post: newPost
    });
  } catch (error) {
    throw error;
  }
}

export const signin = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }
    const passwordMatched = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatched) {
      return res.json({
        success: false,
        message: "Password is incorrect"
      });
    }
    req.session.user = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password
    } // Set session data
    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    throw error;
  }
}

export const getUser = async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return res.json({
      success: true,
      message: "User not found"
    });
  }
  return res.json({
    success: true,
    user
  });
}

export const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.json({
        success: true,
        message: "User not found"
      });
    }
    await UserModel.findByIdAndDelete(req.params.id);
    return res.json({
      success: true,
      message: "User deleted"
    });
  } catch (error) {
    throw error;
  }
}