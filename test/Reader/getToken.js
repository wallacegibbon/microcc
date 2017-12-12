const { EndOfFile } = require("../../lib/errors");
const Reader = require("../../lib/Reader");
const fs = require("fs");

if (process.argv.length < 3)
  throw new Error("Target C file not given");

const text = fs.readFileSync(process.argv[2]);
const reader = new Reader(Buffer.from(text));

try {
  while (true)
    console.log(reader.getToken());
} catch (e) {
  if (e.constructor !== EndOfFile)
    console.log(`line ${e.line}: ${e.message}`);
}

