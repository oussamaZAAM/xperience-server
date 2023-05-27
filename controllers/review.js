const mysql = require("mysql");
require("dotenv").config();

// Get all reviews Controller
const getAllReviews = async (req, res) => {
  const selectQuery = "SELECT * FROM reviews";

  // Create a MySQL connection pool
  const pool = mysql.createPool({
    host: process.env.DB_HOST, // Values in ".env" file
    user: process.env.DB_USER, // Values in ".env" file
    password: process.env.DB_PASSWORD, // Values in ".env" file
    database: process.env.DB_DATABASE, // Values in ".env" file
  });

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    connection.query(selectQuery, (error, results) => {
      connection.release();

      if (error) {
        console.error("Error retrieving reviews:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
      }

      const formattedReviews = results.map((review) => ({
        id: review.id,
        appID: review.appID,
        appStoreName: review.appStoreName,
        reviewDate: review.reviewDate.toISOString(), // Converting to ISO string format
        rating: review.rating,
        version: review.version,
        countryName: review.countryName,
        reviewHeading: review.reviewHeading,
        reviewText: review.reviewText,
        reviewUserName: review.reviewUserName,
      }));

      const response = {
        reviews: formattedReviews,
      };

      res.json(response);
    });
  });
};

module.exports = {
  getAllReviews,
};
