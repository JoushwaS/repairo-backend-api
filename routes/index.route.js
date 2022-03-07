const express = require("express");
const _ = require("lodash");

const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const serviceRoutes = require("./serviceRoutes");
const adminRoutes = require("./adminRoutes");
const postRoutes = require("./postRoutes");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/service",
    route: serviceRoutes,
  },
  {
    path: "/admin",
    route: adminRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/post",
    route: postRoutes,
  },
];

_.forEach(defaultRoutes, (route) => {
  router.use(route.path, route.route);
});

module.exports = router;
