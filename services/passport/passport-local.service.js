const passport = require("passport");
const { Strategy } = require("passport-local");
const debug = require("debug");
const User = require("../../models/User.js");

const DEBUG = debug("dev");

const authFields = {
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true,
};

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findOne({ _id: id }, (err, user) => {
    done(null, user);
  });
});

passport.use(
  "login",
  new Strategy(authFields, async (req, email, password, cb) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user || !user.password) {
        return cb(null, false, { message: "Incorrect email or password." });
      }
      // if (user.role !== "dealer") {
      // 	console.log("here");
      // 	return cb(null, false, "User Not Allowed");
      // }
      const checkPassword = await user.comparePassword(password);

      if (!checkPassword) {
        return cb(null, false, { message: "Incorrect email or password." });
      }
      user.isAccountInUse = true;
      await user.save();

      return cb(null, user, { message: "Logged In Successfully" });
    } catch (err) {
      DEBUG(err);
      return cb(null, false, { statusCode: 400, message: err.message });
    }
  })
);

passport.use(
  "adminLogin",
  new Strategy(authFields, async (req, email, password, cb) => {
    try {
      const user = await User.findOne({
        email: email,
      });

      if (!user || !user.password) {
        return cb(null, false, { message: "Incorrect email or password." });
      }
      console.info("user.role>>>>>>", user);
      // const checkIfAdmin = user.role === "superAdmin" || user.role === "admin";
      const checkIfAdmin = user.role === "admin";
      if (!checkIfAdmin) {
        return cb(null, false, {
          message: "You need to be admin in order to hit this route",
        });
      }

      const checkPassword = await user.comparePassword(password);

      if (!checkPassword) {
        return cb(null, false, { message: "Incorrect email or password." });
      }
      return cb(null, user, { message: "Logged In Successfully" });
    } catch (err) {
      DEBUG(err);
      return cb(null, false, { statusCode: 400, message: err.message });
    }
  })
);

passport.use(
  "addUserInfo",
  new Strategy(authFields, async (req, email, cb) => {
    try {
      const {
        email,

        fullName,
        phoneNumber,
        // role,
        gender,
        age,

        user_device_token,
        user_device_type,
      } = req.body;
      const checkEmail = await User.checkExistingField("email", email);
      //   if (role === "admin") {
      //     return cb(null, false, {
      //       statusCode: 409,
      //       message: "Operation Not Allowed",
      //     });
      //   }

      if (checkEmail) {
        return cb(null, false, {
          statusCode: 409,
          message: "Email already registered, Please Enter Different Email!",
        });
      }

      // await sendUserCredentials(email, newUser);
      const user = await User.findOneAndUpdate(
        { phoneNumber: phoneNumber },
        {
          email: email,
          fullName: fullName,
          gender: gender,
          age: age,
          isProfileCompleted: true,
        }
      );

      res.status(200).json({
        status: "success",
        message: "Registration Sucessfull",
        data: { user },
      });
      // console.log("newUserResult>>>>>>>>>",newUserResult)
      return cb(null, user);
    } catch (err) {
      DEBUG(err);
      res.status(400).json({
        status: 0,
        message: "Registration failed",
        error: { err },
      });
      console.error(err);
      // return cb(null, false, { statusCode: 400, message: err.message });
    }
  })
);

/**
 * The password Reset method is with a token generated
 */
passport.use(
  "reset-password",
  new Strategy(authFields, async (req, email, password, cb) => {
    try {
      /**
       * Deprecated in favour of password reset with token
       * @type {*}
       */
      const isUser = await User.findOne({
        $or: [{ email }, { username: email }],
      });
      if (!isUser) {
        return cb(null, false, {
          message: "No account with this email found.",
        });
      }
      // const checkPassword = await user.comparePassword(password);
      //
      // if (!checkPassword) {
      //   return cb(null, false, {
      //     message: 'Old password is incorrect.',
      //   });
      // }
      const { otp } = await req.body;

      const user = await User.findOne({
        resetPasswordOTP: otp,
        resetPasswordOTPExpires: { $gt: Date.now() },
      });

      if (!user) {
        return cb(null, false, {
          message: "Password reset otp is invalid or has expired.",
        });
      }

      user.password = password;
      user.resetPasswordOTP = undefined;
      user.resetPasswordOTPExpires = undefined;

      await user.save();

      return cb(null, user, { message: "Password Changed Successfully" });
    } catch (err) {
      DEBUG(err);
      return cb(null, false, { statusCode: 400, message: err.message });
    }
  })
);
