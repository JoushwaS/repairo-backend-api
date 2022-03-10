const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const validator = require("validator");

const postTypesList = [
  "Expert Available",
  "Expert Wanted",
  "Want to Buy/Rent",
  "Available to Sale/Rent",
];
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
    },
    image: {
      type: mongoose.Schema.Types.String,
      // required: true,
    },
    postMainHeading: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    postHeading: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    price: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    location: {
      type: { type: String, default: "Point", enum: ["Point"] },
      coordinates: [Number],
      title: String,
    },
    isCallAllowed: {
      type: mongoose.Schema.Types.Boolean,

      default: true,
    },
    isMessageAllowed: {
      type: mongoose.Schema.Types.Boolean,

      default: true,
    },
    postType: {
      type: String,
      required: true,
      enum: postTypesList,
    },

    likesId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Likes",
      default: null,
    },

    // comments: [
    //   {
    //     user: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "Users",
    //       required: true,
    //     },
    //     commentText: {
    //       type: mongoose.Schema.Types.String,
    //       required: true,
    //     },
    //   },
    // ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Post", postSchema, "Posts");
