const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const router = require("./Routes/UserRoutes");
require("dotenv").config();

// Create App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", router);

// DataBase Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Data Base is connected successfully!"))
  .catch((error) => console.error(`Data Base Error: ${error}`));

// Export App
module.exports = app;
