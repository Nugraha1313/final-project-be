const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const authMiddleware = require("../middleware/auth");

router.get("/:id", authMiddleware.auth, users.show);
router.put("/:id", authMiddleware.auth,users.update);
router.delete("/:id", authMiddleware.auth, users.delete);

module.exports = router;
