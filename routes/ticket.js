const express = require("express");
const router = express.Router();
const tickets = require("../controllers/tickets");

router.get("/:transaction_id", tickets.show);

module.exports = router;
