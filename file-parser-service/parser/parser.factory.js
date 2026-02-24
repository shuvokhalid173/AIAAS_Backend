const PDFParser = require('./pdf.parser');
const ImageParser = require('./image.parser');

class ParserFactory {
    static getParser(fileType) {
        switch (fileType) {
            case 'pdf':
                return new PDFParser();
            case 'image':
                return new ImageParser();
            case 'msword':
                const MSWordParser = require('./msword.parser');
                return new MSWordParser();
            default:
                throw new Error(`Unsupported file type: ${fileType}`);
        }
    }
}

module.exports = ParserFactory;