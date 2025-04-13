const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const csvPath = path.join(__dirname, 'public/projects.csv');

app.post('/add-project', (req, res) => {
  const project = req.body;
  console.log('Received Project Data:', project);
  if (!project) {
    return res.status(400).send('No data received');
  }
  // Convert members array to semi-colon separated string
  const members = Array.isArray(project.members) ? project.members.join(';') : '';
  const docCount = 4;
  const docCounttotal = 10;
  const comments = 10;

  const newRow = `${project.id},${project.projectName},${project.projectDetails},${docCount},${docCounttotal},${comments},${project.startDate},${project.endDate},${project.visibility},${members}\n`;

  fs.appendFile(csvPath, newRow, (err) => {
    if (err) {
      console.error('Error writing to CSV:', err);
      return res.status(500).send('Failed to add project');
    }

    res.send('Project added to CSV');
  });
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
