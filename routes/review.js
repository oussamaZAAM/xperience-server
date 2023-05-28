const express = require("express");
const { getAllReviews, filterReviews, searchReviews } = require("../controllers/review");

const ReviewRouter = express.Router();


ReviewRouter.get('/', getAllReviews);
ReviewRouter.get('/filter', filterReviews);
ReviewRouter.get('/search', searchReviews);


module.exports = {ReviewRouter};