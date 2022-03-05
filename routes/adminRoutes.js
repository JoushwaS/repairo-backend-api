const express = require("express");
const adminController = require("../controllers/adminController");
const authentication = require("../middlewares/authenticate.middleware");
const catchAsync = require("../middlewares/catchAsync.middleware");
const verifyRights = require("../middlewares/verifyRights.middleware");
const { createUser, getAllUsers, adminLogin } = adminController;

const { authenticate } = authentication;

const router = express.Router();
router.post("/admin-login", catchAsync(adminLogin));

router.post(
	"/create-user",
	catchAsync(createUser)
);
router.get(
	"/get-all-users",
	authenticate,
	verifyRights("getAllUsers"),
	catchAsync(getAllUsers)
);

module.exports = router;
