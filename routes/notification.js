const express = require("express");
const router = express.Router();
const notifications = require("../controllers/notifications");
const authMiddleware = require("../middleware/auth");

router.get('/:id', authMiddleware.auth, notifications.show); // by id notifs
router.put('/:id', authMiddleware.auth ,notifications.readNotif);
router.post('', notifications.store);
router.get('',  authMiddleware.auth,notifications.index);

module.exports = router;
