const axios = require("axios");
const MealPlan = require("../models/MealPlan_model");

exports.generateMealPlan = async (req, res) => {
  try {
    let user_id = req.user._id;
    if (user_id) {
      const apiKey = process.env.SPOONACULAR_API_KEY;
      const userEmail = process.env.USER_EMAIL;
      const timeFrame = req.query.timeFrame;
      const targetCalories = req.query.targetCalories;
      const exclude = req.query.exclude;
      const diet = req.query.diet;

      if (
        apiKey &&
        userEmail &&
        timeFrame &&
        targetCalories &&
        targetCalories &&
        diet
      ) {
        // Step 1: Generate a user hash (if needed)
        const connectResponse = await axios.post(
          `https://api.spoonacular.com/users/connect?apiKey=${apiKey}`,
          {
            username: userEmail,
          }
        );
        const { username, hash } = connectResponse.data;

        // Step 2: Generate a meal plan
        const generateResponse = await axios.get(
          `https://api.spoonacular.com/mealplanner/generate?apiKey=${apiKey}&timeFrame=${timeFrame}&targetCalories=${targetCalories}&exclude=${exclude}&diet=${diet}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log(generateResponse.data);
        const mealPlanData = generateResponse.data;
        let meal_data = await MealPlan.findOne({ user_id: user_id });
        if (meal_data) {
          let added_meal = await MealPlan.findOneAndUpdate(
            { user_id: user_id },
            {
              mealplan_details: [
                {
                  mealPlan: mealPlanData,
                },
              ],
            }
          );
          if (added_meal) {
            return {
              message: "New mealplan Added Successfully",
              success: true,
            };
          } else {
            return {
              message: "Something Went Wrong",
              data: [],
              success: false,
            };
          }
        } else {
          // Save the meal plan to MongoDB
          const mealPlan = new MealPlan({
            user_id: user_id,
            mealplan_details: [
              {
                mealPlan: mealPlanData,
              },
            ],
          });
          let save_data = await mealPlan.save();
          if (saved_data)
            return {
              message: "meal Added Successfully",
              success: true,
            };
          else {
            return {
              message: "Something Went Wrong",
              success: false,
            };
          }
        }

        // res.json(generateResponse.data);
      } else {
        return {
          message: "data not recived",
          success: false,
        };
      }
    } else {
      return {
        message: "user not found",
        success: false,
      };
    }
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to generate meal plan" });
  }
};

exports.view_MealPlan = async (req, res) => {
  let user_id = req.user._id;
  if (user_id) {
    let meal_data = await MealPlan.findOne({ user_id: user_id });
    if (meal_data) {
      let mealplan_details = meal_data.mealplan_details;
      console.log(mealplan_details[0]);

      if (mealplan_details) {
        return {
          success: true,
          message: "View All goal",
          meal_data: mealplan_details,
        };
      } else {
        return {
          message: "emty meal plan first you add meal plan",
          success: false,
        };
      }
    } else {
      return {
        message: "emty meal plan first you add meal plan",
        success: false,
      };
    }
  } else {
    return {
      message: "user not found",
      success: false,
    };
  }
};

exports.getPrompt = async (req, res) => {
  let user_id = req.user._id;
  let prompt = req.body.prompt;
  run(prompt)

  try {
    if (!user_id) {
      return res.json({
        message: "user not found",
        success: false,
      });
    }

    const apiUrl = "https://aistudio.google.com/api/recipe-generator"; // Replace with the actual API endpoint

    const promptData = {
      prompt: prompt,
    };

    const headers = {
      Authorization: `Bearer AIzaSyATqmJGmCwbmKS45z9_kpkHr3J9X7X6EAA`, // Replace with your API key stored in environment variables
      "Content-Type": "application/json",
    };

    const response = await axios.post(apiUrl, promptData, { headers });

    return {
      message: "Prompt generated successfully",
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error(error);
    return{
      message: "Failed to generate prompt",
      success: false,
      error: error.message,
    };
  }
};

/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
// const { GoogleAIFileManager } = require("@google/generative-ai/files");

const apiKey = "AIzaSyATqmJGmCwbmKS45z9_kpkHr3J9X7X6EAA";
const genAI = new GoogleGenerativeAI(apiKey);
// const fileManager = new GoogleAIFileManager(apiKey);

/**
 * Uploads the given file to Gemini.
 *
 * See https://ai.google.dev/gemini-api/docs/prompting_with_media
 */
async function uploadToGemini(path, mimeType) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const safetySettings = {
  blockedCategories: [HarmCategory.Hate, HarmCategory.Violence, HarmCategory.SelfHarm],
  blockThreshold: HarmBlockThreshold.LOW,
};

async function run(inputText) {
  // TODO Make these files available on the local file system
  // You may need to update the file paths
  const files = [
    await uploadToGemini("image_recipe_creator1.jpeg", "image/jpeg"),
  ];

  const chatSession = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [
          { text: inputText },
          {
            fileData: {
              mimeType: files[0].mimeType,
              fileUri: files[0].uri,
            },
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(inputText);
  console.log(result.response.text());
}

// Example usage:

