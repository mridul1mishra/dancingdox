const express = require('express');
const router = express.Router();
const fileController = require('../controllers/filecontroller');
const fs = require('fs');
const multer = require('multer');


['uploads', 'data'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });
router.post('/upload-multiple',upload.any(), fileController.uploadMultipleFiles);
router.post('/upload-supporting-file',upload.any(), fileController.uploadSupportingFiles);

module.exports = router;