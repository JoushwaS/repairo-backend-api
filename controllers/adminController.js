const passport = require("passport");
const debug = require("debug");
require("../services/passport/passport-local.service");
const User = require("../models/User");

const otpGeneratorObj = require("../helpers/otpGenerator.helper");
const { sendUserCredentials } = require("../services/email/sendEmail");

const dayjs = require("dayjs");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");

dayjs.extend(isSameOrBefore);

const { otpGenerator } = otpGeneratorObj;
const DEBUG = debug("dev");

/**
 * This function returns a json with user data,
 * token and the status and set a cookie with
 * the name jwt. We use this in the response
 * of login or signup
 * @param user
 * @param statusCode
 * @param req
 * @param res
 */
const createCookie = (requireToken = (user, statusCode, req, res) => {
	const token = user.generateVerificationToken();

	res.status(statusCode).json({
		status: "success",
		token,
		data: {
			user,
		},
	});
});

module.exports = {
	/**
	 *CREATE USER ACCOUNT ONLY ADMIN ALLOWED
	 * @param req
	 * @param res
	 * @param next
	 * @return {Promise<void>}
	 */
	createUser: async (req, res) => {
		try {
			const {
				email,
				password,
				role,
				phoneNumber,
				fullName,
				user_device_type,
				user_device_token,
			} = req.body;
			// console.log({ email, password, role, phoneNumber, fullName });
			if (!(phoneNumber && email && password && role && fullName)) {
				return res.status(409).json({
					status: 0,
					message: "All fields are required",
				});
			}

			if (!["customer", "dealer","admin"].includes(role)) {
				return res.status(409).json({
					status: 0,
					message: "Role Not Supported",
				});
			}
			// else if (role === "admin") {
			// 	const adminUser = new User();
			// 	adminUser.email = email;
			// 	adminUser.password = password;
			// 	adminUser.fullName = fullName;
			// 	adminUser.phoneNumber = phoneNumber;
			// 	adminUser.role = role;
			// 	adminUser.defaultPassword = password;
			// 	adminUser.isVerified = true;
			// 	adminUser.isBlocked = false;
			// 	await adminUser.save();

			// 	return res.status(200).json({
			// 		status: "success",
			// 		message: "Admin Successfully created",
			// 		data: { adminUser },
			// 	});
			// }
			const checkEmail = await User.checkExistingField("email", email);
			if (checkEmail) {
				return res.status(409).json({
					status: 0,
					message: "Email already registered, Please Enter a Different Email",
				});
			}
			console.log(typeof user_device_token);

			const newUser = new User();
			newUser.email = email;
			newUser.password = password;
			newUser.fullName = fullName;
			newUser.phoneNumber = phoneNumber;
			newUser.phoneNumber = phoneNumber;
			newUser.role = role;
			newUser.image = null;
			// newUser.defaultPassword = password;
			newUser.isVerified = true;
			newUser.isBlocked = false;
			newUser.user_device_token =
				user_device_token !== undefined ? user_device_token : null;
			newUser.user_device_type =
				user_device_type !== undefined ? user_device_type : null;

			const newUserResult = await newUser.save();

			if (newUserResult) {
				// if (role === "dealer") {
				// 	const newDealer = new Dealer();

				// 	newDealer.user = newUser._id;
				// 	newDealer.fullName = newUser.fullName;
				// 	newDealer.phoneNumber = newUser.phoneNumber;

				// 	await newDealer.save();
				// } else {
				// 	if (newUserResult) {
				// 		const newCustomer = new Customer();

				// 		newCustomer.user = newUser._id;
				// 		newCustomer.fullName = newUser.fullName;
				// 		newCustomer.phoneNumber = newUser.phoneNumber;

				// 		await newCustomer.save();
				// 	}
				// }

				await sendUserCredentials(email, newUser);

				res.status(200).json({
					status: "success",
					message: "User successfully created",
					data: { newUser },
				});
			}
		} catch (error) {
			// console.log(error);
			// DEBUG(error);
			return res.status(400).json({
				status: 0,
				message: error.message,
			});
		}
	},
	/**
	 * Login controller
	 * @param req
	 * @param res
	 * @param next
	 */
	adminLogin: async (req, res, next) => {
		passport.authenticate(
			"adminLogin",
			{ session: false },
			async (err, user, info) => {
				try {
					if (err || !user) {
						let message = err;
						if (info) {
							message = info.message;
						}
						return res.status(401).json({
							status: 0,
							error: {
								message,
							},
						});
					}
					// generate a signed json web token with the contents of user
					// object and return it in the response
					createCookie = requireToken(user, 200, req, res);
				} catch (error) {
					DEBUG(error);
					console.error(500, error);
				}
			}
		)(req, res, next);
	},
	getAllUsers: async (req, res) => {
		try {
			const Users = await User.find();

			if (Users) {
				res.status(200).json({
					status: 1,
					message: "Fetch Users Successfully",
					data: { Users },
				});
			}
		} catch (error) {
			DEBUG(error);
			console.error(500, error);
			res.status(500).json({
				status: 0,
				message: "Fetch Users Failed!",
				error: error,
			});
		}
	},
};
