const Links = require("../models/links");
const User = require("../models/user");
const Analytics = require("../models/analytics");

const getDashboard = async (req, res) => {
  try {
    const user = req.user;

    const userLinks = await Links.find({ createdBy: user.id });
    let totalClicks = 0;
    userLinks.forEach((link) => {
      totalClicks += link.clickCount;
    });
    const analytics = await Analytics.find({
      linkId: { $in: userLinks.map((link) => link._id) },
    }).sort({ timestamp: -1 });

    const dateWiseClicks = analytics.reduce((acc, curr) => {
      const date = new Date(curr.timestamp).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    let maxDateWiseClicks = 0;

    const transformedDateWiseClicks = Object.entries(dateWiseClicks).map(
      ([date, clicks]) => {
        if (clicks > maxDateWiseClicks) {
          maxDateWiseClicks = clicks;
        }
        return { date, clicks };
      }
    );

    const deviceWiseClicks = analytics.reduce((acc, curr) => {
      acc[curr.deviceInfo] = (acc[curr.deviceInfo] || 0) + 1;
      return acc;
    }, {});

    let maxDeviceWiseClicks = 0;

    const transformedDeviceWiseClicks = Object.entries(deviceWiseClicks).map(
      ([device, clicks]) => {
        if (clicks > maxDeviceWiseClicks) {
          maxDeviceWiseClicks = clicks;
        }
        return { device, clicks };
      }
    );

    res.status(200).json({
      success: true,
      dateWiseClicks: transformedDateWiseClicks,
      maxDateWiseClicks,
      maxDeviceWiseClicks,
      deviceWiseClicks: transformedDeviceWiseClicks,
      totalClicks,
      message: "OK",
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

module.exports = {
  getDashboard,
};
