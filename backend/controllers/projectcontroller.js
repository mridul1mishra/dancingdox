const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');
const os = require('os');
const { saveUploadedFile } = require('../utils/fileUploader');
const pool = require('../utils/sql');

const csvPath = path.join(__dirname, '../public/projects.csv');

exports.addProject = async (req, res) => {
  try{  
  const file = req.file;
  const project = JSON.parse(req.body.project);
  if (!project) {
    return res.status(400).send('No data received');
  }
  let filePath = null;

  if (file) {
      filePath = await saveUploadedFile(file);
      project.uploadedFilePath = filePath;
  }
  project.samplefile = {
      filename: file.filename,
      originalname: file.originalname,
      fieldName: "supportingfile",
      filePath: project.uploadedFilePath
  };
  function sanitizeParams(params) {
  return params.map(value => value === undefined ? null : value);
}
  // Sanitize commas and newlines in string fields
 const escape = (value) => {
  if (typeof value === 'string') {
    return `"${value.replace(/"/g, '""').replace(/\r?\n|\r/g, ' ')}"`;  // also remove newlines
  }
  return value;
  };
console.log('project name',escape(project.supportStaff));
 const params = [
  project.id,
  escape(project.projectName),
  project.startDate,
  project.endDate,
  escape(project.projectScope),
  escape(project.projectDetails),
  escape(project.supportStaff),
  escape(project.Host),
  escape(project.status),
  project.reminder,
  escape(JSON.stringify(project.samplefile)),
];

const sanitizedParams = sanitizeParams(params);

const [result] = await pool.execute(
  'INSERT INTO projects (ID, ProjectName, startDate, endDate, visibility, projectdetails, members, host, status, reminder, samplefile) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  sanitizedParams
);
  res.status(201).json({ message: 'Project created successfully', insertId: result.insertId });
} catch (error) {
    console.error('Error inserting project:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

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
  const incomingProjects  = req.body.projects;
   // Better for nested structures // Log the entire request body
  // Validate that incomingProjects is an array and that each project contains the expected fields
  if (!Array.isArray(incomingProjects)) {
    return res.status(400).send('Invalid format: projects should be an array');
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
      p => Number(p.id) === Number(row.id) 
    );
    console.log(match);
    if (match) {
      console.log(`Updating for ID: ${match.id}`);
      console.log('Matched project data:', match);

      // Ensure that documents is properly handled
      const documents = Array.isArray(match.documents)
        ? JSON.stringify(match.documents).replace(/"/g, '""') // Escape for CSV
        : ''; // Empty string if no documents
      console.log(documents);
      return {
        ...row,
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
  try {
    const updatedProject = req.body;
    const collab = req.body.Collaborator;
    const {projectId, collabCount, status} = req.body;
    if (!updatedProject || !updatedProject.id) {
      return res.status(400).json({ error: 'Invalid project data' });
    }

    const input = fs.readFileSync(csvPath, 'utf8');

    const records = parse(input, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      trim: true
    });

    const updatedRecords = records.map(project => {
      if (project.id === String(updatedProject.id)) {
         console.log('✅ Matched project:', project);
         console.log('Updated Collaborator:', updatedProject.Collaborator);
         let collabData = updatedProject.Collaborator;
          if (typeof collabData === 'string') {
            try {
              collabData = JSON.parse(collabData);
            } catch {
              collabData = []; // fallback
            }
          }
        return {
          ...project,
          ...updatedProject,
          Collaborator: JSON.stringify(collabData)
        };
      }
      return project;
    });

    const updatedCsv = stringify(updatedRecords, { header: true });
    fs.writeFileSync(csvPath, updatedCsv, 'utf8');

    console.log(`Project ${updatedProject.id} updated successfully.`);
    return res.json({ message: 'Project updated successfully' });

  } catch (error) {
    console.error('Failed to update project:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getProjectById = (req, res) => {
  const id = req.params.id;
  try {
    // Read and parse the CSV
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    const records = parse(fileContent, {
  columns: true,
  skip_empty_lines: true,
  trim: true,
  relax_quotes: true,       // ← allows improperly closed quotes
  quote: '"',
  escape: '"'
});
    // Find the project by ID (note: all CSV values are strings)
    const project = records.find(p => p.id.trim() === id.toString().trim());
if (project) {
  // Parse the documents field after finding the project
  try {
    project.documents = JSON.parse(project.documents.replace(/""/g, '"'));
  } catch (error) {
    console.error('Error parsing documents:', error);
    project.documents = [];  // or set to null depending on your requirement
  }
} else {
  console.log('Project not found');
}
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    console.error('Error reading project:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
