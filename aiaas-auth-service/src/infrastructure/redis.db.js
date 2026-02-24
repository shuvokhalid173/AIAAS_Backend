const Redis = require("ioredis");
const { redis: redisConfig } = require('../configs/env.config');

const redisClient = new Redis({
    host: redisConfig.host,
    port: redisConfig.port,
    maxRetriesPerRequest: null,
});

redisClient.on("connect", () => {
    console.log("Connected to Redis server");
});

console.log('Connected to Redis');

module.exports = redisClient;