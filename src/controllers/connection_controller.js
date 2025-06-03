const { send_request ,alluser,allRequest, update_Request} = require("../services/connection_service.js");
exports.send_request = async (req, res) => {
  try {
    const data = await send_request(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(403).json(data);

    }
  } catch (error) {
    console.log("Error:", error);
  }
};
exports.alluser = async (req, res) => {
  try {
    const data = await alluser(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(403).json(data);

    //   console.log("Error:", error);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};
exports.allRequest = async (req, res) => {
  try {
    const data = await allRequest(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(403).json(data);

    //   console.log("Error:", error);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};
exports.update_Request = async (req, res) => {
  try {
    const data = await update_Request(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(403).json(data);

    //   console.log("Error:", error);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};
