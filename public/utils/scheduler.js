const reminderModel = require("../../src/models/reminder_model.js");
const schedule = require("node-schedule");
const {
  sendNotification,
  getUserToken,
} = require("../../public/utils/notification.js");

const scheduleReminder = (reminderId, info) => {
  const { message, time, repeat } = info;
  const date = new Date(time);

  if (date > new Date()) {
    const job = schedule.scheduleJob(date, async () => {
      try {
        const reminder = await reminderModel
          .findById(reminderId)
          .populate("user_id");
        if (reminder) {
          const token = await getUserToken(reminder.user_id._id);
          sendNotification(token, message);
        }

        if (repeat === "daily") {
          const nextDay = new Date(date);
          nextDay.setDate(nextDay.getDate() + 1);
          scheduleReminder(reminderId, { ...info, time: nextDay });
        }
      } catch (error) {
        console.error("Error sending notification:", error.message);
      }
    });

    console.log(`Scheduled reminder ${reminderId} for ${date}`);
  }
};

module.exports = { scheduleReminder };
