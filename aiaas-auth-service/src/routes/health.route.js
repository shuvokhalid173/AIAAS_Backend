// Health check route for monitoring and Docker health checks
const express = require('express');
const router = express.Router();
const mysqlDb = require('../infrastructure/mysql.db');
const redisClient = require('../infrastructure/redis.db');

router.get('/health', async (req, res) => {
    const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'auth-service',
        checks: {
            database: 'unknown',
            redis: 'unknown'
        }
    };

    try {
        // Check MySQL connection
        await mysqlDb.query('SELECT 1');
        health.checks.database = 'healthy';
    } catch (error) {
        health.checks.database = 'unhealthy';
        health.status = 'unhealthy';
    }

    try {
        // Check Redis connection
        await redisClient.ping();
        health.checks.redis = 'healthy';
    } catch (error) {
        health.checks.redis = 'unhealthy';
        health.status = 'unhealthy';
    }

    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
});

module.exports = router;
