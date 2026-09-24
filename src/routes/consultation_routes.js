const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultation_controller');

router.get('/consultations', consultationController.getConsultaionRequests);
router.post('/consultations', consultationController.createConsultaionRequest);
router.patch('/consultations/:id', consultationController.updateConsultaionRequest);

module.exports = router;