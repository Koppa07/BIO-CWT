const express = require('express');
const router = express.Router();
const materialController = require('../controllers/material_controller');

router.get('/materials', materialController.getMaterials);
router.post('/materials', materialController.createMaterial);
router.patch('/materials/:id', materialController.updateMaterial);
router.delete('/materials/:id', materialController.deleteMaterial);
router.post('/materials/:id/features', materialController.createMaterialFeature);
router.patch('/material-features/:id', materialController.updateMaterialFeature);
router.delete('/material-features/:id', materialController.deleteMaterialFeature);

module.exports = router;