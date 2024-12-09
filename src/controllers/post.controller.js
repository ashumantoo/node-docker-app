import { Post } from "../models/post.model.js";

export const createPost = async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      description: req.body.description
    });
    await newPost.save();
    return res.json({
      success: true,
      message: "New Post created",
      post: newPost
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    return res.json({
      success: true,
      posts
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      return res.json({
        success: true,
        post
      });
    } else {
      return res.json({
        success: false,
        message: "Post not found"
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.json({
        success: true,
        message: "Post not found"
      });
    }
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json({
      success: true,
      post: updatedPost
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.json({
        success: true,
        message: "Post not found"
      });
    }
    await Post.findByIdAndDelete(req.params.id);
    return res.json({
      success: true,
      message: "Post deleted"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}