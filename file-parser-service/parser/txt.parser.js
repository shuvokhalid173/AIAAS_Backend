const ParserStrategy = require("./parser");

class TXTParser extends ParserStrategy {
    async parse(buffer) {
        /*
          Preserve original sequence exactly.
          No trimming. No normalization.
        */
        return buffer.toString("utf-8");
    }
}

module.exports = TXTParser;
