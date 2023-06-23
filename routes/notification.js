const express = require("express");
const router = express.Router();
const notifications = require("../controllers/notifications");

router.get('/:id', notifications.show); // by id notifs
router.put('/:id', notifications.readNotif);
router.post('', notifications.store);
router.get('', notifications.index);

module.exports = router;
