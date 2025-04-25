const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../public/documents.csv');
exports.getCSV = (req, res) => {
  fs.readFile(csvPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading CSV:', err);
      return res.status(500).send('Error reading CSV file');
    }
    res.type('text/plain').send(data);
  });
};