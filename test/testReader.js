const { EndOfFile } = require("../lib/errors");
const Reader = require("../lib/Reader");

const text = `int test(int argc, char **argv, ...)
{
  float f1 = 3.1415926, f2 = .15;
  int i = 123;
  char c1 = 'c', c2 = '\x65';
  char *s = "abcdefg\\\\hijklmn";
  printf("\\"f\\" is %f, and \\"i\\" is %d\\n", f, i);
  //char *s = "abcdefghijklmn";
  /*
  char *s = "abcdefghijklmn
             invalid newline";
  */
  //$errorsym
  char *s = "test escape: \\x65, \\a, \\n";
  return 0;
}
`;

const reader = new Reader(Buffer.from(text));


function testGetChar() {
  try {
    while (true) {
      const stat = reader.currentState();
      console.log("line:", stat.line, ", ch:", String.fromCharCode(stat.ch));
      reader.getChar();
    }
  } catch (e) {
    if (e.constructor !== EndOfFile)
      console.log(`line ${e.line}: ${e.message}`);
  }
}


function testGetToken() {
  try {
    while (true) {
      console.log("TK:", reader.getToken());
    }
  } catch (e) {
    if (e.constructor !== EndOfFile)
      console.log(`line ${e.line}: ${e.message}`);
  }
}


//testGetChar();
testGetToken();
