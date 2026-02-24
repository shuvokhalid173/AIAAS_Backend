const express = require('express');
const { Queue } = require('bullmq');
const connection = require('./redis');

const app = express();
app.use(express.json());

const emailQueue = new Queue('email-queue', { connection });

app.post('/send-email', async (req, res) => {
  const { to, subject, body } = req.body;

  const job = await emailQueue.add('send-email', {
    to,
    subject,
    body,
  }, {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  });

  res.json({
    message: 'Email job queued',
    jobId: job.id,
  });
});

app.listen(3000, () => {
  console.log('Producer running on port 3000');
});
