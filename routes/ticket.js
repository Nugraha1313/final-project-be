const express = require("express");
const router = express.Router();
const tickets = require("../controllers/tickets");
const authMiddleware = require("../middleware/auth");

router.get("/:transaction_id", authMiddleware.auth, tickets.show);

module.exports = router;
