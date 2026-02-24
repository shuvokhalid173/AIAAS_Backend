const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: process.env.PORT || 3000,
  s3: {
    region: process.env.S3_REGION || 'us-east-1',
    endpoint: process.env.S3_CLIENT_ENDPOINT || 'http://localhost:9000',
    accessKeyId: process.env.S3_CLIENT_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.S3_CLIENT_SECRET_KEY || 'minioadmin',
  },
};