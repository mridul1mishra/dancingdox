const upload = require('../middleware/multerConfig');

const uploadMultipleFiles = (req, res) => {
  upload.array('files')(req, res, (err) => {
    if (err) {
      console.error('Multer Error:', err);
      return res.status(500).json({ message: 'File upload failed', error: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    console.log('Files uploaded:', req.files, req.filename);

    return res.status(200).json({
      message: 'Files uploaded successfully',
      files: req.files.map(file => file.filename),
    });
  });
};

module.exports = { uploadMultipleFiles };
