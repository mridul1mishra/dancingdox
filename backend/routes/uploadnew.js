const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// POST /upload-multiple
router.post('/upload-multiple', upload.array('files'), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded');
  }

  // Optional: access meta info from req.body if you sent docMeta[]
  console.log('Files uploaded:', req.files);
  res.json({ message: 'Files uploaded successfully', files: req.files.map(f => f.filename) });
});

module.exports = router;
