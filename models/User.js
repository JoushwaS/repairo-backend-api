const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const validator = require("validator");
const crypto = require("crypto");
const { roles } = require("../config/roles.config");
const otpGenerator = require("../helpers/otpGenerator.helper");
dotenv.config();

const jwtKey = process.env.JWT_KEY;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Must be a Valid email",
      },
      lowercase: true,
      unique: true,
      // required: [true, "Email can't be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },

    phoneNumber: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      // required: true,
    },
    age: {
      type: Number,
      // required: true,
    },
    gender: {
      type: String,
      // required: true,
      enum: ["male", "female"],
    },

    isOTPVerified: {
      type: Boolean,
      default: false,
      required: false,
    },

    OTP: {
      type: String,
      required: false,
    },
    locations: {
      type: { type: String, default: "Point", enum: ["Point"] },
      coordinates: [Number],
      title: String,
    },

    role: {
      type: String,
      enum: roles,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    isCustomerLocationAdded: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isAccountInUse: {
      type: Boolean,
      default: false,
    },

    user_device_type: {
      type: String,
      require: false,
      trim: true,
      default: null,
    },
    user_device_token: {
      type: String,
      require: false,
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) return next;

  this.password = await bcrypt.hash(
    this.password,
    parseInt(process.env.HASH, 10)
  );
  next();
});

UserSchema.methods.toJSON = function () {
  const user = this;

  const userObj = user.toObject();

  userObj.id = userObj._id; // remap _id to id
  delete userObj._id;
  delete userObj.password;
  delete userObj.__v;
  return userObj;
};

UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateVerificationToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    jwtKey,
    {
      expiresIn: "10d",
      // algorithm: 'RS256', // use this if set public and private keys
    }
  );
};

UserSchema.methods.generatePasswordResetToken = async function () {
  this.resetPasswordToken = await crypto.randomBytes(20).toString("hex");
  this.resetPasswordExpires = Date.now() + 3600000; // expires in an hour
};

UserSchema.methods.generatePasswordResetOTP = async function () {
  const otp = otpGenerator();
  console.log(otp);
  this.resetPasswordOTP = otp;
  this.resetPasswordOTPExpires = Date.now() + 1800000; // expires in an hald hour
};

UserSchema.statics.checkExistingField = async function (field, value) {
  const user = this;

  return user.findOne({ [`${field}`]: value });
};

module.exports = mongoose.model("User", UserSchema, "Users");
