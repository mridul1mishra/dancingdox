const express = require('express');
const router = express.Router();
const collabcontroller = require('../controllers/collabcontroller.js');


router.get('/csv-to-json', collabcontroller.getCSV);


module.exports = router;