const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const authMiddleware = require("../middlewares/auth");

router.get("/:id", authMiddleware.auth, users.show);
router.put("/:id", authMiddleware.auth,users.update);
router.delete("/:id", authMiddleware.auth, authMiddleware.is_admin, users.delete);

module.exports = router;
