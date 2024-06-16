const user_model = require("../models/user_model");
const step_model = require("../models/step_model");

exports.overall = async (req, res) => {
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
            totalCalories += record.caloriesBurned;
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
      data: leaderboard,
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

exports.relatives = async (req, res) => {
  try {
    const user = req.user; // Assuming req.user is properly populated by middleware
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    const dateString = req.body.date;
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);

    // Fetch relatives of the current user
    const relatives = await user_model.find({
      relatives: user._id,
    });

    const leaderboard = [];

    for (const relative of relatives) {
      // Query steps records for each relative for the specified date
      const steps = await step_model.find({
        user_id: relative._id,
        "record.date": {
          $gte: date,
          $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000),
        },
      });

      let totalSteps = 0;
      let totalCalories = 0;

      for (const stepRecord of steps) {
        for (const record of stepRecord.record) {
          const recordDate = new Date(record.date);
          if (recordDate.toDateString() === date.toDateString()) {
            totalSteps += record.steps;
            totalCalories += record.caloriesBurned;
          }
        }
      }

      leaderboard.push({
        _id: relative._id,
        username: relative.username,
        steps: totalSteps,
        caloriesBurned: totalCalories,
      });
    }
    let userStepData = await step_model.findOne({
      user_id: user._id,
      "record.date": {
        $gte: date,
        $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000),
      },
    });
    if (userStepData) {
      leaderboard.push({
        _id: user._id,
        username: user.username,
        steps: userStepData.record[0].steps,
        caloriesBurned: userStepData.record[0].caloriesBurned,
      });
    } else {
      leaderboard.push({
        _id: user._id,
        username: user.username,
        steps: 0,
        caloriesBurned: 0,
      });
    }

    // Sort the leaderboard by steps in descending order
    leaderboard.sort((a, b) => b.steps - a.steps);

    return {
      success: true,
      data: leaderboard,
      message: "Relatives leaderboard fetched successfully!",
    };
  } catch (error) {
    console.error("Error fetching relatives leaderboard:", error);
    return {
      success: false,
      message: "Error fetching relatives leaderboard",
      error: error.message,
    };
  }
};

exports.overall_ranking = async (req, res) => {
  const user = req.user;
  try {
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    const dateString = req.body.date;
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);

    const allUsers = await user_model.find({});
    if (!allUsers || allUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Users not found!",
      });
    }

    const leaderboard = [];

    for (const user of allUsers) {
      const { _id, username } = user;

      const steps = await step_model.find({
        user_id: _id,
        "record.date": { $lte: date },
      });

      let totalSteps = 0;
      for (const stepRecord of steps) {
        for (const record of stepRecord.record) {
          const recordDate = new Date(record.date);
          if (recordDate.toDateString() === date.toDateString()) {
            totalSteps += record.steps;
          }
        }
      }

      leaderboard.push({
        user_id: _id,
        username,
        totalSteps,
      });
    }

    // Sort the leaderboard by totalSteps in descending order
    leaderboard.sort((a, b) => b.totalSteps - a.totalSteps);

    // Find user's ranking
    let userRanking = -1;
    leaderboard.forEach((entry, index) => {
      if (entry.user_id.toString() === user._id.toString()) {
        userRanking = index + 1; // Rankings are 1-based
      }
    });

    // If user not found in leaderboard, handle accordingly
    if (userRanking === -1) {
      return{
        success: false,
        message: "User not found in leaderboard",
      }
    }

    return {
      success: true,
      message: "Overall ranking fetched successfully!",
      ranking:userRanking
    }
  } catch (error) {
    console.error("Error fetching overall ranking:", error);
    return {
    success: false,
    message: "Error fetching overall ranking",
    error: error.message,
    }
  }
};
