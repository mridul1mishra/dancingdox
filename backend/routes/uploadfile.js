const express = require('express');
const router = express.Router();
const fileController = require('../controllers/filecontroller');


router.post('/upload-multiple', fileController.uploadMultipleFiles);

module.exports = router;