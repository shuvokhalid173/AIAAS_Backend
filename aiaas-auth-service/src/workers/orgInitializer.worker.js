const { Worker } = require('../infrastructure/queue');
const redisClient = require('../infrastructure/redis.db');
const orgRepository = require('../repositories/org.repository');

// Create a worker to process from the 'orgInitializerQueue' queue
const orgInitializerWorker = new Worker('orgInitializerQueue', async job => {
    if (job.name === 'initializeOrg') {
        const { orgId, createdBy } = job.data;
        try {
            await initializeRolesAndPermissionsForNewlyCreatedOrg(orgId, createdBy);
        } catch (error) {
            console.error(`Failed to initialize organization for organization ID ${orgId}: ${error.message}`);
            throw error;
        }
    } 
}, {
    connection: redisClient,
});

orgInitializerWorker.on('completed', job => {
    console.log(`Job ${job.id} has completed!`);
    // make an http call to the auth service to update the user status to active if the job is email verification
    if (job.name === 'initializeOrg') {
        console.log(`Organization initialization completed for organization ID ${job.data.orgId}`);
        // later plan: todo: call notification service to notify the user that the organization has been created successfully with initialization of Org_Owner role and permissions
    }

});

orgInitializerWorker.on('failed', (job, err) => {
    console.error(`Job ${job.id} has failed with error: ${err.message}`);
    // later plan: todo: call notification service to notify the user that the organization has been created successfully. But initialization of Org_Owner role and permissions has failed. Also provide a link to retry the initialization.
});

async function initializeRolesAndPermissionsForNewlyCreatedOrg(orgId, createdBy) {
    await orgRepository.initializeRolesAndPermissionsForNewlyCreatedOrg(orgId, createdBy);
}