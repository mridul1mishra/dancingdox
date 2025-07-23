const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');
const os = require('os');
const { saveUploadedFile } = require('../utils/fileUploader');
const pool = require('../utils/sql');
const { updateProjectInCSV } = require('../utils/updateproject');
const { updateCollabInSQL } = require('../utils/updateprojectsql');
const { updateProjectInSQL } = require('../utils/updateprojectsql');
const { getProjectByIdFromCSV } = require('../utils/getprojectfromcsv');
const { getProjectByIdFromSQL } = require('../utils/getprojectfromsql');
const { updatedocAssignedInSQL } = require('../utils/updateprojectsql');
const notificationService   = require('../utils/nofitication/notificationservice');

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
  project.supportingfile = {
      filename: file.filename,
  originalname: file.originalname,
  fieldName: "supportingfile",
  filePath: project.uploadedFilePath,
  uploadedFilePath: project.uploadedFilePath,
  type: '.' + file.originalname.split('.').pop(), // e.g. '.pdf'
  maxSize: 100,
  sizeUnit: 'Mb',
  status: 'uploaded',
  uploadTime: new Date().toISOString(),
  };
  
  // Sanitize commas and newlines in string fields
 const params = [
  project.id,
  project.projectName,
  project.startDate,
  project.endDate,
  project.projectScope,
  project.projectDetails,
  project.supportStaff,
  project.Host,
  project.status,
  project.reminder,
  project.supportingfile,
];

const sanitizedParams = sanitizeParams(params);

const [result] = await pool.execute(
  'INSERT INTO projects (ID, ProjectName, startDate, endDate, visibility, projectdetails, members, host, status, reminder, supportingfiles) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  sanitizedParams
);
notificationService.insertNotification(project.Host, 'Project Added successfully', 'success');
  res.status(201).json({ message: 'Project created successfully', insertId: result.insertId });
} catch (error) {
    console.error('Error inserting project:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

};
exports.deleteProject = async (req, res) => {
  const ID = req.body.id;
  console.log(ID);
 const [result] = await pool.execute('DELETE FROM projects WHERE id = ?', [Number(ID)]);
 notificationService.insertNotification(email, 'Project was deleted', 'success');
 if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ message: 'Project deleted successfully' });
};
function sanitizeParams(params) {
  return params.map(value => value === undefined ? null : value);
}
exports.getCSV = async (req, res) => {
  try{
    const [rows] = await pool.execute('SELECT * FROM projects');
    const cleanedProjects1 = rows.map(p => {
  const sf = parseSampleFile(p.samplefile);
  console.log('samplefile:', sf);
  return { ...p, samplefile: sf };
});
    
  res.json(cleanedProjects1);
  }catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
};
// Helpers
function cleanString(str) {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}

function parseJSON(str, fallback) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

function parseSampleFile(raw) {
  console.log("⚙️ parseSampleFile called");
  if (!raw) {
    console.warn("⚠️ samplefile is empty or null");
    return null;
  }

  let str = raw.trim();

  let attempts = 0;
  while (
    (str.startsWith('"') && str.endsWith('"')) &&
    attempts < 5 // safety limit
  ) {
    str = str.slice(1, -1).replace(/""/g, '"');
    attempts++;
    console.log(`🧹 Unwrapped and unescaped string (attempt ${attempts}):`, str);
  }

  const splitIndex = str.indexOf('}",[');
  console.log("🔍 splitIndex:", splitIndex);

  if (splitIndex === -1) {
    console.error("❌ No valid separator found, returning null");
    return null;
  }

  const firstPart = str.slice(0, splitIndex + 2);
  const secondPart = str.slice(splitIndex + 3);
const firstPartUnescaped = firstPart.slice(1, -1).replace(/""/g, '"');
const parsedFirst = JSON.parse(firstPartUnescaped);
  console.log("🧩 First JSON part:", firstPart);
  console.log("🧩 Second JSON part:", secondPart);
  const parsedSecond = JSON.parse(secondPart);

  console.log("✅ Successfully parsed both parts:");
  console.log("   First:", parsedFirst);
  console.log("   Second:", parsedSecond);

  return [parsedFirst, ...parsedSecond];
}







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
exports.updateSingleProject = async (req, res) => {
  try {
    updatedProject = req.body;
    const {projectId, collabCount, Status} = req.body;
    if (updatedProject.Collaborator) {
    const result = updateProjectInCSV(csvPath, updatedProject);
    if (result.status !== 200) {
      return res.status(result.status).json({ error: result.error });
    }
    return res.json({ message: result.message });
  }    
    await updateProjectInSQL(projectId, collabCount, Status, res);
  } catch (error) {
    console.error('Failed to update project:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateCollaboraborforProject = async (req, res) => {
  const collab = req.body;
  try{
  const project = await updateCollabInSQL(collab);
  console.log(project)
  if (project) {
    res.status(200).json({ project });
    }
    return res.status(404).json({ message: 'Project not found' });
  }catch (err) {
    console.error('Error in /project/:id:', err); // This helps!
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getProjectById = async (req, res) => {
  const id = req.params.id;
  try {
    const project = await getProjectByIdFromCSV(csvPath, id);
    if (project) {
    return res.json({ source: 'csv', project });
    }
    const projectsql = await getProjectByIdFromSQL(id);
    console.log(projectsql);
     if (projectsql) {
      return res.json({ source: 'sql', project: projectsql });
    }

    return res.status(404).json({ message: 'Project not found' });
  } catch (err) {
    console.error('Error in /project/:id:', err); // This helps!
    res.status(500).json({ message: 'Internal server error' });
  }
  
};
exports.updatedocAssignedforProject = async (req, res) => {
const {docassigned, projectID} = req.body;
try{
await updatedocAssignedInSQL(docassigned, projectID);
return res.json({ success: true, message: 'Documents assigned successfully' });

}catch (err) {
    console.error('Error in /project/:id:', err); // This helps!
    res.status(500).json({ message: 'Internal server error' });
  }

};
