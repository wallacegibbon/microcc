const { ReaderError, EndOfFile } = require("./errors");
const { selectFields } = require("./utils");
const CH = require("./CH");



class Reader {
  /**
   * Int8Array is supported by Both modern browsers and Node.js, Buffer is only
   * supported by Node.js.
   * @param {Buffer|Int8Array} code
   */
  constructor(code) {
    if (code.constructor !== Buffer && code.constructor !== Int8Array)
      throw new ReaderError(`Only Buffer or Int8Array objects are supported`);
    Object.assign(this, { code, cursor: 0, line: 1, ch: 0, prevCh: 0 });
  }


  /**
   * Return the current Reader states(like line number, cursor position...)
   */
  currentState() {
    return selectFields(this, [ "cursor", "line", "ch", "prevCh" ]);
  }


  /**
   * Read one character from the source, and update some inner variables.
   */
  getChar() {
    if (this.cursor >= this.code.length)
      throw new EndOfFile();

    this.prevCh = this.ch;
    this.ch = this.code[this.cursor++];
    if (this.ch === CH.newline)
      this.line++;
  }


  /**
   */
  getSym() {
  }
}



module.exports = Reader;

