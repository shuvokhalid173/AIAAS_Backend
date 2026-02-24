const ParserStrategy = require("./parser");
const pdfParse = require("pdf-parse");
const { isScannedPdf } = require("./pdf.detector");
const ImageParser = require("./image.parser");
const fs = require("fs");
const path = require("path");
const os = require("os");

/*
  This parser:
  - Detects text vs scanned PDF
  - Routes to correct extraction path
*/
class PDFParser extends ParserStrategy {
  async parse(buffer) {
    const scanned = await isScannedPdf(buffer);

    // Case 1: Text-based PDF
    if (!scanned) {
      const data = await pdfParse(buffer);
      return data.text;
    }

    // Case 2: Scanned PDF → OCR
    return await this.parseScannedPdf(buffer);
  }

  async parseScannedPdf(buffer) {
    /*
      We convert PDF → images page by page.
      For now, simplest safe approach:
      - write PDF to temp
      - OCR via ImageParser (page-by-page TODO: upgrade later)
    */

    const tempPdfPath = path.join(
      os.tmpdir(),
      `scanned-${Date.now()}.pdf`
    );

    fs.writeFileSync(tempPdfPath, buffer);

    const imageParser = new ImageParser();

    try {
      // Tesseract can OCR PDF directly
      const text = await imageParser.parse(
        fs.readFileSync(tempPdfPath)
      );

      return text;
    } finally {
      fs.unlinkSync(tempPdfPath);
    }
  }
}

module.exports = PDFParser;
