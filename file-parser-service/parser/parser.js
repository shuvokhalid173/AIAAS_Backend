// Strategy interface
class ParserStrategy {
  parse(file) {
    throw new Error("parse() must be implemented");
  }
}

module.exports = ParserStrategy;