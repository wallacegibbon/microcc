const { EndOfFile } = require("../../lib/errors");
const Reader = require("../../lib/Reader");
const fs = require("fs");

const text = fs.readFileSync(`${__dirname}/testToken.c`);
const reader = new Reader(Buffer.from(text));

try {
  while (true)
    console.log(reader.getToken());
} catch (e) {
  if (e.constructor !== EndOfFile)
    console.log(`line ${e.line}: ${e.message}`);
}

