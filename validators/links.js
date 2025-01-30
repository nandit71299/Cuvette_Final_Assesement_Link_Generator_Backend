const { body } = require("express-validator");

const createEditLinkValidator = [
  body("originalUrl").isURL().withMessage("Invalid URL"),
  body("remarks").notEmpty().trim().withMessage("Remarks are mandatory"),
  body("expirationDate")
    .optional({ nullable: true }) // Allows null as a valid value
    .isDate()
    .custom((date) => {
      return new Date(date) > new Date();
    })
    .withMessage("Invalid date, must be a valid and future date")
    .toDate(), // Optionally, you could convert it to a Date object for further use
];

module.exports = {
  createEditLinkValidator,
};
