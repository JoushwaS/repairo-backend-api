const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    likesCount: {
      type: Number,
      default: 0,
    },

    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts",
      required: true,
      unique: true,
    },

    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
        },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Like", likeSchema, "Likes");
