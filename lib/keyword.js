const KW = require("./KW");

const kwMap = {
  "typedef": KW.TYPEDEF,
  "struct": KW.STRUCT,
  "union": KW.UNION,
  "enum": KW.ENUM,

  "static": KW.STATIC,
  "volatile": KW.VOLATILE,
  "const": KW.CONST,
  "auto": KW.AUTO,
  "extern": KW.EXTERN,

  "unsigned": KW.UNSIGNED,
  "char": KW.CHAR,
  "short": KW.SHORT,
  "int": KW.INT,
  "long": KW.LONG,
  "float": KW.FLOAT,
  "double": KW.DOUBLE,

  "void": KW.VOID,

  "if": KW.IF,
  "else": KW.ELSE,
  "switch": KW.SWITCH,
  "case": KW.CASE,

  "for": KW.FOR,
  "while": KW.WHILE,
  "do": KW.DO,
  "continue": KW.CONTINUE,
  "break": KW.BREAK,

  "return": KW.RETURN,
  "goto": KW.GOTO,

  "sizeof": KW.SIZEOF,
}


module.exports = kwMap;

