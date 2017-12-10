class Token {
  constructor(type, value, line) {
    Object.assign(this, { type, value, line });
  }
}


module.exports = Token;

