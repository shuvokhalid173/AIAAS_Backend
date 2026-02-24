const authRoutes = require('./auth.route');
const healthRoutes = require('./health.route');
const aiaasServiceRoutes = require('./aiaasService.route');
const orgRoutes = require('./org.route');

module.exports = {
    auth: authRoutes,
    health: healthRoutes,
    aiaasService: aiaasServiceRoutes,
    org: orgRoutes
}