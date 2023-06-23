const express = require("express");
const router = express.Router();
const notifications = require("../controllers/notifications");
const authMiddleware = require("../middleware/auth");

router.get('/users/:user_id/notifications', authMiddleware.auth, notifications.index);
router.post('/users/:user_id/notifications', notifications.store);
router.get('/notifications/:id', authMiddleware.auth, notifications.show);
router.put("/notifications/:id", authMiddleware.auth, notifications.readNotif);

module.exports = router;
