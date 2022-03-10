const express = require("express");
const postController = require("../controllers/postController");
const authentication = require("../middlewares/authenticate.middleware");
const catchAsync = require("../middlewares/catchAsync.middleware");
const verifyRights = require("../middlewares/verifyRights.middleware");
const { createPost, getAllPosts, likePost } = postController;
const { multerDiskUpload } = require("../middlewares/upload.middleware");

const { authenticate } = authentication;

const router = express.Router();

router.post(
  "/create-post",
  multerDiskUpload.single("file"),
  authenticate,
  //   verifyRights("createPost"),
  catchAsync(createPost)
);

router.post(
  "/like-post",
  authenticate,
  //   verifyRights("createPost"),
  catchAsync(likePost)
);
router.get("/get-all-posts", catchAsync(getAllPosts));

module.exports = router;
