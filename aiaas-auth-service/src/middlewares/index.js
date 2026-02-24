const isAuthenticated = require('./isAuthenticated.middleware');
const hasPermission = require('./hasPermission.middleware');

module.exports = {
    isAuthenticated,
    hasPermission
}