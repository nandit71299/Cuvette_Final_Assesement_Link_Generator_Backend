const Links = require("../models/links");
const Analytics = require("../models/analytics");

const getAnalytics = async (req, res) => {
  try {
    const user = req.user;

    // First, find all the links created by the user
    const links = await Links.find({ createdBy: user.id });

    // Now, find all analytics data where the linkId is in the user's links
    const analytics = await Analytics.find({
      linkId: { $in: links.map((link) => link._id) }, // We use _id to match the linkId in Analytics
    })
      .populate("linkId", "originalUrl linkHash") // Populate the linkId field from the Links model
      .exec();

    // Return both links and their associated analytics
    res.status(200).json({ success: true, analytics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getAnalytics,
};
