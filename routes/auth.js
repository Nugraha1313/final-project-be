const express = require("express");
const router = express.Router()
const auth = require('../controllers/auth')

router.post('/register', auth.register)
router.post('/login', auth.login)
router.post('/verify-otp', auth.verifyOTP)
router.post('/resend-otp', auth.resendOTP)
// router.get('/reset-password', auth.resetPasswordPage)
router.patch("/reset-password", auth.resetPassword);
router.post("/forgot-password", auth.forgotPassword);
// router.get('/activation-email', auth.verifyEmail)

module.exports = router