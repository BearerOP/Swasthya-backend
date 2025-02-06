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

exports.makeweekMealPlan = async (req, res) => {
  const user_id = req.user._id;
  const {protein,Calories,foodType} = req.query;
  // const apiKey = process.env.GEMINAI_API_KEY;


  try {

    
    
  } catch (error) {
    console.error("Error: ", error);
    return {
      status: 500,
      success: false,
      message: "An unexpected error occurred",
    };
    
  }

  
}

exports.getOneMeal = async (req, res) => {
  const { protein, Calories, foodType } = req.query;
  console.log(protein, Calories, foodType);

  try {
    const url = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_APP_KEY}&calories=${Calories}&protein=${protein}&cuisineType=Indian&health=${foodType}`;

    const response = await axios.get(url, {
      headers: {
        "Edamam-Account-User": process.env.EDAMAM_ACCOUNT_USERNAME,
      },
    });
        if (response.status!==200) {
          return {
            status: 500,
            success: false,
            message: "An unexpected error occurred",
          };
        }
    return {
      status: 200,
      success: true,
      data: response.data,
    }
  } catch (error) {
    // Send a proper error response to the client
    return{
      status: 500,
      success: false,
      message: "An unexpected error occurred",
      error: error.message,
    }
  }
};