const express = require('express');
const router = express.Router();
const zohoemailcontroller = require('../controllers/zohoemailcontroller');

router.post('/send-email', sendEmailFromRoute);

module.exports = router;
