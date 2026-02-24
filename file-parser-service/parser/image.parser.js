const ParserStrategy = require("./parser");
const { createWorker } = require("tesseract.js");
const fs = require("fs");
const path = require("path");
const os = require("os");

class ImageParser extends ParserStrategy {
  async parse(buffer) {
    const tempPath = path.join(
      os.tmpdir(),
      `ocr-${Date.now()}.png`
    );

    fs.writeFileSync(tempPath, buffer);

    const worker = await createWorker("eng");

    try {
      const {
        data: { text },
      } = await worker.recognize(tempPath);

      return text;
    } finally {
      await worker.terminate();
      fs.unlinkSync(tempPath);
    }
  }
}

module.exports = ImageParser;
