const admin = require("firebase-admin");
const userModel = require("../../src/models/user_model");

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.GC_TYPE,
      project_id: process.env.GC_PROJECT_ID,
      private_key_id: process.env.GC_PRIVATE_KEY_ID,
      private_key: process.env.GC_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.GC_CLIENT_EMAIL,
      client_id: process.env.GC_CLIENT_ID,
      auth_uri: process.env.GC_AUTH_URI,
      token_uri: process.env.GC_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.GC_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.GC_CLIENT_X509_CERT_URL,
      universe_domain: process.env.UNIVERSE_DOMAIN,
    }),
  });
}

/**
 * Function to get the notification token of a user
 * @param {String} userId - The ID of the user
 * @returns {Promise<String>} - The notification token of the user
 */
const getUserToken = async (userId) => {
  const user = await userModel.findById(userId);
  if (user && user.notificationToken) {
    return user.notificationToken;
    // return user.notificationToken || 'ecwoGw__ROWau-klkXfyg3:APA91bEHviRi8Dem0iilY2ZBLhGLHaEoMiVonK_DvQRsgEA3uMw9MJgo5-l3xSzBeqRuTIniTpBtn7tZKIsM3epRdLJgO7Xhag7oPjplgc1Wwx-6Hq-kHq-SfZKZAEo7TlWD7hLHu9w5';
  } else {
    throw new Error("User not found or notification token is missing");
  }
};

/**
 * Function to send a notification to a user
 * @param {String} token - The notification token of the user
 * @param {String} message - The message to be sent
 */
const sendNotification = async (token, message) => {
  try {
    const response = await admin.messaging().send({
      token: token,
      notification: {
        title: "Reminder",
        body: message,
      },
    });

    console.log("Notification sent successfully:", response);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

module.exports = {
  getUserToken,
  sendNotification,
};
