const ParserStrategy = require("./parser");
const mammoth = require("mammoth");

class MSWordParser extends ParserStrategy {
  async parse(buffer) {
    const result = await mammoth.extractRawText({ buffer });

    return result.value;
  }
}

module.exports = MSWordParser;
