const mongoose = require("mongoose");
const medication_model = require("../models/medication_model");
const reminderModel = require("../models/reminder_model");
const { scheduleReminder } = require("../../public/utils/scheduler");
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
    let newUser;
    let updatedUser;

    const existingUser = await medication_model.findOne({ user_id });

    if (!existingUser) {
      newUser = await medication_model.create({
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
    } else {
      updatedUser = await medication_model.findOneAndUpdate(
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
    }

    // Extract times from either newUser or updatedUser based on condition
    const medicationRecords = newUser ? newUser.record : updatedUser.record;

    // Schedule reminders for each time in times array
    await scheduleMedicationReminders(medicationRecords, user_id);

    return {
      success: true,
      message: "Medication added successfully",
      data: newUser || updatedUser,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while adding medication",
      error: error.message,
    };
  }
};

const scheduleMedicationReminders = async (medicationRecords, user_id) => {
  try {
    for (let medication of medicationRecords) {
      for (let timeEntry of medication.times) {
        //  let time =  convertUTCToIST(timeEntry.time);
        let time = timeEntry.time;
        let repeat = "none";
        if (medication.frequency.type === "As Needed") {
          repeat = "daily";
        }

        // Create or update reminder in the database
        let reminderEntry = await reminderModel.updateOne(
          { user_id: user_id },
          {
            $push: {
              reminder_info: {
                type: "medication",
                title: medication.medicine_name,
                message: `It's time to take your ${medication.medicine_name}`,
                time: time,
                repeat: repeat, // Adjust repeat logic based on your requirements
              },
            },
          },
          { upsert: true }
        );

        if (!reminderEntry) {
          console.error(
            `Failed to create/update reminder in the database for ${time}`
          );
          continue; // Skip to the next time entry if this fails
        }

        const reminder = await reminderModel.findOne({ user_id: user_id });

        scheduleReminder(reminder._id, {
          message: `It's time to take your ${medication.medicine_name}`,
          time: time,
          repeat: repeat, // Adjust repeat logic based on your requirements
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};


exports.view_medication = async (req, res) => {
  try {
    const user_id = req.user._id;
    const medication_id = new mongoose.Types.ObjectId(req.query.medication_id);
    let allMedication = await medication_model.findOne({ user_id: user_id });

    let queryMedication={}
    allMedication.record.forEach((medication)=>{
      if(medication._id.equals(medication_id)){
        queryMedication=medication
      }
    })
    if(!queryMedication){
      return{
        success:false,
        message:"Medication not found"
      }
    }
    return{
      success:true,
      message:"Fetched Medication successfully",
      medication:queryMedication
    }

  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}

exports.view_all_medication = async (req, res) => {
  try {
    const user_id = req.user._id;
    const allMedication = await medication_model.find({ user_id: user_id });
    if (!allMedication) {
      return { success: false, message: "No Medication Found" };
    }
    return {
      success: true,
      allMedication,
      message: "All Medications fetched succesfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};


exports.delete_medication = async (req, res) => {
  try {
    const user_id = req.user._id;
    const medication_id = new mongoose.Types.ObjectId(req.query.medication_id);
    let allMedication = await medication_model.findOne({ user_id: user_id });

    if (!allMedication) {
      return {
        success: false,
        message: "Medication record not found",
      };
    }

    const medicationIndex = allMedication.record.findIndex((medication) => medication._id.equals(medication_id));

    if (medicationIndex === -1) {
      return{
        success: false,
        message: "Medication not found",
      };
    }

    allMedication.record.splice(medicationIndex, 1);
    await allMedication.save();

    return{
      success: true,
      message: "Deleted Medication successfully",
    };
  } catch (error) {
    return{
      success: false,
      message: error.message,
    };
  }
};
