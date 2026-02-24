// BullMQ configuration and setup
const { Queue, Worker } = require('bullmq');
const redisClient = require('./redis.db');

module.exports = {
    Queue: Queue,
    Worker: Worker,
    redisClient: redisClient
};
