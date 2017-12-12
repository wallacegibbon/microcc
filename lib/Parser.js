const {
  WhileStatement, DoStatement, ForStatement, SwitchStatement, IfStatement,
  ContinueStatement, BreakStatement, ReturnStatement,
} = require("./Statement");

const Reader = require("./Reader");
const { CSyntaxError, EndOfFile } = require("./errors");
const kwmap = require("./kwmap");
const KW = require("./KW");
const TK = require("./TK");



class Parser {
  /**
   * @param {Buffer|Int8Array} code - The content to be passed to Reader.
   */
  constructor(code) {
    this.reader = new Reader(code);
  }


  getStatement() {
    const tk = this.reader.getToken();
    return tk;
  }


  syntaxTree() {
  }
}



module.exports = Parser;

