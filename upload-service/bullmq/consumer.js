const { Worker } = require('bullmq');
const connection = require('./redis');

const worker = new Worker(
  'email-queue',
  async (job) => {
    console.log(`📨 Attempt ${job.attemptsMade + 1} for job ${job.id}`);

    console.log('📨 Processing job:', job.id);
    console.log(job.data);

    if (Math.random() < 0.5) {
        throw new Error('Random failure');
    }
    // simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('✅ Email sent to:', job.data.to);
  },
  { connection },
);


worker.on('completed', (job) => {
  console.log(`🎉 Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.log(`❌ Job ${job.id} failed:`, err.message);
});
