const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const validator = require("validator");

const postSchema = new mongoose.Schema(
  {
    postTitle: {
      type: String,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      minlength: 10,
    },

    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
        },
      },
    ],

    default: null,
  },
  { timestamps: true }
);
module.exports = mongoose.model("Post", postSchema, "Posts");
