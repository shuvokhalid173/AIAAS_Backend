const express = require('express');

const config = require('./config/config');
const uploadRouter = require('./routes/upload.route');

const app = express();
const PORT = config.port || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Use the upload router for handling file uploads
app.use('/api', uploadRouter);
app.use('/api', require('./routes/file.route'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});