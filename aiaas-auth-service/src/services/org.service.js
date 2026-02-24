// org service will use org.repository.js to interact with the database and perform business logic related to organizations.
const redisClient = require('../infrastructure/redis');
const orgRepository = require('../repositories/org.repository');
const { Queue, redisClient: redisClientForBull } = require('../infrastructure/queue');
const InputValidator = require('../utils/input.validator');

const orgInitializationQueue = new Queue('orgInitialSetup', {
    connection: redisClientForBull
});

async function createOrg(orgData) {
    const { name, slug, created_by } = orgData;

    // Validate input data
    new InputValidator('Organization Name', name).required().minLength(3).maxLength(100);
    new InputValidator('Organization Slug', slug).required().minLength(3).maxLength(50);
    new InputValidator('Created By', created_by).required();

    try {
        // Insert the organization into the database
        const org = await orgRepository.insertOrg(orgData);
        // Add a job to the queue for any additional setup tasks (e.g., creating roles, permissions, etc.)
        await orgInitializationQueue.add('initializeOrg', { orgId: org.id });
        return org;
    } catch (err) {
        throw err;
    }
}

async function getAllOrgsOfUser(userId) {
    new InputValidator('User ID', userId).required();

    try {
        const cachedOrgsOfUser = await redisClient.get(`user:${userId}:orgs`);
        if (cachedOrgsOfUser) {
            return JSON.parse(cachedOrgsOfUser);
        }
        const orgs = await orgRepository.listOrgsForUser(userId);
        await redisClient.setex(`user:${userId}:orgs`, 300, JSON.stringify(orgs)); // Cache for 5 minutes
        return orgs;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    createOrg,
    getAllOrgsOfUser
};

