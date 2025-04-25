const express = require('express');
const router = express.Router();
const doccontroller = require('../controllers/doccontroller.js');


router.get('/csv-to-json', doccontroller.getCSV);


module.exports = router;