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
        .json({ success: false, message: "Link has expired" });
    }

    await Analytics.create({
      linkId: link._id,
      ipAddress: req.ip,
      deviceInfo: Os.type(),
      timestamp: new Date().toLocaleDateString(),
    });

    link.clickCount += 1;

    await link.save();
    res.redirect(301, link.originalUrl);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAll = async (req, res) => {
  try {
    const user = req.user;

    const links = await Links.find({ createdBy: user.id });
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

    const link = await Links.findOne({ _id: id, createdBy: user.id });
    if (!link) {
      return res
        .status(404)
        .json({ success: false, message: "Link not found" });
    }

    link.originalUrl = originalUrl;
    link.remarks = remarks;
    link.expirationDate = expirationDate;

    await link.save();
    res.json({ success: true, message: "Link updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { generateLink, getLink, getAll, deleteLink, updateLink };
