const debug = require("debug");
const DEBUG = debug("dev");
const Post = require("../models/Post");
module.exports = {
  /**
   * create service
   * @param req
   * @param res
   * @param next
   */
  createPost: async (req, res) => {
    try {
      const {
        postTitle,
        userId,
        postMainHeading,
        postHeading,
        price,
        isCallAllowed,
        isMessageAllowed,
        postType,
        location,
      } = req.body;
      const file = await req.file;
      const Location = JSON.parse(location);

      const newLocation = {
        type: "Point",
        coordinates: [Location.location.lng, Location.location.lat],
        title: Location.location.title,
      };
      const newPost = new Post();
      newPost.image = file?.path;
      newPost.user = userId;
      newPost.postTitle = postTitle;
      newPost.location = newLocation;
      newPost.postMainHeading = postMainHeading;
      newPost.postHeading = postHeading;
      newPost.price = price;
      newPost.isCallAllowed = isCallAllowed;
      newPost.isMessageAllowed = isMessageAllowed;
      newPost.postType = postType;
      console.log(newPost);

      await newPost.save();
      res.status(200).json({
        status: 1,
        message: "Post Created Successfully",
        data: { newPost },
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: 0,
        message: "Post Creation Failed!",
        error: { error },
      });
    }
  },
  getAllPosts: async (req, res) => {
    try {
      const posts = await Post.count("likes");
      console.log(posts);
      return;
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: 0,
        message: "Fetch Posts  Failed!",
        error: { error },
      });
    }
  },
};
