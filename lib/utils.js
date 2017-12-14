const { CLexicalError } = require("./errors");
const CH = require("./CH");


/**
 * e.g. selectFields({ a: 1, b: 2, c: 3 }, [ "c", "d" ]); //=> { c: 3 }
 */
function selectFields(obj, fields) {
  const result = {};
  fields.forEach(x => obj.hasOwnProperty(x) ? result[x] = obj[x] : null);
  return result;
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


function checkSymbolNotEnd(ch) {
  return checkLatin(ch) || checkDecimal(ch) || ch === CH["_"];
}


function checkLatin(ch) {
  return (ch >= CH.a && ch <= CH.z) || (ch >= CH.A && ch <= CH.Z);
}


function checkNumber(ch) {
  return checkDecimal(ch) || ch == CH["."];
}


function checkA2F(ch) {
  return (ch >= CH.a && ch <= CH.f) || (ch >= CH.A && ch <= CH.F);
}


function checkDecimal(ch) {
  return ch >= CH["0"] && ch <= CH["9"];
}


function checkOctal(ch) {
  return ch >= CH["0"] && ch <= CH["7"];
}


function checkHex(ch) {
  return checkDecimal(ch) || checkA2F(ch);
}


function hexToNum(ch) {
  if (checkDecimal(ch))
    return ch - CH["0"];
  if (ch >= CH.a && ch <= CH.f)
    return 10 + ch - CH.a;
  if (ch >= CH.A && ch <= CH.F)
    return 10 + ch - CH.A;

  throw new CLexicalError(`Invalid hex character: ${ch}`);
}


module.exports = {
  selectFields,
  checkSpace,
  checkNewline,
  checkSymbolStart,
  checkSymbolNotEnd,
  checkNumber,
  checkDecimal,
  checkOctal,
  checkHex,
  hexToNum,
};
