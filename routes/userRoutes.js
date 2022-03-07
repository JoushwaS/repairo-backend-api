const express = require("express");
const router = express.Router();

const catchAsync = require("../middlewares/catchAsync.middleware");
const verifyRights = require("../middlewares/verifyRights.middleware");
const userController = require("../controllers/userController");
const { authenticate } = require("../middlewares/authenticate.middleware");
const {
  updateUserAccountDetails,
  UpdateUserAccountLocation,
  updateUserAccountImage,
  UserInfoDetails,
} = userController;
const { multerDiskUpload } = require("../middlewares/upload.middleware");

router.put(
  "/update-account-details",
  authenticate,
  verifyRights("updateUserAccountDetails"),
  catchAsync(updateUserAccountDetails)
);
router.put(
  "/update-account-location",
  authenticate,
  verifyRights("UpdateUserAccountLocation"),
  catchAsync(UpdateUserAccountLocation)
);

router.put(
  "/update-account-image",
  multerDiskUpload.single("file"),
  authenticate,
  verifyRights("updateUserAccountImage"),
  catchAsync(updateUserAccountImage)
);
router.post(
  "/account-info-details",

  authenticate,
  verifyRights("UserInfoDetails"),
  catchAsync(UserInfoDetails)
);

module.exports = router;
