const pdfParse = require("pdf-parse");

async function isScannedPdf(buffer) {
    const data = await pdfParse(buffer);

    /*
      Trim + length check:
      - Text PDFs always have meaningful length
      - Scanned PDFs return empty or near-empty text
    */
    const text = data.text.replace(/\s+/g, "");

    return text.length < 20;
}

module.exports = {
    isScannedPdf,
};
