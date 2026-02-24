// authentication routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { isAuthenticated } = require('../middlewares');

// auth test route
router.get('/auth/test', (req, res) => {
    res.status(200).json({ message: 'Auth route is working!' });
});
// Register route
router.post('/auth/register', authController.register);
// Login route
router.post('/auth/login', authController.login);
// Update user auth status route
// automated call from queue worker to update user auth status based on verification results
router.post('/auth/update-user-status', isAuthenticated, authController.updateUserAuthStatus);
// Refresh token route
router.post('/auth/refresh', authController.refresh);
// Logout route
router.post('/auth/logout', isAuthenticated, authController.logout);

module.exports = router;