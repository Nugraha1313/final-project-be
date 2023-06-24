const express = require("express");
const router = express.Router();
const transactions = require("../controllers/transactions");
const authMiddleware = require("../middlewares/auth");

router.get("/:user_id", authMiddleware.auth, transactions.show);
router.post("", authMiddleware.auth, transactions.store);

module.exports = router;
