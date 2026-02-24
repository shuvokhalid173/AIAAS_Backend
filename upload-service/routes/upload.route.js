const express = require("express");
const multer = require("multer");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../minio/minio.client");

const router = express.Router();

// Multer in-memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "File missing" });
    }

    const objectKey = `ragfiles/${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: "ragfiles",
      Key: objectKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3.send(command);

    // Emit job later (Kafka / BullMQ / SQS)
    // jobQueue.publish({ objectKey });

    res.json({
      message: "File uploaded successfully",
      objectKey,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
