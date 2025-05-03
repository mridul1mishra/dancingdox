const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');


const csvPath = path.join(__dirname, '../public/projects.csv');

exports.addProject = (req, res) => {
  const project = req.body;

  if (!project) {
    return res.status(400).send('No data received');
  }

  
  const docCounttotal = 10;
  const comments = 10;
  const collabCount = 1;
  const role = 'Owner';

  const newRow = `${project.id},${project.projectName},${project.docCount},${docCounttotal},${comments},${project.startDate},${project.endDate},${project.projectScope},${project.supportStaff},${collabCount},${project.Host},${role},${project.projectDetails}\n`;
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

      if (Array.isArray(val)) {
        // Handle array of objects (like documents)
        if (val.length > 0 && typeof val[0] === 'object') {
          // Convert each document object to just the filename or other desired fields
          const jsonString = JSON.stringify(val).replace(/"/g, '""');
          return `"${jsonString}"`;
        }
        // Handle array of strings
        return val.join(';');
      }

      return val !== undefined && val !== null ? val : '';
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
exports.updateProjectDocuments = (req, res) => {
  const { role: requestRole, host: requestHost, projects: incomingProjects } = req.body;
  console.log('Incoming request body:', req.body);  // Log the entire request body
  // Validate that incomingProjects is an array and that each project contains the expected fields
  if (!Array.isArray(incomingProjects)) {
    return res.status(400).send('Invalid format: projects should be an array');
  }

  // Validate each project
  for (let project of incomingProjects) {
    if (!project.id || !project.Role || !project.Host) {
      return res.status(400).send('Invalid project format: missing id, Role, or Host');
    }
  }

  let existingData;
  try {
    // Read the existing CSV data
    const csvData = fs.readFileSync(csvPath, 'utf8');
    existingData = parse(csvData, {
      columns: true,
      skip_empty_lines: true
    });
  } catch (err) {
    console.error('Error reading CSV:', err);
    return res.status(500).send('Failed to read existing CSV');
  }

  // Update existing data based on incoming project data
  const updatedData = existingData.map(row => {
    const match = incomingProjects.find(
      p => Number(p.id) === Number(row.id) &&
           p.Role === requestRole &&
           p.Host === requestHost &&
           row.Role === p.Role &&
           row.Host === p.Host
    );

    if (match) {
      console.log(`Updating for role: ${requestRole} | Host: ${requestHost} | ID: ${match.id}`);
      console.log('Matched project data:', match);

      // Ensure that documents is properly handled
      const documents = Array.isArray(match.documents)
        ? JSON.stringify(match.documents).replace(/"/g, '""') // Escape for CSV
        : ''; // Empty string if no documents

      return {
        ...row,
        id: match.id,
        Name: match.Name,
        docCount: match.docCount,
        docCounttotal: match.docCounttotal,
        comments: match.comments,
        startDate: match.startDate,
        endDate: match.endDate,
        visibility: match.visibility,
        members: Array.isArray(match.members) ? match.members.join(';') : '',  // Join array for CSV
        collabCount: match.collabCount,
        Host: match.Host,
        Role: match.Role,
        title: match.title,
        documents: documents
      };
    }

    return row;
  });

  try {
    // Convert updated data back to CSV and save
    const csvOutput = stringify(updatedData, { header: true });
    fs.writeFileSync(csvPath, csvOutput, 'utf8');
    res.json({ message: 'CSV updated successfully' });
  } catch (err) {
    console.error('Error writing CSV:', err);
    res.status(500).send('Failed to write updated CSV');
  }  
};

