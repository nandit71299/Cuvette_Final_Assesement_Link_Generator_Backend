const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { registerValidator, loginValidator } = require("../validators/auth");
const handleValidationError = require("../config/handleValidationErrors");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/login",
  loginValidator,
  handleValidationError,
  authController.login
);
router.post(
  "/register",
  registerValidator,
  handleValidationError,
  authController.register
);

router.post("/verify", authMiddleware, authController.verification);

module.exports = router;
