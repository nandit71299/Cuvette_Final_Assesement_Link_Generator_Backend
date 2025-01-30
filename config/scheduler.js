const schedule = require("node-schedule");
const Links = require("../models/links");

const markExpiredLinksAsInactive = async () => {
  try {
    const currentDate = new Date();

    const expiredLinks = await Links.find({
      linkExpiration: { $lt: currentDate },
      isActive: true,
    });

    if (expiredLinks.length > 0) {
      await Links.updateMany(
        { _id: { $in: expiredLinks.map((link) => link._id) } },
        { $set: { isActive: false } }
      );
      console.log(`Marked ${expiredLinks.length} links as inactive.`);
    } else {
      console.log("No expired links found.");
    }
  } catch (error) {
    console.error("Error while marking expired links as inactive:", error);
  }
};

// Schedule the job to run every day at midnight (you can adjust the time)
const job = schedule.scheduleJob("* * * * *", () => {
  console.log("Running scheduled job to check expired links...");
  markExpiredLinksAsInactive();
});

// Optional: For testing purposes, you can manually run the job once by calling the function
// markExpiredLinksAsInactive(); // Uncomment if you want to manually trigger the function
