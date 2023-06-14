const express = require("express");
const router = express.Router()
const auth = require('../controllers/auth')

router.post('/register', auth.register)
router.post('/login', auth.login)
router.get('/activation-email', auth.verifyEmail)

module.exports = router