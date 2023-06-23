const express = require("express");
const router = express.Router();
const transactions = require("../controllers/transactions");

router.get("/:user_id", transactions.show);
router.post("", transactions.store);

module.exports = router;
