const mysql = require("mysql");
require("dotenv").config();

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST, // Values in ".env" file
  user: process.env.DB_USER, // Values in ".env" file
  password: process.env.DB_PASSWORD, // Values in ".env" file
  database: process.env.DB_DATABASE, // Values in ".env" file
});

// Get all reviews Controller
const getAllReviews = async (req, res) => {
  const selectQuery = "SELECT * FROM reviews";

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

const filterReviews = (req, res) => {
  // Get the query parameters from the request
  const { appID, appStoreName, rating, countryName } = req.query;

  // Perform filtering based on the provided criteria
  // Assuming you have a "reviews" table in your database

  let sql = "SELECT * FROM reviews WHERE 1=1";

  if (appID) {
    sql += ` AND appID = '${appID}'`;
  }

  if (appStoreName) {
    sql += ` AND appStoreName = '${appStoreName}'`;
  }

  if (rating) {
    sql += ` AND rating = ${rating}`;
  }

  if (countryName) {
    sql += ` AND countryName = '${countryName}'`;
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting a connection from the pool:", err);
      res.status(500).json({ error: "An error occurred" });
      return;
    }

    connection.query(sql, (err, results) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error("Error executing the query:", err);
        res.status(500).json({ error: "An error occurred" });
        return;
      }

      res.json({ results });
    });
  });
};

const searchReviews = (req, res) => {
  const { searchQuery } = req.query;

  if (!searchQuery) {
    res.status(400).json({ error: "Missing search query parameter" });
    return;
  }

  const sql = `SELECT * FROM reviews WHERE reviewHeading LIKE '%${searchQuery}%' OR reviewText LIKE '%${searchQuery}%'`;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting a connection from the pool:", err);
      res.status(500).json({ error: "An error occurred" });
      return;
    }

    connection.query(sql, (err, results) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error("Error executing the query:", err);
        res.status(500).json({ error: "An error occurred" });
        return;
      }

      res.json({ results });
    });
  });
};

module.exports = {
  getAllReviews,
  filterReviews,
  searchReviews
};
