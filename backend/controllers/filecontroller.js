const upload = require('../middleware/multerConfig');
const { saveUploadedFile } = require('../utils/fileUploader');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const pool = require('../utils/sql');

const uploadMultipleFiles = async (req, res) => {
  try {
    console.log('Files received:', req.files);
    console.log('Body:', req.body);
    const files = req.files;
    const { projectId, documents, docCount } = req.body;

    if (!projectId || !documents || !docCount) {
      return res.status(400).json({ error: 'Missing projectId or documents' });
    }

    const parsedDocs = JSON.parse(documents);

    // Enrich documents by saving files and adding paths
    const enrichedDocs = await enrichDocsWithFiles(parsedDocs, files);
    await updateSqlWithEnrichedDocs(projectId, enrichedDocs, docCount);
    // Now do your CSV update or DB save with enrichedDocs

    res.status(200).json({ message: 'Upload successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

async function enrichDocsWithFiles(docs, files) {
  console.log('Starting enrichDocsWithFiles');
  return Promise.all(docs.map(async (doc, i) => {
    const file = files.find(f => f.fieldname === `file${i}`);
    if (file) {
      const filePath = await saveUploadedFile(file);
      doc.uploadedFilePath = filePath;
      doc.uploadTime = new Date().toISOString();
    }
    console.log('Finished enrichDocsWithFiles');
    return doc;
  }));
}

const csvPath = path.join(__dirname, '../public/projects.csv');

async function updateSqlWithEnrichedDocs(projectId, enrichedDocs, docCount){
  try{
    const [rows] = await pool.execute(
      'SELECT samplefile FROM projects WHERE ID = ?',
      [projectId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const newFile = JSON.stringify(enrichedDocs);
    const currentSamplefile = rows[0].samplefile || '';

    // Step 2: Append new value
    let updatedSamplefile = currentSamplefile
      ? `${currentSamplefile},${newFile}`
      : newFile;

    // Optional: avoid duplicates
    const fileArray = updatedSamplefile.split(',').filter(Boolean);
    updatedSamplefile = [...new Set(fileArray)].join(',');
    // Step 3: Update samplefile column
    await pool.execute(
      'UPDATE projects SET samplefile = ?, docCount = ? WHERE ID = ?',
      [updatedSamplefile, docCount, projectId]
    );
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}

const uploadSupportingFiles = (req, res) => {
  try {
    const { projectId, userId, fieldName, actions } = req.body;
    const uploadedFile = req.files?.[0];

    if (!projectId || !userId || !fieldName || !uploadedFile || !actions) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newDoc = {
      userId,
      fieldName,
      actions,
      filename: uploadedFile.originalname
    };

    const records = [];
    
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        
        if (row.id === String(projectId)) {
          let existingDocs = [];
          try {
            existingDocs = JSON.parse(row.documents || '[]');
            if (!Array.isArray(existingDocs)) existingDocs = [];
          } catch {
            existingDocs = [];
          }
          existingDocs.push(newDoc);
          row.documents = JSON.stringify(existingDocs);
        }
        records.push(row);
      })
      .on('end', () => {
        const headers = Object.keys(records[0]);
        const csvWriter = createCsvWriter({
          path: csvPath, 
          header: headers.map(h => ({ id: h, title: h }))
        });

        csvWriter.writeRecords(records).then(() => {
          
          return res.status(200).json({
            message: 'File uploaded and document appended to CSV',
            filePath: `/public/${uploadedFile.filename}`
          });
        });
      })
      .on('error', (error) => {
        console.error('Error reading CSV:', error);
        return res.status(500).json({ message: 'Error processing CSV' });
      });
  } catch (err) {
    console.error('Error during upload:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  uploadMultipleFiles,
  uploadSupportingFiles,
};
