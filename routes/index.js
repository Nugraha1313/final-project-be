const express = require("express");
const router = express.Router();
const notif = require("../controllers/notifications");
// const NotificationController = require('./controllers/notification');
const flights = require('../controllers/flights')
const transactions = require('../controllers/transactions')


router.get("/", (req, res) =>
  res.status(200).json({
    status: true,
    message: "Welcome to final project kelompok 5",
  })
);


router.get("/flights", flights.show_by_query_params);
// router.get("/flights/favorite-country", flights.most_visited);
router.get("/flights/:id", flights.show_by_Id);
router.post("/transactions", transactions.store);


// GET /users/:id/notifications
router.get('/:id/notifications', NotificationController.getAllNotificationsByUserId);
router.get("/notifications", middlewares.auth, notif.index);
router.put("/notifications/:id/read", middlewares.auth, notif.readNotif);


module.exports = router;
