import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"]
  },
  description: {
    type: String,
    required: [true, "Post description is required"]
  }
}, { timestamps: true });

export const Post = mongoose.model("Post", PostSchema);