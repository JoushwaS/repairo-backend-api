const express = require("express");
const _ = require("lodash");

const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");

const adminRoutes = require("./adminRoutes");



const router = express.Router();

const defaultRoutes = [
	{
		path: "/users",
		route: userRoutes,
	},

	{
		path: "/admin",
		route: adminRoutes,
	},
	{
		path: "/auth",
		route: authRoutes,
	},

];

_.forEach(defaultRoutes, (route) => {
	router.use(route.path, route.route);
});

module.exports = router;
