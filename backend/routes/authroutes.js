const express = require('express');
const authController = require('../controllers/authcontroller');
const emailController = require('../controllers/emailcontroller');
const router = express.Router();

// Define the login route
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/get', authController.getCSV);
router.post('/send-email', emailController.sendEmail);
module.exports = router;
