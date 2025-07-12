const fs = require('fs');
const path = require('path');

const saveUploadedFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file provided'));

    const targetDir = path.join(__dirname, '../uploads');
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(targetDir, fileName);

    fs.rename(file.path, filePath, (err) => {
      if (err) return reject(err);
      resolve(`/uploads/${fileName}`); // return relative URL
    });
  });
};

module.exports = { saveUploadedFile };