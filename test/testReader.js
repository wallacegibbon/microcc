const { EndOfFile } = require("../lib/errors");
const Reader = require("../lib/Reader");

const text = `int main(int argc, char **argv)
{
  float f = 3.1415926;
  int i = 123;
  char c = 'c';
  //$errorsym
  /*
  //char *s = "abcdefg\\hijklmn";
  printf("\"f\" is %f, and \"i\" is %d\n", f, i);
  */
  //char *s = "abcdefghijklmn";
  $errorsym
  char *s = "abcdefghijklmn
             invalid newline";
  return 0;
}
`;

const reader = new Reader(Buffer.from(text));


function testGetChar() {
  try {
    while (true) {
      reader.getChar();
      console.log(reader.currentState());
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
