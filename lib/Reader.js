const { LexicalError, EndOfFile } = require("./errors");
const { selectFields } = require("./utils");
const Token = require("./Token");
const CH = require("./CH");
const TK = require("./TK");



class Reader {
  /**
   * Int8Array is supported by Both modern browsers and Node.js, Buffer is only
   * supported by Node.js.
   * @param {Buffer|Int8Array} code
   */
  constructor(code) {
    if (code.constructor !== Buffer && code.constructor !== Int8Array)
      throw new LexicalError(`Only Buffer or Int8Array input are supported`);
    Object.assign(this, { code, cursor: 0, line: 1, ch: code[0] });
  }


  /**
   * Get one character from the input source, will change the line number when
   * newline is detected.
   */
  getChar() {
    if (this.cursor >= this.code.length - 1)
      throw new EndOfFile();

    this.ch = this.code[++this.cursor];
    if (checkNewline(this.ch))
      this.line++;

    return this.ch;
  }


  /**
   * Get an identifier from the input source. It could be a variable, a type,
   * or a keyword.
   */
  getIdentifier() {
    const currentLine = this.line;
    var ret = String.fromCharCode(this.ch);
    while (checkSymbolNotEnd(this.getChar()))
      ret += String.fromCharCode(this.ch);
    return new Token(TK.IDENT, ret, currentLine);
  }


  /**
   * In C language, "\a" means bell(ascii code 7), which is different from JS.
   * C string and C character have the same rule for escape sequences.
   */
  getString() {
    const currentLine = this.line;
    var ret = "";
    while (this.getChar()) {
      if (this.ch === CH["\\"]) {
        this.getChar();
        ret += String.fromCharCode(this.restoreEscaped());
      } else if (this.ch === CH['"']) {
        this.getChar();
        return new Token(TK.CSTR, ret, currentLine);
      } else if (checkNewline(this.ch)) {
        throw new LexicalError(`Missing terminating '"'`, currentLine);
      } else {
        ret += String.fromCharCode(this.ch);
      }
    }
  }


  /**
   * Get a character literal from input source. The escape sequence is handled
   * in the same way as getString.
   */
  getCharacter() {
    const currentLine = this.line;
    var c = this.getChar();
    if (c === CH["\\"])
      c = this.restoreEscaped();

    if (this.getChar() === CH["'"]) {
      this.getChar();
      return new Token(TK.CCHAR, c, currentLine);
    } else {
      throw new LexicalError(`Missing terminating "'"`, currentLine);
    }
  }


  /**
   * Handle the escape sequence transformation, (\a => 7, \n => 10, etc)
   * @returns {Number}
   */
  restoreEscaped() {
    switch (this.ch) {
    case CH.x:
      const x1 = this.getChar(), x2 = this.getChar();
      if (!(checkHex(x1) && checkHex(x2)))
        throw new LexicalError(`\\x should follow hex digits`, this.line);
      return hexToNum(x1) * 16 + hexToNum(x2);
    case CH.a:
      return 7;
    case CH.b:
      return 8;
    case CH.t:
      return 9;
    case CH.n:
      return 10;
    case CH.v:
      return 11;
    case CH.f:
      return 12;
    case CH.r:
      return 13;
    case CH["0"]:
      return 0;
    default:
      return this.ch;
    }
  }


  /**
   * Get a number from the input source. It could be integer or float.
   * @param {Boolean} withPoint - Add a "." in front of the number or not.
   * @returns {Number}
   */
  getNumberBasic(withPoint) {
    var ret = String.fromCharCode(this.ch);
    if (withPoint)
      ret = "." + ret;

    while (checkNumber(this.getChar()))
      ret += String.fromCharCode(this.ch);

    return Number(ret);
  }


