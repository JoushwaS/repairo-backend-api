const { roleRights } = require("../config/roles.config");
const { ApplicationError } = require("../helpers/errors.helper");

const verifyRights =
	(...requiredRights) =>
	(req, res, next) => {
		if (requiredRights?.length) {
			const userRights = roleRights.get(req.user?.role);

			const hasRequiredRights = requiredRights.every((requiredRight) =>
				userRights.includes(requiredRight)
			);

			console.log(req.user.id, "user ID");
			if (!hasRequiredRights && req.params.userId !== req.user.id) {
				return res.status(401).json({
					status: 0,
					message: "You are not authorized to use this endpoint",
				});
			}
		}
		next();
	};
module.exports = verifyRights;
