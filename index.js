const cookieParser = require("cookie-parser");
const express = require("express");
let dotenv = require("dotenv");
let path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// // CORS configuration
// const corsOptions = {
//   origin: ["https://theslug.netlify.app", "http://localhost:5173"],
//   methods: 'GET,POST',
//   credentials: true,
//   allowedHeaders: 'Content-Type,Authorization',
// };
// app.options('*', cors(corsOptions));
// app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, "/public")));
app.use("/public", express.static("public"));

app.use("/", require("./src/routes/user_routes.js"));
app.use("/", require("./src/routes/workout_planner_routes.js"));
app.use("/", require("./src/routes/goal_setting_routes.js"));
app.use("/", require("./src/routes/step_routes.js"));
app.use("/", require("./src/routes/reminder_routes.js"));
app.use("/", require("./src/routes/sleep_patterns_routes.js"));
app.use("/", require("./src/routes/generate_meal_plan_routes.js"));
app.use("/", require("./src/routes/medication_routes.js"));
app.use("/", require("./src/routes/leaderboard_routes.js"));
app.use("/", require('./src/routes/request_routes.js'));
app.use("/", require('./src/routes/relatives_routes.js'));
app.use("/", require('./src/routes/water_routes.js'));

let { connectDB } = require("./db/dbconnection.js");

connectDB();
app.listen(process.env.port, () => {
  console.log(`app listening on ${process.env.host}`);
});
