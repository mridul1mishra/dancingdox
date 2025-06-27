const express = require('express');
const router = express.Router();
const paymentcontroller = require('../controllers/paymentcontroller.js');

// Define the login route
router.post('/store-card', paymentcontroller.storeData);

module.exports = router;