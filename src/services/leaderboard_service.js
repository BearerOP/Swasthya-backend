const user_model = require("../models/user_model");
const step_model = require("../models/step_model");

exports.overall = async (req) => {
  try {
    const user = req.user;
    if (!user) {
      return {
        success: false,
        message: "User not found!",
      };
    }

    const dateString = req.body.date;
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);

    const allUsers = await user_model.find({});
    if (!allUsers || allUsers.length === 0) {
      return {
        success: false,
        message: "Users not found!",
      };
    }

    const leaderboard = [];

    for (const user of allUsers) {
      const { _id, username } = user;

      const steps = await step_model.find({
        user_id: _id,
        "record.date": { $lte: date }, // Change to less than or equal to date
      });

      let totalSteps = 0;
      let totalCalories = 0;
      for (const stepRecord of steps) {
        for (const record of stepRecord.record) {
          const recordDate = new Date(record.date);
          if (recordDate.toDateString() === date.toDateString()) {
            totalSteps += record.steps;
            totalCalories += record.calories;
          }
        }
      }

      leaderboard.push({
        user_id: _id,
        username,
        totalSteps,
        totalCalories,
      });
    }

    // Sort the leaderboard by totalSteps in descending order
    leaderboard.sort((a, b) => b.totalSteps - a.totalSteps);

    return {
      success: true,
      message: "Overall leaderboard fetched successfully!",
      data:leaderboard,
    };
  } catch (error) {
    console.error("Error fetching overall leaderboard:", error);
    return {
      success: false,
      message: "Error fetching overall leaderboard",
      error: error.message,
    };
  }
};
