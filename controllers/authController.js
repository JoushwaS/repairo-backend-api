const passport = require("passport");
const debug = require("debug");
require("../services/passport/passport-local.service");
const User = require("../models/User");

const otpGeneratorObj = require("../helpers/otpGenerator.helper");
const {
  sendResetPasswordOTP,
  sendOTPMail,
} = require("../services/email/sendEmail");

const stripe = require("stripe")(process.env.STRIPE_KEY);

const dayjs = require("dayjs");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");

dayjs.extend(isSameOrBefore);

const otpGenerator = otpGeneratorObj;
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
const createCookieFromToken = (user, statusCode, req, res, message) => {
  const token = user.generateVerificationToken();

  res.status(statusCode).json({
    status: 1,
    message,
    token,
    data: {
      user,
    },
  });
};

module.exports = {
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
              message,
              error: {},
            });
          }
          // generate a signed json web token with the contents of user
          // object and return it in the response
          createCookieFromToken(user, 200, req, res);
        } catch (error) {
          DEBUG(error);
          console.error(500, error);
        }
      }
    )(req, res, next);
  },

  /**
   * Login controller
   * @param req
   * @param res
   * @param next
   */
  login: async (req, res, next) => {
    passport.authenticate(
      "login",
      { session: false },
      async (err, user, info) => {
        try {
          console.log(info);
          if (err || !user) {
            let message = err;
            if (info) {
              message = info;
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
          createCookieFromToken(user, 200, req, res, info.message);
        } catch (error) {
          DEBUG(error);
          console.error(500, error);
        }
      }
    )(req, res, next);
  },

  /**
   * Sign Up Controller
   * @param req
   * @param res
   * @return {Promise<*>}
   */

  addUserInfo: async (req, res, next) => {
    passport.authenticate(
      "addUserInfo",
      { session: false },
      async (err, user, info) => {
        try {
          if (err || !user) {
            const { statusCode = 400, message } = info;
            return res.status(statusCode).json({
              status: "error",
              error: {
                message,
              },
            });
          }
          // const otp = otpGenerator();
          // const otpExpiration = dayjs().add(30, "minute").format();
          // const otpObj = {
          //   otp,
          //   otpExpiration,
          // };
          //   const {
          // 	default: { sendOTPMail },
          //   } = await import('../services/email/sendEmail');
          //   // SEND EMAIL ASYNC AND DOES NOT HOLD THE PROCESS | CATCH ERROR AND LOG TO THE FILE | DON'T STOP PROCESS
          //   sendOTPMail(otp, user.email)
          // 	.then((mailResponse) => {
          // 	  console.log(mailResponse);
          // 	})
          // 	.catch((error) => {
          // 	  console.log(error, 'error in calling');
          // 	});
          //   await User.findOneAndUpdate({ _id: user._id }, otpObj, { new: true });
          //   const newCustomer	 = new Customer();
          //   newCustomer.user = user._id;

          //   const stripeCustomer = await stripe.customers.create({
          // 	description: 'New Customer Created',
          //   });
          //   console.log(stripeCustomer, 'stripe obj');
          //   newCustomer.stripeId = stripeCustomer.id;
          //   newCustomer.save();

          res.status(200).json({
            status: "success",
            message: "Sign Up Successful",
            data: { user },
          });
          createCookieFromToken(user, 201, req, res);
        } catch (error) {
          DEBUG(error);
          console.log(error.response);
          res.status(500).json({
            status: 0,
            message: "Sign Up failed!",
            error: { error },
          });
          //   throw new ApplicationError(500, error);
        }
      }
    )(req, res, next);
  },

  /**
   * Logout controller that delete cookie named jwt
   * @param req
   * @param res
   * @return {Promise<*>}
   */
  logout: async (req, res) => {
    try {
      await req.session.destroy();
      await res.clearCookie("jwt");
      return res.status(200).json({
        status: 1,
        message: "You have successfully logged out",
      });
    } catch (error) {
      DEBUG(error);
      console.error(500, error);
    }
  },
  /**
   * Request a password recovery and
   * send an email with a token to use in
   * the resetPassword Controller
   * @param req
   * @param res
   * @return {Promise<*>}
   */
  recoverPassword: async (req, res) => {
    try {
      // Destroy session and remove any cookie
      // await req.session.destroy();
      // await res.clearCookie('jwt');

      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          status: 0,
          error: {
            status: 0,
            message: "User not found",
          },
        });
      }
      console.log("test1");
      // Generate and set password reset token
      await user.generatePasswordResetOTP();
      console.log("test2");

      // Save the updated user object with a resetPasswordToken and expire
      await user.save();
      console.log("test3");

      // Send email to the user with the otp

      console.log("test4");
      sendResetPasswordOTP(user.email, user.resetPasswordOTP)
        .then(() => {
          res.status(200).json({
            status: 1,
            message: `A reset email has been sent to ${user.email}.`,
          });
        })
        .catch((error) => {
          return res.status(400).json({
            status: 0,
            error: {
              message: "error sending mail",
              data: { error },
            },
          });
        });
    } catch (error) {
      DEBUG(error);
      console.error(error);
    }
  },
  /**
   * Reset password controller
   * @param req
   * @param res
   * @param next
   * @return {Promise<void>}
   */
  resetPassword: async (req, res, next) => {
    passport.authenticate(
      "reset-password",
      { session: false },
      async (err, user, info) => {
        try {
          if (err || !user) {
            let message = err;
            if (info) {
              message = info.message;
            }
            return res.status(400).json({
              status: 0,
              error: {
                message,
              },
            });
          }

          res.status(200).json({
            status: 1,
            message: "Password successfully updated",
          });
        } catch (error) {
          DEBUG(error);
          console.error(500, error);
        }
      }
    )(req, res, next);
  },

  /**
   * generate OTP
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  generateOtp: async (req, res) => {
    const { email } = req.body;
    try {
      if (!email) {
        return res.status(400).json({
          status: 0,
          error: {
            message: "email not found",
          },
        });
      }
      User.findOne({ email })
        .then(async (user) => {
          if (!user) {
            return res.status(400).json({
              status: 0,
              error: {
                message: "user not found",
              },
            });
          }
          const otp = otpGeneratorObj();
          const otpExpiration = dayjs().add(30, "minute").format();
          const otpObj = {
            otp,
            otpExpiration,
          };
          console.log("otpObj >>", otpObj);
          // const {
          // 	default: { sendOTPMail },
          // } = await import("../services/email/sendEmail");
          // const isMailSent = await sendOTPMail(otp, email);
          sendOTPMail(otp, email)
            .then(async (mailResponse) => {
              console.log("mailResponse>>>>", mailResponse);
              await User.findOneAndUpdate({ _id: user._id }, otpObj, {
                new: true,
              });
              return res.json({
                success: true,
                message: mailResponse,
              });
            })
            .catch((error) => {
              return res.status(400).json({
                status: 0,
                error: {
                  message: "error sending mail",
                  data: { error },
                },
              });
            });
        })
        .catch((error) => {
          console.error(500, error);
        });
    } catch (error) {
      console.error(500, error);
    }
  },
  /**
   * verify OTP
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  verifyOtp: async (req, res) => {
    const { otp, email } = req.body;
    try {
      if (!email) {
        return res.status(400).json({
          status: 0,
          error: {
            message: "email not found",
          },
        });
      } else if (!otp) {
        return res.status(400).json({
          status: 0,
          error: {
            message: "otp not found",
          },
        });
      }
      User.findOne({ email }).then((user) => {
        if (!user) {
          return res.status(400).json({
            status: 0,
            error: {
              message: "user not found",
            },
          });
        }
        if (user.resetPasswordOTP != null) {
          // console.log(dayjs());
          // console.log(dayjs(user.resetPasswordOTPExpires));
          const isExpired = !dayjs().isSameOrBefore(
            dayjs(user.resetPasswordOTPExpires)
          );
          if (isExpired) {
            return res.status(400).json({
              status: 0,
              error: {
                message: "otp is expired",
              },
            });
          }
        }
        const resetPassOTP = parseInt(user.resetPasswordOTP);

        if (resetPassOTP !== otp) {
          return res.status(400).json({
            status: 0,
            message: "otp is invalid",
          });
        } else {
          // eslint-disable-next-line no-param-reassign
          user.isVerified = true;
          user.save();
          return res.json({
            status: 1,
            message: "OTP is verified",
          });
        }
      });
    } catch (error) {
      console.error(500, error);
    }
  },
  /**
   * Protected router test
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  protectedRoute: async (req, res) => {
    res.status(200).json({
      status: 1,
      data: {
        message: "Yes you are. You are a Thor-n times developer",
      },
    });
  },

  isAuthSucessful: async (req, res) => {
    try {
      const { otp, phoneNumber, isOtpVerified } = req.body;
      const isUserPresent = await User.findOne({ phoneNumber: phoneNumber });

      if (isUserPresent) {
        if (isUserPresent.isProfileCompleted) {
          await User.findOneAndUpdate(
            { phoneNumber: phoneNumber },
            { isOTPVerified: true, OTP: otp }
          );
          return res.status(200).json({
            status: 1,
            message: "Authentication  Successful !",
            data: { User: isUserPresent },
          });
        } else if (isUserPresent.isProfileCompleted) {
          return res.status(200).json({
            status: 1,
            message:
              "Authentication  Successful,Please Complete Your Profile !",
            data: { User: {}, isProfileCompleted: false },
          });
        }
      } else {
        const newUser = new User();
        newUser.phoneNumber = phoneNumber;
        await newUser.save();
        return res.status(200).json({
          status: 1,
          message: "Authentication  Successful,Please Complete Your Profile !",
          data: { User: {}, isProfileCompleted: false },
        });
      }

      // return;
      // res.status(200).json({
      //   status: 1,
      //   message: "Authentication  Successful",
      //   data: { newPost },
      // });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: 0,
        message: "Post Creation Failed!",
        error: { error },
      });
    }
  },
};
