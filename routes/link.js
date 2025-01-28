const express = require("express");
const router = express.Router();
const linkController = require("../controllers/linkController");
const handleValidationError = require("../config/handleValidationErrors");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, linkController.generateLink);
router.get("/:hash", linkController.getLink);

module.exports = router;
