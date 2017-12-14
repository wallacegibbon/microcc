const { CSyntaxError, EndOfFile } = require("./errors");
const Reader = require("./Reader");
const kwmap = require("./kwmap");
const TK = require("./TK");



class Parser {
  /**
   * @param {Buffer|Int8Array} code - The content to be passed to Reader.
   */
  constructor(code) {
    this.reader = new Reader(code);
  }


  syntaxTree() {
    const tk = this.reader.getToken();
  }
}



module.exports = Parser;

