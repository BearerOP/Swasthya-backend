const user_model = require("../models/user_model");
const mongoose = require("mongoose");

exports.send_request = async (req, res) => {
  try {
    const senderID = req.user._id;
    const receiverId = req.body.receiverId;

    let receiverData = await user_model.findById({ _id: receiverId });

    console.log(receiverData);
    if (!receiverData) {
      return {
        message: "Receiver not found",
        success: false,
      };
    }

    const existingRequest = receiverData.requests.find((request) =>
      request.sender_id.equals(senderID)
    );

    if (existingRequest) {
      return {
        message: "Request already sent",
        success: false,
      };
    }

    receiverData.requests.push({
      sender_id: senderID,
      status: false,
    });

    const updatedReceiverData = await receiverData.save();

    if (updatedReceiverData) {
      return {
        message: "Request sent successfully",
        success: true,
        data: updatedReceiverData.requests,
      };
    } else {
      return {
        message: "Request not sent",
        success: false,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error.message,
    };
  }
};

exports.alluser = async (req, res) => {
  try {
    const user = await user_model.find();
    return {
      success: true,
      data: user,
    };
  } catch (error) {
    return {
      success: false,
      massege: error.massege,
    };
  }
};

exports.allRequest = async (req, res) => {
  try {
    const user_id = req.user._id;
    console.log(user_id);
    if (user_id) {
      const user_data = await user_model.findOne({ _id: user_id });

      console.log(user_data);
      return {
        sucess: true,
        data: user_data.requests,
      };
    }
  } catch (error) {
    return {
      sucess: false,
      massege: error.massege,
    };
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const user = req.user;

    let sender_id = req.body.senderId;
    let _id = req.query._id;
    console.log(_id);
    // const user_data = await user_model.findOne({_id:user_id})
    let senderID = new mongoose.Types.ObjectId(sender_id);
    // let id = new mongoose.Types.ObjectId(_id)
    const sender_data = await user_model.findById({ _id: senderID });

    console.log(sender_data);
    sender_data.relatives.push(user._id);

    const savedata = sender_data.save();

    user.relatives.push(sender_id);
    const userDatasave = user.save();
    if ((userDatasave, savedata)) {
      return {
        sucess: true,
        data: userDatasave,
        savedata,
      };
    }

    let requested_data = user.requests.findIndex(
      (request) => request._id == _id
    );

    return {
      sucess: true,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error Occurred",
      error: error,
    };
  }
};
