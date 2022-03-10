const debug = require("debug");
const DEBUG = debug("dev");
const Post = require("../models/Post");
const Likes = require("../models/Likes");
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

      const newPostInfo = await newPost.save();
      const newLike = new Like();
      newLike.postId = newPostInfo._id;
      const likeN = await newLike.save();
      console.log("likes>>>>>", likeN._id);
      // return;
      await Post.findOneAndUpdate(
        { _id: newPostInfo._id },
        { likesId: likeN._id }
      );
      // return;
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
  likePost: async (req, res) => {
    try {
      const { postId, userId } = req.body;
      const isUserLiked = await Likes.find({
        likes: { $elemMatch: { user: req.user?._id } },
      });
      console.log("isUserLiked", isUserLiked);

      if (isUserLiked.length != 0) {
        return res.status(400).json({
          status: 0,
          message: "You can only Like the post once",
        });
      }
      const like = await Likes.findOne({ postId });
      console.log(like?.likesCount);
      let updateData = [];
      if (like?.likes.length) {
        console.log("here 1");
        const rest = like?.likes;
        console.log("rest", req.user?._id);
        updateData = [...rest, { user: req.user?._id }];
        await Likes.findOneAndUpdate(
          { postId: postId },
          { $inc: { likesCount: 1 }, likes: updateData }
        );
      } else {
        console.log("here 2");
        const newDataUpdate = { user: req.user?._id, isCurrent: true };
        updateData = [newDataUpdate];
        await Likes.findOneAndUpdate(
          { postId: postId },
          {
            $inc: { likesCount: 1 },
            $push: { likes: { $each: [{ user: req.user?._id }] } },
          }
        );
      }

      res.status(200).json({
        status: 1,
        message: "Like Post Successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: 0,
        message: "Like Post Failed!",
        error: { error },
      });
    }
  },

  getAllPosts: async (req, res) => {
    try {
      // const Posts = await Post.aggregate([
      //   {
      //     $project: {
      //       numberOfLikes: {
      //         $cond: {
      //           if: {
      //             $isArray: "$likes",
      //           },
      //           then: {
      //             $size: "$likes",
      //           },
      //           else: "NA",
      //         },
      //       },
      //     },
      //   },
      // ]);

      const populateOptions = [
        {
          path: "likesId",
          model: "Like",
          select: "likesCount",
        },
      ];
      const Posts = await Post.find().populate(populateOptions);
      // console.log(Posts);
      res.status(200).json({
        status: 1,
        message: "Posts Fetched  Successfully",
        data: { Posts },
      });
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
