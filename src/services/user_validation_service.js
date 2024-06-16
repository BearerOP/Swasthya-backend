const user_model = require("../models/user_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const TeleSignSDK = require("telesignsdk");

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
      return {
        message: "User already exists",
        success: false,
      };
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

exports.user_logout = async (req, res) => {
  let user = req.user;
  try {
    const currentUser = await user_model.findOneAndUpdate(
      { _id: user._id },
      { auth_key: null }
    );
    res.clearCookie("token");
    if (currentUser) {
      return {
        success: true,
        message: "User logged out successfully",
      };
    } else {
      return {
        success: false,
        message: "User logout failed",
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

const customerId = process.env.CUSTOMER_ID;
const apiKey = process.env.API_KEY;

const client = new TeleSignSDK(customerId, apiKey);

exports.sendOtp = async (req, res) => {
  const mobile = req.body.mobile;

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  const message = `Your OTP-Verification OTP is ${otp}`;
  const messageType = "ARN";

  async function sendOtp(mobile) {
    try {
      const response = await new Promise((resolve, reject) => {
        client.sms.message(
          (error, responseBody) => {
            if (error) {
              reject(error);
            } else {
              resolve(responseBody);
            }
          },
          mobile,
          message,
          messageType
        );
      });

      return {
        success: true,
        message: "OTP sent successfully",
        data: response,
        otp: otp,
      };
    } catch (error) {
      console.error("Unable to send SMS. Error:\n\n" + error);
      return {
        success: false,
        message: "Failed to send OTP",
        error: error,
      };
    }
  }

  try {
    const result = await sendOtp(mobile);
    if (result.success) {
      return {
        success: true,
        message: "OTP sent successfully",
        data: result,
      };
    } else {
      return {
        success: false,
        message: "Failed to send OTP",
        error: result,
      };
    }
  } catch (error) {
    console.error("Error: ", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error,
    };
  }
};

exports.user_profile = async (req, res) => {
  const user = req.user;
  try {
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    console.error("Error: ", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error,
    };
  }
};

exports.allUsers = async(req,res)=>{
  const user = req.user;
  try {
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }
    const users = await user_model.find({}).select("-password -auth_key")
    .exec(); ;

    if(!users){
      return {
        success: false,
        message: "Users not fetched",
      };
    }
    return {
      success: false,
      message: "Users data fetched",
      data:users
    };
    
  } catch (error) {
    console.error("Error: ", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error,
    };
    
  }
}