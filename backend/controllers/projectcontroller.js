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

  // Sanitize commas and newlines in string fields
  const escape = (value) => {
    if (typeof value === 'string') {
      return `"${value.replace(/"/g, '""')}"`;  // CSV escaping
    }
    return value;
  };

  const newRow = [
    project.id,
    escape(project.projectName),
    project.docCount,
    docCounttotal,
    comments,
    project.startDate,
    project.endDate,
    escape(project.projectScope),
    escape(project.supportStaff),
    collabCount,
    escape(project.Host),
    role,
    escape(project.projectDetails)
  ].join(',') + '\n';

  console.log('Received Project Data:', newRow);

  fs.appendFile(csvPath, newRow, 'utf8', (err) => {
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
exports.updateProjectDocumentsCollabs = async (req, res) => {
  id = req.params.id; // Assuming docassigned contains the new assignedCollab data
  docassigned = req.body.data;
  updateAssignedCollab(id, docassigned)
    .then(() => {
      res.status(200).json({ message: 'Assigned collaborators updated successfully' });
    })
    .catch((error) => {
      console.error('Error updating project:', error);
      res.status(500).json({ message: 'Error updating project' });
    });
};
function readCSV() {
  const fileContent = fs.readFileSync(csvPath);
  return parse(fileContent, {
    columns: true,  // Use the first row as column names
    skip_empty_lines: true,
  });
}
function convertToCSV(data) {
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(field => row[field]).join(','));
  return [headers.join(','), ...rows].join('\n');
}
function updateAssignedCollab(projectId, assignedCollabData) {
  return new Promise((resolve, reject) => {
    try {
      // Read CSV data
      const csvData = readCSV();
      console.log('Updating project with ID:', projectId);
      // Find the project by ID
      const projectIndex = csvData.findIndex(project => project.id == projectId);

      if (projectIndex === -1) {
        reject(new Error('Project not found'));
        return;
      }

      // Update the assignedCollab for the project
      csvData[projectIndex].assignedCollab = JSON.stringify(assignedCollabData);

      // Convert the updated data back to CSV
      const updatedCSV = convertToCSV(csvData);

      // Save the updated CSV file
      fs.writeFileSync(csvPath, updatedCSV);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
// Function to write updated projects back to the CSV
function writeCSV(projects) {
  const data = projects.map((project) => {
    // Convert assignedCollab back to string format for CSV
    project.assignedCollab = JSON.stringify(project.assignedCollab);
    return project;
  });

  const csvString = data
    .map((project) =>
      `${project.id},${project.name},${project.assignedCollab}`
    )
    .join('\n');

  // Add the header line for CSV
  const csvHeader = 'id,name,assignedCollab\n';

  fs.writeFile(csvPath, csvHeader + csvString, 'utf8', (err) => {
    if (err) {
      console.error('Error writing CSV:', err);
    }
  });
}
exports.updateSingleProject = (req, res) => {
  console.log('Update Single Project');
  const updatedProject = req.body;
  const input = fs.readFileSync(csvPath);
  const records = parse(input, {
      columns: true,
      skip_empty_lines: true
    });
  const updatedRecords = records.map(project => {
      if (project.id === updatedProject.id.toString()) {
        return {
          ...project,
          ...updatedProject,
          Collaborator: JSON.stringify(updatedProject.Collaborator || [])
        };
      }
      return project;
    });
  const updatedCsv = stringify(updatedRecords, { header: true });
  fs.writeFileSync(csvPath, updatedCsv, 'utf8');
  return res.json({ message: 'Project updated successfully' });
};
