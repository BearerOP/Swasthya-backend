const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  weight: {
    type: Number, // User's weight in kilograms
    required: true,
  },
  height: {
    type: Number, // User's height in centimeters
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "transMale", "transFemale", "nonBinary"],
  },
  food_preference: {
    type: String,
    enum: ["veg", "nonVeg"],
  },
  auth_key: {
    type: String,
    default: null,
  },
  notificationToken: {
    type: String,
    default: null,
  },
  relatives: [mongoose.Schema.Types.ObjectId],
  requests: [
    {
      sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      status: {
        type: Boolean,
        default: false,
      },
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
