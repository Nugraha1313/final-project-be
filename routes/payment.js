const express = require("express");
const router = express.Router();
const payments = require("../controllers/payments");
const authMiddleware = require("../middlewares/auth");

router.post("", authMiddleware.auth, payments.complete);

module.exports = router;
