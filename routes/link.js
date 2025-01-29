const express = require("express");
const router = express.Router();
const linkController = require("../controllers/linkController");
const handleValidationError = require("../config/handleValidationErrors");
const authMiddleware = require("../middlewares/authMiddleware");

//Get Routes
router.get("/getAll", authMiddleware, linkController.getAll);
router.get("/:hash", linkController.getLink);

// Post Routes
router.post("/", authMiddleware, linkController.generateLink);

// Put Routes
router.put("/:id", authMiddleware, linkController.updateLink);

// Delete Routes
router.delete("/:id", authMiddleware, linkController.deleteLink);

module.exports = router;
