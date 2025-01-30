const User = require("../models/user");
const Links = require("../models/links");
const Analytics = require("../models/analytics");
const generateHash = require("../utils/generateHash");
const dotenv = require("dotenv");
const Os = require("os");
dotenv.config();

const generateLink = async (req, res) => {
  try {
    const { originalUrl, remarks, expirationDate } = req.body;
    const user = req.user;
    const hash = await generateHash();
    const link = new Links({
      originalUrl: originalUrl,
      linkHash: hash,
      remarks,
      expirationDate,
      createdBy: user.id,
    });
    await link.save();
    res.status(201).json({ success: true, data: link });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getLink = async (req, res) => {
  try {
    const { hash } = req.params;
    const link = await Links.findOne({ linkHash: hash });

    if (!link) {
      return res
        .status(404)
        .json({ success: false, message: "Link not found" });
    }

    if (link.linkExpiration && link.linkExpiration < new Date()) {
      return res
        .status(403)
        .json({ success: false, message: "Link has expired or is expired" });
    }

    await Analytics.create({
      linkId: link._id,
      ipAddress: req.ip,
      deviceInfo: Os.type(),
      timestamp: new Date().toLocaleDateString(),
    });

    link.clickCount += 1;

    await link.save();
    res.json({ success: true, link: link.originalUrl });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAll = async (req, res) => {
  try {
    const user = req.user;

    // Query for all links created by the current user
    const links = await Links.find({ createdBy: user.id });

    // Get the current date and time for comparison
    const currentDate = new Date();

    // Initialize an array to store the expired link ids
    const expiredLinkIds = [];

    // Check each link's expiration date
    links.forEach(async (link) => {
      if (
        link.linkExpiration &&
        link.linkExpiration < currentDate &&
        link.isActive
      ) {
        // If the link has expired and is still active, mark it as inactive
        link.isActive = false;

        // Push the link id to the expiredLinkIds array to save all updates at once
        expiredLinkIds.push(link._id);

        // Save the link
        await link.save();
      }
    });

    // Optionally, you can log the expired links
    console.log(`Marked ${expiredLinkIds.length} links as inactive.`);

    // Send the response with the links (including any updates)
    res.json({ success: true, data: links });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteLink = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const link = await Links.findOne({ _id: id, createdBy: user.id });
    if (!link) {
      return res
        .status(404)
        .json({ success: false, message: "Link not found" });
    }
    await Links.deleteOne({ _id: link._id, createdBy: user.id });
    res.json({ success: true, message: "Link deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateLink = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const { originalUrl, remarks, expirationDate } = req.body;

    // Ensure expirationDate is a valid Date
    const expirationDateObject = expirationDate
      ? new Date(expirationDate)
      : null;

    // Check if expirationDate is in the past
    if (expirationDateObject && expirationDateObject < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Expiration date cannot be in the past.",
      });
    }

    // Find the link by ID and createdBy user
    const link = await Links.findOne({ _id: id, createdBy: user.id });
    if (!link) {
      return res
        .status(404)
        .json({ success: false, message: "Link not found" });
    }

    // Update link properties
    link.originalUrl = originalUrl || link.originalUrl; // Only update if new value is provided
    link.remarks = remarks || link.remarks; // Only update if new value is provided
    link.linkExpiration = expirationDateObject || link.linkExpiration; // Update expiration date if provided

    // Set isActive to true if expirationDate is in the future
    if (expirationDateObject && expirationDateObject > new Date()) {
      link.isActive = true;
    } else if (!expirationDateObject) {
      link.isActive = true; // If no expiration date is set, the link is active
    } else {
      link.isActive = false; // If the expiration date is in the past, make it inactive
    }

    // Save the updated link
    await link.save();

    res.json({
      success: true,
      message: "Link updated successfully",
      data: link, // Optionally return the updated link
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { generateLink, getLink, getAll, deleteLink, updateLink };
