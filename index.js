const cookiparser = require("cookie-parser");
const express = require("express");
let dotenv = require("dotenv");
let path = require("path");
const cors = require("cors");

var cookieParser = require('cookie-parser')

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookiparser());

// app.use(
//   cors({
//     origin: "https://theslug.netlify.app","http://localhost:5173",
//     credentials: true,
//   })
// );

const corsOptions = {
  origin: ["http://localhost:5173"], // Allow requests from example1.com and example2.com
  methods: 'GET,POST', // Allow only GET and POST requests
    credentials: true,
  allowedHeaders: 'Content-Type,Authorization', // Allow only specific headers
};
// Handle CORS preflight requests
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

let { connectDB } = require("./db/dbconnection.js");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));


// Define a route for the root URL ("/")
app.use("/", require("./src/routes/user_routes.js"));

// // Workout Routes
app.use("/", require("./src/routes/workout_planner_routes.js"));

// // Goal Setting Routes
app.use("/", require("./src/routes/goal_setting_routes.js"));

// // Step Routes
app.use("/", require("./src/routes/step_routes.js"));

// // Reminder Routes
app.use("/", require("./src/routes/reminder_routes.js"));

// // Sleep Patterns
app.use("/", require("./src/routes/sleep_patterns_routes.js"));

// // Meal Plan Routes
app.use("/", require("./src/routes/generate_meal_plan_routes.js"));

// // Medication Routes
app.use("/", require("./src/routes/medication_routes.js"));

// LeaderBoard Routes
app.use("/", require("./src/routes/leaderboard_routes.js"));

// Requests routes
app.use("/", require('./src/routes/request_routes.js'))

// Relatives Routes
app.use("/", require('./src/routes/relatives_routes.js'))

app.use("/public", express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));
app.set("views", path.join(__dirname, "src/views"));

app.set("view engine", "ejs");

// Start the Express server
connectDB();
app.listen(process.env.port, () => {
  console.log(`app listening on ${process.env.host}`);
});