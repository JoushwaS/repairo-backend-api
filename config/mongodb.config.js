const debug = require("debug");
const mongoose = require("mongoose");

mongoose.connection.on("connected", () => {
	console.log("MongoDB Connection Established");
});

mongoose.connection.on("reconnected", () => {
	console.log("MongoDB Connection Reestablished");
});

mongoose.connection.on("disconnected", () => {
	console.log("MongoDB Connection Disconnected");
});

mongoose.connection.on("close", () => {
	console.log("MongoDB Connection Closed");
});

mongoose.connection.on("error", (error) => {
	console.log(`MongoDB ERROR: ${error}`);

	process.exit(1);
});

const DEBUG = debug("dev");

module.exports = {
	MongoDB: async () => {
		try {
			console.log("Live Mongo Db Running..");
			await mongoose.connect(process.env.MONGO_URI);
			console.info(`Connected to db: ${mongoose.connection.name}`);
		} catch (error) {
			DEBUG(error);
			throw new Error(error.message);
		}
	},
	MongoDBTest: async () => {
		try {
			await mongoose.connect(process.env.MONGO_URI_TEST);
			console.info(`Connected to db: ${mongoose.connection.name}`);
		} catch (error) {
			DEBUG(error);
			throw new Error(error.message);
		}
	},
};
