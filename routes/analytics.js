const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analytics");
const handleValidationError = require("../config/handleValidationErrors");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, analyticsController.getAnalytics);

module.exports = router;
