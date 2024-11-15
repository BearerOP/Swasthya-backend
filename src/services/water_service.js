const Water = require("../models/water_model");

const getWater = async (req,res) => {
  try {
    const user = req.user;

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Set the current date with timezone consistency (5:30 AM)
    let currentDate = new Date();
    currentDate.setHours(5, 30, 0, 0); // Adjust to start of the day
    const formattedCurrentDate = currentDate.toISOString().split("T")[0];

    // Fetch water data for the user
    const water = await Water.findOne({ userId: user._id });

    if (!water) {
      // If no data exists for the user, return default response
      return {
        success: true,
        message: "No water data found for today",
        data: {
          date: currentDate,
          waterIntake: [],
          intakeTarget: 0,
          totalIntake: 0,
        },
      };
    }

    // Find today's data in the dates array
    const todayData = water.dates.find(
      (entry) => entry.date.toISOString().split("T")[0] === formattedCurrentDate
    );

    return {
      success: true,
      message: "Water data retrieved successfully",
      data: todayData || {
        date: currentDate,
        waterIntake: [],
        intakeTarget: 0,
        totalIntake: 0,
      },
    };
  } catch (error) {
    console.error("Error: ", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error.message,
    };
  }
};

const updateWater = async (req) => {
    try {
      const user = req.user;
      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }
  
      const { waterIntake, intakeTarget } = req.body;
  
      if (!waterIntake || !intakeTarget) {
        return {
          success: false,
          message: "Missing waterIntake or intakeTarget in request body",
        };
      }
  
      // Set current date with a fixed time (5:30 AM to handle timezone consistency)
      let currentDate = new Date();
      currentDate.setHours(5, 30, 0, 0);
      const formattedCurrentDate = currentDate.toISOString().split("T")[0]; // Format YYYY-MM-DD
  
      let water = await Water.findOne({ userId: user._id });
  
      if (!water) {
        // Create a new water record if it doesn't exist
        water = new Water({
          userId: user._id,
          dates: [],
        });
      }
  
      // Find the entry for the current date
      let todayData = water.dates.find(
        (entry) => entry.date.toISOString().split("T")[0] === formattedCurrentDate
      );
  
      if (todayData) {
        // If date exists, append to the waterIntake array
        todayData.waterIntake.push(waterIntake);
        todayData.totalIntake += waterIntake.quantity; // Increment total intake
        todayData.intakeTarget = intakeTarget; // Update target if necessary
      } else {
        // If date doesn't exist, create a new entry
        todayData = {
          date: currentDate,
          waterIntake: [waterIntake],
          intakeTarget,
          totalIntake: waterIntake.quantity,
        };
        water.dates.push(todayData);
      }
  
      // Save the updated water data
      await water.save();
  
      return {
        success: true,
        message: "Water data updated successfully",
        data: todayData,
      };
    } catch (error) {
      console.error("Error: ", error);
      return {
        success: false,
        message: "An unexpected error occurred",
        error: error.message,
      };
    }
  };
  
  module.exports = {
    updateWater,
  };
  

module.exports = {
  getWater,
  updateWater,
};
