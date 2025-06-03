const mongoose = require("mongoose");
const medication_model = require("../models/medication_model");
const reminderModel = require("../models/reminder_model");
const { scheduleReminder } = require("../../public/utils/scheduler");
const User = require("../models/user_model");
exports.create_medication = async (req) => {
  const user_id = req.user._id;
  console.log("user_id in create medication:", user_id);
  let relativeUser = null; // Initialize relativeUser to null

  const {
    medicine_name,
    forms,
    strength,
    unit,
    frequency,
    times,
    start_date,
    description,
    forWhom , // Default to 'myself' if not provided
    relative_id // This will be set conditionally if forWhom is 'relative'
  } = req.body;
  
  if (!user_id) {
    return {
      status: 404,
      success: false,
      message: "User not found",
    };
  }
  

  // Validate required fields
  if (!medicine_name || !forms || !strength || !unit || !frequency || !times || !start_date) {
    return {
      status: 400,
      success: false,
      message: "Missing required medication fields",
    };
  }

 
  
  // Validate forWhom
  if (!['myself', 'relative'].includes(forWhom)) {
    return {
      status: 400,
      success: false,
      message: "forWhom must be either 'myself' or 'relative'",
    };
  }

  // Start a MongoDB session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  relativeUser= await User.findOne({userId: relative_id}).session(session);

  try {
    let result;
    const medicationData = {
      medicine_name,
      forms,
      strength,
      unit,
      frequency,
      times,
      start_date,
      description,
      // forWhom,
      // relative_id: null
    };

    
    // Handle medication for relative
    if (medicationData.forWhom === "relative") {
      if (!relative_id) {
        await session.abortTransaction();
        session.endSession();
        return {
          status: 400,
          success: false,
          message: "Relative ID is required for relative medication",
        };
      }
      medicationData.relative_id = relative_id;
    
      // Add medication to relative's record
      const relativeUpdate = await medication_model.findOneAndUpdate(
        { user_id: relativeUser._id },
        { 
          $push: {
            record: {
              ...medicationData,
              relative_id: req.user._id, // Set the relative_id to the current user's ID
              forWhom: 'relative',
            }
          }
        },
        { upsert: true, new: true, session }
      );
   
      if (!relativeUpdate) {
        await session.abortTransaction();
        session.endSession();
        return {
          status: 500,
          success: false,
          message: "Failed to update relative's medication record",
        };
      }
    }
 

    // Always add to the current user's record
    const existingUser = await medication_model.findOne({ user_id }).session(session);

    if (!existingUser) {
      // Create new medication record for user
      result = await medication_model.create([{
        user_id,
        record: [medicationData],
        forWhom: forWhom,
        relative_id: relativeUser._id || null, // Set relative_id if provided
      }], { session });
      result = result[0];
    } else {

      // Update existing medication record
      result = await medication_model.findOneAndUpdate(
        { user_id },
        { $push: { record: medicationData },
          // Note: relative_id is not needed here since it's already set in the medicationData
          forWhom: forWhom,
          relative_id: relativeUser._id || null // Ensure relative_id is set correctly
        },
        // Use upsert to create the record if it doesn't exist
        { new: true, session }
        
      );
    }


    if (!result) {
      await session.abortTransaction();
      session.endSession();
      return {
        status: 500,
        success: false,
        message: "Failed to create or update medication record",
      };
    }
  
    // Schedule reminders
    await scheduleMedicationReminders([medicationData], user_id);


    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    return {
      status: 200,
      success: true,
      message: "Medication added successfully",
      data: result,
    };
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    session.endSession();
    
    console.error("Error in create_medication:", error);
    return {
      status: 500,
      success: false,
      message: "An error occurred while adding medication",
      error: error.message,
    };
  }
};

const scheduleMedicationReminders = async (medicationRecords, user_id) => {
  try {
    for (let medication of medicationRecords) {
      // Ensure forWhom is set to a default value if not present
      if (!medication.forWhom) {
        medication.forWhom = "self"; // Default to "self" if not specified
      }
      
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
