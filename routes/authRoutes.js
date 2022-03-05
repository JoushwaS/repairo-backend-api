const express = require("express");
const authController = require("../controllers/authController");
const authentication = require("../middlewares/authenticate.middleware");
const catchAsync = require("../middlewares/catchAsync.middleware");

const {
	logout,
	login,
	signup,
	recoverPassword,
	verifyOtp,
	generateOtp,
	resetPassword,
	userAgreement,
} = authController;

const { authenticate } = authentication;

const router = express.Router();
router.post('/signup', catchAsync(signup));

router.post("/login", catchAsync(login));
router.post("/generate-otp", catchAsync(recoverPassword));
router.post("/logout", catchAsync(logout));
router.post("/verify-otp", catchAsync(verifyOtp));
router.post("/reset-password", catchAsync(resetPassword));
router.post(
	"/update-user-agreement-status",
	authenticate,
	catchAsync(userAgreement)
);

module.exports = router;
