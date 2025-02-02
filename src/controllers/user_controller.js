const {
  user_login,
  user_register,
  user_logout,
  sendOtp,
  user_profile,
  allUsers,
  profile_update,
  verifyOtp,

} = require("../services/user_validation_service.js");

const { profile_picture } = require("../services/profile_picture_service.js")

exports.user_login = async (req, res) => {
  try {
    const data = await user_login(req, res);
    if (data.success) {
      res.status(data.status).json(data);
    } else {
      res.status(data.status).json(data);
    }
  } catch (error) {
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};

exports.user_register = async (req, res) => {
  try {
    const data = await user_register(req, res);
    if (data.success) {
      res.status(data.status).json(data);
    } else {
      res.status(data.status).json(data);
    }
  } catch (error) {
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};
exports.user_logout = async (req, res) => {
  try {
    const data = await user_logout(req, res);
    if (data.success) {
      res.status(data.status).json(data);
    }
    else {
      res.status(data.status).json(data);
    }
  } catch (error) {
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const data = await sendOtp(req, res);
    if (data.success) {
      res.status(data.status).json(data);
    } else {
      res.status(data.status).json(data);
    }
  } catch (error) {
    console.log("Error: ", error);
    
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};
exports.verifyOtp = async (req, res) => {
  try {
    const data = await verifyOtp(req, res);
    if (data.success) {
      res.status(data.status).json(data);
    } else {
      res.status(data.status).json(data);
    }
  } catch (error) {
    res.status(500).json({ message: "An unexpected error occurred" });
  }
}

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
    } else {
      res.status(403).json(data);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

exports.profile_update = async (req, res) => {
  try {
    const data = await profile_update(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(403).json(data);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

exports.profile_picture = async (req, res) => {
  try {
    const data = await profile_picture(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(403).json(data);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};
