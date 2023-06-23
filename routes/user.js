const express = require("express");
const router = express.Router();
const users = require("../controllers/users");

router.get("/:id", users.show);
router.put("/:id", users.update);
router.delete("/:id", users.delete);

module.exports = router;
