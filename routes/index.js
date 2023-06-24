const express = require("express");
const router = express.Router();
const auth = require('./auth')
const flight = require('./flight')
const notification = require('./notification');
const payment = require('./payment');
const ticket = require('./ticket');
const transaction = require('./transaction')
const user = require('./user')

router.get("/", (req, res) =>
  res.status(200).json({
    status:true,
    message: "Welcome to Tripp API",
  })
);

router.use('/auth', auth);
router.use('/users', user);
router.use('/flights', flight);
router.use('/notifications', notification);
router.use('/payments', payment);
router.use('/tickets', ticket);
router.use('/transactions', transaction);

module.exports = router;