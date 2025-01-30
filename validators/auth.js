const { body } = require("express-validator");

const registerValidator = [
  body("name").notEmpty().trim().withMessage("name is required"),
  body("email").notEmpty().trim().isEmail().withMessage("email is required"),
  body("mobile")
    .notEmpty()
    .trim()
    .isMobilePhone("en-IN")
    .withMessage(
      "mobile number is required and must be a valid 10-digit mobile number"
    ),
  body("password")
    .notEmpty()
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginValidator = [
  body("email").notEmpty().trim().isEmail().withMessage("email is required"),
  body("password")
    .notEmpty()
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const updateValidator = [
  body("name").notEmpty().trim().withMessage("name is required"),
  body("email").notEmpty().trim().isEmail().withMessage("email is required"),
  body("mobile")
    .notEmpty()
    .trim()
    .isMobilePhone("en-IN")
    .withMessage(
      "mobile number is required and must be a valid 10-digit mobile number"
    ),
];

module.exports = {
  registerValidator,
  loginValidator,
  updateValidator,
};
