const { all } = require("axios");
const { user_login,user_register,user_logout, sendOtp, user_profile, allUsers } = require("../services/user_validation_service.js")

exports.user_login = async (req, res) => {
    try {
      const data = await user_login(req, res);
      if (data.success) {
        res.status(200).json(data);
      }else{
          res.status(403).json(data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  
  exports.user_register = async (req, res) => {
    try {
      const data = await user_register(req, res);
      if (data.success) {
        res.status(200).json(data);
      }
      else{
          res.status(403).json(data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  exports.user_logout = async (req, res) => {
    try {
      const data = await user_logout(req, res);
      if (data.success) {
        res.status(200).json(data);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  


  exports.sendOtp = async (req, res) => {
    try {
      const data = await sendOtp(req, res);
      if (data.success) {
        res.status(200).json({data:data.data});
      } else {
        res.status(500).json(data.data);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };


  exports.user_profile = async (req, res) => {
    try {
      const data = await user_profile(req, res);
      if (data.success) {
        res.status(200).json(data);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  exports.allUsers = async (req, res) => {
    try {
      const data = await allUsers(req, res);
      if (data.success) {
        res.status(200).json(data);
      }else{
          res.status(403).json(data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };