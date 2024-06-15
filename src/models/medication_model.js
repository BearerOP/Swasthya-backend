const mongoose = require("mongoose");

// Define frequency schema
const frequencySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["At Regular Intervals", "On Specific Days Of Week", "As Needed"],
  },
  interval: {
    type: Number,
    default: 1, // Default interval, you can change it as needed
  },
  specificDays: {
    type: [String], // Array of specific days (e.g., ["Monday", "Wednesday"])
  },
});

// Define log schema
// Define log schema without medicine_name
const logSchema = new mongoose.Schema({
  time: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["taken", "skipped", "not taken yet"],
    default: "not taken yet",
  },
  logged: {
    type: Boolean,
    default: false,
  },
});

// Define medication schema
const medicationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  record: [
    {
      medicine_name: {
        type: String,
        required: true,
      },
      forms: {
        type: String,
        required: true,
        enum: [
          "capsule",
          "tablet",
          "liquid",
          "topical",
          "cream",
          "device",
          "drops",
          "foam",
          "gel",
          "inhaler",
          "injection",
          "lotion",
          "ointment",
          "patch",
          "powder",
          "spray",
          "suppository",
        ],
      },
      strength: {
        type: String,
        required: true,
      },
      unit: {
        type: String,
        required: true,
        enum: ["mg", "mcg", "g", "ml", "%"],
      },
      frequency: {
        type: frequencySchema,
        required: true,
      },
      times: [
        {
          // No. of medicine eg. : 2 tablets
          dose: {
            type: String,
            required: true,
          },
          // Time of medicine
          time: {
            type: Date,
            required: true,
          },
        },
      ],
      start_date: {
        type: Date,
        required: true,
        default: Date.now,
      },
      description: {
        type: String,
        required: true,
      },
      logs: [logSchema], // Reference to log schema
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Medication = mongoose.model("Medication", medicationSchema);
module.exports = Medication;
