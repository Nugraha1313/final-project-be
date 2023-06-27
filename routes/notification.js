const express = require("express");
const router = express.Router();
const notifications = require("../controllers/notifications");
const authMiddleware = require("../middlewares/auth");

router.get("/:id", authMiddleware.auth, notifications.show);
router.put("/:id", authMiddleware.auth, notifications.readNotif);
router.post("", authMiddleware.auth, authMiddleware.is_admin, notifications.store);
router.get("", authMiddleware.auth, notifications.index);

module.exports = router;
