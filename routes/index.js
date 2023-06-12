const express = require("express");
const router = express.Router();
const flights = require('../controllers/flights')
const transactions = require('../controllers/transactions')

router.get("/", (req, res) =>
  res.status(200).json({
    status:true,
    message: "Welcome to final project kelompok 5",
  })
);

router.get("/flights", flights.show_by_query_params);
router.get("/flights/favorite-country", flights.most_visited_city);
router.get("/flights/:id", flights.show_by_Id);
router.post("/transactions", transactions.store);

module.exports = router;