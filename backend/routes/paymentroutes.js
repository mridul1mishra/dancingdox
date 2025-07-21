const express = require('express');
const router = express.Router();
const paymentcontroller = require('../controllers/paymentcontroller.js');

// Define the login route
router.post('/store-card', paymentcontroller.storeData);
router.get('/get-store-card/:email', paymentcontroller.getstoreData);

module.exports = router;