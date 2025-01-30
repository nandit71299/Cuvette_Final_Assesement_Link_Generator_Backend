const express = require("express");
const authRoutes = require("./auth");
const linkRoutes = require("./link");
const dashboardRoutes = require("./dashboard");
const analyticsRoutes = require("./analytics");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/links", linkRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/analytics", analyticsRoutes);

module.exports = router;
