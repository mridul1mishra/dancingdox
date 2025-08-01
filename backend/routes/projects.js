const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectcontroller');
const notificationController = require('../controllers/getnotificationcontroller');
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
router.patch('/assigned-collaborators/:id', projectController.updateProjectDocumentsCollabs);
router.post('/update-project', upload.none(), projectController.updateSingleProject);
router.post('/update-project-collab', upload.none(), projectController.updateCollaboraborforProject);
router.post('/update-project-docAssigned', upload.none(), projectController.updatedocAssignedforProject);
router.post('/delete-project', projectController.deleteProject);
router.get('/project/:id', projectController.getProjectById);
router.get('/get-notification', notificationController.getNotifications);


module.exports = router;
