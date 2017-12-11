const { EndOfFile } = require("../../lib/errors");
const Reader = require("../../lib/Reader");
const fs = require("fs");

const text = fs.readFileSync(`${__dirname}/testToken.c`);

try {
  console.log(new Reader(Buffer.from(text)).tokenize());
} catch (e) {
  console.log(`line ${e.line}: ${e.message}`);
}

