const express = require("express");
const { getAllReviews } = require("../controllers/review");

const ReviewRouter = express.Router();


ReviewRouter.get('/', getAllReviews);


module.exports = {ReviewRouter};