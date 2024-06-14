const {
  add_step,
  view_step_daily,
  view_step_weekly,
  view_step_monthly,
}
= require("../services/step_service")

exports.add_step = async (req, res) => {
  try {
    const data = await add_step(req, res);
    if (data.success) {
      res.status(200).json({
        success: data.success,
        message: data.message,
      });
    } else {
      res.status(500).json({
        success: data.success,
        message: data.message,
      });
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({
      success: data.success,
      message: data.message,
      error,
    });
  }
};
exports.view_step_daily = async (req, res) => {
  try {
    const data = await view_step_daily(req, res);
    if (data.success) {
      res.status(200).json({
        success: data.success,
        message: data.message,
        data:data.data.record
      });
    } else {
      res.status(500).json({
        success: data.success,
        message: data.message,
      });
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({
      success: data.success,
      message: data.message,
      error,
    });
  }
};
exports.view_step_weekly = async (req, res) => {
  try {
    const data = await view_step_weekly(req, res);
    if (data.success) {
      res.status(200).json({
        success: data.success,
        message: data.message,
        data:data.data
      });
    } else {
      res.status(500).json({
        success: data.success,
        message: data.message,
      });
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({
      success: data.success,
      message: data.message,
      error,
    });
  }
};
exports.view_step_monthly = async (req, res) => {
  try {
    const data = await view_step_monthly(req, res);
    if (data.success) {
      res.status(200).json({
        success: data.success,
        message: data.message,
        data:data.data
      });
    } else {
      res.status(500).json({
        success: data.success,
        message: data.message,
      });
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({
      success: data.success,
      message: data.message,
      error,
    });
  }
};
