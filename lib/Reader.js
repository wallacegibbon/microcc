const { LexicalError, EndOfFile } = require("./errors");
const { selectFields } = require("./utils");
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
    Object.assign(this, { code, cursor: 0, line: 1, ch: 0, prevCh: 0 });
    this.ch = code[0];
  }


  /**
   * Get one character from the input source, will change the line number when
   * newline is detected.
   */
  getChar() {
    if (this.cursor >= this.code.length - 1)
      throw new EndOfFile();

    this.prevCh = this.ch;
    this.ch = this.code[++this.cursor];
    if (checkNewline(this.ch))
      this.line++;

    return this.ch;
  }


  /**
   * Get a word from input source. It could be variable, type or keyword.
   */
  getIdentifier() {
    var ret = String.fromCharCode(this.ch);
    while (checkSymbolNoEnd(this.getChar()))
      ret += String.fromCharCode(this.ch);
    return { type: TK.IDENT, value: ret };
  }


  /**
   * Get a number from the input source. It could be integer or float.
   */
  getNumber() {
    var ret = String.fromCharCode(this.ch);
    while (checkNumber(this.getChar()))
      ret += String.fromCharCode(this.ch);
    const n = Number(ret);
    if (n % 1 > 0)
      return { type: TK.CFLOAT, value: n };
    else
      return { type: TK.CINT, value: n };
  }


  /**
   * Get a string literal from the input source.
   * TODO: handle \n, \r, \a, ...
   */
  getString() {
    var ret = "";
    while (this.getChar()) {
      if (this.ch === CH['"']) {
        if (this.prevCh === CH["\\"]) {
          ret += String.fromCharCode(this.ch);
        } else {
          this.getChar();
          return { type: TK.CSTR, value: ret };
        }
      } else if (checkNewline(this.ch)) {
        throw new LexicalError("Unexpected end of string", this.line);
      } else {
        ret += String.fromCharCode(this.ch);
      }
    }
  }


  /**
   * Get a character literal from input source.
   * TODO: handle the '\' situation
   */
  getCharacter() {
    const c = this.getChar();
    this.getChar();
    if (this.ch === CH["'"]) {
      this.getChar();
      return { type: TK.CCHAR, value: c };
    } else {
      throw new LexicalError("Unexpected end of char", this.line);
    }
  }


  getMinusOrPointsto() {
    this.getChar();
    if (this.ch === CH[">"]) {
      this.getChar();
      return { type: TK.POINTSTO };
    } else {
      return { type: TK.MINUS };
    }
  }


  getAssignOrEqual() {
    this.getChar();
    if (this.ch === CH["="]) {
      this.getChar();
      return { type: TK.EQ };
    } else {
      return { type: TK.ASSIGN };
    }
  }


  getGtOrGeq() {
    this.getChar();
    if (this.ch === CH["="]) {
      this.getChar();
      return { type: TK.GEQ };
    } else {
      return { type: TK.GT };
    }
  }


  getLtOrLeq() {
    this.getChar();
    if (this.ch === CH["="]) {
      this.getChar();
      return { type: TK.LEQ };
    } else {
      return { type: TK.LT };
    }
  }


  getExclamationOrNeq() {
    this.getChar();
    if (this.ch === CH["="]) {
      this.getChar();
      return { type: TK.NEQ };
    } else {
      return { type: TK.EXCLAMATION };
    }
  }


  getAndOrDand() {
    this.getChar();
    if (this.ch === CH["&"]) {
      this.getChar();
      return { type: TK.DAND };
    } else {
      return { type: TK.AND };
    }
  }


  getOrOrDor() {
    this.getChar();
    if (this.ch === CH["|"]) {
      this.getChar();
      return { type: TK.DOR };
    } else {
      return { type: TK.OR };
    }
  }


  getDotOrEllipsis() {
    this.getChar();
    if (this.ch === CH["."]) {
      if (this.getChar() === CH["."]) {
        this.getChar();
        return { type: TK.ELLIPSIS };
      } else {
        throw new LexicalError(`".." is not valid C element`, this.line);
      }
    } else {
      return { type: TK.DOT };
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
    this.getChar();
    if (this.ch === CH["/"]) {
      while (!checkNewline(this.ch))
        this.getChar();
      return { type: TK.COMMENT };

    } else if (this.ch === CH["*"]) {
      this.toMultilineCommentEnd();
      return { type: TK.COMMENT };

    } else {
      return { type: TK.DIVIDE };
    }
  }


  getRet(retVal) {
    this.getChar();
    return retVal;
  }


  getToken() {
    while (checkSpace(this.ch))
      this.getChar();

    if (checkSymbolStart(this.ch))
      return this.getIdentifier();

    if (checkNumber(this.ch))
      return this.getNumber();

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

    if (this.ch === CH["."])
      return this.getDotOrEllipsis();

    if (this.ch === CH["/"])
      return this.getDivideOrComments();

    if (this.ch === CH["*"])
      return this.getRet({ type: TK.ASTERISK });

    if (this.ch === CH["+"])
      return this.getRet({ type: TK.PLUS });

    if (this.ch === CH["%"])
      return this.getRet({ type: TK.MOD });

    if (this.ch === CH["("])
      return this.getRet({ type: TK.OPENPA });

    if (this.ch === CH[")"])
      return this.getRet({ type: TK.CLOSEPA });

    if (this.ch === CH["["])
      return this.getRet({ type: TK.OPENBR });

    if (this.ch === CH["]"])
      return this.getRet({ type: TK.CLOSEBR });

    if (this.ch === CH["{"])
      return this.getRet({ type: TK.BEGIN });

    if (this.ch === CH["}"])
      return this.getRet({ type: TK.END });

    if (this.ch === CH[","])
      return this.getRet({ type: TK.COMMA });

    if (this.ch === CH[";"])
      return this.getRet({ type: TK.SEMICOLON });

    if (this.ch === CH["^"])
      return this.getRet({ type: TK.CARET });

    if (this.ch === CH["?"])
      return this.getRet({ type: TK.QUESTION });

    if (this.ch === CH[":"])
      return this.getRet({ type: TK.COLON });

    if (this.ch === CH["~"])
      return this.getRet({ type: TK.TILDE });

    throw new LexicalError(
      `Unexpected character: ${String.fromCharCode(this.ch)}`,
      this.line
    );
  }


  currentState() {
    return selectFields(this, [ "cursor", "line", "ch", "prevCh" ]);
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


function checkSymbolNoEnd(ch) {
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



module.exports = Reader;

