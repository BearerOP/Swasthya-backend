const {
  get_relatives,
  add_relative,
} = require("../services/relative_service.js");

exports.add_relative = async (req, res) => {
  try {
    const data = await add_relative(req, res);
    if (data.success) {
      res.status(201).json({
        message: data.message,
        success: data.success,
      });
    } else {
      res.status(400).json({
        message: data.message,
        success: data.success,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
exports.get_relatives = async (req, res) => {
  try {
    const data = await get_relatives(req, res);
    if (data.success) {
      res.status(201).json({
        message: data.message,
        success: data.success,
        data: data.data,
      });
    } else {
      res.status(400).json({
        message: data.message,
        success: data.success,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};


