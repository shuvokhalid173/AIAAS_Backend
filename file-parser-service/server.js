const ParserFactory = require('./parser/parser.factory');

const fileToParse = { name: 'a.png', type: 'image' };

try {
    const parser = ParserFactory.getParser(fileToParse.type);
    const result = parser.parse(fileToParse);
    console.log(result);
} catch (error) {
    console.error(error.message);
}