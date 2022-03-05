var FCM = require("fcm-node");
var serverKey =
	"AAAAfXPFg6I:APA91bHrhhwGGwHmKm8Aq2t64tNES-f0i_uHNg9qHiBxn_ZkOuBDUDGQ3KueoGZjFyZAlRkjQAQJwSFVp8F1WVf7zQA8UHKP4ihZLHSh6S0ndQSNae3xYlrj5_pyrw25q4UGgJADqtKR"; //put your server key here
var fcm = new FCM(serverKey);

const push_notification = (notification_obj) => {
	var message = {
		//this may vary according to the message type (single recipient, multicast, topic, et cetera)
		to: notification_obj.user_device_token,
		collapse_key: "your_collapse_key",

		notification: {
			title: notification_obj.sender_text,
			body: notification_obj.heading,
		},

		data: {
			//you can send only notification or only data(or include both)
			title: notification_obj.sender_text,
			body: notification_obj.heading,
		},
	};

	fcm.send(message, function (err, response) {
		if (err) {
			console.log("Something has gone wrong!");
		} else {
			console.log("Successfully sent with response: ", response);
		}
	});
};

module.exports = push_notification;
