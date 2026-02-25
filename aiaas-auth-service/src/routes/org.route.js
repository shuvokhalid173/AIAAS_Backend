const express = require('express');
const router = express.Router();
const orgController = require('../controllers/org.controller');
const { isAuthenticated } = require('../middlewares');

// create organization route
router.post('/orgs', isAuthenticated, orgController.createOrg);
// get all organizations for a user route
router.get('/orgs/u/:userId', isAuthenticated, orgController.getAllOrgsOfUser);
// switch organization route
router.post('/orgs/switch', isAuthenticated, orgController.switchOrg);

module.exports = router;