const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../public/projects.csv');

exports.addProject = (req, res) => {
  const project = req.body;

  if (!project) {
    return res.status(400).send('No data received');
  }

  
  const docCounttotal = 10;
  const comments = 10;
  const collabCount = 1;

  const newRow = `${project.id},${project.projectName},${project.docCount},${docCounttotal},${comments},${project.startDate},${project.endDate},${project.projectScope},${project.supportStaff},${collabCount}\n`;
  console.log('Received Project Data:', newRow);

  fs.appendFile(csvPath, newRow, (err) => {
    if (err) {
      console.error('Error writing to CSV:', err);
      return res.status(500).send('Failed to add project');
    }
    res.json({ message: 'Project added to CSV' });
  });
};

exports.getCSV = (req, res) => {
  fs.readFile(csvPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading CSV:', err);
      return res.status(500).send('Error reading CSV file');
    }
    res.type('text/plain').send(data);
  });
};

exports.updateProjects = (req, res) => {
  const projects = req.body;

  if (!Array.isArray(projects)) {
    return res.status(400).send('Invalid format');
  }

  const headers = Object.keys(projects[0]);
  const csvRows = projects.map(project => {
    return headers.map(h => {
      let val = project[h];
      if (Array.isArray(val)) return val.join(';');
      return val;
    }).join(',');
  });

  const csv = [headers.join(','), ...csvRows].join('\n');

  fs.writeFile(csvPath, csv, 'utf8', (err) => {
    if (err) {
      console.error('Error writing CSV:', err);
      return res.status(500).send('Error saving file');
    }
    res.json({ message: 'CSV updated' });
  });
};
