// eslint-disable-next-line prettier/prettier
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
	service: "appsstaging",
	host: "mail.myprojectstaging.com",
	port: 465,
	secure: true,
	auth: {
		user: "noreply@myprojectstaging.com",
		pass: "Technado@1234",
	},
});
const sendOTPMail = async (otp, to) => {
	try {
		// send mail with defined transport object

		const mailOptions = {
			from: "noreply@myprojectstaging.com", // sender address
			to, // list of receivers
			subject: "Freight Service OTP", // Subject line
			text: "Your Freight Service OTP is here", // Subject line
			html: `<p>Your Verification Code is ${otp} </p>`, // plain text body
		};
		const isMailSent = await transporter.sendMail(mailOptions);
		return isMailSent;
	} catch (error) {
		console.error(500, error);
	}
};

const sendResetPasswordOTP = async (email, otp) => {
	try {
		console.log(email, otp, "data to recover pass");
		const mailOptions = {
			to: email,
			from: "noreply@myprojectstaging.com",
			subject: "Password change request",
			text: `Hello ${email}, we heard you lost your password. You can recover with this otp: ${otp}`,
		};
		const isMailSent = await transporter.sendMail(mailOptions);
		return isMailSent;
	} catch (error) {
		console.error(400, error, error.message);
	}
};

const sendUserCredentials = async (email, userDetails) => {
	try {
		console.log(email, userDetails, "user Details");
		const mailOptions = {
			to: email,
			from: "noreply@myprojectstaging.com",
			subject: "Account creation request",
			text: `Hello ${email}, your account has been registered with Freight Service, Following are the details: 
      userName: ${userDetails.username}
      email: ${userDetails.email}
      password: ${userDetails.defaultPassword}
      `,
		};
		const isMailSent = await transporter.sendMail(mailOptions);
		console.log(isMailSent);
		return isMailSent;
	} catch (error) {
		console.error(400, error, error.message);
	}
};

module.exports = {
	sendOTPMail,
	sendResetPasswordOTP,
	sendUserCredentials,
};
