const express = require("express");
const serviceController = require("../controllers/serviceController");
const authentication = require("../middlewares/authenticate.middleware");
const catchAsync = require("../middlewares/catchAsync.middleware");
const verifyRights = require("../middlewares/verifyRights.middleware");
const { createService, getAllServices } = serviceController;
const { multerDiskUpload } = require("../middlewares/upload.middleware");

const { authenticate } = authentication;

const router = express.Router();

router.post(
  "/create-service",
  multerDiskUpload.single("file"),
  authenticate,
  verifyRights("createService"),
  catchAsync(createService)
);

router.get("/get-all-services", catchAsync(getAllServices));
module.exports = router;
