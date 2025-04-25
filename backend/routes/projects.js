const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectcontroller');

router.post('/add-project', projectController.addProject);
router.get('/csv-to-json', projectController.getCSV);
router.post('/update-projects', projectController.updateProjects);

module.exports = router;