  /**
   * Wrapper for getNumberBasic, will wrap the type with it.
   */
  getNumber() {
    const num = this.getNumberBasic();
    const currentLine = this.line;
    if (num % 1 > 0)
      return new Token(TK.CFLOAT, num, currentLine);
    else
      return new Token(TK.CINT, num, currentLine);
  }


  /**
   * There are 3 kinds of things who starts with a ".":
   * 1. function parameter(...)
   * 2. float number
   * 3. dot
   */
  getDotOrEllipsisOrNumber() {
    const currentLine = this.line;
    this.getChar();
    if (this.ch === CH["."]) {
      if (this.getChar() === CH["."]) {
        this.getChar();
        return new Token(TK.ELLIPSIS, null, currentLine);
      } else {
        throw new LexicalError(`".." is not valid C element`, currentLine);
      }
    } else if (checkInteger(this.ch)) {
      return new Token(TK.CFLOAT, this.getNumberBasic(true), currentLine);
    } else {
      return new Token(TK.DOT, null, currentLine);
    }
  }


  getMinusOrPointsto() {
    const currentLine = this.line;
    this.getChar();
    if (this.ch === CH[">"]) {
      this.getChar();
      return new Token(TK.POINTSTO, null, currentLine);
    } else {
      return new Token(TK.MINUS, null, currentLine);
    }
  }


  getAssignOrEqual() {
    const currentLine = this.line;
    this.getChar();
    if (this.ch === CH["="]) {
      this.getChar();
      return new Token(TK.EQ, null, currentLine);
    } else {
      return new Token(TK.ASSIGN, null, currentLine);
    }
  }


  getGtOrGeq() {
    const currentLine = this.line;
    this.getChar();
    if (this.ch === CH["="]) {
      this.getChar();
      return new Token(TK.GEQ, null, currentLine);
    } else {
      return new Token(TK.GT, null, currentLine);
    }
  }


  getLtOrLeq() {
    const currentLine = this.line;
    this.getChar();
    if (this.ch === CH["="]) {
      this.getChar();
      return new Token(TK.LEQ, null, currentLine);
    } else {
      return new Token(TK.LT, null, currentLine);
    }
  }


  getExclamationOrNeq() {
    const currentLine = this.line;
    this.getChar();
    if (this.ch === CH["="]) {
      this.getChar();
      return new Token(TK.NEQ, null, currentLine);
    } else {
      return new Token(TK.EXCLAMATION, null, currentLine);
    }
  }


  getAndOrDand() {
    const currentLine = this.line;
    this.getChar();
    if (this.ch === CH["&"]) {
      this.getChar();
      return new Token(TK.DAND, null, currentLine);
    } else {
      return new Token(TK.AND, null, currentLine);
    }
  }


  getOrOrDor() {
    const currentLine = this.line;
    this.getChar();
    if (this.ch === CH["|"]) {
      this.getChar();
      return new Token(TK.DOR, null, currentLine);
    } else {
      return new Token(TK.OR, null, currentLine);
    }
  }


  toMultilineCommentEnd() {
    while (this.ch !== CH["*"])
      this.getChar();

    if (this.getChar() === CH["/"]) {
      this.getChar();
      return;
    } else {
      this.toMultilineCommentEnd();
    }
  }


  getDivideOrComments() {
    const currentLine = this.line;
    this.getChar();
    if (this.ch === CH["/"]) {
      while (!checkNewline(this.ch))
        this.getChar();
      return new Token(TK.COMMENT2, null, currentLine);

    } else if (this.ch === CH["*"]) {
      this.toMultilineCommentEnd();
      return new Token(TK.COMMENT1, null, currentLine);

    } else {
      return new Token(TK.DIVIDE, null, currentLine);
    }
  }


  getRet(tokenType) {
    const currentLine = this.line;
    this.getChar();
    return new Token(tokenType, null, currentLine);
  }


