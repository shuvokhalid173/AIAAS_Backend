const { S3Client } = require("@aws-sdk/client-s3");
const config = require("../config/config");

const s3 = new S3Client({
  region: config.s3.region,
  endpoint: config.s3.endpoint,
  credentials: {
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey,
  },
  forcePathStyle: true, // VERY IMPORTANT for MinIO
});

module.exports = s3;
