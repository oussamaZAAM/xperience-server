const mysql = require("mysql");
require("dotenv").config();

const express = require("express");
const { ReviewRouter } = require("./routes/review.js");
const app = express();

// Set the connection with the MySQL Server
const connection = mysql.createConnection({
  host: process.env.DB_HOST, // Values in ".env" file
  user: process.env.DB_USER, // Values in ".env" file
  password: process.env.DB_PASSWORD, // Values in ".env" file
  database: process.env.DB_DATABASE, // Values in ".env" file
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

app.use("/reviews", ReviewRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
