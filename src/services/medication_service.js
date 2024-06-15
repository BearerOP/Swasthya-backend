const medication_model = require("../models/medication_model");

exports.create_medication = async (req, res) => {
  const user_id = req.user._id;
  const {
    medicine_name,
    forms,
    strength,
    unit,
    frequency,
    times,
    start_date,
    description,
  } = req.body;

  if (!user_id) {
    return {
      success: false,
      message: "User not found",
    };
  }

  try {
    const existingUser = await medication_model.findOne({ user_id });
    if (!existingUser) {
      const newUser = await medication_model.create({
        user_id,
        record: [
          {
            medicine_name,
            forms,
            strength,
            unit,
            frequency,
            times,
            start_date,
            description,
          },
        ],
      });
      if (!newUser) {
        return {
          success: false,
          message: "Medication not added",
        };
      }
      return {
        success: true,
        message: "Medication added successfully",
        data: newUser,
      };
    }

    const updatedUser = await medication_model.findOneAndUpdate(
      { user_id },
      {
        $push: {
          record: {
            medicine_name,
            forms,
            strength,
            unit,
            frequency,
            times,
            start_date,
            description,
          },
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return {
        success: false,
        message: "Medication not added",
      };
    }
    
    return {
      success: true,
      message: "Medication added successfully",
      data: updatedUser,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error,
    };
  }
};