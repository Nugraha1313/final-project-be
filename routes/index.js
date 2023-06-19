const express = require("express");
const router = express.Router();
const flights = require('../controllers/flights');
const transactions = require('../controllers/transactions');
const payments = require('../controllers/payments');
const tickets = require('../controllers/tickets');
const users = require('../controllers/users');
const auth = require('./auth')

router.get("/", (req, res) =>
  res.status(200).json({
    status:true,
    message: "Welcome to final project kelompok 5",
  })
);

router.use('/auth', auth)
router.get("/users/:id", users.show);
router.put("/users/:id", users.update);

router.post("/flights", flights.search);
router.get("/flights/favorite-city", flights.most_visited_city);
router.get("/flights/:id", flights.show_by_Id);

router.get("/transactions/:user_id", transactions.show);
router.post("/transactions", transactions.store);

router.post("/payments", payments.complete);
router.get("/tickets/:transaction_id", tickets.show);

module.exports = router;