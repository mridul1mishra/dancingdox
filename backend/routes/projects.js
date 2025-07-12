const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectcontroller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/add-project', (req, res, next) => {
  if (req.is('multipart/form-data')) {
    upload.single('file')(req, res, next);
  } else {
    next();
  }
}, projectController.addProject);
router.get('/csv-to-json', projectController.getCSV);
router.post('/update-projects', projectController.updateProjects);
router.post('/updateProjectDocuments', projectController.updateProjectDocuments);
router.patch('/assigned-collaborators/:id', projectController.updateProjectDocumentsCollabs);
router.post('/update-project', projectController.updateSingleProject);
router.get('/project/:id', projectController.getProjectById);


module.exports = router;
