const TeleSignSDK = require("telesignsdk");
const { storeOtp, viewStoredOtps } = require("./mapstore");

const customerId = process.env.CUSTOMER_ID;
const apiKey = process.env.API_KEY;

if (!customerId || !apiKey) {
    throw new Error("CUSTOMER_ID and API_KEY must be defined in the environment variables.");
}

const client = new TeleSignSDK(customerId, apiKey);

// /**
//  * Validates the mobile number format.
//  * @param {string} mobile - The mobile number to validate.
//  * @returns {boolean} - True if the mobile number is valid, false otherwise.
//  */
// function isValidMobileNumber(mobile) {
//     // Simple validation: Check if the mobile number is at least 10 digits long.
//     return /^\d{10,}$/.test(mobile);
// }

// /**
//  * Sends an OTP to the specified mobile number.
//  * @param {string} mobile - The mobile number to send the OTP to.
//  * @returns {Promise<{success: boolean, message: string, otp?: number}>} - A response object indicating success or failure.
//  */
async function sendOtp(mobile) {
    try {
        // Validate the mobile number
        // if (!isValidMobileNumber(mobile)) {
        //     console.error(`Invalid mobile number: ${mobile}`);
        //     return {
        //         success: false,
        //         message: "Invalid mobile number",
        //     };
        // }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        const message = `Your OTP-Verification OTP is ${otp}`;
        const messageType = "ARN";

        // Send the SMS using the TeleSign SDK
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
        // Check if the SMS was sent successfully
        if (response.status.code !== 290) {
            return {
                success: false,
                message: `Failed to send SMS: ${response.status.description}`,
            };
        }        
            await storeOtp(mobile, otp);
        // Return success response
        return {
            success: true,
            message: "OTP sent successfully",
        };
    } catch (error) {
        return {
            success: false,
            message: "Unable to send SMS due to an internal error",
        };
    }
}

module.exports = sendOtp;