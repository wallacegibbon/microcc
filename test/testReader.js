const { EndOfFile } = require("../lib/errors");
const Reader = require("../lib/Reader");

const text = `Hello, this is line 1.
And this is line2.
bye~
`;

const reader = new Reader(Buffer.from(text));


try {
  while (true) {
    reader.getChar();
    console.log(reader.currentState());
  }
} catch (e) {
  if (e.constructor !== EndOfFile)
    console.log("**E:", e);
}


