const user_model = require('../models/user_model.js')
const TeleSignSDK = require("telesignsdk");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");



exports.user_login = async (req, res) => {
  try {
    const { mobile, password, fcm_token } = req.body;
    const existingUser = await user_model.findOne({ mobile });
    if (!existingUser) {
      return {
        success: false,
        message: "Invalid mobile number or not registered!",
      };
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res.status(403).json({
        success: false,
        message: "Invalid mobile number or password",
      });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY);
    if (!token) {
      return res.json({ message: " Token generation failed" });
    }
    // Set the token to cookies
    res.cookie("token", token);
    const authKeyInsertion = await user_model.findOneAndUpdate(
      { _id: existingUser._id },
      { auth_key: token, notificationToken: fcm_token },
      { new: true }
    );

    if (!authKeyInsertion) {
      return res.json({ message: "Token updation failed" });
    }

    return {
      message: "User logged in successfully",
      success: true,
      token,
    };
  } catch (error) {
    console.log(error);
    return {
      message: error.message || "Internal server error",
      success: false,
    };
  }
};

exports.user_register = async (req, res) => {
    const {
      username,
      mobile,
      password,
      weight,
      height,
      dob,
      gender,
      food_preference,
    } = req.body;
    try {
      const existingUser = await user_model.findOne({ mobile });
  
      if (existingUser) {
        return res.json({
          message: "User already exists",
          success: false,
        });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = await user_model.create({
        username,
        mobile,
        password: hashedPassword,
        weight,
        height,
        dob,
        gender,
        food_preference,
      });
  
      if (newUser) {
        return {
          message: "User created successfully",
          success: true,
        };
      } else {
        return {
          message: "User creation failed",
          success: false,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        message: error.message || "Internal server error",
        success: false,
      };
    }
  };
  