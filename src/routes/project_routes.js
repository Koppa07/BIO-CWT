const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project_controller');

router.get('/projects', projectController.getProjects);
router.post('/projects', projectController.createProject);
router.patch('/projects/:id', projectController.updateProject);
router.delete('/projects/:id', projectController.deleteProject)

module.exports = router;