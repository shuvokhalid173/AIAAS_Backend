const s3 = require("../minio/minio.client");
const express = require("express");
const { GetObjectCommand } = require("@aws-sdk/client-s3");

const router = express.Router();

router.get("/files", async (req, res) => {
   try {
    const { key } = req.query;

    const command = new GetObjectCommand({
      Bucket: "ragfiles",
      Key: key,
    });

    const response = await s3.send(command);

    // Set headers (optional but recommended)
    res.setHeader("Content-Type", response.ContentType || "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${key}"`
    );

    // STREAM the file
    response.Body.pipe(res);

  } catch (err) {
    console.error(err);
    res.status(404).json({ message: "File not found" });
  }
});

module.exports = router;