const express = require("express");
const router = express.Router();
const notifications = require("../controllers/notifications");

router.get("/users/:user_id/notifications", notifications.index);
router.post("/users/:user_id/notifications", notifications.store);
router.get("/notifications/:id", notifications.show);
router.put("/notifications/:id", notifications.readNotif);

module.exports = router;
