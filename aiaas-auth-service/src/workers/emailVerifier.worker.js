const { Worker } = require('../infrastructure/queue');
const axios = require('axios');
const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3000/api';
const redisClient = require('../infrastructure/redis.db');

// Create a worker to process from the 'emailQueue' queue
const emailWorker = new Worker('emailQueue', async job => {
    if (job.name === 'emailVerification') {
        const { email, userId } = job.data;
        await simulateEmailSending();
        await simulateEmailVerification();
        console.log(`Email verification sent to ${email} for user ID ${userId}`);
    } else if (job.name === 'sendWelcomeEmail') {
        const { email, userId } = job.data;
        await simulateEmailSending();
        console.log(`Welcome email sent to ${email} for user ID ${userId}`);
    }
}, {
    connection: redisClient,
});

emailWorker.on('completed', job => {
    console.log(`Job ${job.id} has completed!`);
    // make an http call to the auth service to update the user status to active if the job is email verification
    if (job.name === 'emailVerification') {
        const updateUserStatusUrl = `${authServiceUrl}/auth/update-user-status`;
        const { userId, email } = job.data;
        axios.post(updateUserStatusUrl, {
            userId,
            email,
            is_email_verified: true,
        }).then(response => {
            console.log(`User status updated successfully for user ID ${userId}`);
        }).catch(error => {
            console.error(`Failed to update user status for user ID ${userId}: ${error.message}`);
        });
    }

});

emailWorker.on('failed', (job, err) => {
    console.error(`Job ${job.id} has failed with error: ${err.message}`);
});

const simulateEmailSending = async (delay = 2000) => await new Promise(resolve => setTimeout(resolve, delay));

const simulateEmailVerification = async (delay = 2000) => await new Promise(resolve => setTimeout(resolve, delay));