// aiaasService route will use aiaasService.controller.js to handle incoming requests and send responses related to AI as a Service.
const express = require('express');
const router = express.Router();
const aiaasServiceController = require('../controllers/aiaasService.controller');

// get aiaas service by id route
router.get('/aiaas-service/:id', aiaasServiceController.getAiaasServiceById);
// get all aiaas services route
router.get('/aiaas-services', aiaasServiceController.getAllAiaasServices);

module.exports = router;