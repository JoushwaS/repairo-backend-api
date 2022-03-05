const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();
const v1Routes = require("./routes/index.route");
const cors = require("cors");
const connect = require("./db/db");
const mongoDbConfig = require("./config/mongodb.config");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 8000;

/**
 * Call the MongoDB connection based on the NODE_ENV setting
 * and return info about db name
 */
// connect();
console.log("process.env.NODE_ENV", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
	mongoDbConfig.MongoDB().catch((err) => console.log(err));
} else {
	mongoDbConfig.MongoDBTest().catch((err) => console.log(err));
}

app.use(express.json());
app.use(passport.initialize());
app.use("/api/v1/", v1Routes);
/*
 * CORS policy configuration
 */
app.use(
	cors({
		origin: process.env.CLIENT_URL || "*", // allow CORS
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true, // allow session cookie from browser to pass through
	})
);

app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
	console.log("Server up on Port ", PORT);
});
