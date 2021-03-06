const express = require("express");
const adminController = require("../controllers/adminController");
const authentication = require("../middlewares/authenticate.middleware");
const catchAsync = require("../middlewares/catchAsync.middleware");
const verifyRights = require("../middlewares/verifyRights.middleware");
const { getAllUsers, adminLogin } = adminController;
const { multerDiskUpload } = require("../middlewares/upload.middleware");

const { authenticate } = authentication;

const router = express.Router();
router.post("/admin-login", catchAsync(adminLogin));

router.get(
  "/get-all-users",
  authenticate,
  verifyRights("getAllUsers"),
  catchAsync(getAllUsers)
);

module.exports = router;
