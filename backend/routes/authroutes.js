const express = require('express');
const authController = require('../controllers/authcontroller');
const emailController = require('../controllers/emailcontroller');
const router = express.Router();

// Define the login route
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/get', authController.getCSV);
router.post('/send-email', emailController.sendEmail);
router.post('/send-quote', emailController.quoteEmail);
router.post('/verify-otp', emailController.verifyOtp);
router.post('/reset-link', emailController.sendResetLinkEmail);
router.post('/reset-password', authController.passReset);
router.post('/verify-reset-token', emailController.validateResetToken);

module.exports = router;
