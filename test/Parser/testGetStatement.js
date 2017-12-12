const { EndOfFile } = require("../../lib/errors");
const Parser = require("../../lib/Parser");
const fs = require("fs");

const text = fs.readFileSync(`${__dirname}/a.c`);
const parser = new Parser(Buffer.from(text));

try {
  while (true)
    console.log(parser.getStatement());
} catch (e) {
  if (e.constructor !== EndOfFile)
    console.log(`line ${e.line}: ${e.message}`);
}

