const user_model = require("../models/user_model");
const mongoose = require("mongoose");

exports.send_request = async (req, res) => {
  try {
    const senderID = req.user._id;
    const receiverId = req.body.receiverId;

    let receiverData = await user_model.findById({ _id: receiverId });

    // console.log(receiverData);
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
    // console.error(error);
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
    if (user_id) {
      const user_data = await user_model.findOne({ _id: user_id });

      // Populate sender's name for each request
      let allSenderData = [];
      for (const sender of user_data.requests) {
        let senderData = await user_model
          .findOne({ _id: sender.sender_id })
          .select("-password -auth_key -notificationToken")
          .exec();
        allSenderData.push(senderData);

      }
      return {
        success: true,
        message:"All Relatives' Requests fetched",
        data: allSenderData,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const user = req.user;
    let Arr = [];

    let sender_id = req.body.senderId;
    // let _id = req.body._id;
    // let __id = new mongoose.Types.ObjectId(_id);
    // console.log(__id);
    // const user_data = await user_model.findOne({_id:user_id})
    // let senderID = new mongoose.Types.ObjectId(sender_id)
    // // let id = new mongoose.Types.ObjectId(_id)
    // const sender_data = await user_model.findById({_id:senderID})

    // console.log(sender_data);
    // sender_data.relatives.push(user._id);

    // const savedata = sender_data.save()

    // user.relatives.push(sender_id)
    // const userDatasave = user.save();
    // if(userDatasave,savedata){
    //     return{
    //         sucess:true,
    //         data:userDatasave,savedata
    //     }
    // }
    // let id = null;
    // const findid = user.relatives.forEach(element => {
    //     // console.log(element);
    //     if(element.equals(sender_id)){
    //         return{
    //             existingsender
    //         }

    //     }

    // });
    const existingsender = user.relatives.find((request) =>
      request.equals(sender_id)
    );
    const sender_data = await user_model.findById({ _id: sender_id });
    const existingresiver = sender_data.relatives.find((request) =>
      request.equals(user._id)
    );
    // console.log(existingsender);
    if (!existingsender && !existingresiver) {
      user.relatives.push(sender_id);
      const userDatasave = user.save();
      sender_data.relatives.push(user._id);

      const savedata = sender_data.save();
      const existingresiver = user.requests.findIndex((request) =>
        request.sender_id.equals(sender_id)
      );
      if (existingresiver != -1) {
        for (i = 0; i < user.requests.length; i++) {
          if (user.requests[i] !== user.requests[existingresiver]) {
            Arr.push(user.requests[i]);
            await user_data.save();
          }
        }
        await user_model.findOneAndUpdate(
          { _id: user._id },
          { $set: { requests: Arr } }
        );
      }
      // console.log(existingresiver);
      return {
        success: true,
        data: "request accepted",
      };
    } else {
      return {
        success: false,
        data: "alrady existe",
      };
    }
    // console.log(userDatasave);
    // if (!existingresiver) {
    //   sender_data.relatives.push(user._id);

    //   const savedata = sender_data.save();
    //   return{
    //     data:savedata
    //   }
    // }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error Occurred",
      error: error,
    };
  }
};
