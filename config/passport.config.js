/**
 * Passport configuration file
 */
const passport = require("passport");
const { ExtractJwt, Strategy } = require("passport-jwt");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

// const jwtPublicSecret = process.env.JWT_PUBLIC_SECRET.replace(/\\n/g, '\n');

if (!process.env.JWT_KEY) {
	console.error(404, "Please provide a JWT_KEY as global environment variable");
}
const jwtKey = process.env.JWT_KEY;

/**
 * Extract the jwt token =require a custom Cookie Extractor function which
 * extracts the token =require a named token and =require a Bearer Token
 * @param req
 * @return {null}
 */
const cookieExtractor = (req) => {
	let token = null;
	if (req && req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	return token;
};

const options = {
	secretOrKey: jwtKey,
	passReqToCallback: true,
};

options.jwtFromRequest = ExtractJwt.fromExtractors([
	ExtractJwt.fromAuthHeaderAsBearerToken(),
	(req) => cookieExtractor(req),
]);

passport.use(
	new Strategy(options, (req, jwtPayload, done) => {
		User.findOne({ _id: jwtPayload.id })
			.then((user) => {
				if (user) {
					// eslint-disable-next-line no-param-reassign
					delete user.password;
					done(null, user);
				} else {
					done(null, false);
				}
			})
			.catch((err) => {
				if (err) {
					return done(err, false);
				}
			});
	})
);

module.exports = passport;
