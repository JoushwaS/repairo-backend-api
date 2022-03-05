const debug = require("debug");
const DEBUG = debug("dev");
const User = require("../models/User");

const push_notification = require("../config/push_notification");

module.exports = {
	/*
	 * Update  user account details
	 * @param req
	 * @param res
	 * @return {Promise<void>}
	 */
	updateUserAccountDetails: async (req, res) => {
		try {
			const { fullName, phoneNumber } = req.body;
			if (!(fullName && phoneNumber)) {
				return res.status(409).json({
					status: 0,
					message: "All fields are required",
				});
			}
			// console.log("req.user?.role>>", req.user?.role);
			const checkUser = await User.checkExistingField("_id", req.user?._id);
			if (!checkUser) {
				return res.status(409).json({
					status: 0,
					message: "User does not exist",
				});
			}

			const isUserUpdated = await User.findOneAndUpdate(
				{ _id: req.user?._id },
				{ fullName: fullName, phoneNumber: phoneNumber },
				{ new: true }
			);


			const notification_obj = {
				user_device_token: checkUser.user_device_token,
				sender_text: "Account Details",
				heading: "User Successfully Updated",
			};
			push_notification(notification_obj);

			res.status(200).json({
				status: 1,
				message: "User Successfully Updated",
				data: { isUserUpdated },
			});
		} catch (error) {
			DEBUG(error);
			console.error(500, error);
			return res.status(500).json({
				status: 0,
				message: "User Update Failed!",
				error: error,
			});
		}
	},
	updateUserAccountImage: async (req, res) => {
		try {
			const file = await req.file;
			console.log("file>>>>>>>", file);
			const isUserPresent = await User.find({
				_id: req.user?._id,
			});

			if (!isUserPresent) {
				return res.status(409).json({
					status: 0,
					message: "User does not exist",
				});
			}
			const user = await User.findOneAndUpdate(
				{ _id: req.user?._id },
				{
					image: file ? file.path : "",
				}
			);

			res.status(200).json({
				status: 1,
				message: "Successfully uploaded user image",
				data: { user },
			});
		} catch (error) {
			DEBUG(error);
			return res.status(500).json({
				status: 0,
				message: "User Update Failed!",
				error: error,
			});
			// throw new ApplicationError(500, error);
		}
	},
	UpdateUserAccountLocation: async (req, res) => {
		try {
			const { location, title } = req.body;
			const newLocation = {
				type:"Point",
				coordinates: [location.lng, location.lat],
				title:title,
			
			};

			// console.log(" location, title", location, title)
			// console.log(req.user)
			// return
			const user=await User.findOneAndUpdate(
				{ _id: req.user?._id },
				{locations:newLocation},{new:true})
			
			
			res.status(200).json({
				status: 1,
				message: "Successfully Updated Address",
				data:{user}
			});
		} catch (error) {
			console.log(error, "error");
			DEBUG(error);
			return res.status(500).json({
				status: 0,
				message: "User Address Update Failed!",
				error: error,
			});
		}
	},
	UserInfoDetails: async (req, res) => {
		try {
			if (req.user?.role === "customer") {
				const customer = await Customer.findOne({ user: req.user?._id });

				if (customer) {
					res.status(200).json({
						status: 1,
						message: "Fetch Profile Info Successful",
						data: {
							id: req.user?._id,
							email: req.user?.email,
							phoneNumber: req.user?.phoneNumber,
							locations: customer.locations,
						},
					});
				}
			} else if (req.user?.role === "dealer") {
				const dealer = await Dealer.findOne({ user: req.user?._id });
				console.log("dealer info", dealer.locations);
				if (dealer) {
					res.status(200).json({
						status: 1,
						message: "Fetch Profile Info Successful",
						data: {
							id: req.user?._id,
							email: req.user?.email,
							phoneNumber: req.user?.phoneNumber,
							locations: dealer.locations,
						},
					});
				}
			}
		} catch (error) {
			console.log(error, "error");
			DEBUG(error);
			return res.status(500).json({
				status: 0,
				message: "Fetch Profile Info Failed!",
				error: error,
			});
		}
	},
};
