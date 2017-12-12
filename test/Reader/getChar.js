const { EndOfFile } = require("../../lib/errors");
const Reader = require("../../lib/Reader");

const text = `This is line 1,
this is line 2.
`;

const reader = new Reader(Buffer.from(text));


try {
  while (true) {
    console.log("line:", reader.line, ",ch:", String.fromCharCode(reader.ch));
    reader.getChar();
  }
} catch (e) {
  if (e.constructor !== EndOfFile)
    console.log(`line ${e.line}: ${e.message}`);
}