  getToken() {
    while (checkSpace(this.ch))
      this.getChar();

    if (checkSymbolStart(this.ch))
      return this.getIdentifier();

    if (checkInteger(this.ch))
      return this.getNumber();

    if (this.ch === CH["."])
      return this.getDotOrEllipsisOrNumber();

    if (this.ch === CH['"'])
      return this.getString();

    if (this.ch === CH["'"])
      return this.getCharacter();

    if (this.ch === CH["-"])
      return this.getMinusOrPointsto();

    if (this.ch === CH["="])
      return this.getAssignOrEqual();

    if (this.ch === CH["!"])
      return this.getExclamationOrNeq();

    if (this.ch === CH[">"])
      return this.getGtOrGeq();

    if (this.ch === CH["<"])
      return this.getLtOrLeq();

    if (this.ch === CH["&"])
      return this.getAndOrDand();

    if (this.ch === CH["|"])
      return this.getOrOrDor();

    if (this.ch === CH["/"])
      return this.getDivideOrComments();

    if (this.ch === CH["*"])
      return this.getRet(TK.ASTERISK);

    if (this.ch === CH["+"])
      return this.getRet(TK.PLUS);

    if (this.ch === CH["%"])
      return this.getRet(TK.MOD);

    if (this.ch === CH["("])
      return this.getRet(TK.OPENPA);

    if (this.ch === CH[")"])
      return this.getRet(TK.CLOSEPA);

    if (this.ch === CH["["])
      return this.getRet(TK.OPENBR);

    if (this.ch === CH["]"])
      return this.getRet(TK.CLOSEBR);

    if (this.ch === CH["{"])
      return this.getRet(TK.BEGIN);

    if (this.ch === CH["}"])
      return this.getRet(TK.END);

    if (this.ch === CH[","])
      return this.getRet(TK.COMMA);

    if (this.ch === CH[";"])
      return this.getRet(TK.SEMICOLON);

    if (this.ch === CH["^"])
      return this.getRet(TK.CARET);

    if (this.ch === CH["?"])
      return this.getRet(TK.QUESTION);

    if (this.ch === CH[":"])
      return this.getRet(TK.COLON);

    if (this.ch === CH["~"])
      return this.getRet(TK.TILDE);

    throw new LexicalError(
      `Unexpected character: ${String.fromCharCode(this.ch)}`,
      this.line
    );
  }


  tokenize() {
    const result = [];
    try {
      while (true) result.push(this.getToken());
    } catch (e) {
      if (e.constructor === EndOfFile) {
        result.push(new Token(TK.EOF, null, this.line));
        return result;
      } else {
        throw e;
      }
    }
  }

}



function checkSpace(ch) {
  return checkNewline(ch) || ch === CH.sp || ch === CH.ht;
}


function checkNewline(ch) {
  return ch === CH.nl || ch === CH.cr;
}


function checkSymbolStart(ch) {
  return checkLatin(ch) || ch === CH["_"];
}


function checkSymbolNotEnd(ch) {
  return checkLatin(ch) || checkInteger(ch) || ch === CH["_"];
}


function checkLatin(ch) {
  return (ch >= CH.a && ch <= CH.z) || (ch >= CH.A && ch <= CH.Z);
}


function checkInteger(ch) {
  return ch >= CH["0"] && ch <= CH["9"];
}


function checkNumber(ch) {
  return checkInteger(ch) || ch == CH["."];
}


function checkA2F(ch) {
  return (ch >= CH.a && ch <= CH.f) || (ch >= CH.A && ch <= CH.F);
}


function checkHex(ch) {
  return checkInteger(ch) || checkA2F(ch);
}


function hexToNum(ch) {
  if (checkInteger(ch))
    return ch - CH["0"];
  if (ch >= CH.a && ch <= CH.f)
    return 10 + ch - CH.a;
  if (ch >= CH.A && ch <= CH.F)
    return 10 + ch - CH.A;

  throw new LexicalError(`Invalid hex character: ${ch}`);
}


module.exports = Reader;

