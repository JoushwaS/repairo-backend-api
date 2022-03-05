/**
 * This middleware is responsible for authenticating routes.
 * If a user doesnt have a cookie named jwt valid or does not
 * send a Bearer token this middleware returns an error.
 */
const debug = require("debug");
const passportJWT = require("../config/passport.config");
const { ApplicationError } = require("../helpers/errors.helper");

// eslint-disable-next-line no-unused-vars
const DEBUG = debug("dev");
module.exports = {
	authenticate: (req, res, next) => {
		passportJWT.authenticate("jwt", { session: false }, (err, user, info) => {
	console.log("josuhwa here",{err, user, info})
			if (err) {
				return next(err);
			} else if (!user) {
				return res.status(401).json({
					status: 0,
					message: "invalid token, please log in or sign up",
				});
			} else {
				req.user = user;
				return next();
			}
		})(req, res, next);
	},
};
